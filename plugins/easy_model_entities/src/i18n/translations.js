/*
 * Copyright 2026 Markus Bordihn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const EN = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.action.export': 'Export Easy Model Entity',
  'eme.action.exportDescription': 'Export the current project for Easy Model Entities.',
  'eme.field.preset': 'Preset',
  'eme.field.namespace': 'Namespace (mod id)',
  'eme.field.profileId': 'Profile ID',
  'eme.field.targetVersion': 'Minecraft Version',
  'eme.field.exportType': 'Export Type',
  'eme.field.modelType': 'Type',
  'eme.field.customize': 'Customize settings',
  'eme.field.includeExternalTextures': 'Include external textures',
  'eme.field.includeExternalTexturesDescription':
      'Copies textures from other mods into this export. Turn it off to only '
      + 'point to them. Vanilla minecraft: textures are never copied.',
  'eme.field.hostEntityType': 'Host Entity Type',
  'eme.field.movementType': 'Movement Type',
  'eme.field.bodyType': 'Body Type',
  'eme.field.width': 'Width',
  'eme.field.height': 'Height',
  'eme.field.eyeHeight': 'Eye Height',
  'eme.field.speed': 'Speed',
  'eme.field.stepHeight': 'Step Height',
  'eme.field.gravity': 'Gravity',
  'eme.field.behaviorMode': 'Behavior Mode',
  'eme.field.maxHealth': 'Max Health',
  'eme.field.movementSpeed': 'Movement Speed',
  'eme.field.followRange': 'Follow Range',
  'eme.field.scale': 'Scale',
  'eme.field.shadowRadius': 'Shadow Radius',
  'eme.field.visibleBoundsWidth': 'Visible Bounds Width (0 = auto)',
  'eme.field.visibleBoundsHeight': 'Visible Bounds Height (0 = auto)',
  'eme.field.visibleBoundsOffsetX': 'Visible Bounds Offset X',
  'eme.field.visibleBoundsOffsetY': 'Visible Bounds Offset Y',
  'eme.field.visibleBoundsOffsetZ': 'Visible Bounds Offset Z',
  'eme.field.opacity': 'Opacity (0 - 1)',
  'eme.field.animationMode': 'Animation Mode',
  'eme.field.swingSpeed': 'Swing Speed',
  'eme.field.walkSpeedMultiplier': 'Walk Speed Multiplier',
  'eme.field.idleStrength': 'Idle Strength',
  'eme.field.gait': 'Gait',
  'eme.field.variantMode': 'Animation Variants',
  'eme.field.variantWeight': 'Weight of %0',
  'eme.field.shoulderOffsetX': 'Shoulder Offset X',
  'eme.field.shoulderOffsetY': 'Shoulder Offset Y',
  'eme.field.shoulderOffsetZ': 'Shoulder Offset Z',
  'eme.field.shoulderScale': 'Shoulder Scale',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Dimensions',
  'eme.section.movement': 'Movement',
  'eme.section.behavior': 'Behavior',
  'eme.section.attributes': 'Attributes',
  'eme.section.rendering': 'Rendering',
  'eme.section.animation': 'Animation',
  'eme.section.variantWeights': 'Animation Variant Weights',
  'eme.section.shoulder': 'Shoulder',
  'eme.setting.enable_customization': 'Show advanced customization (Easy Model Entities)',
  'eme.setting.enable_customization.description':
      'Shows more settings in the export dialog, like size, movement, '
      + 'behavior, rendering and animation.',
  'eme.setting.enable_experimental': 'Show experimental presets (Easy Model Entities)',
  'eme.setting.enable_experimental.description':
      'Adds the custom preset and presets that are not finished yet.',
  'eme.preset.custom': 'Custom (manual settings)',
  'eme.preset.static': 'Static (no animation, no movement)',
  'eme.preset.statue': 'Statue (display, no movement)',
  'eme.preset.ticking': 'Ticking (server + client tick)',
  'eme.preset.animated': 'Animated (continuous animation)',
  'eme.preset.animated_randomly': 'Animated randomly (moves now and then)',
  'eme.preset.humanoid_still': 'Humanoid (2 legs, standing)',
  'eme.preset.humanoid_wandering': 'Humanoid (2 legs, wandering)',
  'eme.preset.quadruped_still': 'Quadruped (4 legs, ground, standing)',
  'eme.preset.quadruped_wandering': 'Quadruped (4 legs, ground, wandering)',
  'eme.preset.aquatic_still': 'Aquatic (fish, still)',
  'eme.preset.aquatic_swimming': 'Aquatic (fish, swimming)',
  'eme.preset.amphibious_still': 'Amphibious (land/water, still)',
  'eme.preset.amphibious_wandering': 'Amphibious (land/water, wandering)',
  'eme.preset.winged_still': 'Winged (bird, perched)',
  'eme.preset.winged_wandering': 'Winged (bird, flying)',
  'eme.preset.winged_humanoid_still': 'Winged humanoid (standing)',
  'eme.preset.winged_humanoid_wandering': 'Winged humanoid (wandering)',
  'eme.preset.arthropod_still': 'Arthropod (insect/spider, still)',
  'eme.preset.arthropod_wandering': 'Arthropod (insect/spider, wandering)',
  'eme.preset.cuboid_still': 'Cuboid (block shape, still)',
  'eme.preset.cuboid_hopping': 'Cuboid (block shape, hopping)',
  'eme.preset.floating_still': 'Floating (hovering, still)',
  'eme.body.static': 'Static',
  'eme.body.biped': 'Biped (2 legs)',
  'eme.body.quadruped': 'Quadruped (4 legs)',
  'eme.body.aquatic': 'Aquatic',
  'eme.body.amphibious': 'Amphibious',
  'eme.body.winged': 'Winged',
  'eme.body.winged_humanoid': 'Winged humanoid',
  'eme.body.arthropod': 'Arthropod',
  'eme.body.cuboid': 'Cuboid',
  'eme.body.floating': 'Floating',
  'eme.movement.ground': 'Ground',
  'eme.movement.water': 'Water',
  'eme.movement.amphibious': 'Amphibious',
  'eme.movement.static': 'Static',
  'eme.gait.natural': 'Natural',
  'eme.gait.feline': 'Feline (light, quick)',
  'eme.gait.ungulate': 'Ungulate (heavy, slow)',
  'eme.behavior.idle_only': 'Idle only',
  'eme.behavior.ambient': 'Ambient (wanders)',
  'eme.behavior.static': 'Static',
  'eme.behavior.external_owner': 'External owner',
  'eme.animation.automatic': 'Automatic',
  'eme.animation.random_idle': 'Random idle',
  'eme.animation.none': 'None',
  'eme.variant.random': 'Random',
  'eme.variant.sequential': 'Sequential',
  'eme.variant.none': 'None (base clip only)',
  'eme.entity.ground_entity': 'Ground entity',
  'eme.entity.static_entity': 'Static entity',
  'eme.entity.aquatic_entity': 'Aquatic entity',
  'eme.entity.amphibious_entity': 'Amphibious entity',
  'eme.modelType.entity': 'Entity',
  'eme.modelType.block_entity': 'Block Entity',
  'eme.exportType.packs': 'Complete: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.resource_pack': 'Update: Resource Pack only (ZIP)',
  'eme.exportType.data_pack': 'Update: Data Pack only (ZIP)',
  'eme.exportType.mod_project': 'Standalone: write into mod project',
  'eme.exportType.model_only': 'Model only: mod integration (no data pack)',
  'eme.dialog.blockingIssues': 'Blocks the export',
  'eme.dialog.warnings': 'Warnings',
  'eme.action.wrapInRootBone': 'Wrap in root bone',
  'eme.validator.modelLoad': 'Easy Model Entities: model loads in the mod',
  'eme.message.exportBlocked': 'The export is blocked. Please fix these problems first:',
  'eme.message.exportWarnings': 'Please check these warnings:',
  'eme.message.exportAnyway': 'Export anyway?',
  'eme.message.overwriteTitle': 'Overwrite existing files?',
  'eme.message.overwriteFiles': '%0 file(s) already exist and will be overwritten:',
  'eme.button.export': 'Export',
  'eme.button.cancel': 'Cancel',
  'eme.button.overwrite': 'Overwrite',
  'eme.validation.more': '%0 and %1 more',
  'eme.validation.UNSUPPORTED_ELEMENT':
      'The mod can only load cubes and shows a pink box instead. Remove or '
      + 'replace: %0',
  'eme.validation.CUBE_OUTSIDE_GROUP':
      'Cubes must be inside a group, or the mod does not load the model. Move '
      + 'them into a group or click "Wrap in root bone": %0',
  'eme.validation.MISSING_BODY_PART':
      'The body type %0 needs a group named "%1". Without it, the mod shows a '
      + 'pink box',
  'eme.validation.FACE_UV_ROTATION_IGNORED':
      'Face textures can only be rotated in 90 degree steps. These cubes show '
      + 'the texture unrotated: %0',
  'eme.validation.PER_TEXTURE_UV_SIZE':
      'The mod uses the UV size of the project for all textures. Check these '
      + 'textures: %0',
  'eme.validation.MIXED_TEXTURES_PER_CUBE':
      'The mod supports only one texture per cube. These cubes use more than '
      + 'one: %0',
  'eme.validation.HIDDEN_ELEMENT':
      'Hidden parts are still shown in game: %0',
  'eme.validation.DUPLICATE_GROUP_NAME':
      'Some groups have the same name. Upper and lower case and spaces at the '
      + 'start or end do not count. The mod cannot tell these groups apart in '
      + 'animations and for held items: %0',
  'eme.validation.DUPLICATE_ANIMATION_NAME':
      'Some animations have the same name. Upper and lower case and spaces at '
      + 'the start or end do not count. The mod only keeps the last one: %0',
  'eme.validation.TARGET_VERSION_CHANGED':
      'The last export was for Minecraft %0, this one is for Minecraft %1. '
      + 'Packs for different versions do not work together',
  'eme.validation.NO_PAIRED_EXPORT':
      'This project was never exported with both packs, so this pack may not '
      + 'fit the one you installed. Export both packs instead',
  'eme.validation.INVALID_NUMERIC': '%0 must be a number',
  'eme.validation.range': '%0 must be between %1 and %2',
  'eme.validation.positive': '%0 must be greater than 0',
  'eme.validation.choice': '%0 must be one of %1',
  'eme.validation.budget.textureSize': 'Texture larger than %0x%0',
  'eme.validation.budget.modelSize': 'Model file larger than %0 MB',
  'eme.validation.budget.cubeCount': 'More than %0 cubes',
  'eme.validation.budget.boneCount': 'More than %0 bones',
  'eme.validation.budget.hierarchyDepth':
      'Groups nested more than %0 levels deep',
  'eme.validation.INVALID_NAMESPACE': 'Invalid namespace "%0". Try "%1"',
  'eme.validation.INVALID_PROFILE_ID': 'Invalid profile ID "%0". Try "%1"',
  'eme.validation.INVALID_RESOURCE_LOCATION': 'Invalid host entity type: %0',
  'eme.validation.INVALID_PRESET_TYPE': 'Invalid preset type: %0',
  'eme.validation.MISSING_MODEL': 'The project has no model',
  'eme.validation.MISSING_TEXTURE': 'The project has no texture',
  'eme.validation.EXTERNAL_TEXTURE_REFERENCE':
      'These textures are not part of the export: %0. Install the mod or pack '
      + 'they come from, or turn on "%1"',
  'eme.validation.HIGH_ANIMATION_COUNT':
      'More than %0 animations. The mod does not load the model',
  'eme.validation.SOFT_ANIMATION_COUNT': 'More than %0 animations',
  'eme.validation.CUSTOM_ANIMATION_CLIP':
      'These animations never play on their own, only by command: %0. Names '
      + 'that play on their own: %1 and numbered variants like idle_2',
  'eme.validation.UNSUPPORTED_ANIMATION_EXPRESSION':
      'Animation "%0" uses formulas in keyframes. The mod only supports plain '
      + 'numbers and skips this animation',
  'eme.validation.UNSUPPORTED_ANIMATION_CHANNEL':
      'Animation "%0" uses the "%1" channel. The mod ignores it',
  'eme.validation.ANIMATIONS_NEVER_PLAYED':
      'The preset %0 has no animations, so these never play: %1. Pick an '
      + 'animated preset',
  'eme.validation.DUPLICATE_TEXTURE_INDEX':
      'Texture slot %0 is assigned more than once',
  'eme.validation.INVALID_TEXTURE_LOCATION':
      'Texture slot %0 points to the invalid location %1, check its namespace '
      + 'and folder',
  'eme.validation.MISSING_TEXTURE_INDEX':
      'Texture slot 0 is missing, the model has no primary texture',
  'eme.validation.INVALID_OUTPUT_PATH': 'A file to write has no path',
  'eme.validation.PATH_TRAVERSAL':
      'The path %0 leads outside the selected folder',
  'eme.validation.ABSOLUTE_PATH':
      'The path %0 must be relative to the selected folder',
  'eme.texture.custom': 'Custom Texture',
  'eme.message.openProjectFirst': 'Open a project first',
  'eme.message.packsExported': 'Easy Model Entities packs exported',
  'eme.message.modProjectWritten':
      'Easy Model Entities files written to mod project',
  'eme.message.exportFailed': 'Export failed',
  'eme.message.unsupportedTargetVersion':
      'Minecraft %0 is not supported as target version. Choose another one in '
      + 'the export dialog',
  'eme.message.unexpectedError':
      'Something unexpected went wrong. If this happens again, please report '
      + 'it with these details:\n\n%0',
  'eme.message.errorDetails': 'Details: %0',
  'eme.error.noPermission':
      'No permission to write %0. Choose another folder or check the folder '
      + 'permissions',
  'eme.error.fileInUse':
      '%0 is in use by another program. Close it and try again',
  'eme.error.diskFull': 'Not enough disk space to write %0',
  'eme.error.readOnly': '%0 is on a read-only drive',
  'eme.error.notFound':
      'The folder for %0 no longer exists. Choose the folder again',
  'eme.message.selectResourcesDirectory': 'Select src/main/resources directory',
  'eme.inherit.title': 'Inherited Animations',
  'eme.inherit.permission':
      'Reads the parent model to keep inherited animations in sync',
  'eme.inherit.action.parent': 'Inherit Animations...',
  'eme.inherit.action.parentDescription':
      'Takes over the animations of a parent model and keeps them in sync.',
  'eme.inherit.action.sync': 'Sync Inherited Animations...',
  'eme.inherit.action.syncDescription':
      'Compares the inherited animations with the parent model.',
  'eme.inherit.action.takeFromParent': 'Take From Parent',
  'eme.inherit.parentDialogTitle': 'Inherit Animations',
  'eme.inherit.parentDialogInfo':
      'Choose a parent model. Its animations are copied into this model as '
      + 'their own group and saved with it, so the mod still reads them. '
      + 'Clear the field to unlink the parent.',
  'eme.inherit.parentModel': 'Parent Model',
  'eme.inherit.syncTitle': 'Sync With %0',
  'eme.inherit.syncInfo':
      'Checked animations are replaced by the version of the parent model. '
      + 'Unchecked animations stay as they are.',
  'eme.inherit.status.parentChanged': 'changed in parent',
  'eme.inherit.status.localChanged': 'changed here',
  'eme.inherit.status.bothChanged': 'changed here and in parent',
  'eme.inherit.status.newInParent': 'new in parent',
  'eme.inherit.status.removedLocally': 'deleted here',
  'eme.inherit.status.missingInParent': 'no longer in parent, stays here',
  'eme.inherit.detail.bones': 'Bones: %0',
  'eme.inherit.detail.setting': '%0: %1 here, %2 in parent',
  'eme.inherit.detail.missingBones': 'Bones missing in this model: %0',
  'eme.inherit.overwriteLocal':
      'Your changes to %0 will be replaced by the parent version.',
  'eme.inherit.linkReplaces':
      'These animations differ from %0 and will be replaced: %1',
  'eme.inherit.unlinkConfirm':
      'Unlink %0? The animations stay in this model as normal animations.',
  'eme.inherit.button.apply': 'Apply',
  'eme.inherit.button.replace': 'Replace',
  'eme.inherit.button.unlink': 'Unlink',
  'eme.inherit.button.openSync': 'Open Sync',
  'eme.inherit.button.later': 'Later',
  'eme.inherit.undoSync': 'Sync inherited animations',
  'eme.inherit.saveFirst': 'Save the model first, the parent is stored '
      + 'relative to it',
  'eme.inherit.linkSelf': 'A model cannot be its own parent',
  'eme.inherit.parentMissing': 'Parent model %0 not found',
  'eme.inherit.parentUnreadable': 'Parent model %0 could not be read',
  'eme.inherit.parentEmpty': 'Parent model %0 has no animations',
  'eme.inherit.linked': '%0 animations inherited from %1',
  'eme.inherit.linkedMissingBones':
      '%0 animations inherited from %1. These bones do not exist in this '
      + 'model and are skipped: %2',
  'eme.inherit.unlinked': '%0 unlinked',
  'eme.inherit.upToDate': 'All animations match %0',
  'eme.inherit.animationUpToDate': '%0 already matches the parent',
  'eme.inherit.notInParent': '%0 does not exist in %1',
  'eme.inherit.updated': '%0 animations updated',
  'eme.inherit.parentUpdated':
      'The parent model %0 has changed: %1 changed and %2 new animations.',
  'eme.inherit.childrenNotified':
      'These models inherit animations from this one and will offer the '
      + 'update when opened: %0',
  'eme.inherit.editWarning':
      '%0 is inherited from %1, a sync can replace this change',
};

const DE = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.action.export': 'Easy Model Entity exportieren',
  'eme.action.exportDescription': 'Exportiert das aktuelle Projekt für Easy Model Entities.',
  'eme.field.preset': 'Vorlage',
  'eme.field.namespace': 'Namespace (Mod-ID)',
  'eme.field.profileId': 'Profil-ID',
  'eme.field.targetVersion': 'Minecraft-Version',
  'eme.field.exportType': 'Export-Typ',
  'eme.field.modelType': 'Typ',
  'eme.field.customize': 'Einstellungen anpassen',
  'eme.field.includeExternalTextures': 'Externe Texturen mitliefern',
  'eme.field.includeExternalTexturesDescription':
      'Kopiert Texturen aus anderen Mods in diesen Export. Ausgeschaltet wird '
      + 'nur auf sie verwiesen. Vanilla-Texturen (minecraft:) werden nie '
      + 'kopiert.',
  'eme.field.hostEntityType': 'Host-Entität',
  'eme.field.movementType': 'Bewegungsart',
  'eme.field.bodyType': 'Körpertyp',
  'eme.field.width': 'Breite',
  'eme.field.height': 'Höhe',
  'eme.field.eyeHeight': 'Augenhöhe',
  'eme.field.speed': 'Geschwindigkeit',
  'eme.field.stepHeight': 'Schritthöhe',
  'eme.field.gravity': 'Schwerkraft',
  'eme.field.behaviorMode': 'Verhaltensmodus',
  'eme.field.maxHealth': 'Maximale Lebenspunkte',
  'eme.field.movementSpeed': 'Bewegungsgeschwindigkeit',
  'eme.field.followRange': 'Folgereichweite',
  'eme.field.scale': 'Skalierung',
  'eme.field.shadowRadius': 'Schattenradius',
  'eme.field.visibleBoundsWidth': 'Sichtbarkeitsbox-Breite (0 = auto)',
  'eme.field.visibleBoundsHeight': 'Sichtbarkeitsbox-Höhe (0 = auto)',
  'eme.field.visibleBoundsOffsetX': 'Sichtbarkeitsbox-Versatz X',
  'eme.field.visibleBoundsOffsetY': 'Sichtbarkeitsbox-Versatz Y',
  'eme.field.visibleBoundsOffsetZ': 'Sichtbarkeitsbox-Versatz Z',
  'eme.field.opacity': 'Deckkraft (0 - 1)',
  'eme.field.animationMode': 'Animationsmodus',
  'eme.field.swingSpeed': 'Schwunggeschwindigkeit',
  'eme.field.walkSpeedMultiplier': 'Geh-Geschwindigkeitsfaktor',
  'eme.field.idleStrength': 'Leerlauf-Intensität',
  'eme.field.gait': 'Gangart',
  'eme.field.variantMode': 'Animationsvarianten',
  'eme.field.variantWeight': 'Gewichtung von %0',
  'eme.field.shoulderOffsetX': 'Schulter-Versatz X',
  'eme.field.shoulderOffsetY': 'Schulter-Versatz Y',
  'eme.field.shoulderOffsetZ': 'Schulter-Versatz Z',
  'eme.field.shoulderScale': 'Schulter-Skalierung',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Abmessungen',
  'eme.section.movement': 'Bewegung',
  'eme.section.behavior': 'Verhalten',
  'eme.section.attributes': 'Attribute',
  'eme.section.rendering': 'Darstellung',
  'eme.section.animation': 'Animation',
  'eme.section.variantWeights': 'Gewichtung der Animationsvarianten',
  'eme.section.shoulder': 'Schulter',
  'eme.setting.enable_customization': 'Erweiterte Anpassung anzeigen (Easy Model Entities)',
  'eme.setting.enable_customization.description':
      'Zeigt im Export-Dialog weitere Einstellungen, etwa Größe, Bewegung, '
      + 'Verhalten, Darstellung und Animation.',
  'eme.setting.enable_experimental': 'Experimentelle Vorlagen anzeigen (Easy Model Entities)',
  'eme.setting.enable_experimental.description':
      'Zeigt die benutzerdefinierte Vorlage und Vorlagen, die noch nicht '
      + 'fertig sind.',
  'eme.preset.custom': 'Benutzerdefiniert (manuelle Einstellungen)',
  'eme.preset.static': 'Statisch (keine Animation, keine Bewegung)',
  'eme.preset.statue': 'Statue (Anzeige, keine Bewegung)',
  'eme.preset.ticking': 'Tickend (Server- + Client-Tick)',
  'eme.preset.animated': 'Animiert (durchgehende Animation)',
  'eme.preset.animated_randomly': 'Zufällig animiert (bewegt sich ab und zu)',
  'eme.preset.humanoid_still': 'Humanoid (2 Beine, stehend)',
  'eme.preset.humanoid_wandering': 'Humanoid (2 Beine, umherlaufend)',
  'eme.preset.quadruped_still': 'Vierbeiner (4 Beine, Boden, stehend)',
  'eme.preset.quadruped_wandering': 'Vierbeiner (4 Beine, Boden, umherlaufend)',
  'eme.preset.aquatic_still': 'Wassertier (Fisch, ruhend)',
  'eme.preset.aquatic_swimming': 'Wassertier (Fisch, schwimmend)',
  'eme.preset.amphibious_still': 'Amphibie (Land/Wasser, ruhend)',
  'eme.preset.amphibious_wandering': 'Amphibie (Land/Wasser, umherlaufend)',
  'eme.preset.winged_still': 'Geflügelt (Vogel, sitzend)',
  'eme.preset.winged_wandering': 'Geflügelt (Vogel, fliegend)',
  'eme.preset.winged_humanoid_still': 'Geflügelter Humanoid (stehend)',
  'eme.preset.winged_humanoid_wandering': 'Geflügelter Humanoid (umherlaufend)',
  'eme.preset.arthropod_still': 'Gliederfüßer (Insekt/Spinne, ruhend)',
  'eme.preset.arthropod_wandering': 'Gliederfüßer (Insekt/Spinne, umherlaufend)',
  'eme.preset.cuboid_still': 'Quaderförmig (blockartig, ruhend)',
  'eme.preset.cuboid_hopping': 'Quaderförmig (blockartig, hüpfend)',
  'eme.preset.floating_still': 'Schwebend (ruhend)',
  'eme.body.static': 'Statisch',
  'eme.body.biped': 'Zweibeiner (2 Beine)',
  'eme.body.quadruped': 'Vierbeiner (4 Beine)',
  'eme.body.aquatic': 'Wassertier',
  'eme.body.amphibious': 'Amphibie',
  'eme.body.winged': 'Geflügelt',
  'eme.body.winged_humanoid': 'Geflügelter Humanoid',
  'eme.body.arthropod': 'Gliederfüßer',
  'eme.body.cuboid': 'Quaderförmig',
  'eme.body.floating': 'Schwebend',
  'eme.movement.ground': 'Boden',
  'eme.movement.water': 'Wasser',
  'eme.movement.amphibious': 'Amphibisch',
  'eme.movement.static': 'Statisch',
  'eme.gait.natural': 'Natürlich',
  'eme.gait.feline': 'Katzenartig (leicht, schnell)',
  'eme.gait.ungulate': 'Huftier (schwer, langsam)',
  'eme.behavior.idle_only': 'Nur Leerlauf',
  'eme.behavior.ambient': 'Umgebung (läuft umher)',
  'eme.behavior.static': 'Statisch',
  'eme.behavior.external_owner': 'Externer Besitzer',
  'eme.animation.automatic': 'Automatisch',
  'eme.animation.random_idle': 'Zufälliger Leerlauf',
  'eme.animation.none': 'Keine',
  'eme.variant.random': 'Zufällig',
  'eme.variant.sequential': 'Der Reihe nach',
  'eme.variant.none': 'Keine (nur Basis-Clip)',
  'eme.entity.ground_entity': 'Boden-Entität',
  'eme.entity.static_entity': 'Statische Entität',
  'eme.entity.aquatic_entity': 'Wasser-Entität',
  'eme.entity.amphibious_entity': 'Amphibien-Entität',
  'eme.modelType.entity': 'Entität',
  'eme.modelType.block_entity': 'Block-Entität',
  'eme.exportType.packs': 'Komplett: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.resource_pack': 'Update: Nur Resource Pack (ZIP)',
  'eme.exportType.data_pack': 'Update: Nur Data Pack (ZIP)',
  'eme.exportType.mod_project': 'Standalone: in Mod-Projekt schreiben',
  'eme.exportType.model_only': 'Nur Modell: Mod-Integration (kein Data Pack)',
  'eme.dialog.blockingIssues': 'Blockiert den Export',
  'eme.dialog.warnings': 'Warnungen',
  'eme.action.wrapInRootBone': 'In Root-Bone einpacken',
  'eme.validator.modelLoad': 'Easy Model Entities: Modell lädt im Mod',
  'eme.message.exportBlocked': 'Der Export ist blockiert. Bitte behebe zuerst diese Probleme:',
  'eme.message.exportWarnings': 'Bitte prüfe diese Warnungen:',
  'eme.message.exportAnyway': 'Trotzdem exportieren?',
  'eme.message.overwriteTitle': 'Vorhandene Dateien überschreiben?',
  'eme.message.overwriteFiles': '%0 Datei(en) sind bereits vorhanden und werden überschrieben:',
  'eme.button.export': 'Exportieren',
  'eme.button.cancel': 'Abbrechen',
  'eme.button.overwrite': 'Überschreiben',
  'eme.validation.more': '%0 und %1 weitere',
  'eme.validation.UNSUPPORTED_ELEMENT':
      'Der Mod kann nur Würfel laden und zeigt stattdessen eine pinke Box. '
      + 'Entfernen oder ersetzen: %0',
  'eme.validation.CUBE_OUTSIDE_GROUP':
      'Würfel müssen in einer Gruppe liegen, sonst lädt der Mod das Modell '
      + 'nicht. Verschiebe sie in eine Gruppe oder klicke auf "In Root-Bone '
      + 'einpacken": %0',
  'eme.validation.MISSING_BODY_PART':
      'Der Körpertyp %0 braucht eine Gruppe mit dem Namen "%1". Ohne sie zeigt '
      + 'der Mod eine pinke Box',
  'eme.validation.FACE_UV_ROTATION_IGNORED':
      'Texturen auf Flächen lassen sich nur in 90-Grad-Schritten drehen. Diese '
      + 'Würfel zeigen die Textur ungedreht: %0',
  'eme.validation.PER_TEXTURE_UV_SIZE':
      'Der Mod nutzt für alle Texturen die UV-Größe des Projekts. Prüfe diese '
      + 'Texturen: %0',
  'eme.validation.MIXED_TEXTURES_PER_CUBE':
      'Der Mod kann nur eine Textur pro Würfel. Diese Würfel nutzen mehrere: %0',
  'eme.validation.HIDDEN_ELEMENT':
      'Ausgeblendete Teile sind im Spiel trotzdem zu sehen: %0',
  'eme.validation.DUPLICATE_GROUP_NAME':
      'Einige Gruppen haben denselben Namen. Groß- und Kleinschreibung und '
      + 'Leerzeichen am Anfang oder Ende zählen nicht. Der Mod kann diese '
      + 'Gruppen bei Animationen und gehaltenen Items nicht unterscheiden: %0',
  'eme.validation.DUPLICATE_ANIMATION_NAME':
      'Einige Animationen haben denselben Namen. Groß- und Kleinschreibung und '
      + 'Leerzeichen am Anfang oder Ende zählen nicht. Der Mod behält nur die '
      + 'letzte: %0',
  'eme.validation.TARGET_VERSION_CHANGED':
      'Der letzte Export war für Minecraft %0, dieser ist für Minecraft %1. '
      + 'Packs für verschiedene Versionen passen nicht zusammen',
  'eme.validation.NO_PAIRED_EXPORT':
      'Dieses Projekt wurde noch nie mit beiden Packs exportiert. Dieses Pack '
      + 'passt deshalb vielleicht nicht zum installierten. Exportiere lieber '
      + 'beide Packs',
  'eme.validation.INVALID_NUMERIC': '%0 muss eine Zahl sein',
  'eme.validation.range': '%0 muss zwischen %1 und %2 liegen',
  'eme.validation.positive': '%0 muss größer als 0 sein',
  'eme.validation.choice': '%0 muss einer dieser Werte sein: %1',
  'eme.validation.budget.textureSize': 'Textur größer als %0x%0',
  'eme.validation.budget.modelSize': 'Modelldatei größer als %0 MB',
  'eme.validation.budget.cubeCount': 'Mehr als %0 Würfel',
  'eme.validation.budget.boneCount': 'Mehr als %0 Bones',
  'eme.validation.budget.hierarchyDepth':
      'Gruppen sind mehr als %0 Ebenen tief verschachtelt',
  'eme.validation.INVALID_NAMESPACE':
      'Ungültiger Namespace "%0". Versuche "%1"',
  'eme.validation.INVALID_PROFILE_ID':
      'Ungültige Profil-ID "%0". Versuche "%1"',
  'eme.validation.INVALID_RESOURCE_LOCATION': 'Ungültige Host-Entität: %0',
  'eme.validation.INVALID_PRESET_TYPE': 'Ungültige Vorlage: %0',
  'eme.validation.MISSING_MODEL': 'Das Projekt hat kein Modell',
  'eme.validation.MISSING_TEXTURE': 'Das Projekt hat keine Textur',
  'eme.validation.EXTERNAL_TEXTURE_REFERENCE':
      'Diese Texturen sind nicht Teil des Exports: %0. Installiere den Mod '
      + 'oder das Pack, aus dem sie stammen, oder schalte "%1" ein',
  'eme.validation.HIGH_ANIMATION_COUNT':
      'Mehr als %0 Animationen. Der Mod lädt das Modell nicht',
  'eme.validation.SOFT_ANIMATION_COUNT': 'Mehr als %0 Animationen',
  'eme.validation.CUSTOM_ANIMATION_CLIP':
      'Diese Animationen starten nie von selbst, nur per Befehl: %0. Von '
      + 'selbst starten: %1 und nummerierte Varianten wie idle_2',
  'eme.validation.UNSUPPORTED_ANIMATION_EXPRESSION':
      'Die Animation "%0" nutzt Formeln in Keyframes. Der Mod unterstützt nur '
      + 'einfache Zahlen und überspringt diese Animation',
  'eme.validation.UNSUPPORTED_ANIMATION_CHANNEL':
      'Die Animation "%0" nutzt den Kanal "%1". Der Mod ignoriert ihn',
  'eme.validation.ANIMATIONS_NEVER_PLAYED':
      'Die Vorlage %0 hat keine Animationen, daher laufen diese nie: %1. '
      + 'Wähle eine animierte Vorlage',
  'eme.validation.DUPLICATE_TEXTURE_INDEX':
      'Textur-Slot %0 ist mehrfach belegt',
  'eme.validation.INVALID_TEXTURE_LOCATION':
      'Textur-Slot %0 verweist auf den ungültigen Ort %1. Prüfe Namespace und '
      + 'Ordner',
  'eme.validation.MISSING_TEXTURE_INDEX':
      'Textur-Slot 0 fehlt, das Modell hat keine Haupttextur',
  'eme.validation.INVALID_OUTPUT_PATH':
      'Eine zu schreibende Datei hat keinen Pfad',
  'eme.validation.PATH_TRAVERSAL':
      'Der Pfad %0 führt aus dem gewählten Ordner heraus',
  'eme.validation.ABSOLUTE_PATH':
      'Der Pfad %0 muss relativ zum gewählten Ordner sein',
  'eme.texture.custom': 'Eigene Textur',
  'eme.message.openProjectFirst': 'Öffne zuerst ein Projekt',
  'eme.message.packsExported': 'Easy Model Entities Packs exportiert',
  'eme.message.modProjectWritten':
      'Easy Model Entities Dateien in das Mod-Projekt geschrieben',
  'eme.message.exportFailed': 'Export fehlgeschlagen',
  'eme.message.unsupportedTargetVersion':
      'Minecraft %0 wird als Zielversion nicht unterstützt. Wähle im '
      + 'Export-Dialog eine andere',
  'eme.message.unexpectedError':
      'Etwas Unerwartetes ist schiefgelaufen. Wenn das erneut passiert, melde '
      + 'es bitte mit diesen Details:\n\n%0',
  'eme.message.errorDetails': 'Details: %0',
  'eme.error.noPermission':
      'Keine Berechtigung, %0 zu schreiben. Wähle einen anderen Ordner oder '
      + 'prüfe die Ordnerrechte',
  'eme.error.fileInUse':
      '%0 wird von einem anderen Programm verwendet. Schließe es und versuche '
      + 'es erneut',
  'eme.error.diskFull': 'Nicht genug Speicherplatz, um %0 zu schreiben',
  'eme.error.readOnly': '%0 liegt auf einem schreibgeschützten Laufwerk',
  'eme.error.notFound':
      'Der Ordner für %0 existiert nicht mehr. Wähle den Ordner erneut',
  'eme.message.selectResourcesDirectory': 'Ordner src/main/resources auswählen',
  'eme.inherit.title': 'Geerbte Animationen',
  'eme.inherit.permission':
      'Liest das Parent-Modell, um geerbte Animationen abzugleichen',
  'eme.inherit.action.parent': 'Animationen erben...',
  'eme.inherit.action.parentDescription':
      'Übernimmt die Animationen eines Parent-Modells und hält sie synchron.',
  'eme.inherit.action.sync': 'Geerbte Animationen abgleichen...',
  'eme.inherit.action.syncDescription':
      'Vergleicht die geerbten Animationen mit dem Parent-Modell.',
  'eme.inherit.action.takeFromParent': 'Vom Parent übernehmen',
  'eme.inherit.parentDialogTitle': 'Animationen erben',
  'eme.inherit.parentDialogInfo':
      'Wähle ein Parent-Modell. Seine Animationen werden als eigene Gruppe in '
      + 'dieses Modell kopiert und mitgespeichert, der Mod liest sie also '
      + 'weiterhin. Leere das Feld, um die Verknüpfung zu lösen.',
  'eme.inherit.parentModel': 'Parent-Modell',
  'eme.inherit.syncTitle': 'Abgleich mit %0',
  'eme.inherit.syncInfo':
      'Markierte Animationen werden durch die Version des Parent-Modells '
      + 'ersetzt. Nicht markierte bleiben unverändert.',
  'eme.inherit.status.parentChanged': 'im Parent geändert',
  'eme.inherit.status.localChanged': 'hier geändert',
  'eme.inherit.status.bothChanged': 'hier und im Parent geändert',
  'eme.inherit.status.newInParent': 'neu im Parent',
  'eme.inherit.status.removedLocally': 'hier gelöscht',
  'eme.inherit.status.missingInParent': 'nicht mehr im Parent, bleibt hier',
  'eme.inherit.detail.bones': 'Bones: %0',
  'eme.inherit.detail.setting': '%0: hier %1, im Parent %2',
  'eme.inherit.detail.missingBones': 'In diesem Modell fehlende Bones: %0',
  'eme.inherit.overwriteLocal':
      'Deine Änderungen an %0 werden durch die Parent-Version ersetzt.',
  'eme.inherit.linkReplaces':
      'Diese Animationen weichen von %0 ab und werden ersetzt: %1',
  'eme.inherit.unlinkConfirm':
      '%0 lösen? Die Animationen bleiben als normale Animationen in diesem '
      + 'Modell.',
  'eme.inherit.button.apply': 'Übernehmen',
  'eme.inherit.button.replace': 'Ersetzen',
  'eme.inherit.button.unlink': 'Lösen',
  'eme.inherit.button.openSync': 'Abgleich öffnen',
  'eme.inherit.button.later': 'Später',
  'eme.inherit.undoSync': 'Geerbte Animationen abgleichen',
  'eme.inherit.saveFirst': 'Speichere das Modell zuerst, der Parent wird '
      + 'relativ dazu gespeichert',
  'eme.inherit.linkSelf': 'Ein Modell kann nicht sein eigener Parent sein',
  'eme.inherit.parentMissing': 'Parent-Modell %0 nicht gefunden',
  'eme.inherit.parentUnreadable': 'Parent-Modell %0 konnte nicht gelesen '
      + 'werden',
  'eme.inherit.parentEmpty': 'Parent-Modell %0 hat keine Animationen',
  'eme.inherit.linked': '%0 Animationen von %1 geerbt',
  'eme.inherit.linkedMissingBones':
      '%0 Animationen von %1 geerbt. Diese Bones gibt es in diesem Modell '
      + 'nicht, sie werden übersprungen: %2',
  'eme.inherit.unlinked': '%0 gelöst',
  'eme.inherit.upToDate': 'Alle Animationen stimmen mit %0 überein',
  'eme.inherit.animationUpToDate': '%0 stimmt bereits mit dem Parent überein',
  'eme.inherit.notInParent': '%0 gibt es in %1 nicht',
  'eme.inherit.updated': '%0 Animationen aktualisiert',
  'eme.inherit.parentUpdated':
      'Das Parent-Modell %0 wurde geändert: %1 geänderte und %2 neue '
      + 'Animationen.',
  'eme.inherit.childrenNotified':
      'Diese Modelle erben Animationen von diesem und bieten das Update beim '
      + 'Öffnen an: %0',
  'eme.inherit.editWarning':
      '%0 ist von %1 geerbt, ein Abgleich kann diese Änderung ersetzen',
};

function registerTranslations() {
  if (typeof Language !== 'undefined' && typeof Language.addTranslations
      === 'function') {
    Language.addTranslations('en', EN);
    Language.addTranslations('de', DE);
  }
}

function translate(key) {
  if (typeof tl === 'function') {
    const translated = tl(key);
    if (translated && translated !== key) {
      return translated;
    }
  }

  return EN[key] || key;
}

function t(key, ...params) {
  return params.reduce(
      (text, param, index) => text.replaceAll(`%${index}`, String(param)),
      translate(key));
}

class LocalizedError extends Error {
  constructor(key, ...params) {
    super(t(key, ...params));
    this.name = 'LocalizedError';
  }
}

module.exports = {EN, DE, LocalizedError, registerTranslations, t};
