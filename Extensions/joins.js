(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

    const chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const textBlockAmt = chars.length;

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
                let i2 = 0;
                data.blocks.push({
                    opcode: "createtext" + i,
                    blockType: BlockType.REPORTER,
                    text: "Join (" + (i + 1).toString() + ")" + arr.map((item, i3) => `[arg${i3}]`).join(''),
                    arguments: arr.reduce((obj, key) => {
                        obj[`arg${i2}`] = { type: ArgumentType.STRING, defaultValue: key };
                        i2 += 1;
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
        const func = new Function("args", `return ${args.map(item => `args["arg${i}"]`).join(" + ")};`);
        JoinBlocks.prototype[methodName] = func;
    }
	Scratch.extensions.register(new JoinBlocks());
})(Scratch);