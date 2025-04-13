import { action } from "../actions.js";
import { TerrainGen } from "../utils/terrain_gen.js";
import { parseRGB, gradient256 } from "../utils/utils.js";

// wtf.
// TODO clean the code.
export default action("terrainse", () => {
  let customStyle;
  new Dialog({
    title: "Terrain Generator Style Editor",
    buttons: ["Save", "Cancel"],
    confirmEnabled: false,
    cancelIndex: 1,
    width: 650,
    onButton(i) {
      if (i == 0) {
        localStorage.setItem("mt_customStyle", JSON.stringify(customStyle));
      }
    },
    lines: [
      `
						  <style>
							  .tgseLevel {
								  background-color: var(--color-back);
								  border-top: 2px solid var(--color-ui);
								  cursor: move;
								  padding: 5px;
							  }
							  #tgse_levels{
								  max-height: 250px;
								  overflow-y: auto;
							  }
						  </style>
						  <div class="dialog_bar form_bar form_bar_t">
							  <label class="name_space_left">Result: </label>
							  <canvas id="tgseCanvas" style="background:white" width="256", height="25"></canvas>
						  </div>
						  <div class="dialog_bar form_bar form_bar_t"> <button id="tgse_addlevel"><b>+</b> Add level</button> </div>
						  <ul id="tgse_levels" class="ui-sortable">
						  </ul>
						  `,
    ],
  }).show();
  /**
   * @type HTMLCanvasElement
   */
  let canvas = $("#tgseCanvas")[0];
  let ctx = canvas.getContext("2d");
  // UI PART
  let c = function (s) {
    return $(document.createElement(s));
  };
  $("#tgse_levels").sortable({
    stop() {
      comuteMTStyle();
    },
  });
  $("#tgse_addlevel")[0].onclick = function (v, col, b, t = true) {
    let level = c("li");
    let deleteBtn = c("span").append(
      `<i class="material-icons icon tool" style="float:right">delete</i>`
    );
    let color = new ColorPicker({
      label: false,
      name: "Color",
      private: true,
      color: col || "#fff",
    });
    color.jq.spectrum({
      preferredFormat: "hex",
      color: col || "#fff",
      showinput: true,
      maxSelectionSize: 128,
      resetText: tl("generic.reset"),
      cancelText: tl("dialog.cancel"),
      chooseText: tl("dialog.confirm"),
      // !! EVERYTHING !!
      hide: function () {
        comuteMTStyle();
      },
      change: function () {
        comuteMTStyle();
      },
      move: function () {
        comuteMTStyle();
      },
    });
    let height = c("input")
      .attr({
        type: "number",
        min: 0,
        max: 100,
        step: 0.5,
        value: typeof v == "number" ? v : 100,
      })
      .addClass("dark_bordered focusable_input");
    let blending = c("input")
      .attr({
        type: "number",
        min: 0,
        max: 100,
        step: 0.5,
        value: typeof b == "number" ? b : 100,
      })
      .addClass("dark_bordered focusable_input");

    height[0].oninput = function () {
      comuteMTStyle();
    };
    blending[0].oninput = function () {
      comuteMTStyle();
    };
    deleteBtn[0].onclick = function () {
      ctx.clearRect(0, 0, 256, 25);
      level.remove();
      comuteMTStyle();
    };
    level
      .addClass("tgseLevel")
      .append(deleteBtn)
      .append(color.getNode())
      .append("&nbsp;&nbsp;")
      .append(c("label").text("At height percent of: "))
      .append("&nbsp;&nbsp;")
      .append(height)
      .append("&nbsp;&nbsp;")
      .append(c("label").text("With blending as: "))
      .append("&nbsp;&nbsp;")
      .append(blending);

    $("#tgse_levels").append(level[0]);
    if (t) {
      comuteMTStyle();
    }
  };
  let cs = localStorage.mt_customStyle;
  if (cs) {
    let custom = JSON.parse(cs);
    custom.forEach((h) => {
      $("#tgse_addlevel")[0].onclick(h.height * 100, h.col, h.blend * 100);
    });
  } else {
    $("#tgse_addlevel")[0].onclick(0, "#f00", 0, false);
    $("#tgse_addlevel")[0].onclick(50, "#0f0", 100, false);
    $("#tgse_addlevel")[0].onclick(100, "#00f", 100);
  }

  // COMPILING part

  function comuteMTStyle() {
    let children = $("#tgse_levels").children();
    customStyle = [];
    const l = children.length;
    for (let i = 0; i < l; i++) {
      const child = children.eq(i);
      const childChildren = child.children();

      let currentHeight = childChildren.eq(3).val() * 1;
      let currentBlend = childChildren.eq(5).val() * 1;
      let currentColor = childChildren
        .find(".sp-preview-inner")
        .css("background-color");
      customStyle.push({
        height: currentHeight / 100,
        col: currentColor,
        color: parseRGB(currentColor),
        blend: currentBlend / 100,
      });
    }
    // !uneffiecent code ahead!
    let image = new Image(256, 1);
    image.src = TerrainGen.genTexture(256, 1, gradient256, customStyle, false);
    image.onload = function () {
      ctx.drawImage(image, 0, 0, 256, 25);
    };
  }
});
