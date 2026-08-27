/** Render Studio 2.1.0 - Made by shady - Blockbench 5.1+ - MIT License */
(function() {
'use strict';
const RenderStudio = {};
RenderStudio.VERSION = '2.1.0';
RenderStudio.resources = [];
RenderStudio.listeners = [];
RenderStudio.projects = new Map();
RenderStudio.fingerprints = new Map();
RenderStudio.uid = () => 'rs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
RenderStudio.clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));
RenderStudio.cloneData = value => JSON.parse(JSON.stringify(value));
RenderStudio.isMobile = () => {
  try {
    if (typeof Blockbench !== 'undefined' && typeof Blockbench.isMobile === 'boolean') return Blockbench.isMobile;
    return !!((window.matchMedia&&window.matchMedia('(pointer: coarse)').matches)||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent||''));
  } catch (e) { return false; }
};
RenderStudio.defaults = () => ({
  version: 4,
  performance: RenderStudio.isMobile() ? 'phone' : 'pc',
  lights: [],
  selectedLight: null,
  helpers: true,
  helperSize: 1,
  ambient: {enabled: true, color: '#ffffff', intensity: 0.2},
  hemisphere: {enabled: true, sky: '#d9e8ff', ground: '#554b43', intensity: 0.12},
  ground: {enabled: true, auto: true, height: 0, size: 4, color: '#777777', roughness: 0.9, receiveShadow: true, visible: true, shadowCatcher: false},
  material: {mode: 'minecraft', roughness: 0.8, metalness: 0, emissive: '#000000', emissiveIntensity: 0, opacity: 1, alphaTest: 0.01, doubleSided: false, castShadow: true, receiveShadow: true},
  camera: {projection: 'perspective', position: [32, 24, 32], target: [0, 8, 0], fov: 45, near: 0.01, far: 10000, orthoScale: 32},
  environment: {background: 'transparent', color: '#20242b', top: '#3d4655', bottom: '#111318', exposure: 1, toneMapping: 'aces', imageSource: '', imageData: '', imageName: '', imageBlur: 0, imageBrightness: 1},
  output: {width: RenderStudio.isMobile() ? 1024 : 2048, height: RenderStudio.isMobile() ? 1024 : 2048, antialias: 'normal', tileSize: RenderStudio.isMobile() ? 256 : 2048, pass: 'beauty'},
  post: {contrast: 0, saturation: 0, vignette: 0, bloom: false, bloomStrength: 0.6, dof: 0, outline: false, outlineColor: '#111111', outlineSize: 0.035},
  tools: {turntableFrames: RenderStudio.isMobile() ? 12 : 24, cameraPreset: 'square', dragLights: false, autoProfile: true, language: 'en', advancedUI: false, compareMode: 'slider', compareA: '', compareB: '', search: '', renderQueue: [], queuePreset: '', queueCamera: 'square', watermarkEnabled: false, watermarkText: '', watermarkImage: '', watermarkName: '', watermarkPosition: 'bottom-right', watermarkOpacity: 0.75, watermarkScale: 18},
  render: {busy: false, progress: 0, status: '', cancel: false},
  capabilities: null
});
RenderStudio.hydrateState = saved => {
  const state = RenderStudio.defaults(), source = saved && typeof saved === 'object' ? RenderStudio.cloneData(saved) : {};
  for (const key of ['ambient','hemisphere','ground','material','camera','environment','output','post','tools']) if (source[key] && typeof source[key] === 'object') Object.assign(state[key], source[key]);
  if (Array.isArray(source.lights)) state.lights = source.lights.map(light => Object.assign(RenderStudio.lightDefaults(light.type || 'point'), light));
  if (typeof source.selectedLight === 'string' || source.selectedLight == null) state.selectedLight = source.selectedLight;
  if (source.performance === 'phone' || source.performance === 'pc') state.performance = source.performance;
  if (RenderStudio.isMobile() && state.tools.autoProfile !== false) state.performance = 'phone';
  if (typeof source.helpers === 'boolean') state.helpers = source.helpers;
  if (Number.isFinite(Number(source.helperSize))) state.helperSize = RenderStudio.clamp(source.helperSize, 0.1, 10);
  if ((Number(source.version) || 1) < 2) {
    if (state.ambient.intensity >= 0.45) state.ambient.intensity = 0.2;
    if (state.hemisphere.intensity >= 0.3) state.hemisphere.intensity = 0.12;
  }
  state.version = 4;
  return state;
};
RenderStudio.lightDefaults = type => {
  const base = {id: RenderStudio.uid(), type, name: type[0].toUpperCase() + type.slice(1) + ' Light', enabled: true, color: '#ffffff', intensity: type === 'area' ? 4 : 1.8, position: [20, 24, 20], rotation: [-35, 45, 0], distance: 0, decay: 2, castShadow: type !== 'area', shadowSize: 1024, bias: -0.0002, normalBias: 0.02};
  if (type === 'spot') Object.assign(base, {angle: 35, penumbra: 0.35});
  if (type === 'directional') Object.assign(base, {intensity: 2, shadowCameraSize: 40});
  if (type === 'area') Object.assign(base, {width: 12, height: 12, castShadow: false});
  return base;
};
RenderStudio.getState = () => {
  if (!Project) return RenderStudio.session || (RenderStudio.session = RenderStudio.defaults());
  let state = RenderStudio.projects.get(Project.uuid);
  if (!state) {
    state = RenderStudio.hydrateState(Project.render_studio_state || Project.render_studio_snapshot);
    RenderStudio.projects.set(Project.uuid, state);
    Project.render_studio_state = state;
    RenderStudio.fingerprints.set(Project.uuid, JSON.stringify(RenderStudio.serializeState(state)));
  }
  return state;
};
RenderStudio.serializeState = state => {
  const copy = RenderStudio.cloneData(state || RenderStudio.defaults());
  delete copy.render;
  delete copy.capabilities;
  if (copy.tools) { delete copy.tools.search; delete copy.tools.compareA; delete copy.tools.compareB; }
  return copy;
};
RenderStudio.touch = () => {
  if (!Project) return;
  const state = RenderStudio.getState();
  Project.render_studio_state = state;
  Project.render_studio_snapshot = RenderStudio.serializeState(state);
  const next = JSON.stringify(RenderStudio.serializeState(state));
  if (RenderStudio.fingerprints.get(Project.uuid) !== next) {
    RenderStudio.fingerprints.set(Project.uuid, next);
    Project.saved = false;
  }
};
RenderStudio.captureModeState = () => {
  if (!Project) return;
  const state = RenderStudio.getState();
  Project.render_studio_snapshot = RenderStudio.serializeState(state);
  Project.render_studio_state = state;
};
RenderStudio.restoreModeState = () => {
  if (!Project) return RenderStudio.getState();
  const current = RenderStudio.projects.get(Project.uuid);
  if (current) {
    current.capabilities = RenderStudio.engine ? RenderStudio.engine.capabilities : current.capabilities;
    Project.render_studio_state = current;
    return current;
  }
  const snapshot = Project.render_studio_snapshot;
  if (!snapshot) return RenderStudio.getState();
  const restored = RenderStudio.hydrateState(snapshot);
  restored.capabilities = RenderStudio.engine ? RenderStudio.engine.capabilities : null;
  RenderStudio.projects.set(Project.uuid, restored);
  Project.render_studio_state = restored;
  return restored;
};
RenderStudio.safeName = value => String(value || 'model').replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'model';
RenderStudio.estimateMemory = (width, height, scale = 1) => {
  const pixels = width * height * scale * scale;
  return {cpuMB: width * height * 4 / 1048576, gpuMB: pixels * 12 / 1048576};
};
RenderStudio.constrainOutput = (width, height, profile = 'pc') => {
  width = RenderStudio.clamp(width, 16, 32768); height = RenderStudio.clamp(height, 16, 32768);
  const max = profile === 'phone' ? 1024 : 32768, scale = Math.min(1, max / Math.max(width, height));
  return {width: Math.max(16, Math.round(width * scale)), height: Math.max(16, Math.round(height * scale))};
};
RenderStudio.applyPerformanceProfile = profile => {
  const s = RenderStudio.getState(), e = RenderStudio.engine;
  s.performance = profile === 'phone' ? 'phone' : 'pc';
  if (s.performance === 'phone') {
    const size = RenderStudio.constrainOutput(s.output.width, s.output.height, 'phone');
    const scale = Math.min(1, 1024 / Math.max(size.width, size.height));
    s.output.width = Math.max(16, Math.round(size.width * scale)); s.output.height = Math.max(16, Math.round(size.height * scale)); s.output.tileSize = Math.min(256, s.output.tileSize); s.helpers = false;
  } else s.helpers = true;
  if (e) { e.configurePerformance(); e.rebuildLights(); e.resize(); e.invalidate(); }
  RenderStudio.touch(); RenderStudio.refreshUI();
};
RenderStudio.applyPreset = name => {
  const s = RenderStudio.getState();
  const e = RenderStudio.engine;
  s.lights.splice(0);
  const add = (type, label, position, intensity, color = '#ffffff') => {
    const l = RenderStudio.lightDefaults(type); Object.assign(l, {name: label, position, intensity, color}); s.lights.push(l); return l;
  };
  const b = e ? e.getBounds() : {center: new THREE.Vector3(0, 8, 0), size: new THREE.Vector3(16, 16, 16), largest: 16};
  const c = b.center, d = Math.max(4, b.largest);
  if (name === 'horror') {
    add('spot', 'Cold Side', [c.x-d, c.y+d*.7, c.z+d*.3], 5, '#9bbcff');
    add('point', 'Low Red Fill', [c.x+d*.5, c.y-d*.2, c.z+d*.4], 0.8, '#ff3b30'); s.ambient.intensity = 0.04; s.hemisphere.intensity = 0.04;
  } else if (name === 'rim') {
    add('area', 'Key', [c.x-d, c.y+d, c.z+d], 4.5);
    add('spot', 'Rim', [c.x+d*.5, c.y+d, c.z-d], 6, '#b9d7ff'); s.ambient.intensity = 0.1; s.hemisphere.intensity = 0.08;
  } else {
    add('area', 'Key Light', [c.x-d, c.y+d, c.z+d], name === 'minecraft' ? 5 : 4.2, '#fff4e5');
    add('area', 'Fill Light', [c.x+d, c.y+d*.35, c.z+d], 2.2, '#dbeaff');
    add('spot', 'Rim Light', [c.x+d*.4, c.y+d, c.z-d], name === 'minecraft' ? 5 : 3.5, '#b8d4ff'); s.ambient.intensity = name === 'dramatic' ? 0.08 : 0.18; s.hemisphere.intensity = name === 'dramatic' ? 0.05 : 0.1;
  }
  s.selectedLight = s.lights[0] && s.lights[0].id;
  if (e) { e.rebuildLights(); e.pointAllAt(c); e.invalidate(); }
  RenderStudio.touch();
  RenderStudio.refreshUI();
};

RenderStudio.Materials = class {
  constructor() { this.owned = new Set(); this.textures = new Set(); this.textureCache = new WeakMap(); this.texturePairs = []; }
  convert(source, settings) {
    const sourceMap = source && (source.map || (source.uniforms && source.uniforms.map && source.uniforms.map.value));
    let map = sourceMap;
    if (sourceMap && sourceMap.isTexture) {
      map = this.textureCache.get(sourceMap);
      if (!map) {
        map = sourceMap.clone();
        if ('encoding' in map && THREE.sRGBEncoding) map.encoding = THREE.sRGBEncoding;
        map.needsUpdate = true;
        this.textureCache.set(sourceMap, map); this.textures.add(map); this.texturePairs.push([sourceMap, map, sourceMap.version]);
      }
    }
    const params = {
      map: map || null,
      color: source && source.color ? source.color.clone() : new THREE.Color(0xffffff),
      transparent: !!(source && source.transparent) || settings.opacity < 1,
      opacity: Math.min(source && source.opacity == null ? 1 : source.opacity, settings.opacity),
      alphaTest: settings.alphaTest,
      side: settings.doubleSided ? THREE.DoubleSide : (source && source.side != null ? source.side : THREE.FrontSide),
      roughness: settings.mode === 'pbr' ? settings.roughness : (settings.mode === 'smooth' ? 0.65 : 0.8),
      metalness: settings.mode === 'pbr' ? settings.metalness : 0,
      emissive: new THREE.Color(settings.emissive),
      emissiveIntensity: settings.emissiveIntensity,
      flatShading: settings.mode === 'flat' || settings.mode === 'minecraft'
    };
    if (map) {
      map.magFilter = map.magFilter || THREE.NearestFilter;
      map.minFilter = map.minFilter || THREE.NearestFilter;
    }
    const material = new THREE.MeshStandardMaterial(params);
    material.name = 'Render Studio: ' + ((source && source.name) || 'Material');
    material.needsUpdate = true;
    this.owned.add(material);
    return material;
  }
  syncTextures() { for (const pair of this.texturePairs) if (pair[0].version !== pair[2]) { pair[2] = pair[0].version; pair[1].image = pair[0].image; pair[1].needsUpdate = true; } }
  dispose() { this.owned.forEach(m => m.dispose()); this.textures.forEach(t => t.dispose()); this.owned.clear(); this.textures.clear(); this.texturePairs.length=0; this.textureCache=new WeakMap(); }
};

