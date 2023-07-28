(() => {
  let oldDialog, open
  Plugin.register("plugin_loader_2.0", {
    title: "Plugin Loader 2.0",
    icon: "extension",
    author: "Ewan Howell",
    description: "Replace the default Blockbench Plugin Loader interface with an improved and redesigned Plugin Loader interface.",
    about: "This plugin replaces the built in Blockbench Plugin Loader interface with a new and improved Plugin Loader.\n\n## Plugin Pages\nEach plugin now gets its own page where you can view all of its information, as well as install/uninstall/reload it.\n\n## Plugin Tabs\nAll of the tags used across the plugins are now shown as a list of tabs up the side of the Plugin Loader, allowing you to quickly and easily browse and filter by the tags.",
    tags: ["Deprecated", "Plugins", "Blockbench"],
    version: "1.1.0",
    min_version: "4.4.2",
    variant: "both",
    oninstall: () => Plugins.dialog.show(),
    onload() {
      Plugins.dialog.close()
      oldDialog = Plugins.dialog
      const dialog = new Dialog({
        id: "plugins",
        title: "dialog.plugins.title",
        buttons: [],
        width: 980,
        lines: [`
          <style>
            dialog#plugins #plugins_header_bar {
              display: none;
            }
            dialog#plugins .dialog_content {
              margin: 0;
              min-height: 128px;
            }
            dialog#plugins #plugin-sidebar {
              display: flex!important;
              flex: initial;
              overflow-y: auto;
              min-width: 230px;
            }
            dialog#plugins #plugin-sidebar-tabs {
              overflow-y: auto;
            }
            dialog#plugins #plugin-sidebar-tabs::-webkit-scrollbar-track {
              background-color: var(--color-back);
            }
            dialog#plugins #plugin-sidebar-tabs > li {
              display: none;
            }
            dialog#plugins #plugin-sidebar-tabs > li.visible {
              display: list-item;
            }
            dialog#plugins #plugin-container {
              display: flex;
              height: 512px;
              min-height: 128px;
              position: relative;
            }
            dialog#plugins #plugin-content {
              flex: 1;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
            }
            dialog#plugins #plugin_search_bar {
              cursor: pointer;
            }
            dialog#plugins .bar {
              height: 40px;
              padding: 10px 10px 0;
            }
            dialog#plugins #button-row {
              display: flex;
              padding: 10px 10px 10px 20px;
              gap: 10px;
              align-items: center;
            }
            dialog#plugins #button-row > i {
              font-size: 1.5rem;
              display: flex;
              cursor: pointer;
            }
            dialog#plugins #button-row > i:hover {
              color: var(--color-light);
            }
            dialog#plugins #plugin-list {
              flex: 1;
              overflow-y: auto;
              margin: 10px 10px 0;
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            dialog#plugins .plugin {
              background-color: var(--color-back);
              padding: 10px;
              margin-right: 10px;
            }
            dialog#plugins .plugin:hover {
              background-color: var(--color-selected);
              color: var(--color-light);
            }
            dialog#plugins .plugin * {
              cursor: pointer;
            }
            dialog#plugins .plugin-header {
              display: flex;
              gap: 10px;
              align-items: center;
              font-size: 1.34rem;
            }
            dialog#plugins .plugin_icon {
              display: flex;
            }
            dialog#plugins .plugin:hover .plugin-version, dialog#plugins .plugin:hover .plugin-author {
              color: var(--color-text);
            }
            dialog#plugins .plugin-version, dialog#plugins .plugin-author {
              color: var(--color-subtle_text);
              font-size: 0.9rem;
            }
            dialog#plugins .plugin-description {
              padding-top: 5px;
            }
            dialog#plugins .plugin-list-tags {
              padding-top: 7px;
            }
            dialog#plugins button {
              text-decoration: none;
            }
            dialog#plugins button:focus > span {
              text-decoration: underline;
            }
            dialog#plugins .plugin-button {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            dialog#plugins .plugin-details {
              background-color: var(--color-ui);
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: none;
              flex-direction: column
            }
            dialog#plugins .plugin-details.visible {
              display: flex;
            }
            dialog#plugins .plugin-details-close {
              position: absolute;
              top: 0;
              right: 10px;
              cursor: pointer;
              font-size: 1.5rem;
              padding: 5px 10px;
              display: flex;
              align-items: center;
            }
            dialog#plugins .plugin-details-close:hover {
              color: var(--color-light);
            }
            dialog#plugins .plugin-title-container {
              background-color: var(--color-back);
              height: 128px;
              display: flex;
              padding: 10px 20px 0;
            }
            dialog#plugins .plugin-title-container > div {
              display: flex;
              justify-content: end;
              flex-direction: column;
            }
            dialog#plugins .plugin-title-left {
              flex: 1;
            }
            dialog#plugins .plugin-title {
              font-size: 3rem;
            }
            dialog#plugins .plugin-title-version {
              padding-bottom: 5px;
              color: var(--color-subtle_text);
            }
            dialog#plugins .plugin-title-author {
              color: var(--color-subtle_text);
            }
            dialog#plugins .spacer {
              flex: 1;
            }
            dialog#plugins .plugin-button-bar {
              padding: 10px 20px;
              display: flex;
              gap: 10px;
            }
            dialog#plugins .plugin-button-bar > button {
              display: flex;
              min-width: 128px;
              align-items: center;
              padding: 0 10px;
              gap: 10px;
              justify-content: center;
            }
            dialog#plugins .plugin-button-bar > button[disabled] {
              background-color: var(--color-back);
              cursor: initial;
              color: var(--color-subtle_text)!important;
            }
            dialog#plugins .plugin-button-bar > .link {
              text-decoration: none;
              cursor: pointer;
            }
            dialog#plugins .plugin-button-bar > .link:hover {
              color: var(--color-light);
            }
            dialog#plugins .plugin-button-bar > .link > i {
              font-size: 1.5rem;
            }
            dialog#plugins .plugin-details-description {
              margin: 0 20px;
            }
            dialog#plugins .plugin-details-about {
              margin: 10px 20px 20px;
              padding: 10px;
              background-color: var(--color-back);
              overflow-y: auto;
            }
            dialog#plugins .plugin-details-about::-webkit-scrollbar-track {
              background-color: var(--color-back);
            }
            dialog#plugins .plugin-details-about code {
              padding: 0 2px;
              background-color: var(--color-dark)
            }
            dialog#plugins .plugin-details-about-filler {
              display: flex;
              justify-content: center;
              flex: 1;
              align-items: center;
            }
            dialog#plugins .plugin-details-about-filler > i {
              opacity: 0.5;
              font-size: 15rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            dialog#plugins .plugin-tags {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            dialog#plugins .plugin-tags > li {
              margin: 0;
            }
            dialog#plugins .plugin-tag-no-tags {
              background-color: var(--color-subtle_text)
            }
            dialog#plugins .plugin-tag-format {
              background-color: var(--color-stream)
            }
            dialog#plugins #plugin-sidebar-footer {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px;
              border-top: 2px solid var(--color-dark);
              min-height: 52px;
            }
            dialog#plugins #plugin-sidebar-footer > a {
              display: flex;
              gap: 10px;
              justify-content: center;
              align-items: center;
              text-decoration: none;
            }
            dialog#plugins #plugin-sidebar-footer > a > i {
              font-size: 1.25rem;
            }
            dialog#plugins #plugin-sidebar-footer > a > span {
              text-decoration: underline;
            }
          </style>
        `],
        component: {
          data: {
            tab: "installed",
            searchTerm: "",
            items: Plugins.all,
            currentTag: "All",
            detailsVisible: null
          },
          computed: {
            tags() {
              const tags = Array.from(this.items.reduce((a, e) => {
                e.tags.forEach(e => a.add(e))
                return a
              }, new Set(["All", "No Tags"])))
              const tagCount = new Map(tags.map(t => [t, t === "All" ? Infinity : t === "No Tags" ? Plugins.all.filter(p => !p.tags?.length).length : t === "Deprecated" ? -Infinity : Plugins.all.filter(p => p.tags.includes(t)).length]))
              return tags.sort((a, b) => tagCount.get(b) - tagCount.get(a) + a.localeCompare(b) * 0.1)
            },
            pluginSearch() {
              const name = this.searchTerm.toUpperCase()
              const tag = this.currentTag
              return this.items.filter(item => {
                if (tag === "No Tags" && !item.tags?.length && (this.tab == "installed") == item.installed) return true
                if (tag !== "All" && !item.tags.includes(tag)) return
                if ((this.tab == "installed") == item.installed) {
                  if (name.length > 0) {
                    return (
                      item.id.toUpperCase().includes(name) ||
                      item.title.toUpperCase().includes(name) ||
                      item.description.toUpperCase().includes(name) ||
                      item.author.toUpperCase().includes(name) ||
                      item.tags.find(tag => tag.toUpperCase().includes(name))
                    )
                  }
                  return true;
                }
              })
            },
            visibleTags() {
              return this.tags.filter(tag => tag === "All" || this.items.filter(item => ((item.tags.includes(tag) || (tag === "No Tags" && !item.tags?.length)) && (this.tab === "installed") === item.installed)).length)
            }
          },
          methods: {
            getTagClass(tag) {
              if (tag.match(/^(local|remote)$/i)) return "plugin_tag_source"
              if (tag.match(/^minecraft/i)) return "plugin_tag_mc"
                if (tag.match(/^format/i)) return "plugin-tag-format"
              if (tag.match(/^deprecated/i)) return "plugin_tag_deprecated"
            },
            getIconNode: Blockbench.getIconNode,
            tl,
            switchTab(tab) {
              this.tab = tab
              if (!this.visibleTags.includes(this.currentTag)) this.currentTag = "All"
            },
            uninstall(plugin) {
              plugin.uninstall()
              Blockbench.showQuickMessage(`Sucessfully uninstalled the plugin ${plugin.name}`)
            },
            close: () => dialog.close(),
            pluginClick(event, plugin) {
              if (!event.target.classList.contains("tag")) this.detailsVisible = plugin
            }
          },
          template: `
            <div id="plugin-container">
              <div id="plugin-sidebar" class="dialog_sidebar">
                <ul id="plugin-sidebar-tabs" class="dialog_sidebar_pages">
                  <li v-for="tag in tags" @click="currentTag = tag" :class="{selected: currentTag === tag, visible: visibleTags.includes(tag)}">{{ tag }}</li>
                </ul>
                <div class="spacer"></div>
                <div id="plugin-sidebar-footer">
                  <a href="https://github.com/JannisX11/blockbench-plugins/">
                    <i class="icon fab fa-github"></i>
                    <span class="tl">Submit your own</span>
                  </a>
                </div>
              </div>
              <div id="plugin-content">
                <div class="bar">
                  <div class="tab_bar">
                    <div :class="{open: tab === 'installed'}" @click="switchTab('installed')">${tl('dialog.plugins.installed')}</div>
                    <div :class="{open: tab === 'available'}" @click="switchTab('available')">${tl('dialog.plugins.available')}</div>
                  </div>
                  <search-bar id="plugin_search_bar" v-model="searchTerm"></search-bar>
                </div>
                <ul id="plugin-list">
                  <li v-for="plugin in pluginSearch" class="plugin" @click="pluginClick(event, plugin)">
                    <div class="plugin-header">
                      <span class="icon_wrapper plugin_icon normal" v-html="getIconNode(plugin.icon || 'error_outline', !plugin.icon ? 'var(--color-close)' : plugin.color ?? 'var(--color-text)').outerHTML"></span>
                      {{ plugin.title }}
                      <span class="plugin-version">v{{ plugin.version }}</span>
                    </div>
                    <div class="plugin-author">By {{ plugin.author }}</div>
                    <div class="plugin-description">{{ plugin.description }}</div>
                    <ul v-if="plugin.tags?.length" class="plugin_tag_list plugin-tags plugin-list-tags">
                      <li v-for="tag in plugin.tags" class="tag" :class="getTagClass(tag)" :key="tag" @click="currentTag = tag; detailsVisible = null">{{tag}}</li>
                    </ul>
                    <ul v-else class="plugin_tag_list plugin-tags plugin-list-tags">
                      <li class="tag plugin-tag-no-tags" @click="currentTag = 'No Tags'; detailsVisible = null">No Tags</li>
                    </ul>
                  </li>
                  <div class="no_plugin_message tl" v-if="pluginSearch.length < 1 && tab === 'installed'">${tl('dialog.plugins.none_installed')}</div>
                  <div class="no_plugin_message tl" v-if="pluginSearch.length < 1 && tab === 'available'" id="plugin_available_empty">{{ tl(navigator.onLine ? 'dialog.plugins.none_available' : 'dialog.plugins.offline') }}</div>
                </ul>
                <div id="button-row">
                  <i class="fa_big icon fa fa-file-code" title="Load a plugin by importing the source file" @click="BarItems.load_plugin.click()"></i>
                  <i class="material-icons" title="Load a plugin from a server by specifying the URL" @click="BarItems.load_plugin_from_url.click()">cloud_download</i>
                  <div class="spacer"></div>
                  <button id="close" @click="close()">Close</button>
                </div>
                <div v-for="plugin in items" class="plugin-details" :class="{visible: detailsVisible === plugin}">
                  <div class="plugin-details-close" @click="detailsVisible = null">
                    <i class="material-icons">chevron_left</i>
                    Back
                  </div>
                  <div class="plugin-title-container">
                    <div class="plugin-title-left">
                      <div class="plugin-title-author">By {{ plugin.author }}</div>
                      <div class="spacer"></div>
                      <div class="plugin-title">{{ plugin.title }}</div>
                    </div>
                    <div class="plugin-title-right">
                      <div class="plugin-title-version">Version {{ plugin.version }}</div>
                    </div>
                  </div>
                  <div class="plugin-button-bar">
                    <button type="button" v-on:click="plugin.reload()" v-if="plugin.installed && plugin.isReloadable()">
                      <i class="material-icons">refresh</i>
                      <span class="tl">${tl('dialog.plugins.reload')}</span>
                    </button>
                    <button type="button" v-on:click="uninstall(plugin);detailsVisible = null" v-if="plugin.installed">
                      <i class="material-icons">delete</i>
                      <span class="tl">${tl('dialog.plugins.uninstall')}</span>
                    </button>
                    <button type="button" v-on:click="plugin.download(true)" v-else-if="plugin.installed || plugin.isInstallable() == true">
                      <i class="material-icons">file_download</i>
                      <span class="tl">${tl('dialog.plugins.install')}</span>
                    </button>
                    <button type="button" disabled v-else>
                      <i class="material-icons">file_download_off</i>
                      <span class="tl">This plugin requires a minimum of Blockbench {{ plugin.min_version }}</span>
                    </button>
                    <ul v-if="plugin.tags?.length" class="plugin_tag_list plugin-tags">
                      <li v-for="tag in plugin.tags" :class="getTagClass(tag)" :key="tag" @click="currentTag = tag; detailsVisible = null">{{tag}}</li>
                    </ul>
                    <ul v-else class="plugin_tag_list plugin-tags">
                      <li class="plugin-tag-no-tags" @click="currentTag = 'No Tags'; detailsVisible = null">No Tags</li>
                    </ul>
                    <div class="spacer"></div>
                    <a v-if="plugin.source === 'store'" class="link" :href="'https://www.blockbench.net/plugins/' + plugin.id" title="View on the Blockbench website">
                      <i class="icon material-icons">language</i>
                    </a>
                    <a v-if="plugin.source === 'store'" class="link" :href="'https://github.com/JannisX11/blockbench-plugins/blob/master/plugins/' + plugin.id + '.js'"  title="View the source code on GitHub">
                      <i class="icon fab fa-github"></i>
                    </a>
                    <span v-if="plugin.source === 'file' && isApp" class="link" title="Show in File Explorer" @click="shell.showItemInFolder(plugin.path)">
                      <i class="icon material-icons">folder</i>
                    </span>
                    <a v-if="plugin.source === 'url'" class="link" :href="plugin.path" title="View the source code">
                      <i class="icon material-icons">language</i>
                    </a>
                  </div>
                  <div class="plugin-details-description">{{ plugin.description }}</div>
                  <div class="plugin-details-about markdown" v-if="plugin.about" v-html="marked(plugin.about.replace(/\\n/g, '\\n\\n'))"></div>
                  <div class="plugin-details-about-filler" v-else v-html="getIconNode(plugin.icon || 'error_outline', 'var(--color-back)').outerHTML">
                  </div>
                </div>
              </div>
            </div>
          `
        },
        onOpen: () => open = true,
        onCancel() {
          dialog.content_vue.detailsVisible = null
          open = false
        }
      })
      Plugins.dialog = dialog
    },
    onunload() {
      if (open) {
        Plugins.dialog.close()
        oldDialog.show()
      }
      Plugins.dialog = oldDialog
    }
  })
})()