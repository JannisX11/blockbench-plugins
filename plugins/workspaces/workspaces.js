(() => {
  let dialog, action, styles, newDialog, editDialog
  const id = "workspaces"
  const name = "Workspaces"
  const icon = "table_restaurant"
  const E = s => $(document.createElement(s))
  const workspaces = JSON.parse(localStorage.getItem("workspaces") ?? "[]")
  if (!workspaces.length) workspaces.push({
    name: "Default",
    projects: recent_projects,
    active: true
  })
  Plugin.register(id, {
    title: name,
    icon: "icon.png",
    author: "Ewan Howell",
    description: "Organise your recent projects into workspaces that you can switch between.",
    tags: ["Files", "Management", "Blockbench"],
    version: "1.0.0",
    min_version: "4.8.0",
    variant: "desktop",
    creation_date: "2023-09-07",
    onload() {
      Blockbench.on("update_recent_project_thumbnail", recentThumbnails)
      styles = Blockbench.addCSS(`
        #workspace-details {
          position: absolute;
          bottom: 20px;
          right: 30px;
          display: flex;
          gap: 10px;
          align-items: center;
          cursor: pointer;
        }
        .workspace {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .workspace *, #workspace-details *, #workspace-add * {
          cursor: pointer;
        }
        .workspace i:hover, .workspace input:hover, #workspace-details:hover, #workspace-add:hover {
          color: var(--color-light);
        }
        .workspace-spacer {
          flex: 1;
          margin: 0 10px;
          background-color: var(--color-button);
          height: 2px;
        }
        #workspace-add {
          display: flex;
          align-items: center;
          margin-top: 10px;
          justify-content: flex-end;
        }
        #workspace-add > i {
          padding-right: 10px;
          min-width: 32px;
        }
        .start_screen_format_page > #workspace-details {
          display: none;
        }
      `)
      dialog = new Dialog({
        id,
        title: name,
        width: 256,
        buttons: [],
        component: {
          data: {
            workspaces,
            switchToWorkspace
          },
          methods: {
            addWorkspace() {
              newDialog = new Dialog({
                id: "new_workspace",
                title: "New Workspace",
                form: {
                  name: {
                    label: "Workspace name"
                  }
                },
                onConfirm(form) {
                  if (!form.name) return
                  const m = form.name.match(/[\\/*?"<>|]/)
                  if (m) return Blockbench.showQuickMessage(`Unsupported character "${m}"`, 2000)
                  if (workspaces.find(e => e.name === form.name)) return Blockbench.showQuickMessage("Workspace already exists", 2000)
                  workspaces.push({
                    name: form.name,
                    projects: []
                  })
                  switchToWorkspace(form.name)
                }
              }).show()
            },
            editWorkspace(e) {
              e.stopPropagation()
              const name = e.currentTarget.dataset.name
              const allow = name !== "Default"
              editDialog = new Dialog({
                id: "edit_workspace",
                title: `Edit Workspace`,
                buttons: ["Confirm"],
                form: {
                  name: {
                    label: "Workspace name",
                    placeholder: name,
                    condition: () => allow
                  },
                  clear: {
                    type: "checkbox",
                    label: "Clear recents"
                  }
                },
                onConfirm(form) {
                  let message
                  if (form.clear) {
                    const workspace = workspaces.find(e => e.name === name)
                    workspace.projects = []
                    if (workspace.active) {
                      recent_projects.length = 0
                      updateRecentProjects()
                    }
                    message = "Cleared recent projects"
                  }
                  if (form.name && form.name !== name) {
                    const m = form.name.match(/[\\/*?"<>|]/)
                    if (m) return Blockbench.showQuickMessage(`Unsupported character "${m}"`, 2000)
                    if (workspaces.find(e => e.name === form.name)) return Blockbench.showQuickMessage("Workspace name already in use", 2000)
                    const workspace = workspaces.find(e => e.name === name)
                    workspace.name = form.name
                    if (workspace.active) $("#active-workspace").text(form.name)
                    if (message) message += " and updated workspace name"
                    else message = "Updated workspace name"
                  }
                  if (message) {
                    localStorage.setItem("workspaces", JSON.stringify(workspaces))
                    Blockbench.showQuickMessage(message, 2000)
                  }
                }
              }).show()
            },
            deleteWorkspace(e) {
              e.stopPropagation()
              const target = e.currentTarget
              Blockbench.showMessageBox({
                title: "Delete workspace",
                message: `Are you sure you want to delete the workspace: ${target.dataset.name}\n\nIts recent projects list will be lost.`,
                buttons: ["dialog.confirm", "dialog.cancel"]
              }, async button => {
                if (button === 0) {
                  if (workspaces.find(f => f.name === target.dataset.name).active) switchToWorkspace("Default")
                  workspaces.splice(workspaces.findIndex(i => i.name === target.dataset.name), 1)
                  localStorage.setItem("workspaces", JSON.stringify(workspaces))
                }
              })
            }
          },
          template: `
            <div>
              <div id="workspace-list">
                <div class="workspace" v-for="workspace in workspaces" @click="switchToWorkspace(workspace.name)">
                  <input type="radio" :checked="workspace.active">
                  <div class="workspace-name">{{ workspace.name }}</div>
                  <div class="workspace-spacer"></div>
                  <i v-if="workspace.name !== 'Default'" class="material-icons" @click="deleteWorkspace" :data-name="workspace.name">delete</i>
                  <i class="material-icons" @click="editWorkspace" :data-name="workspace.name">edit</i>
                </div>
              </div>
              <div id="workspace-add" @click="addWorkspace">
                <i class="material-icons">add</i>
                <div>Add new workspace</div>
              </div>
            </div>
          `
        }
      })
      action = new Action({
        name,
        id,
        description: "Manage workspaces",
        icon,
        click: () => dialog.show(),
        condition: () => !Format
      })
      MenuBar.addAction(action, "file")
      $("#start_files > .start_screen_right").append(
        E("div").attr("id", "workspace-details").append(
          E("i").addClass("material-icons").text(icon),
          E("div").attr("id", "active-workspace").text(workspaces.find(e => e.active).name)
        ).on("click", () => dialog.show())
      )
    },
    onunload() {
      Blockbench.removeListener("update_recent_project_thumbnail", recentThumbnails)
      action.delete()
      styles.delete()
      dialog.close()
      newDialog?.close()
      editDialog?.close()
      $("#workspace-details").remove()
    }
  })

  function switchToWorkspace(name) {
    const old = workspaces.find(e => e.active)
    old.projects = recent_projects.slice()
    old.active = false
    const active = workspaces.find(e => e.name === name)
    active.active = true
    recent_projects.length = 0
    recent_projects.push(...active.projects)
    localStorage.setItem("workspaces", JSON.stringify(workspaces))
    updateRecentProjects()
    StartScreen.vue.updateThumbnails()
    $("#active-workspace").text(active.name)
  }

  function recentThumbnails() {
    const recents = recent_projects.slice()
    recent_projects.push(...workspaces.filter(e => !e.active).map(e => e.projects).flat())
    setTimeout(() => {
      recent_projects.length = 0
      recent_projects.push(...recents)
    }, 1)
  }
})()