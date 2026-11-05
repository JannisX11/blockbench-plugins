<img src="https://raw.githubusercontent.com/BbIJABNPOBATEJb/Armor-Trim-Editor/main/docs/hero.png" alt="Armor Trim Editor" style="width: 100%;">

Paint Minecraft: Java Edition armor trims on the exact armor model the game uses, preview every trim material while you paint, and export the result straight into a resource pack.

## How to use

1. **File → New → Armor Trim**. Start empty or from a vanilla pattern, or open existing trims with **Trim → Open trim from resource pack** (Ctrl or Shift opens several at once).
2. Paint on the model or on the `humanoid` / `humanoid_leggings` textures. The eight gray shades in the **Trim: palette & export** panel are recolored by the trim material; any other color stays as painted.
3. Use the **Trim: preview** panel to show or hide armor pieces and layers, switch the reference armor and trim material, pose the player (including poses with the body parts pulled apart) and change the skin. Right-click a piece to show only that piece.
4. Click **Icon** to generate the smithing template icon from a vanilla template.
5. In vanilla every trim looks the same on armor items in the inventory. In the **Icons** tab you draw how this trim looks on each armor shape (helmet, chestplate, leggings, boots, netherite helmet and boots, turtle shell), previewed on every armor type and material. **Generators** create the icons from the trim on the player, the vanilla overlay or simple shapes. They are exported in the format of the [Visual Armor Trims](https://modrinth.com/resourcepack/visual-armor-trims) resource pack, into VAT itself if your pack contains it (Minecraft 1.21.5+).
6. Click **Export** and save the trim into a resource pack zip (with `pack.mcmeta` and `pack.png`, e.g. in `.minecraft/resourcepacks`) or into a pack folder, then press `F3 + T` in game. Exporting another trim into the same archive adds it next to the others. After the first export, **Quick export** (`Ctrl + Alt + E`) repeats it.
7. Click **Datapack** to add the trim pattern to a datapack zip, e.g. right in `saves/<world>/datapacks` (Minecraft 1.21.2 – 26.2). **Trim → How to use a trim in game** shows the `/give` command and Bukkit/Paper code for it.

## Notes

* Desktop only: the plugin reads your Minecraft client jar (found automatically, or set in **Trim → Settings**) for default skins, armor textures, vanilla trims and template icons, and writes files into your resource pack. Nothing from the game is bundled.
* The helmet has two trim layers: the left half of the top row (1.0) and the right half (outer layer, 1.5).
* The left arm and leg reuse the right side of the texture, mirrored.
* Trims render as cutout: alpha below 10% is dropped, everything else is opaque. **Check** finds and fixes such pixels.
* **Trim → How trims work** explains the texture layout in detail.

Source code, screenshots and issue tracker: [github.com/BbIJABNPOBATEJb/Armor-Trim-Editor](https://github.com/BbIJABNPOBATEJb/Armor-Trim-Editor)
