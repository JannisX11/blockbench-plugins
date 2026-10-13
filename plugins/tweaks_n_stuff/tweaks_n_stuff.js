var te = ((n) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(n, { get: (e, t) => (typeof require < "u" ? require : e)[t] })
      : n)(function (n) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + n + '" is not supported');
});
var Fe = {};
var De = {};
var He = {
  "settings.header_color": "Header Color",
  "settings.header_color.desc":
    "Sets the color of the header depending on the profile color.",
  "settings.close_actions": "Close Actions",
  "settings.close_actions.desc":
    "Adds 'Close Others', 'Close to the Right', 'Close Saved', and 'Close All' to the project context menu, opened by right-clicking on a project tab.",
  "settings.pin_tab": "Pin Tab",
  "settings.pin_tab.desc":
    "Adds 'Pin Tab' and 'Unpin Tab' to the project context menu, opened by right-clicking on a project tab.",
  "settings.wrap_tabs": "Wrap Tabs",
  "settings.wrap_tabs.desc":
    "Controls whether tabs should be wrapped over multiple lines when exceeding available space or whether a scrollbar should appear instead.",
  "settings.notes": "Notes",
  "settings.notes.desc": "Add a note to any project.",
  "settings.per_element_notes": "Per element notes",
  "settings.per_element_notes.desc":
    "Add notes to individual elements and show them beside the model in the 3D canvas.",
  "settings.bedrock_open_all": "Bedrock Open All",
  "settings.bedrock_open_all.desc":
    "Adds a 'Open All' button when opening a bedrock geometry file that contains multiple models.",
  "settings.bedrock_block_geometry": "Open Bedrock Block Geometry",
  "settings.bedrock_block_geometry.desc":
    "Adds a File > Import action to open the geometry referenced by a Bedrock block JSON file.",
  "settings.bedrock_entity_geometry": "Open Bedrock Entity Geometry",
  "settings.bedrock_entity_geometry.desc":
    "Opens geometry and custom hit test boxes from a behavior pack entity JSON file.",
  "settings.clear_recent_projects": "Clear Recent Projects",
  "settings.clear_recent_projects.desc":
    "Adds a button beside Recent on the main screen to clear the recent projects list.",
  "settings.issue_form": "Issue Form",
  "settings.issue_form.desc":
    "Generates a prefilled form for submitting issues with Blockbench.",
  "action.close_others": "Close Others",
  "action.close_others.desc": "Close all tabs but this one.",
  "action.close_right": "Close to the Right",
  "action.close_right.desc": "Close all tabs to the right.",
  "action.close_saved": "Close Saved",
  "action.close_saved.desc": "Close all saved tabs.",
  "action.close_all": "Close All",
  "action.close_all.desc": "Close all tabs.",
  "action.pin_tab": "Pin Tab",
  "action.pin_tab.desc": "Keep this tab open and fixed in place.",
  "action.unpin_tab": "Unpin Tab",
  "action.unpin_tab.desc": "Release this tab so it can be moved or closed.",
  "action.clear_recent_projects": "Clear recent projects",
  "dialog.clear_recent_projects.message":
    "Remove all projects from the Recent list? This does not delete project files.",
  "action.note_editor_mode": "Note View",
  "action.note_editor_mode.reading": "Reading",
  "action.note_editor_mode.source": "Source",
  "action.note_editor_mode.live_preview": "Live Preview",
  "dialog.select_model.open_all": "Open All",
  "panel.note": "Note",
};
var Le = {};
var ze = {};
var $e = {};
var Ue = {};
var Ge = {};
var Ve = {};
var Je = {};
var Xe = {};
var We = {};
var Ye = {};
var qe = {};
var Ke = {};
var Qe = {};
var Ze = {};
Language.addTranslations("cz", Fe);
Language.addTranslations("de", De);
Language.addTranslations("en", He);
Language.addTranslations("es", Le);
Language.addTranslations("fr", ze);
Language.addTranslations("it", $e);
Language.addTranslations("ja", Ue);
Language.addTranslations("ko", Ge);
Language.addTranslations("nl", Ve);
Language.addTranslations("pl", Je);
Language.addTranslations("pt", Xe);
Language.addTranslations("ru", We);
Language.addTranslations("sv", Ye);
Language.addTranslations("uk", qe);
Language.addTranslations("vi", Ke);
Language.addTranslations("zh_tw", Qe);
Language.addTranslations("zh", Ze);
var et = "1.1.0",
  X = "tweaks_n_stuff";
function re(n, e) {
  let t = 0;
  function o() {
    (e(n[t], t), t++, t < n.length && requestAnimationFrame(o));
  }
  o();
}
function K(n) {
  try {
    n();
  } catch (e) {
    console.error(e);
  }
}
function tt(n, e) {
  return (
    (n = Math.ceil(n)),
    (e = Math.floor(e)),
    Math.floor(Math.random() * (e - n + 1)) + n
  );
}
var H = class n {
    static all = new Map();
    static dialog;
    static action;
    id;
    author;
    category;
    condition;
    pluginId;
    setting;
    name;
    description;
    isActive = !1;
    deleteables;
    constructor(e, t) {
      ((this.id = e),
        (this.name = t?.name),
        (this.description = t?.description),
        (this.author = t?.author ?? "unset"),
        (this.category = t?.category ?? "unset"),
        (this.condition = t?.condition ?? !0),
        (this.pluginId = X),
        (this.deleteables = []),
        this.setup(),
        n.all.set(this.id, this),
        console.debug(`\u{1F527} Registered tweak "${this.id}"`));
    }
    createConfig() {
      return { enabled: !0 };
    }
    get config() {
      return ne.settings[this.id];
    }
    set config(e) {
      ne.settings[this.id] = e;
    }
    load() {
      (this.setup(), K(this.onLoad.bind(this)));
    }
    unload() {
      (K(this.onUnload.bind(this)), this.delete());
    }
    install() {
      K(this.onInstall.bind(this));
    }
    uninstall() {
      K(this.onUninstall.bind(this));
    }
    delete() {
      (this.deleteables.forEach((e) => e.delete()),
        this.setting && this.setting.delete());
    }
    enable() {
      (console.debug(`\u2705 Enabled tweak "${this.id}"`),
        (this.isActive = !0));
    }
    disable() {
      (this.deleteables.forEach((e) => e.delete()),
        this.isActive && console.debug(`\u274C Disabled tweak "${this.id}"`));
    }
    setup() {}
    onLoad() {}
    onUnload() {}
    onInstall() {}
    onUninstall() {}
  },
  j = class extends H {
    defaultValue;
    constructor(e, t, o = !0) {
      (super(e, t), (this.defaultValue = o));
    }
    get disabled() {
      return !(Settings.get(this.id) ?? !1);
    }
    setup() {
      ((this.isActive = !1),
        (this.setting = new Setting(this.id, {
          name: this.name,
          type: "toggle",
          value: this.defaultValue,
          description: this.description,
          category: this.category,
          condition: this.condition,
          onChange: (e) => this.change(e),
        })));
    }
    enable() {
      (super.enable(), this.onEnable && K(this.onEnable.bind(this)));
    }
    disable() {
      (super.disable(),
        this.isActive &&
          ((this.isActive = !1),
          this.onDisable && K(this.onDisable.bind(this))));
    }
    change(e) {
      if ((this.onChange && this.onChange(e), this.disable(), !!e))
        return this.enable();
    }
    onLoad() {
      this.disabled || this.enable();
    }
    onUnload() {
      this.disable();
    }
  };
var ne = class n {
  static settings = {};
  static load() {
    var e = localStorage.getItem("tweaks_n_stuff.config");
    if (!e) {
      n.settings = {};
      for (let t of H.all.values()) n.settings[t.id] = t.createConfig();
      return n.save();
    }
    n.settings = JSON.parse(e);
  }
  static save() {
    localStorage.setItem("tweaks_n_stuff.config", JSON.stringify(n.settings));
  }
};
var se = class n {
  static selectProfile;
  static unselectProfile;
  static hideDialog;
  static showDialog;
  static selectCube;
  static unselectCube;
  static load() {
    ((this.selectProfile = SettingsProfile.prototype.select),
      (SettingsProfile.prototype.select = function (...e) {
        (n.selectProfile.apply(this, e),
          Blockbench.dispatchEvent("profile_changed", {
            profile: SettingsProfile.selected,
          }));
      }),
      (this.unselectProfile = SettingsProfile.unselect),
      (SettingsProfile.unselect = function (...e) {
        (n.unselectProfile.apply(this, e),
          Blockbench.dispatchEvent("profile_changed", { profile: null }));
      }),
      (this.hideDialog = Dialog.prototype.hide),
      (Dialog.prototype.hide = function (...e) {
        return (
          Blockbench.dispatchEvent("hide_dialog", { dialog: this }),
          n.hideDialog.apply(this, e)
        );
      }),
      (this.showDialog = Dialog.prototype.show),
      (Dialog.prototype.show = function (...e) {
        let t = n.showDialog.apply(this, e);
        return (Blockbench.dispatchEvent("show_dialog", { dialog: this }), t);
      }),
      (this.selectCube = Cube.prototype.select),
      (Cube.prototype.select = function (...e) {
        let t = n.selectCube.apply(this, e);
        return (Blockbench.dispatchEvent("select_cube", Cube.selected), t);
      }),
      (this.unselectCube = Cube.prototype.unselect),
      (Cube.prototype.unselect = function (...e) {
        let t = n.unselectCube.apply(this, e);
        return (Blockbench.dispatchEvent("unselect_cube", Cube.selected), t);
      }));
  }
  static unload() {
    ((SettingsProfile.prototype.select = n.selectProfile),
      (SettingsProfile.unselect = n.unselectProfile),
      (Dialog.prototype.hide = n.hideDialog),
      (Dialog.prototype.show = n.showDialog),
      (Cube.prototype.select = n.selectCube),
      (Cube.prototype.unselect = n.unselectCube));
  }
};
function de(n) {
  "@babel/helpers - typeof";
  return (
    (de =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              typeof Symbol == "function" &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          }),
    de(n)
  );
}
var Tt = /^\s+/,
  It = /\s+$/;