RenderStudio.Engine = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.helperScene = new THREE.Scene();
    this.materials = new RenderStudio.Materials();
    this.clock = new THREE.Clock();
    this.model = null; this.sourceMap = []; this.lightObjects = new Map(); this.helpers = new Map(); this.lastPreview = 0;
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10000);
    this.areaLightReady = false;
    if (typeof THREE.RectAreaLight === 'function' && THREE.RectAreaLightUniformsLib && typeof THREE.RectAreaLightUniformsLib.init === 'function') {
      try { THREE.RectAreaLightUniformsLib.init(); this.areaLightReady = true; } catch (error) { console.warn('[Render Studio] Native area-light setup failed; using spotlight fallback', error); }
    }
    const phone=RenderStudio.getState().performance==='phone';
    const options={canvas,antialias:!phone,alpha:true,preserveDrawingBuffer:false,powerPreference:phone?'default':'high-performance',failIfMajorPerformanceCaveat:false};
    try { this.renderer = new THREE.WebGLRenderer(options); }
    catch (error) {
      console.warn('[Render Studio] Preferred WebGL context failed; retrying in compatibility mode', error);
      this.renderer = new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,preserveDrawingBuffer:false,powerPreference:'default',failIfMajorPerformanceCaveat:false});
    }
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.configurePerformance();
    if ('outputEncoding' in this.renderer && THREE.sRGBEncoding) this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.capabilities = this.detectCapabilities();
    RenderStudio.getState().capabilities = this.capabilities;
    this.installInteraction();
    this.rebuild();
    this.resize();
    this.running = true;
    this.frame();
  }
  detectCapabilities() {
    const gl = this.renderer.getContext();
    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxBuffer = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    const limit = Math.min(maxTexture, maxBuffer);
    return {webgl2: !!this.renderer.capabilities.isWebGL2, maxTexture, maxRenderbuffer: maxBuffer, safeSingle: Math.min(8192, Math.max(2048, Math.floor(limit / 2))), areaLight: this.areaLightReady};
  }
  configureRenderer() {
    const s = RenderStudio.getState();
    const maps = {none: THREE.NoToneMapping, linear: THREE.LinearToneMapping, reinhard: THREE.ReinhardToneMapping, cineon: THREE.CineonToneMapping, aces: THREE.ACESFilmicToneMapping};
    this.renderer.toneMapping = maps[s.environment.toneMapping] == null ? THREE.ACESFilmicToneMapping : maps[s.environment.toneMapping];
    this.renderer.toneMappingExposure = RenderStudio.clamp(s.environment.exposure, 0.01, 20);
  }
  configurePerformance() { const phone=RenderStudio.getState().performance==='phone';this.renderer.shadowMap.enabled=!phone;this.renderer.shadowMap.autoUpdate=!phone;this.renderer.shadowMap.type=phone?THREE.BasicShadowMap:THREE.PCFSoftShadowMap;this.renderer.setPixelRatio(1); }
  shadowSize(data) { return RenderStudio.getState().performance === 'phone' ? Math.min(256, data.shadowSize) : data.shadowSize; }
  invalidate() { if (!RenderStudio.getState().render.busy && Mode && Mode.selected && Mode.selected.id === 'render') this.renderFrame(); }
  rebuild() { this.rebuildModel(); this.rebuildLights(); this.rebuildEnvironment(); this.frameModel(false); }
  rebuildModel() {
    if (this.model) this.scene.remove(this.model);
    this.materials.dispose(); this.sourceMap = [];
    if (!Project || !Project.model_3d) return;
    const settings = RenderStudio.getState().material;
    const sourceNodes = [], cloneNodes = [];
    Project.model_3d.traverse(o => sourceNodes.push(o));
    Project.model_3d.updateMatrixWorld(true);
    this.model = Project.model_3d.clone(true);
    this.model.name = 'Render Studio Model';
    this.model.visible = true;
    this.model.layers.set(0);
    this.model.traverse(o => cloneNodes.push(o));
    for (let i = 0; i < cloneNodes.length; i++) {
      const src = sourceNodes[i], dst = cloneNodes[i];
      const sourceElement = typeof Outliner !== 'undefined' && Outliner.elements && Outliner.elements.find(e => e.uuid === src.name);
      this.sourceMap.push([src, dst, sourceElement]);
      dst.layers.set(0);
      if (dst.isMesh) {
        const sourceMaterials = Array.isArray(src.material) ? src.material : [src.material];
        const converted = sourceMaterials.map(m => this.materials.convert(m, settings));
        dst.material = Array.isArray(src.material) ? converted : converted[0];
        dst.castShadow = settings.castShadow; dst.receiveShadow = settings.receiveShadow;
        dst.frustumCulled = false;
        const element = sourceElement;
        dst.userData.renderStudioVisibility = element ? element.visibility !== false : src.visible !== false;
        dst.visible = dst.userData.renderStudioVisibility;
      } else if (dst.isLine || dst.isPoints || dst.isSprite) { dst.visible = false; }
    }
    this.scene.add(this.model);
  }
  syncPose() {
    this.materials.syncTextures();
    for (const [src, dst, element] of this.sourceMap) {
      dst.position.copy(src.position); dst.quaternion.copy(src.quaternion); dst.scale.copy(src.scale);
      if (dst.isMesh) {
        dst.visible = element ? element.visibility !== false : dst.userData.renderStudioVisibility !== false;
      } else if (!(dst.isLine || dst.isPoints || dst.isSprite)) {
        dst.visible = true;
      }
    }
    if (this.model) this.model.updateMatrixWorld(true);
  }
  disposeObject(obj) {
    if (!obj) return; obj.traverse(n => { if (n.geometry && n.userData.renderStudioOwned) n.geometry.dispose(); if (n.material && n.userData.renderStudioOwned) n.material.dispose(); });
  }
  clearLights() {
    if (this.ambient) { this.scene.remove(this.ambient); this.ambient = null; }
    if (this.hemi) { this.scene.remove(this.hemi); this.hemi = null; }
    this.lightObjects.forEach(o => { this.scene.remove(o); if (o.target) this.scene.remove(o.target); });
    this.helpers.forEach(o => { this.helperScene.remove(o); this.disposeObject(o); });
    this.lightObjects.clear(); this.helpers.clear();
  }
  rebuildLights() {
    this.clearLights(); const s = RenderStudio.getState();
    if (s.ambient.enabled) this.scene.add(this.ambient = new THREE.AmbientLight(s.ambient.color, s.ambient.intensity));
    if (s.hemisphere.enabled) this.scene.add(this.hemi = new THREE.HemisphereLight(s.hemisphere.sky, s.hemisphere.ground, s.hemisphere.intensity));
    for (const data of s.lights) this.createLight(data);
  }
  createLight(data) {
    let light;
    if (data.type === 'point') light = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
    else if (data.type === 'spot') { light = new THREE.SpotLight(data.color, data.intensity, data.distance, THREE.MathUtils.degToRad(data.angle), data.penumbra, data.decay); light.target = new THREE.Object3D(); this.scene.add(light.target); }
    else if (data.type === 'directional') { light = new THREE.DirectionalLight(data.color, data.intensity); light.target = new THREE.Object3D(); this.scene.add(light.target); }
    else if (data.type === 'area' && this.areaLightReady) light = new THREE.RectAreaLight(data.color, data.intensity, data.width, data.height);
    else if (data.type === 'area') { light = new THREE.SpotLight(data.color, data.intensity, 0, Math.PI/3, 0.65, 2); light.userData.renderStudioAreaFallback = true; light.target = new THREE.Object3D(); this.scene.add(light.target); }
    else light = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
    light.name = data.name; light.visible = data.enabled; light.position.fromArray(data.position);
    light.rotation.set(...data.rotation.map(THREE.MathUtils.degToRad));
    light.castShadow = !!data.castShadow && data.type !== 'area';
    if (light.shadow) { const size=this.shadowSize(data); light.shadow.mapSize.set(size, size); light.shadow.bias = data.bias; light.shadow.normalBias = data.normalBias; if (light.shadow.camera && data.shadowCameraSize) { const h = data.shadowCameraSize/2; Object.assign(light.shadow.camera, {left:-h,right:h,top:h,bottom:-h}); } }
    this.scene.add(light); this.lightObjects.set(data.id, light);
    if(RenderStudio.getState().helpers){const helper=this.makeHelper(data);this.helperScene.add(helper);this.helpers.set(data.id,helper);}
    this.updateLight(data);
  }
  makeHelper(data) {
    const group = new THREE.Group(); group.name = 'Render Studio Helper'; group.userData.lightId = data.id;
    const mat = new THREE.LineBasicMaterial({color: data.color, depthTest: false}); mat.userData = {}; group.userData.renderStudioOwned = true;
    let geo; const segments=RenderStudio.getState().performance==='phone'?8:16;
    if (data.type === 'area') geo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(data.width, data.height));
    else if (data.type === 'spot') geo = new THREE.ConeGeometry(3, 7, segments, 1, true).translate(0, -3.5, 0);
    else if (data.type === 'directional') geo = new THREE.ConeGeometry(1.5, 5, segments).translate(0, -2.5, 0);
    else geo = new THREE.SphereGeometry(1.4, segments, RenderStudio.getState().performance==='phone'?4:8);
    geo.userData = {}; const wire = data.type === 'point' ? new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:data.color, wireframe:true, depthTest:false})) : new THREE.LineSegments(data.type === 'area' ? geo : new THREE.EdgesGeometry(geo), mat);
    wire.userData.lightId = data.id; wire.renderOrder = 999; group.add(wire); return group;
  }
  updateLight(data) {
    let light = this.lightObjects.get(data.id), helper = this.helpers.get(data.id); if (!light) { this.createLight(data); light=this.lightObjects.get(data.id); helper=this.helpers.get(data.id); if(!light)return; }
    light.name=data.name; light.visible=data.enabled; light.color.set(data.color); light.intensity=data.intensity; light.position.fromArray(data.position); light.rotation.set(...data.rotation.map(THREE.MathUtils.degToRad)); light.castShadow=!!data.castShadow&&data.type!=='area';
    if ('distance' in light) light.distance=data.distance; if ('decay' in light) light.decay=data.decay;
    if (data.type==='spot') {light.angle=THREE.MathUtils.degToRad(data.angle);light.penumbra=data.penumbra;}
    if (data.type==='area' && !light.userData.renderStudioAreaFallback) {light.width=data.width;light.height=data.height;}
    if (light.target && (data.type==='spot'||data.type==='directional'||light.userData.renderStudioAreaFallback)) {
      const direction=new THREE.Vector3(0,0,-1).applyEuler(light.rotation).normalize();
      light.target.position.copy(light.position).add(direction.multiplyScalar(100));
      light.target.updateMatrixWorld(true);
    }
    if (light.shadow) {const size=this.shadowSize(data),changed=light.shadow.mapSize.x!==size||light.shadow.mapSize.y!==size;light.shadow.mapSize.set(size,size);light.shadow.bias=data.bias;light.shadow.normalBias=data.normalBias;if(changed&&light.shadow.map){light.shadow.map.dispose();light.shadow.map=null;}}
    if (helper) {helper.visible=RenderStudio.getState().helpers&&data.enabled;helper.position.fromArray(data.position);helper.rotation.copy(light.rotation);helper.scale.setScalar(RenderStudio.getState().helperSize);} this.invalidate();
  }
  pointAt(data, target) {
    const light=this.lightObjects.get(data.id); if(!light)return;
    const direction=target.clone().sub(light.position).normalize();
    if(direction.lengthSq()>0){const quaternion=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,-1),direction);light.quaternion.copy(quaternion);}
    if(light.target){light.target.position.copy(target);light.target.updateMatrixWorld();}
    if(data.type!=='point') data.rotation=[light.rotation.x,light.rotation.y,light.rotation.z].map(THREE.MathUtils.radToDeg);
    const h=this.helpers.get(data.id); if(h)h.rotation.copy(light.rotation);
  }
  pointAllAt(target) { for(const d of RenderStudio.getState().lights) if(d.type!=='point') this.pointAt(d,target); }
  rebuildEnvironment() {
    if (this.ground) {this.scene.remove(this.ground);this.ground.geometry.dispose();this.ground.material.dispose();}
    const s=RenderStudio.getState(), b=this.getBounds(), g=s.ground;
    if(g.enabled){const size=Math.max(b.largest*g.size,16);const mat=g.shadowCatcher&&THREE.ShadowMaterial?new THREE.ShadowMaterial({opacity:.5}):new THREE.MeshStandardMaterial({color:g.color,roughness:g.roughness});this.ground=new THREE.Mesh(new THREE.PlaneGeometry(size,size),mat);this.ground.rotation.x=-Math.PI/2;this.ground.position.y=g.auto?b.min.y-0.01:g.height;this.ground.receiveShadow=g.receiveShadow;this.ground.visible=g.visible;this.scene.add(this.ground);}
  }
  getBounds(){const box=new THREE.Box3();if(this.model){this.syncPose();box.setFromObject(this.model);}if(box.isEmpty())box.set(new THREE.Vector3(-8,0,-8),new THREE.Vector3(8,16,8));const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());return{box,min:box.min.clone(),max:box.max.clone(),size,center,largest:Math.max(size.x,size.y,size.z,1)};}
  frameModel(update=true){const b=this.getBounds(),s=RenderStudio.getState(),d=b.largest*2.2;s.camera.target=b.center.toArray();s.camera.position=[b.center.x+d,b.center.y+d*.7,b.center.z+d];if(update)this.updateCamera();}
  fromCurrentView(){const p=Preview&&Preview.selected;if(!p)return;const c=p.camera||p.camPers, s=RenderStudio.getState();s.camera.position=c.position.toArray();s.camera.target=p.controls.target.toArray();s.camera.fov=c.fov||45;this.updateCamera();RenderStudio.refreshUI();}
  updateCamera(aspect){const s=RenderStudio.getState().camera,a=aspect||this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight);if(s.projection==='orthographic'){const h=s.orthoScale/2;this.camera=new THREE.OrthographicCamera(-h*a,h*a,h,-h,s.near,s.far);}else this.camera=new THREE.PerspectiveCamera(s.fov,a,s.near,s.far);this.camera.position.fromArray(s.position);this.camera.lookAt(new THREE.Vector3().fromArray(s.target));this.camera.updateProjectionMatrix();}
  resize(){const w=Math.max(2,this.canvas.clientWidth||640),h=Math.max(2,this.canvas.clientHeight||480),scale=RenderStudio.getState().performance==='phone'?.35:1,rw=Math.max(2,Math.round(w*scale)),rh=Math.max(2,Math.round(h*scale));if(this.canvas.width!==rw||this.canvas.height!==rh)this.renderer.setSize(rw,rh,false);this.updateCamera(w/h);}
  setBackground(final=false){const e=RenderStudio.getState().environment;this.scene.background=e.background==='solid'?new THREE.Color(e.color):null;this.renderer.setClearColor(e.background==='solid'?e.color:0x000000,e.background==='transparent'?0:1);}
  renderFrame(){this.resize();this.syncPose();this.configureRenderer();this.setBackground();this.renderer.clear();this.renderer.render(this.scene,this.camera);if(RenderStudio.getState().helpers){this.renderer.clearDepth();this.renderer.render(this.helperScene,this.camera);}}
  frame(time=0){if(!this.running)return;const phone=RenderStudio.getState().performance==='phone',ready=!phone||time-this.lastPreview>=67;if(ready&&Mode&&Mode.selected&&Mode.selected.id==='render'&&!RenderStudio.getState().render.busy){this.lastPreview=time;this.renderFrame();}this.raf=requestAnimationFrame(t=>this.frame(t));}
  zoom(factor){const s=RenderStudio.getState().camera,f=RenderStudio.clamp(Number(factor)||1,.5,2);if(s.projection==='orthographic')s.orthoScale=RenderStudio.clamp(s.orthoScale*f,.01,100000);else{const pos=new THREE.Vector3().fromArray(s.position),target=new THREE.Vector3().fromArray(s.target),offset=pos.clone().sub(target);if(offset.lengthSq()>0){offset.multiplyScalar(f);pos.copy(target).add(offset);s.position=pos.toArray();}}this.updateCamera();this.invalidate();}
  installInteraction(){
    let down=null,last=null,pinchDistance=0;const pointers=new Map();
    const orbit=(dx,dy)=>{const s=RenderStudio.getState().camera,pos=new THREE.Vector3().fromArray(s.position),target=new THREE.Vector3().fromArray(s.target),off=pos.clone().sub(target),sph=new THREE.Spherical().setFromVector3(off);sph.theta-=dx*.008;sph.phi=RenderStudio.clamp(sph.phi-dy*.008,.05,Math.PI-.05);pos.copy(target).add(new THREE.Vector3().setFromSpherical(sph));s.position=pos.toArray();this.updateCamera();};
    this.canvas.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,[e.clientX,e.clientY]);down=e.button;last=[e.clientX,e.clientY];if(e.pointerType==='touch'&&pointers.size>1){const p=[...pointers.values()];pinchDistance=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);down=null;}this.canvas.setPointerCapture&&this.canvas.setPointerCapture(e.pointerId);});
    this.canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(e.pointerType==='touch'){if(pointers.size>1){const p=[...pointers.values()],distance=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(pinchDistance>0&&distance>0)this.zoom(pinchDistance/distance);pinchDistance=distance;return;}const dx=e.clientX-last[0],dy=e.clientY-last[1];last=[e.clientX,e.clientY];orbit(dx,dy);return;}if(down==null)return;const dx=e.clientX-last[0],dy=e.clientY-last[1];last=[e.clientX,e.clientY];if(down===0)orbit(dx,dy);else{const s=RenderStudio.getState().camera,pos=new THREE.Vector3().fromArray(s.position),target=new THREE.Vector3().fromArray(s.target),off=pos.clone().sub(target),scale=off.length()*.002,right=new THREE.Vector3().crossVectors(this.camera.getWorldDirection(new THREE.Vector3()),this.camera.up).normalize(),up=this.camera.up.clone(),move=right.multiplyScalar(-dx*scale).add(up.multiplyScalar(dy*scale));pos.add(move);target.add(move);s.position=pos.toArray();s.target=target.toArray();this.updateCamera();}});
    const release=e=>{pointers.delete(e.pointerId);pinchDistance=0;if(pointers.size===1){last=[...pointers.values()][0];down=0;}else if(!pointers.size)down=null;};
    this.canvas.addEventListener('pointerup',release);this.canvas.addEventListener('pointercancel',release);this.canvas.addEventListener('lostpointercapture',release);this.canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom(e.deltaY>0?1.12:.88);},{passive:false});
  }
  async renderImage(){const s=RenderStudio.getState(),out=s.output,size=RenderStudio.constrainOutput(out.width,out.height,s.performance),mobileScale=s.performance==='phone'?Math.min(1,1024/Math.max(size.width,size.height)):1,w=Math.max(16,Math.round(size.width*mobileScale)),h=Math.max(16,Math.round(size.height*mobileScale)),tile=Math.min(s.performance==='phone'?256:out.tileSize,this.capabilities.safeSingle,w,h);out.width=w;out.height=h;s.render.busy=true;s.render.cancel=false;const result=document.createElement('canvas');result.width=w;result.height=h;const ctx=result.getContext('2d',{alpha:true});if(!ctx)throw new Error('This device could not allocate the render image. Try a smaller resolution.');const cols=Math.ceil(w/tile),rows=Math.ceil(h/tile),total=cols*rows;let done=0;this.configurePerformance();this.configureRenderer();this.setBackground(true);this.syncPose();this.updateCamera(w/h);const cam=this.camera;
    try{for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){if(s.render.cancel)throw new Error('Render cancelled');const tw=Math.min(tile,w-x*tile),th=Math.min(tile,h-y*tile);this.renderer.setSize(tw,th,false);cam.setViewOffset(w,h,x*tile,y*tile,tw,th);this.renderer.clear();this.renderer.render(this.scene,cam);ctx.drawImage(this.renderer.domElement,x*tile,y*tile,tw,th);done++;s.render.progress=Math.round(done/total*100);s.render.status=`Rendering tile ${done} / ${total}`;RenderStudio.refreshUI();await new Promise(r=>setTimeout(r,0));}if(s.environment.background==='gradient'){ctx.globalCompositeOperation='destination-over';const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,s.environment.top);grad.addColorStop(1,s.environment.bottom);ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';}this.showResult(result);return result;}finally{cam.clearViewOffset();s.render.busy=false;s.render.status='';this.resize();RenderStudio.refreshUI();}}
  showResult(canvas){RenderStudio.lastResult=canvas;const url=canvas.toDataURL('image/png'),width=canvas.width,height=canvas.height;new Dialog('render_studio_result',{title:'Render Result',width:Math.min(900,window.innerWidth-80),component:{data(){return{url,width,height}},template:'<div class="rs-result"><div>{{width}} × {{height}}</div><img :src="url"></div>'},buttons:['Save PNG','Copy Image','Render Again','Close'],onButton:i=>{if(i===0)RenderStudio.savePNG();if(i===1)RenderStudio.copyPNG();if(i===2)this.renderImage();}}).show();}
  pause(){if(!this.running)return;this.running=false;cancelAnimationFrame(this.raf);}
  resume(){if(this.running)return;this.running=true;this.lastPreview=0;this.frame();}
  dispose(forceContextLoss=false){this.pause();this.clearLights();if(this.model)this.scene.remove(this.model);if(this.ground){this.ground.geometry.dispose();this.ground.material.dispose();}this.materials.dispose();this.renderer.dispose();if(forceContextLoss&&this.renderer.forceContextLoss)this.renderer.forceContextLoss();}
};
RenderStudio.savePNG=()=>{const c=RenderStudio.lastResult;if(!c)return;Blockbench.export({resource_id:'render_studio_image',type:'PNG Image',extensions:['png'],name:`${RenderStudio.safeName(Project&&Project.name)}_render_${c.width}x${c.height}`,content:c.toDataURL('image/png',1),savetype:'image'});};
RenderStudio.copyPNG=()=>{const c=RenderStudio.lastResult;if(!c)return;c.toBlob(async blob=>{try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);Blockbench.showQuickMessage('Render copied');}catch(e){Blockbench.showMessageBox({title:'Copy Image',message:'Clipboard image access is unavailable. Use Save PNG instead.'});}},'image/png');};

