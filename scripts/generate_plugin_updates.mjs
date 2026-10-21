import plugins from "../plugins.json" with { type: "json" }
import fs from "node:fs"

const updates = {}

for (const [id, data] of Object.entries(plugins)) {
  if (!data.version || !/^\d+\.\d+\.\d+$/.test(data.version)) {
    continue
  }

  updates[id] = {
    version: data.version
  }

  let changelog
  if (data.has_changelog && fs.existsSync(`../plugins/${id}/changelog.json`)) {
    try {
      changelog = Object.values(JSON.parse(fs.readFileSync(`../plugins/${id}/changelog.json`)))
    } catch {}
  }

  if (data.creation_date) {
    updates[id].created = Date.parse(data.creation_date) || 0
  } else if (changelog?.[0]?.date) {
    updates[id].created = Date.parse(changelog[0].date) || 0
  } else {
    updates[id].created = 0
  }

  if (changelog?.at(-1)?.date) {
    updates[id].updated = Date.parse(changelog.at(-1).date) || updates[id].created
  } else {
    updates[id].updated = updates[id].created
  }
}

fs.writeFileSync("../updates.json", JSON.stringify(updates, null, 2))