(function(Scratch) {
    "use strict";
    const { BlockType, ArgumentType } = Scratch;

    if (!Scratch.extensions.unsandboxed) throw new Error("Panel doesnt work in sandboxed mode.")

	let position = [0,0];

    function line(util, points, width) {
		const target = util.thread.target;
		vm.runtime.ext_pen._setPenSizeTo(width, target);
		vm.runtime.ext_pen._setPenColorToColor(0x000000, target);
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
			if (typeof point === "number") {
				vm.runtime.ext_pen._setPenSizeTo(point, target);
				vm.runtime.ext_pen._penDown(target);
				continue
			}
            target.setXY(point[0], point[1]);
			position = point;
        }
	    vm.runtime.ext_pen._penUp(target);
    }

	function tri(util, x1, y1, x2, y2, x3, y3, width) {
		const sqr = (v) => v * v;
		
		let tri2 = Math.sqrt(sqr(x2-y2) + sqr(x3-y3));
		let tri3 = Math.sqrt(sqr(x1-y1) + sqr(x3-y3));
		let tri4 = Math.sqrt(sqr(x1-y1) + sqr(x2-y2));
		let tri1 = (tri2 + tri3 + tri4) / 2;
		let tri0 = 2 * Math.sqrt(((tri1 - tri2) * ((tri1 - tri3) * (tri1 - tri4))) / tri1);
		tri1 += tri1;
		const points = [
			[((tri2 * x1) + (tri3 * x2) + (tri4 * x3)) / tri1, ((tri2 * y1) + (tri3 * y2) + (tri4 * y3)) / tri1],
			tri0
		];
		position = points[0];
		if (tri0 > 0) {
			if (tri3 < tri2 || tri4 < tri2) {
				if (tri4 < tri3) {
					tri1 = position[0] - x3;
					tri2 = position[1] - y3;
				} else {
					tri1 = position[0] - x2;
					tri2 = position[1] - y2;
				}
			} else {
				tri1 = position[0] - x1;
				tri2 = position[1] - y1;
			}
			tri1 = Math.sqrt(sqr(tri1) + sqr(tri2)) / (tri0 / 2);
			let tri8 = ((tri1 * width) / (tri1 - 1)) + .25;
			tri1 = 0.5 - (0.5 / tri1);
			tri2 = (position[0] - x1) / tri0;
			tri3 = (position[1] - y1) / tri0;
			tri4 = (position[0] - x2) / tri0;
			let tri5 = (position[1] - y2) / tri0;
			let tri6 = (position[0] - x3) / tri0;
			let tri7 = (position[1] - y3) / tri0;
			while (!(tri0 < tri8)) {
				tri0 = tri1 * tri0;
				points.push(tri0 + .5);
				points.push([x1 + tri0 * tri2, y1 + tri0 * tri3]);
				points.push([x2 + tri0 * tri4, y2 + tri0 * tri5]);
				points.push([x3 + tri0 * tri6, y3 + tri0 * tri7]);
				points.push([x1 + tri0 * tri2, y1 + tri0 * tri3]);
			}
		}
		points.push(width)
		points.push([x1,y1])
		points.push([x2,y2])
		points.push([x3,y3])
		points.push([x1,y1])
		line(util, points, 1);
	}

	function quad(util, a, b, c, d, width) {
		tri(util, a[0], a[1], b[0], b[1], c[0], c[1], width);
		tri(util, b[0], b[1], c[0], c[1], d[0], d[1], width);
	}

	function rect(util, pos, size, width) {
		size = size.map(v => v / 2)
		quad(util,
			[pos[0] - size[0], pos[1] - size[0]],
			[pos[0] - size[0], pos[1] + size[0]],
			[pos[0] + size[0], pos[1] - size[0]],
			[pos[0] + size[0], pos[1] + size[0]],
		width);
	}

	class Panel {
        constructor() {
        }
		getInfo() {
			return {
				id: "flfpanel",
				name: "Panel",
                color1: "#eb346b",
				blocks: [
                    {
                        opcode: "funny",
                        blockType: BlockType.COMMAND,
                        text: "funny"
                    }
                ]
            }
        }
        funny(args, util) {
            rect(util, [100,0],[100,100], 1);
        }
    }
	Scratch.extensions.register(new Panel());
})(Scratch)