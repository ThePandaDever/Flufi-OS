(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

	if (!Scratch.extensions.unsandboxed) throw new Error("Panel maker doesnt work in sandboxed mode.")

    Object.clone=function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object.clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object.clone(e[r]));return n}}return e};

    function getClipping(panels) {
        let current = [-9999,-9999,9999,9999];
        for (let i = 0; i < panels.length; i++) {
            const p = panels[i];
            if (p[0] > current[0]) { current[0] = p[0] }
            if (p[1] > current[1]) { current[1] = p[1] }
            if (p[2] < current[2]) { current[2] = p[2] }
            if (p[3] < current[3]) { current[3] = p[3] }
        }
        return current;
    }

	class PanelMaker {
        constructor() {
            this.currentPanel = [];
            this.clipping = [-9999,-9999,9999,9999];
            this.color = "#ffffff";
            this.direction = 90;
            this.clippingPanels = [];
        }
		getInfo() {
			return {
				id: "flfpanelMaker",
				name: "Panel Maker",
                color1: "#eb346b",
				blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "Elements" },
					{
						opcode: "panel",
						text: ["Panel at [x],[y], size [size]"],
						blockType: Scratch.BlockType.CONDITIONAL,
						branchCount: 1,
                        arguments: {
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            size: { type: ArgumentType.NUMBER, defaultValue: 1 }
                        }
					},
					{
						opcode: "clippingPanel",
						text: ["Clipping from [x1] [y1] [x2] [y2]"],
						blockType: Scratch.BlockType.CONDITIONAL,
						branchCount: 1,
                        arguments: {
                            x1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            y1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            x2: { type: ArgumentType.NUMBER, defaultValue: 10 },
                            y2: { type: ArgumentType.NUMBER, defaultValue: 10 }
                        }
					},
                    {
                        opcode: "element",
                        blockType: BlockType.COMMAND,
                        text: "Create Element [id] [data] at [x] [y]",
                        arguments: {
                            id: { type: ArgumentType.STRING, defaultValue: 'text' },
                            data: { type: ArgumentType.STRING, defaultValue: '{"text":"hello world!","size":15}' },
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    "---",
                    {
                        opcode: "set_color",
                        blockType: BlockType.COMMAND,
                        text: "Set color [color]",
                        arguments: {
                            color: { type: ArgumentType.COLOR, defaultValue: "#555555" },
                        }
                    },
                    {
                        opcode: "set_direction",
                        blockType: BlockType.COMMAND,
                        text: "Set direction [direction]",
                        arguments: {
                            direction: { type: ArgumentType.NUMBER, defaultValue: 90 },
                        }
                    },
                    {
                        opcode: "set_clipping",
                        blockType: BlockType.COMMAND,
                        text: "Set clipping box to [x1] [y1] to [x2] [y2]",
                        arguments: {
                            x1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            y1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            x2: { type: ArgumentType.NUMBER, defaultValue: 10 },
                            y2: { type: ArgumentType.NUMBER, defaultValue: 10 }
                        }
                    },
                    "---",
                    {
                        opcode: "get_color",
                        blockType: BlockType.REPORTER,
                        text: "Get color",
                        disableMonitor:  true
                    },
                    {
                        opcode: "get_direction",
                        blockType: BlockType.REPORTER,
                        text: "Get direction",
                        disableMonitor:  true
                    },
                    {
                        opcode: "get_clipping",
                        blockType: BlockType.REPORTER,
                        text: "Get clipping box as [representation]",
                        arguments: {
                            representation: { type: ArgumentType.STRING, defaultValue: "json", menu: "obj_representation" }
                        },
                        disableMonitor:  true
                    },
                    "---",
                    {
                        opcode: "elem_rect",
                        blockType: BlockType.COMMAND,
                        text: "Create Rect at [x] [y] size [w] [h] border [border]",
                        arguments: {
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            w: { type: ArgumentType.NUMBER, defaultValue: 100 },
                            h: { type: ArgumentType.NUMBER, defaultValue: 100 },
                            border: { type: ArgumentType.NUMBER, defaultValue: 10 }
                        }
                    },
                    {
                        opcode: "elem_icon",
                        blockType: BlockType.COMMAND,
                        text: "Create icon [icon] at [x] [y] size [size]",
                        arguments: {
                            icon: { type: ArgumentType.STRING, defaultValue: "c #fff square 0 0 10 10" },
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            size: { type: ArgumentType.NUMBER, defaultValue: 75 }
                        }
                    },
                    {
                        opcode: "elem_text",
                        blockType: BlockType.COMMAND,
                        text: "Create text [text] at [x] [y] size [size]",
                        arguments: {
                            text: { type: ArgumentType.STRING, defaultValue: "hello world!" },
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            size: { type: ArgumentType.NUMBER, defaultValue: 25 }
                        }
                    },
                    {
                        opcode: "elem_panel",
                        blockType: BlockType.COMMAND,
                        text: "Create panel [panel] at [x] [y] size [size]",
                        arguments: {
                            panel: { type: ArgumentType.STRING, defaultValue: "[]" },
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            size: { type: ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: "elem_clipping",
                        blockType: BlockType.COMMAND,
                        text: "Create clipping panel [x1] [y1] to [x2] [y2]",
                        arguments: {
                            x1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            y1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            x2: { type: ArgumentType.NUMBER, defaultValue: 10 },
                            y2: { type: ArgumentType.NUMBER, defaultValue: 10 }
                        }
                    },
                    {
                        opcode: "elem_clippingExit",
                        blockType: BlockType.COMMAND,
                        text: "Exit clipping panel"
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Management" },
                    {
                        opcode: "getPanel",
                        blockType: BlockType.REPORTER,
                        text: "Get Panel as [representation]",
                        arguments: {
                            representation: { type: ArgumentType.STRING, defaultValue: "json", menu: "obj_representation" }
                        }
                    },
                    {
                        opcode: "getPanelAndClear",
                        blockType: BlockType.REPORTER,
                        text: "Get Panel as [representation] and clear",
                        arguments: {
                            representation: { type: ArgumentType.STRING, defaultValue: "json", menu: "obj_representation" }
                        }
                    },
                    {
                        opcode: "clear",
                        blockType: BlockType.COMMAND,
                        text: "Clear Panel"
                    },
				],
                menus: {
                    obj_representation: {
                        acceptReporters: true,
                        items: [
                            'json',
                            'object'
                        ]
                    }
                }
			}
		}

		panel(args,util) {
            if (util.stackFrame.blockRanOnce) {
                util.stackFrame.oldPanel.push({"id":"panel","pos":[args.x,args.y],"size":args.size,"panel":this.currentPanel});
                this.currentPanel = util.stackFrame.oldPanel;
				return;
            }
            let oldPanel = Object.clone(this.currentPanel);
            this.currentPanel = [];

            util.startBranch(1, true);
            util.stackFrame.blockRanOnce = true;
			util.stackFrame.oldPanel = oldPanel;
		}
		clippingPanel(args,util) {
            if (util.stackFrame.blockRanOnce) {
				this.clippingPanels.pop();
				const c = getClipping(this.clippingPanels);
				this.clipping = c;
				this.currentPanel.push({"id":"clipping","x1":c[0],"y1":c[1],"x2":c[2],"y2":c[3]});
				return;
            }
			
			this.clippingPanels.push([args.x1,args.y1,args.x2,args.y2]);
			const c = getClipping(this.clippingPanels);
			this.clipping = c;
			this.currentPanel.push({"id":"clipping","x1":c[0],"y1":c[1],"x2":c[2],"y2":c[3]});
			
            util.startBranch(1, true);
            util.stackFrame.blockRanOnce = true;
		}
        element(args) {
            let obj = args.data;
            if (typeof obj == "string") { obj = JSON.parse(obj) }
            obj["id"] = args.id;
            obj["pos"] = [args.x,args.y];
            this.currentPanel.push(obj);
        }

        set_color({ color }) {
            this.currentPanel.push(color);
            this.color = color;
        }
        set_direction({ direction }) {
            this.currentPanel.push(direction);
            this.direction = direction;
        }
        set_clipping({ x1, y1, x2, y2 }) {
            this.currentPanel.push({"id":"clipping","x1":x1,"y1":y1,"x2":x2,"y2":y2});
            this.clipping = [x1,y1,x2,y2];
            this.clippingPanels = [[x1,y1,x2,y2]];
        }

        get_color() {
            return this.color;
        }
        get_direction() {
            return this.direction;
        }
        get_clipping({ representation }) {
            if (representation == "json") { return JSON.stringify(this.clipping) }
            return this.clipping;
        }

        elem_rect({ x, y, w, h, border }) {
            this.currentPanel.push({"id":"rect","pos":[x,y],"size":[w,h],"border":border});
        }
        elem_icon({ icon, x, y, size }) {
            this.currentPanel.push({"id":"icn","data":icon,"pos":[x,y],"size":size});
        }
        elem_text({ text, x, y, size }) {
            this.currentPanel.push({"id":"text","text":text,"pos":[x,y],"size":size});
        }
        elem_panel({ panel, x, y, size }) {
            if (typeof panel == "string") { panel = JSON.parse(panel) }
            this.currentPanel.push({"id":"panel","panel":panel,"pos":[x,y],"size":size});
        }
        elem_clipping({ x1, y1, x2, y2 }) {
            this.clippingPanels.push([x1,y1,x2,y2]);
			
            const c = getClipping(this.clippingPanels);
            this.clipping = c;
            this.currentPanel.push({"id":"clipping","x1":c[0],"y1":c[1],"x2":c[2],"y2":c[3]});
        }
        elem_clippingExit() {
            this.clippingPanels.pop();
			
            const c = getClipping(this.clippingPanels);
            this.clipping = c;
            this.currentPanel.push({"id":"clipping","x1":c[0],"y1":c[1],"x2":c[2],"y2":c[3]});
        }

        getPanel({ representation }) {
            if (representation == "json") { return JSON.stringify(this.currentPanel) }
            let temp = Object.clone(this.currentPanel);
            return temp;
        }
        getPanelAndClear({ representation }) {
            let temp = Object.clone(this.currentPanel);
            this.currentPanel = [];
            if (representation == "json") { return JSON.stringify(temp) }
            return temp;
        }
        clear() {
            this.currentPanel = [];
            this.clipping = [-9999,-9999,9999,9999];
            this.color = "#ffffff";
            this.direction = 90;
            this.clippingPanels = [];
        }
	}

	Scratch.extensions.register(new PanelMaker());
})(Scratch);