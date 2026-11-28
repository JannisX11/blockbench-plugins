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

const path = require('path');
const {BlockbenchAdapter} = require('../BlockbenchAdapter');
const {FORMAT_ID} = require('../format/EmeFormat');
const {t} = require('../i18n/translations');
const {
  PARENT_FINGERPRINT,
  STATUS,
  PRESELECTED_STATUSES,
  LOCAL_CHANGE_STATUSES,
  fingerprintAnimation,
  boneNameSet,
  missingBones,
  isInherited,
  compareWithParent,
  createInheritedAnimation,
  needsParentUpdate
} = require('./animationInheritance');

const LINK_KEY = 'emeAnimationParent';
const PROJECT_LINK = 'eme_animation_parent';
const MESSAGE_DURATION = 4000;

const checkedParentTimes = new WeakMap();
const savedStates = new WeakMap();
const warnedAnimations = new Set();
const registrations = [];
let fingerprintProperty;
let parentAction;
let syncAction;
let animationMenuItem;
let groupMenuItem;
let nativeFileSystem;

// Blockbench 5 asks the user for every fs request of a plugin, so only an action the user started
// may ask; background checks use the module only once it was granted.
function getFileSystem(askPermission) {
  if (!nativeFileSystem) {
    nativeFileSystem = requireNativeModule('fs', askPermission
        ? {message: t('eme.inherit.permission')}
        : {show_permission_dialog: false});
  }

  return nativeFileSystem;
}

function isEmeFormat() {
  return typeof Format !== 'undefined' && Format?.id === FORMAT_ID;
}

function getLink(project = Project) {
  return project?.[PROJECT_LINK] || null;
}

function isLinked() {
  return isEmeFormat() && !!getLink();
}

function parentPathOf(project) {
  const link = getLink(project);
  if (!link || !project.save_path) {
    return null;
  }

  return path.resolve(path.dirname(project.save_path), link.path);
}

function groupNameOf(parentPath) {
  return path.basename(parentPath, path.extname(parentPath));
}

function samePath(first, second) {
  const normalize = (file) => SystemInfo.platform === 'win32'
      ? path.resolve(file).toLowerCase() : path.resolve(file);

  return normalize(first) === normalize(second);
}

function showMessage(key, ...params) {
  Blockbench.showQuickMessage(t(key, ...params), MESSAGE_DURATION);
}

function readParentAnimations(parentPath) {
  const model = JSON.parse(
      getFileSystem(true).readFileSync(parentPath, 'utf-8'));

  return Array.isArray(model.animations) ? model.animations : [];
}

function projectBones() {
  return Group.all.map((group) => ({uuid: group.uuid, name: group.name}));
}

// A check the user did not start stays silent when the parent is missing and skips a parent that
// has not changed since the last check, so switching tabs never asks twice.
function compareProjectWithParent(userStarted) {
  const parentPath = isEmeFormat() && parentPathOf(Project);
  const fs = parentPath && getFileSystem(userStarted);
  if (!fs) {
    return null;
  }

  if (!fs.existsSync(parentPath)) {
    if (userStarted) {
      showMessage('eme.inherit.parentMissing', getLink().path);
    }
    return null;
  }

  const modified = fs.statSync(parentPath).mtimeMs;
  if (!userStarted && checkedParentTimes.get(Project) === modified) {
    return null;
  }

  checkedParentTimes.set(Project, modified);
  try {
    return {
      parentPath: parentPath,
      entries: compareWithParent({
        parentAnimations: readParentAnimations(parentPath),
        childAnimations: Animation.all.map(
            (animation) => animation.getUndoCopy({}, true)),
        knownNames: getLink().known,
        groupName: groupNameOf(parentPath),
        bones: projectBones()
      })
    };
  } catch (error) {
    console.error(error);
    showMessage('eme.inherit.parentUnreadable', groupNameOf(parentPath));
    return null;
  }
}

function moveAnimation(animation, index) {
  const animations = Animation.all;
  animations.splice(animations.indexOf(animation), 1);
  animations.splice(index, 0, animation);
}

function applyEntries(entries, parentPath) {
  const groupName = groupNameOf(parentPath);
  const bones = projectBones();
  const replaced = entries.map((entry) => entry.child && Animation.all.find(
      (animation) => animation.uuid === entry.child.uuid));
  const selectedName = Animation.selected?.name;

  Undo.initEdit({animations: replaced.filter(Boolean)});
  const added = entries.map((entry, index) => {
    const existing = replaced[index];
    const position = existing ? Animation.all.indexOf(existing) : -1;
    existing?.remove(false, false);
    const animation = new Animation(
        createInheritedAnimation(entry.parent, groupName, bones)).add(false);
    if (position >= 0) {
      moveAnimation(animation, position);
    }

    return animation;
  });
  Undo.finishEdit(t('eme.inherit.undoSync'), {animations: added});
  added.find((animation) => animation.name === selectedName)?.select();

  const link = getLink();
  link.known = [...new Set([...link.known,
    ...entries.map((entry) => entry.name)])];
}

