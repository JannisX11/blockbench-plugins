// Blockbench Workshop plugin. Readable bundle of src/: run `npm install && npm run build` there to rebuild it.
(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // protocol.ts
  var ROOT = "/api/blockbench/v1";
  var BLOCKBENCH_API = {
    /** POST DeviceStartRequest → DeviceStartResponse. Unauthenticated. */
    device: `${ROOT}/device`,
    /**
     * POST TokenRequest → TokenResponse (poll until approved).
     * DELETE with the bearer token → 204 (sign out of this Blockbench).
     */
    token: `${ROOT}/token`,
    /** GET with the bearer token → LinkedAccount. */
    account: `${ROOT}/account`,
    /**
     * POST with the bearer token. The body is the raw .bbmodel bytes with
     * Content-Type HANDOFF_CONTENT_TYPE and a Content-Length. The optional
     * HANDOFF_FILE_NAME_HEADER carries the URI-encoded file name.
     * → 201 HandoffResponse.
     */
    handoffs: `${ROOT}/handoffs`
  };
  var HANDOFF_FILE_NAME_HEADER = "X-BBW-File-Name";
  var HANDOFF_CONTENT_TYPE = "application/octet-stream";
  var HANDOFF_MAX_BYTES = 25 * 1024 * 1024;
  var HANDOFF_FILE_NAME_MAX_LENGTH = 120;
  var DEVICE_CODE_TTL_SECONDS = 10 * 60;
  var POLL_INTERVAL_SECONDS = 5;
  var USER_CODE_LENGTH = 8;
  function formatUserCode(code) {
    const plain = code.replace(/-/g, "");
    return `${plain.slice(0, USER_CODE_LENGTH / 2)}-${plain.slice(USER_CODE_LENGTH / 2)}`;
  }
  __name(formatUserCode, "formatUserCode");

  // errors.ts
  var ApiError = class extends Error {
    constructor(body, status) {
      super(body.message);
      this.body = body;
      this.status = status;
      this.name = "ApiError";
    }
    body;
    status;
    static {
      __name(this, "ApiError");
    }
  };
  function errorMessage(error) {
    if (error instanceof ApiError && error.body.error === "invalid_token") {
      return "Your Blockbench Workshop link has expired or was revoked. Link your account again.";
    }
    if (error instanceof TypeError)
      return "Could not reach Blockbench Workshop. Check your connection and server setting, then try again.";
    return error instanceof Error ? error.message : "Blockbench Workshop could not complete the request. Please try again.";
  }
  __name(errorMessage, "errorMessage");

  // project.ts
  function checkSize(bytes) {
    if (bytes > HANDOFF_MAX_BYTES)
      throw new Error(
        `This model is too large. Blockbench Workshop accepts up to ${HANDOFF_MAX_BYTES / 1024 / 1024} MB.`
      );
  }
  __name(checkSize, "checkSize");
  function prepareProject(compiled, name) {
    if (typeof compiled !== "string")
      throw new Error(
        "Blockbench could not compile this project as a .bbmodel file."
      );
    const bytes = new TextEncoder().encode(compiled);
    checkSize(bytes.byteLength);
    const stem = (name?.trim() || "Untitled").replace(/\.bbmodel$/i, "").replace(/[/\\:*?"<>|\x00-\x1f]/g, "_");
    const limit = HANDOFF_FILE_NAME_MAX_LENGTH - ".bbmodel".length;
    let truncated = "";
    for (const point of stem) {
      if (truncated.length + point.length > limit) break;
      truncated += point;
    }
    return { bytes, fileName: `${truncated}.bbmodel` };
  }
  __name(prepareProject, "prepareProject");

  // token-store.ts
  var DEFAULT_ORIGIN = "https://blockbenchworkshop.com";
  function serverOrigin(value) {
    const url = new URL(value.trim());
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.protocol !== "https:" && !(local && url.protocol === "http:") || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      throw new Error(
        "Enter an HTTPS server origin, or HTTP localhost for development (no path or credentials)."
      );
    }
    return url.origin;
  }
  __name(serverOrigin, "serverOrigin");
  var TokenStore = class {
    constructor(storage, origin) {
      this.storage = storage;
      this.key = `blockbench_workshop:token:${encodeURIComponent(serverOrigin(origin))}`;
    }
    storage;
    static {
      __name(this, "TokenStore");
    }
    key;
    get() {
      return this.storage.getItem(this.key);
    }
    set(token) {
      this.storage.setItem(this.key, token);
    }
    clear() {
      this.storage.removeItem(this.key);
    }
  };

  // client.ts
  var WorkshopClient = class {
    constructor(origin, tokens, fetcher) {
      this.tokens = tokens;
      this.fetcher = fetcher;
      this.origin = serverOrigin(origin);
    }
    tokens;
    fetcher;
    static {
      __name(this, "WorkshopClient");
    }
    origin;
    async request(path, init, authenticated = false) {
      const headers = new Headers(init.headers);
      const token = authenticated ? this.tokens.get() : null;
      if (authenticated) {
        if (!token)
          throw new ApiError(
            { error: "invalid_token", message: "Link your account first." },
            401
          );
        headers.set("Authorization", `Bearer ${token}`);
      }
      const response = await this.fetcher(this.origin + path, {
        ...init,
        headers,
        credentials: "omit",
        redirect: "error"
      });
      if (!response.ok) {
        let body;
        try {
          const value = await response.json();
          if (!value || typeof value !== "object" || !("error" in value) || !("message" in value) || typeof value.error !== "string" || typeof value.message !== "string")
            throw new Error("Invalid error response");
          body = value;
        } catch {
          body = {
            error: "unavailable",
            message: `Blockbench Workshop returned HTTP ${response.status}. Please try again.`
          };
        }
        if (body.error === "invalid_token" && token && this.tokens.get() === token)
          this.tokens.clear();
        throw new ApiError(body, response.status);
      }
      if (response.status === 204) return void 0;
      return await response.json();
    }
    device(body, signal) {
      return this.request(BLOCKBENCH_API.device, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal
      });
    }
    token(body, signal) {
      return this.request(BLOCKBENCH_API.token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal
      });
    }
    account(signal) {
      return this.request(BLOCKBENCH_API.account, { method: "GET", signal }, true);
    }
    revokeToken(token, signal) {
      return this.request(BLOCKBENCH_API.token, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        signal
      });
    }
    async signOut(signal) {
      try {
        await this.request(
          BLOCKBENCH_API.token,
          { method: "DELETE", signal },
          true
        );
      } finally {
        this.tokens.clear();
      }
    }
    handoff(bytes, fileName, signal) {
      checkSize(bytes.byteLength);
      return this.request(
        BLOCKBENCH_API.handoffs,
        {
          method: "POST",
          signal,
          headers: {
            "Content-Type": HANDOFF_CONTENT_TYPE,
            [HANDOFF_FILE_NAME_HEADER]: encodeURIComponent(fileName)
          },
          body: bytes
        },
        true
      );
    }
    websiteUrl(value) {
      const url = new URL(value);
      if (url.origin !== this.origin || url.username || url.password)
        throw new Error(
          "Blockbench Workshop returned a link to an unexpected server."
        );
      return url.href;
    }
  };

  // device-flow.ts
  var pollClock = {
    now: /* @__PURE__ */ __name(() => Date.now(), "now"),
    timeout: /* @__PURE__ */ __name((callback, milliseconds) => {
      const timer = setTimeout(callback, milliseconds);
      return () => clearTimeout(timer);
    }, "timeout"),
    sleep: /* @__PURE__ */ __name((milliseconds, signal) => new Promise((resolve, reject) => {
      signal.throwIfAborted();
      const abort = /* @__PURE__ */ __name(() => {
        clearTimeout(timer);
        reject(new DOMException("Linking cancelled.", "AbortError"));
      }, "abort");
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", abort);
        resolve();
      }, milliseconds);
      signal.addEventListener("abort", abort, { once: true });
    }), "sleep")
  };
  async function pollForToken(device, request, signal, clock = pollClock) {
    const deadline = clock.now() + device.expiresIn * 1e3;
    let interval = Math.max(device.interval, POLL_INTERVAL_SECONDS) * 1e3;
    const expired = /* @__PURE__ */ __name(() => new ApiError(
      {
        error: "expired_token",
        message: "This link code expired. Link your account again to get a new code."
      },
      400
    ), "expired");
    while (true) {
      signal.throwIfAborted();
      if (clock.now() >= deadline) throw expired();
      await clock.sleep(Math.min(interval, deadline - clock.now()), signal);
      signal.throwIfAborted();
      if (clock.now() >= deadline) throw expired();
      const controller = new AbortController();
      const cancel = /* @__PURE__ */ __name(() => controller.abort(signal.reason), "cancel");
      signal.addEventListener("abort", cancel, { once: true });
      let clearDeadline = /* @__PURE__ */ __name(() => {
      }, "clearDeadline");
      const timeout = new Promise((_resolve, reject) => {
        clearDeadline = clock.timeout(() => {
          reject(expired());
          controller.abort();
        }, deadline - clock.now());
      });
      try {
        const result = await Promise.race([request(controller.signal), timeout]);
        signal.throwIfAborted();
        return result;
      } catch (error) {
        signal.throwIfAborted();
        if (!(error instanceof ApiError)) throw error;
        if (error.body.error === "slow_down") {
          interval = Math.max(
            interval + POLL_INTERVAL_SECONDS * 1e3,
            (error.body.retryAfter ?? 0) * 1e3
          );
        } else if (error.body.error !== "authorization_pending") throw error;
      } finally {
        clearDeadline();
        signal.removeEventListener("abort", cancel);
      }
    }
  }
  __name(pollForToken, "pollForToken");

  // plugin.ts
  var VERSION = "1.0.0";
  var REVOKE_TIMEOUT_MS = 5e3;
  var EXPLANATION = "Your model opens on Blockbench Workshop, where you add details and publish. This plugin never publishes on its own.";
  var originSetting;
  var active;
  var loaded = false;
  var actions = [];
  var dialogs = /* @__PURE__ */ new Set();
  function paragraph(text) {
    const node = document.createElement("p");
    node.textContent = text;
    return node;
  }
  __name(paragraph, "paragraph");
  function notice(title, message, offerLink = false) {
    const dialog = new Dialog({
      id: "blockbench_workshop_notice",
      title,
      lines: [paragraph(message)],
      buttons: offerLink ? ["Link account", "Close"] : ["Close"],
      onConfirm() {
        if (offerLink) run(linkAccount);
      },
      onClose() {
        dialogs.delete(dialog);
      }
    });
    dialogs.add(dialog);
    dialog.show();
  }
  __name(notice, "notice");
  function cancelActive() {
    active?.abort();
    for (const dialog of dialogs) dialog.delete();
    dialogs.clear();
  }
  __name(cancelActive, "cancelActive");
  var SERVER_SETTING = "blockbench_workshop_server";
  function connection() {
    const origin = serverOrigin(String(Settings.get(SERVER_SETTING)));
    const tokens = new TokenStore(localStorage, origin);
    return {
      client: new WorkshopClient(origin, tokens, fetch.bind(globalThis)),
      tokens
    };
  }
  __name(connection, "connection");
  function run(work) {
    if (active || !loaded) return;
    const controller = new AbortController();
    active = controller;
    void (async () => {
      try {
        const { client, tokens } = connection();
        await work(client, tokens, controller.signal);
      } catch (error) {
        if (!controller.signal.aborted && loaded) {
          notice(
            "Blockbench Workshop",
            errorMessage(error),
            error instanceof ApiError && error.body.error === "invalid_token"
          );
        }
      } finally {
        if (active === controller) active = void 0;
      }
    })();
  }
  __name(run, "run");
  async function linkAccount(client, tokens, signal) {
    const code = paragraph("Requesting a link code\u2026");
    const instructions = paragraph(
      "Approve this code in your browser. Keep this dialog open while linking."
    );
    const reopen = document.createElement("button");
    reopen.textContent = "Open approval page again";
    reopen.disabled = true;
    const dialog = new Dialog({
      id: "blockbench_workshop_link",
      title: "Link Blockbench Workshop",
      lines: [code, instructions, reopen, paragraph(EXPLANATION)],
      buttons: ["Cancel"],
      onClose() {
        active?.abort();
        dialogs.delete(dialog);
      }
    });
    dialogs.add(dialog);
    dialog.show();
    try {
      const device = await client.device(
        { client: Blockbench.isWeb ? "web" : "desktop", pluginVersion: VERSION },
        signal
      );
      signal.throwIfAborted();
      const url = client.websiteUrl(device.verificationUriComplete);
      code.textContent = formatUserCode(device.userCode);
      code.style.cssText = "font-family: monospace; font-size: 1.8em; font-weight: bold; letter-spacing: 0.15em; text-align: center; margin: 0.4em 0";
      instructions.textContent = `Compare this code with the one in your browser, then approve. You can also visit ${client.websiteUrl(device.verificationUri)}.`;
      reopen.disabled = false;
      reopen.onclick = () => Blockbench.openLink(url);
      Blockbench.openLink(url);
      const result = await pollForToken(
        device,
        (pollSignal) => client.token({ deviceCode: device.deviceCode }, pollSignal),
        signal
      );
      signal.throwIfAborted();
      const previousToken = tokens.get();
      tokens.set(result.accessToken);
      if (previousToken && previousToken !== result.accessToken) {
        const bounded = new AbortController();
        const stop = /* @__PURE__ */ __name(() => bounded.abort(), "stop");
        signal.addEventListener("abort", stop, { once: true });
        const timer = setTimeout(stop, REVOKE_TIMEOUT_MS);
        try {
          await client.revokeToken(previousToken, bounded.signal);
        } catch {
        } finally {
          clearTimeout(timer);
          signal.removeEventListener("abort", stop);
        }
      }
      signal.throwIfAborted();
      dialog.hide();
      notice(
        "Account linked",
        `Linked to ${result.account.name}${result.account.handle ? ` (@${result.account.handle})` : ""}. ${EXPLANATION}`
      );
    } finally {
      dialog.delete();
      dialogs.delete(dialog);
    }
  }
  __name(linkAccount, "linkAccount");
  async function sendProject(client, _tokens, signal) {
    if (typeof Project === "undefined" || !Project)
      throw new Error("Open a project before sending it to Blockbench Workshop.");
    const { bytes, fileName } = prepareProject(
      Codecs.project.compile(),
      Project.name
    );
    const result = await client.handoff(bytes, fileName, signal);
    signal.throwIfAborted();
    const url = client.websiteUrl(result.openUrl);
    const dialog = new Dialog({
      id: "blockbench_workshop_sent",
      title: "Your model is on Blockbench Workshop",
      lines: [paragraph(EXPLANATION)],
      buttons: ["Open upload page", "Close"],
      onConfirm() {
        Blockbench.openLink(url);
      },
      onClose() {
        dialogs.delete(dialog);
      }
    });
    dialogs.add(dialog);
    dialog.show();
    if (!Blockbench.isWeb) Blockbench.openLink(url);
  }
  __name(sendProject, "sendProject");
  BBPlugin.register("blockbench_workshop", {
    title: "Blockbench Workshop",
    author: "Blockbench Workshop",
    version: VERSION,
    description: "Link your Workshop account and send the open project to the upload page.",
    // Kept equal to this plugin's entry in the plugin repository's plugins.json,
    // which its validator checks. The about text lives in about.md.
    icon: "icon.svg",
    variant: "both",
    min_version: "4.8.0",
    website: "https://blockbenchworkshop.com",
    tags: ["Utility", "Sharing"],
    onload() {
      loaded = true;
      originSetting = new Setting(SERVER_SETTING, {
        name: "Blockbench Workshop server",
        type: "text",
        value: DEFAULT_ORIGIN,
        description: "Server origin. Use http://localhost:3000 for local development. Accounts are linked separately for each server.",
        onChange() {
          cancelActive();
        }
      });
      const link = new Action("blockbench_workshop_link", {
        name: "Link account\u2026",
        icon: "link",
        click() {
          run(linkAccount);
        }
      });
      const send = new Action("blockbench_workshop_send", {
        name: "Send to Blockbench Workshop",
        icon: "cloud_upload",
        description: EXPLANATION,
        condition: /* @__PURE__ */ __name(() => typeof Project !== "undefined" && !!Project && !active, "condition"),
        click() {
          run(sendProject);
        }
      });
      const account = new Action("blockbench_workshop_account", {
        name: "Linked account\u2026",
        icon: "account_circle",
        click() {
          run(async (client, tokens, signal) => {
            if (!tokens.get()) {
              notice(
                "Blockbench Workshop",
                "No account is linked to this server.",
                true
              );
              return;
            }
            const result = await client.account(signal);
            signal.throwIfAborted();
            notice(
              "Linked account",
              `${result.name}${result.handle ? ` (@${result.handle})` : ""}. ${EXPLANATION}`
            );
          });
        }
      });
      const signOut = new Action("blockbench_workshop_sign_out", {
        name: "Sign out",
        icon: "logout",
        click() {
          run(async (client, tokens, signal) => {
            if (!tokens.get()) {
              notice(
                "Blockbench Workshop",
                "No account is linked to this server."
              );
              return;
            }
            try {
              await client.signOut(signal);
            } catch (error) {
              signal.throwIfAborted();
              notice(
                "Signed out locally",
                `${errorMessage(error)} The token was removed from Blockbench. You can revoke it in Workshop settings.`
              );
              return;
            }
            signal.throwIfAborted();
            notice("Blockbench Workshop", "Signed out of this Blockbench.");
          });
        }
      });
      const menu = new Action("blockbench_workshop_menu", {
        name: "Blockbench Workshop",
        icon: "cloud_upload",
        children: [send, link, account, signOut],
        click() {
        }
      });
      actions.push(menu, send, link, account, signOut);
      MenuBar.addAction(menu, "file");
    },
    onunload() {
      loaded = false;
      cancelActive();
      MenuBar.removeAction("file.blockbench_workshop_menu");
      for (const action of actions) action.delete();
      actions.length = 0;
      originSetting.delete();
    }
  });
})();
