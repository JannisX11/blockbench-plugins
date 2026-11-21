import { ID } from "./constants";
import { randomInt } from "./utils";

class ChunkDigger {
  private clicks = 0;
  private deleteables: Deletable[] = [];

  private addCube(pos1: ArrayVector3, color: number = 9, size: number = 2): void {
    new Cube({ from: pos1, to: [pos1[0] + size, pos1[1] + size, pos1[2] + size], color }).init();
  }

  private generateChunk(size: number = 8): void {
    for (let x = -size; x < size; x += 2) {
      for (let y = 0; y < size * 2; y += 2) {
        for (let z = -size; z < size; z += 2) {
          this.addCube([x, y, z], randomInt(8, 9));
        }
      }
    }
  }

  create(): void {
    newProject("generic");
    Project.model_identifier = `${ID}:chunk_digger`;
    Project.name = "Chunk Digger";
    this.generateChunk();

    // TODO: Hide left and right bar?
  }

  onLoad(): void {
    const selector = `li[plugin="${ID}"] div .plugin_icon_area`;
    this.deleteables.push(
      Blockbench.on("show_dialog", ({ dialog }) => {
        if (dialog?.id !== "plugins") return;
        $(selector).on("click", () => {
          this.clicks++;
          if (this.clicks >= 5) {
            this.clicks = 0;
            Dialog.open?.close();
            chunkDigger.create();
          }
        });
      }),
      Blockbench.on("hide_dialog", ({ dialog }) => {
        if (dialog?.id !== "plugins") return;
        this.clicks = 0;
        $(selector).off();
      }),
      Blockbench.on("select_cube", (cubes) => {
        if (Project?.model_identifier !== `${ID}:chunk_digger`) return;
        cubes[0].remove();
      }),
    );
  }

  onUnload() {
    this.deleteables.forEach((x) => x.delete());
    this.clicks = 0;
  }
}

export const chunkDigger = new ChunkDigger();
