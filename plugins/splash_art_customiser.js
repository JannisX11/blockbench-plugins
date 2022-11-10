(async function () {
  let styles, splashArtStyles, galleryImages
  const id = "splash_art_customiser"
  const title = "Splash Art Customiser"
  const E = s => $(document.createElement(s))
  const db = indexedDB.open("splash-art-customiser", 1)
  db.onupgradeneeded = () => {
    const store = db.result.createObjectStore("images", { keyPath: "image" })
    store.createIndex("applied", ["applied"])
  }
  await new Promise(fulfil => db.onsuccess = fulfil)
  Plugin.register(id, {
    title,
    icon: "palette",
    author: "Ewan Howell",
    description: "Customise the start screen's splash art, by adding your own!",
    about: "This plugin allows you to customise the start screen's splash art by adding your own! If you add multiple splash art images, you can set it to pick a random one every time your launch Blockbench.\n\n## How to use\nOn the top left corner of the splash art, you will find a gear icon. From here you can manage your custom splash arts.\n\n## Splash art types\n- URL - A splash art can be loaded from a URL (faster loading)\n- File - A splash art can be loaded from a file (slower loading)\n- Gallery - Pick an image from the [Blockbench Gallery](https://www.blockbench.net/gallery)\n\n## Supported file types\n- PNG\n- JPG/JPEG\n- GIF\n- WebP\n- SVG",
    tags: ["Splash art", "Start screen", "Blockbench"],
    version: "1.0.0",
    min_version: "4.4.3",
    variant: "both",
    onload() {
      if (!Blockbench.flags.after_update) setSplashArt()
      styles = Blockbench.addCSS(`
        #splash_screen > i {
          color: var(--color-light);
          opacity: 0!important;
          transition: opacity .15s;
          text-shadow: 0 0 4px black;
        }
        #splash_screen:hover > i {
          opacity: 1!important;
        }
        #splash_screen > .graphic {
          background-position: 50% 50%;
          max-height: initial;
        }
        #customise-splash-art {
          position: absolute;
          top: 8px;
          left: 8px;
          cursor: pointer;
        }
        dialog#${id} .dialog_wrapper {
          position: relative;
        }
        dialog#${id} .flex-center {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        dialog#${id} .column {
          flex-direction: column;
          gap: 24px;
        }
        dialog#${id} button {
          text-decoration: none;
        }
        dialog#${id} button:active > span, dialog#${id} #input-image-label:active > span {
          text-decoration: underline;
        }
        dialog#${id} #input-image {
          display: none;
        }
        dialog#${id} #input-image-label {
          background-color: var(--color-button);
          cursor: pointer;
          padding: 0 16px;
          height: 32px;
          min-width: 100px;
        }
        dialog#${id} #input-image-label:hover {
          background-color: var(--color-accent);
          color: var(--color-accent_text);
        }
        dialog#${id} input[type=text] {
          width: 256px;
        }
        dialog#${id} #error {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        dialog#${id} #error-darken {
          background-color: var(--color-dark);
          opacity: 0.8;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        dialog#${id} #splash-art-previews {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          overflow-y: auto;
          max-height: 316px;
        }
        dialog#${id} .splash-art-preview {
          width: 238px;
          aspect-ratio: 64 / 27;
          background-position: 50% 50%;
          background-size: cover;
          background-color: var(--color-back);
          background-repeat: no-repeat;
          border: 2px solid var(--color-ui);
          position: relative;
          overflow: clip;
          image-rendering: initial;
        }
        dialog#${id} .splash-art-preview:hover {
          background-color: var(--color-selected);
          border: 2px solid var(--color-accent);
        }
        dialog#${id} .button-bar {
          display: none;
          background-color: var(--color-dark);
          opacity: 0.8;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30px;
          align-items: center;
          padding: 0 5px;
          gap: 8px;
        }
        dialog#${id} .splash-art-preview:hover > .button-bar {
          display: flex;
        }
        dialog#${id} .button-bar > i, dialog#${id} .button-bar > div > svg {
          cursor: pointer;
        }
        dialog#${id} .button-bar > div {
          height: 24px;
        }
        dialog#${id} .button-bar > div > svg {
          fill: var(--color-text);
          width: 24px;
        }
        dialog#${id} .button-bar > i:hover {
          color: var(--color-light);
        }
        dialog#${id} .button-bar > div > svg:hover {
          fill: var(--color-light);
        }
        dialog#${id} .back {
          cursor: pointer;
          position: absolute;
          top: 8px;
          left: 8px;
        }
        dialog#${id} .back:hover {
          color: var(--color-light);
        }
        dialog#${id} .applied {
          position: absolute;
          top: 0;
          right: 4px;
          color: var(--color-confirm);
          text-shadow: 0 0 4px black;
        }
      `)
      setTimeout(() => {
        $("#splash_screen").append(
          E("i").attr("id", "customise-splash-art").addClass("material-icons icon").text("settings").on("click", async e => {
            const transaction = db.result.transaction("images", "readonly")
            const get = transaction.objectStore("images").getAll()
            let images = await new Promise(fulfil => get.onsuccess = () => fulfil(get.result))
            if (!galleryImages) galleryImages = await fetch("https://api.github.com/repos/JannisX11/blockbench.net/contents/assets/gallery").then(e => e.json()).then(e => e.map(e => e.download_url)).catch(() => {})
            const dialog = new Dialog({
              id,
              title,
              buttons: [],
              component: {
                data: {
                  url: false,
                  file: false,
                  gallery: false,
                  error: false,
                  images,
                  galleryImages,
                  randomised: !localStorage.getItem("splash-art-randomisation-disabled")
                },
                methods: {
                  importFile() {
                    const file = document.getElementById("input-image").files[0]
                    if (file.size > 8388608) return this.error = "File too large. Max size is 8 MB"
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = e => {
                      if (!reader.result.startsWith("data:image/")) return this.error = "Invalid image"
                      addSplashArt(reader.result)
                    }
                    reader.onerror = e => this.error = e
                  },
                  async importURL() {
                    const url = document.getElementById("input-url").value
                    if (!url) return Blockbench.showQuickMessage("Please enter a URL")
                    try {
                      const r = await fetch(url)
                      if (!r.headers.get("Content-Type")?.startsWith("image/")) return this.error = "URL is not an image"
                      addSplashArt(url)
                    } catch {
                      return this.error = "Unable to get URL"
                    }
                  },
                  deleteImage(image) {
                    const transaction = db.result.transaction("images", "readwrite")
                    transaction.objectStore("images").delete(image)
                    images.splice(images.indexOf(images.find(e => e.image === image)), 1)
                    setSplashArt()
                  },
                  addSplashArt,
                  setCurrentSplashArt(image) {
                    setSplashArt(image)
                    Blockbench.showQuickMessage("Applied splash art")
                    if (localStorage.getItem("splash-art-randomisation-disabled")) {
                      const transaction = db.result.transaction("images", "readwrite")
                      const store = transaction.objectStore("images")
                      const index = store.index("applied")
                      const get = index.get(["true"])
                      get.onsuccess = () => {
                        if (get.result) store.put({image: get.result.image})
                        const transaction = db.result.transaction("images", "readwrite")
                        store.put({image, applied: "true"})
                      }
                      this.images.forEach(e => e.applied = false)
                      this.images.find(e => e.image === image).applied = true
                      this.$forceUpdate()
                    }
                  },
                  randomiseToggle() {
                    if (localStorage.getItem("splash-art-randomisation-disabled")) localStorage.removeItem("splash-art-randomisation-disabled")
                    else localStorage.setItem("splash-art-randomisation-disabled", true)
                  }
                },
                template: `
                  <div>
                    <div v-if="images.length" class="flex-center column">
                      <div id="splash-art-previews">
                        <div v-for="image in images" class="splash-art-preview" :style="{ backgroundImage: 'url(' + image.image + ')', imageRendering: image.imageRendering ?? 'smooth', backgroundSize: image.backgroundSize ?? 'cover', backgroundRepeat: image.backgroundRepeat ?? 'no-repeat'}">
                          <div class="button-bar">
                            <div title="Apply splash art" @click="setCurrentSplashArt(image.image)">
                              <svg viewBox="0 0 24 24"><path d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" /></svg>
                            </div>
                            <i class="material-icons icon" title="Edit splash art" @click="addSplashArt(image.image)">edit</i>
                            <div class="spacer"></div>
                            <i class="material-icons icon" title="Delete splash art" @click="deleteImage(image.image)">delete</i>
                          </div>
                          <i v-if="!randomised && image.applied" class="material-icons icon applied" title="Currently applied splash art">check</i>
                        </div>
                      </div>
                      <div class="flex-center" style="width:100%">
                        <input type="checkbox" id="randomise-splash-art" v-model="randomised" @change="randomiseToggle()">
                        <label for="randomise-splash-art">Randomise splash art</label>
                        <div class="spacer"></div>
                        <button class="flex-center" @click="images = []">
                          <i class="material-icons icon">add</i>
                          <span>Add new</span>
                        </button>
                      </div>
                    </div>
                    <div v-if="!images.length && !url && !file && !gallery" class="flex-center column">
                      <h2>Choose splash art source type</h2>
                      <div class="flex-center">
                        <button class="flex-center" @click="url = true">
                          <i class="material-icons icon">link</i>
                          <span>URL (faster)</span>
                        </button>
                        <button class="flex-center" @click="file = true">
                          <i class="material-icons icon">insert_drive_file</i>
                          <span>File (slower)</span>
                        </button>
                        <button v-if="galleryImages" class="flex-center" @click="gallery = true">
                          <i class="material-icons icon">photo_library</i>
                          <span>Blockbench Gallery</span>
                        </button>
                      </div>
                    </div>
                    <div v-if="url" class="flex-center column">
                      <i class="material-icons icon back" @click="url = false">arrow_back</i>
                      <h2>Enter image URL</h2>
                      <div class="flex-center">
                        <input id="input-url" type="text" class="dark_bordered focusable_input">
                        <button class="flex-center" v-on:click="importURL()">
                          <i class="material-icons icon">download</i>
                          <span>Import</span>
                        </button>
                      </div>
                    </div>
                    <div v-if="file" class="flex-center column">
                      <i class="material-icons icon back" @click="file = false">arrow_back</i>
                      <h2>Select image file</h2>
                      <label id="input-image-label" class="flex-center" for="input-image">
                        <i class="material-icons icon">download</i>
                        <span>Import Image</span>
                      </label>
                      <input id="input-image" type="file" accept="image/*" class="flex-center" @change="importFile()">
                    </div>
                    <div v-if="gallery" class="flex-center column">
                      <i class="material-icons icon back" @click="gallery = false">arrow_back</i>
                      <h2>Blockbench Gallery</h2>
                      <div id="splash-art-previews">
                        <div v-for="image in galleryImages" class="splash-art-preview" :style="{ backgroundImage: 'url(' + image + ')'}">
                          <div class="button-bar">
                            <i class="material-icons icon" title="Import splash art" @click="addSplashArt(image)">download</i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="error">
                      <div id="error-darken"></div>
                      <div id="error" class="flex-center column" id="error">
                        <h2>{{ error }}</h2>
                        <button class="flex-center" @click="error = false">
                          <span>Okay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                `
              }
            }).show()
          })
        )
      }, 100)
    },
    onunload() {
      styles.delete()
      splashArtStyles?.delete()
      $("#customise-splash-art").remove()
    },
    onuninstall() {
      const transaction = db.result.transaction("images", "readwrite")
      transaction.objectStore("images").clear()
      localStorage.removeItem("splash-art-randomisation-disabled")
    }
  })
  async function addSplashArt(image) {
    const aspectRatios = [
      "4:3",
      "16:9",
      "16:10",
      "21:9",
      "64:27"
    ]
    const imageRenderers = [
      "Auto",
      "Pixelated"
    ]
    const backgroundSizes = [
      "Auto",
      "Contain",
      "Cover"
    ]
    const backgroundRepeats = [
      "Repeat",
      "Repeat X",
      "Repeat Y",
      "No Repeat",
      "Space",
      "Round"
    ]
    const dialog = new Dialog({
      id: "splash_art_settings",
      title: "Splash art settings",
      lines: [`
        <style>
          dialog#splash_art_settings #splash-art-settings-preview {
            height: 200px;
            background-position: 50% 50%;
            margin: auto;
            background-color: var(--color-back);
          }
        </style>
        <div id="splash-art-settings-preview" style="background-image:url(${image})"></div>
        <br>
      `],
      form: {
        aspectRatio: {
          label: "Aspect Ratio",
          type: "select",
          options: Object.fromEntries(aspectRatios.map((e, i) => [i, e])),
          value: 4
        },
        imageRendering: {
          label: "Image Rendering",
          type: "select",
          options: Object.fromEntries(imageRenderers.map((e, i) => [i, e]))
        },
        backgroundSize: {
          label: "Background Size",
          type: "select",
          options: Object.fromEntries(backgroundSizes.map((e, i) => [i, e])),
          value: 2
        },
        backgroundRepeat: {
          label: "Background Repeat",
          type: "select",
          options: Object.fromEntries(backgroundRepeats.map((e, i) => [i, e])),
          value: 3
        }
      },
      onConfirm(data) {
        const transaction = db.result.transaction("images", "readwrite")
        transaction.objectStore("images").put({
          image,
          aspectRatio: aspectRatios[data.aspectRatio].replace(":", " / "),
          imageRendering: imageRenderers[data.imageRendering].toLowerCase(),
          backgroundSize: backgroundSizes[data.backgroundSize].toLowerCase(),
          backgroundRepeat: backgroundRepeats[data.backgroundRepeat].toLowerCase().replace(" ", "-")
        })
        setSplashArt(image)
        observer.disconnect()
      }
    }).show()
    const preview = $("dialog#splash_art_settings #splash-art-settings-preview")
    const updatePreview = () => preview.css({
      aspectRatio: aspectRatios[parseInt(dialog.form.aspectRatio.bar.find("bb-select").attr("value"))].replace(":", " / "),
      imageRendering: imageRenderers[parseInt(dialog.form.imageRendering.bar.find("bb-select").attr("value"))].toLowerCase(),
      backgroundSize: backgroundSizes[parseInt(dialog.form.backgroundSize.bar.find("bb-select").attr("value"))].toLowerCase(),
      backgroundRepeat: backgroundRepeats[parseInt(dialog.form.backgroundRepeat.bar.find("bb-select").attr("value"))].toLowerCase().replace(" ", "-")
    })
    updatePreview()
    const observer = new MutationObserver(updatePreview)
    document.querySelectorAll("dialog#splash_art_settings bb-select").forEach(e => observer.observe(e, { attributes: true }))
  }
  async function setSplashArt(image) {
    splashArtStyles?.delete()
    const transaction = db.result.transaction("images", "readonly")
    const store = transaction.objectStore("images")
    if (image) {
      const get = store.get(image)
      await new Promise(fulfil => get.onsuccess = () => {
        image = get.result
        fulfil()
      })
    }
    if (!image && localStorage.getItem("splash-art-randomisation-disabled")) {
      const index = store.index("applied")
      const get = index.get(["true"])
      await new Promise(fulfil => get.onsuccess = () => {
        image = get.result
        fulfil()
      })
      if (!image) {
        const get = store.getAll()
        await new Promise(fulfil => get.onsuccess = () => {
          image = get.result?.[0]
          fulfil()
        })
      }
    }
    if (!image) {
      const get = store.getAll()
      await new Promise(fulfil => get.onsuccess = () => {
        if (get.result.length) image = get.result[Math.floor(Math.random() * get.result.length)]
        fulfil()
      })
    }
    if (image) setBackgroundImage(image)
  }
  function setBackgroundImage(data) {
    splashArtStyles = Blockbench.addCSS(`
      #splash_screen > .graphic {
        background-image: url("${data.image}")!important;
        aspect-ratio: ${data.aspectRatio ?? "64 / 27"}!important;
        image-rendering: ${data.imageRendering ?? "initial"}!important;
        background-size: ${data.backgroundSize ?? "cover"}!important;
        background-repeat: ${data.backgroundRepeat ?? "no-repeat"}!important;
      }
      #splash_screen > .graphic > p {
        display: none;
      }
    `)
  }
})()