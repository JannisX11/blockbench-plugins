(function () {
	let menuAction;
	Plugin.register("bedrock_voxel_shape_exporter", {
		title: "Voxel Shapes Exporter",
		author: "DivinusArtem",
		//thanks Vowxky for getting me started
		description: "Exports Voxel Shape JSON for Bedrock Behavior Pack Add-ons",
		version: "0.1.0",
		icon: "fa-cubes",
		min_version: "4.8.0",
		variant: "both",
		tags: ["Minecraft: Bedrock Edition"],
		onload() {
			menuAction = new Action("export_voxel_shape", {
				name: "Export Voxel Shape JSON",
				description: "Exports voxel shapes for Bedrock Edition",
				icon: "fa-download",
				click: () => openExportDialog()
			});
			MenuBar.addAction(menuAction, "file.export");
		},
		onunload() {
			menuAction?.delete();
		}
	});

	function openExportDialog(errorMsg) {
		const sel = (typeof selected !== "undefined" && Array.isArray(selected))
			? selected.filter(n => n && n.type === "cube")
			: [];
		const allCubes = (Cube.all || []);
		const showScope = allCubes.length > 1 && sel.length > 0 && allCubes.length > sel.length;
		const defaultScope = sel.length ? "selected" : "all";
		const scopeCubeCount = defaultScope === "selected" ? sel.length : allCubes.length;
		const canAttemptMerge = showScope ? allCubes.length > 1 : scopeCubeCount > 1;
		
		const dlg = new Dialog({
			id: "voxel_export_dialog",
			title: "Voxel Export",
			width: 470,
			form: {
				...(errorMsg ? {
					error: {
						label: " ",
						type: "info",
						text: `⚠ ${errorMsg}`
					}
				} : {}),
				identifier: {
					label: "Identifier:",
					type: "text",
					value: (() => {
						const name = Project.model_identifier.replace(".geo", "");
						return name.includes(":") ? name : `custom:${name}`;
					})()
				},
				version: {
					label: "Version:",
					type: "text",
					value: "1.21.110"
				},
				...(showScope ? {
					scope: {
						label: "Cubes to export",
						type: "select",
						options: {
							selected: "Selected cubes",
							all: "All cubes"
						},
						value: defaultScope
					}
				} : {}),
				 ...(canAttemptMerge ? {
					merge: {
						label: "Try to merge adjacent boxes?",
						type: "checkbox",
						value: true
					}
				} : {})
			},
			onConfirm(form) {
				const id = form.identifier || "";
				const parts = id.split(":");
				
				if (parts.length !== 2 || !parts[0] || !parts[1]) {
					openExportDialog("Identifier must be in the format namespace:shape_name");
					return;
				}
				
				if (parts[0].toLowerCase() === "minecraft") {
					openExportDialog(`Namespace ${parts[0]} is not allowed.`);
					return;
				}
				
				const ver = form.version || "";
				const verParts = ver.split(".").map(Number);
				const validFormat = /^1\.\d+\.\d+$/.test(ver);
				const aboveMin = (
					verParts[0] > 1 ||
					verParts[1] > 21 ||
					(verParts[1] === 21 && verParts[2] >= 110)
				);
				
				if (!validFormat || !aboveMin) {
					openExportDialog('Version must be in format "1.##.##" and at least "1.21.110".');
					return;
				}
				
				form.scope = form.scope ?? defaultScope;
				exportVoxelJson(form);
			}
		});
		dlg.show();
	}

	function exportVoxelJson(form) {
		const scope = form.scope;
		let cubes = [];
		if (scope === "selected") {
			const sel = (typeof selected !== "undefined" && Array.isArray(selected)) ? selected : [];
			cubes = sel.filter(n => n && n.type === "cube");
			if (!cubes.length) {
				Blockbench.showQuickMessage("Voxel Exporter: No cubes selected. Nothing to export.");
				return;
			}
		} else {
			cubes = (Cube.all || []);
			if (!cubes.length) {
				Blockbench.showQuickMessage("Voxel Exporter: No cubes found. Nothing to export.");
				return;
			}
		}

		let boxes = buildBoxesFromCubes(cubes);
		if (form.merge) { boxes = mergeBoxes(boxes); }

		const identifier = form.identifier || "custom:my_shape";
		const version = form.version || "1.21.110";
		const payload = {
			"format_version": version,
			"minecraft:voxel_shape": {
				"description": {
					"identifier": identifier
				},
				"shape": {
					"boxes": boxes
				}
			}
		};

		const baseName = (Project && Project.name ? Project.name : "voxel_shape");
		const fileName = `${baseName}.json`;
		Blockbench.export({
			type: "Voxel Shape File",
			extensions: ["json"],
			savetype: "text",
			name: identifier.split(":")[1],
			content: formatPayload(payload)
		});
		Blockbench.showQuickMessage(
			`Voxel Shapes Exporter: JSON exported (${scope === "selected" ? "selected cubes" : "all cubes"}${form.merge ? ", merged" : ""}).`
		);
	}

	function buildBoxesFromCubes(cubes) {
		const list = cubes.slice().sort((a, b) => {
			if (a.from[1] !== b.from[1]) return a.from[1] - b.from[1];
			if (a.from[0] !== b.from[0]) return a.from[0] - b.from[0];
			return a.from[2] - b.from[2];
		});
		return list.map(c => ({
			min: [c.from[0] + 8, c.from[1], c.from[2] + 8],
			max: [c.to[0]   + 8, c.to[1],   c.to[2]   + 8]
		}));
	}

	function mergeBoxes(boxes) {
		let merged = true;
		while (merged) {
			merged = false;
			const used = new Array(boxes.length).fill(false);
			const result = [];

			for (let i = 0; i < boxes.length; i++) {
				if (used[i]) continue;
				let a = boxes[i];
				let didMerge = false;

				for (let j = i + 1; j < boxes.length; j++) {
					if (used[j]) continue;
					const m = tryMerge(a, boxes[j]);
					if (m) {
						result.push(m);
						used[i] = used[j] = true;
						didMerge = true;
						merged = true;
						break;
					}
				}

				if (!didMerge) result.push(a);
			}

			boxes = result;
		}
		return boxes;
	}

	function tryMerge(a, b) {
		const axes = [0, 1, 2];
		for (const axis of axes) {
			const other = axes.filter(x => x !== axis);
			const planar = other.every(ax =>
				a.min[ax] === b.min[ax] && a.max[ax] === b.max[ax]
			);
			if (!planar) continue;
			if (a.max[axis] === b.min[axis]) {
				return { min: [...a.min], max: a.max.map((v, i) => i === axis ? b.max[axis] : v) };
			}
			if (b.max[axis] === a.min[axis]) {
				return { min: [...b.min], max: b.max.map((v, i) => i === axis ? a.max[axis] : v) };
			}
		}
		return null;
	}

	function formatPayload(payload) {
		const { format_version } = payload;
		const { identifier } = payload["minecraft:voxel_shape"].description;
		const boxes = payload["minecraft:voxel_shape"].shape.boxes;
		const boxLines = boxes.map(b => {
			const min = `[ ${b.min.join(", ")} ]`;
			const max = `[ ${b.max.join(", ")} ]`;
			return `\t\t\t\t{\n\t\t\t\t\t"min": ${min},\n\t\t\t\t\t"max": ${max}\n\t\t\t\t}`;
		}).join(",\n");
		return `{\n\t"format_version": "${format_version}",\n\t"minecraft:voxel_shape": {\n\t\t"description": {\n\t\t\t"identifier": "${identifier}"\n\t\t},\n\t\t"shape": {\n\t\t\t"boxes": [\n${boxLines}\n\t\t\t]\n\t\t}\n\t}\n}`;
	}
})();