(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

    const textBlockAmt = 26;
    const chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    
	class JoinBlocks {
		getInfo() {
			let data = {
				id: "flfjoinblocks",
				name: "Join Blocks",
                color1: "#eb346b",
				blocks: []
			}
            for (let i = 0; i < textBlockAmt; i++) {
                const arr = chars.slice(0,i+1);
                data.blocks.push({
                    opcode: "createtext" + i,
                    blockType: BlockType.REPORTER,
                    text: "Join (" + (i + 1).toString() + ")" + arr.map(item => `[${item}]`).join(''),
                    arguments: arr.reduce((obj, key) => {
                        obj[key] = { type: ArgumentType.STRING, defaultValue: key };
                        return obj;
                    }, {})
                })
            }
            return data;
		}
	}

    for (let i = 0; i < textBlockAmt; i++) {
        const args = chars.slice(0, i + 1);
        const methodName = `createtext${i}`;
        const func = new Function("args", `return ${args.map(item => `args["${item}"]`).join(" + ")};`);
        JoinBlocks.prototype[methodName] = func;
    }
	Scratch.extensions.register(new JoinBlocks());
})(Scratch);