(function () {
  const ID = 'display_idle_preview';
  const ENABLED_KEY = ID + '_enabled';
  const POSE_KEY = ID + '_pose';
  const PI = Math.PI;

  const TEXT = String((typeof Language !== 'undefined' && Language.code) || '').startsWith('ja')
    ? {
        section: 'プレビュー',
        pose: 'ポーズ',
        idle: '待機モーション',
        pause: '一時停止',
        play: '再生',
        frame: 'コマ送り(tick)',
        poses: { stand: '立ち', walk: '歩く', run: '走る', sneak: 'スニーク', attack: '攻撃', ride: '乗り物', swim: '泳ぐ', elytra: 'エリトラ', sleep: '睡眠' },
      }
    : {
        section: 'Preview',
        pose: 'Pose',
        idle: 'Idle animation',
        pause: 'Pause',
        play: 'Play',
        frame: 'Frame (tick)',
        poses: { stand: 'Standing', walk: 'Walking', run: 'Sprinting', sneak: 'Sneaking', attack: 'Attacking', ride: 'Riding', swim: 'Swimming', elytra: 'Elytra', sleep: 'Sleeping' },
      };
  const POSES = TEXT.poses;
  const ICONS = {
    stand: 'person',
    walk: 'directions_walk',
    run: 'directions_run',
    sneak: 'downhill_skiing',
    attack: 'sports_martial_arts',
    ride: 'airline_seat_recline_normal',
    swim: 'pool',
    elytra: 'paragliding',
    sleep: 'hotel',
  };

  let enabled = localStorage.getItem(ENABLED_KEY) !== 'false';
  let pose = POSES[localStorage.getItem(POSE_KEY)] ? localStorage.getItem(POSE_KEY) : 'stand';
  let paused = false;
  let clock = 0;
  let idleClock = 0;
  let lastTime = performance.now();
  let frame = null;
  let ui = null;
  let uiState = '';
  let hookedRef = null;
  let dirtyRef = null;
  let lastKey = '';
  const bases = new WeakMap();

  const euler = new THREE.Euler(0, 0, 0, 'ZYX');
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const Q = (x, y, z) => new THREE.Quaternion().setFromEuler(euler.set(x, y, z, 'ZYX'));
  const J = (x, y, z) => Q(-x, -y, z);
  const ORIGIN = V(0, 0, 0);
  const ARM_REST = Q((22.5 * PI) / 180, 0, 0);
  const PIVOTS = {
    head: V(0, 24, 0),
    body: V(0, 24, 0),
    right_arm: V(5, 22, 0),
    left_arm: V(-5, 22, 0),
    right_leg: V(1.9, 12, 0),
    left_leg: V(-1.9, 12, 0),
  };
  const CSS = `
    #${ID} .bar{display:flex;align-items:center;gap:6px;padding-left:8px}
    #${ID} .dip_btn{flex:0 0 auto;height:26px;display:flex;align-items:center;border-radius:4px;cursor:pointer;background-color:var(--color-button);color:var(--color-text)}
    #${ID} .dip_btn:hover{color:var(--color-light)}
    #${ID} .dip_btn i{font-size:18px}
    #${ID} .dip_pose{width:130px;gap:6px;padding:0 4px 0 6px}
    #${ID} .dip_pose span{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding-top:2px}
    #${ID} .dip_pause{width:26px;justify-content:center}
    #${ID} .dip_pause.on{background-color:var(--color-accent);color:var(--color-accent_text,#fff)}
    #${ID} .off{opacity:.4;pointer-events:none}
    #${ID} input[type=range]{flex:1 1 auto;min-width:60px;max-width:160px;margin:0;accent-color:var(--color-accent);cursor:pointer}
    #${ID} input[type=number]{flex:0 0 auto;width:58px;height:24px;padding:0 4px;text-align:right;background-color:var(--color-button);color:var(--color-text);border-color:var(--color-button)}
    #${ID} .dip_max{font-size:12px;color:var(--color-subtle_text)}
    #${ID} .dip_toggle{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none}
    #${ID} .dip_toggle input{position:absolute;opacity:0;width:0;height:0}
    #${ID} .dip_track{position:relative;width:34px;height:18px;border-radius:9px;background-color:var(--color-button);transition:background-color .15s}
    #${ID} .dip_knob{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background-color:var(--color-text);transition:transform .15s}
    #${ID} input:checked+.dip_track{background-color:var(--color-accent)}
    #${ID} input:checked+.dip_track .dip_knob{transform:translateX(16px);background-color:var(--color-accent_text,#fff)}`;

  function setPose(value) {
    pose = POSES[value] ? value : 'stand';
    localStorage.setItem(POSE_KEY, pose);
    renderPose();
  }

  function setPaused(value) {
    paused = value;
    if (!ui) return;
    ui.pause.classList.toggle('on', paused);
    ui.pause.title = paused ? TEXT.play : TEXT.pause;
    ui.pause.firstChild.textContent = paused ? 'play_arrow' : 'pause';
  }

  function renderPose() {
    if (ui) ui.pose.innerHTML = `<i class="material-icons">${ICONS[pose]}</i><span>${POSES[pose]}</span><i class="material-icons">arrow_drop_down</i>`;
  }

  function ensureControls() {
    if (ui && ui.row.isConnected) return;
    const sliders = document.getElementById('display_sliders');
    if (!sliders) return;
    const row = document.createElement('div');
    row.id = ID;
    row.innerHTML = `<style>${CSS}</style>
      <div class="bar display_slot_section_bar"><p class="panel_toolbar_label">${TEXT.section}</p></div>
      <div class="bar"><label style="padding-top:3px">${TEXT.pose}</label><div class="dip_btn dip_pose"></div></div>
      <div class="bar">
        <div class="dip_btn dip_pause"><i class="material-icons">pause</i></div>
        <input type="range" min="0" step="1" value="0" title="${TEXT.frame}">
        <input type="number" class="dark_bordered" min="0" step="1" title="${TEXT.frame}">
        <span class="dip_max"></span>
      </div>
      <div class="bar"><label class="dip_toggle"><input type="checkbox"><span class="dip_track"><span class="dip_knob"></span></span><span style="padding-top:2px">${TEXT.idle}</span></label></div>`;
    sliders.insertAdjacentElement('afterend', row);
    ui = {
      row,
      pose: row.querySelector('.dip_pose'),
      pause: row.querySelector('.dip_pause'),
      bar: row.querySelector('input[type=range]'),
      num: row.querySelector('input[type=number]'),
      max: row.querySelector('.dip_max'),
      toggle: row.querySelector('input[type=checkbox]'),
    };
    uiState = '';
    ui.toggle.checked = enabled;
    ui.toggle.addEventListener('change', () => localStorage.setItem(ENABLED_KEY, String((enabled = ui.toggle.checked))));
    ui.pose.addEventListener('click', () =>
      new Menu(Object.keys(POSES).map((p) => ({ id: `${ID}_${p}`, name: POSES[p], icon: ICONS[p], click: () => setPose(p) }))).open(ui.pose)
    );
    ui.pause.addEventListener('click', () => setPaused(!paused));
    ui.bar.addEventListener('input', () => seek(Number(ui.bar.value)));
    ui.num.addEventListener('change', () => {
      const value = Math.round(Number(ui.num.value));
      if (Number.isFinite(value)) seek(Math.max(0, value));
    });
    ui.num.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') ui.num.blur();
    });
    renderPose();
    setPaused(paused);
  }

  function cycleTicks() {
    switch (pose) {
      case 'walk':
        return (2 * PI) / 0.6662 / 0.86;
      case 'run':
        return (2 * PI) / 0.6662;
      case 'attack':
        return 20;
      case 'swim':
        return 32.5;
      default:
        return 0;
    }
  }

  function seek(tick) {
    const period = cycleTicks();
    if (!period) return;
    setPaused(true);
    clock = (Math.floor((clock * 20) / period) * period + Math.min(tick, Math.floor(period))) / 20;
  }

  function updateUI(show) {
    const period = show ? cycleTicks() : 0;
    const max = Math.max(1, Math.floor(period));
    const tick = period ? Math.min(max, Math.floor((clock * 20) % period)) : -1;
    const state = `${show}|${max}|${tick}`;
    if (state === uiState) return;
    uiState = state;
    ui.row.style.display = show ? '' : 'none';
    if (!show) return;
    const off = !period;
    ui.pause.classList.toggle('off', off);
    ui.bar.classList.toggle('off', off);
    ui.bar.disabled = ui.num.disabled = off;
    ui.bar.max = ui.num.max = String(max);
    ui.max.textContent = off ? '/ -' : `/ ${max}`;
    if (document.activeElement !== ui.bar) ui.bar.value = off ? '0' : String(tick);
    if (document.activeElement !== ui.num) ui.num.value = off ? '' : String(tick);
  }

  function activePlayer() {
    const ref = Modes.display && displayReferenceObjects.active;
    return ref && ref.id === 'player' ? ref : null;
  }

  function holdingPart() {
    switch (DisplayMode.display_slot) {
      case 'thirdperson_righthand':
        return 'right_arm';
      case 'thirdperson_lefthand':
        return 'left_arm';
      case 'head':
        return 'head';
      default:
        return null;
    }
  }

  function classify(mesh) {
    const match = /^(head|right_arm|left_arm)/.exec(mesh.name || '');
    if (match) return match[1];
    if (Math.abs(mesh.position.y - 12) > 0.01) return 'body';
    mesh.geometry.computeBoundingBox();
    return mesh.geometry.boundingBox.max.x + mesh.geometry.boundingBox.min.x > 0 ? 'right_leg' : 'left_leg';
  }

  function baseOf(ref) {
    let base = bases.get(ref);
    if (!base) {
      base = {
        pos: ref.model.position.clone(),
        quat: ref.model.quaternion.clone(),
        parts: ref.model.children.map((mesh) => {
          const part = classify(mesh);
          const quat = part.endsWith('_arm') ? ARM_REST.clone() : mesh.quaternion.clone();
          return { mesh, part, pos: mesh.position.clone(), quat };
        }),
      };
      bases.set(ref, base);
    }
    return base;
  }

  function resetParts(ref) {
    const base = baseOf(ref);
    ref.model.position.copy(base.pos);
    ref.model.quaternion.copy(base.quat);
    for (const p of base.parts) {
      p.mesh.position.copy(p.pos);
      p.mesh.quaternion.copy(p.quat);
    }
  }

  function isActive(ref) {
    return (enabled || pose !== 'stand') && activePlayer() === ref;
  }

  function hook(ref) {
    if (hookedRef === ref) return;
    unhook();
    const original = ref.updateBasePosition;
    ref.updateBasePosition = function () {
      resetParts(this);
      original.call(this);
      if (isActive(this)) {
        applyPose(this);
        Transformer.center();
      }
    };
    ref[ID] = original;
    hookedRef = ref;
  }

  function unhook() {
    const ref = hookedRef;
    if (!ref) return;
    hookedRef = null;
    ref.updateBasePosition = ref[ID];
    delete ref[ID];
    resetParts(ref);
    if (activePlayer() === ref) ref.updateBasePosition();
  }

  function reset() {
    const ref = dirtyRef;
    dirtyRef = null;
    lastKey = '';
    if (!ref) return;
    resetParts(ref);
    if (activePlayer() === ref) ref.updateBasePosition();
    if (!Transformer.dragging) Transformer.center();
  }

  function walk(ticks, rate, amount) {
    const ls = ticks * rate * 0.6662;
    const holding = holdingPart();
    return {
      right_arm: { q: J(Math.cos(ls + PI) * amount * (holding === 'right_arm' ? 0.5 : 1), 0, 0) },
      left_arm: { q: J(Math.cos(ls) * amount * (holding === 'left_arm' ? 0.5 : 1), 0, 0) },
      right_leg: { q: J(Math.cos(ls) * 1.4 * amount, 0, 0) },
      left_leg: { q: J(Math.cos(ls + PI) * 1.4 * amount, 0, 0) },
    };
  }

  function attack(ticks) {
    const t = (ticks % 20) / 6;
    if (t >= 1) return {};
    const swing = holdingPart() === 'left_arm' ? 'left_arm' : 'right_arm';
    const b = Math.sin(Math.sqrt(t) * PI * 2) * (swing === 'left_arm' ? -0.2 : 0.2);
    const yaw = Q(0, -b, 0);
    const f = 1 - Math.pow(1 - t, 4);
    const rot = { right_arm: [0, b, 0], left_arm: [b, b, 0] };
    rot[swing][0] -= Math.sin(f * PI) * 1.2 + Math.sin(t * PI) * 0.525;
    rot[swing][1] += b * 2;
    rot[swing][2] -= Math.sin(t * PI) * 0.4;
    const d = { body: { q: J(0, b, 0) } };
    for (const side in rot) d[side] = { move: PIVOTS[side].clone().applyQuaternion(yaw).sub(PIVOTS[side]), q: J(...rot[side]) };
    return d;
  }

  function swim(ticks) {
    const ls = ticks * 0.8;
    const f = ls % 26;
    let x = 0;
    let zL = PI;
    let zR = PI;
    if (f < 14) {
      const s = (1.8707964 * (f * f - 65 * f)) / -714;
      zL += s;
      zR -= s;
    } else if (f < 22) {
      const s = (f - 14) / 8;
      x = (PI / 2) * s;
      zL = 5.012389 - 1.8707964 * s;
      zR = 1.2707963 + 1.8707964 * s;
    } else {
      x = (PI / 2) * (1 - (f - 22) / 4);
    }
    return {
      head: { q: J(-PI / 4, 0, 0) },
      right_arm: { abs: J(x, PI, zR) },
      left_arm: { abs: J(x, PI, zL) },
      right_leg: { abs: J(0.3 * Math.cos(ls / 3), 0, 0) },
      left_leg: { abs: J(0.3 * Math.cos(ls / 3 + PI), 0, 0) },
    };
  }

  function deltasFor(ticks) {
    switch (pose) {
      case 'walk':
        return walk(ticks, 0.86, 0.86);
      case 'run':
        return walk(ticks, 1, 1);
      case 'attack':
        return attack(ticks);
      case 'sneak':
        return {
          head: { move: V(0, -4.2, 0) },
          body: { move: V(0, -3.2, 0), q: J(0.5, 0, 0) },
          right_arm: { move: V(0, -3.2, 0), q: J(0.4, 0, 0) },
          left_arm: { move: V(0, -3.2, 0), q: J(0.4, 0, 0) },
          right_leg: { move: V(0, -0.2, 4) },
          left_leg: { move: V(0, -0.2, 4) },
        };
      case 'ride':
        return {
          right_arm: { q: J(-PI / 5, 0, 0) },
          left_arm: { q: J(-PI / 5, 0, 0) },
          right_leg: { abs: J(-1.4137167, PI / 10, 0.07853982) },
          left_leg: { abs: J(-1.4137167, -PI / 10, -0.07853982) },
        };
      case 'swim':
        return swim(ticks);
      case 'elytra':
        return { head: { q: J(-PI / 4, 0, 0) } };
      default:
        return {};
    }
  }

  function rootFor() {
    switch (pose) {
      case 'sneak':
        return { move: V(0, -2, 0), q: Q(0, 0, 0) };
      case 'sleep':
        return { move: V(0, 2, 0), q: Q(PI / 2, 0, 0) };
      case 'swim':
        return { move: V(0, 4.8, 16), q: Q(-PI / 2, 0, 0) };
      case 'elytra':
        return { move: ORIGIN, q: Q(-PI / 2, 0, 0) };
      default:
        return null;
    }
  }

  function applyDelta(obj, pivot, d) {
    if (d.q) obj.position.sub(pivot).applyQuaternion(d.q).add(pivot);
    if (d.move) obj.position.add(d.move);
    if (d.q) obj.quaternion.premultiply(d.q);
  }

  function applyPose(ref) {
    const deltas = deltasFor(clock * 20);
    const parts = baseOf(ref).parts;
    for (const name in deltas) {
      const d = deltas[name];
      if (!d.abs) continue;
      const p = parts.find((x) => x.part === name);
      d.q = p ? d.abs.multiply(p.mesh.quaternion.clone().invert()) : d.abs;
    }
    if (enabled) {
      const t = idleClock * 20;
      const z = Math.cos(t * 0.09) * 0.05 + 0.05;
      const x = Math.sin(t * 0.067) * 0.05;
      for (const side of ['right_arm', 'left_arm']) {
        const d = deltas[side] || (deltas[side] = {});
        if (d.abs) continue;
        const s = side === 'right_arm' ? 1 : -1;
        const sway = Q(s * x, 0, s * z);
        d.q = d.q ? sway.multiply(d.q) : sway;
      }
    }
    for (const p of parts) if (deltas[p.part]) applyDelta(p.mesh, PIVOTS[p.part], deltas[p.part]);

    const area = DisplayMode.display_area;
    const holding = holdingPart();
    if (area && holding && deltas[holding]) applyDelta(area, PIVOTS[holding], deltas[holding]);
    const root = rootFor();
    if (root) {
      ref.model.position.copy(root.move);
      ref.model.quaternion.copy(root.q);
      if (area && holding) applyDelta(area, ORIGIN, root);
    }
    ref.model.updateMatrixWorld(true);
    if (area) area.updateMatrixWorld(true);
  }

  function tick() {
    frame = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    const dragging = Transformer.dragging;
    if (!dragging) {
      idleClock += dt;
      if (!paused) clock += dt;
    }
    if (!Modes.display) {
      if (dirtyRef) reset();
      return;
    }
    ensureControls();
    if (ui) updateUI(holdingPart() !== null);

    const ref = activePlayer();
    if (ref) hook(ref);
    if (!ref || !isActive(ref)) {
      if (dirtyRef) reset();
      return;
    }
    if (dragging) return;
    const key = `${pose}|${DisplayMode.display_slot}|${enabled ? idleClock : ''}|${cycleTicks() ? clock : ''}`;
    if (dirtyRef === ref && key === lastKey) return;
    dirtyRef = ref;
    lastKey = key;
    ref.updateBasePosition();
  }

  Plugin.register(ID, {
    title: 'Display Idle Preview',
    author: 'chikuwaten',
    description: 'Check how items look in the pose selected in the display settings.',
    icon: 'icon.png',
    tags: ['Minecraft', 'Display'],
    version: '1.0.0',
    creation_date: '2026-11-18',
    variant: 'both',
    min_version: '4.8.0',
    onload() {
      frame = requestAnimationFrame(tick);
    },
    onunload() {
      cancelAnimationFrame(frame);
      reset();
      unhook();
      if (ui) ui.row.remove();
      ui = null;
    },
  });
})();
