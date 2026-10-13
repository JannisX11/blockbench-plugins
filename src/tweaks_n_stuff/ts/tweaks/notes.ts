import { ToggleTweak } from "./base";
import type * as THREE from "three";

const Three = (globalThis as any).THREE as typeof import("three");
const NOTE_TEXTURE_WIDTH = 512;
const NOTE_TOOLBAR_HEIGHT = 64;

type NoteEntry = { id: string; author: string; text: string; elements: string[] };
type NotedElement = OutlinerElement;
type NotesProject = ModelProject & { notes?: NoteEntry[] };
const SESSION_NOTE_TAG = "tweaks_n_stuff_note";
const authorKey = (author: string): string => author.trim().toLowerCase();
const isNoteOffset = (value: unknown): value is [number, number] =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every((part) => typeof part === "number" && Number.isFinite(part));
const authorColor = (author: string): string => {
  let hash = 2166136261;
  for (const character of author.trim().toLowerCase()) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  }
  return `hsl(${(hash >>> 0) % 360}, 78%, 65%)`;
};
const validEntries = (value: unknown): NoteEntry[] =>
  Array.isArray(value)
    ? value
        .filter(
          (entry) =>
            entry && typeof entry.id === "string" && typeof entry.author === "string" && typeof entry.text === "string",
        )
        .map((entry) => ({
          id: entry.id,
          author: entry.author,
          text: entry.text,
          elements: Array.isArray(entry.elements)
            ? entry.elements.filter((uuid: unknown) => typeof uuid === "string")
            : [],
        }))
    : [];
const notesFor = (project: NotesProject | undefined, element?: NotedElement): NoteEntry[] =>
  validEntries(project?.notes).filter((entry) =>
    element ? entry.elements.includes(element.uuid) : entry.elements.length === 0,
  );
type NoteBillboard = {
  element: NotedElement;
  elements: NotedElement[];
  entry: NoteEntry;
  note: string;
  editable: boolean;
  sprite: THREE.Sprite;
  line: THREE.LineSegments;
  texture: THREE.CanvasTexture;
  width: number;
  height: number;
  screen?: { x: number; y: number; width: number; height: number; anchorX: number; anchorY: number };
};

class NotesTweak extends ToggleTweak {
  private static panel: Panel;
  private static originalCompile: (options: any) => any;
  private static originalParse: (model: any, path: string) => any;
  private perElementSetting?: Setting;
  private notesVisible = true;
  private billboards = new Map<string, NoteBillboard>();
  private offsets = new Map<string, Record<string, [number, number]>>();
  private animationFrame?: number;
  private panelIdentity?: string;
  private dragging?: {
    billboard: NoteBillboard;
    project: ModelProject;
    preview: Preview;
    startX: number;
    startY: number;
    grabX: number;
    grabY: number;
    moved: boolean;
  };
  private pendingEditor?: { element: NotedElement; project: ModelProject; entry: NoteEntry };
  private editor?: {
    textarea: HTMLTextAreaElement;
    billboard: NoteBillboard;
    project: ModelProject;
    original: string;
    onKeyDown: (event: KeyboardEvent) => void;
  };

