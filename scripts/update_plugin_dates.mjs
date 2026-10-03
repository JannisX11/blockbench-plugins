import plugins from "../plugins.json" with { type: "json" }
import { execFileSync } from "node:child_process"
import fs from "node:fs"

const EXTENSIONS = [".js", ".ts", ".json", ".md"]

const BEFORE_SHA = process.env.BEFORE_SHA ?? process.argv[2]

function getPreviousPlugins() {
  if (!BEFORE_SHA) return null
  try {
    return JSON.parse(execFileSync("git", ["show", `${BEFORE_SHA}:plugins.json`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }))
  } catch {
    return null
  }
}

function getPluginFiles(id) {
  const files = [`../plugins/${id}.js`].filter(file => fs.existsSync(file))

  for (const directory of [`../plugins/${id}`, `../src/${id}`]) {
    if (!fs.existsSync(directory)) continue
    for (const entry of fs.readdirSync(directory, { recursive: true, withFileTypes: true })) {
      if (entry.isFile() && EXTENSIONS.some(extension => entry.name.endsWith(extension))) {
        files.push(`${entry.parentPath}/${entry.name}`)
      }
    }
  }

  return files
}

function stringify(value, indent = "") {
  if (Array.isArray(value)) {
    if (!value.length) return "[]"
    if (value.every(item => !item || typeof item !== "object")) {
      return `[${value.map(item => JSON.stringify(item)).join(", ")}]`
    }
    const inner = indent + "\t"
    return `[\n${value.map(item => inner + stringify(item, inner)).join(",\n")}\n${indent}]`
  }

  if (value && typeof value === "object") {
    const keys = Object.keys(value)
    if (!keys.length) return "{}"
    const inner = indent + "\t"
    return `{\n${keys.map(key => `${inner}${JSON.stringify(key)}: ${stringify(value[key], inner)}`).join(",\n")}\n${indent}}`
  }

  return JSON.stringify(value)
}

function setReleaseDate(id, old, date) {
  plugins[id].creation_date = date
  fs.writeFileSync("../plugins.json", stringify(plugins) + "\n")

  let changed = 0
  for (const file of getPluginFiles(id)) {
    const content = fs.readFileSync(file, "utf8")
    if (content.includes(old)) {
      fs.writeFileSync(file, content.replaceAll(old, date))
      changed++
    }
  }

  console.log(`${id}: release date ${old} -> ${date} (${changed} plugin ${changed === 1 ? "file" : "files"} updated)`)
}

function setChangelogDate(id, version, date) {
  const file = `../plugins/${id}/changelog.json`
  if (!fs.existsSync(file)) return

  const text = fs.readFileSync(file, "utf8")
  const changelog = JSON.parse(text)
  if (!changelog[version]?.date || changelog[version].date === date) return

  changelog[version].date = date

  const indent = text.match(/\n([ \t]+)"/)?.[1] ?? "  "
  fs.writeFileSync(file, JSON.stringify(changelog, null, indent) + (text.endsWith("\n") ? "\n" : ""))
  console.log(`${id}: changelog date for ${version} set to ${date}`)
}

const previous = getPreviousPlugins()
if (!previous) {
  console.log("No previous plugins.json to compare against, skipping")
  process.exit()
}

const date = new Date().toISOString().slice(0, 10)

for (const [id, data] of Object.entries(plugins)) {
  const before = previous[id]
  if (before && before.version === data.version) continue

  if (!before && data.creation_date && data.creation_date !== date) {
    setReleaseDate(id, data.creation_date, date)
  }

  if (data.version) {
    setChangelogDate(id, data.version, date)
  }
}
