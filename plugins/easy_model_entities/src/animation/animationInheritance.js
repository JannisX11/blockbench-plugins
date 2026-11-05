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

const {normalizeName} = require('../model/presetTypes');
const {hashString} = require('../utils/hash');

const PARENT_FINGERPRINT = 'eme_parent_fingerprint';

const STATUS = Object.freeze({
  CURRENT: 'current',
  PARENT_CHANGED: 'parentChanged',
  LOCAL_CHANGED: 'localChanged',
  BOTH_CHANGED: 'bothChanged',
  NEW_IN_PARENT: 'newInParent',
  REMOVED_LOCALLY: 'removedLocally',
  MISSING_IN_PARENT: 'missingInParent'
});

const PRESELECTED_STATUSES = new Set(
    [STATUS.PARENT_CHANGED, STATUS.NEW_IN_PARENT]);
const PARENT_UPDATE_STATUSES = new Set(
    [STATUS.PARENT_CHANGED, STATUS.BOTH_CHANGED, STATUS.NEW_IN_PARENT]);
const LOCAL_CHANGE_STATUSES = new Set(
    [STATUS.LOCAL_CHANGED, STATUS.BOTH_CHANGED]);

const BEZIER_FIELDS = ['bezier_linked', 'bezier_left_time',
  'bezier_left_value', 'bezier_right_time', 'bezier_right_value'];
const MOLANG_FIELDS = ['anim_time_update', 'blend_weight', 'start_delay',
  'loop_delay'];

function canonicalValue(value) {
  if (typeof value === 'number') {
    return Number(value.toFixed(4));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed !== '' && Number.isFinite(Number(trimmed))) {
      return Number(Number(trimmed).toFixed(4));
    }

    return trimmed;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalValue);
  }

  return value ?? '';
}

function canonicalObject(object) {
  return Object.fromEntries(Object.keys(object || {}).sort()
  .map((key) => [key, canonicalValue(object[key])]));
}

function canonicalKeyframe(keyframe) {
  const interpolation = keyframe.interpolation || 'linear';
  const canonical = {
    channel: keyframe.channel,
    time: canonicalValue(keyframe.time),
    interpolation: interpolation,
    data_points: (keyframe.data_points || []).map(canonicalObject)
  };
  if (interpolation === 'bezier') {
    BEZIER_FIELDS.forEach((field) => {
      canonical[field] = canonicalValue(keyframe[field]);
    });
  }

  return canonical;
}

function compareKeyframes(first, second) {
  if (first.channel !== second.channel) {
    return first.channel < second.channel ? -1 : 1;
  }

  return first.time - second.time;
}

function isBone(animator) {
  return !animator.type || animator.type === 'bone';
}

function isKnownBone(animator, boneNames) {
  return !boneNames || !isBone(animator)
      || boneNames.has(normalizeName(animator.name));
}

function animatedAnimators(animation) {
  return Object.values(animation.animators || {})
  .filter((animator) => (animator.keyframes || []).length > 0);
}

function canonicalAnimators(animation, boneNames) {
  const animators = {};
  animatedAnimators(animation)
  .filter((animator) => isKnownBone(animator, boneNames))
  .forEach((animator) => {
    animators[`${animator.type || 'bone'}:${normalizeName(animator.name)}`] =
        JSON.stringify({
          rotation_global: !!animator.rotation_global,
          quaternion_interpolation: !!animator.quaternion_interpolation,
          keyframes: animator.keyframes.map(canonicalKeyframe).sort(
              compareKeyframes)
        });
  });

  return animators;
}

function canonicalSettings(animation) {
  const settings = {
    length: canonicalValue(animation.length),
    loop: animation.loop || 'once',
    override: !!animation.override
  };
  MOLANG_FIELDS.forEach((field) => {
    settings[field] = canonicalValue(animation[field]);
  });

  return settings;
}

function fingerprintAnimation(animation, boneNames) {
  const animators = canonicalAnimators(animation, boneNames);

  return hashString(JSON.stringify({
    settings: canonicalSettings(animation),
    animators: Object.keys(animators).sort().map(
        (key) => [key, animators[key]])
  }));
}

function boneNameSet(bones) {
  return new Set(bones.map((bone) => normalizeName(bone.name)));
}

