import { promises as fs } from "fs";
import path from "path";

const LanguageDefinitions = {
  "word.before": "Input",
  "word.after": "Result",
  "word.mesh": "Mesh",
  "word.uv": "UV",
};
function getLanguage() {
  return LanguageDefinitions;
}
function translate(subject) {
  return subject.replace(/[a-zA-Z_][a-zA-Z0-9_\.]+/g, (key) => {
    return getLanguage(LanguageDefinitions)[key] ?? key;
  });
}
const getURL = (e) =>
  // `http://127.0.0.1:5500/${e}`;
  `https://github.com/Malik12tree/blockbench-plugins/blob/master/src/mesh_tools/${e}?raw=true`;

function renderPill(title) {
  return `<span style="
  border: max(1px, 0.0625rem) solid var(--color-accent);
  color: var(--color-accent);
  border-radius: 2em;
  font-size: .75rem;
  font-weight: 500;
  padding: 0 7px;
  white-space: nowrap;">${title.toString().toUpperCase()}</span>`
}
function renderImage({ src, caption = "" }) {
  return `
<figure>
<img style="image-rendering: auto;object-fit:contain;width: 250px; height: 250px;min-width: 100px" src="${getURL(
    `assets/actions/${src}`
  )}" />
<figcaption>${translate(caption)}</figcaption>
</figure>
`;
}
function renderInsetRow({ items }) {
  return `
  <div style="display: flex;flex-wrap:wrap;">
      ${items
        .map(
          (e) =>
            `<div style="border: 1px solid var(--color-dark);background: var(--color-back);">${renderLine(
              e
            )}</div>`
        )
        .join("\n")}
  </div>
  `;
}
function renderLine(options) {
  if (typeof options == "string") return options;

  switch (options.type) {
    case "image":
      return renderImage(options);
    case "inset_row":
      return renderInsetRow(options);
    default:
      throw new Error(`Unknown line type: ${options.type}`);
      break;
  }
}

let lastRawActions = "";
export default {
  buildStart: async function (aa) {
    const rawActions = await fs.readFile(path.resolve("assets/actions.json"), {
      encoding: "utf-8",
    });
    if (rawActions == lastRawActions) {
      return;
    }
    lastRawActions = rawActions;
    console.log("Writing about.md!");
    const ACTIONS = JSON.parse(rawActions);
    for (const id in ACTIONS) {
      const action = ACTIONS[id];
      action.id = id;
    }

    const tableOfContents = [];
    function iter(renders, parents, node) {
      if (node == "_") return;
      if (typeof node == "string") return iter(renders, parents, ACTIONS[node]);
      if (node instanceof Array) {
        for (const child of node) {
          iter(renders, parents, child);
        }
        return;
      }

      // I'm Very aware that this anchor element doesn't behave correctly in the plugin viewer.
      tableOfContents.push(
        `<a style="padding-inline-start: ${
          24 * (parents.length - 1)
        }px" href="#mesh_tools-action-${node.id}">${getActionRaw(node)}</a>`
      );
      if (node.children) {
        parents.push(node);
        iter(renders, parents, node.children);
        parents.pop();
        return;
      }

      renders.push(`
<section id="mesh_tools-action-${node.id}">
<p>${getActionRaw(node)}</p>
<span style="display:flex;align-items:center;gap: 10px;">
Access From:
${parents.map(getActionRaw).join(getIconRaw("fas.fa-chevron-right"))}
</span>
<p>${node.description ?? ""}</p>
<div style="display:flex;flex-direction:column;gap: 5px;">
${node?.docs?.lines ? node.docs.lines.map(renderLine).join("\n") : ""}
</div>
</section>
`);
    }
    const toolsRender = [];
    const operatorsRender = [];
    const generatorsRender = [];
    iter(toolsRender, [ACTIONS.tools], ACTIONS.tools.children.slice());
    iter(
      operatorsRender,
      [ACTIONS.operators],
      ACTIONS.operators.children.slice()
    );
    iter(
      generatorsRender,
      [ACTIONS.generators],
      ACTIONS.generators.children.slice()
    );

    const content = `
<div>

This plugin adds **powerful** mesh modeling tools, operators, and generators into to your Blockbench.
By installing the plugin, you get:
<div style="display: flex;flex-direction: column;">
${tableOfContents.join("\n")}
</div>

### Modeling Tools
For applying modifications on selected vertices, edges or faces.
${toolsRender.join("\n")}

### Modeling Operators
For applying modifications on selected meshes.
${operatorsRender.join("\n")}

### Mesh Generators
For procedural mesh generation
${generatorsRender.join("\n")}

<div style="display: flex; gap: 5px;padding-top:10px">
  &minus; &nbsp; <img width="25" src="https://avatars.githubusercontent.com/u/82341209"> Malik12tree
</div>
</div>
`;
    await fs.writeFile("../../plugins/mesh_tools/about.md", content);
  },
};

function getIconRaw(icon) {
  let node;
  if (icon === undefined) {
    return `<i class="material-icons notranslate icon">help_outline</i>`;
  } else if (icon === true || icon === false) {
    return `<i class="material-icons notranslate icon">${
      icon ? "check_box" : "check_box_outline_blank"
    }</i>`;
  } else if (icon.match(/^(fa[.-])|(fa[rsb]\.)/)) {
    let classList;
    if (icon.substr(3, 1) === ".") {
      classList = [icon.substr(0, 3), icon.substr(4)];
    } else {
      classList = ["fa", icon];
    }
    return `<i class="fa_big ${classList.join(" ")}"></i>`;
  } else if (icon.substr(0, 5) === "icon-") {
    return `<i class="icon ${icon}"></i>`;
  } else if (icon.substr(0, 14) === "data:image/png") {
    return `<img src="${icon}" />`;
  } else {
    return `<i class="material-icons notranslate icon">${icon}</i>`;
  }
}
function getActionRaw(node) {
  return `<div style="display: inline-flex;align-items:center;gap: 5px;">
  ${getIconRaw(node.icon)} <b>${node.name}</b>

  ${node?.docs?.tags ? node.docs.tags.map(renderPill).join("\n") : ""}
  </div>`;
}
