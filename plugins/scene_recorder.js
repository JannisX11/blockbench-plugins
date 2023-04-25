(async function () {
  const child_process = require("child_process")
  const path = require("path")

  let action, dialog
  let ffmpegPath
  const id = "scene_recorder"
  const name = "Scene Recorder"
  const icon = "video_camera_back"
  const E = s => $(document.createElement(s))
  Plugin.register(id, {
    title: name,
    icon,
    author: "Ewan Howell",
    description: "Add a new scene recorder where you can record your model in a large variety of formats.",
    about: "This plugin adds a new scene recorder that allows you to record your model and scene in a large variety of formats.\n\nUsing this plugin is very similar to using the built-in GIF Recorder.\n\nYou can find the `Record Scene...` button in the `View > Screenshot` menu.\n\n## Formats\n- **GIF**\n - Record animated GIFs in higher quality than the built-in GIF Recorder\n- **MP4**\n - Record an MP4 video\n- **WebM**\n - Record a WebM video\n- **WebP**\n - Record an animated WebP image\n- **APNG**\n - Record an animated PNG image\n- **PNG Image Sequence**\n - Output each frame as an individual PNG image",
    tags: ["Recording", "Media"],
    version: "1.1.0",
    min_version: "4.5.2",
    variant: "desktop",
    async onload() {
      if (await checkFFmpeg()) return
      dialog = new Dialog({
        id: "create_ffmpeg",
        title: "Record Scene",
        draggable: true,
        form: {
          format: {
            label: "Format",
            type: "select",
            default: "gif",
            options: {
              gif: "Animated GIF",
              mp4: "MP4 Video",
              webm: "WebM Video",
              webp: "Animated WebP",
              apng: "Animated PNG",
              png: "PNG Image Sequence"
            }
          },
          mp4Codec: {
            label: "Codec",
            type: "select",
            default: "libx264",
            options: {
              libx264: "H.264",
              libx265: "H.265",
              "libvpx-vp9": "VP9"
            },
            condition: form => ["mp4"].includes(form.format)
          },
          "_1": "_",
          lengthMode: {
            label: "dialog.create_gif.length_mode",
            type: "select",
            default: "seconds",
            options: {
              seconds: "dialog.create_gif.length_mode.seconds",
              frames: "dialog.create_gif.length_mode.frames",
              animation: "dialog.create_gif.length_mode.animation",
              turntable: "dialog.create_gif.length_mode.turntable",
            }
          },
          length: {
            label: "dialog.create_gif.length",
            type: "number",
            value: 5,
            min: 0.1,
            max: 24000,
            step: 0.25,
            condition: form => ["seconds", "frames"].includes(form.lengthMode)
          },
          fps:  {
            label: "dialog.create_gif.fps",
            type: "number",
            value: 24,
            min: 0.5,
            max: 120
          },
          "_2": "_",
          pixelate: {
            label: "dialog.create_gif.pixelate",
            type: "range",
            value: 1,
            min: 1,
            max: 8,
            step: 1
          },
          color:  {
            label: "dialog.create_gif.color",
            type: "color",
            value: "#00000000"
          },
          bg_image: {
            label: "dialog.create_gif.bg_image",
            type: "file",
            extensions: ["png"],
            readtype: "image",
            filetype: "PNG"
          },
          turn: {
            label: "dialog.create_gif.turn",
            type: "number",
            value: 0,
            min: -90,
            max: 90,
            description: "dialog.create_gif.turn.desc"
          },
          play:   {
            label: "dialog.create_gif.play",
            type: "checkbox",
            condition: () => Animator.open
          }
        },
        onConfirm: formData => {
          dialog.hide()
          $("#gif_recording_frame").remove()

          const background = formData.color.toHex8String() != "#00000000" ? formData.color.toHexString() : undefined
          const lengthMode = formData.lengthMode
          const length = limitNumber(formData.length, 0.1, 24000) ?? 10
          const fps = limitNumber(formData.fps, 0.1, 30) ?? 24
          const interval = fps ? (1000 / fps) : 100
          const preview = Preview.selected
          const animation = Animation.selected
          let frames = 0
          let recording = false
          let loop = null
          let crop = Screencam.gif_crop
          let canvases = []

          let backgroundImage
          if (formData.bg_image) {
            backgroundImage = new Image()
            backgroundImage.src = formData.bg_image
            backgroundImage.onerror = () => backgroundImage = null
          }

          function getProgress() {
            switch (lengthMode) {
              case "seconds":
                return interval * frames / (length * 1000)
              case "frames":
                return frames / length
              case "turntable":
                return Math.abs(preview.controls.autoRotateProgress) / (2 * Math.PI)
              case "animation":
                return Timeline.time / (animation.length - (interval / 1000))
            }
          }

          function updateCrop() {
            crop.left = Math.clamp(crop.left, 0, preview.width / 2 - 20)
            crop.right = Math.clamp(crop.right, 0, preview.width / 2 - 20)
            crop.top = Math.clamp(crop.top, 0, preview.height / 2 - 20)
            crop.bottom = Math.clamp(crop.bottom, 0, preview.height / 2 - 20)
            frame.style.top = crop.top + "px"
            frame.style.left = crop.left + "px"
            frame.style.right = crop.right + "px"
            frame.style.bottom = crop.bottom + "px"
            frame_label.textContent = Math.round(Math.clamp((preview.width - crop.left - crop.right) * window.devicePixelRatio, 24, 4000)) + " x " + Math.round(Math.clamp((preview.height - crop.top - crop.bottom) * window.devicePixelRatio, 24, 4000))
          }

          const frame = Interface.createElement("div", { id: "gif_recording_frame" })
          preview.node.append(frame)

          const frame_label = Interface.createElement("div", { id: "gif_recording_frame_label" })
          frame.append(frame_label)

          function drag(e1) {
            let crop_original = Object.assign({}, crop)
            function move(e2) {
              convertTouchEvent(e2)
              crop.left = crop_original.left + (e2.clientX - e1.clientX)
              crop.right = crop_original.right - (e2.clientX - e1.clientX)
              crop.top = crop_original.top + (e2.clientY - e1.clientY)
              crop.bottom = crop_original.bottom - (e2.clientY - e1.clientY)
              updateCrop()
            }
            function stop(e3) {
              removeEventListeners(document, "mousemove touchmove", move)
              removeEventListeners(document, "mouseup touchend", stop)
            }
            addEventListeners(document, "mousemove touchmove", move)
            addEventListeners(document, "mouseup touchend", stop)
          }
          addEventListeners(frame_label,  "mousedown touchstart", e => drag(e, "right", "top"))

          const resizer_top_right = Interface.createElement("div", {
            style: "top: -2px; right: -2px;",
            class: "gif_recording_frame_handle gif_resize_ne"
          }, Blockbench.getIconNode("arrow_back_ios"))
          const resizer_top_left = Interface.createElement("div", {
            style: "top: -2px; left: -2px;",
            class: "gif_recording_frame_handle gif_resize_nw"
          }, Blockbench.getIconNode("arrow_back_ios"))
          const resizer_bottom_right = Interface.createElement("div", {
            style: "bottom: -2px; right: -2px;",
            class: "gif_recording_frame_handle gif_resize_se"
          }, Blockbench.getIconNode("arrow_back_ios"))
          const resizer_bottom_left = Interface.createElement("div", {
            style: "bottom: -2px; left: -2px;",
            class: "gif_recording_frame_handle gif_resize_sw"
          }, Blockbench.getIconNode("arrow_back_ios"))

          function resize(e1, x_value, y_value) {
            let crop_original = Object.assign({}, crop)
            function move(e2) {
              convertTouchEvent(e2)
              crop[x_value] = crop_original[x_value] + (e2.clientX - e1.clientX) * (x_value == "left" ? 1 : -1)
              crop[y_value] = crop_original[y_value] + (e2.clientY - e1.clientY) * (y_value == "top" ? 1 : -1)
              updateCrop()
            }
            function stop(e3) {
              removeEventListeners(document, "mousemove touchmove", move)
              removeEventListeners(document, "mouseup touchend", stop)
            }
            addEventListeners(document, "mousemove touchmove", move)
            addEventListeners(document, "mouseup touchend", stop)
          }
          addEventListeners(resizer_top_right, "mousedown touchstart", e => resize(e, "right", "top"))
          addEventListeners(resizer_top_left, "mousedown touchstart", e => resize(e, "left", "top"))
          addEventListeners(resizer_bottom_right, "mousedown touchstart", e => resize(e, "right", "bottom"))
          addEventListeners(resizer_bottom_left, "mousedown touchstart", e => resize(e, "left", "bottom"))
          frame.append(resizer_top_right)
          frame.append(resizer_top_left)
          frame.append(resizer_bottom_right)
          frame.append(resizer_bottom_left)

          updateCrop()

          const cancel = () => frame.remove()

          function startRecording() {
            $("#gif_recording_frame").addClass("recording")

            const width = Math.clamp((preview.width - crop.left - crop.right) * window.devicePixelRatio, 24, 4000)
            const height = Math.clamp((preview.height - crop.top - crop.bottom) * window.devicePixelRatio, 24, 4000)

            if (formData.turn) {
              preview.controls.autoRotate = true
              preview.controls.autoRotateSpeed = formData.turn
              preview.controls.autoRotateProgress = 0
            } else if (lengthMode == "turntable") {
              lengthMode = "seconds"
            }
        
            if (formData.play && animation) {
              Timeline.time = 0
              Timeline.start()
              if (!animation.length) lengthMode = "seconds";
            } else if (lengthMode == "animation") {
              lengthMode = "seconds"
            }

            const NoAAPreview = Screencam.NoAAPreview
            NoAAPreview.resize(
              preview.width * window.devicePixelRatio / formData.pixelate,
              preview.height * window.devicePixelRatio / formData.pixelate
            )
            NoAAPreview.setProjectionMode(preview.isOrtho)
        
            Blockbench.setStatusBarText("Recording...")

            recording = true;
            loop = setInterval(() => {
              frames++
              const canvas = E("canvas").attr({
                width: width,
                height: height
              })[0]
              const ctx = canvas.getContext("2d")
              ctx.imageSmoothingEnabled = false
              if (background) {
                ctx.fillStyle = background
                ctx.fillRect(0, 0, canvas.width, canvas.height)
              }
              if (backgroundImage) ctx.drawImage(backgroundImage, 0, 0, width, height)
              Canvas.withoutGizmos(() => {
                NoAAPreview.controls.target.copy(preview.controls.target)
                NoAAPreview.camera.position.copy(preview.camera.position)
                if (NoAAPreview.isOrtho) {
                  NoAAPreview.camera.zoom = preview.camera.zoom
                  NoAAPreview.camera.top = preview.camera.top
                  NoAAPreview.camera.bottom = preview.camera.bottom
                  NoAAPreview.camera.right = preview.camera.right
                  NoAAPreview.camera.left = preview.camera.left
                  NoAAPreview.camOrtho.updateProjectionMatrix()
                }

                NoAAPreview.render()
                ctx.drawImage(
                  NoAAPreview.canvas,
                  Math.round(-crop.left * window.devicePixelRatio),
                  Math.round(-crop.top * window.devicePixelRatio),
                  Math.round(NoAAPreview.canvas.width * formData.pixelate),
                  Math.round(NoAAPreview.canvas.height * formData.pixelate)
                )
                canvases.push(canvas)
              })
              Blockbench.setProgress(getProgress())
              frame_label.textContent = frames + " - " + (interval * frames / 1000).toFixed(2) + "s";

              if (getProgress() >= 1) {
                endRecording(true)
                return
              }
            }, interval)
          }

          async function endRecording(render) {
            if (!recording) return
            recording = false
            clearInterval(loop)
            if (frame) frame.remove()
            if (Animator.open && Timeline.playing) Timeline.pause()
            if (formData.turn) preview.controls.autoRotate = false
            Blockbench.setProgress()
            Blockbench.setStatusBarText("Processing...")
            if (render) {
              const buffers = []
              for (const [i, canvas] of canvases.entries()) {
                const blob = await new Promise(canvas.toBlob.bind(canvas))
                buffers.push(Buffer.from(await blob.arrayBuffer()))
              }
              if (formData.format === "png") {
                const dir = electron.dialog.showOpenDialogSync({
                  properties: ["openDirectory"]
                })
                if (!dir) return
                const length = (buffers.length - 1).toString().length
                for (const [i, buffer] of buffers.entries()) {
                  fs.writeFileSync(path.join(dir[0], `${Project.name}_${i.toString().padStart(length, 0)}.png`), Buffer.from(buffer))
                }
                Blockbench.showQuickMessage(`Exported frames to ${dir[0]}`)
              } else {
                let name, extension, command
                if (formData.format === "mp4") {
                  name = "MP4 Video"
                  extension = "mp4"
                  command = ["-c:v", formData.mp4Codec, "-pix_fmt", "yuv420p", "-vf", "scale=floor(iw/2)*2:floor(ih/2)*2", "-an"]
                } else if (formData.format === "gif") {
                  name = "Animated PNG"
                  extension = "gif"
                  command = ["-lavfi", "split[v][pg];[pg]palettegen=reserve_transparent=1:stats_mode=single[pal];[v][pal]paletteuse=new=1:dither=bayer:bayer_scale=3"]
                } else if (formData.format === "apng") {
                  name = "Animated PNG"
                  extension = "png"
                  command = ["-plays", 0, "-f", "apng"]
                } else if (formData.format === "webm") {
                  name = "WebM Video"
                  extension =  "webm"
                  command = ["-c:v", "libvpx-vp9", "-crf", "10", "-b:v", "0", "-an"]
                } else if (formData.format === "webp") {
                  name = "Animated WebP"
                  extension =  "webp"
                  command = ["-loop", 0]
                }
                const file = electron.dialog.showSaveDialogSync({
                  filters: [{
                    name,
                    extensions: [extension]
                  }],
                  defaultPath: `${Project.name}.${extension}`
                })
                if (!file) return
                Blockbench.showQuickMessage("Processing...")
                await ffmpeg(buffers, ["-framerate", fps, "-i", "-", ...command, "-y", file])
                Blockbench.showQuickMessage(`Saved as ${file}`)
              }
            }
            Blockbench.setProgress()
            Blockbench.setStatusBarText()
          }

          let controls = Interface.createElement("div", { id: "gif_recording_controls" })
          frame.append(controls)

          let record_button = Interface.createElement("div", { class: "tool gif_record_button" }, Blockbench.getIconNode("fiber_manual_record", "var(--color-close)"))
          record_button.addEventListener("click", event => startRecording())
          controls.append(record_button)

          let stop_button = Interface.createElement("div", { class: "tool" }, Blockbench.getIconNode("stop"))
          stop_button.addEventListener("click", event => recording ? endRecording(true) : cancel())
          controls.append(stop_button)

          let cancel_button = Interface.createElement("div", { class: "tool" }, Blockbench.getIconNode("clear"))
          cancel_button.addEventListener("click", event => recording ? endRecording(false) : cancel())
          controls.append(cancel_button)
        }
      })
      action = new Action("fmpeg-action", {
        name: "Record Scene...",
        icon,
        click: () => dialog.show(),
        condition: () => Project
      })
      MenuBar.addAction(action, "view")
    },
    onunload() {
      action?.delete()
      dialog.close()
    }
  })

  function spawn(exe, args, data = { stdio: "ignore" }) {
    const p = child_process.spawn(exe, args, data)
    p.promise = new Promise((fulfil, reject) => {
      p.on("close", fulfil)
      p.on("error", reject)
    })
    return p
  }

  async function ffmpeg(frames, args) {
    const p = spawn(ffmpegPath, args, {
      stdio: ["pipe", "ignore", "pipe"]
    })
    for (const frame of frames) p.stdin.write(frame)
    p.stdin.end()
    let out = ""
    for await (const chunk of p.stderr) out += chunk
    console.log(out)
    return p.promise
  }

  async function checkFFmpeg() {
    const paths = [
      localStorage.getItem("ffmpegPath"),
      "ffmpeg",
      "/usr/local/bin/ffmpeg"
    ].filter(e => e)
    for (const path of paths) {
      const p = spawn(path, [])
      try {
        await p.promise
        ffmpegPath = path
        return
      } catch {}
    }
    const process = require("process")
    dialog = new Blockbench.Dialog({
      id: "no-ffmpeg",
      title: "Missing FFmpeg",
      width: 610,
      buttons: [],
      lines: [`
        <style>
          dialog#no-ffmpeg .dialog_content {
            margin-top: 0;
            overflow-x: clip;
          }
          dialog#no-ffmpeg .ffmpeg-button {
            background-color: var(--color-button);
            color: var(--color-text)!important;
            min-height: 32px;
            padding: 0 16px;
            text-decoration: none!important;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin: 10px 0 20px;
          }
          dialog#no-ffmpeg .ffmpeg-button:hover {
            background-color: var(--color-accent);
            color: var(--color-accent_text) !important;
          }
          dialog#no-ffmpeg .ffmpeg-button:active {
            text-decoration: underline!important;
          }
          dialog#no-ffmpeg .button-bar {
            display: flex;
            justify-content: flex-end;
            gap: 3px;
            margin-top: 20px;
          }
          dialog#no-ffmpeg .spacer {
            flex: 1;
          }
        </style>
        <h1>Missing FFmpeg</h1>
        <p>FFmpeg is required to use this plugin</p>
        <a class="ffmpeg-button" href="https://ffmpeg.org/download.html">Download FFmpeg</a>
        ${process.platform === "linux" ? "" : `<iframe width="560" height="315" src="${process.platform === "darwin" ? "https://www.youtube.com/embed/H1o6MWnmwpY" : "https://www.youtube.com/embed/jZLqNocSQDM"}" frameborder="0" allow="" allowfullscreen></iframe>`}
        <div class="button-bar">
          <button id="ffmpeg-select">Select FFmpeg executable manually</button>
          <div class="spacer"></div>
          <button id="ffmpeg-reload">Reload plugin</button>
          <button id="ffmpeg-close">Close</button>
        </div>
      `]
    }).show()
    $("#ffmpeg-select").on("click", async e => {
      const file = electron.dialog.showOpenDialogSync()
      if (!file) return
      try {
        const p = spawn(file[0], [], {
          stdio: ["ignore", "ignore", "pipe"]
        })
        let out = ""
        for await (const chunk of p.stderr) out += chunk
        if (!out.startsWith("ffmpeg")) return Blockbench.showQuickMessage("Invalid FFmpeg file")
      } catch {
        return Blockbench.showQuickMessage("Invalid FFmpeg file")
      }
      localStorage.setItem("ffmpegPath", file[0])
      dialog.close()
      Plugins.all.find(e => e.id === id).reload()
    })
    $("#ffmpeg-reload").on("click", e => {
      dialog.close()
      Plugins.all.find(e => e.id === id).reload()
      Blockbench.showQuickMessage(`Reloaded ${name}`)
    })
    $("#ffmpeg-close").on("click", e => dialog.close())
    return true
  }
})()