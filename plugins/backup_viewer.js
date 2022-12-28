(() => {
  let styles, backupList
  const backupPath = app.getPath("userData") + osfs + "backups"
  const E = s => $(document.createElement(s))
  Plugin.register("backup_viewer", {
    title: "Backup Viewer",
    icon: "fa-archive",
    author: "Ewan Howell",
    description: "View the project backups from within Blockbench",
    about: "Add a backup tab to the Blockbench start screen that allows you to view a list of the project backups from within Blockbench.",
    tags: ["Backups", "Blockbench"],
    version: "1.0.0",
    min_version: "4.5.2",
    variant: "desktop",
    onload() {
      styles = Blockbench.addCSS(`
        #backup-tabs {
          background-color: var(--color-ui);
          position: absolute;
          top: -1px;
          display: flex;
          gap: 2px;
        }
        .backup-tab {
          border-top: 3px solid transparent;
          cursor: pointer;
          padding: 0 20px 4px;
          font-size: 1.75rem;
        }
        .backup-tab-active {
          border-top: 3px solid var(--color-accent);
          cursor: initial;
        }
        .backup-tab:hover {
          background-color: var(--color-selected);
        }
        .backup-tab-active:hover {
          background-color: var(--color-ui);
        }
        .backup-backup-list {
          margin-left: 0!important;
          display: grid;
        }
        .backup-list-inactive {
          display: none!important;
        }
        .backup-item {
          background-color: var(--color-back);
          padding: 10px 20px;
          overflow: hidden;
        }
        .backup-item, .backup-item * {
          cursor: pointer;
        }
        .backup-item:hover {
          background-color: var(--color-accent);
          color: var(--color-accent_text);
        }
        .backup-item > i {
          display: none;
        }
        .backup-item > div {
          font-size: 16px;
          color: var(--color-subtle_text);
          position: relative;
        }
        .backup-item:hover > div {
          color: var(--color-bright_ui_text);
        }
        .backup-item-hidden {
          display: none!important;
        }
        .backup-list-display-list {
          display: block;
        }
        .backup-list-display-list > .backup-item {
          background-color: initial;
          padding: 0 0 0 12px;
          display: flex;
          height: 26.39px;
          align-items: center;
          margin: 2px 0;
        }
        .backup-list-display-list > .backup-item:hover {
          color: var(--color-light);
        }
        .backup-list-display-list i {
          display: initial;
        }
        .backup-list-display-list h3 {
          font-size: 17.6px;
          margin: 4px 0 0 4px!important;
          padding: 0!important;
        }
        .backup-list-display-list span {
          flex: 1;
        }
        .backup-list-display-list div::before {
          content: "";
          position: absolute;
          width: 16px;
          height: 26px;
          margin-left: -20px;
          background: linear-gradient(90deg, transparent, var(--color-ui));
        }
      `)
      $(".start_screen_right > h2").css("position", "relative").append(
        E("div").attr("id", "backup-tabs").append(
          E("div").text("Recent").attr("id", "backup-recent-tab").addClass("backup-tab backup-tab-active"),
          E("div").text("Backups").attr("id", "backup-backup-tab").addClass("backup-tab")
        )
      )
      backupList = E("ul").addClass("backup-backup-list backup-list-inactive").insertAfter($(".start_screen_right > ul"))
      if ($("#start_screen_view_menu > .tool").eq(1).hasClass("selected")) backupList.addClass("backup-list-display-list")
      $(".backup-tab").on("click", e => {
        $(".backup-tab-active").removeClass("backup-tab-active")
        $(".start_screen_right > ul").addClass("backup-list-inactive")
        const tab = $(e.currentTarget).addClass("backup-tab-active")
        const selected = tab.attr("id").split("-")[1]
        if (tab.attr("id") === "backup-recent-tab") $(".start_screen_right > ul").first().removeClass("backup-list-inactive")
        else backupList.removeClass("backup-list-inactive")
      })
      const files = fs.readdirSync(backupPath)
      const backups = []
      for (const file of files) if (file.endsWith(".bbmodel")) {
        const m = file.match(/^backup_(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d\d)_(?<hour>\d{1,2})\.(?<minute>\d{1,2})(?:_(?<name>.+))?\.bbmodel$/)?.groups
        if (!m) continue
        const date = new Date(Date.parse(`20${m.year}/${m.month}/${m.day} ${m.hour}:${m.minute}`))
        backups.push({
          name: m.name ?? "untitled",
          path: backupPath + osfs + file,
          date
        })
      }
      backups.sort((a, b) => b.date - a.date)
      $("#start_screen_view_menu > .search_bar").on("click", processSearch)
      const searchBar = $("#start_screen_view_menu > .search_bar > input").on("input", processSearch)
      const searchText = searchBar.val()
      for (const backup of backups) {
        const item = E("li").addClass("backup-item").attr({
          title: backup.path,
          "data-name": backup.name.toLowerCase()
        }).append(
          E("i").addClass("fa_big icon fa fa-archive"),
          E("h3").text(backup.name),
          E("span"),
          E("div").text(`${backup.date.getDate().toString().padStart(2, 0)}/${(backup.date.getMonth() + 1).toString().padStart(2, 0)}/${(backup.date.getYear() - 100).toString().padStart(2, 0)} ${backup.date.getHours().toString().padStart(2, 0)}:${backup.date.getMinutes().toString().padStart(2, 0)}`)
        ).on("click", e => Blockbench.read([backup.path], {}, files => loadModelFile(files[0]))).appendTo(backupList)
        if (!backup.name.includes(searchText)) item.addClass("backup-item-hidden")
      }
      $("#start_screen_view_menu > .tool").first().on("click", gridView)
      $("#start_screen_view_menu > .tool").eq(1).on("click", listView)
      processSearch()
    },
    onunload() {
      $("#start_screen_view_menu > .search_bar").off("click", processSearch)
      $("#start_screen_view_menu > .search_bar > input").off("input", processSearch)
      $("#start_screen_view_menu > .tool").first().off("click", gridView)
      $("#start_screen_view_menu > .tool").eq(1).off("click", listView)
      styles.delete()
      $("#backup-tabs").remove()
      $(".backup-backup-list").remove()
      $(".backup-list-inactive").removeClass("backup-list-inactive")
    }
  })
  function processSearch() {
    const text = $("#start_screen_view_menu > .search_bar > input").val().toLowerCase()
    $(".backup-item").each(function() {
      const item = $(this)
      if (!item.attr("data-name").includes(text)) item.addClass("backup-item-hidden")
      else item.removeClass("backup-item-hidden")
    })
  }
  function gridView() {
    backupList.removeClass("backup-list-display-list")
    hideRecent()
  }
  function listView() {
    backupList.addClass("backup-list-display-list")
    hideRecent()
  }
  function hideRecent() {
    if ($("#backup-backup-tab").hasClass("backup-tab-active")) $(".start_screen_right > ul").first().addClass("backup-list-inactive")
  }
})()