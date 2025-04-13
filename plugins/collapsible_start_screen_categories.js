(async function () {
  let aboutAction, styles, collapsed
  const id = "collapsible_start_screen_categories"
  const name = "Collapsible Start Screen Categories"
  const icon = "chevron_right"
  const author = "Ewan Howell"
  const about = "This plugin adds a small dropdown arrow next to each category on the start screen, allowing you to collapse each category and hide their respective formats."
  const links = {
    website: "https://ewanhowell.com/",
    discord: "https://discord.com/invite/pkRxtGw"
  }
  const E = s => $(document.createElement(s))
  Plugin.register(id, {
    title: name,
    icon,
    author,
    description: "Add the ability to collapse the start screen categories.",
    about,
    tags: ["Start screen", "Menu", "Formats"],
    version: "1.0.0",
    min_version: "4.4.1",
    variant: "both",
    oninstall: () => showAbout(true),
    onuninstall: () => localStorage.removeItem("format_category_collapsed"),
    onload() {
      addAbout()
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
      aboutAction.delete()
      MenuBar.removeAction(`help.about_plugins.about_${id}`)
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
  function addAbout() {
    let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
    if (!about) {
      about = new Action("about_plugins", {
        name: "About Plugins...",
        icon: "info",
        children: []
      })
      MenuBar.addAction(about, "help")
    }
    aboutAction = new Action(`about_${id}`, {
      name: `About ${name}...`,
      icon,
      click: () => showAbout()
    })
    about.children.push(aboutAction)
  }
  function showAbout(banner) {
    const infoBox = new Dialog({
      id: "about",
      title: name,
      width: 780,
      buttons: [],
      lines: [`
        <style>
          dialog#about .dialog_title {
            padding-left: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          dialog#about .dialog_content {
            text-align: left!important;
            margin: 0!important;
          }
          dialog#about .socials {
            padding: 0!important;
          }
          dialog#about #banner {
            background-color: var(--color-accent);
            color: var(--color-accent_text);
            width: 100%;
            padding: 0 8px
          }
          dialog#about #content {
            margin: 24px;
          }
        </style>
        ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
        <div id="content">
          <h1 style="margin-top:-10px">${name}</h1>
          <p style="padding-bottom:10px">${about}</p>
          <div class="socials">
            <a href="${links["website"]}" class="open-in-browser">
              <i class="icon material-icons" style="color:#33E38E">language</i>
              <label>By ${author}</label>
            </a>
            <a href="${links["discord"]}" class="open-in-browser">
              <i class="icon fab fa-discord" style="color:#727FFF"></i>
              <label>Discord Server</label>
            </a>
          </div>
        </div>
      `]
    }).show()
    $("dialog#about .dialog_title").html(`
      <i class="icon material-icons">${icon}</i>
      ${name}
    `)
  }
})()