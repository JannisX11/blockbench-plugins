/** @type {Action|undefined} */
let zfix_action;
/** @type {Dialog|undefined} */
let zfix_dialog;

Plugin.register('z_fighter_fix', {
	title:       'Z-Fighting Fixer',
	author:      'TVcraft01',
	description: 'One-click fix for z-fighting on overlapping cube faces, including flat/2D blocks. ' +
	             'Handles any number of overlapping cubes, fixes both sides of every conflict.',
	icon:        'layers_clear',
	version:     '3.3.0',
	variant:     'both',
	min_version: '4.0.0',

	onload() {

		zfix_dialog = new Dialog('z_fighter_fix_dialog', {
			title: 'Fix Z-Fighting',
			form: {
				threshold: {
					label: 'Detection threshold (px) — faces closer than this are fixed',
					type:  'number',
					value: 0.0005,
					min:   0.000001,
					max:   2,
					step:  0.0001,
				},
				offset: {
					label: 'Offset gap (px) — clean separation written between fixed faces',
					type:  'number',
					value: 0.0001,
					min:   0.000001,
					max:   1,
					step:  0.00001,
				},
				scope: {
					label: 'Apply to',
					type:  'select',
					value: 'auto',
					options: {
						auto:     'Selection (fall back to all cubes if nothing selected)',
						selected: 'Selected cubes only',
						all:      'All cubes in model',
					},
				},
			},

			onConfirm(form) {
				const threshold = form.threshold;
				const offset    = form.offset;
				const scope     = form.scope;

				// ── Resolve cube list ─────────────────────────────────────────
				let cubes;
				if      (scope === 'all')      cubes = Cube.all.slice();
				else if (scope === 'selected') cubes = Cube.selected.slice();
				else    cubes = Cube.selected.length ? Cube.selected.slice() : Cube.all.slice();

				if (!cubes.length) {
					Blockbench.showStatusMessage('No cubes to check.', 2500);
					return;
				}

				// ── Working copies ────────────────────────────────────────────
				// All geometry mutations happen here. Real cubes untouched until apply.
				const wf = cubes.map(c => ({
					from: c.from.slice(),   // [x, y, z]
					to:   c.to.slice(),
				}));

				// ── Per-pass modification lock ─────────────────────────────────
				// Reset each pass. Key = "cubeIndex:axis".
				// Once a (cube, axis) is modified, it cannot be modified again
				// in the same pass — prevents Case 3 and Case 4 oscillation.
				let modifiedThisPass = new Set();

				// ── Helpers ───────────────────────────────────────────────────

				/** True when cubes share face AREA on the plane ⊥ to axis (using wf). */
				function overlapsInPlane(i, j, axis) {
					for (let a = 0; a < 3; a++) {
						if (a === axis) continue;
						if (Math.max(wf[i].from[a], wf[j].from[a]) >=
						    Math.min(wf[i].to[a],   wf[j].to[a])) return false;
					}
					return true;
				}

				/** True when cube idx has zero thickness on axis (flat / 2D block). */
				function isFlat(idx, axis) {
					return Math.abs(wf[idx].to[axis] - wf[idx].from[axis]) < 1e-9;
				}

				/**
				 * Move the min-face of cube idx on axis to `target`.
				 *
				 * Returns true and modifies wf only when:
				 *   • (idx, axis) not already modified this pass
				 *   • the target is meaningfully different from current value
				 *   • the move won't invert the cube (normal cubes only)
				 *
				 * Flat cube: shifts both from AND to together (preserves zero thickness).
				 * Normal cube: moves from only, with inversion guard.
				 */
				function fixFrom(idx, axis, target) {
					const key = `${idx}:${axis}`;
					if (modifiedThisPass.has(key)) return false;

					if (isFlat(idx, axis)) {
						const delta = target - wf[idx].from[axis];
						if (Math.abs(delta) < 1e-10) return false; // no-op
						wf[idx].from[axis] += delta;
						wf[idx].to[axis]   += delta;
						modifiedThisPass.add(key);
						return true;
					}

					if (target < wf[idx].to[axis]) {
						if (Math.abs(target - wf[idx].from[axis]) < 1e-10) return false; // no-op
						wf[idx].from[axis] = target;
						modifiedThisPass.add(key);
						return true;
					}
					return false; // would invert
				}

				/**
				 * Move the max-face of cube idx on axis to `target`.
				 *
				 * Same rules as fixFrom but for the to[] face.
				 * Flat cube: shifts both from AND to together.
				 * Normal cube: moves to only, with inversion guard.
				 */
				function fixTo(idx, axis, target) {
					const key = `${idx}:${axis}`;
					if (modifiedThisPass.has(key)) return false;

					if (isFlat(idx, axis)) {
						const delta = target - wf[idx].to[axis];
						if (Math.abs(delta) < 1e-10) return false; // no-op
						wf[idx].from[axis] += delta;
						wf[idx].to[axis]   += delta;
						modifiedThisPass.add(key);
						return true;
					}

					if (target > wf[idx].from[axis]) {
						if (Math.abs(target - wf[idx].to[axis]) < 1e-10) return false; // no-op
						wf[idx].to[axis] = target;
						modifiedThisPass.add(key);
						return true;
					}
					return false; // would invert
				}

				// ── Multi-pass iterative sweep ────────────────────────────────
				const MAX_PASSES = 20;
				let totalFixes   = 0;
				let totalSkipped = 0;

				for (let pass = 0; pass < MAX_PASSES; pass++) {
					modifiedThisPass = new Set();
					let changesThisPass = 0;

					for (let i = 0; i < cubes.length; i++) {
						for (let j = i + 1; j < cubes.length; j++) {
							for (let axis = 0; axis < 3; axis++) {

								if (!overlapsInPlane(i, j, axis)) continue;

								// ── CASE 1: j.from ≈ i.to ──────────────────────
								// j's min-face meets i's max-face (j sits beside/above i).
								// Flat j: shifts j's plane just past i's max-face.
								// Normal j: pushes j's min-face up past i's max-face.
								// Fallback: pulls i's max-face back from j's min-face.
								{
									const absGap = Math.abs(wf[j].from[axis] - wf[i].to[axis]);
									if (absGap < threshold) {
										if      (fixFrom(j, axis, wf[i].to[axis]   + offset)) changesThisPass++;
										else if (fixTo  (i, axis, wf[j].from[axis] - offset)) changesThisPass++;
										else    totalSkipped++;
									}
								}

								// ── CASE 2: i.from ≈ j.to ──────────────────────
								// i's min-face meets j's max-face (i sits beside/above j).
								{
									const absGap = Math.abs(wf[i].from[axis] - wf[j].to[axis]);
									if (absGap < threshold) {
										if      (fixTo  (j, axis, wf[i].from[axis] - offset)) changesThisPass++;
										else if (fixFrom(i, axis, wf[j].to[axis]   + offset)) changesThisPass++;
										else    totalSkipped++;
									}
								}

								// ── CASE 3: i.to ≈ j.to ────────────────────────
								// Both outward max-faces flush (two tops/sides at same coord).
								// Lock prevents Case 4 from undoing this fix in the same pass.
								{
									const absGap = Math.abs(wf[i].to[axis] - wf[j].to[axis]);
									if (absGap < threshold) {
										if      (fixTo(j, axis, wf[i].to[axis] + offset)) changesThisPass++;
										else if (fixTo(i, axis, wf[j].to[axis] + offset)) changesThisPass++;
										else    totalSkipped++;
									}
								}

								// ── CASE 4: i.from ≈ j.from ────────────────────
								// Both outward min-faces flush (two bottoms/sides at same coord).
								// If Case 3 already modified (j, axis) this pass, the lock in
								// fixFrom will skip this — no more oscillation.
								{
									const absGap = Math.abs(wf[i].from[axis] - wf[j].from[axis]);
									if (absGap < threshold) {
										if      (fixFrom(j, axis, wf[i].from[axis] - offset)) changesThisPass++;
										else if (fixFrom(i, axis, wf[j].from[axis] - offset)) changesThisPass++;
										else    totalSkipped++;
									}
								}

							} // axis
						} // j
					} // i

					totalFixes += changesThisPass;
					if (changesThisPass === 0) break; // true convergence — done
				}

				// ── Diff working copies against originals ─────────────────────
				// Only cubes whose positions actually changed are applied.
				// Idempotent: a face already correctly separated produces the
				// same working-copy value → diff=0 → not collected → not touched.
				const affectedEntries = [];
				for (let i = 0; i < cubes.length; i++) {
					let changed = false;
					for (let axis = 0; axis < 3; axis++) {
						if (wf[i].from[axis] !== cubes[i].from[axis]) { changed = true; break; }
						if (wf[i].to[axis]   !== cubes[i].to[axis])   { changed = true; break; }
					}
					if (changed) affectedEntries.push({ cube: cubes[i], wf: wf[i] });
				}

				// ── Nothing changed ───────────────────────────────────────────
				if (!affectedEntries.length) {
					const hint = totalSkipped > 0
						? ` (${totalSkipped} conflict${totalSkipped !== 1 ? 's' : ''} could not be fixed — cubes too thin)`
						: ` Try raising the threshold above ${threshold}.`;
					Blockbench.showStatusMessage(
						`No z-fighting fixed among ${cubes.length} cubes.${hint}`,
						5000
					);
					return;
				}

				// ── Apply as one undoable edit ────────────────────────────────
				const cubeList = affectedEntries.map(e => e.cube);

				Undo.initEdit({ elements: cubeList });

				for (const { cube, wf: w } of affectedEntries) {
					for (let axis = 0; axis < 3; axis++) {
						cube.from[axis] = w.from[axis];
						cube.to[axis]   = w.to[axis];
					}
				}

				Canvas.updateView({
					elements:        cubeList,
					element_aspects: { geometry: true },
					selection:       true,
				});

				Undo.finishEdit('Fix z-fighting');

				// ── Status ────────────────────────────────────────────────────
				let msg = `Fixed ${totalFixes} conflict${totalFixes !== 1 ? 's' : ''} ` +
				          `across ${cubeList.length} cube${cubeList.length !== 1 ? 's' : ''}`;
				if (totalSkipped > 0) msg += ` — ⚠ ${totalSkipped} skipped (too thin to fix safely)`;
				msg += ' — Ctrl+Z to undo';
				Blockbench.showStatusMessage(msg, 6000);
			},
		});

		// ── Action ─────────────────────────────────────────────────────────────
		zfix_action = new Action('fix_z_fighting', {
			name:        'Fix Z-Fighting…',
			description: 'Detect and fix near-coplanar overlapping cube faces, including flat/2D blocks',
			icon:        'layers_clear',
			condition:   () => !!Format,
			click()      { zfix_dialog.show(); },
		});

		MenuBar.menus.tools.addAction(zfix_action);
		Toolbars.edit.add(zfix_action);
	},

	onunload() {
		if (zfix_action) { Toolbars.edit.remove(zfix_action); zfix_action.delete(); }
		if (zfix_dialog) zfix_dialog.delete();
	},
});
