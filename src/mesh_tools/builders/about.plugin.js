import { promises as fs } from "fs";
import { ACTIONS } from "../src/actions.js";

export default {
  buildStart: async function () {
    const getURL = e => "https://github.com/Malik12tree/blockbench-plugins/blob/master/src/mesh_tools/" + e + "?raw=true";

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
<div style="display:flex;align-items:center;gap: 10px;flex-wrap: wrap;">
${
  node?.docs?.images
    ? node.docs.images
        .map(
          ({ src, caption = "" }) =>
            `<figure>
<img style="image-rendering: auto;object-fit:contain;width: 250px; height: 250px;" src="${getURL(`assets/actions/${src}`)}" />
<figcaption>${caption}</figcaption>
</figure>`
        )
        .join("\n")
    : ""
}
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
This plugin adds **powerful** mesh modeling tools, operators, and generators into to your Blockbench.
By installing the plugin, you get:
<div style="display: flex;flex-direction: column;">
${tableOfContents.join("")}
</div>

### Modeling Tools
For applying modifications on selected vertices, edges or faces. (accessed from the mesh menu)
${toolsRender.join("")}

### Modeling Operators
For applying modifications on selected meshes. (accessed from the mesh menu)
${operatorsRender.join("")}

### Mesh Generators
For procedural mesh generation (accessed from the tools menu)
${generatorsRender.join("")}

&minus; &nbsp; <img width="25" src="https://avatars.githubusercontent.com/u/82341209?v=4"> Malik12tree
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
  </div>`;
}
