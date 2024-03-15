(function() {

	let images = {
			north: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAABlBMVEVHcEz///+flKJDAAAAAXRSTlMAQObYZgAAABVJREFUCNdjSGxgAKJKMEoHo0QEAgCIGwkHoSKsGQAAAABJRU5ErkJggg",
			east : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFAQMAAAC3obSmAAAABlBMVEVHcEz///+flKJDAAAAAXRSTlMAQObYZgAAABBJREFUCNdjKGBwYEgA4gIACMoBwSwi6WsAAAAASUVORK5CYII",
			south: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFAQMAAAC3obSmAAAABlBMVEVHcEz///+flKJDAAAAAXRSTlMAQObYZgAAABJJREFUCNdjKGBwYChgEGAoAAAIigGhv1KChwAAAABJRU5ErkJggg",
			west : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAABlBMVEVHcEz///+flKJDAAAAAXRSTlMAQObYZgAAABhJREFUCNdjYGBgOHAAhM4gIWMGEGJgAACnnQmX+CnbdwAAAABJRU5ErkJggg"
		},
		buildGridCopy = Canvas.buildGrid;

	Plugin.register("cardinal", {
		title: "Cardinal",
		author: "Bug1312",
		description: "Adds in all cardinal directions on the grid and renders them on-top of everything while facing the camera.",
		about: "If you wish to change the color, use custom CSS to set the variable 'cardinal' to any color! The scale can be changed from within the settings.",
		icon: "border_outer",
		version: "1.1.0",
		variant: "both",
		onload() {
			new Setting("cardinal_scale", {
				value: 1,
				category: "preview",
				name: "Cardinal Scale",
				description: "Change the scale of the cardinals",
				type: "number",
				onChange: build
			});
			build();
		},
		onunload() { 
			Canvas.buildGrid = buildGridCopy;
			window.buildGrid = Canvas.buildGrid;
		},
		onuninstall() { Canvas.buildGrid() }
	});

	function build() {
		Canvas.buildGrid = function() {
			// Default grid
			buildGridCopy();

			// Hide default north mark
			let north_mark = three_grid.children.find(c => c.material === Canvas.northMarkMaterial);
			if (north_mark) north_mark.visible = false;

			// Generate other marks
			addMark(images.north, [ 0.0, -9.5 ]);
			addMark(images.east,  [ 9.5,  0.0 ]);
			addMark(images.south, [ 0.0,  9.5 ]);
			addMark(images.west,  [-9.5,  0.0 ]);
		};
		window.buildGrid = Canvas.buildGrid;
		Canvas.buildGrid();
	}

	function addMark(src, pos) {
		let img = new Image(),
			tex = new THREE.Texture(img),
			color = getComputedStyle(document.body).getPropertyValue("--cardinal").replace(/^\s*/, "");

		if (color === "") color = "#FFF";

		// Set textures to src
		img.src = src;
		img.tex = tex;

		// Render pixelated
		img.tex.magFilter = THREE.NearestFilter;
		img.tex.minFilter = THREE.NearestFilter;

		// When loaded, render texture but only do so after onBeforeRender()
		//	Results in less flashing
		img.onload = function() { this.tex.needsUpdate = true };

		// Setup cardinal mark
		let geometry = new THREE.PlaneGeometry(2.4 * settings.cardinal_scale.value, 2.4 * settings.cardinal_scale.value),
			material = new THREE.MeshBasicMaterial({
				map: tex,
				transparent: true,
				color: new THREE.Color(color)
			}),
			mark = new THREE.Mesh(geometry, material);

		// Render on top
		mark.renderOrder = 10;
		mark.material.depthTest  = false;
		mark.material.depthWrite = false;

		// Look at camera
		mark.onBeforeRender = function() { this.rotation.set(main_preview.camera.rotation.x, main_preview.camera.rotation.y, main_preview.camera.rotation.z) };

		// Move marks based on grid positioning
		if (Format.centered_grid) mark.position.set(pos[0], 0, pos[1]);
		else mark.position.set(pos[0] + 8, 0, pos[1] + 8);

		// Add to grid
		three_grid.add(mark);
	}

})();
