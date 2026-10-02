const ADD_TINT_PALETTE_KEY = 'add_tint_palette';
const ADD_TINT_PREVIEW_KEY = 'add_tint_preview_enabled';
const ADD_TINT_DEFAULT_COLORS = [
  '#7fb238',
  '#f27d0c',
  '#c74ebd',
  '#3ab3da',
  '#fed83d',
  '#80c71f',
  '#f38baa',
  '#474f52',
];

const ADD_TINT_TRANSLATIONS = {
  en: {
    plugin_description: 'Batch-edit Minecraft tint indices, preview tint colors, and prepare textures.',
    select_faces: 'Select one or more cube faces first.',
    select_textured_faces: 'Select one or more textured cube faces first.',
    grayscale_edit: 'Grayscale tint texture',
    grayscale_undo: 'Grayscale tint textures',
    grayscale_complete: 'Converted the selected face area on {count} texture(s) to grayscale.',
    grayscale_title: 'Grayscale Tint Textures',
    grayscale_explanation: 'Only the UV areas used by the selected faces on the following textures will be converted to grayscale. Alpha and brightness are preserved, and the operation can be undone.',
    no_tint_indices: 'This model does not use any tint indices yet.',
    tint_index: 'Tint Index {index}',
    tint_color_description: 'Preview color for tintindex {index}.',
    preview_colors_note: 'Colors update the 3D preview in real time. They are editor settings and are not written to the Minecraft model JSON.',
    preview_colors_title: 'addTint Preview Colors',
    set_tint_index: 'Set Tint Index',
    tint_index_label: 'Tint Index',
    context_tint_index: 'addTint: Tint Index',
    index: 'Index {index}',
    specify_index: 'Specify Index…',
    remove_tint: 'Remove Tint',
    edit_preview_colors: 'Edit Preview Colors…',
    undo_set_tint: 'Set tint index {index}',
    tint_applied: 'Tint index {index} applied to {count} face(s).',
    undo_remove_tint: 'Remove tint index',
    tint_removed: 'Tint removed from {count} face(s).',
    operation: 'Operation',
    apply_update_tint: 'Apply / Update Tint',
    tint_index_description: 'The integer written to tintindex in the Minecraft model JSON.',
    preview_color: 'Preview Color',
    preview_color_description: 'Editor-only color used to preview this tint index.',
    enable_preview: 'Enable 3D Preview',
    preview_note: 'Preview colors are editor settings and are not added to the Minecraft model JSON.',
    action_set_tint: 'addTint: Set Tint Index',
    action_set_tint_description: 'Set a Minecraft tint index and preview color on selected cube faces.',
    action_grayscale: 'addTint: Grayscale Tint Textures',
    action_grayscale_description: 'Convert only the UV areas used by selected faces to tint-friendly grayscale.',
    action_edit_colors: 'addTint: Edit Preview Colors',
    action_edit_colors_description: 'Edit every tint color used in the current model with live preview.',
  },
  ja: {
    plugin_description: 'MinecraftのTint Index一括編集、Tint色プレビュー、テクスチャの準備を支援します。',
    select_faces: 'Cubeの面を1つ以上選択してください。',
    select_textured_faces: 'テクスチャが割り当てられたCubeの面を1つ以上選択してください。',
    grayscale_edit: 'Tintテクスチャをグレースケール化',
    grayscale_undo: 'Tintテクスチャをグレースケール化',
    grayscale_complete: '{count}個のテクスチャ上の選択面領域をグレースケール化しました。',
    grayscale_title: 'Tintテクスチャをグレースケール化',
    grayscale_explanation: '次のテクスチャ上で、選択面が使用するUV領域だけをグレースケール化します。透明度と明るさは維持され、Undoで元に戻せます。',
    no_tint_indices: 'このモデルにはTint Indexがまだ設定されていません。',
    tint_index: 'Tint Index {index}',
    tint_color_description: 'tintindex {index}のプレビュー色です。',
    preview_colors_note: '色の変更は3Dプレビューへリアルタイムに反映されます。これはエディター設定であり、MinecraftモデルJSONには書き込まれません。',
    preview_colors_title: 'addTint プレビュー色',
    set_tint_index: 'Tint Indexを設定',
    tint_index_label: 'Tint Index',
    context_tint_index: 'addTint: Tint Index',
    index: 'Index {index}',
    specify_index: 'Indexを指定…',
    remove_tint: 'Tintを削除',
    edit_preview_colors: 'プレビュー色を編集…',
    undo_set_tint: 'Tint Index {index}を設定',
    tint_applied: 'Tint Index {index}を{count}面に設定しました。',
    undo_remove_tint: 'Tint Indexを削除',
    tint_removed: '{count}面からTintを削除しました。',
    operation: '操作',
    apply_update_tint: 'Tintを設定・更新',
    tint_index_description: 'MinecraftモデルJSONのtintindexへ書き込む整数です。',
    preview_color: 'プレビュー色',
    preview_color_description: 'このTint Indexを確認するためのエディター専用色です。',
    enable_preview: '3Dプレビューを有効化',
    preview_note: 'プレビュー色はエディター設定であり、MinecraftモデルJSONには追加されません。',
    action_set_tint: 'addTint: Tint Indexを設定',
    action_set_tint_description: '選択したCubeの面へMinecraft Tint Indexとプレビュー色を設定します。',
    action_grayscale: 'addTint: Tintテクスチャをグレースケール化',
    action_grayscale_description: '選択面が使用するUV領域だけをTint向けのグレースケールへ変換します。',
    action_edit_colors: 'addTint: プレビュー色を編集',
    action_edit_colors_description: '現在のモデルで使用中の全Tint色をリアルタイムプレビューで編集します。',
  },
};

