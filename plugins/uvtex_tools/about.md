# UV-Tex Tools

UV-Tex Tools adds a focused set of tools for cleaning up UV layouts, texture usage, and flat textured geometry.

It's built for cube-based projects using regular per-face UVs - think Minecraft-style models rather than freeform UV unwraps.

## Working Set

Most commands start from whatever cubes you've got selected. Turn on **Expand Working Set** to pull in every cube that shares the same texture instead.

`Repack UVs` always expands to every cube on the texture before packing - otherwise you'd end up with orphaned UVs pointing at a region that just moved.

If your project only has one texture, the plugin just uses that. If it's not obvious which texture you mean, select it explicitly before running texture-based tools.

## Optimize UVs

### Stack Exact

Finds faces that sample the exact same pixels from the same texture and stacks them - including flipped and 90/180/270-degree rotated matches.

### Repack UVs

Builds a fresh texture atlas out of the UV islands actually in use and remaps faces onto it.

The key difference from Blockbench's built-in "create texture from selection": islands never get rotated, flipped or vanished. What you had is what you get back, just packed tighter.

Packing isn't a single pass - it's a small race between several strategies, and the best-scoring result wins. If nothing fits, the atlas doubles in size and the race runs again, up to the maximum supported size.

The contenders:

- **MaxRects** variants, which track free rectangles and drop each island into the best available spot. Different flavors optimize for shortest leftover side, longest leftover side, smallest area, largest area, or bottom-left placement.
- **FFDS** (first-fit diagonal scan) - Blockbench's own default algorithm. It's usually good, but occasionally can't pack tightly enough on edge cases.
- **Sorting variants** that feed islands in by longest side, largest area, most square, most elongated, tallest, widest, or largest perimeter first.

Results are scored on 
- Compactness.
- How much of the used bounds is actually covered.
- How close to square the used area is.

Options:

- **Texture Name** - name for the new texture (defaults to the existing one).
- **Padding** - pixels between packed islands.
- **Use Stack Exact First** - runs `Stack Exact` before packing, so duplicates don't waste space in the atlas.

## Disable

### Disable Empty Faces

Switches off faces that are safe to drop from rendering. If a cube ends up completely empty as a result, you'll be asked whether to delete it.

Options:

- **Zero-sized faces** - UV region has no actual pixel area.
- **Fully transparent faces** - every sampled pixel is transparent.
- **Blank faces** - no texture assigned at all.

If **Blank faces** is off and the command still finds some, it stops, selects the affected cubes, and leaves your project untouched - better to look before touching those.

### Find Disable Candidates

Flags faces that might be worth disabling by hand. This one never changes anything - it just selects.

Options:

- **Solid color** - filled with a single exact RGBA color.
- **Fully transparent** - every sampled pixel is transparent.
- **Template colors** - only contains Blockbench's placeholder template colors.

## Analyze

### Texture Usage

Opens a read-only report on the resolved texture: size, how many cubes/faces use it, how many faces are disabled, UV region reuse, covered pixels, overall coverage, and layout bounds.

Your selection is only used to figure out which texture you're asking about - the report itself covers every cube using that texture, selected or not.

## Flat Faces

### Verify Flat Faces

Checks flat cubes with textured front and back faces and flags pairs that don't look like they actually mirror each other. Meant for plane-style geometry where both sides should show the same content.

Doesn't touch geometry or UVs - just selects the cubes that look off, so you can fix them yourself.

### Trim Transparent Padding

Trims away transparent padding around textured flat faces and shrinks the geometry to match the actual non-transparent bounds.

Only touches faces it can trim safely. Anything it's not confident about - like a flat face where the two sides don't share the same opaque bounds - gets counted in the results but left alone.

### Extrude

Takes selected single-textured planes and turns their opaque pixels into new cube geometry. The original flat cube gets removed once the new geometry exists.

Options:

- **Depth** - how thick the extrusion is. New geometry grows outward along the original face's normal.

Each source cube needs exactly one active textured face - fully transparent planes are skipped rather than erroring out.

## Select

### Matching UVs

Selects other cubes that share UV regions with your current selection, on the same texture.

Options:

- **Same region set** - only cubes whose entire set of UV regions matches one of the selected cubes.
- **Any shared region** - any cube that shares at least one UV region with the selection.