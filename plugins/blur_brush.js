let blurBrushTool;
let smudgeBrushTool;
let blurRadiusSlider;
let blurIntensitySlider;
let smudgeIntensitySlider;
let smudgeDistanceSlider;
let blurBrushSettingsInitialized = false;

const BLUR_SETTINGS_KEY = 'blur_brush_settings';
const DEFAULT_BLUR_SETTINGS = {
	radius: 2,
	intensity: 50,
	smudge_intensity: 65,
	smudge_distance: 8
};

function blurClamp(value, min, max) {
	value = Number(value);
	if (!Number.isFinite(value)) return min;
	return Math.min(max, Math.max(min, value));
}

function blurLerp(a, b, t) {
	return a + (b - a) * t;
}

function ensureBlurSettingsInitialized() {
	if (blurBrushSettingsInitialized) return;

	if (typeof StateMemory !== 'undefined' && StateMemory.init) {
		StateMemory.init(BLUR_SETTINGS_KEY, 'object');
	}

	blurBrushSettingsInitialized = true;
}

function loadBlurSettings() {
	ensureBlurSettingsInitialized();

	let saved = {};
	if (typeof StateMemory !== 'undefined' && StateMemory.get) {
		saved = StateMemory.get(BLUR_SETTINGS_KEY) || {};
	} else if (typeof localStorage !== 'undefined') {
		try {
			saved = JSON.parse(localStorage.getItem(BLUR_SETTINGS_KEY)) || {};
		} catch (error) {
			localStorage.removeItem(BLUR_SETTINGS_KEY);
		}
	}

	return {
		radius: Math.round(blurClamp(saved.radius ?? DEFAULT_BLUR_SETTINGS.radius, 1, 5)),
		intensity: blurClamp(saved.intensity ?? DEFAULT_BLUR_SETTINGS.intensity, 0, 100),
		smudge_intensity: blurClamp(saved.smudge_intensity ?? DEFAULT_BLUR_SETTINGS.smudge_intensity, 0, 100),
		smudge_distance: blurClamp(saved.smudge_distance ?? DEFAULT_BLUR_SETTINGS.smudge_distance, 1, 32)
	};
}

function saveBlurSettings() {
	let settings = {
		radius: getBlurRadius(),
		intensity: getBlurIntensity(),
		smudge_intensity: getSmudgeIntensity(),
		smudge_distance: getSmudgeDistance()
	};

	if (typeof StateMemory !== 'undefined' && StateMemory.set) {
		StateMemory.set(BLUR_SETTINGS_KEY, settings);
	} else if (typeof localStorage !== 'undefined') {
		localStorage.setItem(BLUR_SETTINGS_KEY, JSON.stringify(settings));
	}
}

function getBlurRadius() {
	if (blurRadiusSlider && typeof blurRadiusSlider.get === 'function') {
		return Math.round(blurClamp(blurRadiusSlider.get(), 1, 5));
	}
	return DEFAULT_BLUR_SETTINGS.radius;
}

function getBlurIntensity() {
	if (blurIntensitySlider && typeof blurIntensitySlider.get === 'function') {
		return blurClamp(blurIntensitySlider.get(), 0, 100);
	}
	return DEFAULT_BLUR_SETTINGS.intensity;
}

function getSmudgeIntensity() {
	if (smudgeIntensitySlider && typeof smudgeIntensitySlider.get === 'function') {
		return blurClamp(smudgeIntensitySlider.get(), 0, 100);
	}
	return DEFAULT_BLUR_SETTINGS.smudge_intensity;
}

function getSmudgeDistance() {
	if (smudgeDistanceSlider && typeof smudgeDistanceSlider.get === 'function') {
		return blurClamp(smudgeDistanceSlider.get(), 1, 32);
	}
	return DEFAULT_BLUR_SETTINGS.smudge_distance;
}

function getLocalPixelPosition(px, py) {
	let offset = (Painter.current && Painter.current.offset) || [0, 0];
	return [
		Math.round(px - offset[0]),
		Math.round(py - offset[1])
	];
}

