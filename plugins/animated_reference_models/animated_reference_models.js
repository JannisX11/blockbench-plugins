/// <reference path="../../types/index.d.ts" />
(function() {
'use strict';

const PLUGIN_ID = 'animated_reference_models';
const VERSION = '1.0.0';
let AnimatedReference;
let addAction, refreshAction, debugAction, debugToggleAction, unloadAction;
let changeSourceAction;
let selectAnimationListener, selectProjectListener, closeProjectListener;
let originalTimelineSetTime = null;
let originalAnimatorPreview = null;
let syncScheduled = false;
let syncing = false;
let debugEnabled = false;
const records = new Map(); // element uuid -> runtime record

function log(...args) { if (debugEnabled) console.log('[Animated Reference Models]', ...args); }
function warn(...args) { console.warn('[Animated Reference Models]', ...args); }
function projectLabel(p) { return p?.getDisplayName?.() || p?.name || p?.uuid || 'Unknown Project'; }
function logicalAnimationName(name) { return name ? String(name).split(/[.:]/).pop() : ''; }
function getProjectAnimations(project) { return Array.isArray(project?.animations) ? project.animations : []; }
function findMatchingAnimation(project, mainAnimation) {
    if (!project || !mainAnimation) return null;
    const full = String(mainAnimation.name || '');
    const short = logicalAnimationName(full);
    return getProjectAnimations(project).find(a => a.name === full)
        || getProjectAnimations(project).find(a => logicalAnimationName(a.name) === short)
        || null;
}
function findNode(project, uuid, animator) {
    const wantedName = String(animator?.name || animator?._name || '').toLowerCase();
    const pools = [project?.groups, project?.elements, project?.outliner];
    for (const pool of pools) {
        if (!Array.isArray(pool)) continue;
        const stack = pool.slice();
        while (stack.length) {
            const node = stack.pop();
            if (!node) continue;
            if (node.uuid === uuid || (wantedName && String(node.name || '').toLowerCase() === wantedName)) return node;
            if (Array.isArray(node.children)) stack.push(...node.children);
        }
    }
    return null;
}
function snapshotTransforms(root) {
    const out = [];
    root?.traverse?.(obj => out.push({obj, p: obj.position.clone(), q: obj.quaternion.clone(), s: obj.scale.clone(), v: obj.visible}));
    return out;
}
function restoreTransforms(rows) {
    for (const r of rows || []) {
        r.obj.position.copy(r.p); r.obj.quaternion.copy(r.q); r.obj.scale.copy(r.s); r.obj.visible = r.v; r.obj.updateMatrix();
    }
}
function copyTransformsByTree(source, target) {
    if (!source || !target) return;
    target.position.copy(source.position); target.quaternion.copy(source.quaternion); target.scale.copy(source.scale); target.visible = source.visible; target.updateMatrix();
    const n = Math.min(source.children.length, target.children.length);
    for (let i = 0; i < n; i++) copyTransformsByTree(source.children[i], target.children[i]);
}
function getSourceProject(element) { return ModelProject.all.find(p => p.uuid === element.project_uuid); }
function hostElements() { return AnimatedReference?.all || []; }

function buildSourceCloneMap(sourceRoot, cloneRoot) {
    const map = new Map();
    function walk(a, b) {
        if (!a || !b) return;
        map.set(a, b);
        const n = Math.min(a.children?.length || 0, b.children?.length || 0);
        for (let i = 0; i < n; i++) walk(a.children[i], b.children[i]);
    }
    walk(sourceRoot, cloneRoot);
    return map;
}
function collectProjectGroups(project) {
    const out = [];
    const seen = new Set();
    function add(node) {
        if (!node || seen.has(node)) return;
        seen.add(node);
        // Blockbench Groups are the animation bones and expose a THREE mesh.
        if (node.mesh && node.uuid) out.push(node);
        if (Array.isArray(node.children)) node.children.forEach(add);
    }
    if (Array.isArray(project?.groups)) project.groups.forEach(add);
    if (Array.isArray(project?.outliner)) project.outliner.forEach(add);
    return out;
}
function buildBoneMap(rec) {
    rec.bonesByUuid = new Map();
    rec.bonesByName = new Map();

    // IMPORTANT: An inactive ModelProject does not reliably expose its Groups through
    // project.groups/project.outliner. The rendered model_3d does survive, though, and
    // Blockbench names Group meshes with the Group UUID. Build the primary lookup from
    // OUR cloned THREE tree, completely isolated from the active host project.
    let objectCount = 0;
    rec.clone.traverse(obj => {
        objectCount++;
        const objectName = String(obj.name || '');
        if (objectName) {
            // Primary path: Blockbench Group mesh name == Group UUID.
            if (!rec.bonesByUuid.has(objectName)) {
                rec.bonesByUuid.set(objectName, {group: null, sourceObject: null, cloneObject: obj, via: 'clone-object-name'});
            }
            const lower = objectName.toLowerCase();
            if (!rec.bonesByName.has(lower)) {
                rec.bonesByName.set(lower, {group: null, sourceObject: null, cloneObject: obj, via: 'clone-object-name'});
            }
        }
    });

    // Enrich the map when Blockbench happens to expose Groups for the inactive project.
    // This is optional now; animation mapping no longer depends on it.
    const groups = collectProjectGroups(rec.source);
    let enriched = 0;
    for (const group of groups) {
        let cloneObject = rec.sourceToClone.get(group.mesh);
        if (!cloneObject) cloneObject = rec.bonesByUuid.get(String(group.uuid))?.cloneObject;
        if (!cloneObject) continue;
        const row = {group, sourceObject: group.mesh, cloneObject, via: 'project-group'};
        rec.bonesByUuid.set(String(group.uuid), row);
        const name = String(group.name || '').toLowerCase();
        if (name) rec.bonesByName.set(name, row);
        enriched++;
    }
    log(`Building bone map for ${projectLabel(rec.source)}: cloneObjects=${objectCount}, uuidKeys=${rec.bonesByUuid.size}, projectGroups=${groups.length}, enriched=${enriched}`);
}
function findSourceObjectForAnimator(rec, animatorKey, animator) {
    const ids = [animatorKey, animator?.uuid, animator?.group_uuid, animator?.group?.uuid]
        .filter(Boolean).map(String);
    for (const id of ids) {
        const row = rec.bonesByUuid?.get(id);
        if (row?.cloneObject) return row;
    }

    const group = animator?.group;
    if (group?.mesh) {
        const cloneObject = rec.sourceToClone.get(group.mesh);
        if (cloneObject) return {group, sourceObject: group.mesh, cloneObject, via: 'animator-group'};
    }

    // Secondary fallback: exact animator/bone name, still scoped ONLY to this reference.
    const names = [animator?.name, animator?._name]
        .filter(Boolean).map(v => String(v).toLowerCase());
    for (const name of names) {
        const row = rec.bonesByName?.get(name);
        if (row?.cloneObject) return row;
    }
    return null;
}
function makeProxyNode(sourceNode, cloneObject) {
    if (sourceNode) {
        const proxy = Object.create(sourceNode);
        Object.defineProperty(proxy, 'mesh', {value: cloneObject, writable: true, configurable: true});
        return proxy;
    }
    // Minimal Group-shaped proxy for an inactive source project.
    // BoneAnimator.doRender() explicitly requires group.children AND group.mesh.
    // Quaternion interpolation also reads group.scene_object.fix_rotation.
    return {
        mesh: cloneObject,
        scene_object: cloneObject,
        children: cloneObject.children || [],
        origin: [0, 0, 0],
        rotation: [0, 0, 0],
        name: cloneObject.name,
        uuid: cloneObject.name || cloneObject.uuid
    };
}
function cacheSourceGroups(rec) {
    const hostProject = Project;
    if (!rec?.source || !hostProject || rec.source === hostProject) return;
    const hostTime = Timeline.time;
    const hostSelectedAnimation = Animation.selected;
    rec.sourceGroupsByUuid = new Map();
    rec.sourceGroupsByName = new Map();
    rec.sourceBoneData = new Map();
    try {
        // V0.9 only switches context once, at runtime construction, to capture Blockbench's
        // REAL bone metadata. Crucially we store the actual THREE mesh and its fix_* values;
        // Group.mesh itself is project-context-sensitive and cannot safely be reused later.
        rec.source.select();
        if (Project !== rec.source) throw new Error('Could not activate reference project while caching Groups');
        for (const group of Group.all || []) {
            const mesh = group?.mesh;
            if (!mesh) continue;
            const uuid = String(group.uuid || '');
            const name = String(group.name || '');
            if (uuid) rec.sourceGroupsByUuid.set(uuid, group);
            if (name) rec.sourceGroupsByName.set(name.toLowerCase(), group);
            if (uuid) rec.sourceBoneData.set(uuid, {
                uuid, name,
                sourceMesh: mesh,
                fix_rotation: mesh.fix_rotation?.clone?.() || null,
                fix_position: mesh.fix_position?.clone?.() || null,
                rotation_order: mesh.rotation?.order || 'ZYX',
                child_count: group.children?.length || 0
            });
        }
        rec.sourceRest = snapshotTransforms(rec.source.model_3d);
        log(`Cached ${rec.sourceBoneData.size} real Blockbench bone descriptors for ${projectLabel(rec.source)}`);
    } catch (e) {
        warn('Failed to cache reference bone descriptors:', projectLabel(rec.source), e);
    } finally {
        try { if (Project !== hostProject) hostProject.select(); } catch (e) { warn('Failed to restore host after bone cache', e); }
        Timeline.time = hostTime;
        if (hostSelectedAnimation && (hostProject.animations || []).includes(hostSelectedAnimation)) Animation.selected = hostSelectedAnimation;
    }
}

function buildRuntime(element) {
    const source = getSourceProject(element);
    if (!source?.model_3d || !element.mesh) return null;
    element.mesh.clear();
    const clone = source.model_3d.clone(true);
    clone.name = `GobRibAnimatedReferenceClone:${projectLabel(source)}`;
    element.mesh.add(clone);
    const sourceToClone = buildSourceCloneMap(source.model_3d, clone);
    // The clone may have been created while the source tab was previewing frame 0. We keep a
    // structural snapshot for emergency restore, but V0.3 also actively writes every animated
    // channel onto clone bone meshes, so the source project itself is never touched.
    const rec = {element, source, clone, sourceToClone, rest: snapshotTransforms(clone), lastState: '', lastTime: NaN};
    buildBoneMap(rec);
    cacheSourceGroups(rec);
    records.set(element.uuid, rec);
    element.preview_controller.updateTransform(element);
    log('Runtime built:', element.name, '<-', projectLabel(source), 'objects:', sourceToClone.size);
    return rec;
}
function removeRuntime(element) {
    records.delete(element.uuid);
    try { element.mesh?.clear?.(); } catch (_) {}
}
function resetReference(rec, reason) {
    restoreTransforms(rec.rest);
    rec.clone.updateMatrixWorld?.(true);
    const state = `rest:${reason}`;
    if (rec.lastState !== state) log(rec.element.name, '-> reference base pose:', reason);
    rec.lastState = state;
}
function evaluateReference(rec, mainAnimation, time) {
    const source = rec.source;
    if (!source || !Project || source === Project || !ModelProject.all.includes(source)) return;

    const anim = findMatchingAnimation(source, mainAnimation);
    if (!anim) return resetReference(rec, `missing '${logicalAnimationName(mainAnimation?.name)}'`);
    if (!Number.isFinite(time) || time < 0 || (Number.isFinite(anim.length) && anim.length > 0 && time > anim.length + 1e-6)) {
        return resetReference(rec, 'playhead outside reference animation');
    }
    if (!rec.sourceBoneData?.size) return resetReference(rec, 'reference bone metadata not cached');

    // V0.9: evaluate directly onto the clone, but with the REAL Blockbench fix_rotation /
    // fix_position metadata captured while the reference project was active. This matters
    // because BoneAnimator.doRender() literally returns mesh.fix_rotation; without it,
    // displayFrame() silently exits before applying any channel.
    restoreTransforms(rec.rest);
    const oldTime = Timeline.time;
    let applied = 0, missing = 0, changed = 0;
    let diagnostic = null;
    try {
        Timeline.time = time;
        Animator.MolangParser?.resetVariables?.();
        Animator.resetLastValues?.();

        for (const [key, animator] of Object.entries(anim.animators || {})) {
            if (!animator || typeof animator.displayFrame !== 'function') continue;
            const uuid = String(key || animator.uuid || '');
            const meta = rec.sourceBoneData.get(uuid);
            const mapped = rec.bonesByUuid?.get(uuid) || findSourceObjectForAnimator(rec, uuid, animator);
            const target = mapped?.cloneObject || null;
            if (!meta || !target) { missing++; continue; }

            // Restore Blockbench-only metadata that THREE.Object3D.clone() does not guarantee
            // to preserve. scene_object is the same target because Group.scene_object/mesh
            // refer to the bone Object3D for this animation path.
            if (meta.fix_rotation) target.fix_rotation = meta.fix_rotation.clone?.() || meta.fix_rotation;
            if (meta.fix_position) target.fix_position = meta.fix_position.clone?.() || meta.fix_position;
            if (target.rotation && meta.rotation_order) target.rotation.order = meta.rotation_order;

            const proxy = {
                uuid: meta.uuid,
                name: meta.name,
                mesh: target,
                scene_object: target,
                children: new Array(Math.max(1, meta.child_count)),
                origin: [0, 0, 0],
                rotation: [0, 0, 0]
            };
            const before = {
                p: target.position.toArray(),
                r: [target.rotation.x, target.rotation.y, target.rotation.z],
                s: target.scale.toArray()
            };
            const oldGetGroup = animator.getGroup;
            try {
                animator.getGroup = function() { this.group = proxy; return proxy; };
                animator.displayFrame(1);
                applied++;
            } finally {
                animator.getGroup = oldGetGroup;
            }
            const after = {
                p: target.position.toArray(),
                r: [target.rotation.x, target.rotation.y, target.rotation.z],
                s: target.scale.toArray()
            };
            const delta = [...before.p, ...before.r, ...before.s].some((v, i) =>
                Math.abs(v - [...after.p, ...after.r, ...after.s][i]) > 1e-8
            );
            if (delta) changed++;
            if (!diagnostic && (meta.name === 'body' || applied === 1)) {
                diagnostic = {name: meta.name || uuid, before, after, changed: delta, hasFixRotation: !!target.fix_rotation};
            }
        }
        rec.clone.updateMatrixWorld?.(true);
    } catch (e) {
        warn('Fixed-metadata clone evaluation failed:', projectLabel(source), anim.name, e);
        return resetReference(rec, 'fixed-metadata evaluation failed');
    } finally {
        Timeline.time = oldTime;
    }

    const state = `fixed:${anim.uuid}:${time.toFixed(4)}`;
    if (rec.lastState !== state) {
        log(rec.element.name, `-> ${anim.name} @ ${time.toFixed(3)}s; applied=${applied}, changed=${changed}, missing=${missing}`);
        if (diagnostic && (forceDiagnosticTime(time) || rec.lastDiagnosticAnim !== anim.uuid)) {
            log(`Transform probe ${diagnostic.name}: changed=${diagnostic.changed}, fix_rotation=${diagnostic.hasFixRotation}`, diagnostic.before, '=>', diagnostic.after);
            rec.lastDiagnosticAnim = anim.uuid;
        }
    }
    rec.lastState = state;
    rec.lastTime = time;
}
function forceDiagnosticTime(time) {
    return Math.abs(time) < 0.002 || Math.abs(time - 0.5) < 0.008 || Math.abs(time - 1.0) < 0.008;
}


function syncAll(force = false) {
    if (syncing || !Project || !AnimatedReference) return;
    syncing = true;
    try {
        const main = Animation?.selected || Animator?.selected || null;
        const time = Number(Timeline?.time ?? 0);
        for (const element of hostElements()) {
            if (!element.mesh) continue;
            let rec = records.get(element.uuid);
            const source = getSourceProject(element);
            if (!source) { element.mesh.visible = false; continue; }
            if (!rec || rec.source !== source || !rec.clone) rec = buildRuntime(element);
            if (!rec) continue;
            element.mesh.visible = element.visibility !== false;
            if (!Modes.animate || !Animator?.open || !main) resetReference(rec, 'no active animation');
            else evaluateReference(rec, main, time);
        }
        if (force) Canvas?.updateAll?.();
    } catch (e) { warn('Synchronization failed', e); }
    finally { syncing = false; }
}
function scheduleSync(force = false) {
    if (syncScheduled) return;
    syncScheduled = true;
    requestAnimationFrame(() => { syncScheduled = false; syncAll(force); });
}

function sourceDialog(element) {
    const options = {};
    for (const p of ModelProject.all) if (p !== Project) options[p.uuid] = projectLabel(p);
    if (!Object.keys(options).length) {
        Blockbench.showMessageBox({title: 'Animated Reference Models', message: 'Open another model/project tab first.'});
        return;
    }
    new Dialog({
        id: 'animated_reference_models_source', title: element ? 'Change Animated Reference' : 'Add Animated Reference',
        form: {project: {type: 'select', label: 'Reference project', options, value: element?.project_uuid || Object.keys(options)[0]}},
        onConfirm(result) {
            const source = ModelProject.all.find(p => p.uuid === result.project);
            if (!source) return;
            if (element) {
                Undo.initEdit({elements: [element]});
                removeRuntime(element);
                element.project_uuid = source.uuid;
                element.name = projectLabel(source);
                buildRuntime(element);
                Undo.finishEdit('Change animated reference');
            } else {
                Undo.initEdit({outliner: true, elements: [], selection: true});
                const ref = new AnimatedReference({name: projectLabel(source), project_uuid: source.uuid, export: false}).init();
                ref.addTo(getCurrentGroup());
                ref.select();
                buildRuntime(ref);
                Undo.finishEdit('Add animated reference', {outliner: true, elements: [ref], selection: true});
            }
            syncAll(true);
        }
    }).show();
}
function unloadReference(element) {
    if (!(element instanceof AnimatedReference)) return;
    log('Unloading reference:', element.name);
    removeRuntime(element);
    Undo.initEdit({outliner: true, elements: [element], selection: true});
    element.remove?.();
    Undo.finishEdit('Unload animated reference', {outliner: true, elements: [], selection: true});
    Canvas?.updateAll?.();
}
function showDebug() {
    const main = Animation?.selected || Animator?.selected || null;
    const lines = hostElements().map(e => {
        const p = getSourceProject(e), a = p && main && findMatchingAnimation(p, main);
        return `${e.name}: ${p ? projectLabel(p) : 'SOURCE CLOSED'} — ${a ? a.name : 'REST/T-pose'} — ${records.get(e.uuid)?.lastState || 'not evaluated'}`;
    });
    Blockbench.showMessageBox({title: 'Animated Reference Models — Debug', message: [
        `Version: ${VERSION}`, `Host: ${projectLabel(Project)}`, `Animation: ${main?.name || '(none)'}`,
        `Time: ${Number(Timeline?.time || 0).toFixed(4)}s`, `References: ${lines.length}`, `Verbose logging: ${debugEnabled ? 'ON' : 'OFF'}`, ...lines,
        '', 'Detailed logs: Developer Tools console → [Animated Reference Models]'
    ].join('\n')});
}

Plugin.register(PLUGIN_ID, {
    title: 'Animated Reference Models',
	author: 'Muta & ChatGPT',
    description: 'Preview and synchronize animations from other open Blockbench projects as transformable reference models.',
    icon: 'movie',
	version: VERSION,
	min_version: '5.0.0',
	variant: 'both',
	tags: ['Animation', 'Workflow', 'Utility'],
    has_changelog: true,
	creation_date: '2026-10-03',
    onload() {
        AnimatedReference = class AnimatedReference extends OutlinerElement {
            constructor(data, uuid) {
                super(data, uuid);
                for (const key in AnimatedReference.properties) AnimatedReference.properties[key].reset(this);
                if (data && typeof data === 'object') this.extend(data);
            }
            extend(obj) { for (const key in AnimatedReference.properties) AnimatedReference.properties[key].merge(this, obj); this.sanitizeName(); return this; }
            getUndoCopy() { const c = new AnimatedReference(this); c.uuid = this.uuid; delete c.parent; return c; }
            getSaveCopy() { const o = {}; for (const key in AnimatedReference.properties) AnimatedReference.properties[key].copy(this, o); o.type = 'animated_reference_model'; o.uuid = this.uuid; return o; }
            remove() { removeRuntime(this); return super.remove(); }
        };
        AnimatedReference.prototype.title = 'Animated Reference';
        AnimatedReference.prototype.type = 'animated_reference_model';
        AnimatedReference.prototype.icon = 'movie';
        AnimatedReference.prototype.needsUniqueName = false;
        AnimatedReference.prototype.buttons = [Outliner.buttons.locked, Outliner.buttons.visibility];
        AnimatedReference.prototype.menu = new Menu(['animated_reference_models_change_source', '_', 'animated_reference_models_unload', '_', 'rename', 'toggle_visibility']);
        AnimatedReference.behavior = {movable: true, rotatable: true, scalable: true};
        new Property(AnimatedReference, 'string', 'name', {default: 'animated_reference'});
        new Property(AnimatedReference, 'string', 'project_uuid');
        new Property(AnimatedReference, 'vector', 'origin');
        new Property(AnimatedReference, 'vector', 'rotation');
        new Property(AnimatedReference, 'vector', 'scale', {default: [1,1,1]});
        new Property(AnimatedReference, 'boolean', 'visibility', {default: true});
        OutlinerElement.registerType(AnimatedReference, 'animated_reference_model');

        new NodePreviewController(AnimatedReference, {
            setup(element) {
                const mesh = new THREE.Object3D();
                Project.nodes_3d[element.uuid] = mesh;
                mesh.name = element.uuid; mesh.type = element.type; mesh.isElement = true;
                this.updateTransform(element); mesh.visible = element.visibility;
                if (element.project_uuid) buildRuntime(element);
            },
            updateTransform(element) {
                NodePreviewController.prototype?.updateTransform?.call?.(this, element);
            }
        });

        addAction = new Action('animated_reference_models_add', {name:'Add Animated Reference', icon:'movie', category:'edit', condition:()=>!!Project, click:()=>sourceDialog(null)});
        changeSourceAction = new Action('animated_reference_models_change_source', {name:'Change Reference Source', icon:'swap_horiz', category:'edit', condition:()=>AnimatedReference.selected?.[0], click:()=>sourceDialog(AnimatedReference.selected[0])});
        unloadAction = new Action('animated_reference_models_unload', {name:'Unload Animated Reference', icon:'delete', category:'edit', condition:()=>AnimatedReference.selected?.[0], click:()=>unloadReference(AnimatedReference.selected[0])});
        refreshAction = new Action('animated_reference_models_refresh', {name:'Refresh Animated References', icon:'refresh', category:'edit', condition:()=>!!Project, click:()=>syncAll(true)});
        debugAction = new Action('animated_reference_models_debug', {name:'Animated References Debug Info', icon:'bug_report', category:'edit', condition:()=>!!Project, click:showDebug});
        debugToggleAction = new Action('animated_reference_models_toggle_debug', {name:'Toggle Animated Reference Debug Logging', icon:'terminal', category:'edit', condition:()=>!!Project, click:()=>{ debugEnabled = !debugEnabled; Blockbench.showQuickMessage(`Animated Reference debug logging: ${debugEnabled ? 'ON' : 'OFF'}`); }});
        Interface.Panels.outliner.menu.addAction(addAction, '3');
        MenuBar.menus.edit.addAction(addAction, '6'); MenuBar.menus.edit.addAction(unloadAction, '6'); MenuBar.menus.edit.addAction(refreshAction, '6'); MenuBar.menus.edit.addAction(debugAction, '6'); MenuBar.menus.edit.addAction(debugToggleAction, '6');

        // Timeline.setTime is the authoritative path used by scrubbing AND playback.
        originalTimelineSetTime = Timeline.setTime;
        Timeline.setTime = function(...args) {
            const result = originalTimelineSetTime.apply(this, args);
            scheduleSync(false);
            return result;
        };

        // Some Blockbench paths update animation state through preview() without an observable
        // setTime call (selection, property edits, playback internals). Hook both authoritative paths.
        originalAnimatorPreview = Animator.preview;
        Animator.preview = function(...args) {
            const result = originalAnimatorPreview.apply(this, args);
            scheduleSync(false);
            return result;
        };

        selectAnimationListener = () => scheduleSync(true);
        selectProjectListener = () => scheduleSync(true);
        closeProjectListener = () => {
            for (const e of hostElements()) if (!getSourceProject(e)) { removeRuntime(e); if (e.mesh) e.mesh.visible = false; }
        };
        Blockbench.on('select_animation', selectAnimationListener);
        Blockbench.on('select_project', selectProjectListener);
        Blockbench.on('close_project', closeProjectListener);
        log(`Loaded v${VERSION}. fixed Blockbench bone-metadata clone evaluation + Timeline/Animator hooks installed.`);
    },
    onunload() {
        if (originalTimelineSetTime && Timeline.setTime !== originalTimelineSetTime) Timeline.setTime = originalTimelineSetTime;
        if (originalAnimatorPreview && Animator.preview !== originalAnimatorPreview) Animator.preview = originalAnimatorPreview;
        Blockbench.removeListener('select_animation', selectAnimationListener);
        Blockbench.removeListener('select_project', selectProjectListener);
        Blockbench.removeListener('close_project', closeProjectListener);
        addAction?.delete(); changeSourceAction?.delete(); unloadAction?.delete(); refreshAction?.delete(); debugAction?.delete(); debugToggleAction?.delete();
        for (const e of hostElements()) removeRuntime(e);
        records.clear();
        log('Unloaded; Timeline.setTime + Animator.preview restored.');
    }
});
})();
