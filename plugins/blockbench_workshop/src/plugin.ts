import { formatUserCode } from "@workspace/blockbench-protocol"
import { WorkshopClient } from "./client"
import { pollForToken } from "./device-flow"
import { ApiError, errorMessage } from "./errors"
import { prepareProject } from "./project"
import { DEFAULT_ORIGIN, serverOrigin, TokenStore } from "./token-store"

const VERSION = "1.0.0"
/** How long relinking waits to revoke the previous token before moving on. */
const REVOKE_TIMEOUT_MS = 5000
const EXPLANATION =
  "Your model opens on Blockbench Workshop, where you add details and publish. This plugin never publishes on its own."
let originSetting: Setting
let active: AbortController | undefined
let loaded = false
const actions: Action[] = []
const dialogs = new Set<Dialog>()

// DOM textContent keeps account names and server messages out of HTML parsing.
function paragraph(text: string): HTMLParagraphElement {
  const node = document.createElement("p")
  node.textContent = text
  return node
}

function notice(title: string, message: string, offerLink = false): void {
  const dialog = new Dialog({
    id: "blockbench_workshop_notice",
    title,
    lines: [paragraph(message)],
    buttons: offerLink ? ["Link account", "Close"] : ["Close"],
    onConfirm() {
      if (offerLink) run(linkAccount)
    },
    onClose() {
      dialogs.delete(dialog)
    },
  })
  dialogs.add(dialog)
  dialog.show()
}

function cancelActive(): void {
  active?.abort()
  for (const dialog of dialogs) dialog.delete()
  dialogs.clear()
}

const SERVER_SETTING = "blockbench_workshop_server"

function connection(): { client: WorkshopClient; tokens: TokenStore } {
  // Read through the registry at click time, never a captured Setting: if the
  // plugin is loaded twice, the registry holds the instance the user edits.
  const origin = serverOrigin(String(Settings.get(SERVER_SETTING)))
  const tokens = new TokenStore(localStorage, origin)
  return {
    client: new WorkshopClient(origin, tokens, fetch.bind(globalThis)),
    tokens,
  }
}

// Lock synchronously, before the first await: double clicks cannot send twice.
function run(
  work: (
    client: WorkshopClient,
    tokens: TokenStore,
    signal: AbortSignal
  ) => Promise<void>
): void {
  if (active || !loaded) return
  const controller = new AbortController()
  active = controller
  void (async () => {
    try {
      const { client, tokens } = connection()
      await work(client, tokens, controller.signal)
    } catch (error) {
      if (!controller.signal.aborted && loaded) {
        notice(
          "Blockbench Workshop",
          errorMessage(error),
          error instanceof ApiError && error.body.error === "invalid_token"
        )
      }
    } finally {
      if (active === controller) active = undefined
    }
  })()
}

async function linkAccount(
  client: WorkshopClient,
  tokens: TokenStore,
  signal: AbortSignal
): Promise<void> {
  const code = paragraph("Requesting a link code…")
  const instructions = paragraph(
    "Approve this code in your browser. Keep this dialog open while linking."
  )
  const reopen = document.createElement("button")
  reopen.textContent = "Open approval page again"
  reopen.disabled = true
  const dialog = new Dialog({
    id: "blockbench_workshop_link",
    title: "Link Blockbench Workshop",
    lines: [code, instructions, reopen, paragraph(EXPLANATION)],
    buttons: ["Cancel"],
    onClose() {
      active?.abort()
      dialogs.delete(dialog)
    },
  })
  dialogs.add(dialog)
  dialog.show()
  try {
    const device = await client.device(
      { client: Blockbench.isWeb ? "web" : "desktop", pluginVersion: VERSION },
      signal
    )
    signal.throwIfAborted()
    const url = client.websiteUrl(device.verificationUriComplete)
    code.textContent = formatUserCode(device.userCode)
    code.style.cssText =
      "font-family: monospace; font-size: 1.8em; font-weight: bold; letter-spacing: 0.15em; text-align: center; margin: 0.4em 0"
    instructions.textContent = `Compare this code with the one in your browser, then approve. You can also visit ${client.websiteUrl(device.verificationUri)}.`
    reopen.disabled = false
    reopen.onclick = () => Blockbench.openLink(url)
    Blockbench.openLink(url)
    const result = await pollForToken(
      device,
      (pollSignal) =>
        client.token({ deviceCode: device.deviceCode }, pollSignal),
      signal
    )
    signal.throwIfAborted()
    const previousToken = tokens.get()
    tokens.set(result.accessToken)
    if (previousToken && previousToken !== result.accessToken) {
      // Best effort and bounded: a failed or stalled revocation must not undo
      // the new link or hold the dialog open. The old link can still be
      // revoked from Workshop settings.
      const bounded = new AbortController()
      const stop = () => bounded.abort()
      signal.addEventListener("abort", stop, { once: true })
      const timer = setTimeout(stop, REVOKE_TIMEOUT_MS)
      try {
        await client.revokeToken(previousToken, bounded.signal)
      } catch {
        // Already explained above; the new token is stored either way.
      } finally {
        clearTimeout(timer)
        signal.removeEventListener("abort", stop)
      }
    }
    signal.throwIfAborted()
    dialog.hide()
    notice(
      "Account linked",
      `Linked to ${result.account.name}${result.account.handle ? ` (@${result.account.handle})` : ""}. ${EXPLANATION}`
    )
  } finally {
    dialog.delete()
    dialogs.delete(dialog)
  }
}