/**
 * @param {keyof typeof ADD_TINT_TRANSLATIONS.en} key
 * @param {Record<string, string | number>} [variables]
 */
function addTintText(key, variables = {}) {
  const language = typeof Language !== 'undefined' && Language.code === 'ja'
    ? 'ja'
    : 'en';
  let text = ADD_TINT_TRANSLATIONS[language][key] || ADD_TINT_TRANSLATIONS.en[key] || key;
  Object.entries(variables).forEach(([name, value]) => {
    text = text.split(`{${name}}`).join(String(value));
  });
  return text;
}

/** @type {Action | undefined} */
let addTintAction;

/** @type {Action | undefined} */
let grayscaleTintAction;

/** @type {Action | undefined} */
let editTintColorsAction;

let addTintUvContextMenuRegistered = false;

/** @type {Deletable[]} */
let addTintListeners = [];

/** @type {Map<string, THREE.Material>} */
const addTintMaterialCache = new Map();

function isJavaModel() {
  return Boolean(Format && Format.id === 'java_block');
}

/**
 * @returns {Record<string, string>}
 */
function getTintPalette() {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(ADD_TINT_PALETTE_KEY) || '{}');
  } catch (_error) {
    return {};
  }
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  return /** @type {Record<string, string>} */ (stored);
}

/**
 * @param {number} tintIndex
 * @returns {string}
 */
function getTintColor(tintIndex) {
  const storedColor = getTintPalette()[String(tintIndex)];
  if (/^#[0-9a-f]{6}$/i.test(storedColor || '')) {
    return storedColor;
  }
  return ADD_TINT_DEFAULT_COLORS[tintIndex % ADD_TINT_DEFAULT_COLORS.length];
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeColor(value) {
  const color = String(value || '').trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(color)) return `#${color.toLowerCase()}`;
  return ADD_TINT_DEFAULT_COLORS[0];
}

/**
 * @param {number} tintIndex
 * @param {string} color
 */
function saveTintColor(tintIndex, color) {
  const palette = {...getTintPalette(), [String(tintIndex)]: normalizeColor(color)};
  saveTintPalette(palette);
}

/**
 * @param {Record<string, string>} palette
 */
function saveTintPalette(palette) {
  localStorage.setItem(ADD_TINT_PALETTE_KEY, JSON.stringify(palette));
}

function isPreviewEnabled() {
  return localStorage.getItem(ADD_TINT_PREVIEW_KEY) !== 'false';
}

/**
 * @param {boolean} enabled
 */
function savePreviewEnabled(enabled) {
  localStorage.setItem(ADD_TINT_PREVIEW_KEY, String(enabled));
}

function disposeTintMaterials() {
  addTintMaterialCache.forEach((material) => material.dispose());
  addTintMaterialCache.clear();
}

