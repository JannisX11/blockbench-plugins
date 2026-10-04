let styles, collapsed
const id = "collapsible_start_screen_categories"
const name = "Collapsible Start Screen Categories"
const icon = "chevron_right"
const author = "Ewan Howell"
const E = s => $(document.createElement(s))
Plugin.register(id, {
  title: name,
  icon,
  author,
  description: "Add the ability to collapse the start screen categories.",
  tags: ["Start screen", "Menu", "Formats"],
  version: "1.1.0",
  min_version: "4.8.0",
  variant: "both",
  website: "https://ewanhowell.com/",
  has_changelog: true,
  onuninstall: () => localStorage.removeItem("format_category_collapsed"),
  onload() {
    styles = Blockbench.addCSS(`
      .format_category {
        position: relative;
      }
      .format_category_dropdown {
        position: absolute;
        top: 2px;
        right: 8px;
        cursor: pointer;
        color: var(--color-subtle_text);
      }
      .format_category_dropdown:hover {
        color: var(--color-text);
      }
      .format_category_collapsed ul {
        display: none;
      }
      .format_category i {
        transition: transform .15s;
      }
      .format_category_collapsed i {
        transform: rotateZ(-90deg);
      }
    `)
    collapsed = JSON.parse(localStorage.getItem("format_category_collapsed") ?? "[]")
    addDropDowns()
    Blockbench.on("construct_format", addDropDowns)
    Blockbench.on("construct_model_loader", addDropDowns)
  },
  onunload() {
    Blockbench.removeListener("construct_format", addDropDowns)
    Blockbench.removeListener("construct_model_loader", addDropDowns)
    styles.delete()
    $(".format_category").removeClass("format_category_collapsed")
    $(".format_category_dropdown").remove()
  }
})
function addDropDowns() {
  setTimeout(() => {
    $(".format_category").each(function() {
      const category = $(this)
      if (category.children().length === 2) {
        const text = category.find("label").first().text()
        const icon = E("i").addClass("format_category_dropdown material-icons").text("expand_more").appendTo(category)
        icon.on("click", e => {
          if (collapsed.includes(text)) {
            collapsed.splice(collapsed.indexOf(text), 1)
            icon.parent().removeClass("format_category_collapsed")
          } else {
            collapsed.push(text)
            icon.parent().addClass("format_category_collapsed")
          }
          localStorage.setItem("format_category_collapsed", JSON.stringify(collapsed))
        })
        if (collapsed.includes(text)) category.addClass("format_category_collapsed")
      }
    })
  }, 0)
}