function applyWithConfirmation(entries, parentPath) {
  const overwritten = entries
  .filter((entry) => LOCAL_CHANGE_STATUSES.has(entry.status))
  .map((entry) => entry.name);
  const apply = () => {
    applyEntries(entries, parentPath);
    showMessage('eme.inherit.updated', entries.length);
  };

  if (overwritten.length > 0) {
    BlockbenchAdapter.confirm(t('eme.inherit.title'),
        t('eme.inherit.overwriteLocal', overwritten.join(', ')),
        t('eme.inherit.button.replace'), apply);
  } else {
    apply();
  }
}

function describeEntry(entry) {
  const parts = [];
  if (entry.differences?.bones.length) {
    parts.push(t('eme.inherit.detail.bones',
        entry.differences.bones.join(', ')));
  }
  (entry.differences?.settings || []).forEach((setting) => {
    parts.push(t('eme.inherit.detail.setting', setting.field,
        setting.local, setting.parent));
  });
  if (entry.missingBones.length) {
    parts.push(t('eme.inherit.detail.missingBones',
        entry.missingBones.join(', ')));
  }

  return parts.join('. ');
}

function syncFormField(entry) {
  const label = `${entry.name}: ${t(`eme.inherit.status.${entry.status}`)}`;
  if (entry.status === STATUS.MISSING_IN_PARENT) {
    return {type: 'info', text: label};
  }

  return {
    label: label,
    type: 'checkbox',
    value: PRESELECTED_STATUSES.has(entry.status),
    description: describeEntry(entry) || undefined
  };
}

function showSyncDialog({parentPath, entries}) {
  const groupName = groupNameOf(parentPath);
  const changed = entries.filter((entry) => entry.status !== STATUS.CURRENT);
  if (changed.length === 0) {
    showMessage('eme.inherit.upToDate', groupName);
    return;
  }

  const form = {intro: {type: 'info', text: t('eme.inherit.syncInfo')}};
  changed.forEach((entry, index) => {
    form[`animation_${index}`] = syncFormField(entry);
  });
  new Dialog({
    id: 'eme_animation_sync',
    title: t('eme.inherit.syncTitle', groupName),
    width: 600,
    form: form,
    buttons: [t('eme.inherit.button.apply'), t('eme.button.cancel')],
    onConfirm(result) {
      const chosen = changed.filter(
          (entry, index) => result[`animation_${index}`] === true);
      if (chosen.length > 0) {
        applyWithConfirmation(chosen, parentPath);
      }
    }
  }).show();
}

function openSyncDialog() {
  const comparison = compareProjectWithParent(true);
  if (comparison) {
    showSyncDialog(comparison);
  }
}

function takeFromParent(animation) {
  const comparison = compareProjectWithParent(true);
  if (!comparison) {
    return;
  }

  const {parentPath, entries} = comparison;
  const entry = entries.find(
      (candidate) => candidate.child?.uuid === animation.uuid);
  if (!entry || entry.status === STATUS.MISSING_IN_PARENT) {
    showMessage('eme.inherit.notInParent', animation.name,
        groupNameOf(parentPath));
  } else if (entry.status === STATUS.CURRENT) {
    showMessage('eme.inherit.animationUpToDate', animation.name);
  } else {
    applyWithConfirmation([entry], parentPath);
  }
}

function checkParent(project, userStarted) {
  if (project !== Project) {
    return;
  }

  const comparison = compareProjectWithParent(userStarted);
  if (!comparison || !needsParentUpdate(comparison.entries)) {
    return;
  }

  const countOf = (...statuses) => comparison.entries.filter(
      (entry) => statuses.includes(entry.status)).length;
  Blockbench.showMessageBox({
    title: t('eme.inherit.title'),
    message: t('eme.inherit.parentUpdated',
        groupNameOf(comparison.parentPath),
        countOf(STATUS.PARENT_CHANGED, STATUS.BOTH_CHANGED),
        countOf(STATUS.NEW_IN_PARENT)),
    buttons: [t('eme.inherit.button.openSync'), t('eme.inherit.button.later')],
    confirm: 0,
    cancel: 1
  }, (button) => {
    if (button === 0) {
      showSyncDialog(comparison);
    }
  });
}