/**
 * @param {THREE.Material} baseMaterial
 * @param {number} tintIndex
 * @returns {THREE.Material}
 */
function getTintedMaterial(baseMaterial, tintIndex) {
  const tintColor = getTintColor(tintIndex);
  const cacheKey = `${baseMaterial.uuid}:${tintIndex}:${tintColor}`;
  const cached = addTintMaterialCache.get(cacheKey);
  if (cached) return cached;

  const shaderMaterial = baseMaterial instanceof THREE.ShaderMaterial
    ? baseMaterial
    : undefined;
  const textureMap = shaderMaterial?.uniforms.map?.value;
  if (!(textureMap instanceof THREE.Texture)) return baseMaterial;

  // MeshBasicMaterial performs `map.rgb * color` natively. This is more stable
  // across Blockbench versions than patching Blockbench's shader source text.
  const material = new THREE.MeshBasicMaterial({
    map: textureMap,
    color: new THREE.Color(tintColor),
    side: baseMaterial.side,
    transparent: true,
    alphaTest: 0.01,
    blending: baseMaterial.blending,
    depthTest: baseMaterial.depthTest,
    depthWrite: baseMaterial.depthWrite,
    polygonOffset: baseMaterial.polygonOffset,
    polygonOffsetFactor: baseMaterial.polygonOffsetFactor,
    polygonOffsetUnits: baseMaterial.polygonOffsetUnits,
    toneMapped: false,
  });
  material.clippingPlanes = baseMaterial.clippingPlanes;
  material.clipIntersection = baseMaterial.clipIntersection;
  material.clipShadows = baseMaterial.clipShadows;
  material.name = `${baseMaterial.name || 'texture'} (Tint ${tintIndex})`;

  addTintMaterialCache.set(cacheKey, material);
  return material;
}

/**
 * Applies preview-only materials. It does not alter textures or exported JSON.
 * @param {Cube} cube
 */
function applyTintPreview(cube) {
  const supportsTintPreview = Project.view_mode === 'textured'
    || Project.view_mode === 'material';
  if (!isJavaModel() || !isPreviewEnabled() || !supportsTintPreview) return;
  if (!cube.mesh?.geometry) return;

  /** @type {THREE.Material[]} */
  const materials = [];
  let visibleFaceIndex = 0;

  cube.mesh.geometry.clearGroups();
  Canvas.face_order.forEach((faceKey) => {
    const face = cube.faces[faceKey];
    if (!face || face.texture === null) return;

    const texture = face.getTexture();
    const baseMaterial = texture
      ? texture.getMaterial()
      : Canvas.emptyMaterials[String(cube.color)];
    const material = face.tint >= 0
      ? getTintedMaterial(baseMaterial, face.tint)
      : baseMaterial;

    materials.push(material);
    cube.mesh.geometry.addGroup(visibleFaceIndex * 6, 6, visibleFaceIndex);
    visibleFaceIndex += 1;
  });

  if (materials.length) cube.mesh.material = materials;
}

function refreshTintPreview() {
  disposeTintMaterials();
  if (!Project || !Cube.all) return;
  Cube.all.forEach((cube) => {
    // updateFaces restores Blockbench's base materials. Reapply tint immediately;
    // calling the controller directly does not emit Blockbench's update_view event.
    cube.preview_controller.updateFaces(cube);
    applyTintPreview(cube);
  });
}

/**
 * @returns {{cubes: Cube[], faces: Array<{cube: Cube, faceKey: string}>}}
 */
function getSelectedCubeFaces() {
  const cubes = Cube.selected.filter((cube) => cube.faces);
  /** @type {Array<{cube: Cube, faceKey: string}>} */
  const faces = [];

  cubes.forEach((cube) => {
    const selectedFaces = /** @type {string[]} */ (UVEditor.getSelectedFaces(cube, false));
    selectedFaces.forEach((faceKey) => {
      if (cube.faces[faceKey]) faces.push({cube, faceKey});
    });
  });

  return {cubes, faces};
}

/**
 * Groups the selected face UV rectangles by texture.
 * @returns {Array<{texture: Texture, uvRects: Array<{x: number, y: number, width: number, height: number}>}>}
 */
