(function () {
  var blockstates;
  var save;
  var remove;
  var exporter;
  var clear;
  Plugin.register("java_animator", {
    title: "Java Animator",
    author: "Blocks_n_more",
    icon: "fas.fa-draw-polygon",
    description: "A simple model animator for Minecraft Java Edition",
    version: "1.0.0",
    variant: "both",
    onload() {
      blockstates = [];
      LoadSaver();
      LoadDeleters();
      LoadExporter();
      new BarMenu("ja_menu", ["ja_save", "ja_remove", "ja_clear"], {
        name: "JavaAnimator",
        condition: {
          formats: ["java_block"],
        },
      });
    },
    onunload() {
      save.delete();
      remove.delete();
      exporter.delete();
      clear.delete();
    },
  });

  function LoadSaver() {
    save = new Action("ja_save", {
      name: "Save model state",
      description: "Saves the current model state to be exported later",
      icon: "fas.fa-save",
      condition: {
        formats: ["java_block"],
      },
      click() {
        blockstates.push(Format ? Format.codec.compile() : "");
        Blockbench.showQuickMessage("Saved model!", 2000);
      },
    });
    MenuBar.addAction(save, "ja_menu");
  }

  function LoadDeleters() {
    remove = new Action("ja_remove", {
      name: "Remove latest model state",
      description: "Removes the latest model state",
      icon: "fas.fa-trash",
      condition: {
        formats: ["java_block"],
      },
      click() {
        if (blockstates.length < 1)
          return Blockbench.showQuickMessage("No models found!", 2000);
        blockstates.splice(blockstates.length - 1, 1);
        Blockbench.showQuickMessage("Removed model!", 2000);
      },
    });
    MenuBar.addAction(remove, "ja_menu");

    clear = new Action("ja_clear", {
      name: "Clear model states",
      description: "Clears all the models saved",
      icon: "fas.fa-broom",
      condition: {
        formats: ["java_block"],
      },
      click() {
        if (blockstates.length < 1)
          return Blockbench.showQuickMessage("No models found!", 2000);
        new Dialog({
          title: "Confirm",
          form: {
            confirmed: {
              type: "checkbox",
              label: "Are you sure you want to clear?",
            },
          },
          onConfirm(formData) {
            this.hide();
            if (!formData.confirmed) return;
            blockstates = [];
            Blockbench.showQuickMessage("Removed all models!", 2000);
          },
        }).show();
      },
    });
    MenuBar.addAction(clear, "ja_menu");
  }

  function LoadExporter() {
    exporter = new Action("ja_export_models", {
      name: "Export JA models as ZIP",
      description: "Exports the models as a completed ZIP",
      icon: "fas.fa-file-archive",
      condition: {
        formats: ["java_block"],
      },
      click() {
        if (blockstates.length < 2)
          return Blockbench.showQuickMessage(
            "You need at least 2 models!",
            2000
          );
        else
          new Dialog({
            id: "ja_export_itemname",
            title: "JA Exporter",
            form: {
              item: { label: "Item to save the model as", type: "text" },
              name: {
                label: "The name of the project",
                type: "text",
                value: "JAModel",
              },
            },
            onConfirm(formData) {
              if (!formData.item || !formData.name)
                return Blockbench.showQuickMessage(
                  "You need to provide a name and item!",
                  2000
                );
              // May add datapack generation in the future
              this.hide();
              Blockbench.showQuickMessage("Exporting!", 2000);
              var zip = JSZip();
              zip.file(
                "readme.md",
                [
                  "# Created using JavaAnimator for BlockBench",
                  "## How to use:",
                  " - Copy the models folder into `yourpack/minecraft/assets`",
                  " - Add all your textures to `yourpack/minecraft/textures`",
                  " - Reload textures",
                ].join("\n")
              );
              let predicates = [];
              for (let i in blockstates) {
                if (isNaN(i)) continue;
                predicates.push({
                  predicate: { custom_model_data: i * 1 + 1 },
                  model: formData.name + "/model" + i,
                });
                zip.file(
                  "model/" + formData.name + "/model" + i + ".json",
                  JSON.stringify(JSON.parse(blockstates[i]))
                );
              }
              zip.file(
                "model/item/" + formData.item + ".json",
                JSON.stringify({
                  parent: "item/generated",
                  textures: {
                    layer0: "item/" + formData.item,
                  },
                  overrides: predicates,
                })
              );
              zip.generateAsync({ type: "blob" }).then((files) => {
                Blockbench.export({
                  type: "Zip Archive",
                  extensions: ["zip"],
                  name: "JavaAnimator export",
                  startpath: ModelMeta.export_path,
                  content: files,
                  savetype: "zip",
                });
              });
            },
          }).show();
      },
    });
    MenuBar.addAction(exporter, "file.export");
  }
})();
