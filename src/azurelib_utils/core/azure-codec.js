/**
 * AzureLib Animator — Codec & Format Registration
 * -----------------------------------------------
 * Defines the Blockbench model format for AzureLib (.geo / .animation)
 * and handles project load, save, and import/export utilities.
 *
 * Animation handling is fully owned by azure-animation-tab.js, which
 * exports an AnimationCodec instance that we attach to the ModelFormat.
 * Blockbench routes all animation import/export through that codec
 * automatically — no Animator monkey-patching, no menu hiding.
 *
 * © 2025 AzureDoom — MIT License
 */

import omit from 'lodash/omit';
import AzureConfig, { DEFAULT_CONFIG, onSettingsChanged } from './azure-settings.js';
import { injectOverride, PatchRegistry, invertMolang as localInvert } from './azure-utils.js';
import { registerKeyframeOverrides, unregisterKeyframeOverrides } from '../animation/azure-keyframes.js';
import {
  registerAzureAnimationFormat,
  unregisterAzureAnimationFormat,
  azureAnimationCodec,
} from '../animation/azure-animation-tab.js';
import { initializeAnimationUI, unloadAnimationUI } from '../animation/azure-animation-ui.js';

const invertMolang = globalThis.invertMolang || localInvert;
let hasNotifiedConversion = false;

// ---------------------------------------------------------------------------
// Lifecycle registration
// ---------------------------------------------------------------------------

export function registerAzureCodec() {
  Codecs.project.on('compile', handleProjectCompile);
  Codecs.project.on('parse', handleProjectParse);
  Codecs.bedrock.on('compile', handleBedrockCompile);

  // Register our custom animation codec (replaces Bedrock animation tab).
  // The codec instance itself is constructed at module load; this call is
  // mostly a logging shim for symmetry with the rest of the lifecycle.
  registerAzureAnimationFormat();

  // Keyframe interpolation overrides (getLerp, compileBedrockKeyframe, etc.)
  registerKeyframeOverrides();

  // Animation panel UI (easing picker, catmullrom toggle, etc.)
  initializeAnimationUI();

  Blockbench.on('close_project', resetDefaults);
  Blockbench.on('new_project', resetDefaults);

  console.log('[AzureLib] Azure codec registered (AnimationCodec-backed)');
}

export function unregisterAzureCodec() {
  Codecs.project.events.compile.remove(handleProjectCompile);
  Codecs.project.events.parse.remove(handleProjectParse);
  Codecs.bedrock.events.compile.remove(handleBedrockCompile);

  unloadAnimationUI();
  unregisterKeyframeOverrides();
  unregisterAzureAnimationFormat();

  format.delete();
  console.log('[AzureLib] Azure codec unregistered');
}

function resetDefaults() {
  Object.assign(AzureConfig, DEFAULT_CONFIG);
  hasNotifiedConversion = false;
  console.log('[AzureLib] Settings reset to defaults');
}

// ---------------------------------------------------------------------------
// Project compile/parse hooks
// ---------------------------------------------------------------------------

function handleProjectCompile(event) {
  if (Format.id !== 'azure_model') return;

  if (AzureConfig.objectType === 'AZURE_ITEM_BLOCK') {
    AzureConfig.objectType = 'AZURE_ENTITY';
    AzureConfig.entityType = 'Entity/Block/Item';
  }

  event.model.azurelibSettings = AzureConfig;
}

function handleProjectParse(event) {
  const model = event.model || {};
  const formatId = model?.meta?.model_format || model?.model_format;
  if (formatId !== 'azure_model') return;

  const settings = model.azurelibSettings;
  if (settings && typeof settings === 'object') {
    const wasDeprecated = settings.objectType === 'AZURE_ITEM_BLOCK';
    Object.assign(AzureConfig, omit(settings, ['formatVersion']));

    if (wasDeprecated) {
      AzureConfig.objectType = 'AZURE_ENTITY';
      AzureConfig.entityType = 'Entity/Block/Item';
      console.warn('[AzureLib] Converted deprecated AZURE_ITEM_BLOCK → AZURE_ENTITY');
    }

    onSettingsChanged();

    if (wasDeprecated && !hasNotifiedConversion) {
      hasNotifiedConversion = true;
      Blockbench.showMessageBox({
        title: 'AzureLib Conversion',
        message:
          'This project used an older "Block/Item" type.\n\nIt has been updated to the unified "Entity/Block/Item" type (AZURE_ENTITY).',
        buttons: ['OK'],
      });
    }
  } else if (formatId === 'azure_model' && !model.azurelibSettings) {
    console.debug('[AzureLib] Azure model detected but no settings loaded yet.');
  }

  // Invert corrections for BB 5.0+
  if (Blockbench.isNewerThan('4.99') && model.animations) {
    console.log('[AzureLib] Applying legacy animation inversion fix for Blockbench 5.0+');
    for (const [name, anim] of Object.entries(model.animations)) {
      for (const bone of Object.values(anim.bones || {})) {
        for (const [channel, frames] of Object.entries(bone)) {
          if (channel === 'rotation' || channel === 'position') {
            for (const kf of Object.values(frames)) {
              if (kf?.vector) {
                if (channel === 'rotation') {
                  kf.vector[0] = invertMolang(kf.vector[0]);
                  kf.vector[1] = invertMolang(kf.vector[1]);
                } else if (channel === 'position') {
                  kf.vector[0] = invertMolang(kf.vector[0]);
                }
              }
            }
          }
        }
      }
    }
  }
}

