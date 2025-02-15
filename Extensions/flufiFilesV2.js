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
                    current[part] = [{}, "[filetype]", {}];
                } else {
                    return null;
                }
            }
            current = current[part][0]; // Access the content part of the folder
        }
        return current;
    }
    function isDir(path, system) {
        let dir = getFile(path, system)
        return dir.split(".").pop() === "folder"
    }
    function getFileRaw(path, system) {
        return _navigatePath(path, system, false);
    }
    function setFileRaw(path, data, system) {
        const dir = _navigatePath(path, system, true);
        if (path.split(".").pop() === "folder") {
            const parts = path.split('/');
            const fileName = parts.pop();
            dir[0][fileName] = data;
        }
    }

    function delFile(path, system) {
        const parts = path.split('/');
        const fileName = parts.pop();
        const dir = _navigatePath(parts.join('/'), system, false);
        if (dir && dir[fileName]) {
            delete dir[fileName];
        }
    }

    function getFile(path, system) {
        return getFileRaw(path, system);
    }

    function setFile(path, data, part, type, system) {
        let file = getFile(path, system);
        if (!file) {
            file = ["", "[filetype]", {}];
        }
        switch (part) {
            case "content":
                file[0] = data;
                break;
            case "icon":
                file[1] = data;
                break;
            case "other":
                if (type === "object") {
                    file[2] = data;
                } else if (type === "json") {
                    file[2] = JSON.parse(data);
                }
                break;
        }
        setFileRaw(path, file, system);
    }

    function hasFile(path, system) {
        return getFile(path, system) !== null;
    }

    class FlufiFiles {
        constructor() {
            this.system = {
                "myfolder.folder": [{
                    "myfile.txt": [
                        "Hello world!",
                        "[filetype]",
                        {}
                    ]
                },"[filetype]",{}]
            }
        }
        getInfo() {
            return {
                id: "flufifiles2",
                name: "Flufi Files V2",
                color1: "#9b05ff",
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "System" },
                    {
                        opcode: "setSystem",
                        blockType: BlockType.COMMAND,
                        text: "Set System to [system] as [format]",
                        arguments: {
                            system: { type: ArgumentType.STRING, defaultValue: '{"myfolder":{"myfile.txt":["Hello world!","[filetype]",{}]}}' },
                            format: { type: ArgumentType.STRING, defaultValue: 'flufi', menu: "FileSystemFormat_menu" }
                        }
                    },
                    {
                        opcode: "clearSystem",
                        blockType: BlockType.COMMAND,
                        text: "Clear System"
                    },
                    "---",
                    {
                        opcode: "getSystem",
                        blockType: BlockType.REPORTER,
                        text: "System as [format] as [type]",
                        arguments: {
                            format: { type: ArgumentType.STRING, defaultValue: 'flufi', menu: "FileSystemFormat_menu" },
                            type: { type: ArgumentType.STRING, defaultValue: 'json', menu: "OBJType_menu" },
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
            }
        }

        setSystem({ system, format }) {
            if (typeof system == "string") {
                try {
                    this.system = JSON.parse(system);
                } catch {
                    console.error("system data is not valid JSON");
                }
            }

            switch(format) {
                case "flufi":
                    this.system = system;
                    break;
                case "ofsf":
                    console.error("ofsf not implemented yet :(");
                    break;
            }
        }
        clearSystem() {
            this.system = {};
        }
        getSystem({ format, type }) {
            let data;
            switch(format) {
                case "flufi":
                    data = this.system;
                    break
                case "ofsf":
                    console.error("ofsf not implemented yet :(");
                    data = [];
                    break
            }
            if (type == "json") {
                data = JSON.stringify(data);
            }
            return data;
        }

        getFileContent({ path, part, type }) {
            let data = getFile(path, this.system);
            if (data) {
                switch(part) {
                    case "content":
                        data = data[0];
                        break;
                    case "icon":
                        data = data[1];
                        break;
                    case "other":
                        if (type === "object") {
                            data = data[2];
                        } else if (type === "json") {
                            data = JSON.stringify(data[2]);
                        }
                        break;
                }
            }
            return data;
        }
    }
    Scratch.extensions.register(new FlufiFiles());
})(Scratch);