function g(n, e) {
  if (((n = n || ""), (e = e || {}), n instanceof g)) return n;
  if (!(this instanceof g)) return new g(n, e);
  var t = Ot(n);
  ((this._originalInput = n),
    (this._r = t.r),
    (this._g = t.g),
    (this._b = t.b),
    (this._a = t.a),
    (this._roundA = Math.round(100 * this._a) / 100),
    (this._format = e.format || t.format),
    (this._gradientType = e.gradientType),
    this._r < 1 && (this._r = Math.round(this._r)),
    this._g < 1 && (this._g = Math.round(this._g)),
    this._b < 1 && (this._b = Math.round(this._b)),
    (this._ok = t.ok));
}
g.prototype = {
  isDark: function () {
    return this.getBrightness() < 128;
  },
  isLight: function () {
    return !this.isDark();
  },
  isValid: function () {
    return this._ok;
  },
  getOriginalInput: function () {
    return this._originalInput;
  },
  getFormat: function () {
    return this._format;
  },
  getAlpha: function () {
    return this._a;
  },
  getBrightness: function () {
    var e = this.toRgb();
    return (e.r * 299 + e.g * 587 + e.b * 114) / 1e3;
  },
  getLuminance: function () {
    var e = this.toRgb(),
      t,
      o,
      i,
      r,
      c,
      s;
    return (
      (t = e.r / 255),
      (o = e.g / 255),
      (i = e.b / 255),
      t <= 0.03928 ? (r = t / 12.92) : (r = Math.pow((t + 0.055) / 1.055, 2.4)),
      o <= 0.03928 ? (c = o / 12.92) : (c = Math.pow((o + 0.055) / 1.055, 2.4)),
      i <= 0.03928 ? (s = i / 12.92) : (s = Math.pow((i + 0.055) / 1.055, 2.4)),
      0.2126 * r + 0.7152 * c + 0.0722 * s
    );
  },
  setAlpha: function (e) {
    return (
      (this._a = ct(e)),
      (this._roundA = Math.round(100 * this._a) / 100),
      this
    );
  },
  toHsv: function () {
    var e = ot(this._r, this._g, this._b);
    return { h: e.h * 360, s: e.s, v: e.v, a: this._a };
  },
  toHsvString: function () {
    var e = ot(this._r, this._g, this._b),
      t = Math.round(e.h * 360),
      o = Math.round(e.s * 100),
      i = Math.round(e.v * 100);
    return this._a == 1
      ? "hsv(" + t + ", " + o + "%, " + i + "%)"
      : "hsva(" + t + ", " + o + "%, " + i + "%, " + this._roundA + ")";
  },
  toHsl: function () {
    var e = nt(this._r, this._g, this._b);
    return { h: e.h * 360, s: e.s, l: e.l, a: this._a };
  },
  toHslString: function () {
    var e = nt(this._r, this._g, this._b),
      t = Math.round(e.h * 360),
      o = Math.round(e.s * 100),
      i = Math.round(e.l * 100);
    return this._a == 1
      ? "hsl(" + t + ", " + o + "%, " + i + "%)"
      : "hsla(" + t + ", " + o + "%, " + i + "%, " + this._roundA + ")";
  },
  toHex: function (e) {
    return it(this._r, this._g, this._b, e);
  },
  toHexString: function (e) {
    return "#" + this.toHex(e);
  },
  toHex8: function (e) {
    return Ht(this._r, this._g, this._b, this._a, e);
  },
  toHex8String: function (e) {
    return "#" + this.toHex8(e);
  },
  toRgb: function () {
    return {
      r: Math.round(this._r),
      g: Math.round(this._g),
      b: Math.round(this._b),
      a: this._a,
    };
  },
  toRgbString: function () {
    return this._a == 1
      ? "rgb(" +
          Math.round(this._r) +
          ", " +
          Math.round(this._g) +
          ", " +
          Math.round(this._b) +
          ")"
      : "rgba(" +
          Math.round(this._r) +
          ", " +
          Math.round(this._g) +
          ", " +
          Math.round(this._b) +
          ", " +
          this._roundA +
          ")";
  },
  toPercentageRgb: function () {
    return {
      r: Math.round(w(this._r, 255) * 100) + "%",
      g: Math.round(w(this._g, 255) * 100) + "%",
      b: Math.round(w(this._b, 255) * 100) + "%",
      a: this._a,
    };
  },
  toPercentageRgbString: function () {
    return this._a == 1
      ? "rgb(" +
          Math.round(w(this._r, 255) * 100) +
          "%, " +
          Math.round(w(this._g, 255) * 100) +
          "%, " +
          Math.round(w(this._b, 255) * 100) +
          "%)"
      : "rgba(" +
          Math.round(w(this._r, 255) * 100) +
          "%, " +
          Math.round(w(this._g, 255) * 100) +
          "%, " +
          Math.round(w(this._b, 255) * 100) +
          "%, " +
          this._roundA +
          ")";
  },
  toName: function () {
    return this._a === 0
      ? "transparent"
      : this._a < 1
        ? !1
        : Kt[it(this._r, this._g, this._b, !0)] || !1;
  },
  toFilter: function (e) {
    var t = "#" + rt(this._r, this._g, this._b, this._a),
      o = t,
      i = this._gradientType ? "GradientType = 1, " : "";
    if (e) {
      var r = g(e);
      o = "#" + rt(r._r, r._g, r._b, r._a);
    }
    return (
      "progid:DXImageTransform.Microsoft.gradient(" +
      i +
      "startColorstr=" +
      t +
      ",endColorstr=" +
      o +
      ")"
    );
  },
  toString: function (e) {
    var t = !!e;
    e = e || this._format;
    var o = !1,
      i = this._a < 1 && this._a >= 0,
      r =
        !t &&
        i &&
        (e === "hex" ||
          e === "hex6" ||
          e === "hex3" ||
          e === "hex4" ||
          e === "hex8" ||
          e === "name");
    return r
      ? e === "name" && this._a === 0
        ? this.toName()
        : this.toRgbString()
      : (e === "rgb" && (o = this.toRgbString()),
        e === "prgb" && (o = this.toPercentageRgbString()),
        (e === "hex" || e === "hex6") && (o = this.toHexString()),
        e === "hex3" && (o = this.toHexString(!0)),
        e === "hex4" && (o = this.toHex8String(!0)),
        e === "hex8" && (o = this.toHex8String()),
        e === "name" && (o = this.toName()),
        e === "hsl" && (o = this.toHslString()),
        e === "hsv" && (o = this.toHsvString()),
        o || this.toHexString());
  },
  clone: function () {
    return g(this.toString());
  },
  _applyModification: function (e, t) {
    var o = e.apply(null, [this].concat([].slice.call(t)));
    return (
      (this._r = o._r),
      (this._g = o._g),
      (this._b = o._b),
      this.setAlpha(o._a),
      this
    );
  },
  lighten: function () {
    return this._applyModification(Ut, arguments);
  },
  brighten: function () {
    return this._applyModification(Gt, arguments);
  },
  darken: function () {
    return this._applyModification(Vt, arguments);
  },
  desaturate: function () {
    return this._applyModification(Lt, arguments);
  },
  saturate: function () {
    return this._applyModification(zt, arguments);
  },
  greyscale: function () {
    return this._applyModification($t, arguments);
  },
  spin: function () {
    return this._applyModification(Jt, arguments);
  },
  _applyCombination: function (e, t) {
    return e.apply(null, [this].concat([].slice.call(t)));
  },
  analogous: function () {
    return this._applyCombination(Yt, arguments);
  },
  complement: function () {
    return this._applyCombination(Xt, arguments);
  },
  monochromatic: function () {
    return this._applyCombination(qt, arguments);
  },
  splitcomplement: function () {
    return this._applyCombination(Wt, arguments);
  },
  triad: function () {
    return this._applyCombination(st, [3]);
  },
  tetrad: function () {
    return this._applyCombination(st, [4]);
  },
};
g.fromRatio = function (n, e) {
  if (de(n) == "object") {
    var t = {};
    for (var o in n)
      n.hasOwnProperty(o) && (o === "a" ? (t[o] = n[o]) : (t[o] = ae(n[o])));
    n = t;
  }
  return g(n, e);
};
function Ot(n) {
  var e = { r: 0, g: 0, b: 0 },
    t = 1,
    o = null,
    i = null,
    r = null,
    c = !1,
    s = !1;
  return (
    typeof n == "string" && (n = tn(n)),
    de(n) == "object" &&
      (G(n.r) && G(n.g) && G(n.b)
        ? ((e = Rt(n.r, n.g, n.b)),
          (c = !0),
          (s = String(n.r).substr(-1) === "%" ? "prgb" : "rgb"))
        : G(n.h) && G(n.s) && G(n.v)
          ? ((o = ae(n.s)),
            (i = ae(n.v)),
            (e = Dt(n.h, o, i)),
            (c = !0),
            (s = "hsv"))
          : G(n.h) &&
            G(n.s) &&
            G(n.l) &&
            ((o = ae(n.s)),
            (r = ae(n.l)),
            (e = Ft(n.h, o, r)),
            (c = !0),
            (s = "hsl")),
      n.hasOwnProperty("a") && (t = n.a)),
    (t = ct(t)),
    {
      ok: c,
      format: n.format || s,
      r: Math.min(255, Math.max(e.r, 0)),
      g: Math.min(255, Math.max(e.g, 0)),
      b: Math.min(255, Math.max(e.b, 0)),
      a: t,
    }
  );
}
function Rt(n, e, t) {
  return { r: w(n, 255) * 255, g: w(e, 255) * 255, b: w(t, 255) * 255 };
}
function nt(n, e, t) {
  ((n = w(n, 255)), (e = w(e, 255)), (t = w(t, 255)));
  var o = Math.max(n, e, t),
    i = Math.min(n, e, t),
    r,
    c,
    s = (o + i) / 2;
  if (o == i) r = c = 0;
  else {
    var a = o - i;
    switch (((c = s > 0.5 ? a / (2 - o - i) : a / (o + i)), o)) {
      case n:
        r = (e - t) / a + (e < t ? 6 : 0);
        break;
      case e:
        r = (t - n) / a + 2;
        break;
      case t:
        r = (n - e) / a + 4;
        break;
    }
    r /= 6;
  }
  return { h: r, s: c, l: s };
}
function Ft(n, e, t) {
  var o, i, r;
  ((n = w(n, 360)), (e = w(e, 100)), (t = w(t, 100)));
  function c(d, b, h) {
    return (
      h < 0 && (h += 1),
      h > 1 && (h -= 1),
      h < 1 / 6
        ? d + (b - d) * 6 * h
        : h < 1 / 2
          ? b
          : h < 2 / 3
            ? d + (b - d) * (2 / 3 - h) * 6
            : d
    );
  }
  if (e === 0) o = i = r = t;
  else {
    var s = t < 0.5 ? t * (1 + e) : t + e - t * e,
      a = 2 * t - s;
    ((o = c(a, s, n + 1 / 3)), (i = c(a, s, n)), (r = c(a, s, n - 1 / 3)));
  }
  return { r: o * 255, g: i * 255, b: r * 255 };
}
function ot(n, e, t) {
  ((n = w(n, 255)), (e = w(e, 255)), (t = w(t, 255)));
  var o = Math.max(n, e, t),
    i = Math.min(n, e, t),
    r,
    c,
    s = o,
    a = o - i;
  if (((c = o === 0 ? 0 : a / o), o == i)) r = 0;
  else {
    switch (o) {
      case n:
        r = (e - t) / a + (e < t ? 6 : 0);
        break;
      case e:
        r = (t - n) / a + 2;
        break;
      case t:
        r = (n - e) / a + 4;
        break;
    }
    r /= 6;
  }
  return { h: r, s: c, v: s };
}
function Dt(n, e, t) {
  ((n = w(n, 360) * 6), (e = w(e, 100)), (t = w(t, 100)));
  var o = Math.floor(n),
    i = n - o,
    r = t * (1 - e),
    c = t * (1 - i * e),
    s = t * (1 - (1 - i) * e),
    a = o % 6,
    d = [t, c, r, r, s, t][a],
    b = [s, t, t, c, r, r][a],
    h = [r, r, s, t, t, c][a];
  return { r: d * 255, g: b * 255, b: h * 255 };
}
function it(n, e, t, o) {
  var i = [
    F(Math.round(n).toString(16)),
    F(Math.round(e).toString(16)),
    F(Math.round(t).toString(16)),
  ];
  return o &&
    i[0].charAt(0) == i[0].charAt(1) &&
    i[1].charAt(0) == i[1].charAt(1) &&
    i[2].charAt(0) == i[2].charAt(1)
    ? i[0].charAt(0) + i[1].charAt(0) + i[2].charAt(0)
    : i.join("");
}
function Ht(n, e, t, o, i) {
  var r = [
    F(Math.round(n).toString(16)),
    F(Math.round(e).toString(16)),
    F(Math.round(t).toString(16)),
    F(lt(o)),
  ];
  return i &&
    r[0].charAt(0) == r[0].charAt(1) &&
    r[1].charAt(0) == r[1].charAt(1) &&
    r[2].charAt(0) == r[2].charAt(1) &&
    r[3].charAt(0) == r[3].charAt(1)
    ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) + r[3].charAt(0)
    : r.join("");
}
function rt(n, e, t, o) {
  var i = [
    F(lt(o)),
    F(Math.round(n).toString(16)),
    F(Math.round(e).toString(16)),
    F(Math.round(t).toString(16)),
  ];
  return i.join("");
}
g.equals = function (n, e) {
  return !n || !e ? !1 : g(n).toRgbString() == g(e).toRgbString();
};
g.random = function () {
  return g.fromRatio({ r: Math.random(), g: Math.random(), b: Math.random() });
};
function Lt(n, e) {
  e = e === 0 ? 0 : e || 10;
  var t = g(n).toHsl();
  return ((t.s -= e / 100), (t.s = he(t.s)), g(t));
}
function zt(n, e) {
  e = e === 0 ? 0 : e || 10;
  var t = g(n).toHsl();
  return ((t.s += e / 100), (t.s = he(t.s)), g(t));
}
function $t(n) {
  return g(n).desaturate(100);
}
function Ut(n, e) {
  e = e === 0 ? 0 : e || 10;
  var t = g(n).toHsl();
  return ((t.l += e / 100), (t.l = he(t.l)), g(t));
}
function Gt(n, e) {
  e = e === 0 ? 0 : e || 10;
  var t = g(n).toRgb();
  return (
    (t.r = Math.max(0, Math.min(255, t.r - Math.round(255 * -(e / 100))))),
    (t.g = Math.max(0, Math.min(255, t.g - Math.round(255 * -(e / 100))))),
    (t.b = Math.max(0, Math.min(255, t.b - Math.round(255 * -(e / 100))))),
    g(t)
  );
}
function Vt(n, e) {
  e = e === 0 ? 0 : e || 10;
  var t = g(n).toHsl();
  return ((t.l -= e / 100), (t.l = he(t.l)), g(t));
}
function Jt(n, e) {
  var t = g(n).toHsl(),
    o = (t.h + e) % 360;
  return ((t.h = o < 0 ? 360 + o : o), g(t));
}
function Xt(n) {
  var e = g(n).toHsl();
  return ((e.h = (e.h + 180) % 360), g(e));
}
function st(n, e) {
  if (isNaN(e) || e <= 0)
    throw new Error("Argument to polyad must be a positive number");
  for (var t = g(n).toHsl(), o = [g(n)], i = 360 / e, r = 1; r < e; r++)
    o.push(g({ h: (t.h + r * i) % 360, s: t.s, l: t.l }));
  return o;
}
function Wt(n) {
  var e = g(n).toHsl(),
    t = e.h;
  return [
    g(n),
    g({ h: (t + 72) % 360, s: e.s, l: e.l }),
    g({ h: (t + 216) % 360, s: e.s, l: e.l }),
  ];
}
function Yt(n, e, t) {
  ((e = e || 6), (t = t || 30));
  var o = g(n).toHsl(),
    i = 360 / t,
    r = [g(n)];
  for (o.h = (o.h - ((i * e) >> 1) + 720) % 360; --e; )
    ((o.h = (o.h + i) % 360), r.push(g(o)));
  return r;
}
function qt(n, e) {
  e = e || 6;
  for (
    var t = g(n).toHsv(), o = t.h, i = t.s, r = t.v, c = [], s = 1 / e;
    e--;
  )
    (c.push(g({ h: o, s: i, v: r })), (r = (r + s) % 1));
  return c;
}
g.mix = function (n, e, t) {
  t = t === 0 ? 0 : t || 50;
  var o = g(n).toRgb(),
    i = g(e).toRgb(),
    r = t / 100,
    c = {
      r: (i.r - o.r) * r + o.r,
      g: (i.g - o.g) * r + o.g,
      b: (i.b - o.b) * r + o.b,
      a: (i.a - o.a) * r + o.a,
    };
  return g(c);
};
g.readability = function (n, e) {
  var t = g(n),
    o = g(e);
  return (
    (Math.max(t.getLuminance(), o.getLuminance()) + 0.05) /
    (Math.min(t.getLuminance(), o.getLuminance()) + 0.05)
  );
};
g.isReadable = function (n, e, t) {
  var o = g.readability(n, e),
    i,
    r;
  switch (((r = !1), (i = nn(t)), i.level + i.size)) {
    case "AAsmall":
    case "AAAlarge":
      r = o >= 4.5;
      break;
    case "AAlarge":
      r = o >= 3;
      break;
    case "AAAsmall":
      r = o >= 7;
      break;
  }
  return r;
};
g.mostReadable = function (n, e, t) {
  var o = null,
    i = 0,
    r,
    c,
    s,
    a;
  ((t = t || {}), (c = t.includeFallbackColors), (s = t.level), (a = t.size));
  for (var d = 0; d < e.length; d++)
    ((r = g.readability(n, e[d])), r > i && ((i = r), (o = g(e[d]))));
  return g.isReadable(n, o, { level: s, size: a }) || !c
    ? o
    : ((t.includeFallbackColors = !1), g.mostReadable(n, ["#fff", "#000"], t));
};
var ve = (g.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32",
  }),
  Kt = (g.hexNames = Qt(ve));
