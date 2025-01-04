(function(Scratch) {
    "use strict";
    const {
        BlockType,
        ArgumentType
    } = Scratch;

    const MD5 = function(r) {
        function n(r, n) {
            var t, o, e, u, f;
            return e = 2147483648 & r, u = 2147483648 & n, f = (1073741823 & r) + (1073741823 & n), (t = 1073741824 & r) & (o = 1073741824 & n) ? 2147483648 ^ f ^ e ^ u : t | o ? 1073741824 & f ? 3221225472 ^ f ^ e ^ u : 1073741824 ^ f ^ e ^ u : f ^ e ^ u
        }

        function t(r, t, o, e, u, f, a) {
            return r = n(r, n(n(t & o | ~t & e, u), a)), n(r << f | r >>> 32 - f, t)
        }

        function o(r, t, o, e, u, f, a) {
            return r = n(r, n(n(t & e | o & ~e, u), a)), n(r << f | r >>> 32 - f, t)
        }

        function e(r, t, o, e, u, f, a) {
            return r = n(r, n(n(t ^ o ^ e, u), a)), n(r << f | r >>> 32 - f, t)
        }

        function u(r, t, o, e, u, f, a) {
            return r = n(r, n(n(o ^ (t | ~e), u), a)), n(r << f | r >>> 32 - f, t)
        }

        function f(r) {
            var n, t = "",
                o = "";
            for (n = 0; 3 >= n; n++) t += (o = "0" + (o = r >>> 8 * n & 255).toString(16)).substr(o.length - 2, 2);
            return t
        }
        var a, i, C, c, g, h, d, v, S;
        for (r = function(r) {
                r = r.replace(/\r\n/g, "\n");
                for (var n = "", t = 0; t < r.length; t++) {
                    var o = r.charCodeAt(t);
                    128 > o ? n += String.fromCharCode(o) : (127 < o && 2048 > o ? n += String.fromCharCode(o >> 6 | 192) : (n += String.fromCharCode(o >> 12 | 224), n += String.fromCharCode(o >> 6 & 63 | 128)), n += String.fromCharCode(63 & o | 128))
                }
                return n
            }(r), a = function(r) {
                for (var n, t = r.length, o = 16 * (((n = t + 8) - n % 64) / 64 + 1), e = Array(o - 1), u = 0, f = 0; f < t;) u = f % 4 * 8, e[n = (f - f % 4) / 4] |= r.charCodeAt(f) << u, f++;
                return e[n = (f - f % 4) / 4] |= 128 << f % 4 * 8, e[o - 2] = t << 3, e[o - 1] = t >>> 29, e
            }(r), h = 1732584193, d = 4023233417, v = 2562383102, S = 271733878, r = 0; r < a.length; r += 16) i = h, C = d, c = v, g = S, h = t(h, d, v, S, a[r + 0], 7, 3614090360), S = t(S, h, d, v, a[r + 1], 12, 3905402710), v = t(v, S, h, d, a[r + 2], 17, 606105819), d = t(d, v, S, h, a[r + 3], 22, 3250441966), h = t(h, d, v, S, a[r + 4], 7, 4118548399), S = t(S, h, d, v, a[r + 5], 12, 1200080426), v = t(v, S, h, d, a[r + 6], 17, 2821735955), d = t(d, v, S, h, a[r + 7], 22, 4249261313), h = t(h, d, v, S, a[r + 8], 7, 1770035416), S = t(S, h, d, v, a[r + 9], 12, 2336552879), v = t(v, S, h, d, a[r + 10], 17, 4294925233), d = t(d, v, S, h, a[r + 11], 22, 2304563134), h = t(h, d, v, S, a[r + 12], 7, 1804603682), S = t(S, h, d, v, a[r + 13], 12, 4254626195), v = t(v, S, h, d, a[r + 14], 17, 2792965006), h = o(h, d = t(d, v, S, h, a[r + 15], 22, 1236535329), v, S, a[r + 1], 5, 4129170786), S = o(S, h, d, v, a[r + 6], 9, 3225465664), v = o(v, S, h, d, a[r + 11], 14, 643717713), d = o(d, v, S, h, a[r + 0], 20, 3921069994), h = o(h, d, v, S, a[r + 5], 5, 3593408605), S = o(S, h, d, v, a[r + 10], 9, 38016083), v = o(v, S, h, d, a[r + 15], 14, 3634488961), d = o(d, v, S, h, a[r + 4], 20, 3889429448), h = o(h, d, v, S, a[r + 9], 5, 568446438), S = o(S, h, d, v, a[r + 14], 9, 3275163606), v = o(v, S, h, d, a[r + 3], 14, 4107603335), d = o(d, v, S, h, a[r + 8], 20, 1163531501), h = o(h, d, v, S, a[r + 13], 5, 2850285829), S = o(S, h, d, v, a[r + 2], 9, 4243563512), v = o(v, S, h, d, a[r + 7], 14, 1735328473), h = e(h, d = o(d, v, S, h, a[r + 12], 20, 2368359562), v, S, a[r + 5], 4, 4294588738), S = e(S, h, d, v, a[r + 8], 11, 2272392833), v = e(v, S, h, d, a[r + 11], 16, 1839030562), d = e(d, v, S, h, a[r + 14], 23, 4259657740), h = e(h, d, v, S, a[r + 1], 4, 2763975236), S = e(S, h, d, v, a[r + 4], 11, 1272893353), v = e(v, S, h, d, a[r + 7], 16, 4139469664), d = e(d, v, S, h, a[r + 10], 23, 3200236656), h = e(h, d, v, S, a[r + 13], 4, 681279174), S = e(S, h, d, v, a[r + 0], 11, 3936430074), v = e(v, S, h, d, a[r + 3], 16, 3572445317), d = e(d, v, S, h, a[r + 6], 23, 76029189), h = e(h, d, v, S, a[r + 9], 4, 3654602809), S = e(S, h, d, v, a[r + 12], 11, 3873151461), v = e(v, S, h, d, a[r + 15], 16, 530742520), h = u(h, d = e(d, v, S, h, a[r + 2], 23, 3299628645), v, S, a[r + 0], 6, 4096336452), S = u(S, h, d, v, a[r + 7], 10, 1126891415), v = u(v, S, h, d, a[r + 14], 15, 2878612391), d = u(d, v, S, h, a[r + 5], 21, 4237533241), h = u(h, d, v, S, a[r + 12], 6, 1700485571), S = u(S, h, d, v, a[r + 3], 10, 2399980690), v = u(v, S, h, d, a[r + 10], 15, 4293915773), d = u(d, v, S, h, a[r + 1], 21, 2240044497), h = u(h, d, v, S, a[r + 8], 6, 1873313359), S = u(S, h, d, v, a[r + 15], 10, 4264355552), v = u(v, S, h, d, a[r + 6], 15, 2734768916), d = u(d, v, S, h, a[r + 13], 21, 1309151649), h = u(h, d, v, S, a[r + 4], 6, 4149444226), S = u(S, h, d, v, a[r + 11], 10, 3174756917), v = u(v, S, h, d, a[r + 2], 15, 718787259), d = u(d, v, S, h, a[r + 9], 21, 3951481745), h = n(h, i), d = n(d, C), v = n(v, c), S = n(S, g);
        return (f(h) + f(d) + f(v) + f(S)).toLowerCase()
    };

    function randomStr(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    var memory = {};

    const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);

    function runCompiled(string, env = {}) {
        const code = string.match(/"([^"\\]*(\\.)?)*"|\\.|[^"\s]+/g);
        env = runCompiledFuncRaw(code, "ENTRY");
        env = runCompiledFuncRaw(code, "e_main", env);

        // this is different from standard fcl.js, normally it returns the output value.
        return env;
    }

    function runCompiledFunc(string, eventName, env = {}) {
        const code = string.match(/"([^"\\]*(\\.)?)*"|\\.|[^"\s]+/g);
        return runCompiledFuncRaw(code, eventName, env);
    }

    function runCompiledFuncRaw(code, eventName, env = {}) {
        const env_keys = Object.keys(env);

        if (!env_keys.includes("events")) {
            env["events"] = {}
        }
        if (!env_keys.includes("outval")) {
            env["outval"] = null
        }
        if (!env_keys.includes("id")) {
            env["id"] = MD5(randomStr())
        }
        if (!env_keys.includes("main_val")) {
            env["main_val"] = ""
        }
        env["param_stack"] = [];
        const id = env["id"];
        memory[id] = [];

        let current_event = "";
        for (let i = 0; i < code.length; i++) {
            const command = code[i];
            switch (command) {
                case "#":
                    i++;
                    env["events"][code[i]] = [i, code.length];
                    current_event = code[i];
                    break
                case "-#":
                    env["events"][current_event][1] = i;
                    current_event = "";
                    break
                case "msv":
                    i += 2;
                    break
                case "ldm":
                    i++;
                    break
                case "svm":
                    i++;
                    break
                case "dlm":
                    i++;
                    break
                case "cps":
                    break
                case "aps":
                    i++;
                    break
                case "exc":
                    break
                case "scv":
                    i++;
                    break
                case "str":
                    break
                case "eql":
                    i += 2;
                    break
                case "tql":
                    break
                case "inv":
                    break
                case "add":
                case "sub":
                case "mul":
                case "div":
                    i += 2;
                    break
                case "ret":
                    break
                default:
                    console.error("load", command, i, code[i - 1], code.map((item, index) => `${index}: ${item}`));
                    break
            }
        }
        const evnt = env["events"][eventName];
        if (!evnt) {
            return {
                "outval": null
            }
        }
        let running = true;
        let i = evnt[0];
        while (running) {
            i++;
            if (i >= evnt[1]) {
                running = false;
            }
            const command = code[i];
            switch (command) {
                case "#":
                    i++;
                    break;
                case "-#":
                    break
                case "msv":
                    i++;
                    const msv_address = id + "_" + code[i];
                    memory[id].push(msv_address);
                    i++;
                    memory[msv_address] = code[i]
                    break
                case "ldm":
                    i++;
                    const ldm_address = id + "_" + code[i];
                    env["main_val"] = memory[ldm_address];
                    break
                case "svm":
                    i++;
                    const svm_address = id + "_" + code[i];
                    memory[svm_address] = env["main_val"];
                    break
                case "dlm":
                    i++;
                    const dlm_address = id + "_" + code[i];
                    delete memory[dlm_address];
                case "cps":
                    env["param_stack"] = [];
                    break
                case "aps":
                    i++;
                    env["param_stack"].push(runCompiledVal(code[i], env));
                    break
                case "exc":
                    env = runCompiledExc(env["main_val"], env);
                    break
                case "scv":
                    i++;
                    env["main_val"] = runCompiledVal(code[i], env);
                    break
                case "str":
                    env["main_val"] = env["main_val"].toString();
                    break
                case "eql":
                    env["main_val"] = memory[id + "_" + code[i + 1]] == memory[id + "_" + code[i + 2]];
                    i += 2;
                    break
                case "tql":
                    env["main_val"] = true;
                    break
                case "inv":
                    env["main_val"] = !env["main_val"];
                    break
                case "add":
                case "sub":
                    i++;
                    const op_a = memory[id + "_" + code[i]];
                    i++;
                    const op_b = memory[id + "_" + code[i]];
                    switch (command) {
                        case "add":
                            env["main_val"] = op_a + op_b;
                            break
                        case "sub":
                            env["main_val"] = op_a - op_b;
                            break
                    }
                    break
                case "ret":
                    env["outval"] = env["main_val"];
                    return env;
                default:
                    console.error("run", command, i);
                    break
            }
        }
        return env;
    }

    function runCompiledVal(val, env) {
        if (val[0] == "\"" && val[val.length - 1] == "\"") {
            return val.slice(1, -1).replace(/\\"/g, '"');
        }
        if (isNumeric(val)) {
            return Number(val);
        }
        return memory[env["id"] + "_" + val];
    }

    function runCompiledExc(val, env) {
        switch (val) {
            case "log":
                console.log(env["param_stack"].join(" "))
                break
            case "test":
                env["main_val"] = env["param_stack"][0];
                break
            default:
                console.error("unknown exc " + val)
                break
        }
        return env;
    }

    class FCL {
        getInfo() {
            return {
                id: "flfFcl",
                name: "FCL Language",
                color1: "#b0196c",
                blocks: [
                    {
                        opcode: "runCompiledBlock",
                        blockType: BlockType.COMMAND,
                        text: "Run Compiled [code]",
                        arguments: {
                            code: {
                                type: ArgumentType.STRING,
                                defaultValue: "# e_main cps aps \"hi\" scv \"log\" exc -#"
                            }
                        }
                    },
                    {
                        opcode: "runCompiledBlockEnv",
                        blockType: BlockType.COMMAND,
                        text: "Run Compiled [code] with env [env]",
                        arguments: {
                            code: {
                                type: ArgumentType.STRING,
                                defaultValue: "# e_main cps aps \"hi\" scv \"log\" exc -#"
                            },
                            env: {
                                type: ArgumentType.STRING,
                                defaultValue: "{}"
                            }
                        }
                    },
                    {
                        opcode: "runCompiledReporter",
                        blockType: BlockType.REPORTER,
                        text: "Run Compiled [code] and get [out] as [representation]",
                        arguments: {
                            code: {
                                type: ArgumentType.STRING,
                                defaultValue: "# e_main scv \"hi\" ret -#"
                            },
                            out: {
                                type: ArgumentType.STRING,
                                defaultValue: "output",
                                menu: 'fcl_out'
                            },
                            representation: {
                                type: ArgumentType.STRING,
                                defaultValue: "json",
                                menu: 'obj_representation'
                            }
                        }
                    },
                    {
                        opcode: "runCompiledReporterEnv",
                        blockType: BlockType.REPORTER,
                        text: "Run Compiled [code] and get [out] as [representation] with env [env]",
                        arguments: {
                            code: {
                                type: ArgumentType.STRING,
                                defaultValue: "# e_main scv \"hi\" ret -#"
                            },
                            out: {
                                type: ArgumentType.STRING,
                                defaultValue: "output",
                                menu: 'fcl_out'
                            },
                            representation: {
                                type: ArgumentType.STRING,
                                defaultValue: "json",
                                menu: 'obj_representation'
                            },
                            env: {
                                type: ArgumentType.STRING,
                                defaultValue: "{}"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "get_memory",
                        blockType: BlockType.REPORTER,
                        text: "Get memory as [representation]",
                        arguments: {
                            representation: {
                                type: ArgumentType.STRING,
                                defaultValue: "json",
                                menu: 'obj_representation'
                            }
                        }
                    },
                    {
                        opcode: "clear_memory",
                        blockType: BlockType.COMMAND,
                        text: "Clear Memory"
                    },
                    {
                        opcode: "set_memory",
                        blockType: BlockType.COMMAND,
                        text: "Set Memory to [object]",
                        arguments: {
                            object: {
                                type: ArgumentType.STRING,
                                defaultValue: "{}"
                            }
                        }
                    },
                ],
                menus: {
                    obj_representation: {
                        acceptReporters: true,
                        items: [
                            'json',
                            'object'
                        ]
                    },
                    fcl_out: {
                        acceptReporters: true,
                        items: [
                            'output',
                            'env'
                        ]
                    }
                }
            }
        }

        runCompiledBlock({ code }) {
            runCompiled(code);
        }
        runCompiledBlockEnv({ code, env }) {
            runCompiled(code, env);
        }
        runCompiledReporter({ code, out, representation }) {
            let data = runCompiled(code);
            if (out == "output") {
                return data["outval"];
            }
            if (representation == "json") {
                data = JSON.stringify(data);
            };
            return data;
        }
        runCompiledReporterEnv({ code, out, representation, env }) {
            let data = runCompiled(code, env);
            if (out == "output") {
                return data["outval"];
            }
            if (representation == "json") {
                data = JSON.stringify(data);
            }
            return data;
        }
        get_memory({ representation }) {
            let data = memory;
            if (representation == "json") {
                data = JSON.stringify(data);
            }
            return data;
        }
        clear_memory() {
            memory = {};
        }
        set_memory({ object }) {
            if (typeof object == "string") {
                object = JSON.parse(object);
            }
            memory = object;
        }
    }

    Scratch.extensions.register(new FCL());
})(Scratch);
