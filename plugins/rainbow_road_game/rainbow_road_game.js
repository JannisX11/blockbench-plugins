/// <reference path="../../types/index.d.ts" />

(function() {

	class RainbowRace {
		constructor() {
			this.velocity = 0.03;
			this.y_velocity = 0;
			this.steering_angle = 0;
			this.steer_direction = 0;
			this.turn_axis = new THREE.Vector3(0, 1, 0);
			this.step = 4;
			this.path = [];
			this.waypoints = [];

			this.material = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				flatShading: true,
				vertexColors: true,
				shininess: 0,
				side: THREE.DoubleSide
			});
			this.geometry = new THREE.BufferGeometry();
			this.track_width = 6;
			this.track_length = 250;
			this.track_length_back = 12;
			this.collision_length = 64;

			this.ticks = 0;
			this.playing = false;
			this.on_track = true;
			this.score = 0;

			for (let i = 0; i < this.track_length; i++) {
				this.addPathPoint(i < this.track_length_back);
			}

			let colors = [
				[128/255,  75/255, 227/255],
				[ 21/255, 118/255, 240/255],
				[ 68/255, 189/255,  96/255],
				[253/255, 203/255,  42/255],
				[252/255, 137/255,  46/255],
				[240/255,  40/255,  67/255],
			]
			let bg_color = new THREE.Color(CustomTheme.data.colors.dark);

			let vertex_count = 4 * this.track_width * this.track_length;
			this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertex_count * 3), 3));
			this.geometry.setAttribute('color', new THREE.BufferAttribute(	 new Float32Array(vertex_count * 3), 3));
			
			for (let i = 0; i < this.track_length * 20; i++) {
				for (let j = 0; j < 4; j++) {
					let k = 0;
					for (let color of colors) {
						let color_factor = 1;
						if ( (k==0 && j%2==0) || (k==5 && j%2==1) ) {
							color_factor = 1.5;
						}
						let fade = Math.min(Math.pow(i / (this.track_length * 0.97), 2), 1);
						this.geometry.attributes.color.setXYZ(
							(i*6 + k) * 4 + j,
							Math.lerp(color[0] * color_factor, bg_color.r, fade),
							Math.lerp(color[1] * color_factor, bg_color.g, fade),
							Math.lerp(color[2] * color_factor, bg_color.b, fade)
						);
						k++;
					}
				}
			}
			this.updateGeometry();

			this.coin_geometry = new THREE.OctahedronGeometry(5, 0);
			this.coin_geometry2 = new THREE.OctahedronGeometry(6.2, 0);
			this.coin_material = new THREE.MeshPhongMaterial({
				color: new THREE.Color(3.3, 3.2, 0.8),
				flatShading: false,
				shininess: 1
			});
			this.coin_material2 = new THREE.MeshPhongMaterial({
				color: 0xff9c2b,
				flatShading: true,
				shininess: 0,
				opacity: 0.5,
				transparent: true
			});
			this.coins = [];
			
			this.scene = new THREE.Object3D();
			this.world = new THREE.Object3D();
			this.track = new THREE.Mesh(this.geometry, this.material);
			this.scene.add(this.world);
			this.world.add(this.track);
			this.position = new THREE.Vector3();

			this.keys = {
				w: false,
				s: false,
				a: false,
				d: false,
			};
			document.addEventListener('keydown', event => {
				if (event.key == 'w') this.keys.w = true;
				if (event.key == 's') this.keys.s = true;
				if (event.key == 'a') this.keys.a = true;
				if (event.key == 'd') this.keys.d = true;
			})
			document.addEventListener('keyup', event => {
				if (event.key == 'w') this.keys.w = false;
				if (event.key == 's') this.keys.s = false;
				if (event.key == 'a') this.keys.a = false;
				if (event.key == 'd') this.keys.d = false;
			})

			this.interval = setInterval(() => {
				this.tick();
			}, 1000/30);
		}
		async start() {
			if (this.playing) this.stop();

			Canvas.scene.add(this.scene);
			three_grid.visible = false;

			let model_size = 3 / calculateVisibleBox()[0];
			Project.model_3d.scale.set(model_size, model_size, model_size);

			let path_scale = 3;
			this.track.scale.set(path_scale, path_scale, path_scale);
			this.velocity = 0;
			this.y_velocity = 0;
			this.on_track = true;
			this.playing = true;
			this.score = 0;
			this.steer_direction = 0;
			this.scene.rotation.set(0, 0, 0);
			this.world.position.set(0, 0, -this.track_length_back * path_scale);
			this.track.position.set(0, 0, 0);
			this.track.rotation.set(0, 0, 0);

			let camera_preset = {
				projection: 'perspective',
				position: [0, 32, -40],
				target: [0, 20, 0]
			};
			Preview.selected.loadAnglePreset(camera_preset);

			this.front_right_wheel = Group.all.find(g => {
				let name = g.name.toLowerCase();
				return name.includes('wheel') && name.includes('front') && name.includes('right')
			})?.mesh;
			this.front_left_wheel = Group.all.find(g => {
				let name = g.name.toLowerCase();
				return name.includes('wheel') && name.includes('front') && name.includes('left')
			})?.mesh;
			let rear_wheel = Group.all.find(g => {
				let name = g.name.toLowerCase();
				return (name.includes('wheel') || name.includes('axle') || name.includes('axis')) && (name.includes('rear') || name.includes('back'))
			})
			this.rotation_adjustment = Math.PI;
			if (rear_wheel) {
				if (rear_wheel.origin[2] < 0) {
					this.rotation_adjustment = 0;
					Project.model_3d.position.z -= rear_wheel.origin[2] * model_size;
				} else {
					Project.model_3d.position.z += rear_wheel.origin[2] * model_size;
				}
			}

			return this;
		}
		stop() {
			Canvas.scene.remove(this.scene);
			three_grid.visible = true;
			this.playing = false;
			Project.model_3d.rotation.y = 0;
			Project.model_3d.scale.set(1, 1, 1);
			Project.model_3d.position.set(0, 0, 0);
			Blockbench.setStatusBarText();
			this.coins.forEach(coin => this.world.remove(coin));
			this.coins.empty();

			if (this.timeout) {
				clearTimeout(this.timeout);
				delete this.timeout;
			}
		}
		tick() {
			if (!this.playing) {
				return;
			}

			let steering_amount = 0.2 * (1-Math.exp(0.2 * (this.velocity - 18)));
			if (this.keys.a) {
				this.steering_angle -= steering_amount * (1+Math.pow( this.steering_angle / 2, 3));
			} else if (this.keys.d) {
				this.steering_angle += steering_amount * (1+Math.pow(-this.steering_angle / 2, 3));
			} else if (this.steering_angle) {
				//this.steering_angle -= (this.steering_angle > 0 ? 1 : -1) * 0.14;
				//if (Math.abs(this.steering_angle) < 0.1) this.steering_angle = 0;
				this.steering_angle *= 0.8;
			}
			this.steering_angle = Math.clamp(this.steering_angle, -1.5, 1.4);

			if (this.keys.w) {
				this.velocity += 0.1 * (1-Math.exp(0.3 * (this.velocity - 7)));
			} else if (this.keys.s) {
				this.velocity -= this.velocity > 0 ? 0.15 : 0.1;
			} else {
				this.velocity -= this.velocity > 0 ? 0.1 : -0.1;
				if (Math.abs(this.velocity) < 0.1) this.velocity = 0;
			}
			this.velocity = Math.clamp(this.velocity, -4, 10);

			if (!this.on_track) {
				this.y_velocity = Math.clamp(this.y_velocity - 0.2, -4, 4);
			}

			let movement = new THREE.Vector3(0, -this.y_velocity, -this.velocity);
			this.steer_direction = this.steer_direction + this.steering_angle * Math.min(this.velocity, 1.4) * 0.02;
			movement.applyAxisAngle(this.turn_axis, -this.steer_direction + 0);
			this.scene.rotation.y = Math.lerp(this.scene.rotation.y, this.steer_direction, 0.1);
			Project.model_3d.rotation.y = this.rotation_adjustment + this.scene.rotation.y - this.steer_direction;
			this.world.position.add(movement);

			if (this.front_right_wheel) this.front_right_wheel.rotation.y = this.steering_angle * -0.5;
			if (this.front_left_wheel) this.front_left_wheel.rotation.y = this.steering_angle * -0.5;

			let closest_waypoint = this.getClosestWaypoint();
			if (closest_waypoint) {
				let segments_regenerated = false;
				while (closest_waypoint.index > this.track_length_back) {
					this.generatePathStep();
					segments_regenerated = true;
					closest_waypoint.index--;
				}
				if (segments_regenerated) this.updateGeometry();
			} else if (this.on_track) {
				// Fall off
				this.fall();
			}

			this.coins.forEach(coin => {
				coin.rotation.y += 0.01;
				coin.position.y = 10 + Math.sin(this.ticks * 0.1) * 0.8;

				let offset = Reusable.vec2.set(0, 0, 0);
				coin.localToWorld(offset);
				let distance = offset.length();
				if (distance && distance < 34) {
					this.collectCoin(coin);
				}
			});

			Blockbench.setStatusBarText(`Score: ${separateThousands(this.score)}`);

			this.ticks++;
		}
		fall() {
			this.on_track = false;
			let previous_highscore = localStorage.getItem('rainbow_game.highscore') || 0;
			RainbowRace.last_score = this.score;
			if (this.score > previous_highscore) {
				Blockbench.showQuickMessage(`New Highscore: ${separateThousands(this.score)}`);
				localStorage.setItem('rainbow_game.highscore', this.score);
			} else {
				Blockbench.showQuickMessage(`Score: ${separateThousands(this.score)}`);
			}
			
			this.timeout = setTimeout(() => {
				this.stop();
			}, 1000)
		}
		createCoin(position) {
			let coin = new THREE.Mesh(this.coin_geometry, this.coin_material);
			let coin_glow = new THREE.Mesh(this.coin_geometry2, this.coin_material2);
			coin.add(coin_glow);
			coin.position.copy(position);
			coin.position.y = 10;
			coin.scale.y = 1.4;
			this.world.add(coin);
			this.coins.push(coin);

			if (this.coins.length > 40) {
				this.world.remove(this.coins.shift());
			}
		}
		collectCoin(coin) {
			this.score += 5;
			setTimeout(() => {
				this.coins.remove(coin);
			}, 40);
			let interval = setInterval(() => {
				coin.position.y *= 1.1;
				coin.scale.multiplyScalar(0.95);
			}, 16)
			setTimeout(() => {
				clearInterval(interval);
				this.coins.remove(coin);
				this.world.remove(coin);
			}, 150);
		}
		generatePathStep() {
			this.track.rotation.y += this.path[0];
			let offset = new THREE.Vector3(0, 0, -this.step * this.track.scale.x);
			offset.applyAxisAngle(this.turn_axis, this.track.rotation.y);
			//offset.x *= this.track.scale.x;
			//offset.z *= this.track.scale.x;
			this.track.position.sub(offset);

			if (Math.random() < 1/24) {
				// Coin
				let waypoint = this.waypoints[this.collision_length - 2];
				let position = Reusable.vec1.copy(waypoint.position);
				position.applyMatrix4(this.track.matrix);
				this.createCoin(position);
			}

			this.path.shift();
			this.addPathPoint();
			this.score++;
		}
		getClosestWaypoint() {
			let position = new THREE.Vector3();
			this.track.worldToLocal(position);
			let distance = new THREE.Vector3();
			let waypoints_in_reach = this.waypoints.filter((waypoint, index) => {
				waypoint.index = index;
				waypoint.distance = distance.copy(position).sub(waypoint.position).length();
				return waypoint.distance <= (this.track_width + 2);
			});
			waypoints_in_reach.sort((a, b) => a.distance - b.distance);
			return waypoints_in_reach[0];
		}
		updateGeometry() {
			let segment_width = 2;
			let angle = 0;
			let trailhead = new THREE.Vector3(0, 0, 0);
			let offset1 = new THREE.Vector3(0, 0, 0);
			let offset2 = new THREE.Vector3(0, 0, 0);
			let offset3 = new THREE.Vector3(0, 0, 0);
			let offset4 = new THREE.Vector3(0, 0, 0);

			let quad_index = 0;
			let indices = [];
			let positions = [];

			this.waypoints.empty();

			let i = 0;
			for (let curvature of this.path) {
				let old_angle = angle;
				angle += curvature;
				if (i < this.collision_length) {
					this.waypoints.push({position: new THREE.Vector3().copy(trailhead)});
				}
				for (let x = -3; x < 3; x++) {
					offset1.set(x * segment_width, 0, 0)
					offset1.applyAxisAngle(this.turn_axis, old_angle);
					offset1.add(trailhead);
					positions.push(offset1.x, offset1.y, offset1.z);

					offset2.set((x+1) * segment_width, 0, 0)
					offset2.applyAxisAngle(this.turn_axis, old_angle);
					offset2.add(trailhead);
					positions.push(offset2.x, offset2.y, offset2.z);

					offset3.set(x * segment_width, 0, this.step);
					offset3.applyAxisAngle(this.turn_axis, angle);
					offset3.add(trailhead);
					positions.push(offset3.x, offset3.y, offset3.z);

					offset4.set((x+1) * segment_width, 0, this.step);
					offset4.applyAxisAngle(this.turn_axis, angle);
					offset4.add(trailhead);
					positions.push(offset4.x, offset4.y, offset4.z);

					indices.push(quad_index*4 + 0, quad_index*4 + 3, quad_index*4 + 1, quad_index*4 + 0, quad_index*4 + 2, quad_index*4 + 3);

					quad_index++;
				}
				offset1.set(0, -0.005, this.step);
				offset1.applyAxisAngle(this.turn_axis, angle);
				trailhead.add(offset1);
				i++;
			}
			this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
			this.geometry.setIndex(indices);
		}
		addPathPoint(straight) {
			let last_point = this.path.last() || 0;
			let influence = straight ? 0 : Math.pow(Math.randomab(-1, 1), 3) * 0.5;
			this.path.push(Math.lerp(last_point, influence, 0.075));
		}
		
	}
	RainbowRace.start = () => {
		if (!RainbowRace.current_race) {
			RainbowRace.current_race = new RainbowRace();
		}
		RainbowRace.current_race.start();
	}
	RainbowRace.stop = () => {
		RainbowRace.current_race.stop();
	}

	let css, controls, highscore_action;
	
	Plugin.register('rainbow_road_game', {
		title: "Rainbow Road Game",
		author: "JannisX11",
		icon: "icon.png",
		description: "The rainbow road racing minigame from April fools day 2024! Turn your model into a race car and take it for a spin!",
		tags: ["Minigame"],
		version: "0.1.0",
		min_version: "4.8.0",
		variant: "both",
		creation_date: "2024-04-1",
		onload() {

			let buttons = [
				Interface.createElement('div', {}, Blockbench.getIconNode('play_arrow')),
				Interface.createElement('div', {}, Blockbench.getIconNode('pause')),
			];
			controls = Interface.createElement('div', {id: 'rainbow_game_controls'}, buttons);
			Interface.preview.append(controls);
			buttons[0].onclick = RainbowRace.start;
			buttons[1].onclick = RainbowRace.stop;

			Blockbench.addCSS(`
				#rainbow_game_controls {
					width: 64px;
					height: 30px;
					margin: auto;
					left: 0;
					right: 0;
					top: 1px;
					background-color: var(--color-ui);
					display: flex;
					position: absolute;
					z-index: 10;
					border-bottom-right-radius: 2px;
					border-bottom-left-radius: 2px;
				}
				#rainbow_game_controls > div {
					height: 100%;
					cursor: pointer;
					padding: 4px;
					text-align: center;
				}
				#rainbow_game_controls > div:hover {
					color: var(--color-light);
				}
			`);

			highscore_action = new Action('rainbow_road_highscore', {
				name: 'View Rainbow Road Game Highscore',
				icon: 'looks',
				click() {
					Blockbench.showMessageBox({
						title: 'Rainbow Road Game',
						message: `Last score: ${separateThousands(RainbowRace.last_score || 0)}\n\nHighscore: ${separateThousands(localStorage.getItem('rainbow_game.highscore') || 0)}`
					})
				}
			})
		},
		onunload() {
			controls.remove();
			css.delete();
		}
	});
	
	})()
	