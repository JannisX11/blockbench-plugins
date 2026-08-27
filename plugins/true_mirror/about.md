Blockbench's built-in Mirror Modeling re-symmetrizes the whole element after every edit, using
your edit only as a trigger. Put an off-centre detail on one side, edit something unrelated, and
the detail gets duplicated across or deleted.

True Mirror mirrors the edit itself. Move a vertex, its counterpart moves the same way. Anything
you did not touch is left alone, symmetric or not.

## What it does

- Move, rotate and scale in vertex, edge and face selection modes
- Extrude. The new geometry and its side walls are mirrored across
- Mirror across X, Y or Z, set from a dropdown in the toolbar
- Two mirror planes. Global uses world zero. Local uses the element's own pivot, so a part
  sitting off to one side can still mirror around itself
- Rotated elements work under Local, where the plane rotates with the element
- A translucent guide shows where the mirror plane actually is

## When it will not mirror, it says so

Some edits cannot be mirrored safely. The plugin skips those and puts a message on screen naming
the cause, and the fix where there is one. An off-centre pivot reports how far off it is.

## What it does not do

- Loop cut, knife and deletion are not mirrored. Those edits pass through untouched
- Nothing is welded at the seam. An extrusion landing on or across the mirror plane is skipped
  rather than half-applied
- Mirroring happens inside one element. It will not pair one mesh with a separate mirrored mesh,
  so rigged limb pairs are out
- New faces get a copy of the source face's UVs. The UVs themselves are not mirrored
- Moving a whole element as a body does nothing. Sub-selections only
- Mesh elements only, and Blockbench's own Mirror Modeling has to be off

I built this for my own use while working on a personal project. It is my first Blockbench
plugin, and I am publishing it because people asked for it and because the problem it solves
has several open issues against Blockbench. It works and it is tested, though that testing was
done by hand on one setup. Support is not guaranteed.

Full documentation and the reasoning behind the limits is in the README.
