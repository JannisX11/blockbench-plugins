## What it does

Minecraft cannot render arbitrary polygonal geometry. A glTF model opens fine in
Blockbench, but every element is a **Mesh**, and the game needs **Cubes**. This
plugin does that conversion — and everything around it.

- **Import a ZIP** with a glTF model and textures, and get a finished GeckoLib
  project: bones, cubes, textures and animations.
- **Browse Sketchfab** from inside Blockbench and download models through the
  official Data API, with author and licence shown up front.
- **Several textures** are packed into a single atlas, because GeckoLib wants one.
- **Merged meshes** are split back into separate cubes automatically.
- **Animations** are carried over, including rotation and position channels.
- **Customizable Player Models** can be written out instead: the same import,
  saved as a `.cpmproject`.

## Customizable Player Models

*File → Customizable Player Models from ZIP (glTF + texture)* runs the same
import and then asks the three things a player skin needs and a GeckoLib model
does not: how tall the model should be in player pixels, which bone belongs to
which part of the player, and what each animation becomes — a vanilla pose
(`walking`, `sneaking`, `sleeping`…) or a gesture.

The size is asked separately because CPM measures in player pixels, 32 of them
head to toe, while a downloaded model arrives in whatever units its author used.
The bone mapping is offered as a guess by name rather than applied silently: on a
model already rigged like a player it needs no corrections, and on anything else
a silent guess is worse than none.

A Blockbench project is created alongside the export, so the result can be looked
at, and the report states the encoded size against CPM's 30 kB budget for a local
model.

## What it cannot do

Wedges, bevels and rounded shapes do not exist in Minecraft. Such objects are
replaced with their bounding box, with the texture laid out per face. The import
report tells you exactly which share of the model was approximated — at 30% or
more it says plainly that the model is a poor fit.

Coordinates are cleaned of floating-point noise, but a model that was not built
on a 0.25 px grid keeps its exact numbers: snapping it to the grid would grow
small details by a quarter and flatten thin overlays.

## Requirements

The **GeckoLib Animation Utils** plugin — its format is what projects are built
into, including on the way to a CPM export. Converting an already-open model
(Filter menu) works without it.

Downloading from Sketchfab needs a personal API token; searching does not.
