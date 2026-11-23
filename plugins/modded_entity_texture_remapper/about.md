# Modded Entity Texture Remapper

Converts models with per-face UVs (for example **Generic Model**) to **Modded Entity** for Minecraft: Java Edition mods, and keeps the texture intact.

Java entity models only support uv UV: every cube has a single texture offset and its six faces are laid out in a fixed net. When you convert a per-face model with the normal *Convert Project*, Blockbench switches the cubes to box uv but leaves the texture as it is, so most faces end up showing the wrong pixels.

This plugin fixes that. It builds a new box uv texture and copies the pixels of every face to its new place.

## How to use

1. Open your model.
2. Go to **File > Convert Project**.
3. Choose **Modded Entity (Remap Texture)** as the format and confirm. Keep *Create Copy* ticked if you want to keep the original.
4. Check the result dialog, then save the new texture (`<name>_entity.png`) before exporting.

The project is a normal Modded Entity project afterwards, so the Java export works as usual.

## What it does

* Packs the box uv nets of all cubes into the smallest power of two texture that fits.
* Copies each face's pixels, including flipped and rotated face UVs.
* Checks every pixel afterwards and tells you if anything doesn't match.
* Keeps the pixel density of your old texture.
* Merges multiple textures into one, since Modded Entity only supports a single texture.

## Things to know

* **Stretched faces**: if a face's texture area doesn't match the face size, the pixels get resampled (some pixels are dropped or doubled). The result dialog lists these faces.
* **Overlay cubes**: a cube whose texture belongs to a smaller box, like a hat around a head, becomes that smaller box plus *inflate*. No pixels get lost that way. You can turn this off in **Settings > Edit > Remap Texture: Use Inflate for Overlay Cubes**.
* **Non integer sizes**: box uv needs whole sizes, so these cubes get rounded up and *inflate* compensates. Inflate is the same on all axes, so the size is only exact if every axis grew by the same amount. The result dialog shows what's left.
* Meshes and other elements that Modded Entity doesn't support get deleted by the conversion, same as with the normal *Convert Project*.

Unlike *Quick Box-UV Layout*, which only moves the uv rectangles, this plugin also moves the texture pixels.
