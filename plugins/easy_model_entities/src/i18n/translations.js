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

// Descriptive, human-readable labels so users see e.g. "Quadruped (4 legs,
// ground, standing)" instead of the cryptic "quadruped_still". Registered with
// Blockbench's translation system; falls back to English outside Blockbench.

const EN = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.field.preset': 'Preset',
  'eme.field.namespace': 'Namespace (mod id)',
  'eme.field.profileId': 'Profile ID',
  'eme.field.targetVersion': 'Minecraft Version',
  'eme.field.exportType': 'Export Type',
  'eme.field.modelType': 'Type',
  'eme.field.customize': 'Customize settings',
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
  'eme.field.animationMode': 'Animation Mode',
  'eme.field.swingSpeed': 'Swing Speed',
  'eme.field.walkSpeedMultiplier': 'Walk Speed Multiplier',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Dimensions',
  'eme.section.movement': 'Movement',
  'eme.section.behavior': 'Behavior',
  'eme.section.attributes': 'Attributes',
  'eme.section.rendering': 'Rendering',
  'eme.section.animation': 'Animation',
  'eme.setting.enable_customization': 'Show advanced customization (Easy Model Entities)',
  'eme.setting.enable_experimental': 'Show experimental presets (Easy Model Entities)',
  'eme.preset.custom': 'Custom (manual settings)',
  'eme.preset.static': 'Static (no animation, no movement)',
  'eme.preset.statue': 'Statue (display, no movement)',
  'eme.preset.ticking': 'Ticking (server + client tick)',
  'eme.preset.animated': 'Animated (continuous animation)',
  'eme.preset.animated_randomly': 'Animated randomly (random idle bursts)',
  'eme.preset.humanoid_still': 'Humanoid (2 legs, standing)',
  'eme.preset.humanoid_wandering': 'Humanoid (2 legs, wandering)',
  'eme.preset.quadruped_still': 'Quadruped (4 legs, ground, standing)',
  'eme.preset.quadruped_wandering': 'Quadruped (4 legs, ground, wandering)',
  'eme.preset.aquatic_still': 'Aquatic (fish, still)',
  'eme.preset.aquatic_swimming': 'Aquatic (fish, swimming)',
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
  'eme.body.winged': 'Winged',
  'eme.body.winged_humanoid': 'Winged humanoid',
  'eme.body.arthropod': 'Arthropod',
  'eme.body.cuboid': 'Cuboid',
  'eme.body.floating': 'Floating',
  'eme.movement.ground': 'Ground',
  'eme.movement.static': 'Static',
  'eme.behavior.idle_only': 'Idle only',
  'eme.behavior.ambient': 'Ambient (wanders)',
  'eme.behavior.static': 'Static',
  'eme.behavior.external_owner': 'External owner',
  'eme.animation.automatic': 'Automatic',
  'eme.animation.random_idle': 'Random idle',
  'eme.animation.none': 'None',
  'eme.entity.ground_entity': 'Ground entity',
  'eme.entity.static_entity': 'Static entity',
  'eme.modelType.entity': 'Entity',
  'eme.modelType.block_entity': 'Block Entity',
  'eme.exportType.packs': 'Standalone: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.mod_project': 'Standalone: write into mod project',
  'eme.exportType.model_only': 'Model only: mod integration (no data pack)'
};

const DE = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.field.preset': 'Vorlage',
  'eme.field.namespace': 'Namespace (Mod-ID)',
  'eme.field.profileId': 'Profil-ID',
  'eme.field.targetVersion': 'Minecraft-Version',
  'eme.field.exportType': 'Export-Typ',
  'eme.field.modelType': 'Typ',
  'eme.field.customize': 'Einstellungen anpassen',
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
  'eme.field.animationMode': 'Animationsmodus',
  'eme.field.swingSpeed': 'Schwunggeschwindigkeit',
  'eme.field.walkSpeedMultiplier': 'Geh-Geschwindigkeitsfaktor',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Abmessungen',
  'eme.section.movement': 'Bewegung',
  'eme.section.behavior': 'Verhalten',
  'eme.section.attributes': 'Attribute',
  'eme.section.rendering': 'Darstellung',
  'eme.section.animation': 'Animation',
  'eme.setting.enable_customization': 'Erweiterte Anpassung anzeigen (Easy Model Entities)',
  'eme.setting.enable_experimental': 'Experimentelle Presets anzeigen (Easy Model Entities)',
  'eme.preset.custom': 'Benutzerdefiniert (manuelle Einstellungen)',
  'eme.preset.static': 'Statisch (keine Animation, keine Bewegung)',
  'eme.preset.statue': 'Statue (Anzeige, keine Bewegung)',
  'eme.preset.ticking': 'Tickend (Server- + Client-Tick)',
  'eme.preset.animated': 'Animiert (durchgehende Animation)',
  'eme.preset.animated_randomly': 'Zufällig animiert (zufällige Leerlauf-Schübe)',
  'eme.preset.humanoid_still': 'Humanoid (2 Beine, stehend)',
  'eme.preset.humanoid_wandering': 'Humanoid (2 Beine, umherlaufend)',
  'eme.preset.quadruped_still': 'Vierbeiner (4 Beine, Boden, stehend)',
  'eme.preset.quadruped_wandering': 'Vierbeiner (4 Beine, Boden, umherlaufend)',
  'eme.preset.aquatic_still': 'Wassertier (Fisch, ruhend)',
  'eme.preset.aquatic_swimming': 'Wassertier (Fisch, schwimmend)',
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
  'eme.body.winged': 'Geflügelt',
  'eme.body.winged_humanoid': 'Geflügelter Humanoid',
  'eme.body.arthropod': 'Gliederfüßer',
  'eme.body.cuboid': 'Quaderförmig',
  'eme.body.floating': 'Schwebend',
  'eme.movement.ground': 'Boden',
  'eme.movement.static': 'Statisch',
  'eme.behavior.idle_only': 'Nur Leerlauf',
  'eme.behavior.ambient': 'Umgebung (läuft umher)',
  'eme.behavior.static': 'Statisch',
  'eme.behavior.external_owner': 'Externer Besitzer',
  'eme.animation.automatic': 'Automatisch',
  'eme.animation.random_idle': 'Zufälliger Leerlauf',
  'eme.animation.none': 'Keine',
  'eme.entity.ground_entity': 'Boden-Entität',
  'eme.entity.static_entity': 'Statische Entität',
  'eme.modelType.entity': 'Entität',
  'eme.modelType.block_entity': 'Block-Entität',
  'eme.exportType.packs': 'Standalone: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.mod_project': 'Standalone: in Mod-Projekt schreiben',
  'eme.exportType.model_only': 'Nur Modell: Mod-Integration (kein Data Pack)'
};

function registerTranslations() {
  if (typeof Language !== 'undefined' && typeof Language.addTranslations
      === 'function') {
    Language.addTranslations('en', EN);
    Language.addTranslations('de', DE);
  }
}

// Resolves a key via Blockbench's tl() when available, otherwise English.
function t(key) {
  if (typeof tl === 'function') {
    const translated = tl(key);
    if (translated && translated !== key) {
      return translated;
    }
  }

  return EN[key] || key;
}

module.exports = {EN, DE, registerTranslations, t};