function describeDifferences(parentAnimation, childAnimation, boneNames) {
  const parentAnimators = canonicalAnimators(parentAnimation, boneNames);
  const childAnimators = canonicalAnimators(childAnimation, boneNames);
  const keys = new Set(
      [...Object.keys(parentAnimators), ...Object.keys(childAnimators)]);
  const bones = [...keys]
  .filter((key) => parentAnimators[key] !== childAnimators[key])
  .map((key) => key.slice(key.indexOf(':') + 1))
  .sort();
  const parentSettings = canonicalSettings(parentAnimation);
  const childSettings = canonicalSettings(childAnimation);
  const settings = Object.keys(parentSettings)
  .filter((field) => parentSettings[field] !== childSettings[field])
  .map((field) => ({
    field: field,
    local: childSettings[field],
    parent: parentSettings[field]
  }));

  return {bones, settings};
}

function missingBones(parentAnimation, bones) {
  const boneNames = boneNameSet(bones);

  return animatedAnimators(parentAnimation)
  .filter((animator) => !isKnownBone(animator, boneNames))
  .map((animator) => String(animator.name || ''));
}

function isInherited(animation, groupName) {
  return !!animation[PARENT_FINGERPRINT]
      && (animation.group_name || '') === groupName;
}

function inheritedStatus(parent, child, boneNames) {
  const parentFingerprint = fingerprintAnimation(parent, boneNames);
  const childFingerprint = fingerprintAnimation(child, boneNames);
  if (parentFingerprint === childFingerprint) {
    return STATUS.CURRENT;
  }

  if (parentFingerprint === child[PARENT_FINGERPRINT]) {
    return STATUS.LOCAL_CHANGED;
  }

  return childFingerprint === child[PARENT_FINGERPRINT]
      ? STATUS.PARENT_CHANGED : STATUS.BOTH_CHANGED;
}

function compareWithParent(
    {parentAnimations, childAnimations, knownNames, groupName, bones}) {
  const boneNames = boneNameSet(bones);
  const known = new Set(knownNames || []);
  const childrenByName = new Map(
      childAnimations.map((animation) => [animation.name, animation]));
  const parentNames = new Set(parentAnimations.map((parent) => parent.name));

  const entries = parentAnimations
  .map((parent) => ({parent, child: childrenByName.get(parent.name)}))
  .filter(({child}) => !child || isInherited(child, groupName))
  .map(({parent, child}) => {
    const entry = {
      name: parent.name,
      parent: parent,
      child: child,
      missingBones: missingBones(parent, bones)
    };
    if (!child) {
      return {
        ...entry,
        status: known.has(parent.name) ? STATUS.REMOVED_LOCALLY
            : STATUS.NEW_IN_PARENT
      };
    }

    const status = inheritedStatus(parent, child, boneNames);

    return {
      ...entry,
      status: status,
      differences: status === STATUS.CURRENT ? null
          : describeDifferences(parent, child, boneNames)
    };
  });

  childAnimations
  .filter((child) => isInherited(child, groupName)
      && !parentNames.has(child.name))
  .forEach((child) => entries.push({
    name: child.name,
    child: child,
    missingBones: [],
    status: STATUS.MISSING_IN_PARENT
  }));

  return entries;
}

function remapAnimators(animators, bones) {
  const byUuid = new Map(bones.map((bone) => [bone.uuid, bone]));
  const byName = new Map(bones.map((bone) => [normalizeName(bone.name), bone]));
  const remapped = {};
  Object.entries(animators || {}).forEach(([key, animator]) => {
    if (!isBone(animator)) {
      remapped[key] = animator;
      return;
    }

    const bone = byUuid.get(key) || byName.get(normalizeName(animator.name));
    if (bone) {
      remapped[bone.uuid] = {...animator, name: bone.name};
    }
  });

  return remapped;
}

function createInheritedAnimation(parentAnimation, groupName, bones) {
  const data = structuredClone(parentAnimation);
  delete data.uuid;
  delete data.selected;
  data.animators = remapAnimators(data.animators, bones);
  data.group_name = groupName;
  data[PARENT_FINGERPRINT] = fingerprintAnimation(parentAnimation,
      boneNameSet(bones));

  return data;
}

function needsParentUpdate(entries) {
  return entries.some((entry) => PARENT_UPDATE_STATUSES.has(entry.status));
}

module.exports = {
  PARENT_FINGERPRINT,
  STATUS,
  PRESELECTED_STATUSES,
  LOCAL_CHANGE_STATUSES,
  fingerprintAnimation,
  boneNameSet,
  missingBones,
  isInherited,
  compareWithParent,
  remapAnimators,
  createInheritedAnimation,
  needsParentUpdate
};