function reportLinked(entries, parentPath) {
  const bones = projectBones();
  const missing = [...new Set(
      entries.flatMap((entry) => missingBones(entry.parent, bones)))];
  if (missing.length > 0) {
    Blockbench.showMessageBox({
      title: t('eme.inherit.title'),
      message: t('eme.inherit.linkedMissingBones', entries.length,
          groupNameOf(parentPath), missing.join(', '))
    });
  } else {
    showMessage('eme.inherit.linked', entries.length, groupNameOf(parentPath));
  }
}

function linkParent(parentPath) {
  if (samePath(parentPath, Project.save_path)) {
    showMessage('eme.inherit.linkSelf');
    return;
  }

  const fs = getFileSystem(true);
  if (!fs) {
    return;
  }

  let parentAnimations;
  try {
    parentAnimations = readParentAnimations(parentPath);
  } catch (error) {
    console.error(error);
    showMessage('eme.inherit.parentUnreadable', groupNameOf(parentPath));
    return;
  }
  if (parentAnimations.length === 0) {
    showMessage('eme.inherit.parentEmpty', groupNameOf(parentPath));
    return;
  }

  const boneNames = boneNameSet(projectBones());
  const entries = parentAnimations.map((parent) => ({
    name: parent.name,
    parent: parent,
    child: Animation.all.find((animation) => animation.name === parent.name)
  }));
  const replaced = entries
  .filter((entry) => entry.child
      && fingerprintAnimation(entry.child.getUndoCopy(), boneNames)
      !== fingerprintAnimation(entry.parent, boneNames))
  .map((entry) => entry.name);
  const link = () => {
    Project[PROJECT_LINK] = {
      path: path.relative(path.dirname(Project.save_path), parentPath)
      .split(path.sep).join('/'),
      known: []
    };
    applyEntries(entries, parentPath);
    checkedParentTimes.set(Project, fs.statSync(parentPath).mtimeMs);
    reportLinked(entries, parentPath);
  };

  if (replaced.length > 0) {
    BlockbenchAdapter.confirm(t('eme.inherit.title'),
        t('eme.inherit.linkReplaces', groupNameOf(parentPath),
            replaced.join(', ')),
        t('eme.inherit.button.replace'), link);
  } else {
    link();
  }
}

function unlinkParent() {
  const groupName = groupNameOf(getLink().path);
  BlockbenchAdapter.confirm(t('eme.inherit.title'),
      t('eme.inherit.unlinkConfirm', groupName),
      t('eme.inherit.button.unlink'), () => {
        const inherited = Animation.all.filter(
            (animation) => isInherited(animation, groupName));
        Undo.initEdit({animations: inherited});
        inherited.forEach((animation) => {
          animation[PARENT_FINGERPRINT] = '';
          animation.group_name = '';
        });
        Undo.finishEdit(t('eme.inherit.button.unlink'),
            {animations: inherited});
        delete Project[PROJECT_LINK];
        Project.saved = false;
        showMessage('eme.inherit.unlinked', groupName);
      });
}

function openParentDialog() {
  if (!Project?.save_path) {
    showMessage('eme.inherit.saveFirst');
    return;
  }

  const currentParent = parentPathOf(Project) || '';
  new Dialog({
    id: 'eme_animation_parent',
    title: t('eme.inherit.parentDialogTitle'),
    width: 560,
    form: {
      info: {type: 'info', text: t('eme.inherit.parentDialogInfo')},
      parent: {
        label: t('eme.inherit.parentModel'),
        type: 'file',
        extensions: ['bbmodel'],
        filetype: 'Blockbench Model',
        value: currentParent
      }
    },
    onConfirm(result) {
      const chosen = String(result.parent || '').trim();
      if (!chosen) {
        if (getLink()) {
          unlinkParent();
        }
      } else if (currentParent && samePath(chosen, currentParent)) {
        openSyncDialog();
      } else {
        linkParent(chosen);
      }
    }
  }).show();
}

function findChildModels(parentPath) {
  const fs = getFileSystem(false);
  if (!fs) {
    return [];
  }

  const folder = path.dirname(parentPath);

  return fs.readdirSync(folder)
  .filter((file) => file.endsWith('.bbmodel'))
  .map((file) => path.join(folder, file))
  .filter((file) => !samePath(file, parentPath))
  .filter((file) => {
    try {
      const text = fs.readFileSync(file, 'utf-8');
      if (!text.includes(LINK_KEY)) {
        return false;
      }

      const linkPath = JSON.parse(text)[LINK_KEY]?.path;
      return typeof linkPath === 'string'
          && samePath(path.resolve(folder, linkPath), parentPath);
    } catch (error) {
      console.warn(`[Easy Model Entities] Skipped unreadable ${file}:`, error);
      return false;
    }
  })
  .map((file) => path.basename(file, '.bbmodel'));
}

