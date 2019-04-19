var plugin_data = {
	id: 'optimize',
	title: 'Optimize',  
	icon: 'border_outer',
	author: 'Krozi',
	description: 'Hide concealed faces for better performance!',
	version: '1.2.4',
	variant: 'both'
}


MenuBar.addAction(new Action({
	id: "optimize",
	name: "Optimize",
	icon: "border_outer",
	category: "filter",
	click: function(ev) {
try {
	var dialog = new Dialog({title:'Optimize', id:'optimize_options', lines:[
		'<p>Restrict to selected elements <input type="checkbox" id="restrict"></p>',
		'<p>Apply culling (Blockmodels only)<input type="checkbox" id = "culling"></p>',
		'<br/>Please check if all visible cubes are still there.<br/>Unwanted changes can be reverted using Ctrl+Z.'
	],
	"onConfirm": function(data) {
	dialog.hide()
	var restrictToSelected = $("#restrict")[0].checked
	var applyCulling = $("#culling")[0].checked
	
	var elements = Blockbench.elements
	if (restrictToSelected) {
		elements = selected
	}
	aspects = {"cubes": elements, "uv_only": false}
	Undo.initEdit(aspects)
	
	Blockbench.showMessage('Starting optimization', 'center')
	var axisToFace = ['west', 'down', 'north', 'east', 'up', 'south']
	var epsilon = 0.00001
	var removedFaces = 0
	var culledFaces = 0
	var invisibleCubes = []
	for (i=0; i<elements.length; i++) {
		var cube1 = elements[i]
		var origin1 = cube1.origin
		var angle1
		var rotationAxis1
		[angle1, rotationAxis1] = optimize_getAngleAxis(cube1.rotation)
		for (faceAxis = 0; faceAxis < 6; faceAxis++) {
			if (cube1.faces[axisToFace[faceAxis]].texture == null) {
				continue
			}
			if (applyCulling) {
				delete cube1.faces[axisToFace[faceAxis]].cullface
			}
			var x = (faceAxis+2)%3
			var y = faceAxis%3
			var z = (faceAxis+1)%3
			var level
			if (faceAxis < 3) {
				level = cube1.from[y]
			}
			else {
				level = cube1.to[y]
			}
			if (Math.abs(cube1.to[x] - cube1.from[x]) < epsilon || Math.abs(cube1.to[z] - cube1.from[z]) < epsilon) {
				var planes = []
			}
			else {
				var planes = [[cube1.from[x], cube1.from[z], cube1.to[x], cube1.to[z]]]
				for (j=0; j<elements.length; j++) {
					if (cube1.faces[axisToFace[faceAxis]].texture !== null && i != j) {
						var cube2 = elements[j]
						
						var origin2 = cube2.origin
						var angle2
						var rotationAxis2
						[angle2, rotationAxis2] = optimize_getAngleAxis(cube2.rotation)
						if (rotationAxis1 != rotationAxis2 && angle1 != 0 && angle2 != 0) {
							continue			// Intersection not a rectangle --> Not my problem, ignore
						}
						var rotationAxis = Math.max(rotationAxis1, rotationAxis2)
						var notRotationAxis = 3-y-rotationAxis
						var intersection = []
						
						if (rotationAxis1 == rotationAxis2 && angle1 == angle2) {			// Both cubes have the same orientations
							var from = optimize_rotatePoint(optimize_rotatePoint(cube2.from, origin2, rotationAxis, angle2), origin1, rotationAxis, -angle1)
							var to = optimize_rotatePoint(optimize_rotatePoint(cube2.to, origin2, rotationAxis, angle2), origin1, rotationAxis, -angle1)
							var level2 = to[y]
							if (faceAxis < 3) {
								level2 = from[y]
							}
							if (level2-epsilon <= level && level <= level2+epsilon && cube2.faces[axisToFace[faceAxis]].texture === null) {}
							else if (from[y]-epsilon <= level && level <= to[y]+epsilon) {
								intersection = [from[x], from[z], to[x], to[z]]
							}
						}
						
						else if (rotationAxis1 == rotationAxis2 || angle1 == 0 || angle2 == 0) {		// Both cubes have different orientations
							var corners = []
							corner = cube2.from.slice(0)
							corners.push(optimize_rotatePoint(optimize_rotatePoint(corner, origin2, rotationAxis, angle2), origin1, rotationAxis, -angle1))
							corner[(rotationAxis+1)%3] = cube2.to[(rotationAxis+1)%3]
							corners.push(optimize_rotatePoint(optimize_rotatePoint(corner, origin2, rotationAxis, angle2), origin1, rotationAxis, -angle1))
							corner[(rotationAxis+2)%3] = cube2.to[(rotationAxis+2)%3]
							corners.push(optimize_rotatePoint(optimize_rotatePoint(corner, origin2, rotationAxis, angle2), origin1, rotationAxis, -angle1))
							corner[(rotationAxis+1)%3] = cube2.from[(rotationAxis+1)%3]
							corners.push(optimize_rotatePoint(optimize_rotatePoint(corner, origin2, rotationAxis, angle2), origin1, rotationAxis, -angle1))
							var intersected = []
							for (var c=0; c<4; c++) {
								var t = (level-corners[c][y]) / (corners[(c+1)%4][y]-corners[c][y])
								if (0 <= t && t < 1) {
									intersected.push(corners[c][notRotationAxis] + (corners[(c+1)%4][notRotationAxis] - corners[c][notRotationAxis]) * t)
								}
							}
							if (intersected.length == 2) {
								if (notRotationAxis == z) {
									intersection = [cube2.from[x], Math.min(intersected[0], intersected[1]), cube2.to[x], Math.max(intersected[0], intersected[1])]
								}
								else {
									intersection = [Math.min(intersected[0], intersected[1]), cube2.from[z], Math.max(intersected[0], intersected[1]), cube2.to[z]]
								}
							}
						}
						
						if (intersection.length == 4) {
							var newPlanes = []
							for (planeNumber=0; planeNumber < planes.length; planeNumber++) {
								plane = planes[planeNumber]
								if (plane[0] < intersection[2]-epsilon && plane[2] > intersection[0]+epsilon && plane[1] < intersection[3]-epsilon && plane[3] > intersection[1]+epsilon) {		// Cube intersects with plane --> Split up in 4 new planes
									if (intersection[0]-epsilon > plane[0]) {
										newPlanes.push([plane[0], plane[1], intersection[0], plane[3]])
									}
									if (intersection[1]-epsilon > plane[1]) {
										newPlanes.push([Math.max(plane[0], intersection[0]), plane[1], Math.min(plane[2], intersection[2]), intersection[1]])
									}
									if (intersection[3]+epsilon < plane[3]) {
										newPlanes.push([Math.max(plane[0], intersection[0]), intersection[3], Math.min(plane[2], intersection[2]), plane[3]])
									}
									if (intersection[2]+epsilon < plane[2]) {
										newPlanes.push([intersection[2], plane[1], plane[2], plane[3]])
									}
								}
								else {
									newPlanes.push(plane)
								}
							}
							planes = newPlanes
						}
					}
				}
			}
			if (planes.length == 0) {
				cube1.faces[axisToFace[faceAxis]].texture = null
				removedFaces++
				var visible = false
				for (invisibleFace=0; invisibleFace<6; invisibleFace++) {
					if (cube1.faces[axisToFace[invisibleFace]].texture !== null) {
						visible = true
						break
					}
				}
				if (!visible) {
					invisibleCubes.push(i)
				}
			}
			else if (applyCulling) {
				var cullFaces = [true, true, true, true, true, true]
				for (var j = 0; j < planes.length; j++) {
					for (k = 0; k < 4; k++) {
						var corner = [0, 0, 0]
						corner[x] = planes[j][(k&1) * 2]
						corner[z] = planes[j][(k&2) + 1]
						corner[y] = level
						var rotatedCorner = optimize_rotatePoint(corner, origin1, rotationAxis1, angle1)
						for (var l = 0; l < 3; l++) {
							if (rotatedCorner[l] > epsilon) {
								cullFaces[l] = false
							}
							if (rotatedCorner[l] < 16-epsilon) {
								cullFaces[l+3] = false
							}
						}
					}
				}
				for (var j = 0; j < 6; j++) {
					if (cullFaces[j]) {
						cube1.faces[axisToFace[faceAxis]].cullface = axisToFace[j]
						culledFaces++
						break
					}
				}
			}
		}
	}
	for (i=invisibleCubes.length-1; i >= 0; i--) {
		elements[invisibleCubes[i]].remove()
	}
	updateSelection()
	Blockbench.showMessage('Faces removed: ' + removedFaces + (invisibleCubes.length > 0 && (', Cubes removed: ' + invisibleCubes.length) || '') + (culledFaces > 0 && (', Faces culled: ' + culledFaces) || ''), 'center')
	Undo.finishEdit("optimize", aspects)
    Canvas.updateAllFaces()
}})
	dialog.show()
}
catch(err) {
	Blockbench.showMessage(err.message + err, 'center')
	console.error(err)
}

}}), "filter")