function getCanvasPixel(ctx, x, y) {
	x = Math.round(blurClamp(x, 0, ctx.canvas.width - 1));
	y = Math.round(blurClamp(y, 0, ctx.canvas.height - 1));

	let {data} = ctx.getImageData(x, y, 1, 1);
	return {
		r: data[0],
		g: data[1],
		b: data[2],
		a: data[3] / 255
	};
}

function sampleCanvasPixel(ctx, x, y) {
	x = blurClamp(x, 0, ctx.canvas.width - 1);
	y = blurClamp(y, 0, ctx.canvas.height - 1);

	let x0 = Math.floor(x);
	let y0 = Math.floor(y);
	let x1 = Math.min(ctx.canvas.width - 1, x0 + 1);
	let y1 = Math.min(ctx.canvas.height - 1, y0 + 1);
	let tx = x - x0;
	let ty = y - y0;
	let topLeft = getCanvasPixel(ctx, x0, y0);
	let topRight = getCanvasPixel(ctx, x1, y0);
	let bottomLeft = getCanvasPixel(ctx, x0, y1);
	let bottomRight = getCanvasPixel(ctx, x1, y1);

	return {
		r: blurLerp(blurLerp(topLeft.r, topRight.r, tx), blurLerp(bottomLeft.r, bottomRight.r, tx), ty),
		g: blurLerp(blurLerp(topLeft.g, topRight.g, tx), blurLerp(bottomLeft.g, bottomRight.g, tx), ty),
		b: blurLerp(blurLerp(topLeft.b, topRight.b, tx), blurLerp(bottomLeft.b, bottomRight.b, tx), ty),
		a: blurLerp(blurLerp(topLeft.a, topRight.a, tx), blurLerp(bottomLeft.a, bottomRight.a, tx), ty)
	};
}

function getSourcePixel(source, x, y) {
	x = Math.round(blurClamp(x - source.x, 0, source.width - 1));
	y = Math.round(blurClamp(y - source.y, 0, source.height - 1));

	let index = (x + y * source.width) * 4;
	return {
		r: source.data[index],
		g: source.data[index + 1],
		b: source.data[index + 2],
		a: source.data[index + 3] / 255
	};
}

function sampleSourcePixel(source, x, y) {
	x = blurClamp(x, source.x, source.x + source.width - 1);
	y = blurClamp(y, source.y, source.y + source.height - 1);

	let x0 = Math.floor(x);
	let y0 = Math.floor(y);
	let x1 = Math.min(source.x + source.width - 1, x0 + 1);
	let y1 = Math.min(source.y + source.height - 1, y0 + 1);
	let tx = x - x0;
	let ty = y - y0;
	let topLeft = getSourcePixel(source, x0, y0);
	let topRight = getSourcePixel(source, x1, y0);
	let bottomLeft = getSourcePixel(source, x0, y1);
	let bottomRight = getSourcePixel(source, x1, y1);

	return {
		r: blurLerp(blurLerp(topLeft.r, topRight.r, tx), blurLerp(bottomLeft.r, bottomRight.r, tx), ty),
		g: blurLerp(blurLerp(topLeft.g, topRight.g, tx), blurLerp(bottomLeft.g, bottomRight.g, tx), ty),
		b: blurLerp(blurLerp(topLeft.b, topRight.b, tx), blurLerp(bottomLeft.b, bottomRight.b, tx), ty),
		a: blurLerp(blurLerp(topLeft.a, topRight.a, tx), blurLerp(bottomLeft.a, bottomRight.a, tx), ty)
	};
}

function prepareSmudgeSource(context, state) {
	let [centerX, centerY] = getLocalPixelPosition(context.x, context.y);
	let brushRadius = Math.ceil(((Number(context.size) || 1) + 1) / 2) + 3;
	let padding = brushRadius + Math.ceil(getSmudgeDistance()) + 2;
	let minX = Math.max(0, Math.floor(centerX - padding));
	let minY = Math.max(0, Math.floor(centerY - padding));
	let maxX = Math.min(context.ctx.canvas.width - 1, Math.ceil(centerX + padding));
	let maxY = Math.min(context.ctx.canvas.height - 1, Math.ceil(centerY + padding));
	let width = maxX - minX + 1;
	let height = maxY - minY + 1;

	if (width <= 0 || height <= 0) {
		state.source = null;
		return;
	}

	let imageData = context.ctx.getImageData(minX, minY, width, height);
	state.source = {
		x: minX,
		y: minY,
		width,
		height,
		data: imageData.data
	};
}

