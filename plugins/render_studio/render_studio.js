/** Render Studio 1.0.0 - Made by shady - Blockbench 5.1+ - MIT License */
(function() {
'use strict';
const RenderStudio = {};
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
    this.renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, preserveDrawingBuffer: true});
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
    return {webgl2: !!this.renderer.capabilities.isWebGL2, maxTexture, maxRenderbuffer: maxBuffer, safeSingle: Math.min(8192, Math.max(2048, Math.floor(limit / 2))), areaLight: typeof THREE.RectAreaLight === 'function'};
  }
  configureRenderer() {
    const s = RenderStudio.getState();
    const maps = {none: THREE.NoToneMapping, linear: THREE.LinearToneMapping, reinhard: THREE.ReinhardToneMapping, cineon: THREE.CineonToneMapping, aces: THREE.ACESFilmicToneMapping};
    this.renderer.toneMapping = maps[s.environment.toneMapping] == null ? THREE.ACESFilmicToneMapping : maps[s.environment.toneMapping];
    this.renderer.toneMappingExposure = RenderStudio.clamp(s.environment.exposure, 0.01, 20);
  }
  configurePerformance() { this.renderer.shadowMap.type = RenderStudio.getState().performance === 'phone' ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap; }
  shadowSize(data) { return RenderStudio.getState().performance === 'phone' ? Math.min(512, data.shadowSize) : data.shadowSize; }
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
    else if (data.type === 'area' && typeof THREE.RectAreaLight === 'function') light = new THREE.RectAreaLight(data.color, data.intensity, data.width, data.height);
    else light = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
    light.name = data.name; light.visible = data.enabled; light.position.fromArray(data.position);
    light.rotation.set(...data.rotation.map(THREE.MathUtils.degToRad));
    light.castShadow = !!data.castShadow && data.type !== 'area';
    if (light.shadow) { const size=this.shadowSize(data); light.shadow.mapSize.set(size, size); light.shadow.bias = data.bias; light.shadow.normalBias = data.normalBias; if (light.shadow.camera && data.shadowCameraSize) { const h = data.shadowCameraSize/2; Object.assign(light.shadow.camera, {left:-h,right:h,top:h,bottom:-h}); } }
    this.scene.add(light); this.lightObjects.set(data.id, light);
    const helper = this.makeHelper(data); this.helperScene.add(helper); this.helpers.set(data.id, helper);
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
    const light = this.lightObjects.get(data.id), helper = this.helpers.get(data.id); if (!light) return;
    light.name=data.name; light.visible=data.enabled; light.color.set(data.color); light.intensity=data.intensity; light.position.fromArray(data.position); light.rotation.set(...data.rotation.map(THREE.MathUtils.degToRad)); light.castShadow=!!data.castShadow&&data.type!=='area';
    if ('distance' in light) light.distance=data.distance; if ('decay' in light) light.decay=data.decay;
    if (data.type==='spot') {light.angle=THREE.MathUtils.degToRad(data.angle);light.penumbra=data.penumbra;}
    if (data.type==='area') {light.width=data.width;light.height=data.height;}
    if (light.target && (data.type==='spot'||data.type==='directional')) {
      const direction=new THREE.Vector3(0,0,-1).applyEuler(light.rotation).normalize();
      light.target.position.copy(light.position).add(direction.multiplyScalar(100));
      light.target.updateMatrixWorld(true);
    }
    if (light.shadow) {const size=this.shadowSize(data),changed=light.shadow.mapSize.x!==size||light.shadow.mapSize.y!==size;light.shadow.mapSize.set(size,size);light.shadow.bias=data.bias;light.shadow.normalBias=data.normalBias;if(changed&&light.shadow.map){light.shadow.map.dispose();light.shadow.map=null;}}
    if (helper) {helper.visible=RenderStudio.getState().helpers&&data.enabled;helper.position.fromArray(data.position);helper.rotation.copy(light.rotation);helper.scale.setScalar(RenderStudio.getState().helperSize);}
  }
  pointAt(data, target) {
    const light=this.lightObjects.get(data.id); if(!light)return;
    if (data.type==='area') light.lookAt(target); else if(light.target){light.target.position.copy(target);light.target.updateMatrixWorld();const aim=new THREE.Object3D();aim.position.copy(light.position);aim.lookAt(target);light.rotation.copy(aim.rotation);}
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
  resize(){const w=Math.max(2,this.canvas.clientWidth||640),h=Math.max(2,this.canvas.clientHeight||480),scale=RenderStudio.getState().performance==='phone'?.6:1,rw=Math.max(2,Math.round(w*scale)),rh=Math.max(2,Math.round(h*scale));if(this.canvas.width!==rw||this.canvas.height!==rh)this.renderer.setSize(rw,rh,false);this.updateCamera(w/h);}
  setBackground(final=false){const e=RenderStudio.getState().environment;this.scene.background=e.background==='solid'?new THREE.Color(e.color):null;this.renderer.setClearColor(e.background==='solid'?e.color:0x000000,e.background==='transparent'?0:1);}
  renderFrame(){this.resize();this.syncPose();this.configureRenderer();this.setBackground();this.renderer.clear();this.renderer.render(this.scene,this.camera);if(RenderStudio.getState().helpers){this.renderer.clearDepth();this.renderer.render(this.helperScene,this.camera);}}
  frame(time=0){if(!this.running)return;const phone=RenderStudio.getState().performance==='phone',ready=!phone||time-this.lastPreview>=34;if(ready&&Mode&&Mode.selected&&Mode.selected.id==='render'&&!RenderStudio.getState().render.busy){this.lastPreview=time;this.renderFrame();}this.raf=requestAnimationFrame(t=>this.frame(t));}
  installInteraction(){let down=null,last=null;this.canvas.addEventListener('pointerdown',e=>{down=e.button;last=[e.clientX,e.clientY];this.canvas.setPointerCapture(e.pointerId);});this.canvas.addEventListener('pointermove',e=>{if(down==null)return;const dx=e.clientX-last[0],dy=e.clientY-last[1];last=[e.clientX,e.clientY];const s=RenderStudio.getState().camera,pos=new THREE.Vector3().fromArray(s.position),target=new THREE.Vector3().fromArray(s.target),off=pos.clone().sub(target);if(down===0){const sph=new THREE.Spherical().setFromVector3(off);sph.theta-=dx*.008;sph.phi=RenderStudio.clamp(sph.phi-dy*.008,.05,Math.PI-.05);pos.copy(target).add(new THREE.Vector3().setFromSpherical(sph));s.position=pos.toArray();}else{const scale=off.length()*.002;const right=new THREE.Vector3().crossVectors(this.camera.getWorldDirection(new THREE.Vector3()),this.camera.up).normalize();const up=this.camera.up.clone();const move=right.multiplyScalar(-dx*scale).add(up.multiplyScalar(dy*scale));pos.add(move);target.add(move);s.position=pos.toArray();s.target=target.toArray();}this.updateCamera();});this.canvas.addEventListener('pointerup',()=>down=null);this.canvas.addEventListener('wheel',e=>{e.preventDefault();const s=RenderStudio.getState().camera,pos=new THREE.Vector3().fromArray(s.position),t=new THREE.Vector3().fromArray(s.target);pos.lerp(t,e.deltaY>0?-0.12:0.12);s.position=pos.toArray();this.updateCamera();},{passive:false});}
  async renderImage(){const s=RenderStudio.getState(),out=s.output,size=RenderStudio.constrainOutput(out.width,out.height,s.performance),w=size.width,h=size.height,tile=Math.min(s.performance==='phone'?1024:out.tileSize,this.capabilities.safeSingle,w,h);out.width=w;out.height=h;s.render.busy=true;s.render.cancel=false;const result=document.createElement('canvas');result.width=w;result.height=h;const ctx=result.getContext('2d',{alpha:true});const cols=Math.ceil(w/tile),rows=Math.ceil(h/tile),total=cols*rows;let done=0;this.configurePerformance();this.configureRenderer();this.setBackground(true);this.syncPose();this.updateCamera(w/h);const cam=this.camera;
    try{for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){if(s.render.cancel)throw new Error('Render cancelled');const tw=Math.min(tile,w-x*tile),th=Math.min(tile,h-y*tile);this.renderer.setSize(tw,th,false);cam.setViewOffset(w,h,x*tile,y*tile,tw,th);this.renderer.clear();this.renderer.render(this.scene,cam);ctx.drawImage(this.renderer.domElement,x*tile,y*tile,tw,th);done++;s.render.progress=Math.round(done/total*100);s.render.status=`Rendering tile ${done} / ${total}`;RenderStudio.refreshUI();await new Promise(r=>setTimeout(r,0));}if(s.environment.background==='gradient'){ctx.globalCompositeOperation='destination-over';const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,s.environment.top);grad.addColorStop(1,s.environment.bottom);ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';}this.showResult(result);return result;}finally{cam.clearViewOffset();s.render.busy=false;s.render.status='';this.resize();RenderStudio.refreshUI();}}
  showResult(canvas){const s=RenderStudio.getState();RenderStudio.lastResult=canvas;const url=canvas.toDataURL('image/png');new Dialog('render_studio_result',{title:'Render Result',width:Math.min(900,window.innerWidth-80),lines:[`<div class="rs-result"><div>${canvas.width} × ${canvas.height}</div><img src="${url}"></div>`],buttons:['Save PNG','Copy Image','Render Again','Close'],onButton:i=>{if(i===0)RenderStudio.savePNG();if(i===1)RenderStudio.copyPNG();if(i===2)this.renderImage();}}).show();}
  dispose(){this.running=false;cancelAnimationFrame(this.raf);this.clearLights();if(this.model)this.scene.remove(this.model);if(this.ground){this.ground.geometry.dispose();this.ground.material.dispose();}this.materials.dispose();this.renderer.dispose();this.renderer.forceContextLoss&&this.renderer.forceContextLoss();}
};
RenderStudio.savePNG=()=>{const c=RenderStudio.lastResult;if(!c)return;Blockbench.export({resource_id:'render_studio_image',type:'PNG Image',extensions:['png'],name:`${RenderStudio.safeName(Project&&Project.name)}_render_${c.width}x${c.height}`,content:c.toDataURL('image/png',1),savetype:'image'});};
RenderStudio.copyPNG=()=>{const c=RenderStudio.lastResult;if(!c)return;c.toBlob(async blob=>{try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);Blockbench.showQuickMessage('Render copied');}catch(e){Blockbench.showMessageBox({title:'Copy Image',message:'Clipboard image access is unavailable. Use Save PNG instead.'});}},'image/png');};