function handleBedrockCompile(event) {
  if (Format.id !== 'azure_model') return;
  const geometry = event.model?.['minecraft:geometry'];
  if (geometry) {
    geometry.forEach(geo => {
      delete geo.item_display_transforms;
    });
  }
}

// ---------------------------------------------------------------------------
// Export helpers (Display JSON handling — unchanged from original)
// ---------------------------------------------------------------------------

export function maybeExportItemJson(options = {}, as) {
  const should = (key, fallback) => (options[key] === undefined ? fallback : options[key]);
  const model = {};
  if (should('comment', settings.credit.value)) model.credit = settings.credit.value;
  model.parent = 'builtin/entity';
  if (should('ambientocclusion', Project.ambientocclusion === false)) model.ambientocclusion = false;
  if (Project.texture_width !== 16 || Project.texture_height !== 16)
    model.texture_size = [Project.texture_width, Project.texture_height];
  if (should('front_gui_light', Project.front_gui_light)) model.gui_light = 'front';
  if (should('overrides', Project.overrides)) model.overrides = Project.overrides;

  if (should('display', Object.keys(Project.display_settings).length >= 1)) {
    const display = {};
    for (const key in DisplayMode.slots) {
      const slot = DisplayMode.slots[key];
      if (DisplayMode.slots.hasOwnProperty(key) && Project.display_settings[slot]?.export)
        display[slot] = Project.display_settings[slot].export();
    }
    if (Object.keys(display).length) {
      model.display = display;
      const OFFSET_Y = 4.0;
      for (const [slot, data] of Object.entries(display)) {
        const tr = data?.translation;
        if (Array.isArray(tr)) tr[1] = Math.round((Number(tr[1] || 0) - OFFSET_Y) * 100) / 100;
      }
    }
  }

  if (Project.textures && should('textures', Object.keys(Project.textures).length >= 1)) {
    for (const tex of Object.values(Project.textures)) {
      if (tex.particle || Object.keys(Project.textures).length === 1) {
        let name = tex.name.replace('.png', '');
        if (/^[_\-.a-z0-9/]+$/.test(name)) model.textures = { particle: name };
        break;
      }
    }
  }

  const jsonStr = JSON.stringify(model, null, 2);
  const path = AzureConfig.itemModelPath;

  Blockbench.export(
    {
      resource_id: 'model',
      type: Codecs.java_block.name,
      extensions: ['json'],
      name: codec.fileName().replace('.geo', '.item'),
      startpath: path,
      content: jsonStr,
    },
    realPath => {
      AzureConfig.itemModelPath = realPath;
    }
  );

  return this;
}

export function maybeImportItemJson() {
  Blockbench.import(
    {
      resource_id: 'model',
      type: 'json',
      extensions: ['json'],
      readtype: 'text',
      multiple: false,
    },
    files => {
      if (!files?.[0]) return;
      let json;
      try {
        json = JSON.parse(files[0].content);
      } catch {
        return Blockbench.showQuickMessage('[AzureLib] Invalid JSON file.');
      }

      if (json.parent !== 'builtin/entity' || typeof json.display !== 'object')
        return Blockbench.showQuickMessage('[AzureLib] Not a valid AzureLib display file.');

      Project.display_settings = {};
      const OFFSET_Y = 4.0;
      for (const [slot, data] of Object.entries(json.display)) {
        if (!DisplayMode.slots.includes(slot)) continue;

        const rotation = Array.isArray(data.rotation) ? data.rotation.slice() : [0, 0, 0];
        const translation = Array.isArray(data.translation) ? data.translation.slice() : [0, 0, 0];
        const scale = Array.isArray(data.scale) ? data.scale.slice() : [1, 1, 1];

        translation[1] = Math.round((Number(translation[1] || 0) + OFFSET_Y) * 100) / 100;

        const slotObj = new DisplaySlot(slot);
        Object.assign(slotObj, { rotation, translation, scale });
        Project.display_settings[slot] = slotObj;
      }

      Project.saved = false;
      DisplayMode.vue.$forceUpdate();
      DisplayMode.updateDisplayBase();
      Blockbench.showQuickMessage('[AzureLib] Display settings imported.');
    }
  );
}

// ---------------------------------------------------------------------------
// Model format registration
// ---------------------------------------------------------------------------

const codec = Codecs.bedrock;

export const format = new ModelFormat({
  id: 'azure_model',
  name: 'AzureLib Animated Model',
  category: 'minecraft',
  description: 'Animated model for Java mods using AzureLib.',
  icon: 'view_in_ar',
  rotate_cubes: true,
  box_uv: true,
  optional_box_uv: true,
  single_texture: true,
  bone_rig: true,
  centered_grid: true,
  animated_textures: true,
  select_texture_for_particles: true,
  animation_mode: true,
  animation_files: true,
  // Wire the AzureLib animation codec directly into the format.
  // Blockbench's built-in "Import Animations" / "Export Animations…" /
  // "Save All Animations" actions will route through this codec automatically.
  // Falls back to undefined on older Blockbench builds where AnimationCodec
  // isn't available, so the format still loads (animation I/O won't work).
  animation_codec: azureAnimationCodec || undefined,
  locators: true,
  codec: Codecs.project,
  display_mode: true,
  onActivation() {},
});

export default codec;