RenderStudio.presetStorageKey = 'render_studio_user_presets_v1';
RenderStudio.history = [];
RenderStudio.readUserPresets = () => {
  try { const value=JSON.parse(localStorage.getItem(RenderStudio.presetStorageKey)||'{}');return value&&typeof value==='object'?value:{}; }
  catch (error) { console.warn('[Render Studio] Could not read presets', error); return {}; }
};
RenderStudio.writeUserPresets = presets => {
  try { localStorage.setItem(RenderStudio.presetStorageKey,JSON.stringify(presets));return true; }
  catch (error) { Blockbench.showQuickMessage('Could not save preset on this device');return false; }
};
RenderStudio.presetPayload = state => {
  const data=RenderStudio.serializeState(state);delete data.environment.imageSource;delete data.environment.imageData;delete data.environment.imageName;delete data.output.width;delete data.output.height;return data;
};
RenderStudio.saveUserPreset = name => {
  name=String(name||'').trim().slice(0,40);if(!name){Blockbench.showQuickMessage('Enter a preset name');return false;}
  const presets=RenderStudio.readUserPresets();presets[name]=RenderStudio.presetPayload(RenderStudio.getState());
  if(RenderStudio.writeUserPresets(presets)){Blockbench.showQuickMessage(`Saved preset: ${name}`);RenderStudio.refreshUI();return true;}return false;
};
RenderStudio.applyUserPreset = name => {
  const saved=RenderStudio.readUserPresets()[name];if(!saved)return;
  const s=RenderStudio.getState(),hydrated=RenderStudio.hydrateState(saved),keep={output:RenderStudio.cloneData(s.output),imageSource:s.environment.imageSource,imageData:s.environment.imageData,imageName:s.environment.imageName};
  for(const key of ['lights','selectedLight','helpers','helperSize','ambient','hemisphere','ground','material','camera','post','tools'])if(hydrated[key]!==undefined)s[key]=RenderStudio.cloneData(hydrated[key]);
  Object.assign(s.environment,hydrated.environment,{imageSource:keep.imageSource,imageData:keep.imageData,imageName:keep.imageName});Object.assign(s.output,hydrated.output,keep.output);
  if(RenderStudio.engine)RenderStudio.engine.rebuild();RenderStudio.touch();RenderStudio.refreshUI();
};
RenderStudio.deleteUserPreset = name => {const presets=RenderStudio.readUserPresets();if(!(name in presets))return;delete presets[name];RenderStudio.writeUserPresets(presets);RenderStudio.refreshUI();};

RenderStudio.applyCameraPreset = name => {
  const s=RenderStudio.getState(),sizes={square:[1024,1024],portrait:[1080,1350],landscape:[1920,1080],item:[512,512],profile:[1024,1024]},size=sizes[name]||sizes.square,fit=RenderStudio.constrainOutput(size[0],size[1],s.performance);
  s.tools.cameraPreset=name;s.output.width=fit.width;s.output.height=fit.height;
  if(RenderStudio.engine){RenderStudio.engine.frameModel(true);if(name==='profile')RenderStudio.engine.zoom(.78);if(name==='item')RenderStudio.engine.zoom(.88);}
  RenderStudio.touch();RenderStudio.refreshUI();
};

RenderStudio.canvasBlob = canvas => new Promise((resolve,reject)=>{if(canvas.toBlob)canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not encode image')),'image/png');else{try{const parts=canvas.toDataURL('image/png').split(','),bytes=atob(parts[1]),array=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)array[i]=bytes.charCodeAt(i);resolve(new Blob([array],{type:'image/png'}));}catch(error){reject(error);}}});
RenderStudio.exportBlob = (blob,name,extension,type) => Blockbench.export({resource_id:'render_studio_export',type:type||'Render Studio Export',extensions:[extension],name,savetype:extension,content:blob});

RenderStudio.renderTurntable = async () => {
  const engine=RenderStudio.engine,s=RenderStudio.getState();if(!engine||s.render.busy)return;
  if(typeof JSZip!=='function'){Blockbench.showMessageBox({title:'Turntable Render',message:'ZIP support is unavailable in this Blockbench build.'});return;}
  const frames=RenderStudio.clamp(s.tools.turntableFrames,4,s.performance==='phone'?24:120),zip=new JSZip(),camera=RenderStudio.cloneData(s.camera),target=new THREE.Vector3().fromArray(camera.target),offset=new THREE.Vector3().fromArray(camera.position).sub(target);
  s.render.busy=true;s.render.cancel=false;
  try{
    for(let i=0;i<frames;i++){
      if(s.render.cancel)throw new Error('Render cancelled');
      const angle=Math.PI*2*i/frames,rotated=offset.clone().applyAxisAngle(new THREE.Vector3(0,1,0),angle);s.camera.position=target.clone().add(rotated).toArray();engine.updateCamera();
      s.render.status=`Turntable ${i+1} / ${frames}`;s.render.progress=Math.round(i/frames*100);RenderStudio.refreshUI();
      const canvas=await engine.renderImage({show:false,history:false,manageBusy:false});zip.file(`frame_${String(i+1).padStart(3,'0')}.png`,await RenderStudio.canvasBlob(canvas));
    }
    const content=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});RenderStudio.exportBlob(content,`${RenderStudio.safeName(Project&&Project.name)}_turntable`,'zip','Turntable PNG Frames');
  }catch(error){if(error.message!=='Render cancelled')Blockbench.showMessageBox({title:'Turntable Failed',message:String(error.message||error)});}
  finally{Object.assign(s.camera,camera);engine.updateCamera();s.render.busy=false;s.render.status='';s.render.progress=0;RenderStudio.refreshUI();}
};

RenderStudio.processBackgroundImage = (dataUrl,blur,brightness) => new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const max=RenderStudio.isMobile()?1024:2048,scale=Math.min(1,max/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));const ctx=canvas.getContext('2d');if(!ctx){reject(new Error('Could not process background image'));return;}ctx.filter=`blur(${RenderStudio.clamp(blur,0,30)}px) brightness(${RenderStudio.clamp(brightness,.1,3)})`;const pad=RenderStudio.clamp(blur,0,30)*2;ctx.drawImage(image,-pad,-pad,canvas.width+pad*2,canvas.height+pad*2);resolve(canvas.toDataURL('image/jpeg',.9));};image.onerror=()=>reject(new Error('Could not read background image'));image.src=dataUrl;});
RenderStudio.loadBackgroundFile = event => {
  const file=event&&event.target&&event.target.files&&event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=async()=>{try{const s=RenderStudio.getState();s.environment.imageSource=reader.result;s.environment.imageData=await RenderStudio.processBackgroundImage(s.environment.imageSource,s.environment.imageBlur,s.environment.imageBrightness);s.environment.imageName=file.name;s.environment.background='image';if(RenderStudio.engine)RenderStudio.engine.rebuildEnvironment();RenderStudio.touch();RenderStudio.refreshUI();}catch(error){Blockbench.showMessageBox({title:'Background Image',message:String(error.message||error)});}};reader.readAsDataURL(file);
};
RenderStudio.refreshBackgroundImage = async () => {const s=RenderStudio.getState();if(!s.environment.imageSource)return;try{s.environment.imageData=await RenderStudio.processBackgroundImage(s.environment.imageSource,s.environment.imageBlur,s.environment.imageBrightness);if(RenderStudio.engine)RenderStudio.engine.rebuildEnvironment();RenderStudio.touch();}catch(error){console.warn('[Render Studio] Background update failed',error);}};
RenderStudio.clearBackgroundImage = () => {const s=RenderStudio.getState();s.environment.imageSource='';s.environment.imageData='';s.environment.imageName='';if(s.environment.background==='image')s.environment.background='transparent';if(RenderStudio.engine)RenderStudio.engine.rebuildEnvironment();RenderStudio.touch();RenderStudio.refreshUI();};

RenderStudio.applyCanvasEffects = canvas => {
  const p=RenderStudio.getState().post;if(!p||(!p.bloom&&!p.vignette&&!p.contrast&&!p.saturation&&!p.dof))return canvas;
  const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;const ctx=out.getContext('2d',{alpha:true});if(!ctx)return canvas;
  const contrast=100+RenderStudio.clamp(p.contrast,-100,100),saturation=100+RenderStudio.clamp(p.saturation,-100,200),blur=RenderStudio.clamp(p.dof,0,12);ctx.filter=`contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;ctx.drawImage(canvas,0,0);ctx.filter='none';
  if(p.bloom){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=RenderStudio.clamp(p.bloomStrength,0,2)*.35;ctx.filter=`blur(${Math.max(4,Math.round(Math.min(canvas.width,canvas.height)/100))}px) brightness(140%)`;ctx.drawImage(canvas,0,0);ctx.restore();}
  if(p.vignette>0){const amount=RenderStudio.clamp(p.vignette,0,1),g=ctx.createRadialGradient(out.width/2,out.height/2,Math.min(out.width,out.height)*.2,out.width/2,out.height/2,Math.max(out.width,out.height)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${amount})`);ctx.fillStyle=g;ctx.fillRect(0,0,out.width,out.height);}
  return out;
};

RenderStudio.dataURLBlob = dataURL => {const parts=dataURL.split(','),mime=(parts[0].match(/data:([^;]+)/)||[])[1]||'application/octet-stream',bytes=atob(parts[1]),array=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)array[i]=bytes.charCodeAt(i);return new Blob([array],{type:mime});};
RenderStudio.addHistory = (canvas,pass='beauty') => {const entry={id:RenderStudio.uid(),url:canvas.toDataURL('image/png'),width:canvas.width,height:canvas.height,pass,time:new Date().toLocaleTimeString()};RenderStudio.history.unshift(entry);const limit=RenderStudio.isMobile()?5:10;while(RenderStudio.history.length>limit)RenderStudio.history.pop();const tools=RenderStudio.getState().tools;tools.compareA=RenderStudio.history[0]&&RenderStudio.history[0].id||'';tools.compareB=RenderStudio.history[1]&&RenderStudio.history[1].id||'';RenderStudio.refreshUI();return entry;};
RenderStudio.openHistory = id => {const item=RenderStudio.history.find(entry=>entry.id===id);if(!item)return;new Dialog('render_studio_history_item',{title:`Render History · ${item.pass}`,width:Math.min(900,window.innerWidth-40),component:{data(){return{item}},template:'<div class="rs-result"><div>{{item.width}} × {{item.height}}</div><img :src="item.url"></div>'},buttons:['Save PNG','Close'],onButton:i=>{if(i===0)RenderStudio.exportBlob(RenderStudio.dataURLBlob(item.url),`${RenderStudio.safeName(Project&&Project.name)}_${item.pass}_${item.width}x${item.height}`,'png','Render History PNG');}}).show();};
RenderStudio.clearHistory = () => {RenderStudio.history.splice(0);const tools=RenderStudio.getState().tools;tools.compareA='';tools.compareB='';RenderStudio.refreshUI();};

// Render Studio 2.1 workflow tools
RenderStudio.i18n = {
  en:{simple:'Simple',advanced:'Advanced',category_general:'General',category_workflow:'Workflow',category_look:'Look & Style',category_output:'Render Output',category_scene:'Scene Extras',category_batch:'Batch & Export',category_support:'System & Support',language:'Language',automatic_device:'Automatic device profile',detected:'Detected profile',phone:'Phone / Low PC',pc:'PC',undo:'Undo',redo:'Redo',comparison:'Render Comparison',side_by_side:'Side by side',slider:'Slider',compare:'Compare',preset_share:'Preset Import / Export',import_preset:'Import JSON',export_presets:'Export Presets',queue:'Render Queue',add_queue:'Add to Queue',run_queue:'Render Queue as ZIP',clear:'Clear',watermark:'Watermark / Logo',enabled:'Enabled',text:'Text',image:'Logo image',position:'Position',opacity:'Opacity',size:'Size',diagnostics:'Error Report',copy_report:'Copy Device Report',search:'Search advanced settings…',no_results:'No matching settings',history:'Render History',select_a:'Select A',select_b:'Select B'},
  tr:{simple:'Basit',advanced:'Gelişmiş',category_general:'Genel',category_workflow:'İş Akışı',category_look:'Görünüm ve Stil',category_output:'Render Çıktısı',category_scene:'Sahne Araçları',category_batch:'Toplu İşlem ve Dışa Aktarma',category_support:'Sistem ve Destek',language:'Dil',automatic_device:'Otomatik cihaz profili',detected:'Algılanan profil',phone:'Telefon / Düşük PC',pc:'PC',undo:'Geri Al',redo:'Yinele',comparison:'Render Karşılaştırma',side_by_side:'Yan yana',slider:'Sürgü',compare:'Karşılaştır',preset_share:'Preset İçe / Dışa Aktarma',import_preset:'JSON İçe Aktar',export_presets:'Presetleri Dışa Aktar',queue:'Render Kuyruğu',add_queue:'Kuyruğa Ekle',run_queue:'Kuyruğu ZIP Olarak Renderla',clear:'Temizle',watermark:'Filigran / Logo',enabled:'Etkin',text:'Yazı',image:'Logo görseli',position:'Konum',opacity:'Saydamlık',size:'Boyut',diagnostics:'Hata Raporu',copy_report:'Cihaz Raporunu Kopyala',search:'Gelişmiş ayarlarda ara…',no_results:'Eşleşen ayar yok',history:'Render Geçmişi',select_a:'A seç',select_b:'B seç'}
};
RenderStudio.t = key => {const language=(RenderStudio.getState().tools||{}).language==='tr'?'tr':'en';return RenderStudio.i18n[language][key]||RenderStudio.i18n.en[key]||key;};
RenderStudio.scrubNumberValue = (start,deltaY,step,min,max) => {step=Math.abs(Number(step))||1;let value=Number(start)+(Number(deltaY)||0)/8*step;const decimals=Math.min(6,Math.max(0,(String(step).split('.')[1]||'').length));value=Number(value.toFixed(decimals));if(Number.isFinite(Number(min)))value=Math.max(Number(min),value);if(Number.isFinite(Number(max)))value=Math.min(Number(max),value);return value;};
RenderStudio.installNumberScrubbing = () => {
  if(typeof document==='undefined'||!document.querySelectorAll)return;
  const bound=new WeakSet(),cleanups=[];
  const bind=root=>{if(!root||bound.has(root)||!root.addEventListener)return;bound.add(root);let drag=null;
    const down=event=>{const input=event.target;if(!input||!input.matches||!input.matches('input[type="number"]')||(event.pointerType!=='touch'&&event.button!==0))return;drag={input,pointerId:event.pointerId,startY:event.clientY,start:Number(input.value)||0,step:Number(input.step)||1,min:input.min,max:input.max,moved:false};RenderStudio.beginUndoAction();input.setPointerCapture&&input.setPointerCapture(event.pointerId);};
    const move=event=>{if(!drag||event.pointerId!==drag.pointerId)return;const distance=drag.startY-event.clientY;if(!drag.moved&&Math.abs(distance)<5)return;drag.moved=true;drag.input.classList&&drag.input.classList.add('rs-number-scrubbing');drag.input.value=String(RenderStudio.scrubNumberValue(drag.start,distance,drag.step,drag.min,drag.max));drag.input.dispatchEvent(new Event('input',{bubbles:true}));event.preventDefault();};
    const up=event=>{if(!drag||event.pointerId!==drag.pointerId)return;const active=drag;drag=null;if(active.moved){active.input.dispatchEvent(new Event('change',{bubbles:true}));active.input.blur&&active.input.blur();event.preventDefault();}active.input.classList&&active.input.classList.remove('rs-number-scrubbing');RenderStudio.endUndoAction();};
    root.addEventListener('pointerdown',down,true);root.addEventListener('pointermove',move,{capture:true,passive:false});root.addEventListener('pointerup',up,true);root.addEventListener('pointercancel',up,true);cleanups.push(()=>{root.removeEventListener('pointerdown',down,true);root.removeEventListener('pointermove',move,true);root.removeEventListener('pointerup',up,true);root.removeEventListener('pointercancel',up,true);});};
  const scan=()=>{for(const root of document.querySelectorAll('#panel_render_studio_scene,#panel_render_studio_settings,#panel_render_studio_tools'))bind(root);};scan();const first=setTimeout(scan,0),second=setTimeout(scan,250);
  RenderStudio.resources.push({delete(){clearTimeout(first);clearTimeout(second);cleanups.splice(0).forEach(cleanup=>cleanup());}});
};
RenderStudio.detectDeviceProfile = (apply=true) => {
  let score=0;const nav=typeof navigator==='undefined'?{}:navigator;
  if(RenderStudio.isMobile())score+=4;
  if(Number(nav.deviceMemory)&&Number(nav.deviceMemory)<=4)score+=2;
  if(Number(nav.hardwareConcurrency)&&Number(nav.hardwareConcurrency)<=4)score+=1;
  try{if(window.matchMedia&&window.matchMedia('(pointer: coarse)').matches)score+=2;}catch(error){}
  const profile=score>=2?'phone':'pc',s=RenderStudio.getState();
  if(apply&&s.tools.autoProfile&&s.performance!==profile)RenderStudio.applyPerformanceProfile(profile);
  return profile;
};
RenderStudio.setAutoProfile = enabled => {const s=RenderStudio.getState();s.tools.autoProfile=!!enabled;if(enabled)RenderStudio.detectDeviceProfile();RenderStudio.touch();RenderStudio.refreshUI();};

