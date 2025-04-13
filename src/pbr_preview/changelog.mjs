import readline from "node:readline/promises";
import { writeFile, readFile } from "node:fs/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const changelog = "./plugins/pbr_preview/changelog.json";

function createChangelog(version, changes, author, title = null, date = null) {
  const changelog = {
    [version.toString()]: {
      title: title ?? `Version ${version}`,
      date: date || new Date().toISOString().split("T")[0],
      author,
      categories: [],
    },
  };

  for (const change of changes) {
    changelog[version].categories.push({
      title: "",
      list: [],
      ...change,
    });
  }

  return changelog;
}

async function amendChangelog(
  version,
  changes,
  author,
  title = null,
  date = null,
) {
  const data = JSON.parse(await readFile(changelog, "utf-8"));
  const newChangelog = createChangelog(version, changes, author, title, date);
  const mergedChangelog = { ...data, ...newChangelog };

  await writeFile(changelog, JSON.stringify(mergedChangelog, null, 4));
}

async function main() {
  const version = await rl.question("Enter the version number: ");
  const author = await rl.question("Enter the author: ");
  const title = await rl.question(
    "Enter the title (leave blank for default): ",
  );

  const changes = [];
  let makingChanges = true;
  let writingDescriptions = false;

  while (makingChanges) {
    const change = await rl.question(
      "Enter a change title (leave blank to exit): ",
    );

    makingChanges = change.length > 0;

    if (!makingChanges) {
      break;
    }

    const descriptions = [];
    writingDescriptions = true;

    while (writingDescriptions) {
      const description = await rl.question(
        "Enter a description (leave blank to finish): ",
      );

      writingDescriptions = description.length > 0;

      if (!writingDescriptions) {
        break;
      }

      descriptions.push(description);
    }

    changes.push({
      title: change,
      list: descriptions,
    });
  }

  await amendChangelog(
    version,
    changes,
    author,
    title ?? `Version ${version}`,
    new Date().toISOString().split("T")[0],
  );
}

main()
  .then(() => {
    console.log("Changelog updated!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