  private getIdentity(): { id: string; author: string } {
    const session = Project?.EditSession as (EditSession & { peer?: { id: string }; username?: string }) | undefined;
    if (session?.active && session.peer?.id) return { id: session.peer.id, author: session.username || "User" };
    let id = localStorage.getItem("tweaks_n_stuff_note_user");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("tweaks_n_stuff_note_user", id);
    }
    return { id, author: String(settings.username?.value || "Local user") };
  }

  private ownEntry(entries: NoteEntry[]): NoteEntry | undefined {
    const identity = this.getIdentity();
    return (
      entries.find((entry) => entry.id === identity.id) ??
      entries.find((entry) => authorKey(entry.author) === authorKey(identity.author))
    );
  }

  private ownNote(entries: NoteEntry[]): string {
    return this.ownEntry(entries)?.text ?? "";
  }

  private canEditEntry(entry: NoteEntry): boolean {
    const identity = this.getIdentity();
    return (
      !Project?.EditSession?.active ||
      entry.id === identity.id ||
      authorKey(entry.author) === authorKey(identity.author) ||
      !!Project?.EditSession?.hosting
    );
  }

  private offsetsFor(project: ModelProject): Record<string, [number, number]> {
    let offsets = this.offsets.get(project.uuid);
    if (!offsets) {
      try {
        const stored = JSON.parse(localStorage.getItem(`tweaks_n_stuff_note_offsets:${project.uuid}`) ?? "{}");
        offsets = Object.fromEntries(Object.entries(stored).filter(([, value]) => isNoteOffset(value))) as Record<
          string,
          [number, number]
        >;
      } catch {
        offsets = {};
      }
      this.offsets.set(project.uuid, offsets);
    }
    return offsets;
  }

  private offsetFor(project: ModelProject, billboard: NoteBillboard): [number, number] | undefined {
    const offsets = this.offsetsFor(project);
    return offsets[billboard.entry.id] ?? offsets[`${billboard.element.uuid}:${billboard.entry.id}`];
  }

  private setOffset(project: ModelProject, billboard: NoteBillboard, offset: [number, number]): void {
    this.offsetsFor(project)[billboard.entry.id] = offset;
  }

  private saveOffsets(project: ModelProject): void {
    localStorage.setItem(`tweaks_n_stuff_note_offsets:${project.uuid}`, JSON.stringify(this.offsetsFor(project)));
  }

  private updateEntry(
    project: NotesProject,
    element: NotedElement | undefined,
    text: string,
    targetId?: string,
    elements?: string[],
  ): void {
    const identity = this.getIdentity();
    const entries = validEntries(project.notes);
    targetId ??= this.ownEntry(notesFor(project, element))?.id ?? crypto.randomUUID();
    const index = entries.findIndex(
      (entry) =>
        entry.id === targetId && (element ? entry.elements.includes(element.uuid) : entry.elements.length === 0),
    );
    if (index >= 0 && !this.canEditEntry(entries[index])) return;
    if (index < 0 && !text) return;
    const entry: NoteEntry = {
      id: targetId,
      author: index >= 0 ? entries[index].author : identity.author,
      text,
      elements: elements ?? (index >= 0 ? entries[index].elements : element ? [element.uuid] : []),
    };
    if (index >= 0 && !text) entries.splice(index, 1);
    else if (index >= 0) entries[index] = entry;
    else entries.push(entry);
    project.notes = entries;
    project.saved = false;
    if (project.EditSession?.active) {
      project.EditSession.sendAll(SESSION_NOTE_TAG, {
        element: element?.uuid,
        targetId,
        elements: entry.elements,
        author: entry.author,
        text,
      });
    }
    if (!element && Project === project) this.refreshPanel();
  }

  private refreshPanel(): void {
    const project = Project as NotesProject | undefined;
    const entries = notesFor(project);
    const ownId = this.ownEntry(entries)?.id;
    this.panelIdentity = project ? this.getIdentity().id : undefined;
    NotesTweak.panel.vue.notes = project ? this.ownNote(entries) : "";
    NotesTweak.panel.vue.otherNotes = entries.filter((entry) => entry.id !== ownId && entry.text);
    NotesTweak.panel.vue.canEditOthers = !project?.EditSession?.active || !!project.EditSession.hosting;
  }

  constructor() {
    super("notes", { author: "legopitstop", category: "general" });
  }

  private static injectCompile(options: any): any {
    const res = NotesTweak.originalCompile.apply(Codecs.project, [options]);
    const addNotes = (data: any) => {
      data.notes = validEntries((Project as NotesProject)?.notes);
      delete data.note_entries;
      delete data.note;
      if (!Array.isArray(data.elements)) return;
      for (const element of data.elements) {
        delete element.note_entries;
        delete element.note;
        delete element.note_offset;
      }
    };
    if (typeof res === "string") {
      try {
        const data = JSON.parse(res);
        addNotes(data);
        return JSON.stringify(data);
      } catch (err) {
        return res;
      }
    }
    if (res && typeof res === "object") {
      addNotes(res);
    }
    return res;
  }

  private static injectParse(model: any, path: string): any {
    const notes = Array.isArray(model.notes)
      ? validEntries(model.notes)
      : [
          ...validEntries(model.note_entries),
          ...(Array.isArray(model.elements) ? model.elements : []).flatMap((element: any) =>
            validEntries(element.note_entries).map((entry) => ({
              ...entry,
              id: `${element.uuid}:${entry.id}`,
              elements: [element.uuid],
            })),
          ),
        ];
    const result = NotesTweak.originalParse.apply(Codecs.project, [model, path]);
    if (Project) {
      (Project as NotesProject).notes = notes;
      NotesTweak.instance?.refreshPanel();
    }
    return result;
  }

  private static instance?: NotesTweak;

  private createBillboard(elements: NotedElement[], entry: NoteEntry): NoteBillboard {
    const note = entry.text;
    const color = authorColor(entry.author);
    const editable = this.canEditEntry(entry);
    const lines: string[] = [];
    const context = document.createElement("canvas").getContext("2d")!;
    context.font = "30px sans-serif";
    for (const paragraph of note.split(/\r?\n/)) {
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && context.measureText(candidate).width > 420) {
          lines.push(line);
          line = word;
        } else line = candidate;
      }
      lines.push(line);
    }
    const visibleLines = lines.slice(0, 8);
    if (lines.length > 8) visibleLines[7] = `${visibleLines[7].slice(0, 28)}…`;
    const canvas = document.createElement("canvas");
    canvas.width = NOTE_TEXTURE_WIDTH;
    canvas.height = Math.max(168, 136 + visibleLines.length * 40);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(24, 27, 33, 0.94)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(2, 2, canvas.width - 4, canvas.height - 4, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#343944";
    ctx.fillRect(4, 4, canvas.width - 8, NOTE_TOOLBAR_HEIGHT - 4);
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "22px sans-serif";
    ctx.fillText(entry.author, 20, 42, editable ? 260 : 470);
    if (editable) {
      ctx.fillStyle = "#555c67";
      ctx.fillRect(284, 12, 104, 40);
      ctx.fillStyle = "#f5f5f5";
      ctx.fillText("Reading", 292, 40);
      ctx.fillText("Source", 410, 40);
    }
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "30px sans-serif";
    visibleLines.forEach((line, index) => ctx.fillText(line, 24, 118 + index * 40));

    const texture = new Three.CanvasTexture(canvas);
    const sprite = new Three.Sprite(
      new Three.SpriteMaterial({ map: texture, depthTest: false, sizeAttenuation: false }),
    );
    const width = 300;
    const height = (width * canvas.height) / canvas.width;
    sprite.renderOrder = 1000;
    const line = new Three.LineSegments(
      new Three.BufferGeometry().setFromPoints(Array.from({ length: elements.length * 6 }, () => new Three.Vector3())),
      new Three.LineBasicMaterial({ color, depthTest: false }),
    );
    line.renderOrder = 999;
    line.frustumCulled = false;
    Canvas.scene.add(line, sprite);
    return { element: elements[0], elements, entry, note, editable, sprite, line, texture, width, height };
  }

  private removeBillboard(billboard: NoteBillboard): void {
    Canvas.scene.remove(billboard.sprite, billboard.line);
    billboard.sprite.material.dispose();
    (billboard.line.material as THREE.Material).dispose();
    billboard.line.geometry.dispose();
    billboard.texture.dispose();
  }

  private getElementMesh(element: NotedElement): THREE.Object3D | undefined {
    const cached = Canvas.meshes?.[element.uuid];
    if (cached) return cached;
    try {
      if (element.mesh) return element.mesh;
    } catch {}
    try {
      return element.scene_object;
    } catch {}
    return undefined;
  }

  private positionInlineEditor(): void {
    const editor = this.editor;
    const screen = editor?.billboard.screen;
    const preview = Preview.selected;
    if (!editor || !screen || !preview) return;
    const rect = preview.canvas.getBoundingClientRect();
    const toolbarHeight = (screen.width * NOTE_TOOLBAR_HEIGHT) / NOTE_TEXTURE_WIDTH;
    Object.assign(editor.textarea.style, {
      left: `${rect.left + screen.x - screen.width / 2}px`,
      top: `${rect.top + screen.y - screen.height / 2 + toolbarHeight}px`,
      width: `${screen.width}px`,
      height: `${Math.max(screen.height - toolbarHeight, 60)}px`,
    });
  }

  private finishInlineEditor(save: boolean): void {
    const editor = this.editor;
    if (!editor) return;
    this.editor = undefined;
    editor.textarea.onblur = null;
    document.removeEventListener("keydown", editor.onKeyDown, true);
    const note = save ? editor.textarea.value : editor.original;
    editor.textarea.remove();
    if (note !== editor.original)
      this.updateEntry(
        editor.project,
        editor.billboard.element,
        note,
        editor.billboard.entry.id,
        editor.billboard.entry.elements,
      );
  }

  private openInlineEditor(billboard: NoteBillboard, original = billboard.entry.text): void {
    this.finishInlineEditor(true);
    if (!billboard.screen || !Project || !this.canEditEntry(billboard.entry)) return;
    const textarea = document.createElement("textarea");
    textarea.value = original;
    textarea.placeholder = "Write a note…";
    textarea.setAttribute("aria-label", `Note for ${billboard.element.name}`);
    Object.assign(textarea.style, {
      position: "fixed",
      zIndex: "10000",
      boxSizing: "border-box",
      resize: "none",
      padding: "10px 12px",
      border: `2px solid ${authorColor(billboard.entry.author)}`,
      borderRadius: "6px",
      background: "#181b21",
      color: "#f5f5f5",
      font: "14px sans-serif",
      lineHeight: "1.4",
      outline: "none",
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target !== textarea) return;
      event.stopImmediatePropagation();
      if (event.key === "Escape") {
        event.preventDefault();
        this.finishInlineEditor(false);
      } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.finishInlineEditor(true);
      }
    };
    this.editor = { textarea, billboard, project: Project, original, onKeyDown };
    textarea.onblur = () => this.finishInlineEditor(true);
    document.addEventListener("keydown", onKeyDown, true);
    document.body.appendChild(textarea);
    this.positionInlineEditor();
    textarea.focus();
  }

  private onBillboardPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.notesVisible || !Project || !Settings.get("per_element_notes")) return;
    const preview = Preview.selected;
    if (!preview?.node.contains(event.target as Node)) return;
    const rect = preview.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (const billboard of Array.from(this.billboards.values()).reverse()) {
      const screen = billboard.screen;
      if (
        !screen ||
        !billboard.sprite.visible ||
        Math.abs(x - screen.x) > screen.width / 2 ||
        Math.abs(y - screen.y) > screen.height / 2
      )
        continue;
      const toolbarHeight = (screen.width * NOTE_TOOLBAR_HEIGHT) / NOTE_TEXTURE_WIDTH;
      const inToolbar = y < screen.y - screen.height / 2 + toolbarHeight;
      const textureX = ((x - screen.x + screen.width / 2) / screen.width) * NOTE_TEXTURE_WIDTH;
      if (billboard.editable && inToolbar && textureX >= 284) {
        if (textureX >= 390) {
          if (this.editor?.billboard === billboard) this.editor.textarea.focus();
          else if (this.canEditEntry(billboard.entry)) this.openInlineEditor(billboard);
        } else if (this.editor?.billboard === billboard) {
          this.finishInlineEditor(true);
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (this.editor) return;
      this.dragging = {
        billboard,
        project: Project,
        preview,
        startX: event.clientX,
        startY: event.clientY,
        grabX: x - screen.x,
        grabY: y - screen.y,
        moved: false,
      };
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
  };

  private onBillboardPointerMove = (event: PointerEvent): void => {
    const drag = this.dragging;
    if (!drag) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (Project !== drag.project || !Project.elements.includes(drag.billboard.element)) {
      this.dragging = undefined;
      return;
    }
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return;
    drag.moved = true;
    const screen = drag.billboard.screen;
    if (!screen) return;
    const rect = drag.preview.canvas.getBoundingClientRect();
    const x = Math.max(
      screen.width / 2 + 12,
      Math.min(rect.width - screen.width / 2 - 12, event.clientX - rect.left - drag.grabX),
    );
    const y = Math.max(
      screen.height / 2 + 8,
      Math.min(rect.height - screen.height / 2 - 8, event.clientY - rect.top - drag.grabY),
    );
    this.setOffset(drag.project, drag.billboard, [x - screen.anchorX, y - screen.anchorY]);
  };

  private onBillboardPointerUp = (event: PointerEvent): void => {
    const drag = this.dragging;
    if (!drag) return;
    if (event.type !== "pointercancel") this.onBillboardPointerMove(event);
    this.dragging = undefined;
    if (drag.moved) this.saveOffsets(drag.project);
    if (!drag.moved && event.type !== "pointercancel" && this.canEditEntry(drag.billboard.entry)) {
      this.openInlineEditor(drag.billboard);
    }
  };

  private updateBillboards = (): void => {
    if (Project && this.panelIdentity !== this.getIdentity().id) this.refreshPanel();
    if (this.editor && Project !== this.editor.project) this.finishInlineEditor(true);
    if (this.pendingEditor && Project !== this.pendingEditor.project) {
      this.pendingEditor = undefined;
    }
    if (!this.notesVisible || !Settings.get("per_element_notes")) {
      this.finishInlineEditor(true);
      this.pendingEditor = undefined;
      this.dragging = undefined;
      for (const billboard of this.billboards.values()) this.removeBillboard(billboard);
      this.billboards.clear();
      this.animationFrame = requestAnimationFrame(this.updateBillboards);
      return;
    }
    const elements = new Map((Project?.elements ?? []).map((element) => [element.uuid, element as NotedElement]));
    const desired = new Map<string, { elements: NotedElement[]; entry: NoteEntry }>();
    for (const entry of validEntries((Project as NotesProject)?.notes)) {
      if (!entry.text || !entry.elements.length) continue;
      const targets = entry.elements.map((uuid) => elements.get(uuid)).filter((item): item is NotedElement => !!item);
      if (targets.length) desired.set(entry.id, { elements: targets, entry });
    }
    if (this.pendingEditor) {
      const element = elements.get(this.pendingEditor.element.uuid);
      if (element === this.pendingEditor.element) {
        const entry = this.pendingEditor.entry;
        const targets = entry.elements.map((uuid) => elements.get(uuid)).filter((item): item is NotedElement => !!item);
        if (targets.length)
          desired.set(entry.id, { elements: targets, entry: entry.text ? entry : { ...entry, text: " " } });
      }
    }
    if (this.editor && !this.editor.billboard.entry.text) {
      const element = elements.get(this.editor.billboard.element.uuid);
      if (element === this.editor.billboard.element) {
        const entry = { ...this.editor.billboard.entry, text: " " };
        desired.set(entry.id, { elements: this.editor.billboard.elements, entry });
      }
    }
    for (const [key, billboard] of this.billboards) {
      const current = desired.get(key);
      if (
        !current ||
        current.entry.text !== billboard.note ||
        current.entry.author !== billboard.entry.author ||
        this.canEditEntry(current.entry) !== billboard.editable
      ) {
        this.removeBillboard(billboard);
        this.billboards.delete(key);
      } else {
        if (
          current.elements.length !== billboard.elements.length ||
          current.elements.some((element, index) => element !== billboard.elements[index])
        ) {
          billboard.elements = current.elements;
          billboard.element = current.elements[0];
          billboard.line.geometry.dispose();
          billboard.line.geometry = new Three.BufferGeometry().setFromPoints(
            Array.from({ length: current.elements.length * 6 }, () => new Three.Vector3()),
          );
        }
        billboard.entry = current.entry;
      }
    }
    for (const [key, { elements: targets, entry }] of desired) {
      if (!this.billboards.has(key)) {
        this.billboards.set(key, this.createBillboard(targets, entry));
      }
    }
    if (this.billboards.size === 0) {
      this.animationFrame = requestAnimationFrame(this.updateBillboards);
      return;
    }

    const preview = Preview.selected;
    const camera = preview?.camera;
    const viewportWidth = preview?.canvas.clientWidth ?? 0;
    const viewportHeight = preview?.canvas.clientHeight ?? 0;
    if (camera && viewportWidth && viewportHeight) {
      camera.updateMatrixWorld();
      const toScreen = (point: THREE.Vector3) => {
        const projected = point.clone().project(camera);
        return {
          x: ((projected.x + 1) * viewportWidth) / 2,
          y: ((1 - projected.y) * viewportHeight) / 2,
          z: projected.z,
        };
      };
      const toWorld = (x: number, y: number, z: number) =>
        new Three.Vector3((x / viewportWidth) * 2 - 1, 1 - (y / viewportHeight) * 2, z).unproject(camera);

      let modelLeft = Infinity;
      let modelRight = -Infinity;
      let modelTop = Infinity;
      let modelBottom = -Infinity;
      for (const element of elements.values()) {
        const mesh = this.getElementMesh(element);
        if (!mesh?.visible) continue;
        const bounds = new Three.Box3().setFromObject(mesh);
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              const screen = toScreen(new Three.Vector3(x, y, z));
              modelLeft = Math.min(modelLeft, screen.x);
              modelRight = Math.max(modelRight, screen.x);
              modelTop = Math.min(modelTop, screen.y);
              modelBottom = Math.max(modelBottom, screen.y);
            }
          }
        }
      }

      const placements: {
        billboard: NoteBillboard;
        anchor: ReturnType<typeof toScreen>;
        targets: { index: number; anchor: ReturnType<typeof toScreen> }[];
      }[] = [];
      for (const billboard of this.billboards.values()) {
        const targets = billboard.elements.flatMap((element, index) => {
          const mesh = this.getElementMesh(element);
          return mesh?.visible
            ? [{ index, anchor: toScreen(new Three.Box3().setFromObject(mesh).getCenter(new Three.Vector3())) }]
            : [];
        });
        billboard.sprite.visible = targets.length > 0;
        billboard.line.visible = targets.length > 0;
        if (!targets.length) {
          billboard.screen = undefined;
          continue;
        }
        const anchor = targets.reduce(
          (sum, target) => ({ x: sum.x + target.anchor.x, y: sum.y + target.anchor.y, z: sum.z + target.anchor.z }),
          { x: 0, y: 0, z: 0 },
        );
        anchor.x /= targets.length;
        anchor.y /= targets.length;
        anchor.z /= targets.length;
        placements.push({ billboard, anchor, targets });
      }
      placements.sort((a, b) => {
        const aMoved = Project && isNoteOffset(this.offsetFor(Project, a.billboard));
        const bMoved = Project && isNoteOffset(this.offsetFor(Project, b.billboard));
        return Number(!!bMoved) - Number(!!aMoved) || a.anchor.y - b.anchor.y;
      });
      const placed: { left: number; right: number; top: number; bottom: number }[] = [];
      for (const { billboard, anchor, targets } of placements) {
        const cardWidth = Math.min(billboard.width, viewportWidth - 24);
        const cardHeight = (billboard.height * cardWidth) / billboard.width;
        const halfWidth = cardWidth / 2;
        const halfHeight = cardHeight / 2;
        const rightX = modelRight + 28 + halfWidth;
        const leftX = modelLeft - 28 - halfWidth;
        const rightFits = rightX + halfWidth <= viewportWidth - 12;
        const leftFits = leftX - halfWidth >= 12;
        const topY = modelTop - 28 - halfHeight;
        const bottomY = modelBottom + 28 + halfHeight;
        let placement = rightFits
          ? "right"
          : leftFits
            ? "left"
            : topY - halfHeight >= 8
              ? "top"
              : bottomY + halfHeight <= viewportHeight - 8
                ? "bottom"
                : viewportWidth - modelRight >= modelLeft
                  ? "right"
                  : "left";
        const offset = Project ? this.offsetFor(Project, billboard) : undefined;
        if (isNoteOffset(offset)) {
          placement =
            Math.abs(offset[0]) >= Math.abs(offset[1])
              ? offset[0] >= 0
                ? "right"
                : "left"
              : offset[1] >= 0
                ? "bottom"
                : "top";
        }
        const preferredX = isNoteOffset(offset)
          ? anchor.x + offset[0]
          : placement === "right"
            ? rightX
            : placement === "left"
              ? leftX
              : anchor.x;
        const preferredY = isNoteOffset(offset)
          ? anchor.y + offset[1]
          : placement === "top"
            ? topY
            : placement === "bottom"
              ? bottomY
              : anchor.y;
        const clampX = (x: number) => Math.max(halfWidth + 12, Math.min(viewportWidth - halfWidth - 12, x));
        const clampY = (y: number) => Math.max(halfHeight + 8, Math.min(viewportHeight - halfHeight - 8, y));
        let cardX = clampX(preferredX);
        let cardY = clampY(preferredY);
        if (!isNoteOffset(offset) && placed.length) {
          const xs = [preferredX, rightX, leftX, anchor.x, halfWidth + 12, viewportWidth - halfWidth - 12];
          const ys = [preferredY, anchor.y, topY, bottomY, halfHeight + 8, viewportHeight - halfHeight - 8];
          for (const rect of placed) {
            xs.push(rect.left - halfWidth - 8, rect.right + halfWidth + 8);
            ys.push(rect.top - halfHeight - 8, rect.bottom + halfHeight + 8);
          }
          let best = Infinity;
          for (const x of xs.map(clampX))
            for (const y of ys.map(clampY)) {
              const overlap = placed.reduce(
                (sum, rect) =>
                  sum +
                  Math.max(0, Math.min(x + halfWidth, rect.right) - Math.max(x - halfWidth, rect.left)) *
                    Math.max(0, Math.min(y + halfHeight, rect.bottom) - Math.max(y - halfHeight, rect.top)),
                0,
              );
              const score = overlap * 1000 + Math.hypot(x - preferredX, y - preferredY);
              if (score < best) {
                best = score;
                cardX = x;
                cardY = y;
              }
            }
          placement =
            Math.abs(cardX - anchor.x) >= Math.abs(cardY - anchor.y)
              ? cardX >= anchor.x
                ? "right"
                : "left"
              : cardY >= anchor.y
                ? "bottom"
                : "top";
        }
        placed.push({
          left: cardX - halfWidth,
          right: cardX + halfWidth,
          top: cardY - halfHeight,
          bottom: cardY + halfHeight,
        });
        billboard.screen = {
          x: cardX,
          y: cardY,
          width: cardWidth,
          height: cardHeight,
          anchorX: anchor.x,
          anchorY: anchor.y,
        };

        const anchorWorld = toWorld(anchor.x, anchor.y, anchor.z);
        const cameraRight = new Three.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        const oneUnitRight = toScreen(anchorWorld.clone().add(cameraRight));
        const pixelsPerWorldUnit = Math.hypot(oneUnitRight.x - anchor.x, oneUnitRight.y - anchor.y);
        if (!Number.isFinite(pixelsPerWorldUnit) || pixelsPerWorldUnit <= 0) continue;
        const viewDepth = -anchorWorld.clone().applyMatrix4(camera.matrixWorldInverse).z;
        const spriteDepthScale = (camera as THREE.PerspectiveCamera).isPerspectiveCamera ? viewDepth : 1;
        if (!Number.isFinite(spriteDepthScale) || spriteDepthScale <= 0) continue;
        const worldPerPixel = 1 / (pixelsPerWorldUnit * spriteDepthScale);
        billboard.sprite.scale.set(cardWidth * worldPerPixel, cardHeight * worldPerPixel, 1);
        billboard.sprite.position.copy(toWorld(cardX, cardY, anchor.z));

        const points = billboard.line.geometry.attributes.position as THREE.BufferAttribute;
        for (let index = 0; index < billboard.elements.length; index++) {
          const target = targets.find((item) => item.index === index)?.anchor;
          const dx = (target?.x ?? cardX) - cardX;
          const dy = (target?.y ?? cardY) - cardY;
          const side =
            Math.abs(dx / halfWidth) >= Math.abs(dy / halfHeight)
              ? dx >= 0
                ? "right"
                : "left"
              : dy >= 0
                ? "bottom"
                : "top";
          const startX = cardX + (side === "right" ? halfWidth : side === "left" ? -halfWidth : 0);
          const startY = cardY + (side === "top" ? -halfHeight : side === "bottom" ? halfHeight : 0);
          const length = Math.hypot((target?.x ?? startX) - startX, (target?.y ?? startY) - startY) || 1;
          const ux = ((target?.x ?? startX) - startX) / length;
          const uy = ((target?.y ?? startY) - startY) / length;
          const arrowPoints = target
            ? [
                [startX, startY],
                [target.x, target.y],
                [target.x - ux * 12 - uy * 6, target.y - uy * 12 + ux * 6],
                [target.x, target.y],
                [target.x - ux * 12 + uy * 6, target.y - uy * 12 - ux * 6],
                [target.x, target.y],
              ]
            : Array.from({ length: 6 }, () => [cardX, cardY]);
          arrowPoints.forEach(([x, y], pointIndex) => {
            const world = toWorld(x, y, target?.z ?? anchor.z);
            points.setXYZ(index * 6 + pointIndex, world.x, world.y, world.z);
          });
        }
        points.needsUpdate = true;
      }
      if (this.pendingEditor) {
        const billboard = this.billboards.get(this.pendingEditor.entry.id);
        if (billboard?.screen) {
          const original = this.pendingEditor.entry.text;
          this.pendingEditor = undefined;
          this.openInlineEditor(billboard, original);
        }
      }
      this.positionInlineEditor();
    } else {
      for (const billboard of this.billboards.values()) {
        billboard.sprite.visible = billboard.line.visible = false;
        billboard.screen = undefined;
      }
    }
    this.animationFrame = requestAnimationFrame(this.updateBillboards);
  };

  // EVENTS

  onLoad(): void {
    this.perElementSetting = new Setting("per_element_notes", {
      name: tl("settings.per_element_notes"),
      description: tl("settings.per_element_notes.desc"),
      category: "general",
      type: "toggle",
      value: true,
    });
    super.onLoad();
  }

  onUnload(): void {
    super.onUnload();
    this.perElementSetting?.delete();
    this.perElementSetting = undefined;
  }

  onEnable() {
    NotesTweak.instance = this;
    this.notesVisible = localStorage.getItem("tweaks_n_stuff_element_notes_visible") !== "false";
    const css = `#note_editor {
      height: 100%;
      min-height: 0;
      overflow-y: auto;
    }
    #note_editor .note_editor {
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    #note_editor .note_editor > .prism-editor-component {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }`;
    const noteEditorMode = new BarSelect("note_editor_mode", {
      // @ts-ignore
      icon_mode: true,
      options: {
        source: { name: true, icon: "code" },
        reading: { name: true, icon: "menu_book" },
      },
      onChange() {
        NotesTweak.panel.vue.mode = this.value;
      },
    });
    NotesTweak.panel = new Panel("note", {
      icon: "note",
      resizable: true,
      growable: true,
      default_position: {
        slot: "right_bar",
        float_position: [0, 2],
        float_size: [300, 400],
        height: 400,
      },
      toolbars: [
        new Toolbar("note_editor", {
          children: ["note_editor_mode"],
        }),
      ],
      component: {
        data: {
          mode: noteEditorMode.value,
          notes: "",
          otherNotes: [] as NoteEntry[],
          canEditOthers: false,
        },
        watch: {
          notes(value: string) {
            if (!Project || value === NotesTweak.instance?.ownNote(notesFor(Project as NotesProject))) return;
            NotesTweak.instance?.updateEntry(Project, undefined, value);
          },
        },
        methods: {
          formatNote(text: string): string {
            return pureMarked(text);
          },
          editOtherNote(entry: NoteEntry, text: string): void {
            if (Project && (!Project.EditSession?.active || Project.EditSession.hosting)) {
              NotesTweak.instance?.updateEntry(Project, undefined, text, entry.id);
            }
          },
        },
        components: {
          VuePrismEditor,
        },
        template: `<div id="note_editor">
            <div v-if="otherNotes.length" class="other_notes">
                <div v-for="entry in otherNotes" :key="entry.id"><strong>{{ entry.author }}</strong>
                    <textarea v-if="canEditOthers" :value="entry.text" @change="editOtherNote(entry, $event.target.value)"></textarea>
                    <div v-else class="preview markdown" v-html="formatNote(entry.text)"></div>
                </div>
            </div>
            <div v-if="mode==='reading'">
                <div class="preview markdown" v-html="formatNote(notes)"></div>
            </div>

            <div v-if="mode==='source'">
                <vue-prism-editor v-model="notes" language="markdown" class="note_editor" />
            </div>
        </div>`,
      },
    });
    const select = Blockbench.on("select_project", () => this.refreshPanel());
    const joined = Blockbench.on("join_session", () => this.refreshPanel());
    const created = Blockbench.on("create_session", () => this.refreshPanel());
    const received = Blockbench.on("receive_session_data", (tag: any) => {
      if (tag.type !== SESSION_NOTE_TAG || !Project?.EditSession || typeof tag.sender !== "string") return;
      const data = tag.data;
      if (!data || typeof data.text !== "string" || typeof data.author !== "string") return;
      const project = Project as NotesProject;
      const element =
        typeof data.element === "string"
          ? (project.elements.find((candidate) => candidate.uuid === data.element) as NotedElement | undefined)
          : undefined;
      if (data.element && !element) return;
      const targetId = typeof data.targetId === "string" ? data.targetId : tag.sender;
      const entries = validEntries(project.notes);
      const index = entries.findIndex(
        (entry) =>
          entry.id === targetId && (element ? entry.elements.includes(element.uuid) : entry.elements.length === 0),
      );
      if (targetId !== tag.sender && !tag.fromHost) {
        if (index >= 0 && authorKey(entries[index].author) !== authorKey(data.author)) return;
        const senderName = (project.EditSession as any).clients?.[tag.sender]?.name;
        if (senderName && authorKey(senderName) !== authorKey(index >= 0 ? entries[index].author : data.author)) return;
      }
      if (index < 0 && !data.text) return;
      const incomingElements = Array.isArray(data.elements)
        ? data.elements.filter(
            (uuid: unknown) => typeof uuid === "string" && project.elements.some((item) => item.uuid === uuid),
          )
        : element
          ? [element.uuid]
          : [];
      const entry = {
        id: targetId,
        author: index >= 0 ? entries[index].author : data.author,
        text: data.text,
        elements: incomingElements,
      };
      if (index >= 0 && !data.text) entries.splice(index, 1);
      else if (index >= 0) entries[index] = entry;
      else entries.push(entry);
      project.notes = entries;
      if (!element) this.refreshPanel();
      project.saved = false;
    });

    // Inject compile
    NotesTweak.originalCompile = Codecs.project.compile;
    Codecs.project.compile = NotesTweak.injectCompile;

    // Inject parse
    NotesTweak.originalParse = Codecs.project.parse;
    Codecs.project.parse = NotesTweak.injectParse;

    const addNote = {
      id: "add_element_note",
      name: "Add Note",
      icon: "note_add",
      condition: () => !!Project && !!Settings.get("per_element_notes"),
      click: (element: NotedElement) => {
        if (!Project || !element || !Settings.get("per_element_notes")) return;
        const selected = Project.selected_elements.includes(element) ? Project.selected_elements : [element];
        const uuids = [...new Set(selected.map((item) => item.uuid))];
        const ownEntry = this.ownEntry(notesFor(Project as NotesProject, element));
        const entry = ownEntry
          ? { ...ownEntry, elements: [...new Set([...ownEntry.elements, ...uuids])] }
          : { id: crypto.randomUUID(), author: this.getIdentity().author, text: "", elements: uuids };
        if (ownEntry?.text && entry.elements.length !== ownEntry.elements.length) {
          this.updateEntry(Project, element, ownEntry.text, ownEntry.id, entry.elements);
        }
        const billboard = this.billboards.get(entry.id);
        if (billboard?.screen) {
          billboard.entry = entry;
          this.openInlineEditor(billboard);
        } else {
          this.pendingEditor = { element, project: Project, entry };
        }
      },
    };
    const menus = new Set<Menu>();
    for (const type of Object.values(OutlinerElement.types)) {
      const menu = type.prototype.menu;
      if (!menu || menus.has(menu)) continue;
      menu.addAction(addNote, "#manage");
      menus.add(menu);
    }
    this.deleteables.push(...Array.from(menus, (menu) => ({ delete: () => menu.removeAction(addNote.id) })));

    const visibilityToggle: CustomMenuItem = {
      id: "toggle_element_note_visibility",
      name: "Show Element Notes",
      icon: () => (this.notesVisible ? "check_box" : "check_box_outline_blank"),
      condition: () => !!Project && !!Settings.get("per_element_notes"),
      click: () => {
        this.notesVisible = !this.notesVisible;
        localStorage.setItem("tweaks_n_stuff_element_notes_visible", String(this.notesVisible));
      },
    };
    const previewMenus = new Set<Menu>(
      [(Preview.prototype as any).menu, (Blockbench as any).menus?.preview].filter(Boolean),
    );
    for (const menu of previewMenus) {
      menu.addAction(visibilityToggle);
      this.deleteables.push({ delete: () => menu.removeAction(visibilityToggle.id!) });
    }

    this.deleteables.push(Blockbench.addCSS(css), noteEditorMode, NotesTweak.panel, select, joined, created, received);
    document.addEventListener("pointerdown", this.onBillboardPointerDown, true);
    window.addEventListener("pointermove", this.onBillboardPointerMove, true);
    window.addEventListener("pointerup", this.onBillboardPointerUp, true);
    window.addEventListener("pointercancel", this.onBillboardPointerUp, true);
    this.animationFrame = requestAnimationFrame(this.updateBillboards);
  }

  onDisable(): void {
    this.finishInlineEditor(true);
    this.pendingEditor = undefined;
    document.removeEventListener("pointerdown", this.onBillboardPointerDown, true);
    window.removeEventListener("pointermove", this.onBillboardPointerMove, true);
    window.removeEventListener("pointerup", this.onBillboardPointerUp, true);
    window.removeEventListener("pointercancel", this.onBillboardPointerUp, true);
    this.dragging = undefined;
    if (this.animationFrame !== undefined) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = undefined;
    for (const billboard of this.billboards.values()) this.removeBillboard(billboard);
    this.billboards.clear();
    Codecs.project.compile = NotesTweak.originalCompile;
    Codecs.project.parse = NotesTweak.originalParse;
    NotesTweak.instance = undefined;
  }
}

new NotesTweak();