RenderStudio.undoStack=[];RenderStudio.redoStack=[];RenderStudio.undoLimit=40;RenderStudio.undoBefore=null;RenderStudio.observedUndoSnapshot=null;RenderStudio.applyingUndo=false;
RenderStudio.undoSnapshot = () => {const s=RenderStudio.getState();return RenderStudio.cloneData({camera:s.camera,lights:s.lights,selectedLight:s.selectedLight});};
RenderStudio.undoFingerprint = value => JSON.stringify(value||RenderStudio.undoSnapshot());
RenderStudio.beginUndoAction = () => {if(!RenderStudio.undoBefore)RenderStudio.undoBefore=RenderStudio.undoSnapshot();};
RenderStudio.endUndoAction = () => {if(!RenderStudio.undoBefore)return false;const before=RenderStudio.undoBefore,after=RenderStudio.undoSnapshot();RenderStudio.undoBefore=null;RenderStudio.observedUndoSnapshot=RenderStudio.cloneData(after);if(RenderStudio.undoFingerprint(before)===RenderStudio.undoFingerprint(after))return false;RenderStudio.undoStack.push(before);while(RenderStudio.undoStack.length>RenderStudio.undoLimit)RenderStudio.undoStack.shift();RenderStudio.redoStack.splice(0);RenderStudio.touch();RenderStudio.refreshUI();return true;};
RenderStudio.resetUndoObserver = () => {RenderStudio.undoBefore=null;RenderStudio.undoStack.splice(0);RenderStudio.redoStack.splice(0);RenderStudio.observedUndoSnapshot=RenderStudio.undoSnapshot();};
RenderStudio.observeUndoState = () => {const current=RenderStudio.undoSnapshot();if(RenderStudio.applyingUndo||RenderStudio.undoBefore){return;}if(!RenderStudio.observedUndoSnapshot){RenderStudio.observedUndoSnapshot=current;return;}if(RenderStudio.undoFingerprint(current)===RenderStudio.undoFingerprint(RenderStudio.observedUndoSnapshot))return;RenderStudio.undoStack.push(RenderStudio.cloneData(RenderStudio.observedUndoSnapshot));while(RenderStudio.undoStack.length>RenderStudio.undoLimit)RenderStudio.undoStack.shift();RenderStudio.redoStack.splice(0);RenderStudio.observedUndoSnapshot=current;};
RenderStudio.applyUndoSnapshot = snapshot => {const s=RenderStudio.getState();RenderStudio.applyingUndo=true;s.camera=RenderStudio.cloneData(snapshot.camera);s.lights=RenderStudio.cloneData(snapshot.lights);s.selectedLight=snapshot.selectedLight;RenderStudio.observedUndoSnapshot=RenderStudio.cloneData(snapshot);if(RenderStudio.engine){RenderStudio.engine.updateCamera();RenderStudio.engine.rebuildLights();RenderStudio.engine.invalidate();}RenderStudio.touch();RenderStudio.refreshUI();RenderStudio.applyingUndo=false;};
RenderStudio.undo = () => {const snapshot=RenderStudio.undoStack.pop();if(!snapshot)return;RenderStudio.redoStack.push(RenderStudio.undoSnapshot());RenderStudio.applyUndoSnapshot(snapshot);};
RenderStudio.redo = () => {const snapshot=RenderStudio.redoStack.pop();if(!snapshot)return;RenderStudio.undoStack.push(RenderStudio.undoSnapshot());RenderStudio.applyUndoSnapshot(snapshot);};
RenderStudio.recordChange = callback => {RenderStudio.beginUndoAction();try{return callback&&callback();}finally{RenderStudio.endUndoAction();}};

RenderStudio.exportPresets = () => {const content=JSON.stringify({format:'render-studio-presets',version:1,pluginVersion:RenderStudio.VERSION,presets:RenderStudio.readUserPresets()},null,2);Blockbench.export({resource_id:'render_studio_presets',type:'Render Studio Presets',extensions:['json'],name:'render_studio_presets',savetype:'text',content});};
RenderStudio.importPresets = event => {const file=event&&event.target&&event.target.files&&event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result||'')),incoming=data&&data.format==='render-studio-presets'?data.presets:data;if(!incoming||typeof incoming!=='object'||Array.isArray(incoming))throw new Error('Invalid Render Studio preset file');const presets=RenderStudio.readUserPresets();let count=0;for(const [name,value] of Object.entries(incoming)){if(value&&typeof value==='object'){presets[String(name).slice(0,40)]=value;count++;}}if(!count)throw new Error('No presets found');RenderStudio.writeUserPresets(presets);RenderStudio.refreshUI();Blockbench.showQuickMessage(`${count} preset${count===1?'':'s'} imported`);}catch(error){Blockbench.showMessageBox({title:'Preset Import',message:String(error.message||error)});}finally{if(event.target)event.target.value='';}};reader.readAsText(file);};

RenderStudio.openComparison = () => {const s=RenderStudio.getState(),a=RenderStudio.history.find(item=>item.id===s.tools.compareA),b=RenderStudio.history.find(item=>item.id===s.tools.compareB);if(!a||!b){Blockbench.showQuickMessage('Select two renders first');return;}const slider=s.tools.compareMode==='slider';new Dialog('render_studio_compare',{title:RenderStudio.t('comparison'),width:Math.min(1000,window.innerWidth-32),component:{data(){return{a,b,slider,split:50}},template:`<div class="rs-compare" :class="{slider:slider}"><template v-if="!slider"><figure><img :src="a.url"><figcaption>A · {{a.time}}</figcaption></figure><figure><img :src="b.url"><figcaption>B · {{b.time}}</figcaption></figure></template><template v-else><div class="rs-compare-stage"><img :src="a.url"><div class="rs-compare-top" :style="{width:split+'%'}"><img :src="b.url"></div><i :style="{left:split+'%'}"></i></div><input type="range" min="0" max="100" v-model.number="split"></template></div>`},buttons:['Close']}).show();};

RenderStudio.addQueueItem = () => {const s=RenderStudio.getState(),preset=s.tools.queuePreset||'',camera=s.tools.queueCamera||'square';s.tools.renderQueue.push({id:RenderStudio.uid(),name:`${preset||'Current'} · ${camera}`,preset,camera,pass:s.output.pass||'beauty'});RenderStudio.touch();RenderStudio.refreshUI();};
RenderStudio.removeQueueItem = id => {const q=RenderStudio.getState().tools.renderQueue,i=q.findIndex(item=>item.id===id);if(i>=0)q.splice(i,1);RenderStudio.touch();RenderStudio.refreshUI();};
RenderStudio.runRenderQueue = async () => {const s=RenderStudio.getState(),engine=RenderStudio.engine,items=s.tools.renderQueue.slice();if(!engine||!items.length||s.render.busy)return;if(typeof JSZip!=='function'){Blockbench.showMessageBox({title:'Render Queue',message:'ZIP support is unavailable.'});return;}const backup=RenderStudio.serializeState(s),zip=new JSZip();s.render.busy=true;s.render.cancel=false;try{for(let i=0;i<items.length;i++){if(s.render.cancel)throw new Error('Render cancelled');const item=items[i];if(item.preset)RenderStudio.applyUserPreset(item.preset);RenderStudio.applyCameraPreset(item.camera);s.render.status=`Queue ${i+1} / ${items.length}: ${item.name}`;s.render.progress=Math.round(i/items.length*100);const canvas=await engine.renderImage({pass:item.pass,show:false,manageBusy:false});zip.file(`${String(i+1).padStart(2,'0')}_${RenderStudio.safeName(item.name)}.png`,await RenderStudio.canvasBlob(canvas));}const content=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});RenderStudio.exportBlob(content,`${RenderStudio.safeName(Project&&Project.name)}_render_queue`,'zip','Render Queue');}catch(error){if(error.message!=='Render cancelled')Blockbench.showMessageBox({title:'Render Queue Failed',message:String(error.message||error)});}finally{const restored=RenderStudio.hydrateState(backup);for(const key of ['lights','selectedLight','helpers','helperSize','ambient','hemisphere','ground','material','camera','environment','output','post','tools'])s[key]=RenderStudio.cloneData(restored[key]);s.render.busy=false;s.render.status='';s.render.progress=0;engine.rebuild();RenderStudio.touch();RenderStudio.refreshUI();}};

RenderStudio.loadWatermark = event => {const file=event&&event.target&&event.target.files&&event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const s=RenderStudio.getState();s.tools.watermarkImage=String(reader.result||'');s.tools.watermarkName=file.name;s.tools.watermarkEnabled=true;RenderStudio.touch();RenderStudio.refreshUI();};reader.readAsDataURL(file);};
RenderStudio.applyWatermark = async canvas => {const w=RenderStudio.getState().tools;if(!w.watermarkEnabled||(!w.watermarkImage&&!w.watermarkText))return canvas;const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;const ctx=out.getContext('2d',{alpha:true});if(!ctx)return canvas;ctx.drawImage(canvas,0,0);ctx.globalAlpha=RenderStudio.clamp(w.watermarkOpacity,0,1);const margin=Math.max(8,Math.round(Math.min(out.width,out.height)*.025)),position=w.watermarkPosition||'bottom-right';if(w.watermarkImage){await new Promise(resolve=>{const image=new Image();image.onload=()=>{const target=Math.max(16,out.width*RenderStudio.clamp(w.watermarkScale,2,60)/100),scale=Math.min(target/image.width,out.height*.5/image.height),iw=image.width*scale,ih=image.height*scale,x=position.includes('right')?out.width-iw-margin:margin,y=position.includes('bottom')?out.height-ih-margin:margin;ctx.drawImage(image,x,y,iw,ih);resolve();};image.onerror=resolve;image.src=w.watermarkImage;});}if(w.watermarkText){const size=Math.max(12,Math.round(out.width*RenderStudio.clamp(w.watermarkScale,2,60)/300));ctx.font=`600 ${size}px sans-serif`;ctx.fillStyle='#ffffff';ctx.shadowColor='rgba(0,0,0,.8)';ctx.shadowBlur=Math.max(2,size/8);ctx.textBaseline='bottom';const width=ctx.measureText(w.watermarkText).width,x=position.includes('right')?out.width-width-margin:margin,y=position.includes('bottom')?out.height-margin:margin+size;ctx.fillText(w.watermarkText,x,y);}ctx.globalAlpha=1;return out;};

RenderStudio.deviceReport = () => {const s=RenderStudio.getState(),caps=(RenderStudio.engine&&RenderStudio.engine.capabilities)||s.capabilities||{},renderer=RenderStudio.engine&&RenderStudio.engine.renderer,gl=renderer&&renderer.getContext&&renderer.getContext();let vendor='unknown',gpu='unknown';try{const ext=gl&&gl.getExtension('WEBGL_debug_renderer_info');if(ext){vendor=gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);gpu=gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);}}catch(error){}return [`Render Studio ${RenderStudio.VERSION}`,`Blockbench ${typeof Blockbench!=='undefined'&&Blockbench.version||'unknown'}`,`Profile: ${s.performance} (auto: ${!!s.tools.autoProfile})`,`Mobile: ${RenderStudio.isMobile()}`,`User agent: ${typeof navigator!=='undefined'?navigator.userAgent:'unknown'}`,`Memory: ${typeof navigator!=='undefined'&&navigator.deviceMemory||'unknown'} GB`,`CPU threads: ${typeof navigator!=='undefined'&&navigator.hardwareConcurrency||'unknown'}`,`WebGL 2: ${!!caps.webgl2}`,`Max texture: ${caps.maxTexture||'unknown'}`,`Max renderbuffer: ${caps.maxRenderbuffer||'unknown'}`,`GPU vendor: ${vendor}`,`GPU: ${gpu}`,`Output: ${s.output.width}x${s.output.height}`,`Lights: ${s.lights.length}`].join('\n');};
RenderStudio.copyDeviceReport = async () => {const text=RenderStudio.deviceReport();try{if(typeof Blockbench.setClipboardText==='function')Blockbench.setClipboardText(text);else await navigator.clipboard.writeText(text);Blockbench.showQuickMessage('Device report copied');}catch(error){new Dialog('render_studio_report',{title:RenderStudio.t('diagnostics'),component:{data(){return{text}},template:'<textarea style="width:100%;height:55vh" readonly :value="text"></textarea>'},buttons:['Close']}).show();}};

RenderStudio.legacyTranslations={
  'Render Scene':'Render Sahnesi','Render Camera':'Render Kamerası','Environment':'Ortam','Presets':'Hazır Ayarlar','Point':'Nokta','Spot':'Spot','Sun':'Güneş','Area':'Alan','Render Properties':'Render Özellikleri','Performance':'Performans','Device':'Cihaz','Camera':'Kamera','Projection':'Projeksiyon','Perspective':'Perspektif','Orthographic':'Ortografik','Current View':'Geçerli Görünüm','Frame Model':'Modeli Kadraja Al','Materials & Shading':'Malzemeler ve Gölgelendirme','Environment & Ground':'Ortam ve Zemin','Output':'Çıktı','Width':'Genişlik','Height':'Yükseklik','Render Tools':'Render Araçları','Custom Presets':'Özel Presetler','Automatic Camera':'Otomatik Kamera','Effects':'Efektler','Render Layers':'Render Katmanları','Background Image':'Arka Plan Görseli','Light Dragging':'Işık Sürükleme','Scene Export':'Sahne Dışa Aktarma','Render History':'Render Geçmişi','Save':'Kaydet','Apply':'Uygula','Clear':'Temizle','Cancel':'İptal','Color':'Renk','Size':'Boyut','Position':'Konum','Rotation':'Döndürme','Intensity':'Yoğunluk','Distance':'Mesafe','Name':'Ad','Cast Shadows':'Gölge Oluştur','Point At Model':'Modele Yönelt','Ground Plane':'Zemin Düzlemi','Shadow Catcher':'Gölge Yakalayıcı','Background':'Arka Plan','Transparent':'Şeffaf','Solid':'Düz Renk','Gradient':'Gradyan','Image':'Görsel'
};
RenderStudio.applyLanguageToDOM = () => {if(typeof document==='undefined'||!document.querySelectorAll)return;const tr=RenderStudio.getState().tools.language==='tr',roots=document.querySelectorAll('#panel_render_studio_scene *,#panel_render_studio_settings *,#panel_render_studio_tools *');for(const element of roots){for(const node of element.childNodes||[]){if(node.nodeType!==3)continue;if(node.__rsEnglish===undefined)node.__rsEnglish=node.nodeValue;const base=node.__rsEnglish,trim=String(base).trim(),translated=RenderStudio.legacyTranslations[trim];node.nodeValue=tr&&translated?base.replace(trim,translated):base;}if(element.placeholder!==undefined){if(element.dataset&&element.dataset.rsEnglishPlaceholder===undefined)element.dataset.rsEnglishPlaceholder=element.placeholder;const base=element.dataset&&element.dataset.rsEnglishPlaceholder||element.placeholder;element.placeholder=tr&&base==='Preset name'?'Preset adı':base;}}};

