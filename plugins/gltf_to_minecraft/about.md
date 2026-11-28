## What it is

Two halves under one name. **Mosaicary** is a catalogue of Blockbench models —
[mosaicary.com](https://mosaicary.com) — and this plugin is that catalogue
inside Blockbench. The other half converts models that were never made for
Minecraft into cubes the game can render.

Minecraft draws cubes, not arbitrary polygonal geometry. A glTF model opens in
Blockbench well enough, but every element of it is a **Mesh** where the game
needs a **Cube**. That conversion, and everything around it, is the half that
imports.

## The catalogue

**Browse Mosaicary Models** opens the catalogue and the Sketchfab search in one
window. A model from Mosaicary was made in Blockbench, so it opens as the
project its author saved: nothing is converted and nothing is rebuilt. A model
from Sketchfab goes through the import below.

Four shelves: the catalogue, the models you put a heart on, your own ones with
drafts among them, and Recent — what you last opened in Blockbench, which needs
no account and opens an entry the way the start screen does.

Search by name, author or tag, and order the models by newest, most liked, most
downloaded, most discussed or by name. The filters reach the format, what the
model is for, what is inside it, how detailed it is, how large its textures
are, the licence, the tags and when it was added; how many models answer them
stands under the filters, and one button puts them all back. The cards are
yours to set as well: their size, how many go in a row, and the colour behind a
model.

A bell in the header carries what the site has to tell you about your own
models — a comment, an answer to one, a decision about a model — and opens the
model it is about.

Once a model has been taken, the catalogue gets out of the way: it moves into a
Blockbench panel and folds there, instead of standing over the model it just
delivered. A switch in its header turns that off, for taking several models one
after another.

## A model before you take it

Every model has a window of its own: the model turning in a view, its
animations with play, pause and loop, and its figures — bones, vertices,
textures and their size, file size, format, licence, when it was published and
how many have looked at it. Below them its description, and its comments, where
you can answer somebody and take back what you wrote. **Open in Blockbench**
takes the model, a heart puts it on your Loved shelf, and anything that does
not belong in the catalogue is reported to whoever runs the site. A model marked
for adults waits behind a cover until you ask to see it.

Your own model is also edited from that window: its name, its description, its
tags, and the colour behind it on the card. The file itself stays as it was — a
new version of a model goes up as a model of its own.

## Sketchfab

**Import from Sketchfab** searches Sketchfab through its official Data API,
with the author and the licence on every card and in the import report. By
default only models made in Blockbench are listed: those are cubes already and
convert whole. Cards carry the triangle, animation and like counts and say
whether the model looks built from cubes; a filter keeps the animated ones, and
the results can be ordered by likes, views or date.

Models whose author allows no downloads are listed as well, marked with a lock.
Their window offers Sketchfab's own viewer and the model's page instead of an
import that could only fail, and a switch leaves them out.

Searching needs nothing. Downloading needs a personal API token, found in the
Sketchfab profile settings under *Password & API*.

## Importing a model

**Import glTF Model** takes a ZIP with a glTF model and its textures, or the
files of an already unpacked folder, and builds what you choose: GeckoLib,
Bedrock Entity, Generic Model, or a still Java block or item model. What comes
out is a finished project with bones, cubes, textures and animations, and the
choice of format is remembered.

Two things in that window are worth knowing about:

- **Into the open project**, instead of a new one. The model arrives as one
  folder in the project already open: a sword goes into the selected hand and
  turns with it, a helmet onto a head, and one undo takes it all back.
- **As meshes**, instead of rebuilt into cubes. The geometry stays the author's
  own, for Blockbench's mesh tools to take from there, while bones, textures
  and animations come across the same way. Cubes stay the default, since cubes
  are what the game renders; a model with enough triangles to slow the editor
  down says so before the import rather than after.

The settings stand on the left of the window and the model itself turns on the
right, with a card of its figures below: drag to turn it, scroll to come
closer, double-click to go back. The long explanations sit on a question mark
beside the setting they belong to. Where the import was started before a file
was chosen, the file is chosen inside the window, in the view's place.

Along the way several textures are packed into one atlas (GeckoLib and Bedrock
want one), merged meshes are split back into separate cubes, and the outliner
is tidied: folders that hold a single thing and carry no animation are dropped,
and cubes keep their author's names. Animations come across with their
rotation, position and scale keyframes, each on a timeline grid that holds
them. The report at the end says what the model became, lays out its figures,
gives every warning worth reading, and folds the log behind a button.

## Parts that are not cubes

Wedges, bevels and rounded shapes do not exist in Minecraft. Such parts are
rebuilt from thin plates that follow their surface, each cut to its outline by
a baked texture, the way curves are built by hand in Blockbench. **Fast** takes
seconds on most models; **Best quality** also lays a strip along each sharp
slanted edge. The rebuild shows its progress and can be finished early or
cancelled. The advanced settings can instead replace each such part with its
bounding box, or skip it.

## Putting a model up

**Upload Model to Mosaicary** puts the open project up, published or as a draft
nobody but you sees: its name, description, tags and licence, the author and a
link to the original where the model is not yours, and who it is for. The
picture on its card is drawn in that same window — turn the model to the angle
you want, choose the colour behind it, and where the model has animations of
its own, pick which one and the moment in it the picture is taken at.

Textures that live on disk are drawn into the file first, or the model would
arrive grey, and paths to files on this computer are taken out of what goes up.
The sending goes step by step, and whatever stops it says which step and why.

A setting, off until you say otherwise, sends a saved model to the drafts of
your profile and keeps that draft up to date on every later save of that same
file. A draft is yours alone, a model you have published is never touched, and
publishing stays something you do by hand. Keeping a draft up to date needs the
project to have a place on disk, since that is what the draft is matched by: in
the browser build, where saving hands the file to the downloads instead, there
is no such place, so the model goes up once and the next save says the draft is
behind rather than replacing it. And since the two are compared by the shape
and the paint, a save that changed an animation alone sends nothing.

## An account, and what leaves Blockbench

Looking at the catalogue and taking a model from it need no account. The
hearts, the comments, your own models and publishing do. Signing in goes either
through the browser — Blockbench shows a code, the page has to show the same
code, and you allow it there — or by pasting an API key made on the site.
Several accounts are remembered and switched between in a line of their own;
signing out forgets the key here, while on the site it stays until you remove
it there.

The plugin talks to two places and no others: Mosaicary, which is a site run by
this plugin's author, and Sketchfab's Data API. Both answer with data and model
files, never with code to run, and no page of either is shown inside
Blockbench. Nothing travels before something is asked for. The site's address
is a setting too, for reaching a copy of it running elsewhere.

## Customizable Player Models

The CPM import asks the three things a player skin needs and a GeckoLib model
does not: how tall the model should be in player pixels, which bone belongs to
which part of the player, and what each animation becomes, either a vanilla
pose (walking, sneaking, sleeping and so on) or a gesture.

The size is asked separately because CPM measures in player pixels, 32 of them
head to toe, while a downloaded model arrives in whatever units its author
used. The bone mapping is offered as a guess by name rather than applied
silently: on a model already rigged like a player it needs no corrections, and
on anything else a silent guess is worse than none.

A Generic Model project is created alongside the export, so the result can be
looked at, and the report states the encoded size against CPM's 30 kB budget
for a local model.

## What it cannot do

Rebuilt parts need cutout transparency wherever the model is used, and up close
their slanted edges show fine steps. A model made mostly of such parts gets
many times more cubes than it has objects.

A texture that lost its alpha channel on the way cannot be recovered. When the
material asks for transparency and the texture has none, the report says so.

Coordinates are cleaned of floating-point noise, but a model that was not built
on a 0.25 px grid keeps its exact numbers: snapping it to the grid would grow
small details by a quarter and flatten thin overlays.

## Where the entries are

**File**, beside Open Model: *Browse Mosaicary Models*, there because it opens
a project of its own rather than importing into the one in front of you.
**File > Import**: *Import glTF Model*, *Import glTF as Customizable Player
Model*, *Import from Sketchfab*. **File > Export**: *Upload Model to
Mosaicary*, and *Export GeckoLib Geometry* where the GeckoLib plugin is not
installed. **Filter**: *Convert Meshes to Cubes*, which acts on the project
already open. **Help**: *Leave a Review*, *Mosaicary language*, *Environment
diagnostics*.

*Leave a Review* holds one review of the plugin and one of Mosaicary, both on
the public wall of reviews on the site, and either can be rewritten whenever
you like.

## Languages

Everything the plugin shows follows Blockbench's language: English, Russian,
Chinese, Spanish, Portuguese, German, French, Japanese, Korean, Ukrainian,
Turkish, Polish, Italian and Dutch. *Mosaicary language*, under Help and in
Blockbench's own settings, sets a language for these windows alone, where it
should not be the editor's. The developer console stays in English.

## Requirements

Nothing beyond Blockbench, for any of the formats. GeckoLib included: where the
GeckoLib plugin is not installed, this plugin registers the GeckoLib format
itself, so the import opens an ordinary project, a `.bbmodel` somebody else
exported from GeckoLib opens as itself instead of losing its format, and
*Export GeckoLib Geometry* writes the `.geo.json` the mod reads; the animation
files Blockbench writes itself.

The GeckoLib plugin — **GeckoLib Models & Animations** on Blockbench 5,
**GeckoLib Animation Utils** on Blockbench 4 — is still worth having: it brings
its own project settings, an armour template, timeline checks and its own
exports. Where it is installed it stays in charge, and none of the above shows
up.