function getPixelFromData(data, width, x, y) {
	let index = (x + y * width) * 4;
	return [
		data[index],
		data[index + 1],
		data[index + 2],
		data[index + 3]
	];
}

function getCanvasOffset() {
	let offset = (Painter.current && Painter.current.offset) || [0, 0];
	return [
		Number(offset[0]) || 0,
		Number(offset[1]) || 0
	];
}

function getCurrentPaintingRect() {
	let rect = typeof Painter !== 'undefined' && Painter.editing_area;
	if (!Array.isArray(rect) || rect.length < 4) return null;
	if (!rect.every(value => Number.isFinite(Number(value)))) return null;
	return rect.map(value => Number(value));
}

function isPixelInsidePaintingRect(x, y, rect) {
	if (!rect) return true;
	return (
		x + 0.02 >= Math.floor(rect[0]) &&
		y + 0.02 >= Math.floor(rect[1]) &&
		x + 0.02 < rect[2] &&
		y + 0.02 < rect[3]
	);
}

function getStrictCurrentFaceMatrix(context) {
	let current = typeof Painter !== 'undefined' && Painter.current;
	if (!current || !current.element || !current.element.faces || current.face === undefined || current.face === null) return null;

	let face = current.element.faces[current.face];
	if (!face || typeof face.getOccupationMatrix !== 'function') return null;

	if (!current.blur_brush_face_matrices) {
		current.blur_brush_face_matrices = {};
	}

	let textureId = context.texture && (context.texture.uuid || context.texture.name || '');
	let matrixId = `${current.element.uuid || 'element'}:${current.face}:${textureId}`;
	if (!current.blur_brush_face_matrices[matrixId]) {
		current.blur_brush_face_matrices[matrixId] = face.getOccupationMatrix(true, [0, 0]);
	}
	return current.blur_brush_face_matrices[matrixId];
}

function getCurrentFaceMatrix(context) {
	let strictFaceMatrix = getStrictCurrentFaceMatrix(context);
	if (strictFaceMatrix) return strictFaceMatrix;

	let current = typeof Painter !== 'undefined' && Painter.current;
	if (!current || !current.face_matrices || current.face === undefined || current.face === null) return null;

	let matrixId = current.element ? (current.element.uuid + current.face) : current.face;
	return current.face_matrices[matrixId] || null;
}

function faceMatrixAllowsPixel(faceMatrix, x, y, context) {
	if (!faceMatrix) return true;

	x = Math.round(x);
	y = Math.round(y);
	if (context.texture && context.texture.display_height) {
		y = ((y % context.texture.display_height) + context.texture.display_height) % context.texture.display_height;
	}

	if (typeof faceMatrix.get === 'function') {
		return !!faceMatrix.get(x, y);
	}
	if (typeof faceMatrix.allow === 'function') {
		return !!faceMatrix.allow(x, y);
	}
	return !!(faceMatrix[x] && faceMatrix[x][y]);
}

function textureSelectionAllowsPixel(context, x, y) {
	let selection = context.texture && context.texture.selection;
	if (!selection && typeof UVEditor !== 'undefined' && UVEditor.texture) {
		selection = UVEditor.texture.selection;
	}
	if (selection && typeof selection.allow === 'function') {
		return selection.allow(x, y) !== 0;
	}
	return true;
}

function createBlurSampleMask(context) {
	return {
		rect: getCurrentPaintingRect(),
		faceMatrix: getCurrentFaceMatrix(context)
	};
}

function canUseBlurSample(globalX, globalY, context, mask) {
	return (
		isPixelInsidePaintingRect(globalX, globalY, mask.rect) &&
		faceMatrixAllowsPixel(mask.faceMatrix, globalX, globalY, context) &&
		textureSelectionAllowsPixel(context, globalX, globalY)
	);
}

