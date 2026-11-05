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

const {
  PARENT_FINGERPRINT,
  STATUS,
  fingerprintAnimation,
  boneNameSet,
  missingBones,
  compareWithParent,
  remapAnimators,
  createInheritedAnimation,
  needsParentUpdate
} = require('../animation/animationInheritance');

const GROUP = 'base_hand';
const BONES = [{uuid: 'child-palm', name: 'palm'},
  {uuid: 'child-thumb', name: 'thumb'}];

function keyframe(time, x, channel = 'rotation') {
  return {
    channel: channel,
    time: time,
    interpolation: 'linear',
    data_points: [{x: x, y: '0', z: '0'}]
  };
}

function animation(name, rotation, extra = {}) {
  return {
    name: name,
    loop: 'loop',
    override: false,
    length: 1,
    animators: {
      'parent-palm': {
        name: 'palm',
        type: 'bone',
        keyframes: [keyframe(0, '0'), keyframe(1, rotation)]
      }
    },
    ...extra
  };
}

function inherited(parent, extra = {}) {
  return {
    ...createInheritedAnimation(parent, GROUP, BONES),
    uuid: `child-${parent.name}`,
    ...extra
  };
}

function compare(parentAnimations, childAnimations, knownNames = []) {
  return compareWithParent({
    parentAnimations,
    childAnimations,
    knownNames,
    groupName: GROUP,
    bones: BONES
  });
}

function statusOf(entries, name) {
  return entries.find((entry) => entry.name === name)?.status;
}

describe('fingerprintAnimation', () => {
  test('ignores number formatting, key order and empty animators', () => {
    const parent = animation('idle', '10');
    const child = animation('idle', 10.00001);
    child.animators['parent-palm'].keyframes.reverse();
    child.animators['parent-palm'].keyframes[0].data_points =
        [{z: 0, y: 0, x: 10}];
    child.animators.empty = {name: 'thumb', type: 'bone', keyframes: []};
    child.uuid = 'other';
    child.selected = true;

    expect(fingerprintAnimation(child)).toBe(fingerprintAnimation(parent));
  });

  test('changes with keyframe values and settings', () => {
    const parent = animation('idle', '10');

    expect(fingerprintAnimation(animation('idle', '20'))).not.toBe(
        fingerprintAnimation(parent));
    expect(fingerprintAnimation(animation('idle', '10', {length: 2}))).not.toBe(
        fingerprintAnimation(parent));
    expect(fingerprintAnimation(animation('idle', '10', {loop: 'hold'}))).not
    .toBe(fingerprintAnimation(parent));
  });

  test('treats missing loop and override as their defaults', () => {
    const parent = animation('attack', '10', {loop: 'once'});
    const child = animation('attack', '10');
    delete child.loop;
    delete child.override;

    expect(fingerprintAnimation(child)).toBe(fingerprintAnimation(parent));
  });

  test('skips bones the child model does not have', () => {
    const parent = animation('idle', '10');
    parent.animators.tail = {
      name: 'tail',
      type: 'bone',
      keyframes: [keyframe(0, '5')]
    };

    expect(fingerprintAnimation(parent, boneNameSet(BONES))).toBe(
        fingerprintAnimation(animation('idle', '10'), boneNameSet(BONES)));
    expect(missingBones(parent, BONES)).toEqual(['tail']);
  });
});

describe('compareWithParent', () => {
  test('reports every status', () => {
    const current = animation('current', '10');
    const parentChanged = animation('parent_changed', '20');
    const localChanged = animation('local_changed', '10');
    const bothChanged = animation('both_changed', '20');
    const parents = [current, parentChanged, localChanged, bothChanged,
      animation('new', '10'), animation('removed', '10')];
    const children = [
      inherited(current),
      inherited(animation('parent_changed', '10')),
      {...inherited(localChanged), length: 2},
      {...inherited(animation('both_changed', '10')), length: 2},
      inherited(animation('gone', '10'))
    ];

    const entries = compare(parents, children, ['removed']);

    expect(statusOf(entries, 'current')).toBe(STATUS.CURRENT);
    expect(statusOf(entries, 'parent_changed')).toBe(STATUS.PARENT_CHANGED);
    expect(statusOf(entries, 'local_changed')).toBe(STATUS.LOCAL_CHANGED);
    expect(statusOf(entries, 'both_changed')).toBe(STATUS.BOTH_CHANGED);
    expect(statusOf(entries, 'new')).toBe(STATUS.NEW_IN_PARENT);
    expect(statusOf(entries, 'removed')).toBe(STATUS.REMOVED_LOCALLY);
    expect(statusOf(entries, 'gone')).toBe(STATUS.MISSING_IN_PARENT);
    expect(needsParentUpdate(entries)).toBe(true);
  });

  test('names the changed bones and settings', () => {
    const parent = animation('idle', '20', {length: 2});
    const entries = compare([parent], [inherited(animation('idle', '10'))]);

    expect(entries[0].differences).toEqual({
      bones: ['palm'],
      settings: [{field: 'length', local: 1, parent: 2}]
    });
  });

  test('leaves own animations with the same name alone', () => {
    const entries = compare([animation('idle', '20')],
        [animation('idle', '10')]);

    expect(entries).toEqual([]);
    expect(needsParentUpdate(entries)).toBe(false);
  });

  test('ignores inherited animations of another parent group', () => {
    const child = {...inherited(animation('idle', '10')), group_name: 'other'};
    const entries = compare([animation('idle', '20')], [child]);

    expect(entries).toEqual([]);
  });
});

describe('createInheritedAnimation', () => {
  test('maps bones to the child by uuid or name and drops unknown bones',
      () => {
        const remapped = remapAnimators({
          'child-thumb': {name: 'old_name', type: 'bone', keyframes: []},
          'parent-palm': {name: 'Palm', type: 'bone', keyframes: []},
          'parent-tail': {name: 'tail', type: 'bone', keyframes: []},
          effects: {name: 'Effects', type: 'effect', keyframes: []}
        }, BONES);

        expect(Object.keys(remapped).sort()).toEqual(
            ['child-palm', 'child-thumb', 'effects']);
        expect(remapped['child-palm'].name).toBe('palm');
        expect(remapped['child-thumb'].name).toBe('thumb');
      });

  test('copies the parent into the group with its fingerprint', () => {
    const parent = {...animation('idle', '10'), uuid: 'parent', selected: true};
    const copy = createInheritedAnimation(parent, GROUP, BONES);

    expect(copy.uuid).toBeUndefined();
    expect(copy.selected).toBeUndefined();
    expect(copy.group_name).toBe(GROUP);
    expect(copy[PARENT_FINGERPRINT]).toBe(
        fingerprintAnimation(parent, boneNameSet(BONES)));
    expect(Object.keys(copy.animators)).toEqual(['child-palm']);
    expect(parent.animators['parent-palm']).toBeDefined();
  });
});
