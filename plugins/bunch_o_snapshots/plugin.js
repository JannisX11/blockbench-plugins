/// <reference path="../../types/index.d.ts" />

// Set width and height options

(function () {
  doLog = (str) => {
    console.log(`[BoS] ${str}`);
  };
  var pluginData = {
    name: "Bunch o' Screenshots",
  };
  const fs = require("fs");
  const os = require("os");
  const path = require("path");
  var runAction, runKeybind, options, allSaves;
  var BosSettings;

  var currentSettings;
	const defaultSettings = {
		devMode: false,
		outputDirectory: null,
		saveMode: "direct",
	};

  function deleteSettings() {
		delete Settings.structure["BoSetings"];
		delete Settings.dialog.sidebar.pages["BoSetings"];
		Settings.dialog.sidebar.build();
    for (const name in BosSettings) {
      BosSettings[name]?.delete?.();
      doLog(`Deleted setting: ${name}`);
    }
    BosSettings = null;
  }

  function updateCurrentSettings() {
    function invalidDirectoryFallback(fallbackDirectory) {
      Settings.openDialog();
      Settings.dialog.close(0);
      BosSettings["BoSoutputDirectory"].set(fallbackDirectory);
      Blockbench.showMessageBox({
        confirm: 1,
        cancel: 0,
        title: "[BoS] Invalid directory",
        message:
          "The given directory is invalid, the previous set directory was restored in settings.",
        icon: "report",
        width: electron.getCurrentWindow().getContentBounds().width / 10,
      });
    }
    currentSettings.devMode = BosSettings["BoSdevMode"].value || false;
    if (!BosSettings["BoSoutputDirectory"].value) {
      const homeDir = os.homedir();
      const docsDirectory = path.join(homeDir, "Documents");
      invalidDirectoryFallback(docsDirectory);
    } else
      fs.stat(BosSettings["BoSoutputDirectory"].value, (err, stats) => {
        if (err) {
          if (err.code === "ENOENT") {
            invalidDirectoryFallback(currentSettings.outputDirectory);
            doLog("Directory does not exist.");
          } else {
            invalidDirectoryFallback(currentSettings.outputDirectory);
            console.error("Error checking directory:", err);
          }
        } else {
          if (stats.isDirectory()) {
            currentSettings.outputDirectory = BosSettings["BoSoutputDirectory"].value;
          } else {
            invalidDirectoryFallback(currentSettings.outputDirectory);
            doLog("Path exists, but it is not a directory.");
          }
        }
      });
    currentSettings.saveMode = BosSettings["BoSsaveMode"].value;
  }

  function loadSettings() {
		currentSettings = {
			devMode: currentSettings?.devMode || defaultSettings.devMode,
			outputDirectory: currentSettings?.outputDirectory || defaultSettings.outputDirectory,
			saveMode: currentSettings?.saveMode || defaultSettings.saveMode
		};
    Settings.openDialog();
    Settings.dialog.close(0);

    Settings.addCategory(
      "BoSetings",
      (data = {
        name: pluginData.name,
      })
    );
    if (BosSettings == null) {
      doLog("create settings");
      BosSettings = {
        BoSdevMode: new Setting("BoSdevMode", {
          name: "BoSdevMode",
          description:
            "Developer mode, disables the actualy usage of the plugin, testing purposes only, DO NOT USE.",
          category: "BoSetings",
          value: currentSettings.devMode,
          type: "toggle",
          onChange(value) {
            updateCurrentSettings();
          },
        }),
        BoSoutputDirectory: new Setting("BoSoutputDirectory", {
          name: "BoSoutputDirectory",
          description: "Where all your screenshots will be saved.",
          category: "BoSetings",
          value: currentSettings.outputDirectory,
          type: "text",
          onChange(value) {
            updateCurrentSettings();
          },
        }),
        BoSoutputDirectorySelection: new Setting(
          "BoSoutputDirectorySelection",
          {
            name: "Change directory",
            description:
              "Open a directory selection window to change your BoSoutputDirectory",
            category: "BoSetings",
            value: false,
            type: "click",
            click: function () {
              let dialog = new Dialog({
                title: "WIP",
                id: "dirSelectionWIP",
                width: img.naturalWidth + 50,
                lines: [
                  "This is a work in progress...<br>Can't change the directory like this yet, you'll have to write the directory manually.",
                ],
                buttons: ["dialog.close"],
                onButton(result_index) {
                  dialog.delete();
                  return true;
                },
              });
              dialog.show();
              setTimeout(() => {
                dialog.close(0);
                dialog.delete();
              }, 10000);
            },
          }
        ),
        BoSsaveMode: new Setting("BoSsaveMode", {
          name: "BoSsaveMode",
          description:
            "Set the screenshot saving mode, more info about modes in Plugin's documentation.",
          category: "BoSetings",
          value: currentSettings.saveMode,
          type: "select",
          options: {
            direct: "direct",
            justSave: "justSave",
            fullConfirmation: "fullConfirmation",
          },
          onChange(value) {
            updateCurrentSettings();
          },
        }),
      };
    }
    updateCurrentSettings();
    Settings.openDialog();
    Settings.dialog.close(0);
  }

  // When updating, apply meta data changes to plugins.json entry!
  BBPlugin.register("plugin", {
    title: pluginData.name,
    icon: "icon.png",
    author: "0Key",
    description:
      "Take screenshots of all your models by just pressing one button (or hotkey!)",
    tags: ["screenshots", "automation"],
    version: "0.0.2",
    min_version: "4.9.0",
    variant: "both",
    onload() {
      loadSettings();
      allSaves = [];
      doLog("Plugin loaded");

      function notifyAllDone() {
        Blockbench.showMessageBox({
          confirm: 1,
          cancel: 0,
          title: "All screenshots created!",
          message: `Paths for screenshots:\n${allSaves
            .map((saved) => `<br>- ${saved}`)
            .join("")}`,
          icon: "icon-saved",
          width: electron.getCurrentWindow().getContentBounds().width / 2,
        });
      }

      function takeScreenshot() {
        if (currentSettings.devMode !== false) return;
        let savePath;
        options = {
          width: 320,
          height: 320,
        };

        let preview = main_preview;
        let prevTarget = new THREE.Vector3();
        preview.camera.getWorldDirection(prevTarget);
        const oldData = {
          isOrtho: preview.isOrtho,
          axis: preview.camOrtho.axis,
          position: preview.camera.position.clone(),
          target: prevTarget,
        };
        const captureData = {
          isOrtho: true,
          axis: null,
          position: new THREE.Vector3(-1, 1, -1),
          target: new THREE.Vector3(0, 0, 0),
        };
        function rollbackPreview() {
          preview.isOrtho = oldData.isOrtho;
          preview.camOrtho.axis = oldData.axis;
          preview.camera.position.copy(oldData.position);
          preview.camera.lookAt(oldData.target);
        }
        function fixPreview() {
          preview.isOrtho = captureData.isOrtho;
          preview.camOrtho.axis = captureData.axis;
          preview.camera.position.copy(captureData.position);
          preview.camera.lookAt(captureData.target);
          preview.resize();
        }

        let cb = null;
        fixPreview();
        Canvas.withoutGizmos(function () {
          preview.render();

          let frame = new CanvasFrame(preview.canvas);
          frame.autoCrop();

          if (options.width && options.height) {
            let new_frame = new CanvasFrame(options.width, options.height);
            let width = frame.width;
            let height = frame.height;
            if (width > options.width) {
              height /= width / options.width;
              width = options.width;
            }
            if (height > options.height) {
              width /= height / options.height;
              height = options.height;
            }
            new_frame.ctx.drawImage(
              frame.canvas,
              (options.width - width) / 2,
              (options.height - height) / 2,
              width,
              height
            );
            frame = new_frame;
          }

          let dataUrl = frame.canvas.toDataURL();
          let img = new Image();
          img.src = dataUrl;
          img.className = "allow_default_menu checkerboard";
          const projectName = Project
            ? Project.name.replace(/\.geo$/, "")
            : "screenshot";
          savePath = `${currentSettings.outputDirectory}\\${projectName}.png`;

          // Show screenshot (+options to handle it)
          function fullConfirmation() {
            Screencam.returnScreenshot(dataUrl, cb);
          }

          // Confirm saving...
          function justSave() {
            let is_gif = dataUrl.substr(5, 9) == "image/gif";
            Blockbench.export(
              {
                startpath: savePath,
                type: tl("data.image"),
                // extensions: [is_gif ? 'gif' : 'png'],
                extensions: ["png"],
                name: Project
                  ? Project.name.replace(/\.geo$/, "")
                  : "screenshot",
                // content: is_gif ? (isApp ? Buffer(dataUrl.split(',')[1], 'base64') : blob) : dataUrl,
                content: dataUrl,
                // savetype: is_gif ? 'binary' : 'image',
                savetype: "image",
                resource_id: "screenshot",
              },
              function (path) {
                doLog(`Saved in ${path}`);
              }
            );
          }
          // Direct saving into directory from settings
          function directSave() {
            // Direct save
            Blockbench.writeFile(
              savePath,
              {
                content: dataUrl,
                savetype: "image",
              },
              function (path) {
                doLog(`Autosaved in ${path}`);
              }
            );
          }
          switch (currentSettings.saveMode) {
            case "direct":
              directSave();
              break;
            case "justSave":
              justSave();
              break;
            case "fullConfirmation":
              fullConfirmation();
              break;
          }
        });
        doLog("save triggered!");
        rollbackPreview();
        allSaves = [...allSaves, savePath];
      }

      function doForProjects(func) {
        Blockbench.setStatusBarText(`Creating screenshots... `);
        const initial = Project;
        const numProjects = ModelProject.all.length;

        if (numProjects < 1) {
          Blockbench.showMessageBox({
            confirm: 1,
            cancel: 0,
            title: "Open a project",
            message:
              "You need at least 1 project currently opened to use Bunch o' Screenshots",
            icon: "icon-objects",
          });
          return;
        }

        let currentProject = 1;

        ModelProject.all.forEach((e) => {
          Blockbench.setStatusBarText(
            `Processing screenshot (${currentProject}/${numProjects})`
          );
          Blockbench.setProgress(
            parseFloat((currentProject / numProjects).toFixed(3))
          );
          e.select();
          func();
          currentProject++;
        });
        initial.select();
        if (currentSettings.devMode !== false)
          doLog("Process finished in dev mode");
        else notifyAllDone();
        savePath = "";

        Blockbench.setStatusBarText(`All screenshots done!`);
        setTimeout(() => {
          Blockbench.setProgress();
          Blockbench.setStatusBarText();
        }, 3000);
      }

      runAction?.delete?.();
      runKeybind?.delete?.();
      runKeybind = new Keybind({ key: "s", shift: true, alt: true });
      runAction = new Action("runBos", {
        name: "Screenshot all models",
        description: "Take a Screenshot of all currently opened models.",
        icon: "photo_camera",
        // condition: null,
        category: "tools",
        keybind: runKeybind,
        click: () => doForProjects(takeScreenshot),
        // color: "",
        // linked_setting: "",
        // children: [],
        // label: "",
      });
      MenuBar.addAction(runAction, "tools");
    },
    onunload() {
      runAction?.delete?.();
      runKeybind?.delete?.();
    },
    oninstall() {
      loadSettings();
      doLog("Installed!");
    },
    onuninstall() {
      // Delete our settings from user's config
      // actually just aesthetics, bc BB handles it anyway after restart.
      deleteSettings();
    },
  });
})();
