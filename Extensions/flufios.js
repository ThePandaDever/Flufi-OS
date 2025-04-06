(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

    function randomStr(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 0; i < (length ?? 10); i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }
    
    function getFileRaw(path, system) {
        if (typeof path !== 'string') { return [] }
        const parts = path.split('/');
        if (parts.length == 1) { return system[path] }
        let current = system;
        let i = 0
        for (const part of parts) {
            if (part.split(".").length == 2 && parts.length - 1 > i) { return "" }
            if (current[part]) {
                current = current[part];
            } else {
                return null;
            }
            i++;
        }
        return current;
    }

	class FlufiOS {
        constructor() {
            window.flf ??= {};
            flf.processes ??= {};
            flf.fs ??= {};
        }
		getInfo() {
			return {
				id: "flfos",
				name: "Flufi OS",
                color1: "#d93baf",
				blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "Processes" },
                    {
                        opcode: "proc_get",
                        blockType: BlockType.REPORTER,
                        text: "Get Process [id]",
                        arguments: {
                            id: { type: ArgumentType.STRING, defaultValue: "myID" },
                        }
                    },
                    {
                        opcode: "proc_list",
                        blockType: BlockType.REPORTER,
                        text: "List Processes",
                        disableMonitor:  true
                    },
                    "---",
                    {
                        opcode: "proc_setPart",
                        blockType: BlockType.COMMAND,
                        text: "Set Process [part] in [id] to [value]",
                        arguments: {
                            part: { type: ArgumentType.STRING, defaultValue: "code" },
                            id: { type: ArgumentType.STRING, defaultValue: "myID" },
                            value: { type: ArgumentType.STRING, defaultValue: "funny" },
                        }
                    },
                    {
                        opcode: "proc_getPart",
                        blockType: BlockType.REPORTER,
                        text: "Get Process [part] from [id]",
                        arguments: {
                            part: { type: ArgumentType.STRING, defaultValue: "code" },
                            id: { type: ArgumentType.STRING, defaultValue: "myID" },
                        }
                    },
                    "---",
                    {
                        opcode: "proc_setKey",
                        blockType: BlockType.COMMAND,
                        text: "Set Key [key] in [proc] to [value]",
                        arguments: {
                            key: { type: ArgumentType.STRING, defaultValue: "myKey" },
                            proc: { type: ArgumentType.STRING, defaultValue: "myID" },
                            value: { type: ArgumentType.STRING, defaultValue: "im a key fr" },
                        }
                    },
                    {
                        opcode: "proc_getKey",
                        blockType: BlockType.REPORTER,
                        text: "Get Key [key] from [proc]",
                        arguments: {
                            key: { type: ArgumentType.STRING, defaultValue: "myKey" },
                            proc: { type: ArgumentType.STRING, defaultValue: "myID" },
                        }
                    },
                    "---",
                    {
                        opcode: "proc_create_rep",
                        blockType: BlockType.REPORTER,
                        text: "Create Process with code [code] and data (optional) [data] and with an id (optional) [id] from [path]",
                        arguments: {
                            code: { type: ArgumentType.STRING, defaultValue: "~ main;print hello world!;~" },
                            data: { type: ArgumentType.STRING, defaultValue: "{}" },
                            id: { type: ArgumentType.STRING, defaultValue: "myID" },
                            path: { type: ArgumentType.STRING, defaultValue: "myFolder/myApp.cfbl" },
                        }
                    },
                    {
                        opcode: "proc_create_cmd",
                        blockType: BlockType.COMMAND,
                        text: "Create Process with code [code] and data (optional) [data] and with an id (optional) of [id] from [path]",
                        arguments: {
                            code: { type: ArgumentType.STRING, defaultValue: "~ main;print hello world!;~" },
                            data: { type: ArgumentType.STRING, defaultValue: "{}" },
                            id: { type: ArgumentType.STRING, defaultValue: "myID" },
                            path: { type: ArgumentType.STRING, defaultValue: "myFolder/myApp.cfbl" },
                        }
                    },
                    "---",
                    {
                        opcode: "proc_launch_rep",
                        blockType: BlockType.REPORTER,
                        text: "Launch [path] data (optional) [data] id (optional) [id]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: "silly/funny.cfbl" },
                            data: { type: ArgumentType.STRING, defaultValue: "{}" },
                            id: { type: ArgumentType.STRING, defaultValue: "myID" },
                        }
                    },
                    {
                        opcode: "proc_launch_cmd",
                        blockType: BlockType.COMMAND,
                        text: "Launch [path] data (optional) [data] id (optional) [id]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: "silly/funny.cfbl" },
                            data: { type: ArgumentType.STRING, defaultValue: "{}" },
                            id: { type: ArgumentType.STRING, defaultValue: "myID" },
                        }
                    },
                    "---",
                    {
                        opcode: "proc_clear",
                        blockType: BlockType.COMMAND,
                        text: "Clear Processes"
                    },
                ],
                menus: {
                    procPart: {
                        acceptReporters: true,
                        items: [
                            "code",
                            "data"
                        ],
                    },
                }
            }
        }
        proc_get({ id }) {
            return flf.processes[id];
        }
        proc_list() {
            return Object.keys(flf.processes);
        }

        proc_setPart({ part, id, value }) {
            const proc = flf.processes[id];
            if (proc)
                proc[part] = value;
        }
        proc_getPart({ part, id }) {
            return (flf.processes[id] ?? {})[part];
        }

        proc_setKey({ key, proc, value }) {
            proc = flf.processes[proc];
            if (!proc)
                return;
            proc.data[key] = value;
        }
        proc_getKey({ key, proc }) {
            proc = flf.processes[proc];
            if (!proc)
                return null;
            return proc.data[key];
        }

        proc_create({ code, data, id, path }) {
            if (data === "") data = null;
            if (id === "") id = null;

            try {
                data = JSON.parse(data);
            } catch {}

            if (typeof data !== "object")
                data = {};

            data = data ?? {};
            id ??= randomStr();
            
            data["path"] = path;

            flf.processes[id] = {
                "code": code,
                "data": data
            }
            return id;
        }
        proc_create_rep(args) { return this.proc_create(args) }
        proc_create_cmd(args) { this.proc_create(args) }

        proc_launch({ path, data, id }) {
            const temp = path.split(".");
            const fileType = temp.length > 1 ? temp[temp.length - 1] : "";

            if (id === "") id = null;
            id ??= randomStr();
			
			const file = getFileRaw(path, flf.fs);
			if (!file)
				return

			switch (fileType) {
				case "shortcut":
					this.proc_launch({
						path: file[0],
						data: data,
						id: id
					})
					break;
				case "cfbl":
					this.proc_create({
						code: flf.cfbl.compileScript(file[0]),
						data: data,
						id: id,
						path: path
					})
					break;
				case "fbl":
					this.proc_create({
						code: file[0],
						data: data,
						id: id,
						path: path
					})
					break;
			}
			return id;
        }
        proc_launch_rep(args) { return this.proc_launch(args) }
        proc_launch_cmd(args) { this.proc_launch(args) }

        proc_clear() {
            flf.processes = {};
        }
    }
    const ext = new FlufiOS();
    window.flf ??= {};
    flf.utils ??= {};
    flf.utils.process ??= {};
    flf.utils.process.proc_launch = ext.proc_launch;
    flf.utils.process.proc_create = ext.proc_create;
	Scratch.extensions.register(ext);
})(Scratch)