RenderStudio.installPersistence = () => {
  RenderStudio.listeners.push(Blockbench.on('save_project', ({model}) => {
    if (Project) {
      model.render_studio = RenderStudio.serializeState(RenderStudio.getState());
      RenderStudio.fingerprints.set(Project.uuid, JSON.stringify(model.render_studio));
    }
  }));
  RenderStudio.listeners.push(Blockbench.on('load_project', ({model}) => {
    if (!Project) return; const state = RenderStudio.defaults();
    if (model.render_studio && typeof model.render_studio === 'object') Object.assign(state, RenderStudio.cloneData(model.render_studio), {render: state.render});
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
  for (const p of [RenderStudio.scenePanel, RenderStudio.settingsPanel]) if(p&&p.inside_vue){p.inside_vue.state=RenderStudio.getState();p.inside_vue.$forceUpdate();}
};
RenderStudio.selected = () => {const s=RenderStudio.getState();return s.lights.find(l=>l.id===s.selectedLight)||null;};
RenderStudio.addLight = type => {const s=RenderStudio.getState(),l=RenderStudio.lightDefaults(type),b=RenderStudio.engine&&RenderStudio.engine.getBounds();if(b)l.position=[b.center.x+b.largest,b.center.y+b.largest,b.center.z+b.largest];s.lights.push(l);s.selectedLight=l.id;RenderStudio.engine&&RenderStudio.engine.createLight(l);if(b&&type!=='point')RenderStudio.engine.pointAt(l,b.center);RenderStudio.touch();RenderStudio.refreshUI();};
RenderStudio.deleteLight = id => {const s=RenderStudio.getState(),light=s.lights.find(l=>l.id===id);if(!light)return;Blockbench.showMessageBox({title:'Delete Light',message:`Delete **${light.name}**? This removes it from the render setup.`,buttons:['Delete','Cancel'],confirmIndex:0,cancelIndex:1},button=>{if(button!==0)return;const i=s.lights.findIndex(l=>l.id===id);if(i<0)return;s.lights.splice(i,1);s.selectedLight=s.lights[0]&&s.lights[0].id;RenderStudio.engine&&RenderStudio.engine.rebuildLights();RenderStudio.touch();RenderStudio.refreshUI();});};
RenderStudio.duplicateLight = id => {const s=RenderStudio.getState(),src=s.lights.find(l=>l.id===id);if(!src)return;const copy=RenderStudio.cloneData(src);copy.id=RenderStudio.uid();copy.name+=' Copy';copy.position=copy.position.map((v,i)=>v+(i===0?2:0));s.lights.push(copy);s.selectedLight=copy.id;RenderStudio.engine&&RenderStudio.engine.createLight(copy);RenderStudio.touch();RenderStudio.refreshUI();};
RenderStudio.installStyle = () => {const style=document.createElement('style');style.id='render_studio_style';style.textContent=`#mode_screen_render{position:absolute;inset:0;background:#181a1f;z-index:2}body:not([mode="render"]) #mode_screen_render{display:none}.rs-workspace{width:100%;height:100%;position:relative}.rs-workspace canvas{width:100%;height:100%;display:block}.rs-hud{position:absolute;left:14px;bottom:14px;padding:6px 10px;background:#0009;border-radius:4px;pointer-events:none}.rs-section{border-bottom:1px solid var(--color-border);padding:8px}.rs-section summary{font-weight:600;cursor:pointer;margin-bottom:7px}.rs-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}.rs-grid label{font-size:11px;opacity:.8}.rs-grid input,.rs-grid select{width:100%}.rs-light{display:flex;align-items:center;gap:6px;padding:5px;cursor:pointer}.rs-light.selected{background:var(--color-selected)}.rs-light span{flex:1}.rs-row{display:flex;gap:5px;margin:5px 0}.rs-row button{flex:1}.rs-render{width:100%;min-height:42px;font-weight:700}.rs-progress{height:5px;background:#333;margin-top:7px}.rs-progress i{display:block;height:100%;background:var(--color-accent);transition:width .1s}.rs-result{text-align:center}.rs-result img{display:block;max-width:100%;max-height:70vh;margin:8px auto;background:repeating-conic-gradient(#777 0 25%,#aaa 0 50%) 0/20px 20px}`;document.head.appendChild(style);RenderStudio.resources.push({delete:()=>style.remove()});};
RenderStudio.installUI = () => {
  window.RenderStudio = RenderStudio;
  RenderStudio.installStyle();
  RenderStudio.mode = new Mode('render',{name:'Render',icon:'photo_camera',selectElements:false,default_tool:'move_tool',condition:()=>!!Project,component:{template:`<div class="rs-workspace"><canvas ref="canvas"></canvas><div class="rs-hud">Render Studio · Drag to orbit · Right-drag to pan · Wheel to zoom</div></div>`,mounted(){RenderStudio.engine=new RenderStudio.Engine(this.$refs.canvas);},beforeDestroy(){if(RenderStudio.engine){RenderStudio.engine.dispose();RenderStudio.engine=null;}}},onSelect(){RenderStudio.restoreModeState();RenderStudio.refreshUI();setTimeout(()=>{if(RenderStudio.engine){RenderStudio.engine.rebuild();RenderStudio.engine.resize();RenderStudio.refreshUI();}},0);},onUnselect(){RenderStudio.captureModeState();}});RenderStudio.resources.push(RenderStudio.mode);
  RenderStudio.scenePanel = new Panel('render_studio_scene',{name:'Render Scene',icon:'wb_sunny',condition:{modes:['render']},growable:true,resizable:true,default_position:{slot:'left_bar',height:450,sidebar_index:0},component:{data(){return{state:RenderStudio.getState()}},methods:{select(l){this.state.selectedLight=l.id;RenderStudio.refreshUI()},add(type){RenderStudio.addLight(type)},del(l){RenderStudio.deleteLight(l.id)},dup(l){RenderStudio.duplicateLight(l.id)},toggle(l){RenderStudio.engine.updateLight(l)}},template:`<div><div class="rs-section"><b>Render Scene</b><div class="rs-light"><i class="material-icons">videocam</i><span>Render Camera</span></div><div class="rs-light"><i class="material-icons">public</i><span>Environment</span></div><div v-for="l in state.lights" :key="l.id" class="rs-light" :class="{selected:l.id===state.selectedLight}" @click="select(l)"><i class="material-icons">{{l.type==='point'?'lightbulb':l.type==='area'?'crop_landscape':'flashlight_on'}}</i><span>{{l.name}}</span><input type="checkbox" v-model="l.enabled" @change.stop="toggle(l)"><button title="Duplicate Light" @click.stop="dup(l)">⧉</button><button title="Delete Light" @click.stop="del(l)"><i class="material-icons">delete</i></button></div></div><div class="rs-section"><div class="rs-row"><button @click="add('point')">Point</button><button @click="add('spot')">Spot</button></div><div class="rs-row"><button @click="add('directional')">Sun</button><button @click="add('area')">Area</button></div></div><details class="rs-section" open><summary>Presets</summary><div class="rs-grid"><button @click="RenderStudio.applyPreset('studio')">Studio</button><button @click="RenderStudio.applyPreset('minecraft')">Minecraft</button><button @click="RenderStudio.applyPreset('dramatic')">Dramatic</button><button @click="RenderStudio.applyPreset('horror')">Horror</button><button @click="RenderStudio.applyPreset('rim')">Rim</button></div></details></div>`}});RenderStudio.resources.push(RenderStudio.scenePanel);
  RenderStudio.settingsPanel = new Panel('render_studio_settings',{name:'Render Properties',icon:'tune',condition:{modes:['render']},growable:true,resizable:true,default_position:{slot:'right_bar',height:600,sidebar_index:0},component:{data(){return{state:RenderStudio.getState(),presets:['512 × 512','1024 × 1024','1920 × 1080','2560 × 1440','3840 × 2160','4096 × 4096']}},watch:{state:{deep:true,handler(){RenderStudio.touch()}}},computed:{light(){return this.state.lights.find(l=>l.id===this.state.selectedLight)},memory(){return RenderStudio.estimateMemory(this.state.output.width,this.state.output.height)},profileMax(){return this.state.performance==='phone'?2048:32768}},methods:{performance(){RenderStudio.applyPerformanceProfile(this.state.performance)},updateLight(){if(this.light)RenderStudio.engine.updateLight(this.light)},point(){if(this.light)RenderStudio.engine.pointAt(this.light,RenderStudio.engine.getBounds().center)},materials(){RenderStudio.engine.rebuildModel()},environment(){RenderStudio.engine.rebuildEnvironment();RenderStudio.engine.rebuildLights()},preset(e){const a=e.target.value.split(/\D+/).filter(Boolean).map(Number);if(a.length===2){const size=RenderStudio.constrainOutput(a[0],a[1],this.state.performance);this.state.output.width=size.width;this.state.output.height=size.height}},render(){RenderStudio.engine.renderImage().catch(e=>{if(e.message!=='Render cancelled')Blockbench.showMessageBox({title:'Render Failed',message:String(e.message||e)});})}},template:`<div>
  <details class="rs-section" open><summary>Performance</summary><label>Device<select v-model="state.performance" @change="performance"><option value="phone">Phone / Low PC</option><option value="pc">PC</option></select></label><small v-if="state.performance==='phone'">30 FPS preview · 60% preview resolution · 512px shadows · 2048px maximum output</small><small v-else>Full-speed preview · full preview resolution · user-selected shadows and output</small></details>
  <details class="rs-section" open v-if="light"><summary>Light · {{light.type}}</summary><div class="rs-grid"><label>Name<input v-model="light.name" @input="updateLight"></label><label>Color<input type="color" v-model="light.color" @input="updateLight"></label><label>Intensity<input type="number" min="0" step="0.1" v-model.number="light.intensity" @input="updateLight"></label><label v-if="light.distance!==undefined">Distance<input type="number" min="0" v-model.number="light.distance" @input="updateLight"></label></div><p>Position</p><div class="rs-grid"><label v-for="(v,i) in light.position">{{'XYZ'[i]}}<input type="number" step="0.25" v-model.number="light.position[i]" @input="updateLight"></label></div><p v-if="light.type!=='point'">Rotation</p><div class="rs-grid" v-if="light.type!=='point'"><label v-for="(v,i) in light.rotation">{{'XYZ'[i]}}<input type="number" step="1" v-model.number="light.rotation[i]" @input="updateLight"></label></div><div class="rs-grid" v-if="light.type==='area'"><label>Width<input type="number" min="0.1" v-model.number="light.width" @change="RenderStudio.engine.rebuildLights()"></label><label>Height<input type="number" min="0.1" v-model.number="light.height" @change="RenderStudio.engine.rebuildLights()"></label></div><div class="rs-grid" v-if="light.type==='spot'"><label>Angle<input type="number" min="1" max="89" v-model.number="light.angle" @input="updateLight"></label><label>Penumbra<input type="number" min="0" max="1" step="0.05" v-model.number="light.penumbra" @input="updateLight"></label></div><label v-if="light.type!=='area'"><input type="checkbox" v-model="light.castShadow" @change="updateLight"> Cast Shadows</label><label v-if="light.type!=='area'">Shadow Resolution<select v-model.number="light.shadowSize" @change="updateLight"><option>512</option><option>1024</option><option>2048</option><option>4096</option></select></label><button @click="point">Point At Model</button><small v-if="light.type==='area'">RectAreaLight is real; Three.js r129 does not support native area-light shadow maps.</small></details>
  <details class="rs-section"><summary>Camera</summary><div class="rs-grid"><label>Projection<select v-model="state.camera.projection" @change="RenderStudio.engine.updateCamera()"><option value="perspective">Perspective</option><option value="orthographic">Orthographic</option></select></label><label>FOV<input type="number" min="1" max="170" v-model.number="state.camera.fov" @input="RenderStudio.engine.updateCamera()"></label></div><div class="rs-row"><button @click="RenderStudio.engine.fromCurrentView()">Current View</button><button @click="RenderStudio.engine.frameModel()">Frame Model</button></div></details>
  <details class="rs-section"><summary>Materials & Shading</summary><label>Mode<select v-model="state.material.mode" @change="materials"><option value="minecraft">Minecraft</option><option value="flat">Flat</option><option value="smooth">Smooth</option><option value="pbr">PBR</option></select></label><div class="rs-grid"><label>Roughness<input type="number" min="0" max="1" step="0.05" v-model.number="state.material.roughness" @change="materials"></label><label>Metalness<input type="number" min="0" max="1" step="0.05" v-model.number="state.material.metalness" @change="materials"></label><label>Emissive<input type="color" v-model="state.material.emissive" @input="materials"></label><label>Strength<input type="number" min="0" step="0.1" v-model.number="state.material.emissiveIntensity" @input="materials"></label></div></details>
  <details class="rs-section"><summary>Environment & Ground</summary><div class="rs-grid"><label>Ambient<input type="number" min="0" step="0.05" v-model.number="state.ambient.intensity" @input="RenderStudio.engine.rebuildLights()"></label><label>Exposure<input type="number" min="0.01" step="0.1" v-model.number="state.environment.exposure"></label><label>Background<select v-model="state.environment.background"><option value="transparent">Transparent</option><option value="solid">Solid</option><option value="gradient">Gradient</option></select></label><label>Color<input type="color" v-model="state.environment.color"></label></div><label><input type="checkbox" v-model="state.ground.enabled" @change="environment"> Ground Plane</label><label><input type="checkbox" v-model="state.ground.shadowCatcher" @change="environment"> Shadow Catcher</label></details>
  <details class="rs-section" open><summary>Output</summary><select @change="preset"><option value="">Preset…</option><option v-for="p in presets">{{p}}</option></select><div class="rs-grid"><label>Width<input type="number" min="16" :max="profileMax" v-model.number="state.output.width"></label><label>Height<input type="number" min="16" :max="profileMax" v-model.number="state.output.height"></label><label>Tile Size<select v-model.number="state.output.tileSize" :disabled="state.performance==='phone'"><option>1024</option><option>2048</option><option>4096</option></select></label><label>Tone Mapping<select v-model="state.environment.toneMapping"><option value="none">None</option><option value="linear">Linear</option><option value="reinhard">Reinhard</option><option value="cineon">Cineon</option><option value="aces">ACES Filmic</option></select></label></div><small>CPU image: {{memory.cpuMB.toFixed(0)}} MB · GPU tile: ~{{memory.gpuMB.toFixed(0)}} MB<br v-if="state.capabilities">GPU max: {{state.capabilities&&state.capabilities.maxTexture}} · safe single: {{state.capabilities&&state.capabilities.safeSingle}}</small><button class="rs-render" @click="render" :disabled="state.render.busy">{{state.render.busy ? state.render.status : 'RENDER IMAGE'}}</button><button v-if="state.render.busy" @click="state.render.cancel=true">Cancel</button><div class="rs-progress" v-if="state.render.busy"><i :style="{width:state.render.progress+'%'}"></i></div></details>
  </div>`}});RenderStudio.resources.push(RenderStudio.settingsPanel);
  RenderStudio.renderAction=new Action('render_studio_render',{name:'Render Image',icon:'photo_camera',condition:{modes:['render']},click:()=>RenderStudio.engine&&RenderStudio.engine.renderImage()});MenuBar.menus.view.addAction(RenderStudio.renderAction);RenderStudio.resources.push(RenderStudio.renderAction);
};
RenderStudio.removeUI = () => {
  if(RenderStudio.engine){RenderStudio.engine.dispose();RenderStudio.engine=null;}
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
