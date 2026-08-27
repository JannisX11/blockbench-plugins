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