function averageNeighborPixels(context, px, py, radius) {
	let ctx = context.ctx;
	let [offsetX, offsetY] = getCanvasOffset();
	let centerX = Math.round(px);
	let centerY = Math.round(py);
	let minGlobalX = Math.max(offsetX, centerX - radius);
	let minGlobalY = Math.max(offsetY, centerY - radius);
	let maxGlobalX = Math.min(offsetX + ctx.canvas.width - 1, centerX + radius);
	let maxGlobalY = Math.min(offsetY + ctx.canvas.height - 1, centerY + radius);
	let width = maxGlobalX - minGlobalX + 1;
	let height = maxGlobalY - minGlobalY + 1;

	if (width <= 0 || height <= 0) return null;

	let imageData = ctx.getImageData(minGlobalX - offsetX, minGlobalY - offsetY, width, height);
	let data = imageData.data;
	let mask = createBlurSampleMask(context);
	let radiusSq = radius * radius;
	let totalAlpha = 0;
	let totalRawR = 0;
	let totalRawG = 0;
	let totalRawB = 0;
	let totalPremulR = 0;
	let totalPremulG = 0;
	let totalPremulB = 0;
	let totalA = 0;
	let count = 0;

	for (let y = 0; y < height; y++) {
		let globalY = minGlobalY + y;
		for (let x = 0; x < width; x++) {
			let globalX = minGlobalX + x;
			let dx = globalX - centerX;
			let dy = globalY - centerY;

			if ((dx * dx + dy * dy) > radiusSq) continue;
			if (!canUseBlurSample(globalX, globalY, context, mask)) continue;

			let [r, g, b, a] = getPixelFromData(data, width, x, y);
			let alpha = a / 255;
			totalRawR += r;
			totalRawG += g;
			totalRawB += b;
			totalPremulR += r * alpha;
			totalPremulG += g * alpha;
			totalPremulB += b * alpha;
			totalAlpha += alpha;
			totalA += a;
			count++;
		}
	}

	if (!count) return null;

	if (totalAlpha > 0) {
		return {
			r: totalPremulR / totalAlpha,
			g: totalPremulG / totalAlpha,
			b: totalPremulB / totalAlpha,
			a: (totalA / count) / 255
		};
	}

	return {
		r: totalRawR / count,
		g: totalRawG / count,
		b: totalRawB / count,
		a: 0
	};
}

function startSmudgeStroke({x, y}) {
	Painter.current.smudge_brush = {
		lastCenter: [x, y],
		stampCenter: null,
		vector: [0, 0]
	};
}

function updateSmudgeVector(context) {
	let state = Painter.current.smudge_brush;
	if (!state) {
		state = Painter.current.smudge_brush = {
			lastCenter: [context.x, context.y],
			stampCenter: null,
			vector: [0, 0]
		};
	}

	if (state.stampCenter && state.stampCenter[0] === context.x && state.stampCenter[1] === context.y) {
		return state.vector;
	}

	let lastCenter = state.lastCenter || [context.x, context.y];
	let deltaX = context.x - lastCenter[0];
	let deltaY = context.y - lastCenter[1];
	let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

	if (length > 0.0001) {
		let distance = Math.min(length, getSmudgeDistance());
		state.vector = [
			deltaX / length * distance,
			deltaY / length * distance
		];
	}

	state.lastCenter = [context.x, context.y];
	state.stampCenter = [context.x, context.y];
	prepareSmudgeSource(context, state);
	return state.vector;
}

function smudgePixel(px, py, pxcolor, localOpacity, context) {
	let vector = updateSmudgeVector(context);
	let amount = blurClamp(localOpacity * (getSmudgeIntensity() / 100), 0, 1);

	if (amount <= 0 || (!vector[0] && !vector[1])) return pxcolor;

	let [localX, localY] = getLocalPixelPosition(px, py);
	let source = Painter.current.smudge_brush?.source
		? sampleSourcePixel(Painter.current.smudge_brush.source, localX - vector[0], localY - vector[1])
		: sampleCanvasPixel(context.ctx, localX - vector[0], localY - vector[1]);

	return {
		r: blurLerp(pxcolor.r, source.r, amount),
		g: blurLerp(pxcolor.g, source.g, amount),
		b: blurLerp(pxcolor.b, source.b, amount),
		a: Painter.lock_alpha ? pxcolor.a : blurLerp(pxcolor.a, source.a, amount)
	};
}

