(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

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
        }
    }
    Scratch.extensions.register(new FlufiFiles());
})(Scratch);