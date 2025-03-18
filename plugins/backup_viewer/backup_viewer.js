(() => {
  let styles, oldTemplate
  const workScreenElement = document.getElementById("work_screen")
  Plugin.register("backup_viewer", {
    title: "Backup Viewer",
    icon: "icon.png",
    author: "Ewan Howell",
    description: "View the project backups from the Blockbench start screen.",
    tags: ["Backups", "Start screen", "Blockbench"],
    version: "2.0.0",
    min_version: "4.12.0",
    variant: "desktop",
    creation_date: "2022-12-28",
    has_changelog: true,
    website: "https://ewanhowell.com/plugins/backup-viewer/",
    repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/backup-viewer",
    bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues/new?title=[Backup Viewer]",
    onload() {
      const backupPath = app.getPath("userData") + osfs + "backups"

      const backups = []
      function getBackups() {
        backups.length = 0
        const backupFilePaths = fs.readdirSync(backupPath)
        for (const file of backupFilePaths) {
          const path = PathModule.join(backupPath, file)
          const stats = fs.statSync(path)
          backups.push({
            id: file,
            path,
            name: file.replace(/backup_\d+\.\d+\.\d+_\d+\.\d+_?/, "").replace(/\.bbmodel$/, "") || 'no name',
            date: stats.mtime.toLocaleDateString(),
            time: stats.mtime.toLocaleTimeString().replace(/:\d+ /, " "),
            size: `${separateThousands(Math.round(stats.size / 1024))} KB`,
            timestamp: stats.mtime.getTime()
          })
        }
        backups.sort((a, b) => b.timestamp - a.timestamp)
      }
      getBackups()

      styles = Blockbench.addCSS(`
        #start-screen-recent-tabs {
          display: flex;
          gap: 10px;
          padding-bottom: 5px;
          margin-top: -5px;

          h2 {
            cursor: pointer;
            padding: 0 10px;
            margin-top: -3px;

            &:hover {
              color: var(--color-light);
            }
          }

          .selected {
            border-bottom: 3px solid var(--color-accent);
          }
        }

        .recent-project-list .backup .icon_wrapper {
          padding-left: 22px;
          height: 22px;
          margin: 0 !important;
        }

        .recent-project-list .backup .recent_project_date {
          display: grid;
          grid-template-columns: 76px 56px 60px;
          gap: 16px;

          :last-child {
            text-align: right;
          }
        }

        .recent_list_grid .backup {
          padding: 10px 20px 12px 20px;
          height: initial !important;

          &:hover * {
            color: var(--color-accent_text);
          }
        }

        .recent_list_grid .backup .recent_project_date {
          font-size: 14px;
          display: flex;
          gap: 8px;

          &::before {
            display: none;
          }

          :last-child {
            flex: 1;
            text-align: right;
          }
        }
      `)

      StartScreen.vue.$destroy()

      StartScreen.vue.$data.recentsView = "recents"
      StartScreen.vue.$data.backups = backups

      StartScreen.vue.$options.methods.openBackup = backup => Blockbench.read([backup.path], {}, files => loadModelFile(files[0]))
      StartScreen.vue.$options.methods.getBackups = getBackups

      oldTemplate = StartScreen.vue.$options.template

      const newTemplate = oldTemplate.replace(
        `<h2>${tl('mode.start.recent')}</h2>`,
        `
          <div id="start-screen-recent-tabs">
            <h2 :class="{ selected: recentsView === 'recents' }" @click="recentsView = 'recents'">${tl("mode.start.recent")}</h2>
            <h2 :class="{ selected: recentsView === 'backups' }" @click="getBackups(); recentsView = 'backups'">Backups</h2>
          </div>
        `
      ).replace(
        `<div v-if="redact_names">{{ '['+tl('generic.redacted')+']' }}</div>`,
        `
          <div v-if="redact_names">{{ '['+tl('generic.redacted')+']' }}</div>
          <ul v-else-if="recentsView === 'backups' && list_type === 'list'" class="recent-project-list">
            <li v-for="backup in backups" class="recent_project backup" @click="openBackup(backup)">
              <span class="icon_wrapper" v-html="getIconNode('fa-archive').outerHTML"></span>
              <span class="recent_project_name">{{ backup.name }}</span>
              <span class="recent_project_date">
                <span>{{ backup.date }}</span>
                <span>{{ backup.time }}</span>
                <span>{{ backup.size }}</span>
              </span>
            </li>
          </ul>
          <ul v-else-if="recentsView === 'backups'" class="recent_list_grid">
            <li v-for="backup in backups" class="recent_project thumbnail backup" @click="openBackup(backup)">
              <h3 class="backup-project-name">{{ backup.name }}</h3>
              <span class="recent_project_date">
                <span>{{ backup.date }}</span>
                <span>{{ backup.time }}</span>
                <span>{{ backup.size }}</span>
              </span>
            </li>
          </ul>
        `
      )

      StartScreen.vue = new Vue({
        el: "#start_screen",
        components: StartScreen.vue.$options.components,
        data: { ...StartScreen.vue.$data },
        methods: StartScreen.vue.$options.methods,
        computed: StartScreen.vue.$options.computed,
        mounted: StartScreen.vue.$options.mounted,
        template: newTemplate
      })

      if (workScreenElement.style.display === "grid") {
        document.getElementById("start_screen").style.display = "none"
      }
    },
    onunload() {
      StartScreen.vue.$destroy()

      delete StartScreen.vue.$data.recentsView
      delete StartScreen.vue.$data.backups
      delete StartScreen.vue.$options.methods.openBackup
      delete StartScreen.vue.$options.methods.getBackups

      StartScreen.vue = new Vue({
        el: "#start_screen",
        components: StartScreen.vue.$options.components,
        data: { ...StartScreen.vue.$data },
        methods: StartScreen.vue.$options.methods,
        computed: StartScreen.vue.$options.computed,
        mounted: StartScreen.vue.$options.mounted,
        template: oldTemplate
      })

      if (workScreenElement.style.display === "grid") {
        document.getElementById("start_screen").style.display = "none"
      }

      styles.delete()
    }
  })
})()