RenderStudio.patchGLBScene = (buffer,engine) => {
  const input=Object.prototype.toString.call(buffer)==='[object ArrayBuffer]'?buffer:buffer&&buffer.buffer?buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength):null;if(!input)throw new Error('Blockbench returned an unsupported GLB buffer');const view=new DataView(input);if(view.getUint32(0,true)!==0x46546c67)throw new Error('Blockbench returned an invalid GLB file');
  let offset=12,json=null,bin=null;while(offset<input.byteLength){const length=view.getUint32(offset,true),type=view.getUint32(offset+4,true),data=input.slice(offset+8,offset+8+length);if(type===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(data).trim());else if(type===0x004e4942)bin=data;offset+=8+length;}
  if(!json)throw new Error('GLB JSON scene is missing');json.nodes=json.nodes||[];json.scenes=json.scenes||[{nodes:[]}];const scene=json.scenes[json.scene||0],s=RenderStudio.getState();scene.nodes=scene.nodes||[];json.cameras=json.cameras||[];
  engine.updateCamera(s.output.width/Math.max(1,s.output.height));const cameraIndex=json.cameras.push(s.camera.projection==='orthographic'?{name:'Render Camera',type:'orthographic',orthographic:{xmag:s.camera.orthoScale*(s.output.width/Math.max(1,s.output.height)),ymag:s.camera.orthoScale,znear:s.camera.near,zfar:s.camera.far}}:{name:'Render Camera',type:'perspective',perspective:{yfov:THREE.MathUtils.degToRad(s.camera.fov),znear:s.camera.near,zfar:s.camera.far,aspectRatio:s.output.width/Math.max(1,s.output.height)}})-1;
  const cameraNode=json.nodes.push({name:'Render Camera',camera:cameraIndex,translation:s.camera.position.slice(),rotation:engine.camera.quaternion.toArray()})-1;scene.nodes.push(cameraNode);
  json.extensionsUsed=json.extensionsUsed||[];if(!json.extensionsUsed.includes('KHR_lights_punctual'))json.extensionsUsed.push('KHR_lights_punctual');json.extensions=json.extensions||{};const ext=json.extensions.KHR_lights_punctual={lights:[]};
  for(const data of s.lights.filter(light=>light.enabled)){const type=data.type==='directional'?'directional':data.type==='spot'||data.type==='area'?'spot':'point',light={name:data.name,type,color:new THREE.Color(data.color).toArray(),intensity:data.intensity};if(type==='point'&&data.distance)light.range=data.distance;if(type==='spot')light.spot={innerConeAngle:0,outerConeAngle:THREE.MathUtils.degToRad(data.angle||55)};const object=engine.lightObjects.get(data.id),index=ext.lights.push(light)-1,node={name:data.name,translation:data.position.slice(),extensions:{KHR_lights_punctual:{light:index}}};if(object)node.rotation=object.quaternion.toArray();scene.nodes.push(json.nodes.push(node)-1);}
  const encoder=new TextEncoder(),raw=encoder.encode(JSON.stringify(json)),jsonLength=Math.ceil(raw.length/4)*4,binLength=bin?Math.ceil(bin.byteLength/4)*4:0,total=12+8+jsonLength+(bin?8+binLength:0),output=new ArrayBuffer(total),out=new DataView(output),bytes=new Uint8Array(output);out.setUint32(0,0x46546c67,true);out.setUint32(4,2,true);out.setUint32(8,total,true);out.setUint32(12,jsonLength,true);out.setUint32(16,0x4e4f534a,true);bytes.fill(0x20,20,20+jsonLength);bytes.set(raw,20);if(bin){const at=20+jsonLength;out.setUint32(at,binLength,true);out.setUint32(at+4,0x004e4942,true);bytes.set(new Uint8Array(bin),at+8);}return output;
};
RenderStudio.exportGLBScene = async () => {if(!RenderStudio.engine||!Project)return;try{if(typeof Codecs==='undefined'||!Codecs.gltf)throw new Error('The Blockbench glTF exporter is unavailable');const content=await Codecs.gltf.compile({encoding:'binary',animations:true});const glb=RenderStudio.patchGLBScene(content,RenderStudio.engine);RenderStudio.exportBlob(new Blob([glb],{type:'model/gltf-binary'}),`${RenderStudio.safeName(Project.name)}_render_scene`,'glb','Render Studio GLB Scene');}catch(error){Blockbench.showMessageBox({title:'GLB Export Failed',message:String(error.message||error)});}};

{
  const proto=RenderStudio.Engine.prototype,baseRebuildModel=proto.rebuildModel,baseSyncPose=proto.syncPose,baseRebuildEnvironment=proto.rebuildEnvironment,baseSetBackground=proto.setBackground,baseInstallInteraction=proto.installInteraction;
  proto.disposeOutline=function(){if(this.outlineModel){this.scene.remove(this.outlineModel);this.outlineModel.traverse(node=>{if(node.material&&node.userData.renderStudioOutline)node.material.dispose();});this.outlineModel=null;}this.outlineMap=[];};
  proto.rebuildOutline=function(){this.disposeOutline();const settings=RenderStudio.getState().post;if(!settings.outline||!this.model)return;this.outlineModel=this.model.clone(true);this.outlineModel.name='Render Studio Outline';const source=[],outline=[];this.model.traverse(node=>source.push(node));this.outlineModel.traverse(node=>outline.push(node));this.outlineMap=[];for(let i=0;i<outline.length;i++){const node=outline[i],src=source[i];this.outlineMap.push([src,node]);if(node.isMesh){node.material=new THREE.ShaderMaterial({uniforms:{outlineColor:{value:new THREE.Color(settings.outlineColor)},outlineSize:{value:RenderStudio.clamp(settings.outlineSize,.001,1)}},vertexShader:'uniform float outlineSize; void main(){vec3 p=position+normal*outlineSize;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}',fragmentShader:'uniform vec3 outlineColor; void main(){gl_FragColor=vec4(outlineColor,1.0);}',side:THREE.BackSide,depthTest:true,depthWrite:true});node.userData.renderStudioOutline=true;node.castShadow=false;node.receiveShadow=false;}else if(node.isLine||node.isPoints||node.isSprite)node.visible=false;}this.scene.add(this.outlineModel);};
  proto.rebuildModel=function(){this.disposeOutline();baseRebuildModel.call(this);this.rebuildOutline();};
  proto.syncPose=function(){baseSyncPose.call(this);if(this.outlineMap)for(const [source,target] of this.outlineMap){target.position.copy(source.position);target.quaternion.copy(source.quaternion);target.scale.copy(source.scale);target.visible=source.visible;}if(this.outlineModel)this.outlineModel.updateMatrixWorld(true);};
  proto.updateBackgroundTexture=function(){const env=RenderStudio.getState().environment;if(this.backgroundTexture){this.backgroundTexture.dispose();this.backgroundTexture=null;}if(env.background!=='image'||!env.imageData)return;new THREE.TextureLoader().load(env.imageData,texture=>{if(this.backgroundTexture)this.backgroundTexture.dispose();this.backgroundTexture=texture;if('colorSpace' in texture&&THREE.SRGBColorSpace)texture.colorSpace=THREE.SRGBColorSpace;else if('encoding' in texture&&THREE.sRGBEncoding)texture.encoding=THREE.sRGBEncoding;this.invalidate();},undefined,error=>console.warn('[Render Studio] Background texture failed',error));};
  proto.rebuildEnvironment=function(){baseRebuildEnvironment.call(this);this.updateBackgroundTexture();};
  proto.setBackground=function(final=false){const env=RenderStudio.getState().environment;if(env.background==='image'&&this.backgroundTexture){this.scene.background=this.backgroundTexture;this.renderer.setClearColor(0x000000,1);return;}baseSetBackground.call(this,final);};
  proto.beginRenderPass=function(pass){const s=RenderStudio.getState(),restore={pass:s.output.pass,background:s.environment.background,override:this.scene.overrideMaterial,outlineVisible:this.outlineModel&&this.outlineModel.visible,groundMaterial:this.ground&&this.ground.material,groundVisible:this.ground&&this.ground.visible,materials:[]},temporary=[];if(this.outlineModel)this.outlineModel.visible=pass==='beauty';if(pass==='transparent')s.environment.background='transparent';else if(pass==='normal'){const material=new THREE.MeshNormalMaterial();this.scene.overrideMaterial=material;temporary.push(material);s.environment.background='transparent';if(this.ground)this.ground.visible=false;}else if(pass==='depth'){const material=new THREE.MeshDepthMaterial({depthPacking:THREE.BasicDepthPacking});this.scene.overrideMaterial=material;temporary.push(material);s.environment.background='solid';s.environment.color='#ffffff';if(this.ground)this.ground.visible=false;}else if(pass==='shadow'){s.environment.background='solid';restore.color=s.environment.color;s.environment.color='#ffffff';if(this.model)this.model.traverse(node=>{if(node.isMesh){const mats=Array.isArray(node.material)?node.material:[node.material];for(const material of mats){if(material){restore.materials.push([material,material.colorWrite]);material.colorWrite=false;}}}});if(this.ground){const material=new THREE.ShadowMaterial({color:0x000000,opacity:1});this.ground.material=material;temporary.push(material);this.ground.visible=true;}}return()=>{this.scene.overrideMaterial=restore.override;if(this.outlineModel)this.outlineModel.visible=restore.outlineVisible;if(this.ground){this.ground.material=restore.groundMaterial;this.ground.visible=restore.groundVisible;}for(const [material,colorWrite] of restore.materials)material.colorWrite=colorWrite;s.environment.background=restore.background;if(restore.color)s.environment.color=restore.color;temporary.forEach(material=>material.dispose());};};
  proto.installLightDragInteraction=function(){const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(),point=new THREE.Vector3();raycaster.params.Line=raycaster.params.Line||{};raycaster.params.Line.threshold=1;let active=null;const locate=e=>{const rect=this.canvas.getBoundingClientRect();pointer.x=(e.clientX-rect.left)/Math.max(1,rect.width)*2-1;pointer.y=-(e.clientY-rect.top)/Math.max(1,rect.height)*2+1;raycaster.setFromCamera(pointer,this.camera);};this.canvas.addEventListener('pointerdown',e=>{if(!RenderStudio.getState().tools.dragLights)return;locate(e);const hit=raycaster.intersectObjects([...this.helpers.values()],true).find(item=>{let object=item.object;while(object&&!object.userData.lightId)object=object.parent;return object&&object.userData.lightId;});if(!hit)return;let object=hit.object;while(object&&!object.userData.lightId)object=object.parent;active=object.userData.lightId;const light=this.lightObjects.get(active);if(!light){active=null;return;}RenderStudio.beginUndoAction();plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(new THREE.Vector3()),light.position);RenderStudio.getState().selectedLight=active;e.preventDefault();e.stopImmediatePropagation();},{capture:true});this.canvas.addEventListener('pointermove',e=>{if(!active)return;locate(e);if(raycaster.ray.intersectPlane(plane,point)){const data=RenderStudio.getState().lights.find(light=>light.id===active);if(data){data.position=point.toArray();this.updateLight(data);RenderStudio.touch();}}e.preventDefault();e.stopImmediatePropagation();},{capture:true});const release=e=>{if(!active)return;active=null;RenderStudio.endUndoAction();e.preventDefault();e.stopImmediatePropagation();};this.canvas.addEventListener('pointerup',release,{capture:true});this.canvas.addEventListener('pointercancel',release,{capture:true});};
  proto.installInteraction=function(){this.installLightDragInteraction();this.canvas.addEventListener('pointerdown',()=>RenderStudio.beginUndoAction());this.canvas.addEventListener('wheel',()=>{RenderStudio.beginUndoAction();clearTimeout(this.renderStudioWheelUndo);this.renderStudioWheelUndo=setTimeout(()=>RenderStudio.endUndoAction(),180);},{capture:true});baseInstallInteraction.call(this);const finish=()=>RenderStudio.endUndoAction();this.canvas.addEventListener('pointerup',finish);this.canvas.addEventListener('pointercancel',finish);};
  const baseDispose=proto.dispose;proto.dispose=function(force){this.disposeOutline();if(this.backgroundTexture){this.backgroundTexture.dispose();this.backgroundTexture=null;}baseDispose.call(this,force);};

  proto.renderImage=async function(options={}){const s=RenderStudio.getState(),out=s.output,pass=options.pass||out.pass||'beauty',manageBusy=options.manageBusy!==false,size=RenderStudio.constrainOutput(out.width,out.height,s.performance),mobileScale=s.performance==='phone'?Math.min(1,1024/Math.max(size.width,size.height)):1,w=Math.max(16,Math.round(size.width*mobileScale)),h=Math.max(16,Math.round(size.height*mobileScale)),tile=Math.min(s.performance==='phone'?256:out.tileSize,this.capabilities.safeSingle,w,h);out.width=w;out.height=h;if(manageBusy){s.render.busy=true;s.render.cancel=false;}const result=document.createElement('canvas');result.width=w;result.height=h;const ctx=result.getContext('2d',{alpha:true});if(!ctx)throw new Error('This device could not allocate the render image. Try a smaller resolution.');const cols=Math.ceil(w/tile),rows=Math.ceil(h/tile),total=cols*rows;let done=0,restorePass=this.beginRenderPass(pass);this.configurePerformance();this.configureRenderer();this.setBackground(true);this.syncPose();this.updateCamera(w/h);const cam=this.camera;
    try{for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){if(s.render.cancel)throw new Error('Render cancelled');const tw=Math.min(tile,w-x*tile),th=Math.min(tile,h-y*tile);this.renderer.setSize(tw,th,false);cam.setViewOffset(w,h,x*tile,y*tile,tw,th);this.renderer.clear();this.renderer.render(this.scene,cam);if(pass==='beauty'&&RenderStudio.getState().helpers===false){}ctx.drawImage(this.renderer.domElement,x*tile,y*tile,tw,th);done++;s.render.progress=Math.round(done/total*100);s.render.status=`Rendering ${pass} ${done} / ${total}`;RenderStudio.refreshUI();await new Promise(resolve=>setTimeout(resolve,0));}if(s.environment.background==='gradient'&&pass==='beauty'){ctx.globalCompositeOperation='destination-over';const gradient=ctx.createLinearGradient(0,0,0,h);gradient.addColorStop(0,s.environment.top);gradient.addColorStop(1,s.environment.bottom);ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';}let finalCanvas=(pass==='beauty'||pass==='transparent')?RenderStudio.applyCanvasEffects(result):result;if(pass==='beauty'||pass==='transparent')finalCanvas=await RenderStudio.applyWatermark(finalCanvas);if(options.history!==false)RenderStudio.addHistory(finalCanvas,pass);if(options.show!==false)this.showResult(finalCanvas);return finalCanvas;}
    finally{cam.clearViewOffset();restorePass();if(manageBusy){s.render.busy=false;s.render.status='';}this.resize();RenderStudio.refreshUI();}
  };
  const passBase=proto.beginRenderPass;proto.beginRenderPass=function(pass){const color=RenderStudio.getState().environment.color,restore=passBase.call(this,pass);return()=>{restore();RenderStudio.getState().environment.color=color;};};
}

RenderStudio.installPersistence = () => {
  RenderStudio.listeners.push(Blockbench.on('save_project', ({model}) => {
    if (Project) {
      model.render_studio = RenderStudio.serializeState(RenderStudio.getState());
      RenderStudio.fingerprints.set(Project.uuid, JSON.stringify(model.render_studio));
    }
  }));
  RenderStudio.listeners.push(Blockbench.on('load_project', ({model}) => {
    if (!Project) return; const state = RenderStudio.hydrateState(model.render_studio);
    RenderStudio.projects.set(Project.uuid, state);
    Project.render_studio_state = state;
    Project.render_studio_snapshot = RenderStudio.serializeState(state);
    RenderStudio.fingerprints.set(Project.uuid, JSON.stringify(RenderStudio.serializeState(state)));
  }));
  RenderStudio.listeners.push(Blockbench.on('select_project', () => { if (RenderStudio.engine) {RenderStudio.engine.rebuild();RenderStudio.refreshUI();} }));
  RenderStudio.listeners.push(Blockbench.on('close_project', ({project}) => { if(project){RenderStudio.projects.delete(project.uuid);RenderStudio.fingerprints.delete(project.uuid);} }));
  RenderStudio.listeners.push(Blockbench.on('update_selection', () => { if(RenderStudio.engine)RenderStudio.engine.syncPose(); }));
};
RenderStudio.removePersistence = () => {RenderStudio.listeners.forEach(l=>l&&l.delete&&l.delete());RenderStudio.listeners.length=0;};