optimize_rotatePoint = function(position, origin, axis, angle) {
	if (angle == 0 || axis == -1) {
		return position
	}
	var sin
	var cos
	if (angle == 45) {
		sin = 0.7071067812
		cos = 0.7071067812
	}
	else if (angle == -45) {
		sin = -0.7071067812
		cos = 0.7071067812
	}
	else if (angle == 22.5) {
		sin = 0.3826834324
		cos = 0.9238795325
	}
	else if (angle == -22.5) {
		sin = -0.3826834324
		cos = 0.9238795325
	}
	else {
		sin = Math.sin(angle)
		cos = Math.cos(angle)
	}
	var newPosition = [0,0,0]
	var x = axis
	var y = (axis+1)%3
	var z = (axis+2)%3
	newPosition[x] = position[x]
	newPosition[y] = origin[y] + (position[y]-origin[y]) * cos - (position[z]-origin[z]) * sin
	newPosition[z] = origin[z] + (position[z]-origin[z]) * cos + (position[y]-origin[y]) * sin
	return newPosition
}

optimize_getAngleAxis = function(rotation) {
	for (axis = 0; axis < 3; axis++) {
		if (rotation[axis] != 0) {
			return [rotation[axis], axis]
		}
	}
	return [0, -1]
}

onUninstall = function() {
	MenuBar.removeAction("filter.optimize")
}