function getSelectedFaceTextureRegions() {
  /** @type {Map<Texture, Array<{x: number, y: number, width: number, height: number}>>} */
  const textureRegions = new Map();
  getSelectedCubeFaces().faces.forEach(({cube, faceKey}) => {
    const face = cube.faces[faceKey];
    const texture = face.getTexture();
    if (!texture) return;

    const bounds = face.getBoundingRect();
    const uvRect = {
      x: Math.min(bounds.ax, bounds.bx),
      y: Math.min(bounds.ay, bounds.by),
      width: Math.abs(bounds.bx - bounds.ax),
      height: Math.abs(bounds.by - bounds.ay),
    };
    if (uvRect.width <= 0 || uvRect.height <= 0) return;

    const regions = textureRegions.get(texture) || [];
    regions.push(uvRect);
    textureRegions.set(texture, regions);
  });
  return [...textureRegions].map(([texture, uvRects]) => ({texture, uvRects}));
}

/**
 * Converts UV-space rectangles to pixel rectangles for every animation frame.
 * @param {Texture} texture
 * @param {Array<{x: number, y: number, width: number, height: number}>} uvRects
 * @returns {Array<{x: number, y: number, width: number, height: number}>}
 */
function getTexturePixelRegions(texture, uvRects) {
  const uvWidth = texture.getUVWidth();
  const uvHeight = texture.getUVHeight();
  const frameCount = texture.frameCount || 1;
  const frameHeight = texture.height / frameCount;
  if (uvWidth <= 0 || uvHeight <= 0 || texture.width <= 0 || frameHeight <= 0) return [];

  const scaleX = texture.width / uvWidth;
  const scaleY = frameHeight / uvHeight;
  /** @type {Array<{x: number, y: number, width: number, height: number}>} */
  const regions = [];

  uvRects.forEach((uvRect) => {
    const left = Math.max(0, Math.floor(uvRect.x * scaleX));
    const right = Math.min(texture.width, Math.ceil((uvRect.x + uvRect.width) * scaleX));
    const topInFrame = Math.max(0, Math.floor(uvRect.y * scaleY));
    const bottomInFrame = Math.min(frameHeight, Math.ceil((uvRect.y + uvRect.height) * scaleY));
    if (right <= left || bottomInFrame <= topInFrame) return;

    for (let frame = 0; frame < frameCount; frame += 1) {
      const frameOffset = frame * frameHeight;
      regions.push({
        x: left,
        y: Math.floor(frameOffset + topInFrame),
        width: right - left,
        height: Math.ceil(frameOffset + bottomInFrame) - Math.floor(frameOffset + topInFrame),
      });
    }
  });

  return regions;
}

/**
 * Converts RGB pixels inside global texture rectangles to luminance while
 * preserving alpha. Canvas offsets account for cropped/positioned layers.
 * @param {CanvasRenderingContext2D} context
 * @param {Array<{x: number, y: number, width: number, height: number}>} regions
 * @param {[number, number]} offset
 */
function grayscaleCanvasRegions(context, regions, offset = [0, 0]) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  if (width < 1 || height < 1) return;
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  regions.forEach((region) => {
    const left = Math.max(0, region.x - offset[0]);
    const top = Math.max(0, region.y - offset[1]);
    const right = Math.min(width, region.x + region.width - offset[0]);
    const bottom = Math.min(height, region.y + region.height - offset[1]);

    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        const pixelOffset = (y * width + x) * 4;
        const luminance = Math.round(
          pixels[pixelOffset] * 0.299
          + pixels[pixelOffset + 1] * 0.587
          + pixels[pixelOffset + 2] * 0.114,
        );
        pixels[pixelOffset] = luminance;
        pixels[pixelOffset + 1] = luminance;
        pixels[pixelOffset + 2] = luminance;
      }
    }
  });

  context.putImageData(imageData, 0, 0);
}

/**
 * @param {Array<{texture: Texture, uvRects: Array<{x: number, y: number, width: number, height: number}>}>} textureRegions
 */
