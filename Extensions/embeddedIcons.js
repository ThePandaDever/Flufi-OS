(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

    const textBlockAmt = 8;
    const textBlockChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    
    let encChars = [
        "\uFAF0",
        "\uFAF1",
        "\uFAF2",
        "\uFAF3",
        "\uFAF4",
        "\uFAF5",
        "\uFAF6",
        "\uFAF7",
        "\uFAF8",
        "\uFAF9",
        "\uFAFA",
        "\uFAFB",
        "\uFAFC",
        "\uFAFD",
        "\uFAFE",
        "\uFAFF",
    ]
    encChars = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","F"];

    function encodeCommand(cmd,num) {
        const stringified = String(num);
        let out = "" + encChars[cmd] + encChars[stringified.length];
        for (let index = 0; index < stringified.length; index++) {
            const c = stringified[index];
            out += encChars[Number(c)];
        }
        return out;
    }

	class EmbeddedIcons {
        constructor() {}
		getInfo() {
			let data = {
				id: "flfembeddedIcons",
				name: "Embedded Icons",
                color1: "#eb346b",
				blocks: [
                    {
                        opcode: "encode",
                        blockType: BlockType.REPORTER,
                        text: "Encode Number Command [cmd] [num]",
                        arguments: {
                            cmd: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            num: {
                                type: ArgumentType.STRING,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "decode",
                        blockType: BlockType.REPORTER,
                        text: "Decode Number Command [cmd] as [representation]",
                        arguments: {
                            cmd: {
                                type: ArgumentType.STRING,
                                defaultValue: encodeCommand(1,5)
                            },
                            representation: {
                                type: ArgumentType.STRING,
                                defaultValue: "json",
                                menu: 'obj_representation'
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
                }
			}
			data.blocks.push({ blockType: Scratch.BlockType.LABEL, text: "Joining" })
            // create Text blocks
            for (let i = 0; i < textBlockAmt; i++) {
                const arr = textBlockChars.slice(0,i+1);
                data.blocks.push({
                    opcode: "createtext" + i,
                    blockType: BlockType.REPORTER,
                    text: "Text " + arr.map(item => `[${item}]`).join(''),
                    arguments: arr.reduce((obj, key) => {
                        obj[key] = { type: ArgumentType.STRING, defaultValue: key };
                        return obj;
                    }, {})
                })
            }
            return data;
		}

        encode({ cmd, num }) {
            return encodeCommand(cmd,num);
        }

        decode({ cmd, representation }) {
            let data = {};
            let chars = cmd.split("");
            data["cmd"] = encChars.indexOf(chars.shift()) + 1;
            for (let i = 0; i < chars.length; i++) {
                const c = chars[i];
                
            }
            if (representation == "json") { data = JSON.stringify(data) }
            return data;
        }
	}
    const chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

    for (let i = 0; i < textBlockAmt; i++) {
        const args = chars.slice(0, i + 1);
        const methodName = `createtext${i}`;
        const func = new Function("args", `return ${args.map(item => `args.${item}`).join(" + ")};`);
        EmbeddedIcons.prototype[methodName] = func;
    }
	Scratch.extensions.register(new EmbeddedIcons());
})(Scratch);