RenderStudio.refreshUI = () => {
  for (const p of [RenderStudio.scenePanel, RenderStudio.settingsPanel, RenderStudio.toolsPanel]) if(p&&p.inside_vue){p.inside_vue.state=RenderStudio.getState();if(p===RenderStudio.toolsPanel)p.inside_vue.customPresets=Object.keys(RenderStudio.readUserPresets());p.inside_vue.$forceUpdate();}
  setTimeout(()=>RenderStudio.applyLanguageToDOM&&RenderStudio.applyLanguageToDOM(),0);
};
RenderStudio.selected = () => {const s=RenderStudio.getState();return s.lights.find(l=>l.id===s.selectedLight)||null;};
RenderStudio.addLight = type => {const s=RenderStudio.getState(),l=RenderStudio.lightDefaults(type),b=RenderStudio.engine&&RenderStudio.engine.getBounds();if(b)l.position=[b.center.x+b.largest,b.center.y+b.largest,b.center.z+b.largest];s.lights.push(l);s.selectedLight=l.id;RenderStudio.engine&&RenderStudio.engine.createLight(l);if(b&&type!=='point')RenderStudio.engine.pointAt(l,b.center);RenderStudio.touch();RenderStudio.refreshUI();};
RenderStudio.deleteLight = id => {const s=RenderStudio.getState(),light=s.lights.find(l=>l.id===id);if(!light)return;Blockbench.showMessageBox({title:'Delete Light',message:`Delete **${light.name}**? This removes it from the render setup.`,buttons:['Delete','Cancel'],confirmIndex:0,cancelIndex:1},button=>{if(button!==0)return;const i=s.lights.findIndex(l=>l.id===id);if(i<0)return;s.lights.splice(i,1);s.selectedLight=s.lights[0]&&s.lights[0].id;RenderStudio.engine&&RenderStudio.engine.rebuildLights();RenderStudio.touch();RenderStudio.refreshUI();});};
RenderStudio.duplicateLight = id => {const s=RenderStudio.getState(),src=s.lights.find(l=>l.id===id);if(!src)return;const copy=RenderStudio.cloneData(src);copy.id=RenderStudio.uid();copy.name+=' Copy';copy.position=copy.position.map((v,i)=>v+(i===0?2:0));s.lights.push(copy);s.selectedLight=copy.id;RenderStudio.engine&&RenderStudio.engine.createLight(copy);RenderStudio.touch();RenderStudio.refreshUI();};
RenderStudio.installStyle = () => {const style=document.createElement('style');style.id='render_studio_style';style.textContent=`#mode_screen_render{position:absolute;inset:0;background:#181a1f;z-index:2}body:not([mode="render"]) #mode_screen_render{display:none}.rs-workspace{width:100%;height:100%;position:relative}.rs-workspace canvas{width:100%;height:100%;display:block;touch-action:none}.rs-hud{position:absolute;left:14px;bottom:14px;padding:6px 10px;background:#0009;border-radius:4px;pointer-events:none}.rs-section{border-bottom:1px solid var(--color-border);padding:8px;overflow:hidden}.rs-section summary{font-weight:600;cursor:pointer;margin-bottom:7px}.rs-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:7px}.rs-grid label{font-size:11px;opacity:.9;min-width:0}.rs-grid input,.rs-grid select,.rs-section>select{box-sizing:border-box;width:100%;max-width:100%}.rs-light{display:flex;align-items:center;gap:6px;padding:5px;cursor:pointer}.rs-light.selected{background:var(--color-selected)}.rs-light span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.rs-row{display:flex;gap:5px;margin:5px 0}.rs-row button{flex:1}.rs-render{width:100%;min-height:42px;font-weight:700}.rs-progress{height:5px;background:#333;margin-top:7px}.rs-progress i{display:block;height:100%;background:var(--color-accent);transition:width .1s}.rs-result{text-align:center}.rs-result img{display:block;max-width:100%;max-height:70vh;margin:8px auto;background:repeating-conic-gradient(#777 0 25%,#aaa 0 50%) 0/20px 20px}@media(max-width:700px),(pointer:coarse){.rs-section{padding:6px}.rs-grid{grid-template-columns:1fr;gap:8px}.rs-row{flex-wrap:wrap}.rs-row button,.rs-section button,.rs-light input[type=checkbox]{min-height:40px}.rs-light{min-height:42px;padding:4px}.rs-light button{min-width:42px;padding:4px}.rs-hud{left:6px;right:6px;bottom:6px;font-size:11px;text-align:center}.rs-section input,.rs-section select{min-height:38px;font-size:14px}.rs-section small{display:block;line-height:1.35;margin-top:5px}}`;document.head.appendChild(style);RenderStudio.resources.push({delete:()=>style.remove()});};
RenderStudio.installMobileStyle = () => {
  const style=document.createElement('style');
  style.id='render_studio_mobile_style';
  style.textContent='.rs-mobile-tools,.rs-mobile-zoom{display:none}.rs-history{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.rs-history button{padding:3px}.rs-history img{display:block;width:100%;aspect-ratio:1;object-fit:cover}@media(max-width:700px),(pointer:coarse){#mode_screen_render{z-index:2}#bottom_slot{position:relative;z-index:3}.panel_container[panel_id="render_studio_scene"],.panel_container[panel_id="render_studio_settings"],.panel_container[panel_id="render_studio_tools"]{position:relative;z-index:4}#panel_render_studio_scene,#panel_render_studio_settings,#panel_render_studio_tools{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y}.rs-section>summary{box-sizing:border-box;display:flex;align-items:center;min-height:48px;touch-action:manipulation;user-select:none;-webkit-user-select:none}.rs-mobile-tools{position:absolute;top:max(8px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);display:flex;justify-content:center;gap:5px;width:calc(100% - 16px);z-index:5}.rs-mobile-tools button,.rs-mobile-zoom button{display:flex;align-items:center;justify-content:center;gap:4px;min-height:46px;padding:7px 9px;border-radius:8px;background:var(--color-ui);color:var(--color-text);box-shadow:0 2px 8px #0008;touch-action:manipulation}.rs-mobile-tools i{font-size:20px}.rs-mobile-zoom{position:absolute;right:8px;top:max(78px,calc(env(safe-area-inset-top) + 70px));display:flex;flex-direction:column;gap:8px;z-index:5}.rs-mobile-zoom button{min-width:48px;padding:7px}.rs-mobile-zoom i{font-size:26px}.rs-result img{max-height:55vh}}';
  style.textContent+='#panel_render_studio_scene,#panel_render_studio_settings,#panel_render_studio_tools{min-height:0;overflow:hidden}#panel_render_studio_scene>.panel_vue_wrapper,#panel_render_studio_settings>.panel_vue_wrapper,#panel_render_studio_tools>.panel_vue_wrapper{box-sizing:border-box;display:block;flex:1 1 auto;min-height:0;height:auto;overflow-x:hidden;overflow-y:auto!important;overscroll-behavior-y:contain;scrollbar-gutter:stable;padding-bottom:12px}@media(max-width:700px),(pointer:coarse){#panel_render_studio_scene>.panel_vue_wrapper,#panel_render_studio_settings>.panel_vue_wrapper,#panel_render_studio_tools>.panel_vue_wrapper{-webkit-overflow-scrolling:touch;touch-action:pan-y;padding-bottom:max(24px,env(safe-area-inset-bottom))}.rs-section:last-child{padding-bottom:calc(24px + env(safe-area-inset-bottom))}}';
  style.textContent+='.rs-search{position:sticky;top:0;z-index:2;padding:8px;background:var(--color-ui)}.rs-search input{box-sizing:border-box;width:100%;min-height:38px}.rs-compare{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rs-compare figure{margin:0;text-align:center}.rs-compare img{display:block;width:100%;max-height:70vh;object-fit:contain}.rs-compare.slider{display:block}.rs-compare-stage{position:relative;overflow:hidden;background:#111;min-height:120px}.rs-compare-stage>img{width:100%;height:auto}.rs-compare-top{position:absolute;inset:0 auto 0 0;overflow:hidden}.rs-compare-top img{width:auto;max-width:none;height:100%}.rs-compare-stage>i{position:absolute;top:0;bottom:0;width:2px;background:white}.rs-queue-item{display:flex;align-items:center;gap:6px;padding:4px 0}.rs-queue-item span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}@media(max-width:700px),(pointer:coarse){.rs-compare{grid-template-columns:1fr}}';
  style.textContent+='.rs-view-switch{position:sticky;top:0;z-index:3;display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:8px;background:var(--color-ui)}.rs-view-switch button{min-height:38px}.rs-view-switch button.active{background:var(--color-accent);color:var(--color-accent_text)}.rs-view-switch+.rs-search{top:54px;padding-top:0}';
  style.textContent+='#panel_render_studio_scene>.panel_vue_wrapper>div,#panel_render_studio_settings>.panel_vue_wrapper>div,#panel_render_studio_tools>.panel_vue_wrapper>div{box-sizing:border-box;padding:6px;background:var(--color-back)}#panel_render_studio_scene .rs-section,#panel_render_studio_settings .rs-section,#panel_render_studio_tools .rs-section{box-sizing:border-box;margin:8px 4px;padding:12px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-ui);box-shadow:0 2px 5px #0002;overflow:visible}#panel_render_studio_scene details.rs-section,#panel_render_studio_settings details.rs-section,#panel_render_studio_tools details.rs-section{padding-top:9px}#panel_render_studio_scene .rs-section summary,#panel_render_studio_settings .rs-section summary,#panel_render_studio_tools .rs-section summary{display:flex;align-items:center;gap:8px;min-height:28px;margin:0 0 12px;padding:2px 0;font-size:13px;font-weight:700;letter-spacing:.15px;list-style:none;cursor:pointer}#panel_render_studio_scene .rs-section summary::-webkit-details-marker,#panel_render_studio_settings .rs-section summary::-webkit-details-marker,#panel_render_studio_tools .rs-section summary::-webkit-details-marker{display:none}#panel_render_studio_scene details.rs-section>summary:after,#panel_render_studio_settings details.rs-section>summary:after,#panel_render_studio_tools details.rs-section>summary:after{content:"›";margin-left:auto;font-size:22px;line-height:1;opacity:.55;transform:rotate(90deg);transition:transform .15s}#panel_render_studio_scene details.rs-section:not([open])>summary,#panel_render_studio_settings details.rs-section:not([open])>summary,#panel_render_studio_tools details.rs-section:not([open])>summary{margin-bottom:0}#panel_render_studio_scene details.rs-section:not([open])>summary:after,#panel_render_studio_settings details.rs-section:not([open])>summary:after,#panel_render_studio_tools details.rs-section:not([open])>summary:after{transform:rotate(0)}#panel_render_studio_scene .rs-section label,#panel_render_studio_settings .rs-section label,#panel_render_studio_tools .rs-section label{display:block;margin:7px 0;font-size:11px;line-height:1.35;opacity:.95}#panel_render_studio_scene .rs-section input:not([type=checkbox]):not([type=color]),#panel_render_studio_scene .rs-section select,#panel_render_studio_settings .rs-section input:not([type=checkbox]):not([type=color]),#panel_render_studio_settings .rs-section select,#panel_render_studio_tools .rs-section input:not([type=checkbox]):not([type=color]),#panel_render_studio_tools .rs-section select{box-sizing:border-box;width:100%;min-width:0;min-height:34px;margin-top:4px;padding:5px 7px;border:1px solid var(--color-border);border-radius:6px;background:var(--color-back);color:var(--color-text)}#panel_render_studio_scene .rs-section input[type=color],#panel_render_studio_settings .rs-section input[type=color],#panel_render_studio_tools .rs-section input[type=color]{width:100%;height:34px;margin-top:4px;border:1px solid var(--color-border);border-radius:6px;background:var(--color-back)}#panel_render_studio_scene .rs-section button,#panel_render_studio_settings .rs-section button,#panel_render_studio_tools .rs-section button,#panel_render_studio_tools .button{box-sizing:border-box;min-height:34px;padding:6px 10px;border:1px solid var(--color-border);border-radius:7px;background:var(--color-button);color:var(--color-text);transition:background .12s,border-color .12s,transform .05s}#panel_render_studio_scene .rs-section button:hover,#panel_render_studio_settings .rs-section button:hover,#panel_render_studio_tools .rs-section button:hover{border-color:var(--color-accent);background:var(--color-selected)}#panel_render_studio_scene .rs-section button:active,#panel_render_studio_settings .rs-section button:active,#panel_render_studio_tools .rs-section button:active{transform:translateY(1px)}#panel_render_studio_scene .rs-section button:disabled,#panel_render_studio_settings .rs-section button:disabled,#panel_render_studio_tools .rs-section button:disabled{opacity:.45;transform:none}.rs-render{margin-top:10px!important;border-color:var(--color-accent)!important;background:var(--color-accent)!important;color:var(--color-accent_text)!important;box-shadow:0 2px 7px #0003}.rs-row{gap:7px;margin:8px 0}.rs-grid{gap:8px}.rs-light{min-height:38px;margin:5px 0;padding:6px 7px;border:1px solid transparent;border-radius:7px;background:var(--color-back)}.rs-light:hover{border-color:var(--color-border)}.rs-light.selected{border-color:var(--color-accent);background:var(--color-selected);box-shadow:inset 3px 0 0 var(--color-accent)}.rs-light>i{opacity:.8}.rs-light button{min-width:32px!important;min-height:30px!important;padding:3px!important}.rs-section p{margin:12px 0 4px;font-size:11px;font-weight:700;opacity:.7}.rs-section small{display:block;margin:8px 0 2px;line-height:1.4;opacity:.65}.rs-view-switch{margin:4px 4px 0;padding:5px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-back);box-shadow:0 2px 7px #0003}.rs-view-switch button{border:0!important;border-radius:7px!important;background:transparent!important;font-weight:700}.rs-view-switch button.active{background:var(--color-accent)!important;color:var(--color-accent_text)!important}.rs-view-switch+.rs-search{padding:8px 4px 2px;background:var(--color-back)}.rs-search input{padding:7px 10px;border:1px solid var(--color-border);border-radius:8px;background:var(--color-ui);color:var(--color-text)}.rs-history{gap:8px}.rs-history button{overflow:hidden;padding:5px!important;border-radius:8px!important;background:var(--color-back)!important}.rs-history img{border-radius:5px}.rs-history small{margin:5px 2px 1px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rs-progress{overflow:hidden;height:6px;border-radius:6px;background:var(--color-back)}.rs-queue-item{margin:5px 0;padding:6px 7px;border:1px solid var(--color-border);border-radius:7px;background:var(--color-back)}.rs-hud{border:1px solid #ffffff18;border-radius:8px;box-shadow:0 3px 12px #0006;backdrop-filter:blur(6px)}@media(max-width:700px),(pointer:coarse){#panel_render_studio_scene>.panel_vue_wrapper>div,#panel_render_studio_settings>.panel_vue_wrapper>div,#panel_render_studio_tools>.panel_vue_wrapper>div{padding:4px}.rs-view-switch{margin:3px}.rs-view-switch button{min-height:44px}.rs-view-switch+.rs-search{top:58px}.rs-search input{min-height:44px}#panel_render_studio_scene .rs-section,#panel_render_studio_settings .rs-section,#panel_render_studio_tools .rs-section{margin:7px 3px;padding:11px;border-radius:11px;box-shadow:none}#panel_render_studio_scene .rs-section summary,#panel_render_studio_settings .rs-section summary,#panel_render_studio_tools .rs-section summary{min-height:42px;margin-bottom:10px;font-size:14px}.rs-mobile-tools button{flex:1;max-width:150px;border:1px solid var(--color-border);border-radius:10px!important}.rs-mobile-zoom button{border:1px solid var(--color-border);border-radius:50%!important;box-shadow:0 3px 10px #0007!important}}';
  style.textContent+='#panel_render_studio_scene>.panel_vue_wrapper,#panel_render_studio_settings>.panel_vue_wrapper,#panel_render_studio_tools>.panel_vue_wrapper{font-family:Inter,"Segoe UI",Roboto,Arial,sans-serif;font-size:12px;line-height:1.45;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}#panel_render_studio_scene .rs-section summary,#panel_render_studio_settings .rs-section summary,#panel_render_studio_tools .rs-section summary{font-size:13.5px;letter-spacing:0}#panel_render_studio_scene .rs-section label,#panel_render_studio_settings .rs-section label,#panel_render_studio_tools .rs-section label{font-size:12px}.rs-category{display:flex;align-items:center;gap:8px;margin:16px 7px 5px;padding:0 2px 7px;border-bottom:1px solid var(--color-border);color:var(--color-text);font-size:11px;font-weight:800;letter-spacing:.75px;text-transform:uppercase;opacity:.68}.rs-category:first-of-type{margin-top:11px}.rs-category i{font-size:17px;color:var(--color-accent);opacity:1}.rs-number-scrubbing{cursor:ns-resize!important;border-color:var(--color-accent)!important;box-shadow:0 0 0 2px color-mix(in srgb,var(--color-accent) 25%,transparent)!important}#panel_render_studio_scene input[type=number],#panel_render_studio_settings input[type=number],#panel_render_studio_tools input[type=number]{cursor:ns-resize;touch-action:none;user-select:none;-webkit-user-select:none}@media(max-width:700px),(pointer:coarse){.rs-category{margin:17px 7px 6px;font-size:11px}.rs-category i{font-size:18px}#panel_render_studio_scene>.panel_vue_wrapper,#panel_render_studio_settings>.panel_vue_wrapper,#panel_render_studio_tools>.panel_vue_wrapper{font-size:13px}#panel_render_studio_scene .rs-section label,#panel_render_studio_settings .rs-section label,#panel_render_studio_tools .rs-section label{font-size:13px}}';
  document.head.appendChild(style);
  RenderStudio.resources.push({delete:()=>style.remove()});
};
RenderStudio.openMobilePanel = panel => {
  if (!panel) return;
  try {
    if (typeof Interface !== 'undefined' && Interface.PanelSelectorVue && typeof Interface.PanelSelectorVue.select === 'function') {
      Interface.PanelSelectorVue.$forceUpdate();
      Interface.PanelSelectorVue.select(panel);
      setTimeout(()=>{if(RenderStudio.engine)RenderStudio.engine.resize();},0);
    }
  } catch (error) { console.warn('[Render Studio] Could not open mobile panel', error); }
};
RenderStudio.startEngine = canvas => {
  if (!canvas || !Project) return null;
  const activeState=RenderStudio.getState();if(RenderStudio.isMobile()&&activeState.tools&&activeState.tools.dragLights)activeState.helpers=true;
  if (RenderStudio.engine) {
    if (RenderStudio.engine.canvas === canvas) {
      RenderStudio.engine.resume();
      RenderStudio.engine.rebuild();
      RenderStudio.engine.resize();
      RenderStudio.refreshUI();
      return RenderStudio.engine;
    }
    RenderStudio.engine.dispose(false);
    RenderStudio.engine = null;
  }
  try {
    RenderStudio.engine = new RenderStudio.Engine(canvas);
    RenderStudio.engine.rebuild();
    RenderStudio.engine.resize();
    RenderStudio.refreshUI();
  } catch (error) {
    RenderStudio.engine = null;
    console.error('[Render Studio] Renderer startup failed', error);
    Blockbench.showMessageBox({title:'Render Studio',message:'This phone could not start the WebGL renderer. Close other 3D tabs, reload Blockbench, and try again.\n\n'+String(error.message||error)});
  }
  return RenderStudio.engine;
};
RenderStudio.stopEngine = () => {if(RenderStudio.engine)RenderStudio.engine.pause();};
RenderStudio.installUI = () => {
  window.RenderStudio = RenderStudio;
  RenderStudio.installStyle();
  RenderStudio.installMobileStyle();
  RenderStudio.installNumberScrubbing();
  RenderStudio.mode = new Mode('render',{name:'Render',icon:'photo_camera',selectElements:false,default_tool:'move_tool',condition:()=>!!Project,component:{data(){return{mobile:RenderStudio.isMobile()}},template:`<div class="rs-workspace"><canvas ref="canvas"></canvas><div class="rs-mobile-tools" v-if="mobile"><button @click="RenderStudio.openMobilePanel(RenderStudio.scenePanel)"><i class="material-icons">wb_sunny</i><span>{{RenderStudio.getState().tools.language==='tr'?'Işıklar':'Lights'}}</span></button><button @click="RenderStudio.openMobilePanel(RenderStudio.settingsPanel)"><i class="material-icons">tune</i><span>{{RenderStudio.getState().tools.language==='tr'?'Ayarlar':'Settings'}}</span></button><button @click="RenderStudio.openMobilePanel(RenderStudio.toolsPanel)"><i class="material-icons">auto_awesome</i><span>{{RenderStudio.getState().tools.language==='tr'?'Araçlar':'Tools'}}</span></button></div><div class="rs-mobile-zoom" v-if="mobile"><button aria-label="Zoom in" @click="RenderStudio.recordChange(()=>RenderStudio.engine&&RenderStudio.engine.zoom(.8))"><i class="material-icons">add</i></button><button aria-label="Zoom out" @click="RenderStudio.recordChange(()=>RenderStudio.engine&&RenderStudio.engine.zoom(1.25))"><i class="material-icons">remove</i></button></div><div class="rs-hud">{{mobile?(RenderStudio.getState().tools.language==='tr'?'Tek parmak: döndür · İki parmak: yakınlaştır':'One finger: orbit · Two fingers: zoom'):'Render Studio · Drag to orbit · Right-drag to pan · Wheel to zoom'}}</div></div>`,mounted(){RenderStudio.modeCanvas=this.$refs.canvas;},beforeDestroy(){RenderStudio.stopEngine();RenderStudio.modeCanvas=null;}},onSelect(){const state=RenderStudio.restoreModeState();RenderStudio.detectDeviceProfile();if(RenderStudio.isMobile())state.helpers=false;RenderStudio.resetUndoObserver();RenderStudio.refreshUI();setTimeout(()=>{RenderStudio.startEngine(RenderStudio.modeCanvas);if(RenderStudio.isMobile()&&typeof Interface!=='undefined'&&Interface.PanelSelectorVue)Interface.PanelSelectorVue.$forceUpdate();},0);},onUnselect(){RenderStudio.captureModeState();RenderStudio.stopEngine();}});RenderStudio.resources.push(RenderStudio.mode);
  RenderStudio.scenePanel = new Panel('render_studio_scene',{name:'Render Scene',icon:'wb_sunny',condition:{modes:['render']},growable:true,resizable:true,default_position:{slot:'left_bar',height:450,sidebar_index:0},component:{data(){return{state:RenderStudio.getState(),mobile:RenderStudio.isMobile(),presetsOpen:true}},methods:{section(e){if(this.mobile){e.preventDefault();this.presetsOpen=!this.presetsOpen}},select(l){this.state.selectedLight=l.id;RenderStudio.engine&&RenderStudio.engine.invalidate();RenderStudio.refreshUI()},add(type){RenderStudio.addLight(type)},del(l){RenderStudio.deleteLight(l.id)},dup(l){RenderStudio.duplicateLight(l.id)},toggle(l){RenderStudio.engine.updateLight(l)}},template:`<div><div class="rs-section"><b>Render Scene</b><div class="rs-light"><i class="material-icons">videocam</i><span>Render Camera</span></div><div class="rs-light"><i class="material-icons">public</i><span>Environment</span></div><div v-for="l in state.lights" :key="l.id" class="rs-light" :class="{selected:l.id===state.selectedLight}" @click="select(l)"><i class="material-icons">{{l.type==='point'?'lightbulb':l.type==='area'?'crop_landscape':'flashlight_on'}}</i><span>{{l.name}}</span><input type="checkbox" v-model="l.enabled" @change.stop="toggle(l)"><button title="Duplicate Light" @click.stop="dup(l)">⧉</button><button title="Delete Light" @click.stop="del(l)"><i class="material-icons">delete</i></button></div></div><div class="rs-section"><div class="rs-row"><button @click="add('point')">Point</button><button @click="add('spot')">Spot</button></div><div class="rs-row"><button @click="add('directional')">Sun</button><button @click="add('area')">Area</button></div></div><details class="rs-section" :open="mobile?presetsOpen:null"><summary @click="section">Presets</summary><div class="rs-grid"><button @click="RenderStudio.applyPreset('studio')">Studio</button><button @click="RenderStudio.applyPreset('minecraft')">Minecraft</button><button @click="RenderStudio.applyPreset('dramatic')">Dramatic</button><button @click="RenderStudio.applyPreset('horror')">Horror</button><button @click="RenderStudio.applyPreset('rim')">Rim</button></div></details></div>`}});RenderStudio.resources.push(RenderStudio.scenePanel);
  RenderStudio.settingsPanel = new Panel('render_studio_settings',{name:'Render Properties',icon:'tune',condition:{modes:['render']},growable:true,resizable:true,default_position:{slot:'right_bar',height:600,sidebar_index:0},component:{data(){return{state:RenderStudio.getState(),mobile:RenderStudio.isMobile(),sections:{performance:true,light:true,camera:false,materials:false,environment:false,output:true},presets:['512 × 512','1024 × 1024','1920 × 1080','2560 × 1440','3840 × 2160','4096 × 4096']}},watch:{state:{deep:true,handler(){RenderStudio.touch()}}},computed:{light(){return this.state.lights.find(l=>l.id===this.state.selectedLight)},memory(){return RenderStudio.estimateMemory(this.state.output.width,this.state.output.height)},profileMax(){return this.state.performance==='phone'?1024:32768}},methods:{section(e,name){if(this.mobile){e.preventDefault();this.sections[name]=!this.sections[name]}},performance(){RenderStudio.applyPerformanceProfile(this.state.performance)},updateLight(){if(this.light)RenderStudio.engine.updateLight(this.light)},point(){if(this.light)RenderStudio.engine.pointAt(this.light,RenderStudio.engine.getBounds().center)},materials(){RenderStudio.engine.rebuildModel()},environment(){RenderStudio.engine.rebuildEnvironment();RenderStudio.engine.rebuildLights()},preset(e){const a=e.target.value.split(/\D+/).filter(Boolean).map(Number);if(a.length===2){const size=RenderStudio.constrainOutput(a[0],a[1],this.state.performance);this.state.output.width=size.width;this.state.output.height=size.height}},render(){RenderStudio.engine.renderImage().catch(e=>{if(e.message!=='Render cancelled')Blockbench.showMessageBox({title:'Render Failed',message:String(e.message||e)});})}},template:`<div>
  <details class="rs-section" open><summary>Performance</summary><label>Device<select v-model="state.performance" @change="performance"><option value="phone">Phone / Low PC</option><option value="pc">PC</option></select></label><small v-if="state.performance==='phone'">15 FPS preview · 35% preview resolution · shadows disabled · 256px tiles · 1024px maximum output</small><small v-else>Full-speed preview · full preview resolution · user-selected shadows and output</small></details>
  <details class="rs-section" open v-if="light"><summary>Light · {{light.type}}</summary><div class="rs-grid"><label>Name<input v-model="light.name" @input="updateLight"></label><label>Color<input type="color" v-model="light.color" @input="updateLight"></label><label>Intensity<input type="number" min="0" step="0.1" v-model.number="light.intensity" @input="updateLight"></label><label v-if="light.distance!==undefined">Distance<input type="number" min="0" v-model.number="light.distance" @input="updateLight"></label></div><p>Position</p><div class="rs-grid"><label v-for="(v,i) in light.position">{{'XYZ'[i]}}<input type="number" step="0.25" v-model.number="light.position[i]" @input="updateLight"></label></div><p v-if="light.type!=='point'">Rotation</p><div class="rs-grid" v-if="light.type!=='point'"><label v-for="(v,i) in light.rotation">{{'XYZ'[i]}}<input type="number" step="1" v-model.number="light.rotation[i]" @input="updateLight"></label></div><div class="rs-grid" v-if="light.type==='area'"><label>Width<input type="number" min="0.1" v-model.number="light.width" @change="RenderStudio.engine.rebuildLights()"></label><label>Height<input type="number" min="0.1" v-model.number="light.height" @change="RenderStudio.engine.rebuildLights()"></label></div><div class="rs-grid" v-if="light.type==='spot'"><label>Angle<input type="number" min="1" max="89" v-model.number="light.angle" @input="updateLight"></label><label>Penumbra<input type="number" min="0" max="1" step="0.05" v-model.number="light.penumbra" @input="updateLight"></label></div><label v-if="light.type!=='area'"><input type="checkbox" v-model="light.castShadow" @change="updateLight"> Cast Shadows</label><label v-if="light.type!=='area'">Shadow Resolution<select v-model.number="light.shadowSize" @change="updateLight"><option>512</option><option>1024</option><option>2048</option><option>4096</option></select></label><button @click="point">Point At Model</button><small v-if="light.type==='area'">{{state.capabilities&&state.capabilities.areaLight?'Native area light active; native area-light shadows are unavailable.':'Compatibility area light active (soft spotlight fallback).'}}</small></details>
  <details class="rs-section"><summary>Camera</summary><div class="rs-grid"><label>Projection<select v-model="state.camera.projection" @change="RenderStudio.engine.updateCamera()"><option value="perspective">Perspective</option><option value="orthographic">Orthographic</option></select></label><label>FOV<input type="number" min="1" max="170" v-model.number="state.camera.fov" @input="RenderStudio.engine.updateCamera()"></label></div><div class="rs-row"><button @click="RenderStudio.engine.fromCurrentView()">Current View</button><button @click="RenderStudio.engine.frameModel()">Frame Model</button></div></details>
  <details class="rs-section"><summary>Materials & Shading</summary><label>Mode<select v-model="state.material.mode" @change="materials"><option value="minecraft">Minecraft</option><option value="flat">Flat</option><option value="smooth">Smooth</option><option value="pbr">PBR</option></select></label><div class="rs-grid"><label>Roughness<input type="number" min="0" max="1" step="0.05" v-model.number="state.material.roughness" @change="materials"></label><label>Metalness<input type="number" min="0" max="1" step="0.05" v-model.number="state.material.metalness" @change="materials"></label><label>Emissive<input type="color" v-model="state.material.emissive" @input="materials"></label><label>Strength<input type="number" min="0" step="0.1" v-model.number="state.material.emissiveIntensity" @input="materials"></label></div></details>
  <details class="rs-section"><summary>Environment & Ground</summary><div class="rs-grid"><label><input type="checkbox" v-model="state.ambient.enabled" @change="RenderStudio.engine.rebuildLights()"> Ambient</label><label>Ambient Strength<input type="number" min="0" max="5" step="0.05" v-model.number="state.ambient.intensity" @input="RenderStudio.engine.rebuildLights()"></label><label><input type="checkbox" v-model="state.hemisphere.enabled" @change="RenderStudio.engine.rebuildLights()"> Hemisphere</label><label>Hemisphere Strength<input type="number" min="0" max="5" step="0.05" v-model.number="state.hemisphere.intensity" @input="RenderStudio.engine.rebuildLights()"></label><label>Exposure<input type="number" min="0.01" step="0.1" v-model.number="state.environment.exposure"></label><label>Background<select v-model="state.environment.background"><option value="transparent">Transparent</option><option value="solid">Solid</option><option value="gradient">Gradient</option><option value="image">Image</option></select></label><label>Color<input type="color" v-model="state.environment.color"></label></div><label><input type="checkbox" v-model="state.ground.enabled" @change="environment"> Ground Plane</label><label><input type="checkbox" v-model="state.ground.shadowCatcher" @change="environment"> Shadow Catcher</label></details>
  <details class="rs-section" open><summary>Output</summary><select @change="preset"><option value="">Preset…</option><option v-for="p in presets">{{p}}</option></select><div class="rs-grid"><label>Width<input type="number" min="16" :max="profileMax" v-model.number="state.output.width"></label><label>Height<input type="number" min="16" :max="profileMax" v-model.number="state.output.height"></label><label>Tile Size<select v-model.number="state.output.tileSize" :disabled="state.performance==='phone'"><option>256</option><option>512</option><option>1024</option><option>2048</option><option>4096</option></select></label><label>Tone Mapping<select v-model="state.environment.toneMapping"><option value="none">None</option><option value="linear">Linear</option><option value="reinhard">Reinhard</option><option value="cineon">Cineon</option><option value="aces">ACES Filmic</option></select></label></div><small>CPU image: {{memory.cpuMB.toFixed(0)}} MB · GPU tile: ~{{memory.gpuMB.toFixed(0)}} MB<br v-if="state.capabilities">GPU max: {{state.capabilities&&state.capabilities.maxTexture}} · safe single: {{state.capabilities&&state.capabilities.safeSingle}}</small><button class="rs-render" @click="render" :disabled="state.render.busy">{{state.render.busy ? state.render.status : 'RENDER IMAGE'}}</button><button v-if="state.render.busy" @click="state.render.cancel=true">Cancel</button><div class="rs-progress" v-if="state.render.busy"><i :style="{width:state.render.progress+'%'}"></i></div></details>
  </div>`}});RenderStudio.resources.push(RenderStudio.settingsPanel);
  RenderStudio.toolsPanel = new Panel('render_studio_tools',{name:'Render Tools',icon:'auto_awesome',condition:{modes:['render']},growable:true,resizable:true,default_position:{slot:'right_bar',height:600,sidebar_index:1},component:{data(){return{state:RenderStudio.getState(),presetName:'',customPresets:Object.keys(RenderStudio.readUserPresets()),deviceProfile:RenderStudio.detectDeviceProfile(false)}},computed:{history(){return RenderStudio.history},queue(){return this.state.tools.renderQueue||[]}},methods:{t(key){return RenderStudio.t(key)},matches(words){const q=String(this.state.tools.search||'').trim().toLowerCase();return !q||String(words).toLowerCase().includes(q)},hasResults(){const words=['language dil device cihaz performance performans undo redo geri al yinele','360 turntable döner tabla frames kare','custom presets özel preset import export içe dışa','automatic camera otomatik kamera square portrait landscape','outline çizgi kenar','effects efekt bloom vignette contrast saturation depth','render layers katman pass beauty transparent shadow normal depth','background image arka plan blur brightness','light dragging ışık sürükleme helpers','watermark logo filigran text yazı opacity saydamlık','queue kuyruk camera preset zip','scene export glb camera lights sahne dışa aktar','history render geçmiş comparison karşılaştır','error report hata raporu device webgl gpu'];return words.some(words=>this.matches(words))},language(){RenderStudio.touch();this.$forceUpdate();RenderStudio.refreshUI()},autoProfile(){RenderStudio.setAutoProfile(this.state.tools.autoProfile);this.deviceProfile=RenderStudio.detectDeviceProfile(false)},turntable(){RenderStudio.renderTurntable()},savePreset(){if(RenderStudio.saveUserPreset(this.presetName)){this.presetName='';this.customPresets=Object.keys(RenderStudio.readUserPresets())}},loadPreset(name){RenderStudio.applyUserPreset(name)},deletePreset(name){RenderStudio.deleteUserPreset(name);this.customPresets=Object.keys(RenderStudio.readUserPresets())},camera(name){RenderStudio.recordChange(()=>RenderStudio.applyCameraPreset(name))},style(){if(RenderStudio.engine){RenderStudio.engine.rebuildOutline();RenderStudio.engine.invalidate();}RenderStudio.touch()},effects(){RenderStudio.touch()},renderPass(){if(!RenderStudio.engine)RenderStudio.startEngine(RenderStudio.modeCanvas);if(RenderStudio.engine)RenderStudio.engine.renderImage({pass:this.state.output.pass})},background(event){RenderStudio.loadBackgroundFile(event)},refreshBackground(){RenderStudio.refreshBackgroundImage()},clearBackground(){RenderStudio.clearBackgroundImage()},exportGLB(){RenderStudio.exportGLBScene()},openHistory(id){RenderStudio.openHistory(id)},clearHistory(){RenderStudio.clearHistory()},compare(){RenderStudio.openComparison()},importPresets(event){RenderStudio.importPresets(event)},exportPresets(){RenderStudio.exportPresets()},addQueue(){RenderStudio.addQueueItem()},removeQueue(id){RenderStudio.removeQueueItem(id)},runQueue(){RenderStudio.runRenderQueue()},watermark(event){RenderStudio.loadWatermark(event)},report(){RenderStudio.copyDeviceReport()}},template:`<div>
  <div class="rs-view-switch"><button :class="{active:!state.tools.advancedUI}" @click="state.tools.advancedUI=false;state.tools.search=''">{{t('simple')}}</button><button :class="{active:state.tools.advancedUI}" @click="state.tools.advancedUI=true">{{t('advanced')}}</button></div>
  <div class="rs-search" v-if="state.tools.advancedUI"><input v-model="state.tools.search" :placeholder="t('search')"></div>
  <div class="rs-category" v-if="state.tools.advancedUI && !state.tools.search"><i class="material-icons">tune</i><span>{{t('category_general')}}</span></div>
  <details class="rs-section" open v-show="matches('language dil device cihaz performance performans undo redo geri al yinele')"><summary>Language / Dil · Device</summary><div class="rs-grid"><label>{{t('language')}}<select v-model="state.tools.language" @change="language"><option value="en">English</option><option value="tr">Türkçe</option></select></label><label><input type="checkbox" v-model="state.tools.autoProfile" @change="autoProfile"> {{t('automatic_device')}}</label></div><small>{{t('detected')}}: {{t(deviceProfile)}}</small><div class="rs-row"><button @click="RenderStudio.undo" :disabled="!RenderStudio.undoStack.length"><i class="material-icons">undo</i> {{t('undo')}}</button><button @click="RenderStudio.redo" :disabled="!RenderStudio.redoStack.length"><i class="material-icons">redo</i> {{t('redo')}}</button></div></details>
  <div class="rs-category" v-if="state.tools.advancedUI && !state.tools.search"><i class="material-icons">auto_awesome</i><span>{{t('category_workflow')}}</span></div>
  <details class="rs-section" open v-show="state.tools.advancedUI && matches('360 turntable döner tabla frames kare')"><summary>360° Turntable</summary><label>Frames<input type="number" min="4" :max="state.performance==='phone'?24:120" v-model.number="state.tools.turntableFrames"></label><button class="rs-render" @click="turntable" :disabled="state.render.busy">Render PNG Frame ZIP</button><button v-if="state.render.busy" @click="state.render.cancel=true">Cancel</button></details>
  <details class="rs-section" open v-show="matches('custom presets özel preset import export içe dışa')"><summary>Custom Presets</summary><div class="rs-row"><input maxlength="40" placeholder="Preset name" v-model="presetName"><button @click="savePreset">Save</button></div><div v-for="name in customPresets" class="rs-row"><button @click="loadPreset(name)">{{name}}</button><button title="Delete preset" @click="deletePreset(name)"><i class="material-icons">delete</i></button></div><small v-if="!customPresets.length">No saved presets yet.</small><div class="rs-row" v-if="state.tools.advancedUI"><label class="button">{{t('import_preset')}}<input hidden type="file" accept="application/json,.json" @change="importPresets"></label><button @click="exportPresets">{{t('export_presets')}}</button></div></details>
  <details class="rs-section" open v-show="matches('automatic camera otomatik kamera square portrait landscape')"><summary>Automatic Camera</summary><div class="rs-grid"><button @click="camera('square')">Square</button><button @click="camera('portrait')">Portrait</button><button @click="camera('landscape')">Landscape</button><button @click="camera('item')">Minecraft Item</button><button @click="camera('profile')">Profile</button></div></details>
  <div class="rs-category" v-if="state.tools.advancedUI && !state.tools.search"><i class="material-icons">palette</i><span>{{t('category_look')}}</span></div>
  <details class="rs-section" v-show="state.tools.advancedUI && matches('outline çizgi kenar')"><summary>Outline</summary><label><input type="checkbox" v-model="state.post.outline" @change="style"> Enable Outline</label><div class="rs-grid"><label>Color<input type="color" v-model="state.post.outlineColor" @input="style"></label><label>Size<input type="number" min="0.001" max="1" step="0.005" v-model.number="state.post.outlineSize" @input="style"></label></div></details>
  <details class="rs-section" v-show="state.tools.advancedUI && matches('effects efekt bloom vignette contrast saturation depth')"><summary>Effects</summary><label><input type="checkbox" v-model="state.post.bloom" @change="effects"> Bloom</label><div class="rs-grid"><label>Bloom Strength<input type="number" min="0" max="2" step="0.1" v-model.number="state.post.bloomStrength"></label><label>Vignette<input type="number" min="0" max="1" step="0.05" v-model.number="state.post.vignette"></label><label>Contrast<input type="number" min="-100" max="100" step="5" v-model.number="state.post.contrast"></label><label>Saturation<input type="number" min="-100" max="200" step="5" v-model.number="state.post.saturation"></label><label>Depth of Field<input type="number" min="0" :max="state.performance==='phone'?3:12" step="0.5" v-model.number="state.post.dof"></label></div><small>Effects are applied to the final Beauty render. Phone mode uses conservative limits.</small></details>
  <div class="rs-category" v-if="state.tools.advancedUI && !state.tools.search"><i class="material-icons">photo_camera</i><span>{{t('category_output')}}</span></div>
  <details class="rs-section" open v-show="state.tools.advancedUI && matches('render layers katman pass beauty transparent shadow normal depth')"><summary>Render Layers</summary><label>Pass<select v-model="state.output.pass"><option value="beauty">Beauty</option><option value="transparent">Transparent</option><option value="shadow">Shadow</option><option value="normal">Normal</option><option value="depth">Depth</option></select></label><button class="rs-render" @click="renderPass" :disabled="state.render.busy">Render Selected Layer</button></details>
  <div class="rs-category" v-if="state.tools.advancedUI && !state.tools.search"><i class="material-icons">view_in_ar</i><span>{{t('category_scene')}}</span></div>
  <details class="rs-section" v-show="state.tools.advancedUI && matches('background image arka plan blur brightness')"><summary>Background Image</summary><input type="file" accept="image/png,image/jpeg,image/webp" @change="background"><small>{{state.environment.imageName||'No image selected'}}</small><div class="rs-grid"><label>Blur<input type="number" min="0" max="30" v-model.number="state.environment.imageBlur"></label><label>Brightness<input type="number" min="0.1" max="3" step="0.1" v-model.number="state.environment.imageBrightness"></label></div><div class="rs-row"><button @click="refreshBackground">Apply</button><button @click="clearBackground">Clear</button></div></details>
  <details class="rs-section" v-show="state.tools.advancedUI && matches('light dragging ışık sürükleme helpers')"><summary>Light Dragging</summary><label><input type="checkbox" v-model="state.helpers" @change="RenderStudio.engine&&RenderStudio.engine.rebuildLights()"> Show Light Helpers</label><label><input type="checkbox" v-model="state.tools.dragLights" @change="effects"> Drag light helpers directly in the viewport</label><small>Enable helpers, then drag a light shape with a mouse or one finger.</small></details>
  <details class="rs-section" open v-show="state.tools.advancedUI && matches('watermark logo filigran text yazı opacity saydamlık')"><summary>{{t('watermark')}}</summary><label><input type="checkbox" v-model="state.tools.watermarkEnabled"> {{t('enabled')}}</label><label>{{t('text')}}<input maxlength="80" v-model="state.tools.watermarkText"></label><label>{{t('image')}}<input type="file" accept="image/png,image/jpeg,image/webp" @change="watermark"></label><small>{{state.tools.watermarkName}}</small><div class="rs-grid"><label>{{t('position')}}<select v-model="state.tools.watermarkPosition"><option value="top-left">Top Left</option><option value="top-right">Top Right</option><option value="bottom-left">Bottom Left</option><option value="bottom-right">Bottom Right</option></select></label><label>{{t('opacity')}}<input type="number" min="0" max="1" step="0.05" v-model.number="state.tools.watermarkOpacity"></label><label>{{t('size')}} %<input type="number" min="2" max="60" v-model.number="state.tools.watermarkScale"></label></div></details>
  <div class="rs-category" v-if="state.tools.advancedUI && !state.tools.search"><i class="material-icons">inventory_2</i><span>{{t('category_batch')}}</span></div>
  <details class="rs-section" open v-show="state.tools.advancedUI && matches('queue kuyruk camera preset zip')"><summary>{{t('queue')}}</summary><div class="rs-grid"><label>Preset<select v-model="state.tools.queuePreset"><option value="">Current</option><option v-for="name in customPresets" :value="name">{{name}}</option></select></label><label>Camera<select v-model="state.tools.queueCamera"><option value="square">Square</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option><option value="item">Minecraft Item</option><option value="profile">Profile</option></select></label></div><button class="rs-render" @click="addQueue">{{t('add_queue')}}</button><div v-for="item in queue" :key="item.id" class="rs-queue-item"><span>{{item.name}}</span><button @click="removeQueue(item.id)"><i class="material-icons">delete</i></button></div><div class="rs-row" v-if="queue.length"><button @click="runQueue" :disabled="state.render.busy">{{t('run_queue')}}</button><button @click="state.tools.renderQueue=[]">{{t('clear')}}</button></div></details>
  <details class="rs-section" v-show="state.tools.advancedUI && matches('scene export glb camera lights sahne dışa aktar')"><summary>Scene Export</summary><button class="rs-render" @click="exportGLB">Export GLB + Camera + Lights</button><small>Area lights are exported as compatible spot lights.</small></details>
  <details class="rs-section" open v-show="matches('history render geçmiş comparison karşılaştır')"><summary>{{t('history')}}<span v-if="state.tools.advancedUI"> / {{t('comparison')}}</span></summary><div class="rs-history"><button v-for="item in history" :key="item.id" @click="openHistory(item.id)"><img :src="item.url"><small>{{item.pass}} · {{item.time}}</small></button></div><small v-if="!history.length">Recent renders appear here (5 on phones, 10 on PC).</small><div class="rs-grid" v-if="state.tools.advancedUI && history.length>1"><label>{{t('select_a')}}<select v-model="state.tools.compareA"><option v-for="item in history" :value="item.id">{{item.time}} · {{item.pass}}</option></select></label><label>{{t('select_b')}}<select v-model="state.tools.compareB"><option v-for="item in history" :value="item.id">{{item.time}} · {{item.pass}}</option></select></label><label>Mode<select v-model="state.tools.compareMode"><option value="slider">{{t('slider')}}</option><option value="side">{{t('side_by_side')}}</option></select></label><button @click="compare">{{t('compare')}}</button></div><button v-if="history.length" @click="clearHistory">Clear History</button></details>
  <div class="rs-category" v-if="state.tools.advancedUI && !state.tools.search"><i class="material-icons">build_circle</i><span>{{t('category_support')}}</span></div>
  <details class="rs-section" open v-show="state.tools.advancedUI && matches('error report hata raporu device webgl gpu')"><summary>{{t('diagnostics')}}</summary><button class="rs-render" @click="report">{{t('copy_report')}}</button><small>Plugin, device, WebGL, GPU and output information is copied without project content.</small></details>
  <small v-if="state.tools.search && !hasResults()">{{t('no_results')}}</small>
  </div>`}});RenderStudio.resources.push(RenderStudio.toolsPanel);
  if(RenderStudio.scenePanel&&RenderStudio.scenePanel.inside_vue)RenderStudio.scenePanel.inside_vue.RenderStudio=RenderStudio;
  if(RenderStudio.toolsPanel&&RenderStudio.toolsPanel.inside_vue){RenderStudio.toolsPanel.inside_vue.RenderStudio=RenderStudio;const unwatch=RenderStudio.toolsPanel.inside_vue.$watch&&RenderStudio.toolsPanel.inside_vue.$watch('state',()=>RenderStudio.touch(),{deep:true});if(unwatch)RenderStudio.resources.push({delete:unwatch});}
  if(RenderStudio.settingsPanel&&RenderStudio.settingsPanel.inside_vue){
    RenderStudio.settingsPanel.inside_vue.RenderStudio=RenderStudio;
    RenderStudio.settingsPanel.inside_vue.render=function(){
      if(!RenderStudio.engine)RenderStudio.startEngine(RenderStudio.modeCanvas);
      if(!RenderStudio.engine){Blockbench.showQuickMessage('Render engine is unavailable on this device');return;}
      RenderStudio.engine.renderImage().catch(error=>{if(error.message!=='Render cancelled')Blockbench.showMessageBox({title:'Render Failed',message:String(error.message||error)});});
    };
    const undoWatch=RenderStudio.settingsPanel.inside_vue.$watch&&RenderStudio.settingsPanel.inside_vue.$watch('state',()=>RenderStudio.observeUndoState(),{deep:true});if(undoWatch)RenderStudio.resources.push({delete:undoWatch});
  }
  RenderStudio.renderAction=new Action('render_studio_render',{name:'Render Image',icon:'photo_camera',condition:{modes:['render']},click:()=>{if(!RenderStudio.engine)RenderStudio.startEngine(RenderStudio.modeCanvas);if(RenderStudio.engine)RenderStudio.engine.renderImage();}});MenuBar.menus.view.addAction(RenderStudio.renderAction);RenderStudio.resources.push(RenderStudio.renderAction);
};
RenderStudio.removeUI = () => {
  if(RenderStudio.engine){RenderStudio.engine.dispose(true);RenderStudio.engine=null;}
  for(const resource of RenderStudio.resources){try{if(resource&&resource.vue&&!resource.vue._isDestroyed)resource.vue.$destroy();}catch(e){console.warn('[Render Studio] Vue cleanup',e)}}
  const screen=document.getElementById&&document.getElementById('mode_screen_render');if(screen)screen.remove();
  RenderStudio.resources.slice().reverse().forEach(r=>{try{r&&r.delete&&r.delete();}catch(e){console.warn('[Render Studio] cleanup',e)}});
  RenderStudio.resources.length=0;if(window.RenderStudio===RenderStudio)delete window.RenderStudio;
};

Plugin.register('render_studio',{
  title:'Render Studio',author:'shady',description:'Real Three.js lighting, cameras, shadows, tiled high-resolution PNG rendering, and Minecraft-aware materials in a dedicated Blockbench Render workspace.',icon:'icon.png',version:RenderStudio.VERSION,min_version:'5.1.0',variant:'both',tags:['Minecraft','Render','Lighting'],
  onload(){try{RenderStudio.installPersistence();RenderStudio.installUI();console.info('[Render Studio] loaded with isolated Three.js render scene');}catch(error){RenderStudio.removePersistence();RenderStudio.removeUI();throw error;}},
  onunload(){RenderStudio.removePersistence();RenderStudio.removeUI();RenderStudio.projects.clear();RenderStudio.fingerprints.clear();RenderStudio.lastResult=null;}
});
})();
