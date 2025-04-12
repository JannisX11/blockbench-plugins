declare interface UndoSystem {
  /**
   * Starts an edit to the current project by saving the state of the provided aspects
   * @param aspects Aspects to save
   */
  initEdit(aspects: UndoAspects, amended?: boolean): UndoEntry;
}
