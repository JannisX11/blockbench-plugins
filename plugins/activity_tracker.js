(() => {
  let styles, dialog, action, running, importDialog, exportDialog, interval, timeout, notification, state
  const id = "activity_tracker"
  const name = "Activity Tracker"
  const icon = "trending_up"
  const description = "Track how long you spend using Blockbench and working on each project."
  const activity = JSON.parse(localStorage.getItem(id) ?? '{ "clock": 0 }')
  let pauseOnLostFocus = localStorage.getItem(`${id}_pause_lost_focus`) ?? "0"
  Plugin.register(id, {
    title: name,
    icon,
    author: "Ewan Howell",
    description,
    about: "This plugin allows you to keep track of how much time you spend using Blockbench and how long you spend working on each project.\n\nTo view your activity stats, go to `Tools > Activity Tracker`. From here you can see all your stats for both Blockbench and the current project.",
    tags: ["Tracking", "Stats", "Utility"],
    version: "1.0.0",
    min_version: "4.6.5",
    variant: "both",
    onload() {
      activity.session = activity.clock
      styles = Blockbench.addCSS(`
        #tracker-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .tracker-row {
          display: flex;
          gap: 20px;
          width: 100%;
          margin: 10px 0 20px;
          justify-content: center;
        }
        .tracker-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .tracker-col > p {
          color: var(--color-light);
          font-size: 1.5rem;
        }
        .tracker-line {
          width: 100%;
          border-top: 2px solid var(--color-border);
          margin: 10px 0 20px;
        }
        #tracker-container .button-row {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }
        #tracker-import {
          margin: 20px 0 10px;
        }
        #tracker-export {
          user-select: all;
        }
        .tracker-row-center {
          align-items: center;
          gap: 10px;
        }
        #tracker-container i {
          cursor: pointer;
        }
        #tracker-container i:hover {
          color: var(--color-light);
        }
      `)
      property = new Property(ModelProject, "number", id, {
        default: 0,
        exposed: false
      })
      importDialog = new Dialog({
        id: `${id}_import`,
        title: `${name} Import`,
        buttons: [],
        component: {
          data: {
            seconds: 0
          },
          methods: {
            input(e) {
              this.seconds = Math.min(parseInt(e.target.value) || 0, 9999999999)
            },
            durationString,
            confirm() {
              activity.clock = this.seconds
              activity.session = this.seconds
              importDialog.close()
            }
          },
          template: `
            <div id="tracker-container">
              <h2>Enter number of seconds:</h2>
              <input id="tracker-import" class="dark_bordered half" type="number" placeholder="123456789" @input="input"></input>
              <p>Preview: {{ durationString(seconds) }}</p>
              <div class="button-row">
                <button @click="confirm">Confirm</button>
              </div>
            </div>
          `
        }
      })
      exportDialog = new Dialog({
        id: `${id}_export`,
        title: `${name} Export`,
        buttons: [],
        component: {
          data: {
            clock: activity.clock
          },
          methods: {
            copy() {
              navigator.clipboard.writeText(this.clock)
              const text = $("#tracker-export").text("Copied...")
              setTimeout(() => text.text(this.clock), 1000)
            }
          },
          template: `
            <div id="tracker-container">
              <h2>Your total activity in seconds:</h2>
              <div class="tracker-row tracker-row-center">
                <p id="tracker-export" class="dark_bordered half">{{ clock }}</p>
                <i class="material-icons icon" title="Copy to clipboard" @click="copy">content_copy</i>
              </div>
            </div>
          `
        }
      })
      dialog = new Dialog({
        id,
        title: name,
        buttons: [],
        component: {
          data: {
            activity,
            importDialog,
            exportDialog,
            options: {
              "0": "Immediately",
              "10": "After 10 seconds",
              "30": "After 30 seconds",
              "60": "After 1 minute",
              "300": "After 5 minutes",
              "600": "After 10 minutes",
              "1200": "After 20 minutes",
              "1800": "After 30 minutes",
              "2700": "After 45 minutes",
              "3600": "After 1 hour",
              "never": "Never"
            },
            option: pauseOnLostFocus
          },
          methods: {
            durationString,
            set(e) {
              pauseOnLostFocus = e
              localStorage.setItem(`${id}_pause_lost_focus`, e)
            }
          },
          template: `
            <div id="tracker-container">
              <h1>Global Activity</h1>
              <div class="tracker-row">
                <div class="tracker-col">
                  <h2>Total</h2>
                  <p>{{ durationString(activity.clock) }}</p>
                </div>
                <div class="tracker-col">
                  <h2>Current session</h2>
                  <p>{{ durationString(activity.clock - activity.session) }}</p>
                </div>
              </div>
              <div v-if="Project" id="project-tracker">
                <div class="tracker-line"></div>
                <h1>Current Project Activity</h1>
                <p>Models must be saved as a bbmodel to preserve per project activity tracking.</p>
                <div class="tracker-row">
                  <div class="tracker-col">
                    <h2>Total</h2>
                    <p>{{ durationString(Project.${id}) }}</p>
                  </div>
                  <div class="tracker-col">
                    <h2>Current session</h2>
                    <p>{{ durationString(Project.${id} - Project.${id}_session) }}</p>
                  </div>
                </div>
              </div>
              <div class="tracker-line"></div>
              <div id="pause-tracking-select-container" class="tracker-row tracker-row-center">
                <p>Pause tracking when tabbed out:</p>
                <select-input v-model="option" :options="options" @input="set" />
              </div>
              <div class="tracker-line"></div>
              <div class="tracker-row">
                <button @click="importDialog.show()">Import time</button>
                <button @click="exportDialog.show()">Export time</button>
              </div>
            </div>
          `
        }
      })
      action = new Action({
        name,
        id,
        description,
        icon,
        click: () => dialog.show()
      })
      MenuBar.addAction(action, "tools")
      window.addEventListener("focus", focus)
      window.addEventListener("blur", blur)
      document.addEventListener("visibilitychange", visibilityChange)
      Blockbench.on("select_project", selectProject)
      selectProject()
      focus()
    },
    onunload() {
      window.removeEventListener("focus", focus)
      window.removeEventListener("blur", blur)
      document.addEventListener("visibilitychange", visibilityChange)
      Blockbench.removeListener("select_project", selectProject)
      clearTimeout(timeout)
      clearInterval(interval)
      styles.delete()
      property.delete()
      action.delete()
      dialog.close()
      importDialog.close()
      exportDialog.close()
    }
  })
  function durationString(num) {
    num = num * 1000
    const years = Math.floor(num / 3.1536e10)
    let days = Math.floor(num / 8.64e7) % 365
    const weeks = Math.floor(days / 7)
    days %= 7
    const hours = Math.floor(num / 3.6e6) % 24
    const minutes = Math.floor(num / 6e4) % 60
    const seconds = Math.round(num / 1000 % 60)
    return `${years} year${years === 1 ? "" : "s"}, ${weeks} week${weeks === 1 ? "" : "s"}, ${days} day${days === 1 ? "" : "s"}, ${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`.replace(/(?<!\d)0\s[a-z]+,\s/g, "").replace(/(, 00:00:00)/, "")
  }
  function selectProject() {
    setTimeout(() => {
      Project.activity_tracker_session ||= Project.activity_tracker
    }, 0)
  }
  function visibilityChange() {
    if (document.visibilityState === "hidden") blur()
    else focus()
  }
  function focus() {
    if (state === "focus") return
    state = "focus"
    clearTimeout(timeout)
    notification?.delete()
    if (running) return
    running = true
    interval = setInterval(() => {
      activity.clock += 1
      Project.activity_tracker += 1
      localStorage.setItem(id, JSON.stringify(activity))
    }, 1000)
  }
  function blur() {
    if (state === "blur") return
    state = "blur"
    if (pauseOnLostFocus === "never") return
    timeout = setTimeout(() => {
      clearInterval(interval)
      running = false
      notification = Blockbench.showToastNotification({
        text: "Activity tracking paused. Tab back in to resume.",
        icon
      })
    }, parseInt(pauseOnLostFocus) * 1000)
  }
})()