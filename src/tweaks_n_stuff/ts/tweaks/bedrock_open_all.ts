import { ToggleTweak } from "./base";

class BedrockOpenAllTweak extends ToggleTweak {
  constructor() {
    super("bedrock_open_all", { author: "legopitstop", category: "interface" });
  }

  private openAll(dialog: Dialog): void {
    const selection = dialog.content_vue as typeof dialog.content_vue & {
      geometries?: { name: string; object: any }[];
      open?: (geometry: { name: string; object: any }) => void;
    };
    const geometries = selection?.geometries;
    if (!geometries?.length || !selection.open) return;

    const codec = Format.codec;
    const path = Project.export_path;
    const formatVersion = codec.id === "bedrock_old" ? "1.10.0" : "1.12.0";
    const entries = geometries.slice();

    // The dialog's own open method imports into the project created for this file.
    selection.open(entries[0]);
    for (const geometry of entries.slice(1)) {
      const model =
        codec.id === "bedrock_old"
          ? { format_version: formatVersion, [geometry.name]: geometry.object }
          : { format_version: formatVersion, "minecraft:geometry": [geometry.object] };
      codec.load(model, { path });
      (dialog as Dialog & { onOpenAllGeometry?: (name: string) => void }).onOpenAllGeometry?.(geometry.name);
    }
  }

  // EVENTS

  onEnable(): void {
    const select = Blockbench.on("show_dialog", ({ dialog }) => {
      if (dialog?.id !== "bedrock_model_select") return;
      const button_bar = dialog.object.getElementsByClassName("dialog_bar button_bar")[0];
      if (!button_bar) return;
      const btn = document.createElement("a");
      btn.text = tl("dialog.select_model.open_all");
      btn.style = "margin-right: auto; text-decoration: underline; cursor: pointer;";
      btn.onclick = () => {
        this.openAll(dialog);
      };
      button_bar.prepend(btn);
    });
    this.deleteables.push(select);
  }
}

new BedrockOpenAllTweak();