async function sendProject(
  client: WorkshopClient,
  _tokens: TokenStore,
  signal: AbortSignal
): Promise<void> {
  if (typeof Project === "undefined" || !Project)
    throw new Error("Open a project before sending it to Blockbench Workshop.")
  const { bytes, fileName } = prepareProject(
    Codecs.project.compile(),
    Project.name
  )
  const result = await client.handoff(bytes, fileName, signal)
  signal.throwIfAborted()
  const url = client.websiteUrl(result.openUrl)
  const dialog = new Dialog({
    id: "blockbench_workshop_sent",
    title: "Your model is on Blockbench Workshop",
    lines: [paragraph(EXPLANATION)],
    buttons: ["Open upload page", "Close"],
    onConfirm() {
      // A click supplies the user activation browsers require for a new tab.
      Blockbench.openLink(url)
    },
    onClose() {
      dialogs.delete(dialog)
    },
  })
  dialogs.add(dialog)
  dialog.show()
  if (!Blockbench.isWeb) Blockbench.openLink(url)
}

BBPlugin.register("blockbench_workshop", {
  title: "Blockbench Workshop",
  author: "Blockbench Workshop",
  version: VERSION,
  description:
    "Link your Workshop account and send the open project to the upload page.",
  // Kept equal to this plugin's entry in the plugin repository's plugins.json,
  // which its validator checks. The about text lives in about.md.
  icon: "icon.svg",
  variant: "both",
  min_version: "4.8.0",
  website: "https://blockbenchworkshop.com",
  tags: ["Utility", "Sharing"],
  onload() {
    loaded = true
    originSetting = new Setting(SERVER_SETTING, {
      name: "Blockbench Workshop server",
      type: "text",
      value: DEFAULT_ORIGIN,
      description:
        "Server origin. Use http://localhost:3000 for local development. Accounts are linked separately for each server.",
      onChange() {
        cancelActive()
      },
    })
    const link = new Action("blockbench_workshop_link", {
      name: "Link account…",
      icon: "link",
      click() {
        run(linkAccount)
      },
    })
    const send = new Action("blockbench_workshop_send", {
      name: "Send to Blockbench Workshop",
      icon: "cloud_upload",
      description: EXPLANATION,
      condition: () => typeof Project !== "undefined" && !!Project && !active,
      click() {
        run(sendProject)
      },
    })
    const account = new Action("blockbench_workshop_account", {
      name: "Linked account…",
      icon: "account_circle",
      click() {
        run(async (client, tokens, signal) => {
          if (!tokens.get()) {
            notice(
              "Blockbench Workshop",
              "No account is linked to this server.",
              true
            )
            return
          }
          const result = await client.account(signal)
          signal.throwIfAborted()
          notice(
            "Linked account",
            `${result.name}${result.handle ? ` (@${result.handle})` : ""}. ${EXPLANATION}`
          )
        })
      },
    })
    const signOut = new Action("blockbench_workshop_sign_out", {
      name: "Sign out",
      icon: "logout",
      click() {
        run(async (client, tokens, signal) => {
          if (!tokens.get()) {
            notice(
              "Blockbench Workshop",
              "No account is linked to this server."
            )
            return
          }
          try {
            await client.signOut(signal)
          } catch (error) {
            signal.throwIfAborted()
            notice(
              "Signed out locally",
              `${errorMessage(error)} The token was removed from Blockbench. You can revoke it in Workshop settings.`
            )
            return
          }
          signal.throwIfAborted()
          notice("Blockbench Workshop", "Signed out of this Blockbench.")
        })
      },
    })
    const menu = new Action("blockbench_workshop_menu", {
      name: "Blockbench Workshop",
      icon: "cloud_upload",
      children: [send, link, account, signOut],
      click() {},
    })
    actions.push(menu, send, link, account, signOut)
    MenuBar.addAction(menu, "file")
  },
  onunload() {
    loaded = false
    cancelActive()
    MenuBar.removeAction("file.blockbench_workshop_menu")
    for (const action of actions) action.delete()
    actions.length = 0
    originSetting.delete()
  },
})