function grayscaleTextureRegions(textureRegions) {
  if (!textureRegions.length) return;

  const textures = textureRegions.map(({texture}) => texture);

  Undo.initEdit({textures, bitmap: true});
  textureRegions.forEach(({texture, uvRects}) => {
    if (!texture.internal) texture.convertToInternal();
    const pixelRegions = getTexturePixelRegions(texture, uvRects);

    if (texture.layers_enabled && texture.layers.length) {
      texture.layers.forEach((layer) => {
        grayscaleCanvasRegions(layer.ctx, pixelRegions, layer.offset);
      });
      texture.updateLayerChanges(true);
    } else {
      grayscaleCanvasRegions(texture.ctx, pixelRegions);
    }

    texture.updateChangesAfterEdit();
    // @ts-expect-error Blockbench emits this internal event after bitmap edits.
    Blockbench.dispatchEvent('edit_texture', {
      texture,
      options: {edit_name: addTintText('grayscale_edit')},
      canvas: texture.canvas,
      ctx: texture.ctx,
      offset: [0, 0],
    });
  });
  Undo.finishEdit(addTintText('grayscale_undo'));
  refreshTintPreview();
  Blockbench.showQuickMessage(
    addTintText('grayscale_complete', {count: textures.length}),
    2500,
  );
}

function openGrayscaleTintDialog() {
  const textureRegions = getSelectedFaceTextureRegions();
  if (!textureRegions.length) {
    Blockbench.showQuickMessage(addTintText('select_textured_faces'), 2500);
    return;
  }

  const textureNames = textureRegions.map(({texture}) => `- ${texture.name}`).join('\n');
  new Dialog({
    id: 'add_tint_grayscale_dialog',
    title: addTintText('grayscale_title'),
    icon: 'filter_b_and_w',
    form: {
      explanation: {
        type: 'info',
        text: addTintText('grayscale_explanation'),
      },
      textures: {
        type: 'info',
        text: textureNames,
      },
    },
    onConfirm() {
      grayscaleTextureRegions(textureRegions);
    },
  }).show();
}

/**
 * @returns {number[]}
 */
function getUsedTintIndices() {
  const indices = new Set();
  Cube.all.forEach((cube) => {
    Canvas.face_order.forEach((faceKey) => {
      const tintIndex = cube.faces[faceKey]?.tint;
      if (typeof tintIndex === 'number' && tintIndex >= 0) {
        indices.add(Math.round(tintIndex));
      }
    });
  });
  return /** @type {number[]} */ ([...indices]).sort((a, b) => a - b);
}

function openTintColorEditor() {
  const tintIndices = getUsedTintIndices();
  if (!tintIndices.length) {
    Blockbench.showQuickMessage(addTintText('no_tint_indices'), 2600);
    return;
  }

  const originalPalette = {...getTintPalette()};
  const originalPreviewEnabled = isPreviewEnabled();
  /** @type {Record<string, any>} */
  const form = {};

  tintIndices.forEach((tintIndex) => {
    form[`tint_color_${tintIndex}`] = {
      label: addTintText('tint_index', {index: tintIndex}),
      description: addTintText('tint_color_description', {index: tintIndex}),
      type: 'color',
      value: getTintColor(tintIndex),
    };
  });
  form.preview_note = {
    type: 'info',
    text: addTintText('preview_colors_note'),
  };

  /**
   * @param {Record<string, unknown>} result
   */
  function updateColors(result) {
    const palette = {...getTintPalette()};
    tintIndices.forEach((tintIndex) => {
      const fieldValue = result[`tint_color_${tintIndex}`];
      if (fieldValue !== undefined) {
        palette[String(tintIndex)] = normalizeColor(fieldValue);
      }
    });
    saveTintPalette(palette);
    refreshTintPreview();
  }

  savePreviewEnabled(true);
  refreshTintPreview();

  new Dialog({
    id: 'add_tint_color_editor',
    title: addTintText('preview_colors_title'),
    icon: 'palette',
    width: 380,
    darken: false,
    cancel_on_click_outside: false,
    form,
    onFormChange(result) {
      updateColors(result);
    },
    onConfirm(result) {
      updateColors(result);
    },
    onCancel() {
      saveTintPalette(originalPalette);
      savePreviewEnabled(originalPreviewEnabled);
      refreshTintPreview();
    },
  }).show();
}

