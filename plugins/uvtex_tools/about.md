# UV-Tex Tools

UV-Tex Tools adds a focused set of tools for cleaning up UV layouts, texture usage, and flat textured geometry.

It is intended for cube-based projects that use regular per-face UVs.

## Working set

Most commands start from the selected cubes. Enable **Expand Working Set** to include every cube that uses the same texture.

`Repack UVs` always expands to all cubes using the texture before packing, so related UVs are not accidentally left behind.

For single-texture projects, the plugin uses the active project texture. If the active texture is ambiguous, select the texture explicitly before running texture-based tools.

## Optimize UVs

### Stack Exact

Stacks faces that sample the same pixels from the same texture. Exact matches, flipped matches, and 90/180/270 degree rotated matches are handled.

### Repack UVs

Builds a new texture atlas from the UV islands that use the current texture and remaps faces.

It differs from creating a new texture using the standard method in that it does not attempt to rotate the UV islands. Furthermore, unlike the standard method, no issues have been observed with artifacts such as random flips, rotations, or disappearances of UV islands.

Packing is not a single one-shot pass. The command runs a small race of packing strategies and keeps the best scored result. If nothing fits, the atlas size is doubled and the race runs again up to the maximum supported size.

The race combines:

- **MaxRects** strategies, which keep a list of free rectangles and place each island into the best available free space. Different variants prefer shortest leftover side, longest leftover side, smallest area, largest area, or bottom-left placement.
- **FFDS** (first-fit diagonal scan), the standard Blockbench packing algorithm produces the best results in most cases, but sometimes it cannot pack the islands tightly enough for edge cases.
- **Island sorting variants**, including longest side first, largest area first, most square first, most elongated first, tallest first, widest first, and largest perimeter first.

Results are scored by compactness, covered area inside the used bounds, and how square the used bounds are.

Options:

- **Texture Name**: name for the generated texture (the name of the existing texture, by default).
- **Padding**: padding in pixels between packed islands.
- **Use Stack Exact First**: runs `Stack Exact` before packing.

## Disable

### Disable Empty Faces

Disables faces that are safe to remove from rendering. If a cube becomes fully empty, the command asks whether to delete that cube.

Options:

- **Zero-sized faces**: disables faces whose UV region has no pixel area.
- **Fully transparent faces**: disables faces whose sampled pixels are all transparent.
- **Blank faces**: disables faces with no assigned texture.

If **Blank faces** is off and blank faces are found, the command stops, selects the affected cubes, and does not mutate the project.

### Find Disable Candidates

Finds faces that may be good candidates for manual disabling. This command does not change faces and does not change anything; it only selects cubes with candidate faces.

Options:

- **Solid color**: flags faces filled with one exact RGBA color.
- **Fully transparent**: flags faces whose sampled pixels are all transparent.
- **Template colors**: flags faces that only contain Blockbench template colors.

## Analyze

### Texture Usage

Opens a read-only report for the resolved texture. The report includes texture size, cubes/faces using the texture, disabled faces, UV region reuse, covered texture pixels, texture coverage, and layout bounds metrics.

Selection is only used to resolve the texture. After that, the report analyzes all cubes that use that texture.

## Flat Faces

### Verify Flat Faces

Checks flat cubes with opposite textured sides and reports pairs that do not look visually equivalent. This is meant for plane-like geometry where both sides should represent the same texture content.

The command does not change geometry or UVs. If mismatches are found, it selects the affected cubes.

### Trim Transparent Padding

Trims transparent padding around textured flat faces and adjusts the flat geometry to match the non-transparent pixel bounds.

The command only changes candidates that can be trimmed safely. Problematic cases are counted in the result, for example when the two sides of a flat face do not have matching opaque bounds.

### Extrude

Extrudes selected single-textured planes into new cubes based on the opaque pixel areas of the active face. The original plane cube is removed when new geometry is created.

Options:

- **Depth**: extrusion thickness. New cubes grow against the original face normal.

The command expects each selected source cube to have exactly one active textured face. Fully transparent planes are skipped.

## Select

### Matching UVs

Selects other cubes that use matching UV regions on the same texture.

Options:

- **Same region set**: selects cubes whose full set of UV regions matches one of the selected cubes.
- **Any shared region**: selects cubes that share at least one UV region with the current selection.
