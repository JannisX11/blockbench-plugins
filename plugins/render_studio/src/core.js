RenderStudio.VERSION = '1.0.0';
RenderStudio.resources = [];
RenderStudio.listeners = [];
RenderStudio.projects = new Map();
RenderStudio.fingerprints = new Map();
RenderStudio.uid = () => 'rs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
RenderStudio.clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));
RenderStudio.cloneData = value => JSON.parse(JSON.stringify(value));
RenderStudio.defaults = () => ({
  version: 1,
  performance: 'pc',
  lights: [],
  selectedLight: null,
  helpers: true,
  helperSize: 1,
  ambient: {enabled: true, color: '#ffffff', intensity: 0.65},
  hemisphere: {enabled: true, sky: '#d9e8ff', ground: '#554b43', intensity: 0.35},
  ground: {enabled: true, auto: true, height: 0, size: 4, color: '#777777', roughness: 0.9, receiveShadow: true, visible: true, shadowCatcher: false},
  material: {mode: 'minecraft', roughness: 0.8, metalness: 0, emissive: '#000000', emissiveIntensity: 0, opacity: 1, alphaTest: 0.01, doubleSided: false, castShadow: true, receiveShadow: true},
  camera: {projection: 'perspective', position: [32, 24, 32], target: [0, 8, 0], fov: 45, near: 0.01, far: 10000, orthoScale: 32},
  environment: {background: 'transparent', color: '#20242b', top: '#3d4655', bottom: '#111318', exposure: 1, toneMapping: 'aces'},
  output: {width: 2048, height: 2048, antialias: 'normal', tileSize: 2048},
  post: {contrast: 0, saturation: 0, vignette: 0, bloom: false, bloomStrength: 0.6},
  render: {busy: false, progress: 0, status: '', cancel: false},
  capabilities: null
});
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
    state = Project.render_studio_state || RenderStudio.defaults();
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
  const snapshot = Project.render_studio_snapshot;
  if (!snapshot) return RenderStudio.getState();
  const restored = RenderStudio.defaults();
  Object.assign(restored, RenderStudio.cloneData(snapshot));
  restored.render = RenderStudio.defaults().render;
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
  const max = profile === 'phone' ? 2048 : 32768, scale = Math.min(1, max / Math.max(width, height));
  return {width: Math.max(16, Math.round(width * scale)), height: Math.max(16, Math.round(height * scale))};
};
RenderStudio.applyPerformanceProfile = profile => {
  const s = RenderStudio.getState(), e = RenderStudio.engine;
  s.performance = profile === 'phone' ? 'phone' : 'pc';
  if (s.performance === 'phone') {
    const size = RenderStudio.constrainOutput(s.output.width, s.output.height, 'phone');
    s.output.width = size.width; s.output.height = size.height; s.output.tileSize = Math.min(1024, s.output.tileSize); s.helpers = false;
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
    add('point', 'Low Red Fill', [c.x+d*.5, c.y-d*.2, c.z+d*.4], 0.8, '#ff3b30'); s.ambient.intensity = 0.12;
  } else if (name === 'rim') {
    add('area', 'Key', [c.x-d, c.y+d, c.z+d], 4.5);
    add('spot', 'Rim', [c.x+d*.5, c.y+d, c.z-d], 6, '#b9d7ff'); s.ambient.intensity = 0.3;
  } else {
    add('area', 'Key Light', [c.x-d, c.y+d, c.z+d], name === 'minecraft' ? 5 : 4.2, '#fff4e5');
    add('area', 'Fill Light', [c.x+d, c.y+d*.35, c.z+d], 2.2, '#dbeaff');
    add('spot', 'Rim Light', [c.x+d*.4, c.y+d, c.z-d], name === 'minecraft' ? 5 : 3.5, '#b8d4ff'); s.ambient.intensity = name === 'dramatic' ? 0.2 : 0.45;
  }
  s.selectedLight = s.lights[0] && s.lights[0].id;
  if (e) { e.rebuildLights(); e.pointAllAt(c); e.invalidate(); }
  RenderStudio.touch();
  RenderStudio.refreshUI();
};