function openQuickTintIndexDialog() {
  const selection = getSelectedCubeFaces();
  if (!selection.faces.length) {
    Blockbench.showQuickMessage(addTintText('select_faces'), 2500);
    return;
  }

  const referenceFace = selection.faces[0].cube.faces[selection.faces[0].faceKey];
  const initialIndex = referenceFace.tint >= 0 ? referenceFace.tint : 0;
  new Dialog({
    id: 'add_tint_quick_index_dialog',
    title: addTintText('set_tint_index'),
    icon: 'format_color_fill',
    width: 320,
    form: {
      tint_index: {
        label: addTintText('tint_index_label'),
        type: 'number',
        value: initialIndex,
        min: 0,
        step: 1,
        force_step: true,
      },
    },
    onConfirm(result) {
      const tintIndex = Math.max(0, Math.round(Number(result.tint_index)));
      applyTintToSelection(tintIndex, getTintColor(tintIndex));
    },
  }).show();
}

function registerUvContextMenu() {
  UVEditor.menu.addAction({
    id: 'add_tint_uv_context',
    name: addTintText('context_tint_index'),
    icon: 'format_color_fill',
    condition: () => isJavaModel()
      && Cube.selected.length > 0
      && Boolean(UVEditor.getReferenceFace()),
    children() {
      const referenceTint = Number(UVEditor.getReferenceFace()?.tint ?? -1);
      const usedIndices = getUsedTintIndices();
      if (!usedIndices.includes(0)) usedIndices.unshift(0);

      /** @type {MenuItem[]} */
      const items = usedIndices.map((tintIndex) => ({
        id: `add_tint_index_${tintIndex}`,
        name: addTintText('index', {index: tintIndex}),
        icon: referenceTint === tintIndex
          ? 'radio_button_checked'
          : 'radio_button_unchecked',
        click() {
          applyTintToSelection(tintIndex, getTintColor(tintIndex));
        },
      }));

      items.push(
        new MenuSeparator('add_tint_index_actions'),
        {
          id: 'add_tint_specify_index',
          name: addTintText('specify_index'),
          icon: 'edit',
          click: openQuickTintIndexDialog,
        },
        {
          id: 'add_tint_remove_index',
          name: addTintText('remove_tint'),
          icon: 'remove_circle_outline',
          condition: () => referenceTint >= 0,
          click: removeTintFromSelection,
        },
        new MenuSeparator('add_tint_color_actions'),
        {
          id: 'add_tint_context_edit_colors',
          name: addTintText('edit_preview_colors'),
          icon: 'palette',
          click: openTintColorEditor,
        },
      );
      return items;
    },
  }, '#face_options');
  addTintUvContextMenuRegistered = true;
}

/**
 * @param {number} tintIndex
 * @param {string} color
 */
function applyTintToSelection(tintIndex, color) {
  const selection = getSelectedCubeFaces();
  if (!selection.faces.length) {
    Blockbench.showQuickMessage(addTintText('select_faces'), 2500);
    return;
  }

  const index = Math.max(0, Math.round(tintIndex));
  saveTintColor(index, color);
  Undo.initEdit({elements: selection.cubes, uv_only: true});
  selection.faces.forEach(({cube, faceKey}) => {
    cube.faces[faceKey].tint = index;
  });
  Undo.finishEdit(addTintText('undo_set_tint', {index}));
  refreshTintPreview();
  Blockbench.showQuickMessage(
    addTintText('tint_applied', {index, count: selection.faces.length}),
    2200,
  );
}

function removeTintFromSelection() {
  const selection = getSelectedCubeFaces();
  if (!selection.faces.length) {
    Blockbench.showQuickMessage(addTintText('select_faces'), 2500);
    return;
  }

  Undo.initEdit({elements: selection.cubes, uv_only: true});
  selection.faces.forEach(({cube, faceKey}) => {
    cube.faces[faceKey].tint = -1;
  });
  Undo.finishEdit(addTintText('undo_remove_tint'));
  refreshTintPreview();
  Blockbench.showQuickMessage(
    addTintText('tint_removed', {count: selection.faces.length}),
    2200,
  );
}

