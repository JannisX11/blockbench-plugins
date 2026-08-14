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
    return {webgl2: !!this.renderer.capabilities.isWebGL2, maxTexture, maxRenderbuffer: maxBuffer, safeSingle: Math.min(8192, Math.max(2048, Math.floor(limit / 2))), areaLight: this.areaLightReady};
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
    else if (data.type === 'area' && this.areaLightReady) light = new THREE.RectAreaLight(data.color, data.intensity, data.width, data.height);
    else if (data.type === 'area') { light = new THREE.SpotLight(data.color, data.intensity, 0, Math.PI/3, 0.65, 2); light.userData.renderStudioAreaFallback = true; light.target = new THREE.Object3D(); this.scene.add(light.target); }
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
