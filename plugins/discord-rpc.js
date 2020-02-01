! function(e) {
    var t = {};

    function n(s) {
        if (t[s]) return t[s].exports;
        var i = t[s] = {
            i: s,
            l: !1,
            exports: {}
        };
        return e[s].call(i.exports, i, i.exports, n), i.l = !0, i.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, s) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: s
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var s = Object.create(null);
        if (n.r(s), Object.defineProperty(s, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var i in e) n.d(s, i, function(t) {
                return e[t]
            }.bind(null, i));
        return s
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "/", n(n.s = 4)
}([function(e, t, n) {
    "use strict";
    let s;
    try {
        const {
            app: e
        } = n(6);
        s = e.setAsDefaultProtocolClient.bind(e)
    } catch (e) {
        try {
            s = n(7)
        } catch (e) {}
    }
    "function" != typeof s && (s = () => !1);
    e.exports = {
        pid: function() {
            return "undefined" != typeof process ? process.pid : null
        },
        register: s,
        uuid: () => {
            let e = "";
            for (let t = 0; t < 32; t += 1) {
                let n;
                if (8 !== t && 12 !== t && 16 !== t && 20 !== t || (e += "-"), 12 === t) n = 4;
                else {
                    const e = 16 * Math.random() | 0;
                    n = 16 === t ? 3 & e | 0 : e
                }
                e += n.toString(16)
            }
            return e
        }
    }
}, function(e, t) {
    e.exports = require("events")
}, function(e, t, n) {
    "use strict";
    var s = function() {
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        if (void 0 !== s) return s;
        throw new Error("unable to locate global object")
    }();
    e.exports = t = s.fetch, t.default = s.fetch.bind(s), t.Headers = s.Headers, t.Request = s.Request, t.Response = s.Response
}, function(e, t, n) {
    "use strict";

    function s(e) {
        const t = {};
        for (const n of e) t[n] = n;
        return t
    }
    t.browser = "undefined" != typeof window, t.RPCCommands = s(["DISPATCH", "AUTHORIZE", "AUTHENTICATE", "GET_GUILD", "GET_GUILDS", "GET_CHANNEL", "GET_CHANNELS", "GET_RELATIONSHIPS", "GET_USER", "SUBSCRIBE", "UNSUBSCRIBE", "SET_USER_VOICE_SETTINGS", "SET_USER_VOICE_SETTINGS_2", "SELECT_VOICE_CHANNEL", "GET_SELECTED_VOICE_CHANNEL", "SELECT_TEXT_CHANNEL", "GET_VOICE_SETTINGS", "SET_VOICE_SETTINGS_2", "SET_VOICE_SETTINGS", "CAPTURE_SHORTCUT", "SET_ACTIVITY", "SEND_ACTIVITY_JOIN_INVITE", "CLOSE_ACTIVITY_JOIN_REQUEST", "ACTIVITY_INVITE_USER", "ACCEPT_ACTIVITY_INVITE", "INVITE_BROWSER", "DEEP_LINK", "CONNECTIONS_CALLBACK", "BRAINTREE_POPUP_BRIDGE_CALLBACK", "GIFT_CODE_BROWSER", "OVERLAY", "BROWSER_HANDOFF", "SET_CERTIFIED_DEVICES", "GET_IMAGE", "CREATE_LOBBY", "UPDATE_LOBBY", "DELETE_LOBBY", "UPDATE_LOBBY_MEMBER", "CONNECT_TO_LOBBY", "DISCONNECT_FROM_LOBBY", "SEND_TO_LOBBY", "SEARCH_LOBBIES", "CONNECT_TO_LOBBY_VOICE", "DISCONNECT_FROM_LOBBY_VOICE", "SET_OVERLAY_LOCKED", "OPEN_OVERLAY_ACTIVITY_INVITE", "OPEN_OVERLAY_GUILD_INVITE", "OPEN_OVERLAY_VOICE_SETTINGS", "VALIDATE_APPLICATION", "GET_ENTITLEMENT_TICKET", "GET_APPLICATION_TICKET", "START_PURCHASE", "GET_SKUS", "GET_ENTITLEMENTS", "GET_NETWORKING_CONFIG", "NETWORKING_SYSTEM_METRICS", "NETWORKING_PEER_METRICS", "NETWORKING_CREATE_TOKEN", "SET_USER_ACHIEVEMENT", "GET_USER_ACHIEVEMENTS"]), t.RPCEvents = s(["CURRENT_USER_UPDATE", "GUILD_STATUS", "GUILD_CREATE", "CHANNEL_CREATE", "RELATIONSHIP_UPDATE", "VOICE_CHANNEL_SELECT", "VOICE_STATE_CREATE", "VOICE_STATE_DELETE", "VOICE_STATE_UPDATE", "VOICE_SETTINGS_UPDATE", "VOICE_SETTINGS_UPDATE_2", "VOICE_CONNECTION_STATUS", "SPEAKING_START", "SPEAKING_STOP", "GAME_JOIN", "GAME_SPECTATE", "ACTIVITY_JOIN", "ACTIVITY_JOIN_REQUEST", "ACTIVITY_SPECTATE", "ACTIVITY_INVITE", "NOTIFICATION_CREATE", "MESSAGE_CREATE", "MESSAGE_UPDATE", "MESSAGE_DELETE", "LOBBY_DELETE", "LOBBY_UPDATE", "LOBBY_MEMBER_CONNECT", "LOBBY_MEMBER_DISCONNECT", "LOBBY_MEMBER_UPDATE", "LOBBY_MESSAGE", "CAPTURE_SHORTCUT_CHANGE", "OVERLAY", "OVERLAY_UPDATE", "ENTITLEMENT_CREATE", "ENTITLEMENT_DELETE", "USER_ACHIEVEMENT_UPDATE", "READY", "ERROR"]), t.RPCErrors = {
        CAPTURE_SHORTCUT_ALREADY_LISTENING: 5004,
        GET_GUILD_TIMED_OUT: 5002,
        INVALID_ACTIVITY_JOIN_REQUEST: 4012,
        INVALID_ACTIVITY_SECRET: 5005,
        INVALID_CHANNEL: 4005,
        INVALID_CLIENTID: 4007,
        INVALID_COMMAND: 4002,
        INVALID_ENTITLEMENT: 4015,
        INVALID_EVENT: 4004,
        INVALID_GIFT_CODE: 4016,
        INVALID_GUILD: 4003,
        INVALID_INVITE: 4011,
        INVALID_LOBBY: 4013,
        INVALID_LOBBY_SECRET: 4014,
        INVALID_ORIGIN: 4008,
        INVALID_PAYLOAD: 4e3,
        INVALID_PERMISSIONS: 4006,
        INVALID_TOKEN: 4009,
        INVALID_USER: 4010,
        LOBBY_FULL: 5007,
        NO_ELIGIBLE_ACTIVITY: 5006,
        OAUTH2_ERROR: 5e3,
        PURCHASE_CANCELED: 5008,
        PURCHASE_ERROR: 5009,
        RATE_LIMITED: 5011,
        SELECT_CHANNEL_TIMED_OUT: 5001,
        SELECT_VOICE_FORCE_REQUIRED: 5003,
        SERVICE_UNAVAILABLE: 1001,
        TRANSACTION_ABORTED: 1002,
        UNAUTHORIZED_FOR_ACHIEVEMENT: 5010,
        UNKNOWN_ERROR: 1e3
    }, t.RPCCloseCodes = {
        CLOSE_NORMAL: 1e3,
        CLOSE_UNSUPPORTED: 1003,
        CLOSE_ABNORMAL: 1006,
        INVALID_CLIENTID: 4e3,
        INVALID_ORIGIN: 4001,
        RATELIMITED: 4002,
        TOKEN_REVOKED: 4003,
        INVALID_VERSION: 4004,
        INVALID_ENCODING: 4005
    }, t.LobbyTypes = {
        PRIVATE: 1,
        PUBLIC: 2
    }, t.RelationshipTypes = {
        NONE: 0,
        FRIEND: 1,
        BLOCKED: 2,
        PENDING_INCOMING: 3,
        PENDING_OUTGOING: 4,
        IMPLICIT: 5
    }
}, function(e, t, n) {
    const s = n(5),
        i = new s.Client({
            transport: "ipc"
        });
    var o = new Date;
    ! function() {
        let e, t, n = !0,
            s = "";
        Plugin.register("discord-rpc", {
            title: "Discord RPC",
            author: "strajabot, Kastle, & simplyme",
            icon: "announcement",
            version: "1.1.1",
            description: "Show a rich presence status in Discord",
            variant: "desktop",
            onload() {
                async function r() {
                    if (!i) return;
                    s !== Project.name && (s = Project.name, o = new Date);
                    var e = Settings.get("obfuscaterpc") ? "Unknown Model" : `${s}.bbmodel`;
                    const t = {
                        edit: "Editing",
                        paint: "Painting",
                        animate: "Animating"
                    } [Modes.selected.id] || "Making";
                    i.setActivity({
                        largeImageKey: "icon",
                        largeImageText: `Blockbench ${Blockbench.version}`,
                        smallImageKey: `${Format.id}`,
                        details: `${t} a ${Format.name}`,
                        state: `${e}`,
                        startTimestamp: o,
                        instance: !1
                    })
                }
                e = new Setting("obfuscaterpc", {
                    value: !0,
                    name: "Discord Rich Prescense",
                    description: "Obfuscate Project Name"
                });
                const c = Modes.options;
                Object.keys(c).forEach(e => {
                    const t = Modes.options[e];
                    if (t.onSelect && "function" == typeof t.onSelect) {
                        let e = t.onSelect;
                        t.onSelect = () => {
                            e.apply(this, arguments), n && r()
                        }
                    }
                }), i.on("ready", () => {
                    r(), t = setInterval(() => {
                        r()
                    }, 15e3)
                }), i.login({
                    clientId: "642126871177199617"
                }).catch(console.error)
            },
            onunload() {
                n = !1, e.delete(), clearInterval(t)
            }
        })
    }()
}, function(e, t, n) {
    "use strict";
    const s = n(0);
    e.exports = {
        Client: n(8),
        register: e => s.register(`discord-${e}`)
    }
}, function(e, t) {
    if ("undefined" == typeof electron) {
        var n = new Error("Cannot find module 'electron'");
        throw n.code = "MODULE_NOT_FOUND", n
    }
    e.exports = electron
}, function(e, t) {}, function(e, t, n) {
    "use strict";
    const s = n(1),
        {
            setTimeout: i,
            clearTimeout: o
        } = n(9),
        r = n(2),
        c = n(10),
        {
            RPCCommands: a,
            RPCEvents: E,
            RelationshipTypes: _
        } = n(3),
        {
            pid: u,
            uuid: T
        } = n(0);

    function d(e, t) {
        return `${e}${JSON.stringify(t)}`
    }
    e.exports = class extends s {
        constructor(e = {}) {
            super(), this.options = e, this.accessToken = null, this.clientId = null, this.application = null, this.user = null;
            const t = c[e.transport];
            if (!t) throw new TypeError("RPC_INVALID_TRANSPORT", e.transport);
            this.fetch = (e, t, {
                data: n,
                query: s
            } = {}) => r(`${this.fetch.endpoint}${t}${s?new URLSearchParams(s):""}`, {
                method: e,
                body: n,
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            }).then(e => e.json()), this.fetch.endpoint = "https://discordapp.com/api", this.transport = new t(this), this.transport.on("message", this._onRpcMessage.bind(this)), this._expecting = new Map, this._subscriptions = new Map, this._connectPromise = void 0
        }
        connect(e) {
            return this._connectPromise ? this._connectPromise : (this._connectPromise = new Promise((t, n) => {
                this.clientId = e;
                const s = i(() => n(new Error("RPC_CONNECTION_TIMEOUT")), 1e4);
                s.unref(), this.once("connected", () => {
                    o(s), t(this)
                }), this.transport.once("close", () => {
                    this._expecting.forEach(e => {
                        e.reject(new Error("connection closed"))
                    }), this.emit("disconnected"), n()
                }), this.transport.connect().catch(n)
            }), this._connectPromise)
        }
        async login(e = {}) {
            let {
                clientId: t,
                accessToken: n
            } = e;
            return await this.connect(t), e.scopes ? (n || (n = await this.authorize(e)), this.authenticate(n)) : (this.emit("ready"), this)
        }
        request(e, t, n) {
            return new Promise((s, i) => {
                const o = T();
                this.transport.send({
                    cmd: e,
                    args: t,
                    evt: n,
                    nonce: o
                }), this._expecting.set(o, {
                    resolve: s,
                    reject: i
                })
            })
        }
        _onRpcMessage(e) {
            if (e.cmd === a.DISPATCH && e.evt === E.READY) e.data.user && (this.user = e.data.user), this.emit("connected");
            else if (this._expecting.has(e.nonce)) {
                const {
                    resolve: t,
                    reject: n
                } = this._expecting.get(e.nonce);
                if ("ERROR" === e.evt) {
                    const t = new Error(e.data.message);
                    t.code = e.data.code, t.data = e.data, n(t)
                } else t(e.data);
                this._expecting.delete(e.nonce)
            } else {
                const t = d(e.evt, e.args);
                if (!this._subscriptions.has(t)) return;
                this._subscriptions.get(t)(e.data)
            }
        }
        async authorize({
            scopes: e,
            clientSecret: t,
            rpcToken: n,
            redirectUri: s
        } = {}) {
            if (t && !0 === n) {
                n = (await this.fetch("POST", "/oauth2/token/rpc", {
                    data: new URLSearchParams({
                        client_id: this.clientId,
                        client_secret: t
                    })
                })).rpc_token
            }
            const {
                code: i
            } = await this.request("AUTHORIZE", {
                scopes: e,
                client_id: this.clientId,
                rpc_token: n,
                redirect_uri: s
            });
            return (await this.fetch("POST", "/oauth2/token", {
                data: new URLSearchParams({
                    client_id: this.clientId,
                    client_secret: t,
                    code: i,
                    grant_type: "authorization_code",
                    redirect_uri: s
                })
            })).access_token
        }
        authenticate(e) {
            return this.request("AUTHENTICATE", {
                access_token: e
            }).then(({
                application: t,
                user: n
            }) => (this.accessToken = e, this.application = t, this.user = n, this.emit("ready"), this))
        }
        getGuild(e, t) {
            return this.request(a.GET_GUILD, {
                guild_id: e,
                timeout: t
            })
        }
        getGuilds(e) {
            return this.request(a.GET_GUILDS, {
                timeout: e
            })
        }
        getChannel(e, t) {
            return this.request(a.GET_CHANNEL, {
                channel_id: e,
                timeout: t
            })
        }
        async getChannels(e, t) {
            const {
                channels: n
            } = await this.request(a.GET_CHANNELS, {
                timeout: t,
                guild_id: e
            });
            return n
        }
        setCertifiedDevices(e) {
            return this.request(a.SET_CERTIFIED_DEVICES, {
                devices: e.map(e => ({
                    type: e.type,
                    id: e.uuid,
                    vendor: e.vendor,
                    model: e.model,
                    related: e.related,
                    echo_cancellation: e.echoCancellation,
                    noise_suppression: e.noiseSuppression,
                    automatic_gain_control: e.automaticGainControl,
                    hardware_mute: e.hardwareMute
                }))
            })
        }
        setUserVoiceSettings(e, t) {
            return this.request(a.SET_USER_VOICE_SETTINGS, {
                user_id: e,
                pan: t.pan,
                mute: t.mute,
                volume: t.volume
            })
        }
        selectVoiceChannel(e, {
            timeout: t,
            force: n = !1
        } = {}) {
            return this.request(a.SELECT_VOICE_CHANNEL, {
                channel_id: e,
                timeout: t,
                force: n
            })
        }
        selectTextChannel(e, {
            timeout: t,
            force: n = !1
        } = {}) {
            return this.request(a.SELECT_TEXT_CHANNEL, {
                channel_id: e,
                timeout: t,
                force: n
            })
        }
        getVoiceSettings() {
            return this.request(a.GET_VOICE_SETTINGS).then(e => ({
                automaticGainControl: e.automatic_gain_control,
                echoCancellation: e.echo_cancellation,
                noiseSuppression: e.noise_suppression,
                qos: e.qos,
                silenceWarning: e.silence_warning,
                deaf: e.deaf,
                mute: e.mute,
                input: {
                    availableDevices: e.input.available_devices,
                    device: e.input.device_id,
                    volume: e.input.volume
                },
                output: {
                    availableDevices: e.output.available_devices,
                    device: e.output.device_id,
                    volume: e.output.volume
                },
                mode: {
                    type: e.mode.type,
                    autoThreshold: e.mode.auto_threshold,
                    threshold: e.mode.threshold,
                    shortcut: e.mode.shortcut,
                    delay: e.mode.delay
                }
            }))
        }
        setVoiceSettings(e) {
            return this.request(a.SET_VOICE_SETTINGS, {
                automatic_gain_control: e.automaticGainControl,
                echo_cancellation: e.echoCancellation,
                noise_suppression: e.noiseSuppression,
                qos: e.qos,
                silence_warning: e.silenceWarning,
                deaf: e.deaf,
                mute: e.mute,
                input: e.input ? {
                    device_id: e.input.device,
                    volume: e.input.volume
                } : void 0,
                output: e.output ? {
                    device_id: e.output.device,
                    volume: e.output.volume
                } : void 0,
                mode: e.mode ? {
                    mode: e.mode.type,
                    auto_threshold: e.mode.autoThreshold,
                    threshold: e.mode.threshold,
                    shortcut: e.mode.shortcut,
                    delay: e.mode.delay
                } : void 0
            })
        }
        captureShortcut(e) {
            const t = d(E.CAPTURE_SHORTCUT_CHANGE),
                n = () => (this._subscriptions.delete(t), this.request(a.CAPTURE_SHORTCUT, {
                    action: "STOP"
                }));
            return this._subscriptions.set(t, ({
                shortcut: t
            }) => {
                e(t, n)
            }), this.request(a.CAPTURE_SHORTCUT, {
                action: "START"
            }).then(() => n)
        }
        setActivity(e = {}, t = u()) {
            let n, s, i, o;
            if (e.startTimestamp || e.endTimestamp) {
                if (n = {
                        start: e.startTimestamp,
                        end: e.endTimestamp
                    }, n.start instanceof Date && (n.start = Math.round(n.start.getTime())), n.end instanceof Date && (n.end = Math.round(n.end.getTime())), n.start > 2147483647e3) throw new RangeError("timestamps.start must fit into a unix timestamp");
                if (n.end > 2147483647e3) throw new RangeError("timestamps.end must fit into a unix timestamp")
            }
            return (e.largeImageKey || e.largeImageText || e.smallImageKey || e.smallImageText) && (s = {
                large_image: e.largeImageKey,
                large_text: e.largeImageText,
                small_image: e.smallImageKey,
                small_text: e.smallImageText
            }), (e.partySize || e.partyId || e.partyMax) && (i = {
                id: e.partyId
            }, (e.partySize || e.partyMax) && (i.size = [e.partySize, e.partyMax])), (e.matchSecret || e.joinSecret || e.spectateSecret) && (o = {
                match: e.matchSecret,
                join: e.joinSecret,
                spectate: e.spectateSecret
            }), this.request(a.SET_ACTIVITY, {
                pid: t,
                activity: {
                    state: e.state,
                    details: e.details,
                    timestamps: n,
                    assets: s,
                    party: i,
                    secrets: o,
                    instance: !!e.instance
                }
            })
        }
        clearActivity(e = u()) {
            return this.request(a.SET_ACTIVITY, {
                pid: e
            })
        }
        sendJoinInvite(e) {
            return this.request(a.SEND_ACTIVITY_JOIN_INVITE, {
                user_id: e.id || e
            })
        }
        sendJoinRequest(e) {
            return this.request(a.SEND_ACTIVITY_JOIN_REQUEST, {
                user_id: e.id || e
            })
        }
        closeJoinRequest(e) {
            return this.request(a.CLOSE_ACTIVITY_JOIN_REQUEST, {
                user_id: e.id || e
            })
        }
        createLobby(e, t, n) {
            return this.request(a.CREATE_LOBBY, {
                type: e,
                capacity: t,
                metadata: n
            })
        }
        updateLobby(e, {
            type: t,
            owner: n,
            capacity: s,
            metadata: i
        } = {}) {
            return this.request(a.UPDATE_LOBBY, {
                id: e.id || e,
                type: t,
                owner_id: n && n.id || n,
                capacity: s,
                metadata: i
            })
        }
        deleteLobby(e) {
            return this.request(a.DELETE_LOBBY, {
                id: e.id || e
            })
        }
        connectToLobby(e, t) {
            return this.request(a.CONNECT_TO_LOBBY, {
                id: e,
                secret: t
            })
        }
        sendToLobby(e, t) {
            return this.request(a.SEND_TO_LOBBY, {
                id: e.id || e,
                data: t
            })
        }
        disconnectFromLobby(e) {
            return this.request(a.DISCONNECT_FROM_LOBBY, {
                id: e.id || e
            })
        }
        updateLobbyMember(e, t, n) {
            return this.request(a.UPDATE_LOBBY_MEMBER, {
                lobby_id: e.id || e,
                user_id: t.id || t,
                metadata: n
            })
        }
        getRelationships() {
            const e = Object.keys(_);
            return this.request(a.GET_RELATIONSHIPS).then(t => t.relationships.map(t => ({
                ...t,
                type: e[t.type]
            })))
        }
        subscribe(e, t, n) {
            return n || "function" != typeof t || (n = t, t = void 0), this.request(a.SUBSCRIBE, t, e).then(() => {
                const s = d(e, t);
                return this._subscriptions.set(s, n), {
                    unsubscribe: () => this.request(a.UNSUBSCRIBE, t, e).then(() => this._subscriptions.delete(s))
                }
            })
        }
        async destroy() {
            this.transport.close()
        }
    }
}, function(e, t) {
    e.exports = require("timers")
}, function(e, t, n) {
    "use strict";
    e.exports = {
        ipc: n(11),
        websocket: n(13)
    }
}, function(e, t, n) {
    "use strict";
    const s = n(12),
        i = n(1),
        o = n(2),
        {
            uuid: r
        } = n(0),
        c = 0,
        a = 1,
        E = 2,
        _ = 3,
        u = 4;

    function T(e = 0) {
        return new Promise((t, n) => {
            const i = function(e) {
                    if ("win32" === process.platform) return `\\\\?\\pipe\\discord-ipc-${e}`;
                    const {
                        env: {
                            XDG_RUNTIME_DIR: t,
                            TMPDIR: n,
                            TMP: s,
                            TEMP: i
                        }
                    } = process;
                    return `${(t||n||s||i||"/tmp").replace(/\/$/,"")}/discord-ipc-${e}`
                }(e),
                o = () => {
                    e < 10 ? t(T(e + 1)) : n(new Error("Could not connect"))
                },
                r = s.createConnection(i, () => {
                    r.removeListener("error", o), t(r)
                });
            r.once("error", o)
        })
    }

    function d(e, t) {
        t = JSON.stringify(t);
        const n = Buffer.byteLength(t),
            s = Buffer.alloc(8 + n);
        return s.writeInt32LE(e, 0), s.writeInt32LE(n, 4), s.write(t, 8, n), s
    }
    const I = {
        full: "",
        op: void 0
    };

    function l(e, t) {
        const n = e.read();
        if (!n) return;
        let s, {
            op: i
        } = I;
        if ("" === I.full) {
            i = I.op = n.readInt32LE(0);
            const e = n.readInt32LE(4);
            s = n.slice(8, e + 8)
        } else s = n.toString();
        try {
            t({
                op: i,
                data: JSON.parse(I.full + s)
            }), I.full = "", I.op = void 0
        } catch (e) {
            I.full += s
        }
        l(e, t)
    }
    e.exports = class extends i {
        constructor(e) {
            super(), this.client = e, this.socket = null
        }
        async connect() {
            const e = this.socket = await T();
            e.on("close", this.onClose.bind(this)), e.on("error", this.onClose.bind(this)), this.emit("open"), e.write(d(c, {
                v: 1,
                client_id: this.client.clientId
            })), e.pause(), e.on("readable", () => {
                l(e, ({
                    op: e,
                    data: t
                }) => {
                    switch (e) {
                        case _:
                            this.send(t, u);
                            break;
                        case a:
                            if (!t) return;
                            "AUTHORIZE" === t.cmd && "ERROR" !== t.evt && async function e(t = 0) {
                                if (t > 30) throw new Error("Could not find endpoint");
                                const n = `http://127.0.0.1:${6463+t%10}`;
                                try {
                                    return 401 !== (await o(n)).status ? e(t + 1) : n
                                } catch (n) {
                                    return e(t + 1)
                                }
                            }().then(e => {
                                this.client.request.endpoint = e
                            }), this.emit("message", t);
                            break;
                        case E:
                            this.emit("close", t)
                    }
                })
            })
        }
        onClose(e) {
            this.emit("close", e)
        }
        send(e, t = a) {
            this.socket.write(d(t, e))
        }
        close() {
            this.send({}, E), this.socket.end()
        }
        ping() {
            this.send(r(), _)
        }
    }, e.exports.encode = d, e.exports.decode = l
}, function(e, t) {
    e.exports = require("net")
}, function(e, t, n) {
    "use strict";
    const s = n(1),
        {
            browser: i
        } = n(3),
        o = i ? window.WebSocket : n(14);
    e.exports = class extends s {
        constructor(e) {
            super(), this.client = e, this.ws = null, this.tries = 0
        }
        async connect(e, t = this.tries) {
            if (this.connected) return;
            const n = 6463 + t % 10;
            this.hostAndPort = `127.0.0.1:${n}`;
            const s = this.ws = new o(`ws://${this.hostAndPort}/?v=1&client_id=${this.client.clientId}`);
            s.onopen = this.onOpen.bind(this), s.onclose = s.onerror = this.onClose.bind(this), s.onmessage = this.onMessage.bind(this)
        }
        send(e) {
            var t;
            this.ws && this.ws.send((t = e, JSON.stringify(t)))
        }
        close() {
            this.ws && this.ws.close()
        }
        ping() {}
        onMessage(e) {
            var t;
            this.emit("message", (t = e.data, JSON.parse(t)))
        }
        onOpen() {
            this.emit("open")
        }
        onClose(e) {
            try {
                this.ws.close()
            } catch (e) {}
            const t = e.code >= 4e3 && e.code < 5e3;
            e.code && !t || this.emit("close", e), t || setTimeout(() => this.connect(void 0, 1006 === e.code ? ++this.tries : 0), 250)
        }
    }
}, function(e, t) {}]);