function openAddTintDialog() {
  const selection = getSelectedCubeFaces();
  if (!selection.faces.length) {
    Blockbench.showQuickMessage(addTintText('select_faces'), 2500);
    return;
  }

  const firstFace = selection.faces[0].cube.faces[selection.faces[0].faceKey];
  const initialIndex = firstFace.tint >= 0 ? firstFace.tint : 0;

  new Dialog({
    id: 'add_tint_dialog',
    title: 'addTint',
    icon: 'format_color_fill',
    form: {
      mode: {
        label: addTintText('operation'),
        type: 'select',
        value: 'apply',
        options: {
          apply: addTintText('apply_update_tint'),
          remove: addTintText('remove_tint'),
        },
      },
      tint_index: {
        label: addTintText('tint_index_label'),
        description: addTintText('tint_index_description'),
        type: 'number',
        value: initialIndex,
        min: 0,
        step: 1,
        force_step: true,
      },
      preview_color: {
        label: addTintText('preview_color'),
        description: addTintText('preview_color_description'),
        type: 'color',
        value: getTintColor(initialIndex),
      },
      preview_enabled: {
        label: addTintText('enable_preview'),
        type: 'checkbox',
        value: isPreviewEnabled(),
      },
      note: {
        type: 'info',
        text: addTintText('preview_note'),
      },
    },
    onConfirm(result) {
      savePreviewEnabled(Boolean(result.preview_enabled));
      if (result.mode === 'remove') {
        removeTintFromSelection();
      } else {
        applyTintToSelection(Number(result.tint_index), String(result.preview_color));
      }
      refreshTintPreview();
    },
  }).show();
}

function registerAddTintListeners() {
  addTintListeners.push(
    Blockbench.addListener('update_view', () => {
      if (isJavaModel() && isPreviewEnabled()) Cube.all.forEach(applyTintPreview);
    }),
    Blockbench.addListener('finished_edit', refreshTintPreview),
    Blockbench.addListener('undo', refreshTintPreview),
    Blockbench.addListener('redo', refreshTintPreview),
    Blockbench.addListener('select_project', refreshTintPreview),
    Blockbench.addListener('update_settings', refreshTintPreview),
  );
}

// @ts-expect-error The DOM `Plugin` type shadows Blockbench's global Plugin API.
Plugin.register('add_tint', {
  title: 'addTint',
  author: 'YOHEMAL',
  description: addTintText('plugin_description'),
  icon: 'format_color_fill',
  version: '0.4.3',
  min_version: '5.0.0',
  variant: 'both',
  tags: ['Minecraft: Java Edition', 'Utility'],

  onload() {
    addTintAction = new Action('add_tint_open', {
      name: addTintText('action_set_tint'),
      description: addTintText('action_set_tint_description'),
      icon: 'format_color_fill',
      category: 'filter',
      condition: () => isJavaModel() && Cube.selected.length > 0,
      click: openAddTintDialog,
    });
    MenuBar.addAction(addTintAction, 'filter');

    grayscaleTintAction = new Action('add_tint_grayscale_textures', {
      name: addTintText('action_grayscale'),
      description: addTintText('action_grayscale_description'),
      icon: 'filter_b_and_w',
      category: 'filter',
      condition: () => isJavaModel() && Cube.selected.length > 0,
      click: openGrayscaleTintDialog,
    });
    MenuBar.addAction(grayscaleTintAction, 'filter');

    editTintColorsAction = new Action('add_tint_edit_preview_colors', {
      name: addTintText('action_edit_colors'),
      description: addTintText('action_edit_colors_description'),
      icon: 'palette',
      category: 'filter',
      condition: () => isJavaModel() && Cube.all.length > 0,
      click: openTintColorEditor,
    });
    MenuBar.addAction(editTintColorsAction, 'filter');

    registerUvContextMenu();

    registerAddTintListeners();
    refreshTintPreview();
  },

  onunload() {
    addTintListeners.forEach((listener) => listener.delete());
    addTintListeners = [];
    addTintAction?.delete();
    addTintAction = undefined;
    grayscaleTintAction?.delete();
    grayscaleTintAction = undefined;
    editTintColorsAction?.delete();
    editTintColorsAction = undefined;
    if (addTintUvContextMenuRegistered) {
      UVEditor.menu.removeAction('add_tint_uv_context');
      addTintUvContextMenuRegistered = false;
    }
    disposeTintMaterials();

    if (Project && Cube.all) {
      Cube.all.forEach((cube) => cube.preview_controller.updateFaces(cube));
    }
  },
});
