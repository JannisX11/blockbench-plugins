import { ToggleTweak } from "./base";
import type * as THREE from "three";

const Three = (globalThis as any).THREE as typeof import("three");
const NOTE_TEXTURE_WIDTH = 512;
const NOTE_TOOLBAR_HEIGHT = 64;
const NOTE_MODE_BUTTON_SIZE = 40;
const NOTE_READING_BUTTON_X = 408;
const NOTE_SOURCE_BUTTON_X = 460;
const NOTE_ARROW_GROUP_DISTANCE = 140;

type NoteEntry = { id: string; author: string; text: string; elements: string[] };
type NotedElement = OutlinerElement;
type NotesProject = ModelProject & { notes?: NoteEntry[] };
const SESSION_NOTE_TAG = "tweaks_n_stuff_note";
const authorKey = (author: string): string => author.trim().toLowerCase();
const isNoteOffset = (value: unknown): value is [number, number] =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every((part) => typeof part === "number" && Number.isFinite(part));
const authorHue = (author: string): number => {
  let hash = 2166136261;
  for (const character of author.trim().toLowerCase()) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  }
  return (hash >>> 0) % 360;
};
let authorPaletteKey = "";
let authorPalette = new Map<string, string>();
const authorColor = (author: string): string => {
  const key = authorKey(author);
  const authors = [
    ...new Set([...((Project as NotesProject | undefined)?.notes ?? []).map((entry) => authorKey(entry.author)), key]),
  ].sort();
  const paletteKey = JSON.stringify(authors);
  if (paletteKey !== authorPaletteKey) {
    authorPaletteKey = paletteKey;
    authorPalette = new Map();
    const hues: number[] = [];
    const distance = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    for (const name of authors) {
      const preferred = authorHue(name);
      let hue = preferred;
      let best = -1;
      // Maximize separation from colors already assigned to this project's authors.
      for (let offset = 0; offset < 360; offset++) {
        const candidate = (preferred + offset) % 360;
        const separation = hues.length ? Math.min(...hues.map((used) => distance(candidate, used))) : 360;
        if (separation > best) {
          best = separation;
          hue = candidate;
        }
      }
      hues.push(hue);
      authorPalette.set(name, `hsl(${hue}, 78%, 65%)`);
    }
  }
  return authorPalette.get(key)!;
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
  color: string;
  sprite: THREE.Sprite;
  line: THREE.LineSegments;
  texture: THREE.CanvasTexture;
  drawToolbar: (source: boolean) => void;
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
  private hoverPointer?: { x: number; y: number };
  private hoveredBillboard?: NoteBillboard;
  private hoverElements: NotedElement[] = [];

  private clearNoteHover = (): void => {
    this.hoveredBillboard = undefined;
    for (const element of this.hoverElements) {
      (element.preview_controller as any)?.updateHighlight?.(element);
    }
    this.hoverElements = [];
  };

  private onNotePointerLeave = (): void => {
    this.hoverPointer = undefined;
    this.clearNoteHover();
  };

  private onNoteMouseMove = (event: MouseEvent): void => {
    this.hoverPointer = { x: event.clientX, y: event.clientY };
    this.updateNoteHover();
    if (this.hoveredBillboard) event.stopImmediatePropagation();
  };

  private updateNoteHover(): void {
    const pointer = this.hoverPointer;
    const preview = Preview.selected;
    let hovered: NoteBillboard | undefined;
    const node = pointer ? document.elementFromPoint(pointer.x, pointer.y) : null;
    const panelIcon = node?.closest("#note_editor .note_elements_icon");
    const panelNoteId = panelIcon?.getAttribute("data-note-id");
    if (pointer && preview && this.notesVisible && Settings.get("per_element_notes")) {
      const rect = preview.canvas.getBoundingClientRect();
      const x = pointer.x - rect.left;
      const y = pointer.y - rect.top;
      if (node && (preview.node.contains(node) || node === this.editor?.textarea)) {
        hovered = Array.from(this.billboards.values())
          .reverse()
          .find((billboard) => {
            const screen = billboard.screen;
            return (
              billboard.sprite.visible &&
              screen &&
              Math.abs(x - screen.x) <= screen.width / 2 &&
              Math.abs(y - screen.y) <= screen.height / 2
            );
          });
      }
    }
    const panelEntry = panelNoteId
      ? validEntries((Project as NotesProject | undefined)?.notes).find((entry) => entry.id === panelNoteId)
      : undefined;
    const hoverElements = panelEntry
      ? (Project?.elements ?? []).filter((element) => panelEntry.elements.includes(element.uuid))
      : (hovered?.elements ?? []);
    if (
      hovered !== this.hoveredBillboard ||
      hoverElements.length !== this.hoverElements.length ||
      hoverElements.some((element, index) => element !== this.hoverElements[index])
    ) {
      this.clearNoteHover();
      this.hoveredBillboard = hovered;
      this.hoverElements = hoverElements.slice();
    }
    // Use the element controller's native hover tint and preserve selection shading.
    for (const element of this.hoverElements) {
      (element.preview_controller as any)?.updateHighlight?.(element, element);
    }
  }

  private offsets = new Map<string, Record<string, [number, number]>>();
  private animationFrame?: number;
  private panelNotesSignature?: string;
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
    if (Project === project) this.refreshPanel();
  }

  private refreshPanel(): void {
    const project = Project as NotesProject | undefined;
    const entries = validEntries(project?.notes).filter((entry) => entry.text && entry.elements.length);
    const elements = new Map((project?.elements ?? []).map((element) => [element.uuid, element.name]));
    const notes = entries.map((entry) => ({
      ...entry,
      elementNames: entry.elements.map((uuid) => elements.get(uuid) ?? "Missing element").join(", "),
      editable: this.canEditEntry(entry),
      color: authorColor(entry.author),
    }));
    const signature = JSON.stringify(notes);
    if (signature === this.panelNotesSignature) return;
    this.panelNotesSignature = signature;
    NotesTweak.panel.vue.elementNotes = notes;
    if (!notes.some((entry) => entry.id === NotesTweak.panel.vue.editingId)) NotesTweak.panel.vue.editingId = null;
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
    const drawToolbar = (source: boolean): void => {
      ctx.save();
      ctx.fillStyle = "#343944";
      ctx.fillRect(4, 4, canvas.width - 8, NOTE_TOOLBAR_HEIGHT - 4);
      ctx.fillStyle = "#f5f5f5";
      ctx.font = "22px sans-serif";
      ctx.fillText(entry.author, 20, 42, editable ? NOTE_READING_BUTTON_X - 32 : 470);
      if (editable) {
        ctx.fillStyle = "#555c67";
        ctx.fillRect(
          source ? NOTE_SOURCE_BUTTON_X : NOTE_READING_BUTTON_X,
          12,
          NOTE_MODE_BUTTON_SIZE,
          NOTE_MODE_BUTTON_SIZE,
        );
        ctx.fillStyle = "#f5f5f5";
        ctx.save();
        ctx.strokeStyle = "#f5f5f5";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        // Open book for reading mode.
        ctx.save();
        ctx.translate(NOTE_READING_BUTTON_X + NOTE_MODE_BUTTON_SIZE / 2, 32);
        ctx.scale(0.65, 0.65);
        ctx.translate(-336, -32);
        ctx.beginPath();
        ctx.moveTo(336, 23);
        ctx.quadraticCurveTo(326, 18, 316, 21);
        ctx.lineTo(316, 43);
        ctx.quadraticCurveTo(326, 40, 336, 45);
        ctx.quadraticCurveTo(346, 40, 356, 43);
        ctx.lineTo(356, 21);
        ctx.quadraticCurveTo(346, 18, 336, 23);
        ctx.lineTo(336, 45);
        ctx.stroke();
        ctx.restore();
        // Code brackets for source mode.
        ctx.save();
        ctx.translate(NOTE_SOURCE_BUTTON_X + NOTE_MODE_BUTTON_SIZE / 2, 32);
        ctx.scale(0.56, 0.65);
        ctx.translate(-450, -32);
        ctx.beginPath();
        ctx.moveTo(436, 22);
        ctx.lineTo(425, 32);
        ctx.lineTo(436, 42);
        ctx.moveTo(464, 22);
        ctx.lineTo(475, 32);
        ctx.lineTo(464, 42);
        ctx.moveTo(455, 20);
        ctx.lineTo(445, 44);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      }
      ctx.restore();
    };
    drawToolbar(false);
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "30px sans-serif";
    visibleLines.forEach((line, index) => ctx.fillText(line, 24, 118 + index * 40));

    const texture = new Three.CanvasTexture(canvas);
    const sprite = new Three.Sprite(
      new Three.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false, sizeAttenuation: false }),
    );
    const width = 300;
    const height = (width * canvas.height) / canvas.width;
    sprite.renderOrder = 1000;
    const line = new Three.LineSegments(
      new Three.BufferGeometry().setFromPoints(Array.from({ length: elements.length * 6 }, () => new Three.Vector3())),
      // Draw in the transparent pass, after model materials, without affecting depth.
      new Three.LineBasicMaterial({ color, transparent: true, depthTest: false, depthWrite: false }),
    );
    line.renderOrder = 999;
    line.frustumCulled = false;
    Canvas.scene.add(line, sprite);
    return {
      element: elements[0],
      elements,
      entry,
      note,
      editable,
      color,
      sprite,
      line,
      texture,
      drawToolbar,
      width,
      height,
    };
  }

  private removeBillboard(billboard: NoteBillboard): void {
    if (this.hoveredBillboard === billboard) this.clearNoteHover();
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
      borderColor: authorColor(editor.billboard.entry.author),
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
    editor.billboard.drawToolbar(false);
    editor.billboard.texture.needsUpdate = true;
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
    billboard.drawToolbar(true);
    billboard.texture.needsUpdate = true;
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
      const textureY = ((y - screen.y + screen.height / 2) / screen.width) * NOTE_TEXTURE_WIDTH;
      const inReadingButton =
        textureX >= NOTE_READING_BUTTON_X && textureX <= NOTE_READING_BUTTON_X + NOTE_MODE_BUTTON_SIZE;
      const inSourceButton =
        textureX >= NOTE_SOURCE_BUTTON_X && textureX <= NOTE_SOURCE_BUTTON_X + NOTE_MODE_BUTTON_SIZE;
      if (
        billboard.editable &&
        inToolbar &&
        textureY >= 12 &&
        textureY <= 12 + NOTE_MODE_BUTTON_SIZE &&
        (inReadingButton || inSourceButton)
      ) {
        if (inSourceButton) {
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
    this.hoverPointer = { x: event.clientX, y: event.clientY };
    this.updateNoteHover();
    // The preview's normal hover handler clears element tints when the cursor
    // is over a note. Keep it from competing with the note's hover highlight.
    if (this.hoveredBillboard) event.stopImmediatePropagation();
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
    this.refreshPanel();
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
      this.updateNoteHover();
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
        authorColor(current.entry.author) !== billboard.color ||
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
      this.updateNoteHover();
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
        targets: { index: number; anchor: ReturnType<typeof toScreen>; outline: ReturnType<typeof toScreen>[] }[];
      }[] = [];
      for (const billboard of this.billboards.values()) {
        const targets = billboard.elements.flatMap((element, index) => {
          const mesh = this.getElementMesh(element);
          if (!mesh?.visible) return [];
          const projected: ReturnType<typeof toScreen>[] = [];
          mesh.traverse((object) => {
            if (!object.visible) return;
            const geometry = (object as THREE.Mesh).geometry;
            const position = geometry?.attributes.position;
            if (!position) return;
            for (let i = 0; i < position.count; i++) {
              projected.push(
                toScreen(
                  new Three.Vector3()
                    .fromBufferAttribute(position as THREE.BufferAttribute, i)
                    .applyMatrix4(object.matrixWorld),
                ),
              );
            }
          });
          // The projected convex hull follows rotated element edges as the camera moves.
          projected.sort((a, b) => a.x - b.x || a.y - b.y);
          const cross = (a: (typeof projected)[number], b: typeof a, c: typeof a) =>
            (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
          const half = (points: typeof projected) => {
            const hull: typeof projected = [];
            for (const point of points) {
              while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) hull.pop();
              hull.push(point);
            }
            hull.pop();
            return hull;
          };
          const outline = [...half(projected), ...half([...projected].reverse())];
          return [
            { index, anchor: toScreen(new Three.Box3().setFromObject(mesh).getCenter(new Three.Vector3())), outline },
          ];
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

        // Group by visible distance, keeping every member close to the others
        // so a chain of nearby elements cannot merge distant endpoints.
        const groups: (typeof targets)[] = [];
        for (const target of targets) {
          const group = groups.find((members) =>
            members.every(
              (member) =>
                Math.hypot(member.anchor.x - target.anchor.x, member.anchor.y - target.anchor.y) <=
                NOTE_ARROW_GROUP_DISTANCE,
            ),
          );
          if (group) group.push(target);
          else groups.push([target]);
        }
        const arrowTargets = groups.map((members) => {
          const center = members.reduce(
            (sum, member) => ({ x: sum.x + member.anchor.x, y: sum.y + member.anchor.y, z: sum.z + member.anchor.z }),
            { x: 0, y: 0, z: 0 },
          );
          return { x: center.x / members.length, y: center.y / members.length, z: center.z / members.length };
        });
        const points = billboard.line.geometry.attributes.position as THREE.BufferAttribute;
        billboard.line.geometry.setDrawRange(0, arrowTargets.length * 6);
        for (let index = 0; index < arrowTargets.length; index++) {
          let target = arrowTargets[index];
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
          const rayX = target.x - startX;
          const rayY = target.y - startY;
          let nearest = 1;
          // Stop at the first element outline crossed by a shared arrow.
          for (const member of groups[index]) {
            const outline = member.outline;
            for (let i = 0; i < outline.length; i++) {
              const a = outline[i];
              const b = outline[(i + 1) % outline.length];
              const edgeX = b.x - a.x;
              const edgeY = b.y - a.y;
              const determinant = rayX * edgeY - rayY * edgeX;
              if (Math.abs(determinant) < 1e-8) continue;
              const offsetX = a.x - startX;
              const offsetY = a.y - startY;
              const t = (offsetX * edgeY - offsetY * edgeX) / determinant;
              const u = (offsetX * rayY - offsetY * rayX) / determinant;
              if (t >= 0 && t < nearest && u >= 0 && u <= 1) nearest = t;
            }
          }
          target = { x: startX + rayX * nearest, y: startY + rayY * nearest, z: target.z };
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
    this.updateNoteHover();
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
      height: 100%; min-height: 0; overflow-y: auto;
      display: flex; flex-direction: column; gap: 10px;
      padding: 12px; box-sizing: border-box;
    }
    #note_editor .note_card {
      border: 1px solid var(--color-border); border-radius: 6px;
      background: var(--color-back); flex-shrink: 0; overflow: hidden;
    }
    #note_editor .note_card_header {
      display: flex; align-items: center; gap: 8px; padding: 8px 12px;
      color: var(--color-subtle_text); font-size: 12px;
      border-bottom: 1px solid var(--color-border);
    }
    #note_editor .note_author { flex: 1; overflow: hidden; text-overflow: ellipsis; }
    #note_editor .note_edit, #note_editor .note_elements_icon {
      display: inline-flex; align-items: center; justify-content: center;
      flex: 0 0 24px; width: 24px; min-width: 24px; max-width: 24px;
      height: 24px; min-height: 24px; padding: 0; box-sizing: border-box;
      line-height: 1; text-indent: 0;
    }
    #note_editor .note_edit .material-icons, #note_editor .note_elements_icon .material-icons {
      display: block; position: static; float: none;
      width: 18px; height: 18px; margin: 0; padding: 0;
      font-size: 18px; line-height: 18px; text-align: center;
      transform: none;
    }
    #note_editor .note_elements_icon { cursor: help; }
    #note_editor .preview.markdown { padding: 12px; line-height: 1.6; overflow-wrap: anywhere; }
    #note_editor .preview.markdown > :first-child { margin-top: 0; }
    #note_editor .preview.markdown > :last-child { margin-bottom: 0; }
    #note_editor .note_empty { padding: 12px; color: var(--color-subtle_text); line-height: 1.6; }
    #note_editor .note_card textarea {
      width: 100%; min-height: 100px; padding: 12px; box-sizing: border-box;
      border: none; background: transparent; color: var(--color-text); resize: vertical; line-height: 1.6;
    }`;
    NotesTweak.panel = new Panel("notes", {
      icon: "note",
      resizable: true,
      growable: true,
      default_position: {
        slot: "right_bar",
        float_position: [0, 2],
        float_size: [300, 400],
        height: 400,
      },
      component: {
        data: {
          elementNotes: [] as (NoteEntry & { elementNames: string; editable: boolean })[],
          editingId: null as string | null,
        },
        methods: {
          formatNote(text: string): string {
            return pureMarked(text);
          },
          noteColor(author: string): string {
            return authorColor(author);
          },
          editNote(entry: NoteEntry, text: string): void {
            const instance = NotesTweak.instance;
            const element = Project?.elements.find((item) => entry.elements.includes(item.uuid));
            if (Project && element && instance?.canEditEntry(entry)) {
              instance.updateEntry(Project, element, text, entry.id, entry.elements);
            }
          },
        },
        template: `<div id="note_editor">
            <div v-if="!elementNotes.length" class="note_empty">No element notes yet. Right-click an element and choose Add Note.</div>
            <div v-for="entry in elementNotes" :key="entry.id" class="note_card" :style="{ borderColor: noteColor(entry.author) }">
                <div class="note_card_header">
                    <span class="note_author">{{ entry.author }}</span>
                    <span class="note_elements_icon" tabindex="0" :data-note-id="entry.id" :title="entry.elementNames" :aria-label="'Elements: ' + entry.elementNames">
                        <i class="material-icons" aria-hidden="true">view_in_ar</i>
                    </span>
                    <button v-if="entry.editable" class="note_edit" :title="editingId === entry.id ? 'Reading' : 'Edit note'" :aria-label="editingId === entry.id ? 'Reading' : 'Edit note'" @click="editingId = editingId === entry.id ? null : entry.id">
                        <i class="material-icons" aria-hidden="true">{{ editingId === entry.id ? 'menu_book' : 'code' }}</i>
                    </button>
                </div>
                <textarea v-if="editingId === entry.id && entry.editable" :value="entry.text" :aria-label="'Note by ' + entry.author" @change="editNote(entry, $event.target.value)"></textarea>
                <div v-else class="preview markdown" v-html="formatNote(entry.text)"></div>
            </div>
        </div>`,
      },
    });
    this.panelNotesSignature = undefined;
    this.refreshPanel();
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
      this.refreshPanel();
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

    this.deleteables.push(Blockbench.addCSS(css), NotesTweak.panel, select, joined, created, received);
    document.addEventListener("pointerdown", this.onBillboardPointerDown, true);
    window.addEventListener("pointermove", this.onBillboardPointerMove, true);
    window.addEventListener("mousemove", this.onNoteMouseMove, true);
    window.addEventListener("pointerup", this.onBillboardPointerUp, true);
    window.addEventListener("pointercancel", this.onBillboardPointerUp, true);
    document.addEventListener("pointerleave", this.onNotePointerLeave);
    window.addEventListener("blur", this.onNotePointerLeave);
    this.animationFrame = requestAnimationFrame(this.updateBillboards);
  }

  onDisable(): void {
    this.onNotePointerLeave();
    this.finishInlineEditor(true);
    this.pendingEditor = undefined;
    document.removeEventListener("pointerdown", this.onBillboardPointerDown, true);
    window.removeEventListener("pointermove", this.onBillboardPointerMove, true);
    window.removeEventListener("mousemove", this.onNoteMouseMove, true);
    window.removeEventListener("pointerup", this.onBillboardPointerUp, true);
    window.removeEventListener("pointercancel", this.onBillboardPointerUp, true);
    document.removeEventListener("pointerleave", this.onNotePointerLeave);
    window.removeEventListener("blur", this.onNotePointerLeave);
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
