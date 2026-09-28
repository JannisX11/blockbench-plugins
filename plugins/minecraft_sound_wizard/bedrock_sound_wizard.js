/*
 * Minecraft Bedrock Sound Wizard
 * Development version: 0.2.0-dev
 *
 * Uses public Blockbench plugin APIs. This is an independent implementation
 * of a wizard-style workflow for Minecraft Bedrock resource-pack sounds.
 */

(function() {
  'use strict';

  const VERSION = '0.2.0-dev';
  const SETTINGS_KEY = 'bedrock_sound_wizard_settings';
  // Blockbench menu/start-screen icons are rendered through Blockbench.getIconNode,
  // which accepts Material/Font Awesome names or image data URLs. Keep the exact
  // generated pixel-art PNG for those UI surfaces; plugin metadata still uses icon.png.
  const ICON_DATA_URL = 'data:image/png;base64,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';
  let fs = null;
  let pathModule = null;

  // Modern Blockbench desktop plugins receive a scoped native-module loader.
  // Older builds may still expose Node's require directly, so keep that as a
  // compatibility fallback. Filesystem access is initialized lazily so simply
  // opening the wizard does not immediately request filesystem permission.
  function ensureNativeFilesystem() {
    if (fs && pathModule) return true;
    if (Blockbench.isWeb) return false;

    try {
      if (typeof requireNativeModule === 'function') {
        fs = requireNativeModule('fs', {
          message: 'Sound Wizard needs filesystem access to discover and update Minecraft Bedrock development packs.'
        });
        pathModule = requireNativeModule('path');
      } else if (typeof require === 'function') {
        fs = require('fs');
        pathModule = require('path');
      }
    } catch (e) {
      fs = null;
      pathModule = null;
    }

    return !!(fs && pathModule);
  }

  // Exact uploaded landing artwork, embedded so the wizard does not need runtime filesystem access.
  // The PNG remains 1920x1080; embedding it avoids the Vue initialization failure from the previous asset-loading attempt.
  const LANDING_BACKGROUND_DATA_URL = 'data:image/avif;base64,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';

  const BSW = {
    rpPath: '',
    rpName: '',
    soundPath: '',
    soundName: '',
    soundBuffer: null,
    eventFiles: {},
    action: null,
    dialog: null,
    menu: null,
    loader: null,
    formatPageStyles: null,
    loaderRefreshListener: null
  };

  function settings() {
    return Blockbench.getWebPreferences ? (Blockbench.getWebPreferences(SETTINGS_KEY) || {}) : {};
  }

  function saveSettings() {
    if (Blockbench.setWebPreferences) {
      Blockbench.setWebPreferences(SETTINGS_KEY, {
        rpPath: BSW.rpPath,
        rpName: BSW.rpName
      });
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalizePath(path) {
    return String(path || '').replace(/\\/g, '/').replace(/\/$/, '');
  }

  function joinPath() {
    return Array.from(arguments).map(normalizePath).filter(Boolean).join('/');
  }

  function fileName(path) {
    const p = normalizePath(path);
    return p.substring(p.lastIndexOf('/') + 1);
  }

  function baseName(path) {
    return fileName(path).replace(/\.[^.]+$/, '');
  }

  function isValidIdentifier(value) {
    return /^[a-z0-9_./-]+$/i.test(value || '');
  }

  function parseJson(text, fallback) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return fallback;
    }
  }

  function isSafeRelativePath(value) {
    const normalized = normalizePath(value);
    if (!normalized || normalized.startsWith('/') || /^[a-zA-Z]:\//.test(normalized)) return false;
    const parts = normalized.split('/');
    return !parts.some(part => part === '..');
  }

  function readText(filePath, callback) {
    if (fs) {
      try {
        callback(null, fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        callback(e, null);
      }
      return;
    }
    Blockbench.readFile(filePath, { readtype: 'text' }, files => {
      if (!files || !files[0]) return callback(new Error('File could not be read.'), null);
      callback(null, files[0].content);
    });
  }

  function ensureDirectory(dirPath) {
    if (fs && pathModule) fs.mkdirSync(dirPath, { recursive: true });
  }

  function writeText(filePath, content, callback) {
    try {
      if (fs) {
        ensureDirectory(pathModule.dirname(filePath));
        fs.writeFileSync(filePath, content, 'utf8');
        (callback || function() {})(null);
      } else {
        Blockbench.writeFile(filePath, { content: content }, callback || function() {});
      }
    } catch (e) {
      (callback || function() {})(e);
    }
  }

  function chooseResourcePack() {
    if (!Blockbench.pickDirectory) {
      Blockbench.showMessageBox({
        title: 'Resource Pack Selection',
        message: 'This Blockbench version does not expose directory selection.'
      });
      return;
    }

    Blockbench.pickDirectory({ title: 'Select a Minecraft Bedrock Resource Pack' }, path => {
      if (!path) return;

      const manifest = joinPath(path, 'manifest.json');
      readText(manifest, (err, text) => {
        const data = parseJson(text, null);
        if (err || !data) {
          Blockbench.showMessageBox({
            title: 'Invalid Resource Pack',
            message: 'The selected folder does not contain a readable manifest.json.'
          });
          return;
        }

        BSW.rpPath = normalizePath(path);
        BSW.rpName = data.header && data.header.name
          ? String(data.header.name)
          : fileName(path);

        saveSettings();
        updateDialog();
        Blockbench.showStatusMessage('Resource Pack selected: ' + BSW.rpName, 2000);
      });
    });
  }

  function chooseSound() {
    if (!Blockbench.import) {
      Blockbench.showMessageBox({
        title: 'Sound Selection',
        message: 'This Blockbench version does not expose the sound import API.'
      });
      return;
    }

    Blockbench.import({
      type: 'Sound',
      extensions: ['ogg'],
      multiple: false,
      readtype: 'binary',
      title: 'Select .ogg Sound',
      resource_id: 'bedrock_sound_wizard_ogg'
    }, files => {
      const f = files && files[0];
      if (!f) return;

      BSW.soundPath = f.path || '';
      BSW.soundName = fileName(BSW.soundPath) || f.name || 'sound.ogg';
      BSW.soundBuffer = f.content || f.data || null;
      updateDialog();
    });
  }

  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function copySound(destination, callback) {
    try {
      if (fs && BSW.soundPath && fs.existsSync(BSW.soundPath)) {
        ensureDirectory(pathModule.dirname(destination));
        fs.copyFileSync(BSW.soundPath, destination);
        callback(null);
        return;
      }

      if (!BSW.soundBuffer) {
        callback(new Error('No sound data was returned by Blockbench.'));
        return;
      }

      if (fs) {
        ensureDirectory(pathModule.dirname(destination));
        const data = Buffer.isBuffer(BSW.soundBuffer)
          ? BSW.soundBuffer
          : Buffer.from(BSW.soundBuffer);
        fs.writeFileSync(destination, data);
        callback(null);
      } else {
        Blockbench.writeFile(destination, {
          content: BSW.soundBuffer
        }, callback || function() {});
      }
    } catch (e) {
      callback(e);
    }
  }

  function addSound() {
    if (!BSW.rpPath) {
      Blockbench.showMessageBox({ title: 'Resource Pack Required', message: 'Select a Bedrock Resource Pack first.' });
      return;
    }

    if (!BSW.soundBuffer) {
      Blockbench.showMessageBox({ title: 'Sound Required', message: 'Upload/select an .ogg sound first.' });
      return;
    }

    const namespace = getValue('bsw_namespace') || 'custom';
    const soundId = getValue('bsw_sound_id') || baseName(BSW.soundName);
    const audioFolder = getValue('bsw_audio_folder') || 'sounds';
    const category = getValue('bsw_category') || 'neutral';
    const volume = parseFloat(getValue('bsw_volume') || '1');
    const pitch = parseFloat(getValue('bsw_pitch') || '1');

    if (!isValidIdentifier(namespace) || !isValidIdentifier(soundId)) {
      Blockbench.showMessageBox({
        title: 'Invalid Identifier',
        message: 'Namespace and Sound ID may only contain letters, numbers, underscores, dots, slashes, and hyphens.'
      });
      return;
    }

    if (!/\.ogg$/i.test(BSW.soundName)) {
      Blockbench.showMessageBox({
        title: 'Invalid Sound File',
        message: 'The selected sound must be an .ogg file.'
      });
      return;
    }

    if (!isSafeRelativePath(audioFolder) || !isSafeRelativePath(BSW.soundName)) {
      Blockbench.showMessageBox({
        title: 'Invalid Audio Path',
        message: 'The audio folder and filename must stay inside the selected resource pack.'
      });
      return;
    }

    if (!isFinite(volume) || !isFinite(pitch)) {
      Blockbench.showMessageBox({
        title: 'Invalid Sound Settings',
        message: 'Volume and pitch must be valid numbers.'
      });
      return;
    }

    const soundKey = namespace + ':' + soundId;
    const relativeAudio = joinPath(audioFolder, BSW.soundName);
    const destination = joinPath(BSW.rpPath, relativeAudio);
    const definitionPath = joinPath(BSW.rpPath, 'sounds', 'sound_definitions.json');

    readText(definitionPath, (err, text) => {
      if (!err && text && parseJson(text, null) === null) {
        Blockbench.showMessageBox({
          title: 'Invalid sound_definitions.json',
          message: 'The existing sound_definitions.json contains invalid JSON. No files were changed.'
        });
        return;
      }

      let definitions = parseJson(text || '', { format_version: '1.14.0', sound_definitions: {} });
      if (!definitions || typeof definitions !== 'object') {
        definitions = { format_version: '1.14.0', sound_definitions: {} };
      }
      if (!definitions.sound_definitions || typeof definitions.sound_definitions !== 'object') {
        definitions.sound_definitions = {};
      }

      const exists = Object.prototype.hasOwnProperty.call(definitions.sound_definitions, soundKey);
      const save = () => {
        definitions.sound_definitions[soundKey] = {
          category: category,
          sounds: [
            {
              name: relativeAudio.replace(/\.ogg$/i, ''),
              volume: isFinite(volume) ? volume : 1,
              pitch: isFinite(pitch) ? pitch : 1
            }
          ]
        };

        const json = JSON.stringify(definitions, null, 2) + '\n';

        copySound(destination, copyErr => {
          if (copyErr) {
            Blockbench.showMessageBox({
              title: 'Sound Copy Failed',
              message: copyErr.message || String(copyErr)
            });
            return;
          }

          writeText(definitionPath, json, writeErr => {
            if (writeErr) {
              Blockbench.showMessageBox({
                title: 'Definition Write Failed',
                message: writeErr.message || String(writeErr)
              });
              return;
            }
            const integration = integrateSound(soundKey);
            if (!integration.ok) {
              Blockbench.showMessageBox({
                title: 'Sound Added, Integration Failed',
                message: integration.error ? integration.error.message : 'The sound was created, but the target file could not be updated.'
              });
            } else if (integration.integrated) {
              Blockbench.showStatusMessage('Sound added and linked: ' + soundKey, 3000);
            } else {
              Blockbench.showStatusMessage('Sound added: ' + soundKey, 3000);
            }
            updateDialog();
          });
        });
      };

      if (exists) {
        Blockbench.showMessageBox({
          title: 'Sound Already Exists',
          message: 'The sound identifier "' + soundKey + '" already exists. Replace it?',
          buttons: ['Replace', 'Cancel'],
          defaultButton: 0,
          cancelButton: 1
        }, result => {
          if (result === 0) save();
        });
      } else {
        save();
      }
    });
  }

  function readJsonFile(filePath) {
    if (!fs) return null;
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return null;
    }
  }

  function findClientEntityFile(entityId) {
    if (!fs || !pathModule || !entityId) return null;
    const root = pathModule.join(BSW.rpPath, 'entity');
    if (!fs.existsSync(root)) return null;
    const walk = dir => {
      let entries;
      try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return null; }
      for (const entry of entries) {
        const full = pathModule.join(dir, entry.name);
        if (entry.isDirectory()) {
          const found = walk(full);
          if (found) return found;
        } else if (/\.json$/i.test(entry.name)) {
          const data = readJsonFile(full);
          const desc = data && data['minecraft:client_entity'] && data['minecraft:client_entity'].description;
          if (desc && desc.identifier === entityId) return full;
        }
      }
      return null;
    };
    return walk(root);
  }

  function integrateEntitySound(soundKey) {
    const entity = getValue('bsw_entity_id');
    const slot = getValue('bsw_entity_slot') || 'ambient';
    if (!entity) return { ok: true, skipped: true };
    if (!fs || !pathModule) {
      generateEntitySnippet(soundKey);
      return { ok: true, snippet: true };
    }
    const filePath = findClientEntityFile(entity);
    if (!filePath) {
      generateEntitySnippet(soundKey);
      return { ok: true, snippet: true };
    }
    try {
      const data = readJsonFile(filePath);
      const root = data && data['minecraft:client_entity'];
      const description = root && root.description;
      if (!description || typeof description !== 'object') throw new Error('Client entity JSON has no valid description object.');
      if (!description.sound_effects || typeof description.sound_effects !== 'object' || Array.isArray(description.sound_effects)) {
        description.sound_effects = {};
      }
      description.sound_effects[slot] = soundKey;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      return { ok: true, integrated: true, filePath };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  function integrateBlockSound(soundKey) {
    const blockId = getValue('bsw_block_id');
    if (!blockId) return { ok: true, skipped: true };
    if (!fs || !pathModule) return { ok: false, error: new Error('Direct block integration requires desktop filesystem access.') };
    const blocksPath = pathModule.join(BSW.rpPath, 'blocks.json');
    let data = { format_version: '1.19.30' };
    if (fs.existsSync(blocksPath)) {
      data = readJsonFile(blocksPath);
      if (!data || typeof data !== 'object') return { ok: false, error: new Error('Existing blocks.json contains invalid JSON.') };
    }
    data.format_version = data.format_version || '1.19.30';
    data[blockId] = data[blockId] && typeof data[blockId] === 'object' ? data[blockId] : {};
    data[blockId].sound = soundKey;
    try {
      fs.writeFileSync(blocksPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      return { ok: true, integrated: true, filePath: blocksPath };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  function integrateSound(soundKey) {
    const target = getValue('bsw_integration_target') || 'none';
    if (target === 'entity') return integrateEntitySound(soundKey);
    if (target === 'block') return integrateBlockSound(soundKey);
    return { ok: true, skipped: true };
  }

  function generateEntitySnippet(soundKey) {
    const entity = getValue('bsw_entity_id');
    const slot = getValue('bsw_entity_slot') || 'ambient';
    if (!entity) return;

    const snippet = {
      _generated_by: 'Minecraft Bedrock Sound Wizard ' + VERSION,
      _note: 'Merge sound_effects into the client entity JSON.',
      entity: entity,
      sound_effects: {}
    };
    snippet.sound_effects[slot] = soundKey;

    const out = joinPath(BSW.rpPath, 'sound_wizard', entity.replace(/[^a-z0-9_.-]/gi, '_') + '.json');
    writeText(out, JSON.stringify(snippet, null, 2) + '\n');
  }


  const ENTITY_SOUND_EVENTS = [
    ['ambient', 'Idle / Ambient'],
    ['hurt', 'Hurt / Damage'],
    ['death', 'Death'],
    ['step', 'Step'],
    ['attack', 'Attack'],
    ['attack.strong', 'Strong Attack'],
    ['shoot', 'Shoot'],
    ['jump', 'Jump'],
    ['fall.small', 'Small Fall'],
    ['fall.big', 'Big Fall'],
    ['swim', 'Swim'],
    ['splash', 'Splash'],
    ['eat', 'Eat'],
    ['drink', 'Drink'],
    ['growl', 'Growl'],
    ['roar', 'Roar'],
    ['panic', 'Panic'],
    ['warn', 'Warn'],
    ['sleep', 'Sleep'],
    ['stare', 'Stare'],
    ['sniff', 'Sniff'],
    ['sneeze', 'Sneeze']
  ];

  const BLOCK_SOUND_EVENTS = [
    ['break', 'Break'],
    ['hit', 'Hit / Mine'],
    ['place', 'Place'],
    ['step', 'Step'],
    ['fall', 'Fall'],
    ['jump', 'Jump'],
    ['land', 'Land'],
    ['item.use.on', 'Use on Block'],
    ['door.open', 'Door Open'],
    ['door.close', 'Door Close'],
    ['button.click_on', 'Button On'],
    ['button.click_off', 'Button Off'],
    ['power.on', 'Power On'],
    ['power.off', 'Power Off']
  ];

  // Native custom item sound support is available for current Bedrock item
  // formats. These map directly to documented item sound components:
  // minecraft:swing_sounds and minecraft:use_modifiers.start_sound.
  const ITEM_SOUND_EVENTS = [
    ['attack_hit', 'Attack Hit'],
    ['attack_miss', 'Attack Miss'],
    ['attack_critical_hit', 'Critical Hit'],
    ['use', 'Use Start']
  ];

  function jsonRead(filePath, fallback) {
    if (!fs || !fs.existsSync(filePath)) return fallback;
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return null;
    }
  }

  function jsonWrite(filePath, data) {
    if (!fs || !pathModule) throw new Error('Desktop filesystem access is required for this wizard.');
    ensureDirectory(pathModule.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  function safeDirectoryEntries(root) {
    if (!fs || !root || !fs.existsSync(root)) return [];
    try {
      return fs.readdirSync(root, { withFileTypes: true });
    } catch (e) {
      return [];
    }
  }

  function walkJsonFiles(root, callback) {
    for (const entry of safeDirectoryEntries(root)) {
      const full = pathModule.join(root, entry.name);
      if (entry.isDirectory()) {
        walkJsonFiles(full, callback);
      } else if (/\.json$/i.test(entry.name)) {
        callback(full);
      }
    }
  }

  function getPackIconDataUrl(packPath, fallbackPaths) {
    if (!fs || !pathModule || !packPath) return '';

    // Bedrock packs normally use pack_icon.png. Keep the legacy icon.png
    // fallback as well, and support common image extensions so development
    // packs with a non-PNG icon do not silently fall back to a folder glyph.
    const candidates = [
      'pack_icon.png',
      'icon.png',
      'pack_icon.jpg',
      'pack_icon.jpeg',
      'pack_icon.webp',
      'icon.jpg',
      'icon.jpeg',
      'icon.webp'
    ];
    const roots = [packPath].concat(Array.isArray(fallbackPaths) ? fallbackPaths : []);

    for (const root of roots) {
      if (!root) continue;
      for (const name of candidates) {
        const iconPath = pathModule.join(root, name);
        try {
          if (!fs.existsSync(iconPath) || !fs.statSync(iconPath).isFile()) continue;

          const ext = pathModule.extname(name).toLowerCase();
          const mime = ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : ext === '.webp'
              ? 'image/webp'
              : 'image/png';
          const base64 = fs.readFileSync(iconPath).toString('base64');
          return 'data:' + mime + ';base64,' + base64;
        } catch (e) {}
      }
    }

    return '';
  }

  function manifestInfo(packPath) {
    const manifestPath = pathModule.join(packPath, 'manifest.json');
    const data = jsonRead(manifestPath, null);
    if (!data || !data.header) return null;
    const moduleUuids = Array.isArray(data.modules) ? data.modules.map(m => m && m.uuid).filter(Boolean) : [];
    return {
      path: normalizePath(packPath),
      name: typeof data.header.name === 'string' ? data.header.name : fileName(packPath),
      uuid: data.header.uuid || '',
      moduleUuids,
      manifest: data,
      iconDataUrl: getPackIconDataUrl(packPath)
    };
  }

  function developmentResourcePackRoots() {
    if (!ensureNativeFilesystem() || !pathModule) return [];

    const roots = [];
    const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
    let home = env.USERPROFILE || env.HOME || '';

    // Blockbench's native-module sandbox does not always expose process.env,
    // so use Node's OS module when available as a second way to locate the
    // current user's Windows profile.
    if (!home && typeof requireNativeModule === 'function') {
      try {
        const os = requireNativeModule('os');
        if (os && typeof os.homedir === 'function') home = os.homedir();
      } catch (e) {}
    }

    const appData = env.APPDATA || (home ? pathModule.join(home, 'AppData', 'Roaming') : '');
    const localAppData = env.LOCALAPPDATA || (home ? pathModule.join(home, 'AppData', 'Local') : '');

    if (appData) {
      roots.push(pathModule.join(appData, 'Minecraft Bedrock', 'users', 'shared', 'games', 'com.mojang', 'development_resource_packs'));
      roots.push(pathModule.join(appData, 'Minecraft Bedrock Preview', 'users', 'shared', 'games', 'com.mojang', 'development_resource_packs'));
      roots.push(pathModule.join(appData, 'Minecraft Preview', 'users', 'shared', 'games', 'com.mojang', 'development_resource_packs'));
    }

    if (localAppData) {
      roots.push(pathModule.join(localAppData, 'Packages', 'Microsoft.MinecraftUWP_8wekyb3d8bbwe', 'LocalState', 'games', 'com.mojang', 'development_resource_packs'));
      roots.push(pathModule.join(localAppData, 'Packages', 'Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe', 'LocalState', 'games', 'com.mojang', 'development_resource_packs'));

      // Package identifiers can vary between the retail game, Preview, and
      // other Bedrock distributions. Discover Minecraft packages instead of
      // relying only on two hard-coded package names.
      try {
        const packagesRoot = pathModule.join(localAppData, 'Packages');
        if (fs.existsSync(packagesRoot) && fs.statSync(packagesRoot).isDirectory()) {
          for (const entry of safeDirectoryEntries(packagesRoot)) {
            if (!entry.isDirectory() || !/minecraft/i.test(entry.name)) continue;
            const candidate = pathModule.join(
              packagesRoot, entry.name, 'LocalState', 'games', 'com.mojang',
              'development_resource_packs'
            );
            roots.push(candidate);
          }
        }
      } catch (e) {}
    }

    // Also support a standard com.mojang path supplied through a custom
    // Minecraft Bedrock installation/launcher without requiring manual browse.
    const candidateComMojang = [
      env.MINECRAFT_COM_MOJANG,
      env.MINECRAFT_BEDROCK_COM_MOJANG
    ].filter(Boolean);
    for (const comMojang of candidateComMojang) {
      roots.push(pathModule.join(comMojang, 'development_resource_packs'));
    }

    return Array.from(new Set(roots))
      .filter(root => fs && fs.existsSync(root) && fs.statSync(root).isDirectory());
  }

  function findMatchingBehaviorPack(rpInfo, behaviorPacks) {
    if (!rpInfo) return null;
    for (const bp of behaviorPacks) {
      const deps = Array.isArray(bp.manifest.dependencies) ? bp.manifest.dependencies : [];
      const depUuids = deps.map(d => d && d.uuid).filter(Boolean);
      if (rpInfo.uuid && depUuids.includes(rpInfo.uuid)) return bp;
      if (rpInfo.moduleUuids.some(uuid => depUuids.includes(uuid))) return bp;
      if (bp.name === rpInfo.name) return bp;
    }
    return null;
  }

  function scanDevelopmentPacks() {
    if (!fs || !pathModule) return [];
    const results = [];
    for (const rpRoot of developmentResourcePackRoots()) {
      const parent = pathModule.dirname(rpRoot);
      const bpRoot = pathModule.join(parent, 'development_behavior_packs');
      const behaviorPacks = safeDirectoryEntries(bpRoot)
        .filter(e => e.isDirectory())
        .map(e => manifestInfo(pathModule.join(bpRoot, e.name)))
        .filter(Boolean);

      for (const entry of safeDirectoryEntries(rpRoot)) {
        if (!entry.isDirectory()) continue;
        const info = manifestInfo(pathModule.join(rpRoot, entry.name));
        if (!info) continue;
        const behavior = findMatchingBehaviorPack(info, behaviorPacks);
        results.push({
          id: info.path,
          name: info.name,
          path: info.path,
          behaviorPath: behavior ? behavior.path : '',
          behaviorName: behavior ? behavior.name : '',
          // Prefer the resource-pack icon. If the RP has no icon, use the
          // linked behavior-pack icon as a fallback so the selected addon still
          // displays the artwork associated with it.
          iconDataUrl: info.iconDataUrl || (behavior ? getPackIconDataUrl(behavior.path) : ''),
          root: rpRoot
        });
      }
    }
    const unique = {};
    results.forEach(pack => { unique[pack.path] = pack; });
    return Object.values(unique).sort((a, b) => a.name.localeCompare(b.name));
  }

  function scanEntities(pack) {
    const assets = [];
    const root = pathModule.join(pack.path, 'entity');
    walkJsonFiles(root, filePath => {
      const data = jsonRead(filePath, null);
      const desc = data && data['minecraft:client_entity'] && data['minecraft:client_entity'].description;
      if (desc && desc.identifier) {
        assets.push({
          id: desc.identifier,
          name: desc.identifier.split(':').pop(),
          type: 'entity',
          filePath,
          hasSoundEffects: !!desc.sound_effects
        });
      }
    });
    return assets.sort((a, b) => a.id.localeCompare(b.id));
  }

  function scanBlocks(pack) {
    const assets = [];
    const seen = {};
    const add = (id, filePath, source) => {
      if (!id || seen[id]) return;
      seen[id] = true;
      assets.push({
        id,
        name: id.split(':').pop(),
        type: 'block',
        filePath: filePath || '',
        source
      });
    };

    const blocksPath = pathModule.join(pack.path, 'blocks.json');
    const blocks = jsonRead(blocksPath, null);
    if (blocks && typeof blocks === 'object') {
      Object.keys(blocks).forEach(key => {
        if (key === 'format_version') return;
        if (/^[^:]+:[^:]+$/.test(key)) add(key, blocksPath, 'blocks.json');
      });
    }

    if (pack.behaviorPath) {
      const root = pathModule.join(pack.behaviorPath, 'blocks');
      walkJsonFiles(root, filePath => {
        const data = jsonRead(filePath, null);
        const block = data && data['minecraft:block'];
        const id = block && block.description && block.description.identifier;
        if (id) add(id, filePath, 'behavior');
      });
    }

    return assets.sort((a, b) => a.id.localeCompare(b.id));
  }

  function scanItems(pack) {
    const assets = [];
    if (!pack.behaviorPath) return assets;
    const root = pathModule.join(pack.behaviorPath, 'items');
    walkJsonFiles(root, filePath => {
      const data = jsonRead(filePath, null);
      const item = data && data['minecraft:item'];
      const id = item && item.description && item.description.identifier;
      if (id) {
        assets.push({
          id,
          name: id.split(':').pop(),
          type: 'item',
          filePath,
          source: 'behavior'
        });
      }
    });
    return assets.sort((a, b) => a.id.localeCompare(b.id));
  }

  function scanAssetsForPack(pack, type) {
    if (type === 'entity') return scanEntities(pack);
    if (type === 'block') return scanBlocks(pack);
    if (type === 'item') return scanItems(pack);
    return [];
  }

  function wizardEventsForType(type) {
    if (type === 'entity') return ENTITY_SOUND_EVENTS;
    if (type === 'block') return BLOCK_SOUND_EVENTS;
    return ITEM_SOUND_EVENTS;
  }

  function makeWizardEvents(type, asset) {
    return wizardEventsForType(type).map(pair => ({
      id: pair[0],
      label: pair[1],
      fileName: '',
      soundId: '',
      volume: 1,
      pitch: 1,
      enabled: false
    }));
  }

  function packRecordFromFolder(packPath, resourceRoot) {
    const info = manifestInfo(packPath);
    if (!info) return null;

    let behaviorPath = '';
    let behaviorName = '';

    if (pathModule && fs) {
      const parent = pathModule.dirname(resourceRoot || packPath);
      const behaviorRoot = pathModule.join(parent, 'development_behavior_packs');
      if (fs.existsSync(behaviorRoot)) {
        const behaviorPacks = safeDirectoryEntries(behaviorRoot)
          .filter(entry => entry.isDirectory())
          .map(entry => manifestInfo(pathModule.join(behaviorRoot, entry.name)))
          .filter(Boolean);
        const behavior = findMatchingBehaviorPack(info, behaviorPacks);
        if (behavior) {
          behaviorPath = behavior.path;
          behaviorName = behavior.name;
        }
      }
    }

    const behavior = behaviorPath ? { path: behaviorPath } : null;
    return {
      id: info.path,
      name: info.name,
      path: info.path,
      behaviorPath,
      behaviorName,
      // Keep the same icon behavior for manually selected folders as for
      // automatically discovered development packs.
      iconDataUrl: info.iconDataUrl || (behavior ? getPackIconDataUrl(behavior.path) : ''),
      root: resourceRoot || pathModule.dirname(packPath)
    };
  }

  function scanPackRoot(root) {
    if (!ensureNativeFilesystem() || !pathModule || !fs.existsSync(root)) return [];

    const packs = [];
    for (const entry of safeDirectoryEntries(root)) {
      if (!entry.isDirectory()) continue;
      const pack = packRecordFromFolder(pathModule.join(root, entry.name), root);
      if (pack) packs.push(pack);
    }

    return packs.sort((a, b) => a.name.localeCompare(b.name));
  }

  function chooseDevelopmentFolder(vm) {
    if (!Blockbench.pickDirectory) return;

    ensureNativeFilesystem();

    const knownRoots = developmentResourcePackRoots();
    const selected = Blockbench.pickDirectory({
      title: 'Select Minecraft Bedrock development resource packs',
      startpath: knownRoots[0] || undefined,
      resource_id: 'bedrock_sound_wizard_development_packs'
    });

    // Current Blockbench returns the selected path directly. The previous
    // callback-based implementation opened the dialog but did not receive the
    // selected folder on current desktop builds.
    if (!selected) return;

    if (!ensureNativeFilesystem() || !pathModule) {
      Blockbench.showMessageBox({
        title: 'Filesystem Access Required',
        message: 'Sound Wizard could not access the selected folder. Reload the plugin and allow its filesystem permission when prompted.'
      });
      return;
    }

    const normalized = normalizePath(selected);

    // The user may select:
    // 1. development_resource_packs itself,
    // 2. the com.mojang folder containing it,
    // 3. an individual resource-pack folder, or
    // 4. any parent folder containing resource-pack folders.
    const selectedManifest = manifestInfo(normalized);
    if (selectedManifest) {
      const pack = packRecordFromFolder(normalized, pathModule.dirname(normalized));
      vm.packs = pack ? [pack] : [];
      vm.packRootLabel = normalized;
      if (!vm.packs.length) {
        Blockbench.showMessageBox({
          title: 'Invalid Resource Pack',
          message: 'The selected folder contains a manifest.json, but it could not be read as a Bedrock resource pack.'
        });
      }
      return;
    }

    let root = normalized;
    const base = pathModule.basename(root).toLowerCase();

    if (base !== 'development_resource_packs') {
      const candidate = pathModule.join(root, 'development_resource_packs');
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        root = candidate;
      }
    }

    let packs = scanPackRoot(root);

    // If the selected folder is a parent such as Downloads, also allow it to
    // contain pack folders directly instead of requiring a folder literally
    // named development_resource_packs.
    if (!packs.length && root === normalized) {
      packs = scanPackRoot(normalized);
    }

    vm.packs = packs;
    vm.packRootLabel = root;

    if (!packs.length) {
      Blockbench.showMessageBox({
        title: 'No Resource Packs Found',
        message: 'No Bedrock resource packs with a readable manifest.json were found in the selected folder. You can select development_resource_packs, com.mojang, or an individual resource-pack folder.'
      });
    }
  }

  function selectEventSound(vm, eventId) {
    if (!Blockbench.import) return;
    Blockbench.import({
      type: 'Sound',
      extensions: ['ogg'],
      multiple: false,
      readtype: 'binary',
      title: 'Select .ogg for ' + eventId,
      resource_id: 'bedrock_sound_wizard_event_' + eventId.replace(/[^a-z0-9_]/gi, '_')
    }, files => {
      const f = files && files[0];
      if (!f) return;
      const name = fileName(f.path || f.name || 'sound.ogg');
      const event = vm.events.find(item => item.id === eventId);
      if (!event) return;
      event.fileName = name;
      event.enabled = true;
      BSW.eventFiles[eventId] = {
        path: f.path || '',
        name,
        buffer: f.content || f.data || null
      };
    });
  }

  function previewEventSound(eventId) {
    const file = BSW.eventFiles[eventId];
    if (!file || !file.path) {
      Blockbench.showMessageBox({ title: 'Preview', message: 'Select a sound file first.' });
      return;
    }
    try {
      if (typeof Audio === 'function') {
        const audio = new Audio();
        audio.src = file.path;
        audio.volume = 1;
        audio.play().catch(() => {});
      } else {
        Blockbench.showStatusMessage('Sound preview is unavailable in this Blockbench environment.', 2500);
      }
    } catch (e) {
      Blockbench.showStatusMessage('Sound preview is unavailable for this file.', 2500);
    }
  }

  function eventSoundDefinitionKey(assetId, eventId) {
    const clean = assetId.replace(/[^a-z0-9:_.-]/gi, '_');
    return clean + '.' + eventId.replace(/[^a-z0-9_.-]/gi, '_');
  }

  function versionAtLeast(version, required) {
    const a = String(version || '0.0.0').split('.').map(Number);
    const b = String(required || '0.0.0').split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const av = Number.isFinite(a[i]) ? a[i] : 0;
      const bv = Number.isFinite(b[i]) ? b[i] : 0;
      if (av !== bv) return av > bv;
    }
    return true;
  }

  function prepareItemSoundIntegration(asset, configured) {
    if (!asset || asset.type !== 'item') return null;
    if (!asset.filePath || !fs || !pathModule) {
      throw new Error('The selected item does not have an accessible behavior-pack JSON file.');
    }

    const itemData = jsonRead(asset.filePath, null);
    if (!itemData || typeof itemData !== 'object') {
      throw new Error('The selected item JSON contains invalid JSON.');
    }

    const itemRoot = itemData['minecraft:item'];
    if (!itemRoot || typeof itemRoot !== 'object') {
      throw new Error('The selected file is not a valid minecraft:item definition.');
    }

    const formatVersion = itemData.format_version;
    if (!versionAtLeast(formatVersion, '1.26.50')) {
      // Never change an existing item's format_version automatically. A format
      // upgrade can change how Minecraft parses the entire item definition and
      // can make an otherwise working item invalid or unusable.
      throw new Error(
        'Custom item sound events are only enabled by Sound Wizard for item format_version 1.26.50 or newer. ' +
        'Your item uses ' + (formatVersion || 'an unknown version') + '. ' +
        'Sound Wizard will not modify this item.'
      );
    }

    if (!itemRoot.components || typeof itemRoot.components !== 'object' || Array.isArray(itemRoot.components)) {
      itemRoot.components = {};
    }

    const swing = itemRoot.components['minecraft:swing_sounds'] &&
      typeof itemRoot.components['minecraft:swing_sounds'] === 'object' &&
      !Array.isArray(itemRoot.components['minecraft:swing_sounds'])
        ? itemRoot.components['minecraft:swing_sounds']
        : {};

    const useModifiers = itemRoot.components['minecraft:use_modifiers'] &&
      typeof itemRoot.components['minecraft:use_modifiers'] === 'object' &&
      !Array.isArray(itemRoot.components['minecraft:use_modifiers'])
        ? itemRoot.components['minecraft:use_modifiers']
        : null;

    const result = {
      itemData,
      swing,
      useModifiers,
      writesSwing: false,
      writesUse: false
    };

    configured.forEach(event => {
      const soundKey = event.soundId || eventSoundDefinitionKey(asset.id, event.id);
      if (event.id === 'attack_hit') {
        swing.attack_hit = soundKey;
        result.writesSwing = true;
      } else if (event.id === 'attack_miss') {
        swing.attack_miss = soundKey;
        result.writesSwing = true;
      } else if (event.id === 'attack_critical_hit') {
        swing.attack_critical_hit = soundKey;
        result.writesSwing = true;
      } else if (event.id === 'use') {
        if (!useModifiers) {
          throw new Error(
            'The selected item does not already have minecraft:use_modifiers. ' +
            'Use Start sound integration is intentionally not added automatically because creating ' +
            'use_modifiers can change the item\'s use behavior.'
          );
        }
        useModifiers.start_sound = soundKey;
        result.writesUse = true;
      }
    });

    if (result.writesSwing) itemRoot.components['minecraft:swing_sounds'] = swing;
    if (result.writesUse) itemRoot.components['minecraft:use_modifiers'] = useModifiers;

    return result;
  }

  // Item sound components resolve named sound events from the resource pack.
  // Registering a matching individual event in sounds.json as well as the
  // underlying sound_definitions entry mirrors the way current vanilla item
  // events are wired and gives older/current sound-event lookup paths the same
  // named event. This does not replace any broad vanilla event.
  function registerItemSoundEvent(sounds, definitionKey, volume, pitch) {
    if (!sounds.individual_event_sounds || typeof sounds.individual_event_sounds !== 'object' || Array.isArray(sounds.individual_event_sounds)) {
      sounds.individual_event_sounds = {};
    }
    if (!sounds.individual_event_sounds.events || typeof sounds.individual_event_sounds.events !== 'object' || Array.isArray(sounds.individual_event_sounds.events)) {
      sounds.individual_event_sounds.events = {};
    }

    sounds.individual_event_sounds.events[definitionKey] = {
      sound: definitionKey,
      volume: Number.isFinite(Number(volume)) ? Number(volume) : 1,
      pitch: Number.isFinite(Number(pitch)) ? Number(pitch) : 1
    };
  }

  function applyWizard(vm) {
    const pack = vm.selectedPack;
    const asset = vm.selectedAsset;
    if (!pack || !asset) return;

    const configured = vm.events.filter(event => event.enabled && BSW.eventFiles[event.id]);
    if (!configured.length) {
      Blockbench.showMessageBox({ title: 'No Sounds Selected', message: 'Add at least one .ogg file to an action before applying the wizard.' });
      return;
    }

    if (!fs || !pathModule) {
      Blockbench.showMessageBox({ title: 'Desktop Only', message: 'Applying directly to development packs requires Blockbench desktop filesystem access.' });
      return;
    }

    // Validate the item-side JSON before touching the resource pack. This keeps
    // failed item integrations from leaving behind partial sound files.
    const itemIntegration = asset.type === 'item'
      ? prepareItemSoundIntegration(asset, configured)
      : null;

    const namespace = asset.id.includes(':') ? asset.id.split(':')[0] : 'custom';
    const assetName = asset.id.includes(':') ? asset.id.split(':').slice(1).join(':') : asset.id;
    const soundsDir = pathModule.join(pack.path, 'sounds', namespace, assetName);
    const definitionsPath = pathModule.join(pack.path, 'sounds', 'sound_definitions.json');
    const soundsJsonPath = pathModule.join(pack.path, 'sounds.json');

    let definitions = jsonRead(definitionsPath, { format_version: '1.14.0', sound_definitions: {} });
    if (definitions === null) {
      Blockbench.showMessageBox({ title: 'Invalid sound_definitions.json', message: 'The existing sound_definitions.json contains invalid JSON. No files were changed.' });
      return;
    }
    if (!definitions || typeof definitions !== 'object') definitions = { format_version: '1.14.0', sound_definitions: {} };
    if (!definitions.sound_definitions || typeof definitions.sound_definitions !== 'object') definitions.sound_definitions = {};

    let sounds = jsonRead(soundsJsonPath, {});
    if (sounds === null) {
      Blockbench.showMessageBox({ title: 'Invalid sounds.json', message: 'The existing sounds.json contains invalid JSON. No files were changed.' });
      return;
    }
    if (!sounds || typeof sounds !== 'object') sounds = {};

    configured.forEach(event => {
      const file = BSW.eventFiles[event.id];
      const safeName = file.name.replace(/[^a-z0-9_.-]/gi, '_');
      const relative = 'sounds/' + namespace + '/' + assetName + '/' + safeName;
      const destination = pathModule.join(pack.path, relative);
      const definitionKey = event.soundId || eventSoundDefinitionKey(asset.id, event.id);

      if (!isSafeRelativePath(relative)) throw new Error('Generated sound path is unsafe: ' + relative);
      ensureDirectory(pathModule.dirname(destination));

      if (file.path && fs.existsSync(file.path)) {
        fs.copyFileSync(file.path, destination);
      } else if (file.buffer) {
        const data = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
        fs.writeFileSync(destination, data);
      } else {
        throw new Error('No sound data is available for ' + event.id + '.');
      }

      definitions.sound_definitions[definitionKey] = {
        category: vm.category,
        sounds: [{
          name: relative.replace(/\.ogg$/i, ''),
          volume: Number(event.volume) || 1,
          pitch: Number(event.pitch) || 1
        }]
      };

      if (asset.type === 'entity') {
        if (!sounds.entity_sounds) sounds.entity_sounds = {};
        if (!sounds.entity_sounds.entities) sounds.entity_sounds.entities = {};
        const entityDef = sounds.entity_sounds.entities[asset.id] && typeof sounds.entity_sounds.entities[asset.id] === 'object'
          ? sounds.entity_sounds.entities[asset.id]
          : { volume: 1, pitch: 1, events: {} };
        if (!entityDef.events || typeof entityDef.events !== 'object') entityDef.events = {};
        entityDef.events[event.id] = {
          sound: definitionKey,
          volume: Number(event.volume) || 1,
          pitch: Number(event.pitch) || 1
        };
        entityDef.volume = entityDef.volume == null ? 1 : entityDef.volume;
        entityDef.pitch = entityDef.pitch == null ? 1 : entityDef.pitch;
        sounds.entity_sounds.entities[asset.id] = entityDef;
      } else if (asset.type === 'block') {
        if (!sounds.block_sounds) sounds.block_sounds = {};
        const blockDef = sounds.block_sounds[asset.id] && typeof sounds.block_sounds[asset.id] === 'object'
          ? sounds.block_sounds[asset.id]
          : { pitch: 1, volume: 1, events: {} };
        if (!blockDef.events || typeof blockDef.events !== 'object') blockDef.events = {};
        if (['break', 'hit', 'place', 'item.use.on', 'door.open', 'door.close', 'button.click_on', 'button.click_off', 'power.on', 'power.off'].includes(event.id)) {
          blockDef.events[event.id] = {
            sound: definitionKey,
            volume: Number(event.volume) || 1,
            pitch: Number(event.pitch) || 1
          };
        }
        sounds.block_sounds[asset.id] = blockDef;

        if (['step', 'fall', 'jump', 'land'].includes(event.id)) {
          if (!sounds.interactive_sounds) sounds.interactive_sounds = {};
          if (!sounds.interactive_sounds.block_sounds) sounds.interactive_sounds.block_sounds = {};
          const interactive = sounds.interactive_sounds.block_sounds[asset.id] && typeof sounds.interactive_sounds.block_sounds[asset.id] === 'object'
            ? sounds.interactive_sounds.block_sounds[asset.id]
            : { pitch: 1, volume: 1, events: {} };
          if (!interactive.events || typeof interactive.events !== 'object') interactive.events = {};
          interactive.events[event.id] = {
            sound: definitionKey,
            volume: Number(event.volume) || 1,
            pitch: Number(event.pitch) || 1
          };
          sounds.interactive_sounds.block_sounds[asset.id] = interactive;
        }
      }
    });

    if (asset.type === 'block') {
      const blocksPath = pathModule.join(pack.path, 'blocks.json');
      let blocks = jsonRead(blocksPath, { format_version: '1.19.30' });
      if (blocks === null) throw new Error('Existing blocks.json contains invalid JSON.');
      if (!blocks || typeof blocks !== 'object') blocks = { format_version: '1.19.30' };
      blocks.format_version = blocks.format_version || '1.19.30';
      blocks[asset.id] = blocks[asset.id] && typeof blocks[asset.id] === 'object' ? blocks[asset.id] : {};
      blocks[asset.id].sound = asset.id;
      jsonWrite(blocksPath, blocks);
    }

    if (asset.type === 'item' && itemIntegration) {
      // Custom item sound event names became supported for these item sound
      // fields in format 1.26.50. Keep the item reference and the resource-pack
      // sound event name identical.
      configured.forEach(event => {
        const definitionKey = event.soundId || eventSoundDefinitionKey(asset.id, event.id);
        registerItemSoundEvent(sounds, definitionKey, event.volume, event.pitch);
      });

      // Current vanilla sound_definitions.json uses 1.26.50. When an older
      // definitions file is being extended for a 1.26.50+ item, raise only the
      // sound-definition format so the new item sound-event registration is
      // parsed by the current sound system. Existing definitions are preserved.
      if (!versionAtLeast(definitions.format_version, '1.26.50')) {
        definitions.format_version = '1.26.50';
      }

      jsonWrite(asset.filePath, itemIntegration.itemData);
    }

    jsonWrite(definitionsPath, definitions);

    // Item sound events are also registered in sounds.json as named
    // individual events. This is intentionally scoped to the item event keys
    // and does not overwrite broad vanilla events.
    jsonWrite(soundsJsonPath, sounds);

    vm.applied = true;
    vm.currentStep = 4;
    Blockbench.showStatusMessage('Sound Wizard changes applied to ' + asset.id, 4000);
  }

  function ensureFormatPageStyles() {
    if (!BSW.formatPageStyles) {
      BSW.formatPageStyles = Blockbench.addCSS(`
        .bsw-format-page {
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
          padding: 4px 0 0;
          position: relative;
          overflow: hidden;
        }
        .bsw-landing-background {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: auto;
          max-width: none;
          z-index: 0;
          pointer-events: none;
        }
        .bsw-format-hero {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 2px 0 8px;
          text-align: left;
        }
        .bsw-step-icon, .bsw-header-icon { width: 21px; height: 21px; flex: 0 0 21px; fill: none; stroke: var(--color-accent); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .bsw-header-icon { width: 30px; height: 30px; flex: 0 0 32px; }
        .bsw-format-hero h1 {
          margin: 0 0 6px;
          font-size: 28px;
          font-weight: 300;
        }
        .bsw-format-hero .format_description {
          margin: 0 0 9px;
        }
        .bsw-format-hero .format_target {
          margin: 0;
        }
        .bsw-feature-stage {
          position: relative;
          z-index: 2;
          min-height: 300px;
          box-sizing: border-box;
          margin-top: 4px;
          padding: 12px 18px;
          border-radius: 10px;
          overflow: hidden;
          
        }
        .bsw-feature-stage::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, .08);
          pointer-events: none;
        }
        .bsw-feature-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .bsw-feature {
          display: flex;
          gap: 9px;
          padding: 9px 11px;
          border: 1px solid var(--color-border);
          border-radius: 7px;
          background: var(--color-back);
        }
        .bsw-feature-icon {
          color: var(--color-accent);
          width: 22px;
          height: 22px;
          flex: 0 0 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .bsw-feature strong {
          display: block;
          margin-bottom: 3px;
        }
        .bsw-feature p {
          margin: 0;
          color: var(--color-subtle_text);
          line-height: 1.25;
          font-size: 11px;
        }
        .bsw-format-page .button_bar {
          position: relative;
          z-index: 3;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .bsw-launch-button {
          width: 75%;
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 5px;
          background: var(--color-accent);
          color: var(--color-light);
          cursor: pointer;
          font-size: 16px;
        }
        .bsw-launch-button:hover {
          filter: brightness(1.08);
        }
        @media (max-width: 700px) {
          .bsw-feature-grid {
            grid-template-columns: 1fr;
          }
          .bsw-format-hero h1 {
            font-size: 23px;
          }
        }
      `) || {delete() {}};
      // Keep the CSS handle so it can be removed when the plugin unloads.

    }
  }

  function openWizard() {
    ensureFormatPageStyles();
    if (BSW.dialog) {
      BSW.dialog.show();
      return;
    }

    BSW.eventFiles = {};
    BSW.dialog = new Dialog({
      id: 'bedrock_sound_wizard',
      title: 'Minecraft Sound Wizard',
      width: 980,
      buttons: [],
      resizable: 'xy',
      component: {
        data() {
          return {
            currentStep: 1,
            packs: [],
            packRootLabel: '',
            packSearch: '',
            selectedPack: null,
            assetType: 'entity',
            assets: [],
            assetSearch: '',
            selectedAsset: null,
            events: [],
            category: 'neutral',
            applied: false
          };
        },
        computed: {
          filteredPacks() {
            const query = String(this.packSearch || '').toLowerCase();
            return this.packs.filter(pack => !query || pack.name.toLowerCase().includes(query) || pack.path.toLowerCase().includes(query));
          },
          filteredAssets() {
            const query = String(this.assetSearch || '').toLowerCase();
            return this.assets.filter(asset => !query || asset.id.toLowerCase().includes(query) || asset.name.toLowerCase().includes(query));
          },
          configuredCount() {
            return this.events.filter(event => event.enabled && event.fileName).length;
          }
        },
        methods: {
          refreshPacks() {
            this.packs = scanDevelopmentPacks();
            const roots = developmentResourcePackRoots();
            this.packRootLabel = roots[0] || 'Minecraft development_resource_packs was not found automatically. Use Select Folder Manually.';
          },
          browsePacks() {
            chooseDevelopmentFolder(this);
          },
          choosePack(pack) {
            this.selectedPack = pack;
            this.selectedAsset = null;
            this.assetSearch = '';
            this.assets = [];
          },
          nextFromPack() {
            if (!this.selectedPack) {
              Blockbench.showMessageBox({ title: 'Select a Mod', message: 'Select a development resource pack before continuing.' });
              return;
            }
            this.assets = scanAssetsForPack(this.selectedPack, this.assetType);
            this.currentStep = 2;
          },
          setAssetType(type) {
            this.assetType = type;
            this.selectedAsset = null;
            this.assets = this.selectedPack ? scanAssetsForPack(this.selectedPack, type) : [];
          },
          chooseAsset(asset) {
            this.selectedAsset = asset;
          },
          nextFromAsset() {
            if (!this.selectedAsset) {
              Blockbench.showMessageBox({ title: 'Select an Asset', message: 'Select the entity, block, or item you want to configure.' });
              return;
            }
            this.events = makeWizardEvents(this.assetType, this.selectedAsset);
            this.category = this.assetType === 'block' ? 'block' : (this.assetType === 'item' ? 'player' : 'neutral');
            this.currentStep = 3;
          },
          back() {
            if (this.currentStep > 1) this.currentStep--;
          },
          goStep(step) {
            if (step <= this.currentStep) this.currentStep = step;
          },
          addEventSound(eventId) {
            selectEventSound(this, eventId);
          },
          preview(eventId) {
            previewEventSound(eventId);
          },
          removeEventSound(eventId) {
            const event = this.events.find(item => item.id === eventId);
            if (event) {
              event.fileName = '';
              event.enabled = false;
              delete BSW.eventFiles[eventId];
            }
          },
          apply() {
            try {
              applyWizard(this);
            } catch (e) {
              Blockbench.showMessageBox({ title: 'Sound Wizard Failed', message: e.message || String(e) });
            }
          },
          reset() {
            this.currentStep = 1;
            this.selectedPack = null;
            this.selectedAsset = null;
            this.assets = [];
            this.events = [];
            this.applied = false;
            BSW.eventFiles = {};
            this.refreshPacks();
          }
        },
        template: `
          <div style="display:flex; height:650px; min-width:0; background:var(--color-back); overflow:hidden;">
            <div style="position:relative; width:170px; flex:0 0 170px; background:var(--color-dark); border-right:1px solid var(--color-border); padding:14px 0; box-sizing:border-box;">
              <div v-for="item in [
                {n:1,t:'Mod',icon:'folder'},
                {n:2,t:'Asset',icon:'category'},
                {n:3,t:'Sounds',icon:'music'},
                {n:4,t:'Review',icon:'save'}
              ]" :key="item.n"
                @click="goStep(item.n)"
                :style="{padding:'10px 20px', cursor:item.n <= currentStep ? 'pointer' : 'default', opacity:item.n <= currentStep ? 1 : .45, borderLeft: currentStep === item.n ? '3px solid #4da3ff' : '3px solid transparent', color: currentStep === item.n ? '#fff' : '', display:'flex', gap:'10px', alignItems:'center'}">
                <svg class="bsw-step-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="item.icon === 'folder' ? 'M3 6h6l2 2h10v10H3z' : item.icon === 'category' ? 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' : item.icon === 'music' ? 'M9 18V5l10-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z' : 'M5 4h14v16H5zM8 12l2 2 5-6'"></path></svg>
                <div style="min-width:0;">
                  <div style="font-size:14px;">{{ item.t }}</div>
                  <div style="font-size:11px; opacity:.55; margin-top:3px;">
                    {{ item.n === 1 ? 'Choose addon' : item.n === 2 ? 'Select asset' : item.n === 3 ? 'Assign sounds' : 'Apply to addon' }}
                  </div>
                </div>
              </div>
              <div style="position:absolute; bottom:14px; left:0; right:0; padding:0 18px; box-sizing:border-box; overflow:hidden;">
                <div style="font-size:11px; opacity:.55; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Sound Wizard 0.2.0-dev</div>
              </div>
            </div>

            <div style="flex:1; min-width:0; display:flex; flex-direction:column;">
              <div style="padding:18px 22px 10px;">
                <div v-if="currentStep === 1">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <svg class="bsw-header-icon" viewBox="0 0 24 24"><path d="M3 6h6l2 2h10v10H3z"/></svg>
                    <div style="font-size:28px; font-weight:300;">Choose Addon</div>
                  </div>
                  <div style="opacity:.68; margin-top:4px;">Choose a resource pack from your Minecraft development_resource_packs folder.</div>
                </div>
                <div v-else-if="currentStep === 2">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <svg class="bsw-header-icon" viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>
                    <div style="font-size:28px; font-weight:300;">Select Asset</div>
                  </div>
                  <div style="opacity:.68; margin-top:4px;">Choose an entity, block, or item from the selected addon.</div>
                </div>
                <div v-else-if="currentStep === 3">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <svg class="bsw-header-icon" viewBox="0 0 24 24"><path d="M9 18V5l10-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z"/></svg>
                    <div style="font-size:28px; font-weight:300;">Assign Sounds</div>
                  </div>
                  <div style="opacity:.68; margin-top:4px;">Assign an OGG to each action you want this asset to perform.</div>
                </div>
                <div v-else>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <svg class="bsw-header-icon" viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 12l2 2 5-6"/></svg>
                    <div style="font-size:28px; font-weight:300;">Apply to Addon</div>
                  </div>
                  <div style="opacity:.68; margin-top:4px;">Review the files that will be created or updated before applying them.</div>
                </div>
              </div>

              <div style="flex:1; overflow:auto; padding:0 22px 14px; box-sizing:border-box;">
                <section v-if="currentStep === 1">
                  <div style="display:flex; gap:8px; margin-bottom:12px;">
                    <button class="button" @click="refreshPacks">Refresh</button>
                    <button class="button" @click="browsePacks" style="white-space:nowrap; min-width:170px;">Select Folder Manually</button>
                  </div>
                  <div style="font-size:11px; opacity:.55; margin-bottom:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ packRootLabel }}</div>

                  <input class="tool" v-model="packSearch" placeholder="Search development packs..." style="width:100%; box-sizing:border-box; margin-bottom:12px;">

                  <div v-if="!packs.length" style="padding:35px 20px; text-align:center; opacity:.7; border:1px dashed var(--color-border); border-radius:6px;">
                    No development resource packs were found. Use “Select Folder Manually” to choose the folder containing your development_resource_packs.
                  </div>

                  <div v-for="pack in filteredPacks" :key="pack.path"
                    @click="choosePack(pack)"
                    :style="{border:'1px solid '+(selectedPack && selectedPack.path === pack.path ? '#4da3ff' : 'var(--color-border)'), background:'var(--color-back)', borderRadius:'6px', padding:'11px 13px', marginBottom:'8px', cursor:'pointer', display:'flex', gap:'12px', alignItems:'center'}">
                    <div style="width:48px; height:48px; flex:0 0 48px; border-radius:5px; overflow:hidden; background:var(--color-dark); display:flex; align-items:center; justify-content:center;">
                      <img v-if="pack.iconDataUrl" :src="pack.iconDataUrl" style="width:100%; height:100%; object-fit:cover;">
                      <i v-else class="material-icons" style="font-size:30px; opacity:.45;">folder</i>
                    </div>
                    <div style="min-width:0; flex:1;">
                      <div style="font-weight:600; font-size:15px;">{{ pack.name }}</div>
                      <div style="font-size:11px; opacity:.6; margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ pack.path }}</div>
                      <div style="font-size:11px; margin-top:8px; opacity:.72;">
                      Resource Pack
                      <span v-if="pack.behaviorPath"> · Behavior Pack linked</span>
                      <span v-else> · Behavior Pack not found</span>
                    </div>
                  </div>
                </section>

                <section v-else-if="currentStep === 2">
                  <div style="display:flex; gap:6px; margin-bottom:12px;">
                    <button v-for="type in ['entity','block','item']" :key="type" class="button" @click="setAssetType(type)"
                      :style="{background:assetType === type ? 'var(--color-button)' : ''}">
                      {{ type.charAt(0).toUpperCase()+type.slice(1) }}s
                    </button>
                  </div>
                  <input class="tool" v-model="assetSearch" placeholder="Search by identifier..." style="width:100%; box-sizing:border-box; margin-bottom:12px;">
                  <div style="font-size:12px; opacity:.6; margin-bottom:10px;">{{ filteredAssets.length }} {{ assetType }}{{ filteredAssets.length === 1 ? '' : 's' }} found</div>

                  <div v-if="!filteredAssets.length" style="padding:35px 20px; text-align:center; opacity:.7; border:1px dashed var(--color-border); border-radius:6px;">
                    No {{ assetType }} definitions were found in this mod.
                  </div>

                  <div v-for="asset in filteredAssets" :key="asset.id"
                    @click="chooseAsset(asset)"
                    :style="{border:'1px solid '+(selectedAsset && selectedAsset.id === asset.id ? '#4da3ff' : 'var(--color-border)'), borderRadius:'6px', padding:'12px 14px', marginBottom:'7px', cursor:'pointer', background:'var(--color-back)'}">
                    <div style="font-size:15px; font-weight:600;">{{ asset.name }}</div>
                    <div style="font-size:12px; opacity:.7; margin-top:3px;">{{ asset.id }}</div>
                    <div style="font-size:11px; opacity:.5; margin-top:5px;">{{ asset.filePath }}</div>
                  </div>
                </section>

                <section v-else-if="currentStep === 3">
                  <div style="border:1px solid var(--color-border); border-radius:7px; padding:12px 14px; margin-bottom:12px; display:flex; align-items:center; gap:12px;">
                    <div v-if="selectedPack" style="width:46px; height:46px; flex:0 0 46px; border-radius:5px; overflow:hidden; background:var(--color-dark); display:flex; align-items:center; justify-content:center;">
                      <img v-if="selectedPack.iconDataUrl" :src="selectedPack.iconDataUrl" style="width:100%; height:100%; object-fit:cover;">
                      <i v-else class="material-icons" style="font-size:28px; opacity:.45;">folder</i>
                    </div>
                    <div style="min-width:0;">
                      <div style="font-weight:600;">{{ selectedAsset ? selectedAsset.id : '' }}</div>
                      <div style="font-size:11px; opacity:.6; margin-top:3px;">{{ selectedPack ? selectedPack.name : '' }}</div>
                    </div>
                  </div>

                  <div v-if="assetType === 'item'" style="padding:11px 13px; border:1px solid var(--color-border); border-radius:6px; margin-bottom:12px; font-size:12px; line-height:1.45;">
                    <strong>Item sounds:</strong> custom item sound events are supported by current Bedrock item formats (1.26.50+). Attack Hit, Attack Miss, and Critical Hit use <code>minecraft:swing_sounds</code>. Use Start uses <code>minecraft:use_modifiers.start_sound</code> when the item already has <code>use_modifiers</code>.
                  </div>

                  <div v-for="event in events" :key="event.id"
                    style="display:grid; grid-template-columns:minmax(130px, .8fr) minmax(180px, 1.4fr) 70px 70px auto; gap:8px; align-items:center; border:1px solid var(--color-border); border-radius:6px; padding:9px 10px; margin-bottom:7px;">
                    <div>
                      <div style="font-weight:600;">{{ event.label }}</div>
                      <div style="font-size:10px; opacity:.5;">{{ event.id }}</div>
                    </div>
                    <div style="min-width:0;">
                      <div v-if="event.fileName" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:12px;">{{ event.fileName }}</div>
                      <div v-else style="font-size:12px; opacity:.45;">No sound selected</div>
                    </div>
                    <label style="font-size:10px; opacity:.65; text-align:center;">
                      Volume
                      <input class="tool" v-model="event.volume" title="Volume" style="width:100%; box-sizing:border-box; margin-top:3px;">
                    </label>
                    <label style="font-size:10px; opacity:.65; text-align:center;">
                      Pitch
                      <input class="tool" v-model="event.pitch" title="Pitch" style="width:100%; box-sizing:border-box; margin-top:3px;">
                    </label>
                    <div style="display:flex; gap:4px;">
                      <button class="button" @click="addEventSound(event.id)">{{ event.fileName ? 'Replace' : 'Add OGG' }}</button>
                      <button v-if="event.fileName" class="button" @click="preview(event.id)" title="Preview">▶</button>
                      <button v-if="event.fileName" class="button" @click="removeEventSound(event.id)" title="Remove">×</button>
                    </div>
                  </div>

                  <div style="margin-top:12px; padding:12px; border:1px solid var(--color-border); border-radius:6px;">
                    <label style="display:block; margin-bottom:5px;">Sound Category</label>
                    <select class="tool" v-model="category" style="width:220px;">
                      <option value="ambient">ambient</option>
                      <option value="block">block</option>
                      <option value="hostile">hostile</option>
                      <option value="master">master</option>
                      <option value="music">music</option>
                      <option value="neutral">neutral</option>
                      <option value="player">player</option>
                      <option value="record">record</option>
                      <option value="ui">ui</option>
                      <option value="weather">weather</option>
                    </select>
                    <div style="font-size:11px; opacity:.55; margin-top:5px;">Configured actions: {{ configuredCount }}</div>
                  </div>
                </section>

                <section v-else>
                  <div style="border:1px solid var(--color-border); border-radius:7px; padding:14px; margin-bottom:12px; display:flex; align-items:center; gap:12px;">
                    <div v-if="selectedPack" style="width:52px; height:52px; flex:0 0 52px; border-radius:5px; overflow:hidden; background:var(--color-dark); display:flex; align-items:center; justify-content:center;">
                      <img v-if="selectedPack.iconDataUrl" :src="selectedPack.iconDataUrl" style="width:100%; height:100%; object-fit:cover;">
                      <i v-else class="material-icons" style="font-size:30px; opacity:.45;">folder</i>
                    </div>
                    <div style="min-width:0;">
                      <div style="font-size:18px; font-weight:600;">{{ selectedAsset ? selectedAsset.id : '' }}</div>
                      <div style="font-size:12px; opacity:.6; margin-top:4px;">{{ selectedPack ? selectedPack.name : '' }}</div>
                    </div>
                  </div>

                  <div style="font-weight:600; margin-bottom:7px;">Files to update</div>
                  <div style="font-size:12px; line-height:1.6; opacity:.8; margin-bottom:14px;">
                    <div>• Resource pack: <code>sounds/sound_definitions.json</code></div>
                    <div>• Resource pack: <code>sounds.json</code> (named item events are registered here too)</div>
                    <div v-if="assetType === 'block'">• Resource pack: <code>blocks.json</code></div>
                    <div v-if="assetType === 'item'">• Behavior pack: <code>{{ selectedAsset.filePath }}</code></div>
                    <div v-for="event in events" v-if="event.fileName">• OGG: <code>{{ event.fileName }}</code> → <code>sounds/{{ selectedAsset.id }}</code></div>
                  </div>

                  <div v-if="assetType === 'item'" style="padding:12px; border:1px solid var(--color-border); border-radius:6px; font-size:12px; line-height:1.5;">
                    Item JSON will be updated with the selected custom sound event names. This requires item format_version 1.26.50 or newer. The OGGs and definitions are stored in the resource pack.
                  </div>

                  <div v-if="applied" style="margin-top:14px; padding:12px; border:1px solid #4da3ff; border-radius:6px;">
                    Changes were applied to the selected development pack.
                  </div>
                </section>
              </div>

              <div style="display:flex; justify-content:space-between; gap:10px; padding:10px 18px; border-top:1px solid var(--color-border); background:var(--color-dark);">
                <button class="button" @click="back" :disabled="currentStep === 1">Back</button>
                <div style="display:flex; gap:7px;">
                  <button class="button" @click="reset">Reset</button>
                  <button v-if="currentStep === 1" class="button primary" @click="nextFromPack">Next</button>
                  <button v-else-if="currentStep === 2" class="button primary" @click="nextFromAsset">Next</button>
                  <button v-else-if="currentStep === 3" class="button primary" @click="currentStep=4">Review</button>
                  <button v-else class="button primary" @click="apply" style="white-space:nowrap; min-width:140px;">Apply to Addon</button>
                </div>
              </div>
            </div>
          </div>
        `
      }
    });

    BSW.dialog.show();
    if (BSW.dialog.content_vue && BSW.dialog.content_vue.refreshPacks) {
      BSW.dialog.content_vue.refreshPacks();
    } else {
      setTimeout(() => {
        if (BSW.dialog && BSW.dialog.content_vue && BSW.dialog.content_vue.refreshPacks) {
          BSW.dialog.content_vue.refreshPacks();
        }
      }, 50);
    }
  }

  Plugin.register('bedrock_sound_wizard', {
    title: 'Minecraft Sound Wizard',
    author: 'SpaceMonkeyBoi',
    // The plugin script lives in src/, while the exact generated PNG icon is at the repository root.
    // Blockbench resolves plugin image icons relative to the plugin script path.
    icon: '../icon.svg',
    description: 'Add custom sounds directly to your mods without having to manually edit files!',
    about: 'This plugin is designed to help people add sounds to their mods without needing to mess with file paths and sound_definitions files. Just make sure that all sound files are in OGG format instead of MP4.',
    repository: 'https://github.com/SpaceMonkeyBoi/Minecraft-Bedrock-Sound-Wizard',
    version: VERSION,
    variant: 'desktop',
    tags: ['Minecraft: Bedrock Edition'],
    min_version: '4.8.0',

    onload() {
      const saved = settings();
      BSW.rpPath = saved.rpPath || '';
      BSW.rpName = saved.rpName || '';

      BSW.action = new Action('bedrock_sound_wizard.open', {
        name: 'Minecraft Sound Wizard',
        description: 'Create and configure a Minecraft Bedrock sound',
        icon: ICON_DATA_URL,
        click: openWizard
      });

      // Keep the action in Tools, but also expose a dedicated top-level menu so the
      // wizard always has an obvious launch location instead of being visible only
      // in the plugin manager.
      MenuBar.addAction(BSW.action, 'tools');
      BSW.menu = new BarMenu('bedrock_sound_wizard_menu', [BSW.action], {
        name: 'Sound Wizard',
        icon: ICON_DATA_URL
      });
      MenuBar.addMenu(BSW.menu);

      ensureFormatPageStyles();

      // Register as a native Blockbench ModelLoader so the wizard appears in
      // File > New and on the start screen under the built-in "Loaders" group.
      // ModelLoader is the same public API used by Blockbench's wizard-style
      // loaders such as the CEM Template Loader.
      BSW.loader = new ModelLoader('bedrock_sound_wizard_loader', {
        name: 'Minecraft Sound Wizard',
        description: 'Create and assign custom sounds for Minecraft: Bedrock Edition resource packs.',
        // Use the exact same pixel-art image as the plugin icon. The data URL
        // is required because Blockbench's icon renderer does not interpret
        // "icon.png" as a file path.
        // Return a real IMG element rather than a data-URL string. The Start screen
        // inserts loader icons through getIconNode(...).outerHTML, and returning the
        // element guarantees the exact pixel-art image is used instead of allowing the
        // icon string to be interpreted as a font/material icon by another renderer.
        // Use the same exact pixel-art asset that is used by the plugin menu and landing page.
        // Blockbench's start-screen loader renderer accepts image data URLs here.
        icon: ICON_DATA_URL,
        category: 'loaders',
        show_on_start_screen: true,
        plugin: 'bedrock_sound_wizard',
        target: 'Minecraft: Bedrock Edition',
        onStart: openWizard,
        format_page: {
          component: {
            methods: {
              open: openWizard
            },
            template: `
              <div class="bsw-format-page">
                <img class="bsw-landing-background" src="${LANDING_BACKGROUND_DATA_URL}" alt="" aria-hidden="true">
                <div class="bsw-format-hero">
                  <div class="bsw-format-copy">
                    <p class="format_description">Add custom sounds and integrate them into your Minecraft Addons!</p>
                    <p class="format_target"><b>Target</b> : <span>Minecraft: Bedrock Edition</span></p>
                  </div>
                </div>

                <content>
                  <div class="bsw-feature-stage">
                    <div class="bsw-feature-grid">
                      <div class="bsw-feature">
                        <svg class="bsw-feature-icon" viewBox="0 0 24 24"><path d="M3 6h6l2 2h10v10H3z"/></svg>
                        <div><strong>Choose Addon</strong><p>Find and select your Bedrock development addon.</p></div>
                      </div>
                      <div class="bsw-feature">
                        <svg class="bsw-feature-icon" viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>
                        <div><strong>Entity, Block &amp; Item</strong><p>Select the asset you want to configure.</p></div>
                      </div>
                      <div class="bsw-feature">
                        <svg class="bsw-feature-icon" viewBox="0 0 24 24"><path d="M9 18V5l10-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z"/></svg>
                        <div><strong>Assign Sounds</strong><p>Assign sounds to the actions supported by the selected asset.</p></div>
                      </div>
                      <div class="bsw-feature">
                        <svg class="bsw-feature-icon" viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 12l2 2 5-6"/></svg>
                        <div><strong>Apply to Addon</strong><p>Review the changes and apply them to your development addon.</p></div>
                      </div>
                    </div>
                  </div>
                </content>

                <div class="spacer"></div>

                <div class="button_bar">
                  <button class="bsw-launch-button" @click="open()">Add Sounds!</button>
                </div>
              </div>
            `
          }
        }
      });

      // ModelLoader registration is reactive, but StartScreen maintains its own
      // Vue view. Refresh it both immediately and after Vue has had a tick to observe
      // the newly-added loader. This also handles loading/reloading the plugin while
      // the New screen is already open.
      const refreshSoundWizardLoader = () => {
        if (typeof StartScreen !== 'undefined' && StartScreen.vue && typeof StartScreen.vue.$forceUpdate === 'function') {
          // Rebind the Vue data reference as well as forcing a render. This avoids
          // relying on the timing of Vue observing ModelLoader.loaders when a plugin
          // is loaded after the Start screen has already initialized.
          if (typeof ModelLoader !== 'undefined' && ModelLoader.loaders) {
            StartScreen.vue.loaders = Object.assign({}, ModelLoader.loaders);
          }
          StartScreen.vue.$forceUpdate();
        }
      };
      refreshSoundWizardLoader();
      if (typeof Vue !== 'undefined' && typeof Vue.nextTick === 'function') {
        Vue.nextTick(refreshSoundWizardLoader);
      }
      setTimeout(refreshSoundWizardLoader, 0);
      setTimeout(refreshSoundWizardLoader, 250);
      if (typeof Blockbench !== 'undefined' && typeof Blockbench.on === 'function') {
        BSW.loaderRefreshListener = Blockbench.on('construct_model_loader', refreshSoundWizardLoader);
      }
    },

    onunload() {
      if (BSW.dialog) {
        BSW.dialog.hide();
        BSW.dialog = null;
      }
      if (BSW.loaderRefreshListener && typeof BSW.loaderRefreshListener.delete === 'function') {
        BSW.loaderRefreshListener.delete();
        BSW.loaderRefreshListener = null;
      }
      if (BSW.loader) {
        BSW.loader.delete();
        BSW.loader = null;
      }
      if (BSW.formatPageStyles && typeof BSW.formatPageStyles.delete === 'function') {
        BSW.formatPageStyles.delete();
        BSW.formatPageStyles = null;
      }
      if (BSW.menu) {
        BSW.menu.delete();
        BSW.menu = null;
      }
      if (BSW.action) {
        BSW.action.delete();
        BSW.action = null;
      }
    }
  });
})();
