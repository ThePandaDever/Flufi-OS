(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;
    function _navigatePath(path, system, createDirs = false) {
        const parts = path.split('/');
        if (parts.length == 1 && parts[0] == "") { return system }
        let current = system;
        for (const part of parts) {
            if (!current[part]) {
                if (createDirs) {
                    current[part] = {};
                } else {
                    return null;
                }
            }
            current = current[part];
        }
        return current;
    }
    function isDir(path, system) {
        let dir = getFile(path, system)
        return (typeof dir === 'object' && !Array.isArray(dir))
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
    function setFileRaw(path, data, system) {
        const filePath = path.split('/');
        if (filePath.length > 1) {
            const fileName = filePath.pop();
            const dir = _navigatePath(filePath.join('/'), system, true);
            if (dir && !isDir(filePath, system)) {
                dir[fileName] = data;
            }
        } else {
            system[path] = data;
        }
        window.flf ??= {};
        flf.fs = system;
    }
    function delFile(path, system) {
        const filePath = path.split('/');
        const fileName = filePath.pop();
        const dir = _navigatePath(filePath.join("/"), system, true);
        delete dir[fileName];
        window.flf ??= {};
        flf.fs = system;
    }
    function getFile(path, system) {
        return getFileRaw(path, system)
    }
    function setFile(path, data, part, type, system) {
        let f = []
        if (!hasFile(path, system)) {
            f = ["", "[filetype]", {}]
        } else {
            f = getFile(path, system);
        }
        switch (part) {
            case "content":
                f[0] = data;
                break
            case "icon":
                f[1] = data;
                break
            case "other":
                if (type == "object") {
                    f[2] = data;
                } else if (type == "json") {
                    f[2] = JSON.parse(data);
                }
                break
        }
        setFileRaw(path, f, system)
    }
    function hasFile(path, system) {
        return getFile(path, system) != null;
    }
    function importofsflayer(layer) {
        let sys = {}
        for (let i = 0; i < layer.length / 14; i++) {
            let starti = (i) * 14;
            let path = layer[starti + 2] + "/" + layer[starti + 1] + layer[starti];
            path = path.toLowerCase();
            console.log(layer[starti])
            if (layer[starti] == ".folder") {
            } else {
                setFile(path, layer[starti + 3], "content", "object", sys);
                if (layer[starti + 10] == "") {
                    setFile(path, layer[starti + 10], "icon", "object", sys);
                } else {
                    setFile(path, "[filetype]", "icon", "object", sys);
                }
            }
        }
        window.flf ??= {};
        flf.fs = sys;
        return sys;
    }
    class FileExt {
        constructor() {
            this.system = {
                myfolder: {
                    "myfile.txt": [
                        "Hello world!",
                        "[filetype]",
                        {}
                    ]
                }
            }
            window.flf ??= {};
            flf.fs = this.system;
        }
        getInfo() {
            return {
                id: "flufifiles",
                name: "Flufi Files",
                color1: "#9b05ff",
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "System" },
                    {
                        opcode: "setSystemJson",
                        blockType: BlockType.COMMAND,
                        text: "Set System to [system] as [format] as [type]",
                        arguments: {
                            system: { type: ArgumentType.STRING, defaultValue: '{"myfolder":{"myfile.txt":["Hello world!","[filetype]",{}]}}' },
                            format: { type: ArgumentType.STRING, defaultValue: 'flufi', menu: "FileSystemFormat_menu" },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    {
                        opcode: "clearSystem",
                        blockType: BlockType.COMMAND,
                        text: "Clear System"
                    },
                    "---",
                    {
                        opcode: "getSystemJson",
                        blockType: BlockType.REPORTER,
                        text: "System as [type]",
                        arguments: {
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "General" },
                    {
                        opcode: "getFileContent",
                        blockType: BlockType.REPORTER,
                        text: "Get File [path]'s [part] as [type]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' },
                            part: { type: ArgumentType.STRING, defaultValue: 'content', menu: "Prop_menu" },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    {
                        opcode: "setFileContent",
                        blockType: BlockType.COMMAND,
                        text: "Set File [part] in [path] to [data] as [type]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' },
                            data: { type: ArgumentType.STRING, defaultValue: 'Hello world!' },
                            part: { type: ArgumentType.STRING, defaultValue: 'content', menu: "Prop_menu" },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    "---",
                    {
                        opcode: "getFile",
                        blockType: BlockType.REPORTER,
                        text: "Get File [path] as [type]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    {
                        opcode: "setFile",
                        blockType: BlockType.COMMAND,
                        text: "Set File [path] to [data] as [type]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' },
                            data: { type: ArgumentType.STRING, defaultValue: '["Hello world!","[filetype]",{}]' },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    {
                        opcode: "delFile",
                        blockType: BlockType.COMMAND,
                        text: "Delete File at [path]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' }
                        }
                    },
                    {
                        opcode: "movFile",
                        blockType: BlockType.COMMAND,
                        text: "Move File at [path] to [newpath]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' },
                            newpath: { type: ArgumentType.STRING, defaultValue: 'myfile.txt' }
                        }
                    },
                    {
                        opcode: "exiFile",
                        blockType: BlockType.BOOLEAN,
                        text: "File exists at [path]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' }
                        }
                    },
                    "---",
                    {
                        opcode: "getFolder",
                        blockType: BlockType.REPORTER,
                        text: "Get Folder [path] as [type]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder' },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    {
                        opcode: "setFolder",
                        blockType: BlockType.COMMAND,
                        text: "Set Folder [path] to [data] as [type]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder' },
                            data: { type: ArgumentType.STRING, defaultValue: '{}' },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" }
                        }
                    },
                    {
                        opcode: "delFolder",
                        blockType: BlockType.COMMAND,
                        text: "Delete Folder [path]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder' }
                        }
                    },
                    {
                        opcode: "movFolder",
                        blockType: BlockType.COMMAND,
                        text: "Move Folder [path] to [newpath]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder' },
                            newpath: { type: ArgumentType.STRING, defaultValue: 'otherfolder/myfolder' }
                        }
                    },
                    "---",
                    {
                        opcode: "getFilePathPart",
                        blockType: BlockType.REPORTER,
                        text: "[part] in [path]",
                        arguments: {
                            path: { type: ArgumentType.STRING, defaultValue: 'myfolder/myfile.txt' },
                            part: { type: ArgumentType.STRING, defaultValue: 'file type', menu: "PathPart_menu" }
                        }
                    },
                    {
                        opcode: "createPath",
                        blockType: BlockType.REPORTER,
                        text: "[folder]/[name].[type]",
                        arguments: {
                            folder: { type: ArgumentType.STRING, defaultValue: 'myfolder' },
                            name: { type: ArgumentType.STRING, defaultValue: 'myfile' },
                            type: { type: ArgumentType.STRING, defaultValue: 'txt' }
                        }
                    }
                ],
                menus: {
                    OBJType_menu: {
                        acceptReporters: true,
                        items: [
                            'json',
                            'object'
                        ]
                    },
                    PathPart_menu: {
                        acceptReporters: true,
                        items: [
                            'file type',
                            'file name',
                            'parent folder',
                            'folder path'
                        ]
                    },
                    Prop_menu: {
                        acceptReporters: true,
                        items: [
                            'content',
                            'icon',
                            'other'
                        ]
                    },
                    FileSystemFormat_menu: {
                        acceptReporters: true,
                        items: [
                            'flufi',
                            'ofsf'
                        ]
                    }
                }
            };
        }
        getSystemJson({ type }) {
            if (type == "object") { return this.system }
            return JSON.stringify(this.system);
        }
        setSystemJson({ system, format, type }) {
            if (format == "ofsf") {
                this.system = {};
                let impsys = system;

                if (type == "json") { impsys = JSON.parse(system) }

                if (Math.round(impsys.length / 14) == impsys.length / 14) {
                    this.system = importofsflayer(impsys);
                } else {
                    console.error("invalid ofsf");
                    return;
                }
                return;
            }

            if (type == "json") { this.system = JSON.parse(system); return }
            this.system = system;
            window.flf ??= {};
            flf.fs = system;
        }
        clearSystem({ }) {
            this.system = {};
            window.flf ??= {};
            flf.fs = system;
        }
        getFileContent({ path, part, type }) {
            if (!hasFile(path, this.system)) { return "" } // if file doesnt exist, return nothing
            let f = getFile(path, this.system);
            if (typeof f == "object" && !Array.isArray(f)) { return "" } // if its a folder, return nothing
            switch (part) {
                case "content":
                    return f[0];
                case "icon":
                    return f[1];
                case "other":
                    if (type == "object") {
                        return f[2];
                    } else if (type == "json") {
                        return JSON.stringify(f[2]);
                    }
            }
            return "";
        }
        setFileContent({ path, data, part, type }) {
            setFile(path, data, part, type, this.system)
        }

        getFile({ path, type }) {
            if (!hasFile(path, this.system)) { return "" } // if file doesnt exist, return nothing
            let f = getFile(path, this.system);
            if (typeof f == "object" && !Array.isArray(f)) {
                if (type == "json") { return JSON.stringify([]) }
                return []; // if its a folder, return an empty array
            }
            if (f == "") { return "" }
            if (type == "json") { return JSON.stringify(f) }
            return f;
        }
        setFile({ path, data, type }) {
            if (type == "json") {
                try {
                    data = JSON.parse(data)
                } catch (e) { return }
            }
            setFileRaw(path, data, this.system);
        }
        delFile({ path }) {
            delFile(path, this.system);
        }
        movFile({ path, newpath }) {
            if (!hasFile(path, this.system)) { return } // if file doesnt exist, return
            let data = getFileRaw(path, this.system)
            delFile(path, this.system);
            setFileRaw(newpath, data, this.system)
        }
        exiFile({ path }) {
            return hasFile(path, this.system);
        }

        getFolder({ path, type }) {
            if (!hasFile(path, this.system)) { return "" } // if file doesnt exist, return nothing
            let f = getFile(path, this.system);
            if (typeof f == "object" && !Array.isArray(f)) {
                if (type == "json") { return JSON.stringify(f) }
                return f; // if its a folder, return the file names
            }
            return {};
        }
        setFolder({ path, data, type }) {
            let p = path.split("/");
            let fname = p.pop();
            p = p.join("/")
            let dir = _navigatePath(p, this.system);
            let f = getFile(path, this.system);
            if (typeof f == "object" && Array.isArray(f)) { return }  // if its a file, return
            if (type == "json") {
                data = JSON.parse(data);
            }
            console.log(dir)
            dir[fname] = data;
            window.flf ??= {};
            flf.fs = this.system;
        }
        delFolder({ path }) {
            let f = getFile(path, this.system);
            if (typeof f == "object" && Array.isArray(f)) { return }  // if its a file, return
            let p = path.split("/");
            let fname = p.pop();
            p = p.join("/")
            let dir = _navigatePath(p, this.system);
            delete dir[fname];
            window.flf ??= {};
            flf.fs = this.system;
        }
        movFolder({ path, newpath }) {
            let f = getFile(path, this.system);
            if (typeof f == "object" && Array.isArray(f)) { return }  // if its a file, return
            if (!hasFile(path, this.system)) { return } // if file doesnt exist, return
            let data = getFileRaw(path, this.system)
            delFile(path, this.system);
            setFileRaw(newpath, data, this.system)
        }

        getFilePathPart({ path, part }) {
            let tkns = []
            switch (part) {
                case "file type":
                    tkns = path.split(".");
                    if (tkns.length < 2) { return "" }
                    return tkns.pop();
                case "file name":
                    let t = path.split("/").pop();
                    tkns = t.split(".");
                    if (t.split(".").length < 2) { return "" }
                    tkns.pop();
                    return tkns.join(".");
                case "parent folder":
                    let s = path.split("/");
                    if (s.length < 2) { return "" }
                    return s[s.length - 2];
                case "folder path":
                    let p = path.split("/");
                    if (p.length < 2) { return "" }
                    p.pop();
                    return p.join("/");
            }
        }
        createPath({ folder, name, type }) {
            return folder + "/" + name + "." + type
        }
    }
    Scratch.extensions.register(new FileExt());
})(Scratch);