function blurPixel(px, py, pxcolor, localOpacity, context) {
	let radius = getBlurRadius();
	let intensity = getBlurIntensity() / 100;
	let amount = blurClamp(localOpacity * intensity, 0, 1);

	if (amount <= 0) return pxcolor;

	let average = averageNeighborPixels(context, px, py, radius);
	if (!average) return pxcolor;

	return {
		r: blurLerp(pxcolor.r, average.r, amount),
		g: blurLerp(pxcolor.g, average.g, amount),
		b: blurLerp(pxcolor.b, average.b, amount),
		a: Painter.lock_alpha ? pxcolor.a : blurLerp(pxcolor.a, average.a, amount)
	};
}

function addToToolbar(toolbar, item, afterId) {
	if (!toolbar || !item) return;

	let index = toolbar.children.findIndex(child => {
		if (typeof child === 'string') return child === afterId;
		return child && child.id === afterId;
	});

	toolbar.add(item, index === -1 ? undefined : index + 1);
}

function initializeBlurBrushToolSettings() {
	let settings = loadBlurSettings();
	blurBrushTool.tool_settings.blur_brush_radius = settings.radius;
	blurBrushTool.tool_settings.blur_brush_intensity = settings.intensity;
	smudgeBrushTool.tool_settings.smudge_brush_intensity = settings.smudge_intensity;
	smudgeBrushTool.tool_settings.smudge_brush_distance = settings.smudge_distance;
}

