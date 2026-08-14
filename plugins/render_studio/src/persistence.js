RenderStudio.installPersistence = () => {
  RenderStudio.listeners.push(Blockbench.on('save_project', ({model}) => {
    if (Project) {
      model.render_studio = RenderStudio.serializeState(RenderStudio.getState());
      RenderStudio.fingerprints.set(Project.uuid, JSON.stringify(model.render_studio));
    }
  }));
  RenderStudio.listeners.push(Blockbench.on('load_project', ({model}) => {
    if (!Project) return; const state = RenderStudio.defaults();
    if (model.render_studio && typeof model.render_studio === 'object') Object.assign(state, RenderStudio.cloneData(model.render_studio), {render: state.render});
    RenderStudio.projects.set(Project.uuid, state);
    Project.render_studio_state = state;
    Project.render_studio_snapshot = RenderStudio.serializeState(state);
    RenderStudio.fingerprints.set(Project.uuid, JSON.stringify(RenderStudio.serializeState(state)));
  }));
  RenderStudio.listeners.push(Blockbench.on('select_project', () => { if (RenderStudio.engine) {RenderStudio.engine.rebuild();RenderStudio.refreshUI();} }));
  RenderStudio.listeners.push(Blockbench.on('close_project', ({project}) => { if(project){RenderStudio.projects.delete(project.uuid);RenderStudio.fingerprints.delete(project.uuid);} }));
  RenderStudio.listeners.push(Blockbench.on('update_selection', () => { if(RenderStudio.engine)RenderStudio.engine.syncPose(); }));
};
RenderStudio.removePersistence = () => {RenderStudio.listeners.forEach(l=>l&&l.delete&&l.delete());RenderStudio.listeners.length=0;};
