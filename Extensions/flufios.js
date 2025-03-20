(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

	class FlufiOS {
        constructor() {
            this.processes = {};
        }
		getInfo() {
			return {
				id: "flfos",
				name: "Flufi OS",
                color1: "#d93baf",
				blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "Processes" },
                    {
                        opcode: "proc_clear",
                        blockType: BlockType.COMMAND,
                        text: "Clear Processes"
                    },
                    {
                        opcode: "proc_create",
                        blockType: BlockType.COMMAND,
                        text: "Create Process with code [code] and data (optional) [data] and with an id (optional) [id] in [path]",
                        arguments: {
                            code: { type: ArgumentType.STRING, defaultValue: "~ main;print hello world!;~" },
                            data: { type: ArgumentType.STRING, defaultValue: "{}" },
                            id: { type: ArgumentType.STRING, defaultValue: "" },
                            path: { type: ArgumentType.STRING, defaultValue: "/" }
                        }
                    },
                    "---",
                ]
            }
        }
        proc_clear() {
            this.processes = {};
        }
    }
	Scratch.extensions.register(new FlufiOS());
})(Scratch)