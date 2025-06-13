import plugins from "../plugins.json" with { type: "json" }
import updates from "../updates.json" with { type: "json" }
import fs from "node:fs"

const now = Date.now()

for (const [id, data] of Object.entries(plugins)) {
  if (!data.version || !/^\d+\.\d+\.\d+$/.test(data.version)) {
    continue
  }

  if (!updates[id]) {
    updates[id] = {
      version: data.version,
      created: now,
      updated: now
    }
    continue
  }

  if (data.version === updates[id].version) {
    continue
  }

  const [oMaj, oMin, oPatch] = updates[id].version.split(".").map(Number)
  const [nMaj, nMin, nPatch] = data.version.split(".").map(Number)

  const wentDown = nMaj < oMaj || (nMaj === oMaj && nMin < oMin) || (nMaj === oMaj && nMin === oMin && nPatch < oPatch)
  const onlyPatchChanged = nMaj === oMaj && nMin === oMin && nPatch !== oPatch

  if (onlyPatchChanged) {
    continue
  }

  updates[id].version = data.version

  if (wentDown) {
    continue
  }

  updates[id].updated = now
}

fs.writeFileSync("../updates.json", JSON.stringify(updates, null, 2))