function Qt(n) {
  var e = {};
  for (var t in n) n.hasOwnProperty(t) && (e[n[t]] = t);
  return e;
}
function ct(n) {
  return ((n = parseFloat(n)), (isNaN(n) || n < 0 || n > 1) && (n = 1), n);
}
function w(n, e) {
  Zt(n) && (n = "100%");
  var t = en(n);
  return (
    (n = Math.min(e, Math.max(0, parseFloat(n)))),
    t && (n = parseInt(n * e, 10) / 100),
    Math.abs(n - e) < 1e-6 ? 1 : (n % e) / parseFloat(e)
  );
}
function he(n) {
  return Math.min(1, Math.max(0, n));
}
function C(n) {
  return parseInt(n, 16);
}
function Zt(n) {
  return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
}
function en(n) {
  return typeof n == "string" && n.indexOf("%") != -1;
}
function F(n) {
  return n.length == 1 ? "0" + n : "" + n;
}
function ae(n) {
  return (n <= 1 && (n = n * 100 + "%"), n);
}
function lt(n) {
  return Math.round(parseFloat(n) * 255).toString(16);
}
function at(n) {
  return C(n) / 255;
}
var R = (function () {
  var n = "[-\\+]?\\d+%?",
    e = "[-\\+]?\\d*\\.\\d+%?",
    t = "(?:" + e + ")|(?:" + n + ")",
    o = "[\\s|\\(]+(" + t + ")[,|\\s]+(" + t + ")[,|\\s]+(" + t + ")\\s*\\)?",
    i =
      "[\\s|\\(]+(" +
      t +
      ")[,|\\s]+(" +
      t +
      ")[,|\\s]+(" +
      t +
      ")[,|\\s]+(" +
      t +
      ")\\s*\\)?";
  return {
    CSS_UNIT: new RegExp(t),
    rgb: new RegExp("rgb" + o),
    rgba: new RegExp("rgba" + i),
    hsl: new RegExp("hsl" + o),
    hsla: new RegExp("hsla" + i),
    hsv: new RegExp("hsv" + o),
    hsva: new RegExp("hsva" + i),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  };
})();
function G(n) {
  return !!R.CSS_UNIT.exec(n);
}
function tn(n) {
  n = n.replace(Tt, "").replace(It, "").toLowerCase();
  var e = !1;
  if (ve[n]) ((n = ve[n]), (e = !0));
  else if (n == "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  var t;
  return (t = R.rgb.exec(n))
    ? { r: t[1], g: t[2], b: t[3] }
    : (t = R.rgba.exec(n))
      ? { r: t[1], g: t[2], b: t[3], a: t[4] }
      : (t = R.hsl.exec(n))
        ? { h: t[1], s: t[2], l: t[3] }
        : (t = R.hsla.exec(n))
          ? { h: t[1], s: t[2], l: t[3], a: t[4] }
          : (t = R.hsv.exec(n))
            ? { h: t[1], s: t[2], v: t[3] }
            : (t = R.hsva.exec(n))
              ? { h: t[1], s: t[2], v: t[3], a: t[4] }
              : (t = R.hex8.exec(n))
                ? {
                    r: C(t[1]),
                    g: C(t[2]),
                    b: C(t[3]),
                    a: at(t[4]),
                    format: e ? "name" : "hex8",
                  }
                : (t = R.hex6.exec(n))
                  ? {
                      r: C(t[1]),
                      g: C(t[2]),
                      b: C(t[3]),
                      format: e ? "name" : "hex",
                    }
                  : (t = R.hex4.exec(n))
                    ? {
                        r: C(t[1] + "" + t[1]),
                        g: C(t[2] + "" + t[2]),
                        b: C(t[3] + "" + t[3]),
                        a: at(t[4] + "" + t[4]),
                        format: e ? "name" : "hex8",
                      }
                    : (t = R.hex3.exec(n))
                      ? {
                          r: C(t[1] + "" + t[1]),
                          g: C(t[2] + "" + t[2]),
                          b: C(t[3] + "" + t[3]),
                          format: e ? "name" : "hex",
                        }
                      : !1;
}
function nn(n) {
  var e, t;
  return (
    (n = n || { level: "AA", size: "small" }),
    (e = (n.level || "AA").toUpperCase()),
    (t = (n.size || "small").toLowerCase()),
    e !== "AA" && e !== "AAA" && (e = "AA"),
    t !== "small" && t !== "large" && (t = "small"),
    { level: e, size: t }
  );
}
var _e = class extends j {
  rootStyle;
  constructor() {
    super("header_color", { author: "legopitstop", category: "interface" });
  }
  update() {
    if (
      (this.rootStyle && this.rootStyle.delete(),
      SettingsProfile.selected == null)
    ) {
      this.rootStyle = Blockbench.addCSS(
        ":root{--color-header-bg:var(--color-frame);--color-header-text:var(--color-text);--filter-corner-logo:unset;}",
      );
      return;
    }
    let e = markerColors[SettingsProfile.selected.color].standard,
      t = g.mostReadable(new g(e), ["#333", "#ddd"]).toHexString(),
      o =
        t == "#333333"
          ? "invert(100%) sepia(0%) saturate(6873%) hue-rotate(217deg) brightness(113%) contrast(73%)"
          : "invert(19%) sepia(10%) saturate(12%) hue-rotate(314deg) brightness(98%) contrast(96%)";
    this.rootStyle = Blockbench.addCSS(
      `:root{--color-header-bg:${e};--color-header-text:${t};--filter-corner-logo:${o};}`,
    );
  }
  onEnable() {
    this.update();
    let e =
        "div#corner_logo{filter:var(--filter-corner-logo);}header{background-color:var(--color-header-bg)}header>*{color:var(--color-header-text) !important;}",
      t = Blockbench.on("profile_changed", this.update.bind(this)),
      o = Blockbench.on("hide_dialog", ({ dialog: i }) => {
        i?.id === "settings_profile" && this.update();
      });
    this.deleteables.push(Blockbench.addCSS(e), t, o);
  }
  onDisable() {
    this.rootStyle && this.rootStyle.delete();
  }
};
new _e();
var xe = class extends j {
  constructor() {
    super("close_actions", { author: "legopitstop", category: "interface" });
  }
  closeAllProjects() {
    (Blockbench.showQuickMessage("Closing all projects\u2026"),
      re([...ModelProject.all], (e) => {
        !e || e.pinned || e.close(!1, !1);
      }));
  }
  closeSavedProjects() {
    (Blockbench.showQuickMessage("Closing saved projects\u2026"),
      re([...ModelProject.all], (e) => {
        !e || !e.saved || e.pinned || e.close(!1, !1);
      }));
  }
  closeRightProjects() {
    if (
      (Blockbench.showQuickMessage("Closing projects to right\u2026"), !Project)
    )
      return;
    let e = ModelProject.all.indexOf(Project);
    re([...ModelProject.all], (t, o) => {
      !t || o <= e || t.pinned || t.close(!1, !1);
    });
  }
  closeOtherProjects() {
    if ((Blockbench.showQuickMessage("Closing other projects\u2026"), !Project))
      return;
    let e = Project.uuid;
    re([...ModelProject.all], (t) => {
      !t || e == t.uuid || t.pinned || t.close(!1, !1);
    });
  }
  onEnable() {
    var e = new Action("close_others", {
        icon: "close",
        condition: () => ModelProject.all.length > 1,
        click: this.closeOtherProjects.bind(this),
      }),
      t = new Action("close_right", {
        icon: "tab_close_right",
        condition: () =>
          Project &&
          ModelProject.all.indexOf(Project) != ModelProject.all.length - 1,
        click: this.closeRightProjects.bind(this),
      }),
      o = new Action("close_saved", {
        icon: "tab_close_inactive",
        condition: () => ModelProject.all.length > 1,
        click: this.closeSavedProjects.bind(this),
      }),
      i = new Action("close_all", {
        icon: "tab_close",
        condition: () => ModelProject.all.length > 1,
        click: this.closeAllProjects.bind(this),
      });
    (ModelProject.prototype.menu.addAction(e, "#manage"),
      ModelProject.prototype.menu.addAction(t, "#manage"),
      ModelProject.prototype.menu.addAction(o, "#manage"),
      ModelProject.prototype.menu.addAction(i, "#manage"),
      this.deleteables.push(e, t, o, i));
  }
};
new xe();
var ke = class n extends j {
  static originalClose;
  constructor() {
    super("pin_tab", { author: "legopitstop", category: "interface" });
  }
  static sort() {
    ModelProject.all = ModelProject.all.sort((e, t) =>
      e.pinned && !t.pinned ? -1 : !e.pinned && t.pinned ? 1 : 0,
    );
  }
  static pinTab() {
    (Blockbench.showQuickMessage("Pinned Tab!"),
      Project &&
        ((Project.pinned = !0),
        n.sort(),
        $(".project_tab.selected .project_tab_close_button .close_icon").text(
          "push_pin",
        )));
  }
  static unpinTab() {
    (Blockbench.showQuickMessage("Unpinned Tab!"),
      Project &&
        ((Project.pinned = !1),
        n.sort(),
        $(".project_tab.selected .project_tab_close_button .close_icon").text(
          "clear",
        )));
  }
  onClose(e, t = !0) {
    if (!e && t && Project?.pinned) {
      n.unpinTab();
      return;
    }
    return n.originalClose.bind(this)(e);
  }
  onEnable() {
    let e = Blockbench.addCSS(
      '.project_tab.selected .project_tab_close_button .close_icon[content=""] { background-color: red;}',
    );
    ModelProject.prototype.pinned = !1;
    var t = new Action("pin_tab", {
        icon: "push_pin",
        condition: () => Project && !Project.pinned,
        click: n.pinTab,
      }),
      o = new Action("unpin_tab", {
        icon: "push_pin",
        condition: () => Project && Project.pinned,
        click: n.unpinTab,
      });
    (ModelProject.prototype.menu.addAction(t, "#manage"),
      ModelProject.prototype.menu.addAction(o, "#manage"),
      (n.originalClose = ModelProject.prototype.close),
      (ModelProject.prototype.close = this.onClose),
      this.deleteables.push(t, o, e));
  }
  onDisable() {
    (delete ModelProject.prototype.pinned,
      n.originalClose && (ModelProject.prototype.close = n.originalClose));
  }
};
new ke();
var we = class extends j {
  constructor() {
    super("wrap_tabs", { author: "legopitstop", category: "interface" });
  }
  onEnable() {
    this.deleteables.push(
      Blockbench.addCSS(
        "#tab_bar #tab_bar_list{overflow-y:none;scrollbar-width:auto;flex-wrap:wrap;}#tab_bar{height:auto;align-items:center;}#tab_bar .project_tab{height:32px}#search_tab_button{height:auto;}",
      ),
    );
  }
};
new we();
var A = globalThis.THREE,
  fe = 512,
  Ee = 64,
  dt = "tweaks_n_stuff_note",
  W = (n) => n.trim().toLowerCase(),
  Q = (n) =>
    Array.isArray(n) &&
    n.length === 2 &&
    n.every((e) => typeof e == "number" && Number.isFinite(e)),
  ht = (n) => {
    let e = 2166136261;
    for (let t of n.trim().toLowerCase())
      e = Math.imul(e ^ t.codePointAt(0), 16777619);
    return `hsl(${(e >>> 0) % 360}, 78%, 65%)`;
  },
  Y = (n) =>
    Array.isArray(n)
      ? n
          .filter(
            (e) =>
              e &&
              typeof e.id == "string" &&
              typeof e.author == "string" &&
              typeof e.text == "string",
          )
          .map((e) => ({
            id: e.id,
            author: e.author,
            text: e.text,
            elements: Array.isArray(e.elements)
              ? e.elements.filter((t) => typeof t == "string")
              : [],
          }))
      : [],
  ue = (n, e) =>
    Y(n?.notes).filter((t) =>
      e ? t.elements.includes(e.uuid) : t.elements.length === 0,
    ),
  je = class n extends j {
    static panel;
    static originalCompile;
    static originalParse;
    perElementSetting;
    notesVisible = !0;
    billboards = new Map();
    offsets = new Map();
    animationFrame;
    panelIdentity;
    dragging;
    pendingEditor;
    editor;
    getIdentity() {
      let e = Project?.EditSession;
      if (e?.active && e.peer?.id)
        return { id: e.peer.id, author: e.username || "User" };
      let t = localStorage.getItem("tweaks_n_stuff_note_user");
      return (
        t ||
          ((t = crypto.randomUUID()),
          localStorage.setItem("tweaks_n_stuff_note_user", t)),
        { id: t, author: String(settings.username?.value || "Local user") }
      );
    }
    ownEntry(e) {
      let t = this.getIdentity();
      return (
        e.find((o) => o.id === t.id) ??
        e.find((o) => W(o.author) === W(t.author))
      );
    }
    ownNote(e) {
      return this.ownEntry(e)?.text ?? "";
    }
    canEditEntry(e) {
      let t = this.getIdentity();
      return (
        !Project?.EditSession?.active ||
        e.id === t.id ||
        W(e.author) === W(t.author) ||
        !!Project?.EditSession?.hosting
      );
    }
    offsetsFor(e) {
      let t = this.offsets.get(e.uuid);
      if (!t) {
        try {
          let o = JSON.parse(
            localStorage.getItem(`tweaks_n_stuff_note_offsets:${e.uuid}`) ??
              "{}",
          );
          t = Object.fromEntries(Object.entries(o).filter(([, i]) => Q(i)));
        } catch {
          t = {};
        }
        this.offsets.set(e.uuid, t);
      }
      return t;
    }
    offsetFor(e, t) {
      let o = this.offsetsFor(e);
      return o[t.entry.id] ?? o[`${t.element.uuid}:${t.entry.id}`];
    }
    setOffset(e, t, o) {
      this.offsetsFor(e)[t.entry.id] = o;
    }
    saveOffsets(e) {
      localStorage.setItem(
        `tweaks_n_stuff_note_offsets:${e.uuid}`,
        JSON.stringify(this.offsetsFor(e)),
      );
    }
    updateEntry(e, t, o, i, r) {
      let c = this.getIdentity(),
        s = Y(e.notes);
      i ??= this.ownEntry(ue(e, t))?.id ?? crypto.randomUUID();
      let a = s.findIndex(
        (b) =>
          b.id === i &&
          (t ? b.elements.includes(t.uuid) : b.elements.length === 0),
      );
      if ((a >= 0 && !this.canEditEntry(s[a])) || (a < 0 && !o)) return;
      let d = {
        id: i,
        author: a >= 0 ? s[a].author : c.author,
        text: o,
        elements: r ?? (a >= 0 ? s[a].elements : t ? [t.uuid] : []),
      };
      (a >= 0 && !o ? s.splice(a, 1) : a >= 0 ? (s[a] = d) : s.push(d),
        (e.notes = s),
        (e.saved = !1),
        e.EditSession?.active &&
          e.EditSession.sendAll(dt, {
            element: t?.uuid,
            targetId: i,
            elements: d.elements,
            author: d.author,
            text: o,
          }),
        !t && Project === e && this.refreshPanel());
    }
    refreshPanel() {
      let e = Project,
        t = ue(e),
        o = this.ownEntry(t)?.id;
      ((this.panelIdentity = e ? this.getIdentity().id : void 0),
        (n.panel.vue.notes = e ? this.ownNote(t) : ""),
        (n.panel.vue.otherNotes = t.filter((i) => i.id !== o && i.text)),
        (n.panel.vue.canEditOthers =
          !e?.EditSession?.active || !!e.EditSession.hosting));
    }
    constructor() {
      super("notes", { author: "legopitstop", category: "general" });
    }
    static injectCompile(e) {
      let t = n.originalCompile.apply(Codecs.project, [e]),
        o = (i) => {
          if (
            ((i.notes = Y(Project?.notes)),
            delete i.note_entries,
            delete i.note,
            !!Array.isArray(i.elements))
          )
            for (let r of i.elements)
              (delete r.note_entries, delete r.note, delete r.note_offset);
        };
      if (typeof t == "string")
        try {
          let i = JSON.parse(t);
          return (o(i), JSON.stringify(i));
        } catch {
          return t;
        }
      return (t && typeof t == "object" && o(t), t);
    }
    static injectParse(e, t) {
      let o = Array.isArray(e.notes)
          ? Y(e.notes)
          : [
              ...Y(e.note_entries),
              ...(Array.isArray(e.elements) ? e.elements : []).flatMap((r) =>
                Y(r.note_entries).map((c) => ({
                  ...c,
                  id: `${r.uuid}:${c.id}`,
                  elements: [r.uuid],
                })),
              ),
            ],
        i = n.originalParse.apply(Codecs.project, [e, t]);
      return (Project && ((Project.notes = o), n.instance?.refreshPanel()), i);
    }
    static instance;
    createBillboard(e, t) {
      let o = t.text,
        i = ht(t.author),
        r = this.canEditEntry(t),
        c = [],
        s = document.createElement("canvas").getContext("2d");
      s.font = "30px sans-serif";
      for (let l of o.split(/\r?\n/)) {
        let u = "";
        for (let f of l.split(/\s+/)) {
          let p = u ? `${u} ${f}` : f;
          u && s.measureText(p).width > 420 ? (c.push(u), (u = f)) : (u = p);
        }
        c.push(u);
      }
      let a = c.slice(0, 8);
      c.length > 8 && (a[7] = `${a[7].slice(0, 28)}\u2026`);
      let d = document.createElement("canvas");
      ((d.width = fe), (d.height = Math.max(168, 136 + a.length * 40)));
      let b = d.getContext("2d");
      ((b.fillStyle = "rgba(24, 27, 33, 0.94)"),
        (b.strokeStyle = i),
        (b.lineWidth = 4),
        b.beginPath(),
        b.roundRect(2, 2, d.width - 4, d.height - 4, 12),
        b.fill(),
        b.stroke(),
        (b.fillStyle = "#343944"),
        b.fillRect(4, 4, d.width - 8, Ee - 4),
        (b.fillStyle = "#f5f5f5"),
        (b.font = "22px sans-serif"),
        b.fillText(t.author, 20, 42, r ? 260 : 470),
        r &&
          ((b.fillStyle = "#555c67"),
          b.fillRect(284, 12, 104, 40),
          (b.fillStyle = "#f5f5f5"),
          b.fillText("Reading", 292, 40),
          b.fillText("Source", 410, 40)),
        (b.fillStyle = "#f5f5f5"),
        (b.font = "30px sans-serif"),
        a.forEach((l, u) => b.fillText(l, 24, 118 + u * 40)));
      let h = new A.CanvasTexture(d),
        y = new A.Sprite(
          new A.SpriteMaterial({ map: h, depthTest: !1, sizeAttenuation: !1 }),
        ),
        k = 300,
        _ = (k * d.height) / d.width;
      y.renderOrder = 1e3;
      let v = new A.LineSegments(
        new A.BufferGeometry().setFromPoints(
          Array.from({ length: e.length * 6 }, () => new A.Vector3()),
        ),
        new A.LineBasicMaterial({ color: i, depthTest: !1 }),
      );
      return (
        (v.renderOrder = 999),
        (v.frustumCulled = !1),
        Canvas.scene.add(v, y),
        {
          element: e[0],
          elements: e,
          entry: t,
          note: o,
          editable: r,
          sprite: y,
          line: v,
          texture: h,
          width: k,
          height: _,
        }
      );
    }
    removeBillboard(e) {
      (Canvas.scene.remove(e.sprite, e.line),
        e.sprite.material.dispose(),
        e.line.material.dispose(),
        e.line.geometry.dispose(),
        e.texture.dispose());
    }
    getElementMesh(e) {
      let t = Canvas.meshes?.[e.uuid];
      if (t) return t;
      try {
        if (e.mesh) return e.mesh;
      } catch {}
      try {
        return e.scene_object;
      } catch {}
    }
    positionInlineEditor() {
      let e = this.editor,
        t = e?.billboard.screen,
        o = Preview.selected;
      if (!e || !t || !o) return;
      let i = o.canvas.getBoundingClientRect(),
        r = (t.width * Ee) / fe;
      Object.assign(e.textarea.style, {
        left: `${i.left + t.x - t.width / 2}px`,
        top: `${i.top + t.y - t.height / 2 + r}px`,
        width: `${t.width}px`,
        height: `${Math.max(t.height - r, 60)}px`,
      });
    }
    finishInlineEditor(e) {
      let t = this.editor;
      if (!t) return;
      ((this.editor = void 0),
        (t.textarea.onblur = null),
        document.removeEventListener("keydown", t.onKeyDown, !0));
      let o = e ? t.textarea.value : t.original;
      (t.textarea.remove(),
        o !== t.original &&
          this.updateEntry(
            t.project,
            t.billboard.element,
            o,
            t.billboard.entry.id,
            t.billboard.entry.elements,
          ));
    }
    openInlineEditor(e, t = e.entry.text) {
      if (
        (this.finishInlineEditor(!0),
        !e.screen || !Project || !this.canEditEntry(e.entry))
      )
        return;
      let o = document.createElement("textarea");
      ((o.value = t),
        (o.placeholder = "Write a note\u2026"),
        o.setAttribute("aria-label", `Note for ${e.element.name}`),
        Object.assign(o.style, {
          position: "fixed",
          zIndex: "10000",
          boxSizing: "border-box",
          resize: "none",
          padding: "10px 12px",
          border: `2px solid ${ht(e.entry.author)}`,
          borderRadius: "6px",
          background: "#181b21",
          color: "#f5f5f5",
          font: "14px sans-serif",
          lineHeight: "1.4",
          outline: "none",
        }));
      let i = (r) => {
        r.target === o &&
          (r.stopImmediatePropagation(),
          r.key === "Escape"
            ? (r.preventDefault(), this.finishInlineEditor(!1))
            : r.key === "Enter" &&
              (r.ctrlKey || r.metaKey) &&
              (r.preventDefault(), this.finishInlineEditor(!0)));
      };
      ((this.editor = {
        textarea: o,
        billboard: e,
        project: Project,
        original: t,
        onKeyDown: i,
      }),
        (o.onblur = () => this.finishInlineEditor(!0)),
        document.addEventListener("keydown", i, !0),
        document.body.appendChild(o),
        this.positionInlineEditor(),
        o.focus());
    }
    onBillboardPointerDown = (e) => {
      if (
        e.button !== 0 ||
        !this.notesVisible ||
        !Project ||
        !Settings.get("per_element_notes")
      )
        return;
      let t = Preview.selected;
      if (!t?.node.contains(e.target)) return;
      let o = t.canvas.getBoundingClientRect(),
        i = e.clientX - o.left,
        r = e.clientY - o.top;
      for (let c of Array.from(this.billboards.values()).reverse()) {
        let s = c.screen;
        if (
          !s ||
          !c.sprite.visible ||
          Math.abs(i - s.x) > s.width / 2 ||
          Math.abs(r - s.y) > s.height / 2
        )
          continue;
        let a = (s.width * Ee) / fe,
          d = r < s.y - s.height / 2 + a,
          b = ((i - s.x + s.width / 2) / s.width) * fe;
        if (c.editable && d && b >= 284) {
          (b >= 390
            ? this.editor?.billboard === c
              ? this.editor.textarea.focus()
              : this.canEditEntry(c.entry) && this.openInlineEditor(c)
            : this.editor?.billboard === c && this.finishInlineEditor(!0),
            e.preventDefault(),
            e.stopImmediatePropagation());
          return;
        }
        if (this.editor) return;
        ((this.dragging = {
          billboard: c,
          project: Project,
          preview: t,
          startX: e.clientX,
          startY: e.clientY,
          grabX: i - s.x,
          grabY: r - s.y,
          moved: !1,
        }),
          e.preventDefault(),
          e.stopImmediatePropagation());
        return;
      }
    };
    onBillboardPointerMove = (e) => {
      let t = this.dragging;
      if (!t) return;
      if (
        (e.preventDefault(),
        e.stopImmediatePropagation(),
        Project !== t.project ||
          !Project.elements.includes(t.billboard.element))
      ) {
        this.dragging = void 0;
        return;
      }
      if (
        !t.moved &&
        Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < 5
      )
        return;
      t.moved = !0;
      let o = t.billboard.screen;
      if (!o) return;
      let i = t.preview.canvas.getBoundingClientRect(),
        r = Math.max(
          o.width / 2 + 12,
          Math.min(i.width - o.width / 2 - 12, e.clientX - i.left - t.grabX),
        ),
        c = Math.max(
          o.height / 2 + 8,
          Math.min(i.height - o.height / 2 - 8, e.clientY - i.top - t.grabY),
        );
      this.setOffset(t.project, t.billboard, [r - o.anchorX, c - o.anchorY]);
    };
    onBillboardPointerUp = (e) => {
      let t = this.dragging;
      t &&
        (e.type !== "pointercancel" && this.onBillboardPointerMove(e),
        (this.dragging = void 0),
        t.moved && this.saveOffsets(t.project),
        !t.moved &&
          e.type !== "pointercancel" &&
          this.canEditEntry(t.billboard.entry) &&
          this.openInlineEditor(t.billboard));
    };
    updateBillboards = () => {
      if (
        (Project &&
          this.panelIdentity !== this.getIdentity().id &&
          this.refreshPanel(),
        this.editor &&
          Project !== this.editor.project &&
          this.finishInlineEditor(!0),
        this.pendingEditor &&
          Project !== this.pendingEditor.project &&
          (this.pendingEditor = void 0),
        !this.notesVisible || !Settings.get("per_element_notes"))
      ) {
        (this.finishInlineEditor(!0),
          (this.pendingEditor = void 0),
          (this.dragging = void 0));
        for (let s of this.billboards.values()) this.removeBillboard(s);
        (this.billboards.clear(),
          (this.animationFrame = requestAnimationFrame(this.updateBillboards)));
        return;
      }
      let e = new Map((Project?.elements ?? []).map((s) => [s.uuid, s])),
        t = new Map();
      for (let s of Y(Project?.notes)) {
        if (!s.text || !s.elements.length) continue;
        let a = s.elements.map((d) => e.get(d)).filter((d) => !!d);
        a.length && t.set(s.id, { elements: a, entry: s });
      }
      if (
        this.pendingEditor &&
        e.get(this.pendingEditor.element.uuid) === this.pendingEditor.element
      ) {
        let a = this.pendingEditor.entry,
          d = a.elements.map((b) => e.get(b)).filter((b) => !!b);
        d.length &&
          t.set(a.id, { elements: d, entry: a.text ? a : { ...a, text: " " } });
      }
      if (
        this.editor &&
        !this.editor.billboard.entry.text &&
        e.get(this.editor.billboard.element.uuid) ===
          this.editor.billboard.element
      ) {
        let a = { ...this.editor.billboard.entry, text: " " };
        t.set(a.id, { elements: this.editor.billboard.elements, entry: a });
      }
      for (let [s, a] of this.billboards) {
        let d = t.get(s);
        !d ||
        d.entry.text !== a.note ||
        d.entry.author !== a.entry.author ||
        this.canEditEntry(d.entry) !== a.editable
          ? (this.removeBillboard(a), this.billboards.delete(s))
          : ((d.elements.length !== a.elements.length ||
              d.elements.some((b, h) => b !== a.elements[h])) &&
              ((a.elements = d.elements),
              (a.element = d.elements[0]),
              a.line.geometry.dispose(),
              (a.line.geometry = new A.BufferGeometry().setFromPoints(
                Array.from(
                  { length: d.elements.length * 6 },
                  () => new A.Vector3(),
                ),
              ))),
            (a.entry = d.entry));
      }
      for (let [s, { elements: a, entry: d }] of t)
        this.billboards.has(s) ||
          this.billboards.set(s, this.createBillboard(a, d));
      if (this.billboards.size === 0) {
        this.animationFrame = requestAnimationFrame(this.updateBillboards);
        return;
      }
      let o = Preview.selected,
        i = o?.camera,
        r = o?.canvas.clientWidth ?? 0,
        c = o?.canvas.clientHeight ?? 0;
      if (i && r && c) {
        i.updateMatrixWorld();
        let s = (v) => {
            let l = v.clone().project(i);
            return { x: ((l.x + 1) * r) / 2, y: ((1 - l.y) * c) / 2, z: l.z };
          },
          a = (v, l, u) =>
            new A.Vector3((v / r) * 2 - 1, 1 - (l / c) * 2, u).unproject(i),
          d = 1 / 0,
          b = -1 / 0,
          h = 1 / 0,
          y = -1 / 0;
        for (let v of e.values()) {
          let l = this.getElementMesh(v);
          if (!l?.visible) continue;
          let u = new A.Box3().setFromObject(l);
          for (let f of [u.min.x, u.max.x])
            for (let p of [u.min.y, u.max.y])
              for (let m of [u.min.z, u.max.z]) {
                let x = s(new A.Vector3(f, p, m));
                ((d = Math.min(d, x.x)),
                  (b = Math.max(b, x.x)),
                  (h = Math.min(h, x.y)),
                  (y = Math.max(y, x.y)));
              }
        }
        let k = [];
        for (let v of this.billboards.values()) {
          let l = v.elements.flatMap((f, p) => {
            let m = this.getElementMesh(f);
            return m?.visible
              ? [
                  {
                    index: p,
                    anchor: s(
                      new A.Box3().setFromObject(m).getCenter(new A.Vector3()),
                    ),
                  },
                ]
              : [];
          });
          if (
            ((v.sprite.visible = l.length > 0),
            (v.line.visible = l.length > 0),
            !l.length)
          ) {
            v.screen = void 0;
            continue;
          }
          let u = l.reduce(
            (f, p) => ({
              x: f.x + p.anchor.x,
              y: f.y + p.anchor.y,
              z: f.z + p.anchor.z,
            }),
            { x: 0, y: 0, z: 0 },
          );
          ((u.x /= l.length),
            (u.y /= l.length),
            (u.z /= l.length),
            k.push({ billboard: v, anchor: u, targets: l }));
        }
        k.sort((v, l) => {
          let u = Project && Q(this.offsetFor(Project, v.billboard));
          return (
            +!!(Project && Q(this.offsetFor(Project, l.billboard))) - +!!u ||
            v.anchor.y - l.anchor.y
          );
        });
        let _ = [];
        for (let { billboard: v, anchor: l, targets: u } of k) {
          let f = Math.min(v.width, r - 24),
            p = (v.height * f) / v.width,
            m = f / 2,
            x = p / 2,
            P = b + 28 + m,
            B = d - 28 - m,
            D = P + m <= r - 12,
            q = B - m >= 12,
            Z = h - 28 - x,
            V = y + 28 + x,
            L = D
              ? "right"
              : q
                ? "left"
                : Z - x >= 8
                  ? "top"
                  : V + x <= c - 8
                    ? "bottom"
                    : r - b >= d
                      ? "right"
                      : "left",
            M = Project ? this.offsetFor(Project, v) : void 0;
          Q(M) &&
            (L =
              Math.abs(M[0]) >= Math.abs(M[1])
                ? M[0] >= 0
                  ? "right"
                  : "left"
                : M[1] >= 0
                  ? "bottom"
                  : "top");
          let oe = Q(M)
              ? l.x + M[0]
              : L === "right"
                ? P
                : L === "left"
                  ? B
                  : l.x,
            S = Q(M) ? l.y + M[1] : L === "top" ? Z : L === "bottom" ? V : l.y,
            Ce = (O) => Math.max(m + 12, Math.min(r - m - 12, O)),
            Ne = (O) => Math.max(x + 8, Math.min(c - x - 8, O)),
            T = Ce(oe),
            I = Ne(S);
          if (!Q(M) && _.length) {
            let O = [oe, P, B, l.x, m + 12, r - m - 12],
              E = [S, l.y, Z, V, x + 8, c - x - 8];
            for (let N of _)
              (O.push(N.left - m - 8, N.right + m + 8),
                E.push(N.top - x - 8, N.bottom + x + 8));
            let ie = 1 / 0;
            for (let N of O.map(Ce))
              for (let z of E.map(Ne)) {
                let J =
                  _.reduce(
                    (ce, U) =>
                      ce +
                      Math.max(
                        0,
                        Math.min(N + m, U.right) - Math.max(N - m, U.left),
                      ) *
                        Math.max(
                          0,
                          Math.min(z + x, U.bottom) - Math.max(z - x, U.top),
                        ),
                    0,
                  ) *
                    1e3 +
                  Math.hypot(N - oe, z - S);
                J < ie && ((ie = J), (T = N), (I = z));
              }
            L =
              Math.abs(T - l.x) >= Math.abs(I - l.y)
                ? T >= l.x
                  ? "right"
                  : "left"
                : I >= l.y
                  ? "bottom"
                  : "top";
          }
          (_.push({ left: T - m, right: T + m, top: I - x, bottom: I + x }),
            (v.screen = {
              x: T,
              y: I,
              width: f,
              height: p,
              anchorX: l.x,
              anchorY: l.y,
            }));
          let Te = a(l.x, l.y, l.z),
            ft = new A.Vector3(1, 0, 0).applyQuaternion(i.quaternion),
            Ie = s(Te.clone().add(ft)),
            ge = Math.hypot(Ie.x - l.x, Ie.y - l.y);
          if (!Number.isFinite(ge) || ge <= 0) continue;
          let ut = -Te.clone().applyMatrix4(i.matrixWorldInverse).z,
            me = i.isPerspectiveCamera ? ut : 1;
          if (!Number.isFinite(me) || me <= 0) continue;
          let Oe = 1 / (ge * me);
          (v.sprite.scale.set(f * Oe, p * Oe, 1),
            v.sprite.position.copy(a(T, I, l.z)));
          let Re = v.line.geometry.attributes.position;
          for (let O = 0; O < v.elements.length; O++) {
            let E = u.find((be) => be.index === O)?.anchor,
              ie = (E?.x ?? T) - T,
              N = (E?.y ?? I) - I,
              z =
                Math.abs(ie / m) >= Math.abs(N / x)
                  ? ie >= 0
                    ? "right"
                    : "left"
                  : N >= 0
                    ? "bottom"
                    : "top",
              ee = T + (z === "right" ? m : z === "left" ? -m : 0),
              J = I + (z === "top" ? -x : z === "bottom" ? x : 0),
              ce = Math.hypot((E?.x ?? ee) - ee, (E?.y ?? J) - J) || 1,
              U = ((E?.x ?? ee) - ee) / ce,
              le = ((E?.y ?? J) - J) / ce;
            (E
              ? [
                  [ee, J],
                  [E.x, E.y],
                  [E.x - U * 12 - le * 6, E.y - le * 12 + U * 6],
                  [E.x, E.y],
                  [E.x - U * 12 + le * 6, E.y - le * 12 - U * 6],
                  [E.x, E.y],
                ]
              : Array.from({ length: 6 }, () => [T, I])
            ).forEach(([be, pt], gt) => {
              let ye = a(be, pt, E?.z ?? l.z);
              Re.setXYZ(O * 6 + gt, ye.x, ye.y, ye.z);
            });
          }
          Re.needsUpdate = !0;
        }
        if (this.pendingEditor) {
          let v = this.billboards.get(this.pendingEditor.entry.id);
          if (v?.screen) {
            let l = this.pendingEditor.entry.text;
            ((this.pendingEditor = void 0), this.openInlineEditor(v, l));
          }
        }
        this.positionInlineEditor();
      } else
        for (let s of this.billboards.values())
          ((s.sprite.visible = s.line.visible = !1), (s.screen = void 0));
      this.animationFrame = requestAnimationFrame(this.updateBillboards);
    };
    onLoad() {
      ((this.perElementSetting = new Setting("per_element_notes", {
        name: tl("settings.per_element_notes"),
        description: tl("settings.per_element_notes.desc"),
        category: "general",
        type: "toggle",
        value: !0,
      })),
        super.onLoad());
    }
    onUnload() {
      (super.onUnload(),
        this.perElementSetting?.delete(),
        (this.perElementSetting = void 0));
    }
    onEnable() {
      ((n.instance = this),
        (this.notesVisible =
          localStorage.getItem("tweaks_n_stuff_element_notes_visible") !==
          "false"));
      let e = `#note_editor {
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
    }`,
        t = new BarSelect("note_editor_mode", {
          icon_mode: !0,
          options: {
            source: { name: !0, icon: "code" },
            reading: { name: !0, icon: "menu_book" },
          },
          onChange() {
            n.panel.vue.mode = this.value;
          },
        });
      n.panel = new Panel("note", {
        icon: "note",
        resizable: !0,
        growable: !0,
        default_position: {
          slot: "right_bar",
          float_position: [0, 2],
          float_size: [300, 400],
          height: 400,
        },
        toolbars: [
          new Toolbar("note_editor", { children: ["note_editor_mode"] }),
        ],
        component: {
          data: { mode: t.value, notes: "", otherNotes: [], canEditOthers: !1 },
          watch: {
            notes(h) {
              !Project ||
                h === n.instance?.ownNote(ue(Project)) ||
                n.instance?.updateEntry(Project, void 0, h);
            },
          },
          methods: {
            formatNote(h) {
              return pureMarked(h);
            },
            editOtherNote(h, y) {
              Project &&
                (!Project.EditSession?.active || Project.EditSession.hosting) &&
                n.instance?.updateEntry(Project, void 0, y, h.id);
            },
          },
          components: { VuePrismEditor },
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
      let o = Blockbench.on("select_project", () => this.refreshPanel()),
        i = Blockbench.on("join_session", () => this.refreshPanel()),
        r = Blockbench.on("create_session", () => this.refreshPanel()),
        c = Blockbench.on("receive_session_data", (h) => {
          if (
            h.type !== dt ||
            !Project?.EditSession ||
            typeof h.sender != "string"
          )
            return;
          let y = h.data;
          if (!y || typeof y.text != "string" || typeof y.author != "string")
            return;
          let k = Project,
            _ =
              typeof y.element == "string"
                ? k.elements.find((m) => m.uuid === y.element)
                : void 0;
          if (y.element && !_) return;
          let v = typeof y.targetId == "string" ? y.targetId : h.sender,
            l = Y(k.notes),
            u = l.findIndex(
              (m) =>
                m.id === v &&
                (_ ? m.elements.includes(_.uuid) : m.elements.length === 0),
            );
          if (v !== h.sender && !h.fromHost) {
            if (u >= 0 && W(l[u].author) !== W(y.author)) return;
            let m = k.EditSession.clients?.[h.sender]?.name;
            if (m && W(m) !== W(u >= 0 ? l[u].author : y.author)) return;
          }
          if (u < 0 && !y.text) return;
          let f = Array.isArray(y.elements)
              ? y.elements.filter(
                  (m) =>
                    typeof m == "string" &&
                    k.elements.some((x) => x.uuid === m),
                )
              : _
                ? [_.uuid]
                : [],
            p = {
              id: v,
              author: u >= 0 ? l[u].author : y.author,
              text: y.text,
              elements: f,
            };
          (u >= 0 && !y.text ? l.splice(u, 1) : u >= 0 ? (l[u] = p) : l.push(p),
            (k.notes = l),
            _ || this.refreshPanel(),
            (k.saved = !1));
        });
      ((n.originalCompile = Codecs.project.compile),
        (Codecs.project.compile = n.injectCompile),
        (n.originalParse = Codecs.project.parse),
        (Codecs.project.parse = n.injectParse));
      let s = {
          id: "add_element_note",
          name: "Add Note",
          icon: "note_add",
          condition: () => !!Project && !!Settings.get("per_element_notes"),
          click: (h) => {
            if (!Project || !h || !Settings.get("per_element_notes")) return;
            let y = Project.selected_elements.includes(h)
                ? Project.selected_elements
                : [h],
              k = [...new Set(y.map((u) => u.uuid))],
              _ = this.ownEntry(ue(Project, h)),
              v = _
                ? { ..._, elements: [...new Set([..._.elements, ...k])] }
                : {
                    id: crypto.randomUUID(),
                    author: this.getIdentity().author,
                    text: "",
                    elements: k,
                  };
            _?.text &&
              v.elements.length !== _.elements.length &&
              this.updateEntry(Project, h, _.text, _.id, v.elements);
            let l = this.billboards.get(v.id);
            l?.screen
              ? ((l.entry = v), this.openInlineEditor(l))
              : (this.pendingEditor = {
                  element: h,
                  project: Project,
                  entry: v,
                });
          },
        },
        a = new Set();
      for (let h of Object.values(OutlinerElement.types)) {
        let y = h.prototype.menu;
        !y || a.has(y) || (y.addAction(s, "#manage"), a.add(y));
      }
      this.deleteables.push(
        ...Array.from(a, (h) => ({ delete: () => h.removeAction(s.id) })),
      );
      let d = {
          id: "toggle_element_note_visibility",
          name: "Show Element Notes",
          icon: () =>
            this.notesVisible ? "check_box" : "check_box_outline_blank",
          condition: () => !!Project && !!Settings.get("per_element_notes"),
          click: () => {
            ((this.notesVisible = !this.notesVisible),
              localStorage.setItem(
                "tweaks_n_stuff_element_notes_visible",
                String(this.notesVisible),
              ));
          },
        },
        b = new Set(
          [Preview.prototype.menu, Blockbench.menus?.preview].filter(Boolean),
        );
      for (let h of b)
        (h.addAction(d),
          this.deleteables.push({ delete: () => h.removeAction(d.id) }));
      (this.deleteables.push(Blockbench.addCSS(e), t, n.panel, o, i, r, c),
        document.addEventListener(
          "pointerdown",
          this.onBillboardPointerDown,
          !0,
        ),
        window.addEventListener("pointermove", this.onBillboardPointerMove, !0),
        window.addEventListener("pointerup", this.onBillboardPointerUp, !0),
        window.addEventListener("pointercancel", this.onBillboardPointerUp, !0),
        (this.animationFrame = requestAnimationFrame(this.updateBillboards)));
    }
    onDisable() {
      (this.finishInlineEditor(!0),
        (this.pendingEditor = void 0),
        document.removeEventListener(
          "pointerdown",
          this.onBillboardPointerDown,
          !0,
        ),
        window.removeEventListener(
          "pointermove",
          this.onBillboardPointerMove,
          !0,
        ),
        window.removeEventListener("pointerup", this.onBillboardPointerUp, !0),
        window.removeEventListener(
          "pointercancel",
          this.onBillboardPointerUp,
          !0,
        ),
        (this.dragging = void 0),
        this.animationFrame !== void 0 &&
          cancelAnimationFrame(this.animationFrame),
        (this.animationFrame = void 0));
      for (let e of this.billboards.values()) this.removeBillboard(e);
      (this.billboards.clear(),
        (Codecs.project.compile = n.originalCompile),
        (Codecs.project.parse = n.originalParse),
        (n.instance = void 0));
    }
  };
new je();
var Pe = class extends j {
  constructor() {
    super("bedrock_open_all", { author: "legopitstop", category: "interface" });
  }
  openAll(e) {
    let t = e.content_vue,
      o = t?.geometries;
    if (!o?.length || !t.open) return;
    let i = Format.codec,
      r = Project.export_path,
      c = i.id === "bedrock_old" ? "1.10.0" : "1.12.0",
      s = o.slice();
    t.open(s[0]);
    for (let a of s.slice(1)) {
      let d =
        i.id === "bedrock_old"
          ? { format_version: c, [a.name]: a.object }
          : { format_version: c, "minecraft:geometry": [a.object] };
      (i.load(d, { path: r }), e.onOpenAllGeometry?.(a.name));
    }
  }
  onEnable() {
    let e = Blockbench.on("show_dialog", ({ dialog: t }) => {
      if (t?.id !== "bedrock_model_select") return;
      let o = t.object.getElementsByClassName("dialog_bar button_bar")[0];
      if (!o) return;
      let i = document.createElement("a");
      ((i.text = tl("dialog.select_model.open_all")),
        (i.style =
          "margin-right: auto; text-decoration: underline; cursor: pointer;"),
        (i.onclick = () => {
          this.openAll(t);
        }),
        o.prepend(i));
    });
    this.deleteables.push(e);
  }
};
new Pe();
var Se = class extends j {
  sources = new WeakMap();
  pendingSelection;
  constructor() {
    super("bedrock_block_geometry", {
      author: "legopitstop",
      category: "interface",
    });
  }
  openBlock() {
    Blockbench.import(
      {
        type: "Bedrock Block",
        extensions: ["json"],
        readtype: "text",
        multiple: !1,
      },
      (e) => {
        let t = e[0];
        if (!(!t?.path || typeof t.content != "string"))
          try {
            this.loadBlock(JSON.parse(t.content), t);
          } catch (o) {
            Blockbench.showMessageBox({
              title: "Open Bedrock Block Geometry",
              message: String(o),
            });
          }
      },
    );
  }
  loadBlock(e, t) {
    try {
      let o = e["minecraft:block"];
      if (!o || typeof o != "object")
        throw new Error("This is not a Bedrock block file.");
      let i = new Map(),
        r = (f, p) => {
          let m = f?.["minecraft:geometry"],
            x = typeof m == "string" ? m : m?.identifier;
          if (typeof x == "string" && x.startsWith("geometry.")) {
            let P = i.get(x) ?? [];
            (P.push(p), i.set(x, P));
          }
        };
      r(o.components, { kind: "main" });
      for (let [f, p] of (o.permutations ?? []).entries())
        r(p.components, {
          kind: "permutation",
          index: f,
          condition: p.condition ?? "",
        });
      if (!i.size) throw new Error("This block does not reference a geometry.");
      let c = te("fs"),
        s = te("path"),
        a = s.dirname(t.path);
      for (; s.basename(a).toLowerCase() !== "blocks"; ) {
        let f = s.dirname(a);
        if (f === a)
          throw new Error("The block file is not inside a blocks folder.");
        a = f;
      }
      let d = s.dirname(a),
        b = s.basename(d),
        h = new Set([s.join(d, "models", "blocks")]),
        y = (f) => {
          if (!c.existsSync(f)) return;
          let p = s.join(f, b, "models", "blocks");
          c.existsSync(p) && h.add(p);
          for (let m of c.readdirSync(f, { withFileTypes: !0 }))
            m.isDirectory() && h.add(s.join(f, m.name, "models", "blocks"));
        },
        k = s.dirname(d);
      for (let f = 0; f < 4; f++) {
        y(k);
        for (let m of ["resource", "resource_packs", "resource_packs_dev"])
          (y(s.join(k, m)), y(s.join(k, m, "_packs")));
        let p = s.dirname(k);
        if (p === k) break;
        k = p;
      }
      let _ = new Map(),
        v = (f) => {
          if (c.existsSync(f))
            for (let p of c.readdirSync(f, { withFileTypes: !0 })) {
              let m = s.join(f, p.name);
              if (p.isDirectory()) v(m);
              else if (p.isFile() && p.name.endsWith(".json"))
                try {
                  let x = JSON.parse(c.readFileSync(m, "utf8"));
                  for (let P of x["minecraft:geometry"] ?? []) {
                    let B = P?.description?.identifier;
                    i.has(B) &&
                      !_.has(B) &&
                      _.set(B, { path: m, content: x, geometry: P });
                  }
                } catch {}
            }
        };
      for (let f of h) v(f);
      if (!_.size)
        throw new Error(
          `Could not find a geometry file for ${[...i.keys()].join(", ")}.`,
        );
      let l = (f) => {
        let p = _.get(f);
        if (!p || !Project) return;
        Project.export_path = p.path;
        let m = Project,
          x = i.get(f) ?? [],
          P = (D) => {
            (m.select(),
              this.sources.set(m, { path: t.path, geometry: f, location: D }));
            let q = this.getComponents(o, f, D);
            for (let [Z, V] of [
              ["minecraft:collision_box", "collision"],
              ["minecraft:selection_box", "selection"],
            ]) {
              if (!q || !(Z in q)) continue;
              let L = V === "selection" ? "hitbox" : "collision";
              for (let S of [...BoundingBox.all])
                (S.function.includes(L) || S.name === V) && S.remove();
              let M = q?.[Z];
              if (!M) continue;
              let oe =
                M === !0
                  ? [{ origin: [-8, 0, -8], size: [16, 16, 16] }]
                  : Array.isArray(M)
                    ? M
                    : [M];
              for (let S of oe)
                !Array.isArray(S?.origin) ||
                  !Array.isArray(S?.size) ||
                  new BoundingBox({
                    name: V,
                    from: [
                      -(S.origin[0] + S.size[0]),
                      S.origin[1],
                      S.origin[2],
                    ],
                    to: [
                      -S.origin[0],
                      S.origin[1] + S.size[1],
                      S.origin[2] + S.size[2],
                    ],
                    function: [L],
                    color: V === "selection" ? 0 : 2,
                  })
                    .addTo()
                    .init();
            }
          };
        if (x.length === 1) return P(x[0]);
        let B = Object.fromEntries(
          x.map((D, q) => [
            String(q),
            D.kind === "main"
              ? "Main components"
              : `Permutation ${D.index + 1}: ${D.condition || "(no condition)"}`,
          ]),
        );
        new Dialog({
          id: "bedrock_block_component_source",
          title: "Select Block Component Source",
          form: { source: { label: "Source", type: "select", options: B } },
          onConfirm: (D) => P(x[Number(D.source)]),
        }).show();
      };
      if (_.size === 1) {
        let [f, p] = [..._][0];
        (Codecs.bedrock.load(
          {
            format_version: p.content.format_version,
            "minecraft:geometry": [p.geometry],
          },
          { name: s.basename(p.path), path: p.path },
        ),
          l(f));
        return;
      }
      let u = _.values().next().value;
      ((this.pendingSelection = { names: new Set(_.keys()), opened: l }),
        Codecs.bedrock.load(
          {
            format_version: u.content.format_version,
            "minecraft:geometry": [..._.values()].map((f) => f.geometry),
          },
          { name: s.basename(u.path), path: u.path },
        ));
    } catch (o) {
      Blockbench.showMessageBox({
        title: "Open Bedrock Block Geometry",
        message: String(o),
      });
    }
  }
  getComponents(e, t, o) {
    let i =
        o.kind === "main"
          ? e.components
          : e.permutations?.[o.index]?.components,
      r = i?.["minecraft:geometry"],
      c = typeof r == "string" ? r : r?.identifier,
      s =
        o.kind === "permutation"
          ? (e.permutations?.[o.index]?.condition ?? "")
          : "";
    if (c !== t || (o.kind === "permutation" && s !== o.condition))
      throw new Error(
        "The geometry's component source has changed in the block JSON. Reopen the block before saving boxes.",
      );
    return i;
  }
  saveBoxes(e) {
    let t = this.sources.get(e);
    if (t)
      try {
        let o = te("fs"),
          i = o.readFileSync(t.path, "utf8"),
          r = JSON.parse(i),
          c = this.getComponents(r["minecraft:block"], t.geometry, t.location);
        if (!c) return;
        let s = BoundingBox.all.filter((d) => d.export !== !1);
        for (let [d, b] of [
          ["minecraft:collision_box", "collision"],
          ["minecraft:selection_box", "hitbox"],
        ]) {
          let h = s.filter((_) => _.function.includes(b));
          if (!h.length && !(d in c)) continue;
          let y = h.map((_) => ({
            origin: [-_.to[0], _.from[1], _.from[2]],
            size: _.size(),
          }));
          if (d === "minecraft:selection_box" && y.length > 1) {
            let _ = y.reduce(
                (l, u) => l.map((f, p) => Math.min(f, u.origin[p])),
                [1 / 0, 1 / 0, 1 / 0],
              ),
              v = y.reduce(
                (l, u) => l.map((f, p) => Math.max(f, u.origin[p] + u.size[p])),
                [-1 / 0, -1 / 0, -1 / 0],
              );
            y.splice(0, y.length, {
              origin: _,
              size: v.map((l, u) => l - _[u]),
            });
          }
          let k = y.length === 0 ? !1 : y.length === 1 ? y[0] : y;
          c[d] =
            y.length === 1 &&
            y[0].origin.join() === "-8,0,-8" &&
            y[0].size.join() === "16,16,16"
              ? !0
              : k;
        }
        if (JSON.stringify(r) === JSON.stringify(JSON.parse(i))) return;
        let a = /\n(\s+)"/.exec(i)?.[1] ?? "  ";
        o.writeFileSync(
          t.path,
          JSON.stringify(r, null, a) +
            `
`,
          "utf8",
        );
      } catch (o) {
        Blockbench.showMessageBox({
          title: "Save Bedrock Block Boxes",
          message: String(o),
        });
      }
  }
  onEnable() {
    let e = Blockbench.on("show_dialog", ({ dialog: s }) => {
        if (s?.id !== "bedrock_model_select" || !this.pendingSelection) return;
        let a = this.pendingSelection;
        ((this.pendingSelection = void 0),
          (s.onOpenAllGeometry = (h) => {
            a.names.has(h) && a.opened(h);
          }));
        let d = s.content_vue;
        if (!d?.open) return;
        let b = d.open;
        d.open = function (h) {
          (b.call(this, h), a.names.has(h.name) && a.opened(h.name));
        };
      }),
      t = new Action("open_bedrock_block_geometry", {
        name: "Open Bedrock Block Geometry",
        description:
          "Open the geometry referenced by a Bedrock block JSON file",
        icon: "view_in_ar",
        condition: () => !Blockbench.isWeb,
        click: () => this.openBlock(),
      });
    MenuBar.addAction(t, "file.import");
    let o = new Action("save_bedrock_block_boxes", {
        name: "Save to Block",
        description:
          "Save collision and selection boxes to the source behavior pack block file",
        icon: "save",
        condition: () => !!Project && this.sources.has(Project),
        click: () => {
          Project && this.saveBoxes(Project);
        },
      }),
      r = MenuBar.menus.file.structure.findIndex(
        (s) =>
          s === "save_model" ||
          (typeof s == "object" &&
            s !== null &&
            "id" in s &&
            s.id === "save_model"),
      );
    MenuBar.addAction(o, r < 0 ? "file" : `file.${r + 1}`);
    let c = new Codec("bedrock_block_geometry_reference", {
      name: "Bedrock Block Geometry Reference",
      extension: "json",
      load_filter: {
        type: "json",
        extensions: ["json"],
        condition: (s) => !Blockbench.isWeb && !!s?.["minecraft:block"],
      },
      load: (s, a) => this.loadBlock(s, a),
    });
    this.deleteables.push(t, o, c, e);
  }
};
new Se();
var Me = class extends j {
  sources = new WeakMap();
  constructor() {
    super("bedrock_entity_geometry", {
      author: "legopitstop",
      category: "interface",
    });
  }
  loadEntity(e, t) {
    try {
      let o = e?.["minecraft:entity"];
      if (!o)
        throw new Error("This is not a Bedrock behavior pack entity file.");
      let i = te("fs"),
        r = te("path"),
        c = r.dirname(t.path);
      for (; r.basename(c).toLowerCase() !== "entities"; ) {
        let l = r.dirname(c);
        if (l === c)
          throw new Error("The entity file is not inside an entities folder.");
        c = l;
      }
      let s = r.dirname(c),
        a = r.basename(s),
        d = r.dirname(s),
        b = [
          r.join(d, "resource_packs", a),
          r.join(r.dirname(d), "resource_packs", a),
          r.join(d, "resource", a),
        ].filter((l) => i.existsSync(l)),
        h = o.description?.identifier,
        y = new Set(),
        k = (l, u) => {
          if (i.existsSync(l))
            for (let f of i.readdirSync(l, { withFileTypes: !0 })) {
              let p = r.join(l, f.name);
              f.isDirectory()
                ? k(p, u)
                : f.isFile() && f.name.toLowerCase().endsWith(".json") && u(p);
            }
        };
      for (let l of b)
        k(r.join(l, "entity"), (u) => {
          try {
            let f = JSON.parse(i.readFileSync(u, "utf8"))?.[
              "minecraft:client_entity"
            ];
            if (f?.description?.identifier !== h) return;
            for (let p of Object.values(f.description.geometry ?? {}))
              typeof p == "string" && y.add(p);
          } catch {}
        });
      let _;
      for (let l of b)
        k(r.join(l, "models"), (u) => {
          if (!_)
            try {
              let f = JSON.parse(i.readFileSync(u, "utf8"));
              for (let p of f?.["minecraft:geometry"] ?? []) {
                let m = p?.description?.identifier;
                if (y.has(m)) {
                  _ = { path: u, content: f, geometry: p };
                  break;
                }
              }
            } catch {}
        });
      if (_) {
        let l = _;
        Codecs.bedrock.load(
          {
            format_version: l.content.format_version,
            "minecraft:geometry": [l.geometry],
          },
          { name: r.basename(l.path), path: l.path },
        );
      } else
        (newProject("bedrock"),
          (Project.name = r.basename(t.path, ".json")),
          (Project.model_identifier = h ?? Project.name));
      Project && this.sources.set(Project, { path: t.path, identifier: h });
      let v = o.components?.["minecraft:custom_hit_test"]?.hitboxes;
      if (!Array.isArray(v)) return;
      for (let [l, u] of v.entries()) {
        let { width: f, height: p, pivot: m } = u ?? {};
        if (
          ![f, p, ...(m ?? [])].every(
            (B) => typeof B == "number" && Number.isFinite(B),
          ) ||
          !Array.isArray(m) ||
          m.length !== 3 ||
          f < 0 ||
          p < 0
        )
          continue;
        let x = f * 8,
          P = m.map((B) => B * 16);
        new BoundingBox({
          name: v.length === 1 ? "custom_hit_test" : `custom_hit_test ${l + 1}`,
          from: [P[0] - x, P[1] - p * 8, P[2] - x],
          to: [P[0] + x, P[1] + p * 8, P[2] + x],
          function: ["hitbox"],
          color: 0,
        })
          .addTo()
          .init();
      }
    } catch (o) {
      Blockbench.showMessageBox({
        title: "Open Bedrock Entity Geometry",
        message: String(o),
      });
    }
  }
  saveHitboxes(e) {
    let t = this.sources.get(e);
    if (t)
      try {
        let o = te("fs"),
          i = o.readFileSync(t.path, "utf8"),
          r = JSON.parse(i),
          c = r?.["minecraft:entity"];
        if (c?.description?.identifier !== t.identifier)
          throw new Error(
            "The entity identifier has changed. Reopen the entity before saving hitboxes.",
          );
        let s = c.components ?? (c.components = {}),
          a = s["minecraft:custom_hit_test"],
          d = BoundingBox.all.filter(
            (k) => k.export !== !1 && /^custom_hit_test(?: \d+)?$/.test(k.name),
          );
        if (!a && !d.length) return;
        let b = Array.isArray(a?.hitboxes) ? a.hitboxes : [],
          h = d.map((k, _) => ({
            ...(b[_] ?? {}),
            width: (k.to[0] - k.from[0]) / 16,
            height: (k.to[1] - k.from[1]) / 16,
            pivot: [0, 1, 2].map((v) => (k.from[v] + k.to[v]) / 32),
          }));
        if (
          (a
            ? (a.hitboxes = h)
            : (s["minecraft:custom_hit_test"] = { hitboxes: h }),
          JSON.stringify(r) === JSON.stringify(JSON.parse(i)))
        )
          return;
        let y = /\n(\s+)"/.exec(i)?.[1] ?? "  ";
        o.writeFileSync(
          t.path,
          JSON.stringify(r, null, y) +
            `
`,
          "utf8",
        );
      } catch (o) {
        Blockbench.showMessageBox({
          title: "Save Bedrock Entity Hitboxes",
          message: String(o),
        });
      }
  }
  onEnable() {
    let e = new Action("open_bedrock_entity_geometry", {
      name: "Open Bedrock Entity Geometry",
      description:
        "Open the geometry and custom hit test from a behavior pack entity file",
      icon: "view_in_ar",
      condition: () => !Blockbench.isWeb,
      click: () =>
        Blockbench.import(
          {
            type: "Bedrock Entity",
            extensions: ["json"],
            readtype: "text",
            multiple: !1,
          },
          (c) => {
            let s = c[0];
            s?.path &&
              typeof s.content == "string" &&
              this.loadEntity(JSON.parse(s.content), s);
          },
        ),
    });
    MenuBar.addAction(e, "file.import");
    let t = new Action("save_bedrock_entity_hit_test", {
        name: "Save to Entity",
        description:
          "Save custom hit test boxes to the source behavior pack entity file",
        icon: "save",
        condition: () => !!Project && this.sources.has(Project),
        click: () => {
          Project && this.saveHitboxes(Project);
        },
      }),
      i = MenuBar.menus.file.structure.findIndex(
        (c) =>
          c === "save_model" ||
          (typeof c == "object" &&
            c !== null &&
            "id" in c &&
            c.id === "save_model"),
      );
    MenuBar.addAction(t, i < 0 ? "file" : `file.${i + 1}`);
    let r = new Codec("bedrock_entity_geometry_reference", {
      name: "Bedrock Entity Geometry Reference",
      extension: "json",
      load_filter: {
        type: "json",
        extensions: ["json"],
        condition: (c) => !Blockbench.isWeb && !!c?.["minecraft:entity"],
      },
      load: (c, s) => this.loadEntity(c, s),
    });
    this.deleteables.push(e, t, r);
  }
};
new Me();
var Ae = class extends j {
  button;
  observer;
  constructor() {
    super("clear_recent_projects", {
      author: "legopitstop",
      category: "interface",
    });
  }
  onEnable() {
    let e = document.createElement("li");
    ((e.className = "tool tweaks_clear_recent_projects"),
      (e.title = tl("action.clear_recent_projects")),
      e.setAttribute("role", "button"),
      (e.tabIndex = 0),
      e.setAttribute("aria-label", e.title),
      (e.innerHTML = '<i class="material-icons">delete_sweep</i>'),
      (e.onclick = () => {
        recent_projects.length &&
          Blockbench.showMessageBox(
            {
              title: tl("action.clear_recent_projects"),
              message: tl("dialog.clear_recent_projects.message"),
              buttons: ["dialog.confirm", "dialog.cancel"],
            },
            (i) => {
              i === 0 && ((recent_projects.length = 0), updateRecentProjects());
            },
          );
      }),
      (e.onkeydown = (i) => {
        (i.key === "Enter" || i.key === " ") && (i.preventDefault(), e.click());
      }),
      (this.button = e));
    let t = () => {
      let r = document.getElementById(
        "start_screen_view_menu",
      )?.firstElementChild;
      r && e.previousElementSibling !== r && r.after(e);
    };
    t();
    let o = document.getElementById("start_files");
    o &&
      ((this.observer = new MutationObserver(t)),
      this.observer.observe(o, { childList: !0, subtree: !0 }));
  }
  onDisable() {
    (this.observer?.disconnect(),
      (this.observer = void 0),
      this.button?.remove(),
      (this.button = void 0));
  }
};
new Ae();
var Be = class {
    clicks = 0;
    deleteables = [];
    addCube(e, t = 9, o = 2) {
      new Cube({
        from: e,
        to: [e[0] + o, e[1] + o, e[2] + o],
        color: t,
      }).init();
    }
    generateChunk(e = 8) {
      for (let t = -e; t < e; t += 2)
        for (let o = 0; o < e * 2; o += 2)
          for (let i = -e; i < e; i += 2) this.addCube([t, o, i], tt(8, 9));
    }
    create() {
      (newProject("generic"),
        (Project.model_identifier = `${X}:chunk_digger`),
        (Project.name = "Chunk Digger"),
        this.generateChunk());
    }
    onLoad() {
      let e = `li[plugin="${X}"] div .plugin_icon_area`;
      this.deleteables.push(
        Blockbench.on("show_dialog", ({ dialog: t }) => {
          t?.id === "plugins" &&
            $(e).on("click", () => {
              (this.clicks++,
                this.clicks >= 5 &&
                  ((this.clicks = 0), Dialog.open?.close(), pe.create()));
            });
        }),
        Blockbench.on("hide_dialog", ({ dialog: t }) => {
          t?.id === "plugins" && ((this.clicks = 0), $(e).off());
        }),
        Blockbench.on("select_cube", (t) => {
          Project?.model_identifier === `${X}:chunk_digger` && t[0].remove();
        }),
      );
    }
    onUnload() {
      (this.deleteables.forEach((e) => e.delete()), (this.clicks = 0));
    }
  },
  pe = new Be();
var on = [];
BBPlugin.register(X, {
  title: "Tweaks & Stuff",
  author: "legopitstop",
  icon: "icon.png",
  description:
    "Adds a few tweaks to Blockbench to make your modeling experience better.",
  has_changelog: !0,
  website: "https://docs.lpsmods.dev/tweaks_n_stuff",
  repository:
    "https://github.com/legopitstop/blockbench-plugins/tree/master/plugins/tweaks_n_stuff",
  variant: "both",
  version: et,
  min_version: "4.8.0",
  tags: ["Blockbench"],
  new_repository_format: !0,
  oninstall() {
    H.all.forEach((n) => n.install());
  },
  onuninstall() {
    H.all.forEach((n) => n.uninstall());
  },
  onload() {
    (se.load(),
      ne.load(),
      H.all.forEach((n) => n.load()),
      H.all.size == 0 && console.warn("No tweaks registered!"),
      pe.onLoad());
  },
  onunload() {
    (pe.onUnload(),
      se.unload(),
      H.all.forEach((n) => n.unload()),
      on.forEach((n) => n?.delete()));
  },
});
