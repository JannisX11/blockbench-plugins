import fs from "fs/promises";
import path from "path";
import { renderLine, renderPill } from "../src/utils/docs.js";

let lastRawActions = "";

/**
 *
 * @returns {import("esbuild").Plugin}
 */
export function aboutPlugin({ actionsPath }) {
  return {
    name: "about",
    setup: (build) => {
      build.onStart(async () => {
        const rawActions = await fs.readFile(
          path.resolve("assets/actions.json"),
          "utf8"
        );
        if (rawActions == lastRawActions) {
          return;
        }
        lastRawActions = rawActions;
        console.log("Writing about.md! ...");
        const ACTIONS = JSON.parse(rawActions);
        for (const id in ACTIONS) {
          const action = ACTIONS[id];
          action.id = id;
          if (ACTIONS[id]?.docs?.private) delete ACTIONS[id];
        }

        const tableOfContents = [];
        function iter(renders, parents, node) {
          if (node == "_") return;
          if (typeof node == "string")
            return iter(renders, parents, ACTIONS[node]);
          if (node instanceof Array) {
            for (const child of node) {
              iter(renders, parents, child);
            }
            return;
          }

          tableOfContents.push(
            `<div
        style="padding-inline-start: ${
          24 * (parents.length - 1)
        }px" >${getActionRaw(node)}</div>`
          );
          if (node.children) {
            parents.push(node);
            iter(renders, parents, node.children);
            parents.pop();
            return;
          }

          renders.push(`
<section id="mesh_tools-action-${node.id}" style="margin-top: 10px;"> 
${getActionRaw(node)}
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
      });
    },
  };
}

function updateAbout() {}

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
  const tags = node?.docs?.tags ?? [];

  if (node.docs?.flags) {
    if (node.docs.flags.deprecated)
      tags.unshift({ title: "Deprecated", color: "var(--color-error)" });
    if (node.docs.flags.experimental)
      tags.unshift({ title: "Experimental", color: "var(--color-warning)" });
    if (node.docs.flags.new)
      tags.unshift({ title: "New", color: "var(--color-confirm)" });
  }

  return `<div style="display: inline-flex;align-items:center;gap: 5px;">
  ${getIconRaw(node.icon)} <b>${node.name}</b>
  ${tags.map(renderPill).join("\n")}
  </div>`;
}