function notifyChildModels(project) {
  try {
    const children = findChildModels(project.save_path);
    if (children.length > 0) {
      Blockbench.showToastNotification({
        text: t('eme.inherit.childrenNotified', children.join(', ')),
        icon: 'sync',
        expire: 6000
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function handleSavedStateChanged({project, saved}) {
  const wasUnsaved = savedStates.get(project) === false;
  savedStates.set(project, saved);
  if (saved && wasUnsaved && project.save_path
      && project.format?.id === FORMAT_ID) {
    notifyChildModels(project);
  }
}

function editedAnimations(aspects) {
  const before = Undo.current_save?.aspects?.animations || [];
  const edited = (aspects?.animations || []).filter(
      (animation) => before.includes(animation));
  if (aspects?.keyframes?.length && Animation.selected) {
    edited.push(Animation.selected);
  }

  return edited;
}

// A sync adds new animation objects and an unlink clears the fingerprint first, so neither of
// them triggers this warning.
function handleFinishEdit({aspects}) {
  if (!isLinked()) {
    return;
  }

  const groupName = groupNameOf(getLink().path);
  const animation = editedAnimations(aspects).find(
      (candidate) => isInherited(candidate, groupName)
          && !warnedAnimations.has(candidate.uuid));
  if (animation) {
    warnedAnimations.add(animation.uuid);
    showMessage('eme.inherit.editWarning', animation.name, groupName);
  }
}

function handleCompile({model}) {
  if (isLinked()) {
    model[LINK_KEY] = getLink();
  }
}

function handleParse({model}) {
  const link = model?.[LINK_KEY];
  if (typeof link?.path === 'string' && link.path) {
    Project[PROJECT_LINK] = {
      path: link.path,
      known: Array.isArray(link.known) ? link.known : []
    };
  }
}

function handleParsed() {
  const project = Project;
  setTimeout(() => checkParent(project, true), 0);
}

function registerAnimationInheritance() {
  // Blockbench's default merge skips a property whose condition fails, and this condition reads the
  // animation's own value, so without the custom merge a new animation would never load it.
  fingerprintProperty = new Property(Animation, 'string', PARENT_FINGERPRINT, {
    condition: (animation) => !!animation?.[PARENT_FINGERPRINT],
    merge(animation, data) {
      animation[PARENT_FINGERPRINT] =
          typeof data[PARENT_FINGERPRINT] === 'string'
              ? data[PARENT_FINGERPRINT] : '';
    }
  });

  parentAction = new Action('eme_animation_parent', {
    name: t('eme.inherit.action.parent'),
    description: t('eme.inherit.action.parentDescription'),
    icon: 'account_tree',
    condition: isEmeFormat,
    click: openParentDialog
  });
  syncAction = new Action('eme_animation_sync', {
    name: t('eme.inherit.action.sync'),
    description: t('eme.inherit.action.syncDescription'),
    icon: 'sync',
    condition: isLinked,
    click: openSyncDialog
  });
  MenuBar.addAction(parentAction, 'animation.#file');
  MenuBar.addAction(syncAction, 'animation.#file');

  animationMenuItem = {
    id: 'eme_animation_take_parent',
    name: t('eme.inherit.action.takeFromParent'),
    icon: 'sync',
    condition: (animation) => isLinked() && !!animation
        && isInherited(animation, groupNameOf(getLink().path)),
    click: takeFromParent
  };
  groupMenuItem = {
    id: 'eme_animation_sync_group',
    name: t('eme.inherit.action.sync'),
    icon: 'sync',
    condition: (groupName) => isLinked()
        && groupName === groupNameOf(getLink().path),
    click: openSyncDialog
  };
  Animation.prototype.menu.addAction(animationMenuItem);
  Animation.prototype.group_menu?.addAction(groupMenuItem);

  registrations.push(
      Codecs.project.on('compile', handleCompile),
      Codecs.project.on('parse', handleParse),
      Codecs.project.on('parsed', handleParsed),
      Blockbench.on('select_project',
          ({project}) => checkParent(project, false)),
      Blockbench.on('finish_edit', handleFinishEdit),
      Blockbench.on('saved_state_changed', handleSavedStateChanged));
}

function unregisterAnimationInheritance() {
  registrations.splice(0).forEach((registration) => registration?.delete?.());
  if (animationMenuItem) {
    Animation.prototype.menu.removeAction(animationMenuItem);
    Animation.prototype.group_menu?.removeAction(groupMenuItem);
  }
  parentAction?.delete();
  syncAction?.delete();
  fingerprintProperty?.delete();
  parentAction = null;
  syncAction = null;
  animationMenuItem = null;
  groupMenuItem = null;
  fingerprintProperty = null;
}

module.exports = {
  registerAnimationInheritance,
  unregisterAnimationInheritance
};
