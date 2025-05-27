(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

    Object.clone=function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object.clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object.clone(e[r]));return n}}return e};

	function capCol(v) {
		if (v > 1) {
			v = 1;
		}
		if (v < 0) {
			v = 0;
		}
		return v;
	}
	
    const multColor = (c1,c2) => {
        return [
            capCol(c1[0] * c2[0]),
            capCol(c1[1] * c2[1]),
            capCol(c1[2] * c2[2])
        ]
    }
    
    function hexToFloats(hex) {
        hex = hex.replace(/^#/, "");
		if (hex.length === 3) {
	        hex = hex.split("").map(char => char + char).join("");
	    }
		const hexR = parseInt(hex.substring(0, 2), 16);
        const hexG = parseInt(hex.substring(2, 4), 16);
        const hexB = parseInt(hex.substring(4, 6), 16);
        return {
            r: hexR / 255,
            g: hexG / 255,
            b: hexB / 255
        };
    }

	class PanelMaker {
        constructor() {
            this.clear();
        }
		getInfo() {
			return {
				id: "flfpanelMaker",
				name: "Panel Maker v2",
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
						opcode: "tintLayerRGB",
						text: ["Tint Layer [r] [g] [b]"],
						blockType: Scratch.BlockType.CONDITIONAL,
						branchCount: 1,
                        arguments: {
                            r: { type: ArgumentType.NUMBER, defaultValue: 1 },
                            g: { type: ArgumentType.NUMBER, defaultValue: 1 },
                            b: { type: ArgumentType.NUMBER, defaultValue: 1 }
                        }
					},
					{
						opcode: "tintLayerHEX",
						text: ["Tint Layer [hex]"],
						blockType: Scratch.BlockType.CONDITIONAL,
						branchCount: 1,
                        arguments: {
                            hex: { type: ArgumentType.COLOR, defaultValue: "#ff0000" }
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
						opcode: "lineSegment",
						text: ["Line Segment width: [w]"],
						blockType: Scratch.BlockType.CONDITIONAL,
						branchCount: 1,
                        arguments: {
                            w: { type: ArgumentType.NUMBER, defaultValue: 10 },
                        }
					},
					{
						opcode: "lineSegmentPoint",
						text: "Line Point at [x] [y]",
						blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        }
					},
					{
						opcode: "lineSegmentStart",
						text: "Start Line Segment width: [w]",
						blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            w: { type: ArgumentType.NUMBER, defaultValue: 10 },
                        }
					},
					{
						opcode: "lineSegmentEnd",
						text: "End Line Segment",
						blockType: Scratch.BlockType.COMMAND
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
                        opcode: "set_transparency",
                        blockType: BlockType.COMMAND,
                        text: "Set transparency [transparency]",
                        arguments: {
                            transparency: { type: ArgumentType.NUMBER, defaultValue: 50 },
                        }
                    },
                    {
                        opcode: "set_blending",
                        blockType: BlockType.COMMAND,
                        text: "Set blending [blending]",
                        arguments: {
                            blending: { type: ArgumentType.STRING, defaultValue: "default", menu: 'blendTypes' },
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
                        opcode: "elem_centext",
                        blockType: BlockType.COMMAND,
                        text: "Create centered text [text] at [x] [y] size [size]",
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
                    {
                        opcode: "elem_tintLayerRGB",
                        blockType: BlockType.COMMAND,
                        text: "Tint Layer [r] [g] [b]",
                        arguments: {
                            r: { type: ArgumentType.NUMBER, defaultValue: 1 },
                            g: { type: ArgumentType.NUMBER, defaultValue: 1 },
                            b: { type: ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: "elem_tintLayerHEX",
                        blockType: BlockType.COMMAND,
                        text: "Tint Layer [hex]",
                        arguments: {
                            hex: { type: ArgumentType.COLOR, defaultValue: "#ff0000" }
                        }
                    },
                    {
                        opcode: "elem_tintLayerExit",
                        blockType: BlockType.COMMAND,
                        text: "Exit Tint Layer"
                    },
                    {
                        opcode: "elem_showBox",
                        blockType: BlockType.COMMAND,
                        text: "Box from [x1] [y1] to [x2] [y2]",
                        arguments: {
                            x1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            y1: { type: ArgumentType.NUMBER, defaultValue: -10 },
                            x2: { type: ArgumentType.NUMBER, defaultValue: 10 },
                            y2: { type: ArgumentType.NUMBER, defaultValue: 10 }
                        }
                    },
                    {
                        opcode: "elem_image",
                        blockType: BlockType.COMMAND,
                        text: "Create image [url] at [x] [y] size [size] stretch [stretchx] [stretchy]",
                        arguments: {
                            url: { type: ArgumentType.STRING, defaultValue: "https://example.com/image.png" },
                            x: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            size: { type: ArgumentType.NUMBER, defaultValue: 100 },
                            stretchx: { type: ArgumentType.NUMBER, defaultValue: 100 },
                            stretchy: { type: ArgumentType.NUMBER, defaultValue: 100 }
                        }
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
                    {
                        opcode: "setPanel",
                        blockType: BlockType.COMMAND,
                        text: "Set Panel [data]",
                        arguments: {
                            data: { type: ArgumentType.STRING, defaultValue: "[]" }
                        }
                    },
                    "---",
                    {
                        opcode: "multColor",
                        blockType: BlockType.REPORTER,
                        text: "Multiply [hex] with [rgb]",
                        arguments: {
                            hex: { type: ArgumentType.COLOR, defaultValue: "#ff0000" },
                            rgb: { type: ArgumentType.STRING, defaultValue: "[1,1,1]" },
                        }
                    },
                    {
                        opcode: "colorToHex",
                        blockType: BlockType.REPORTER,
                        text: "Convert [color] to Hex",
                        arguments: {
                            color: { type: ArgumentType.STRING, defaultValue: "[1,1,1]" },
                        }
                    }
				],
                menus: {
                    obj_representation: {
                        acceptReporters: true,
                        items: [
                            'json',
                            'object'
                        ]
                    },
                    blendTypes: {
                        acceptReporters: true,
                        items: [
                            { text: "default", value: "default" },
                            { text: "additive", value: "additive" },
                            { text: "subtract", value: "subtract" },
                            { text: "multiply", value: "multiply" },
                            { text: "invert", value: "invert" },
                        ],
                    },
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
        tintLayerRGB({ r, g, b },util) {
            if (util.stackFrame.blockRanOnce) {
                this.currentPanel.push({"id":"tint_exit"});
                return;
            }

			this.currentPanel.push({"id":"tint_layer",r,g,b});

            util.startBranch(1, true);
            util.stackFrame.blockRanOnce = true;
        }
        tintLayerHEX(args,util) {
            if (util.stackFrame.blockRanOnce) {
                this.currentPanel.push({"id":"tint_exit"});
                return;
            }

            const c = hexToFloats(args.hex);
			this.currentPanel.push({"id":"tint_layer","r":c[0],"g":c[1],"b":c[2]});

            util.startBranch(1, true);
            util.stackFrame.blockRanOnce = true;
        }
		clippingPanel({ x1, y1, x2, y2 },util) {
            if (util.stackFrame.blockRanOnce) {
				this.currentPanel.push({"id":"clipping_exit"});
				return;
            }
            
			this.currentPanel.push({"id":"clipping_layer",x1,y1,x2,y2});
			
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
        
		lineSegment(args,util) {
            if (util.stackFrame.blockRanOnce) {
			    this.currentPanel.push([args.w,...this.lineSegmentPoints]);
				return;
            }
			
            this.lineSegmentPoints = [];
			
            util.startBranch(1, true);
            util.stackFrame.blockRanOnce = true;
		}
        lineSegmentPoint({ x, y }) {
            this.lineSegmentPoints.push(...[x,y]);
        }
        lineSegmentStart(args) {
            this.lineSegmentPoints = [];
            this.lineW = Number(args.w);
        }
        lineSegmentEnd() {
            this.currentPanel.push([this.lineW,...this.lineSegmentPoints]);
        }

        set_color({ color }) {
            this.currentPanel.push(color);
            this.color = color;
        }
        set_transparency({ transparency }) {
            this.currentPanel.push({"id":"transparency","value":transparency});
        }
        set_blending({ blending }) {
            this.currentPanel.push({"id":"blending","value":blending});
        }
        set_direction({ direction }) {
            this.currentPanel.push(direction);
            this.direction = direction;
        }

        get_color() {
            return this.color;
        }
        get_direction() {
            return this.direction;
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
        elem_centext({ text, x, y, size }) {
            this.currentPanel.push({"id":"text","text":text,"pos":[x - (text.length * .5 * size),y],"size":size});
        }
        elem_panel({ panel, x, y, size }) {
            if (typeof panel == "string") { panel = JSON.parse(panel) }
            this.currentPanel.push({"id":"panel","panel":panel,"pos":[x,y],"size":size});
        }
        elem_clipping({ x1, y1, x2, y2 }) {
            this.currentPanel.push({"id":"clipping_layer",x1,y1,x2,y2});
        }
        elem_clippingExit() {
            this.currentPanel.push({"id":"clipping_exit"});
        }
        elem_tintLayerRGB({ r, g, b }) {
            this.currentPanel.push({"id":"tint_layer",r,g,b});
        }
        elem_tintLayerHEX({ hex }) {
            const c = hexToFloats(hex);
            this.currentPanel.push({"id":"tint_layer","r":c[0],"g":c[1],"b":c[2]});
        }
        elem_tintLayerExit() {
            this.currentPanel.push({"id":"tint_exit"});
        }
        elem_showBox({ x1, y1, x2, y2 }) {
			const verts = [[x1,y1],[x2,y1],[x2,y2],[x1,y2],[x1,y1]];
			let data = [1];
			for (let i = 0; i < verts.length; i++) {
				data.push(verts[i][0]);
				data.push(verts[i][1]);
			}
			this.currentPanel.push("#ffffff")
            this.currentPanel.push(data);
        }
        elem_image({ url, x, y, size, stretchx, stretchy }) {
            this.currentPanel.push({
                id: "image",
                url: url,
                pos: [x, y],
                size: size,
                stretchx: stretchx,
                stretchy: stretchy
            });
        }

        getPanel({ representation }) {
            if (representation == "json") { return JSON.stringify(this.currentPanel) }
            let temp = Object.clone(this.currentPanel);
            return temp;
        }
        getPanelAndClear({ representation }) {
            let temp = this.currentPanel;
            if (representation == "json") { 
                this.clear();
                return JSON.stringify(temp);
            }
            temp = Object.clone(temp);
            this.clear();
            return temp;
        }
        clear() {
            this.currentPanel = [];
            this.clipping = [-9999,-9999,9999,9999];
            this.color = "#ffffff";
            this.direction = 90;
            this.lineSegmentPoints = [];
        }
        setPanel({ data }) {
            if (typeof data == "string") { data = JSON.parse(data) }
            this.currentPanel = data;
        }

        multColor({ hex, rgb }) {
            const c1 = hexToFloats(hex);
            if (typeof rgb == "string") rgb = JSON.parse(rgb);
            return multColor([c1.r,c1.g,c1.b],rgb);
        }
        colorToHex({ color }) {
            if (typeof color == "string") color = JSON.parse(color);
            color[0] = Math.round(color[0] * 255);
            color[1] = Math.round(color[1] * 255);
            color[2] = Math.round(color[2] * 255);
            return "#" + color[0].toString(16).padStart(2, '0') + color[1].toString(16).padStart(2, '0') + color[2].toString(16).padStart(2, '0');
        }
	}

	Scratch.extensions.register(new PanelMaker());
})(Scratch);