Plugin.register('blur_brush', {
	title: 'Blur & Smudge Brush',
	author: 'Lucas Messias',
	icon: 'blur_on',
	description: 'Adiciona pinceis de blur e smudge para suavizar e arrastar cores na textura.',
	tags: ['Texture'],
	version: '1.1.0',
	variant: 'both',
	min_version: '4.8.0',
	onload() {
		ensureBlurSettingsInitialized();

		blurBrushTool = new Tool('blur_brush', {
			name: 'Blur Brush',
			description: 'Suaviza cores misturando pixels vizinhos onde o pincel passa',
			icon: 'blur_on',
			category: 'tools',
			toolbar: 'brush',
			alt_tool: 'color_picker',
			cursor: 'crosshair',
			selectFace: true,
			transformerMode: 'hidden',
			paintTool: true,
			brush: {
				shapes: true,
				size: true,
				softness: true,
				offset_even_radius: true,
				floor_coordinates: () => BarItems.slider_brush_softness.get() == 0,
				get interval() {
					let size = Painter.current.dynamic_brush_size ?? BarItems.slider_brush_size.get();
					if (size > 40) {
						return size / 12;
					}
					return 1 + size * BarItems.slider_brush_softness.get() / 1500;
				},
				onStrokeEnd() {
					delete Painter.current.blur_brush_face_matrices;
				},
				changePixel(px, py, pxcolor, localOpacity, context) {
					return blurPixel(px, py, pxcolor, localOpacity, context);
				}
			},
			allowed_view_modes: ['textured', 'material'],
			modes: ['paint'],
			condition: {modes: ['paint']},
			onCanvasClick(data) {
				Painter.startPaintToolCanvas(data, data.event);
			},
			onSelect() {
				Painter.updateNslideValues();
				Interface.addSuggestedModifierKey('shift', 'modifier_actions.draw_line');
			},
			onUnselect() {
				Interface.removeSuggestedModifierKey('shift', 'modifier_actions.draw_line');
			}
		});

		smudgeBrushTool = new Tool('smudge_brush', {
			name: 'Smudge Brush',
			description: 'Arrasta e mistura cores seguindo a direcao do movimento do mouse',
			icon: 'gesture',
			category: 'tools',
			toolbar: 'brush',
			alt_tool: 'color_picker',
			cursor: 'crosshair',
			selectFace: true,
			transformerMode: 'hidden',
			paintTool: true,
			brush: {
				shapes: true,
				size: true,
				softness: true,
				offset_even_radius: true,
				floor_coordinates: () => BarItems.slider_brush_softness.get() == 0,
				get interval() {
					let size = Painter.current.dynamic_brush_size ?? BarItems.slider_brush_size.get();
					if (size > 40) {
						return size / 12;
					}
					return 1 + size * BarItems.slider_brush_softness.get() / 1500;
				},
				onStrokeStart: startSmudgeStroke,
				onStrokeEnd() {
					delete Painter.current.smudge_brush;
				},
				changePixel(px, py, pxcolor, localOpacity, context) {
					return smudgePixel(px, py, pxcolor, localOpacity, context);
				}
			},
			allowed_view_modes: ['textured', 'material'],
			modes: ['paint'],
			condition: {modes: ['paint']},
			onCanvasClick(data) {
				Painter.startPaintToolCanvas(data, data.event);
			},
			onSelect() {
				Painter.updateNslideValues();
				Interface.addSuggestedModifierKey('shift', 'modifier_actions.draw_line');
			},
			onUnselect() {
				Interface.removeSuggestedModifierKey('shift', 'modifier_actions.draw_line');
			}
		});

		blurRadiusSlider = new NumSlider('slider_blur_brush_radius', {
			name: 'Blur Radius',
			description: 'Raio do kernel do blur, de 1 a 5 pixels',
			category: 'paint',
			condition: {tools: ['blur_brush']},
			tool_setting: 'blur_brush_radius',
			settings: {
				min: 1,
				max: 5,
				default: DEFAULT_BLUR_SETTINGS.radius,
				interval: 1,
				show_bar: true
			},
			onChange: saveBlurSettings
		});

		blurIntensitySlider = new NumSlider('slider_blur_brush_intensity', {
			name: 'Blur Intensity',
			description: 'Quanto a cor media dos pixels vizinhos mistura no pixel pintado',
			category: 'paint',
			condition: {tools: ['blur_brush']},
			tool_setting: 'blur_brush_intensity',
			settings: {
				min: 0,
				max: 100,
				default: DEFAULT_BLUR_SETTINGS.intensity,
				interval: 5,
				show_bar: true
			},
			onChange: saveBlurSettings
		});

		smudgeIntensitySlider = new NumSlider('slider_smudge_brush_intensity', {
			name: 'Smudge Intensity',
			description: 'Quanto da cor arrastada mistura nos pixels pintados',
			category: 'paint',
			condition: {tools: ['smudge_brush']},
			tool_setting: 'smudge_brush_intensity',
			settings: {
				min: 0,
				max: 100,
				default: DEFAULT_BLUR_SETTINGS.smudge_intensity,
				interval: 5,
				show_bar: true
			},
			onChange: saveBlurSettings
		});

		smudgeDistanceSlider = new NumSlider('slider_smudge_brush_distance', {
			name: 'Smudge Distance',
			description: 'Distancia maxima em pixels usada para puxar cor na direcao do movimento',
			category: 'paint',
			condition: {tools: ['smudge_brush']},
			tool_setting: 'smudge_brush_distance',
			settings: {
				min: 1,
				max: 32,
				default: DEFAULT_BLUR_SETTINGS.smudge_distance,
				interval: 1,
				show_bar: true
			},
			onChange: saveBlurSettings
		});

		initializeBlurBrushToolSettings();

		addToToolbar(Toolbars.tools, blurBrushTool, 'brush_tool');
		addToToolbar(Toolbars.tools, smudgeBrushTool, 'blur_brush');
		addToToolbar(Toolbars.brush, blurIntensitySlider, 'slider_brush_softness');
		addToToolbar(Toolbars.brush, blurRadiusSlider, 'slider_brush_softness');
		addToToolbar(Toolbars.brush, smudgeIntensitySlider, 'slider_blur_brush_intensity');
		addToToolbar(Toolbars.brush, smudgeDistanceSlider, 'slider_smudge_brush_intensity');
	},
	onunload() {
		if (blurBrushTool) {
			blurBrushTool.delete();
			blurBrushTool = null;
		}
		if (smudgeBrushTool) {
			smudgeBrushTool.delete();
			smudgeBrushTool = null;
		}
		if (blurRadiusSlider) {
			blurRadiusSlider.delete();
			blurRadiusSlider = null;
		}
		if (blurIntensitySlider) {
			blurIntensitySlider.delete();
			blurIntensitySlider = null;
		}
		if (smudgeIntensitySlider) {
			smudgeIntensitySlider.delete();
			smudgeIntensitySlider = null;
		}
		if (smudgeDistanceSlider) {
			smudgeDistanceSlider.delete();
			smudgeDistanceSlider = null;
		}
	}
});
