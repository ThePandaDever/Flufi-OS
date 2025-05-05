
function split(text, type, useendbracket) {
    text = text ?? "";
    text = text.trim();
    const tokens = [];
    let current = "";

    let bracketDepth = 0,
        curlyDepth = 0,
        squareDepth = 0,
        arrowDepth = 0;
    let inSingle = false,
        inDouble = false,
        inTick = false;
    
    const brackets = {"bracket":["(",")"],"curly":["{","}"],"square":["[","]"],"arrow":["<",">"]}[type] ?? ["",""]; // get the bracket pairs
    const open = brackets[0],
        close = brackets[1];
    const splitChars = (typeof type == "string") ? (type.length === 1 ? type : "") : type;

    const operators = [
        "+","-","*","/","^","%",
        "."
    ]
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char == "\\") { current += char + text[i + 1]; i ++; continue; }

        if (char == "'" && !(inDouble || inTick))
            inSingle = !inSingle;
        if (char == "\"" && !(inSingle || inTick))
            inDouble = !inDouble;
        if (char == "`" && !(inSingle || inDouble))
            inTick = !inTick;

        const inQuotes = inSingle || inDouble || inTick;

        if (inQuotes) {
            current += char;
            continue;
        }

        if (char === "(")
            bracketDepth ++;
        if (char === ")")
            bracketDepth --;
        if (char === "{")
            curlyDepth ++;
        if (char === "}")
            curlyDepth --;
        if (char === "[")
            squareDepth ++;
        if (char === "]")
            squareDepth --;
        if (char === "<" && type == "arrow")
            arrowDepth ++;
        if (char === ">" && type == "arrow")
            arrowDepth --;
        
        if (char === open && 
            bracketDepth == (type == "bracket" ? 1 : 0) &&
            curlyDepth == (type == "curly" ? 1 : 0) &&
            squareDepth == (type == "square" ? 1 : 0) &&
            arrowDepth == (type == "arrow" ? 1 : 0)
        ) {
            if (current.trim())
                tokens.push(current.trim());
            if (text[i+1] == close && !tokens[tokens.length - 1])
                tokens.push("");
            else
                current = ")";
            current = open;
            continue;
        }
        if (char === close && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            current += close;
            if (current.trim())
                tokens.push(current.trim());
            current = "";
            continue;
        }

        if (useendbracket && char === "}" && !operators.includes(text[i + 1]) && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            current += char;
            tokens.push(current.trim());
            current = "";
            continue;
        }

        if (splitChars.includes(char) && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            if (current.trim())
                tokens.push(current.trim());
            tokens.push(char);
            current = "";
            continue;
        }

        current += char;
    }

    if (current.trim())
        tokens.push(current.trim());

    return tokens;
}

function has(text, type) {
    text = text.trim();
    const tokens = [];
    let current = "";

    let bracketDepth = 0,
        curlyDepth = 0,
        squareDepth = 0,
        arrowDepth = 0;
    let inSingle = false,
        inDouble = false,
        inTick = false;
    
    const brackets = {"bracket":["(",")"],"curly":["{","}"],"square":["[","]"],"arrow":["<",">"]}[type] ?? ["",""]; // get the bracket pairs
    const open = brackets[0],
        close = brackets[1];
    const splitChar = type.length === 1 ? type : "";
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char == "\\") { current += char + text[i + 1]; i ++; continue; }

        if (char == "'" && !(inDouble || inTick))
            inSingle = !inSingle;
        if (char == "\"" && !(inSingle || inTick))
            inDouble = !inDouble;
        if (char == "`" && !(inSingle || inDouble))
            inTick = !inTick;

        const inQuotes = inSingle || inDouble || inTick;

        if (inQuotes) {
            current += char;
            continue;
        }

        if (char === "(")
            bracketDepth ++;
        if (char === ")")
            bracketDepth --;
        if (char === "{")
            curlyDepth ++;
        if (char === "}")
            curlyDepth --;
        if (char === "[")
            squareDepth ++;
        if (char === "]")
            squareDepth --;
        if (char === "<" && type === "arrow")
            arrowDepth ++;
        if (char === ">" && type === "arrow")
            arrowDepth --;
        
        if (char === open && 
            bracketDepth == (type == "bracket" ? 1 : 0) &&
            curlyDepth == (type == "curly" ? 1 : 0) &&
            squareDepth == (type == "square" ? 1 : 0) &&
            arrowDepth == (type == "arrow" ? 1 : 0)
        ) {
            return true;
        }
        if (char === close && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            return true;
        }

        if (char === splitChar && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            return true;
        }

        current += char;
    }

    return false;
}

function is(text, type) {
    text = text ?? "";
    const first = text[0],
        last = text[text.length - 1];
    
    const pairs = {
        "bracket": ["(",")"],
        "curly":["{","}"],
        "square":["[","]"],
        "arrow":["<",">"],
        "single-q":["'","'"],
        "double-q":['"','"'],
        "back-q":["`","`"]
    }

    const pair = pairs[type];
    return pair ? (first === pair[0] && last === pair[1]) : false;
}

function unExcape(text) {
    let current = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char == "\\") {
            const next = text[i + 1];
            if (next === "n") {
                current += "\n";
                i ++;
                continue;
            }
            current += next; i ++;
            continue;
        }

        current += char;
    }
    return current;
}

let padLayer = "    ";

class Script {
    constructor(code) {
        this.code = code;
        const format = text => text.split("\n").map(l => l.trim()).join("\\n");
        this.formattedCode = format(code);
        this.parse(code);
    }

    parse(code) {
        const elements = split(code,";",true).filter(t => !["",";"].includes(t));
        const sections = [];
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const blockTokens = split(element,"curly");
            if (blockTokens.length == 2 && /^[A-Za-z0-9_]+$/.test(blockTokens[0]) && is(blockTokens[1],"curly")) {
                switch (blockTokens[0]) {
                    case "app":
                        sections.push(new AppSection(blockTokens[1].slice(1,-1)));
                        break;
                    case "variables":
                        sections.push(new VariablesSection(blockTokens[1].slice(1,-1)));
                        break;
                    default:
                        throw Error("unknown section name (" + ["variables","app"].join(" or ") + "): " + blockTokens[0])
                }
            } else {
                const format = text => text.split("\n").map(l => l.trim()).join("\\n");
                throw Error("invalid section syntax: " + format(element));
            }
        }
        this.sections = sections;
    }

    stringify(padding="") {
        return `Script {${this.sections.map(s => s.stringify(padding + padLayer)).map(s => "\n" + s).join("")}\n}`;
    }
}
class Section {
    constructor(code) {
        this.code = code;
        this.formattedCode = code.split("\n").map(l => l.trim()).join("\\n");
        this.parse(code);
    }

    parse(code) {
        throw Error("attempt to parse non-specified section");
    }

    stringify(padding="") {
        return `${padding}Section {}`;
    }
}

class AppSection extends Section {
    constructor(code) {
        super(code);
        this.kind = "app";
    }

    parse(code) {
        const elements = split(code,[";","\n"],true).filter(t => ![";","\n"].includes(t));
        const nodes = [];
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            nodes.push(new ScriptNode(element));
        }
        this.nodes = nodes;
    }

    stringify(padding="") {
        const formatContents = (contents) => `${contents.map(s => s.stringify(padding + padLayer)).map(s => "\n" + s).join(",")}\n${padding}`;
        return `${padding}App {${formatContents(this.nodes)}}`;
    }
}

class VariablesSection extends Section {
    constructor(code) {
        super(code);
        this.kind = "variables";
    }

    parse(code) {
        this.data = {};

        const elements = split(code,[";","\n"]).filter(t => ![";","\n"].includes(t));
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const keyPair = split(element,":").filter(t => t !== ":");
            if (keyPair.length == 2) {
                this.data[keyPair[0]] = new ValueNode(keyPair[1]);
            } else {
                const format = text => text.split("\n").map(l => l.trim()).join("\\n");
                throw Error("invalid keypair (key: value): " + format(element));
            }
        }
    }

    stringify(padding="") {
        return `${padding}Variables {${Object.entries(this.data).map(s => s[0] + ": " + s[1].stringify(padding + padLayer)).map(s => "\n" + padding + padLayer + s).join("")}\n${padding}}`;
    }
}

class ValueNode {
    constructor(code) {
        this.code = code;
        this.formattedCode = code.split("\n").map(l => l.trim()).join("\\n");
        this.isNode = true;
        this.parse(code);
    }

    parse(code) {
        /* constants */ {
            switch (code) {
                case "false":
                    this.kind = "bool";
                    this.value = false;
                    return;
                case "true":
                    this.kind = "bool";
                    this.value = true;
                    return;
                case "~":
                    this.kind = "constant";
                    this.type = "equal";
                    return;
            }
        }

        /* number */ {
            if (/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(code)) {
                this.kind = "number";
                this.value = Number(code);
                return;
            }
        }

        /* string */ {
            if (
                is(code, "single-q") ||
                is(code, "double-q") ||
                is(code, "back-q")
            ) {
                this.kind = "string";
                this.value = unExcape(code.slice(1,-1));
                return;
            }
        }

        /* app variable */ {
            if (code[0] == "@" && /^[A-Za-z0-9_]+$/.test(code.slice(1))) {
                this.kind = "variable";
                this.scope = "app";
                this.name = code.slice(1);
                return;
            }
        }

        /* script variable */ {
            if (/^[A-Za-z0-9_]+$/.test(code)) {
                this.kind = "variable";
                this.scope = "script";
                this.name = code;
                return;
            }
        }

        const format = text => text.split("\n").map(l => l.trim()).join("\\n");
        throw Error("unknown value: " + format(code));
    }

    stringify(padding) {
        const toTitleCase = text => text.split(" ").map(w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()).join(" ");
        return this.kind == "variable" ? `${toTitleCase(this.scope)} variable ${this.name}` :
            this.kind == "number" ? `Number ${this.value}` :
            this.kind == "string" ? `String ${JSON.stringify(this.value)}` :
            this.kind == "bool" ? `Bool ${this.value}` :
            `Node ${this.kind}`;
    }
}
class ScriptNode {
    constructor(code) {
        this.code = code;
        this.formattedCode = code.split("\n").map(l => l.trim()).join("\\n");
        this.parse(code);
    }

    parse(code) {
        
        /* modifiers */ {
            const tokens = split(code, ":").filter(t => t != ":");
            if (tokens.length >= 3) {
                code = tokens.shift();
                const tokens2 = split(tokens.join(":"), ",").filter(t => t != ",").map(m => split(m,":").filter(t => t != ":"));
                this.modifiers = tokens2.map(p => {
                    const format = text => text.split("\n").map(l => l.trim()).join("\\n");
                    if (p.length != 2) throw Error("invalid modifer syntax: " + format(p.join(":")));
                    p[1] = new ValueNode(p[1]);
                    return p;
                });
            }
        }
        
        /* assignments */ {
            /* var op= and var = */ {
                const ops = {
                    "+": "add",
                    "-": "sub",
                    "*": "mul",
                    "/": "div",
                    "^": "pow",
                    "%": "mod"
                };
                const tokens = split(code, ["=",...Object.keys(ops)]);
                let key = tokens.shift();
                let op = null;
                if (/^[A-Za-z0-9_@]+$/.test(key)) {
                    if (Object.keys(ops).includes(tokens[0])) {
                        op = ops[tokens.shift()];
                    }
                    if (tokens.shift() == "=") {

                        let scope = "script";
                        if (key[0] == "@") {
                            key = key.slice(1);
                            scope = "app";
                        }

                        this.kind = "assignment";
                        this.key = key;
                        this.scope = scope;
                        this.op = op;
                        this.value = new ValueNode(tokens.join(""));
                        return;
                    }
                }
            }
            /* var ++ or var -- */ {
                const tokens = split(code, ["+","-"]);
                if (tokens.length >= 3) {
                    let key = tokens.shift();
                    if (/^[A-Za-z0-9_@]+$/.test(key)) {
                        let op = "";
                        let token;
                        while (["+","-"].includes(token = tokens.shift()))
                            op += token;
                        const types = {
                            "++": "increment",
                            "--": "decrement"
                        }
                        if (types[op]) {
                            let scope = "script";
                            if (key[0] == "@") {
                                key = key.slice(1);
                                scope = "app";
                            }
                            this.kind = "operation";
                            this.type = types[op];
                            this.key = key;
                            this.scope = scope;
                            return;
                        }
                    }
                }
            }
        }
        
        /* commands */ {
            const spaceTokens = split(code, " ").filter(t => t != " ");
            if (spaceTokens[0] && /^[A-Za-z0-9_]+$/.test(spaceTokens[0])) {
                const getArg = (fallback) => new ValueNode(spaceTokens.shift() ?? fallback ?? "null");
                const getAllArgs = () => spaceTokens.map(a => new ValueNode(a));
                const getContent = (content) => split(content.slice(1,-1),[";","\n"],true).filter(t => ![";","\n"].includes(t)).map(n => new ScriptNode(n));

                const cmdName = spaceTokens.shift();
                switch(cmdName) {
                    case "loc": {
                        this.kind = "command";
                        this.name = "loc";
                        this.div = [getArg("~"), getArg("~")];
                        this.offset = [getArg("~"), getArg("~")];
                        return;
                    }

                    case "square": {
                        this.kind = "command";
                        this.name = "square";
                        this.size = [getArg("~"), getArg("~")];
                        this.rounding = getArg("0");
                        return;
                    }
                    case "text": {
                        this.kind = "command";
                        this.name = "text";
                        this.data = getArg();
                        return;
                    }

                    case "if": {
                        const content = spaceTokens.pop();
                        if (is(content, "curly")) {
                            this.kind = "command";
                            this.name = "if";
                            this.content = getContent(content);
                            this.conds = getAllArgs();
                            return;
                        } else {
                            throw Error(`${cmdName} content isnt in {}`);
                        }
                    }
                    default:
                        throw Error("unknown command: " + cmdName);
                }
            }
        }

        /* attached events */ {
            const spaceTokens = split(code, " ").filter(t => t != " ");
            if (spaceTokens[0] == "^-" && is(spaceTokens[spaceTokens.length-1], "curly")) {
                spaceTokens.shift();
                const getAllArgs = () => spaceTokens.map(a => new ValueNode(a));
                const getContent = (content) => split(content.slice(1,-1),[";","\n"],true).filter(t => ![";","\n"].includes(t)).map(n => new ScriptNode(n));
                
                this.kind = "attached_event";
                this.event = spaceTokens.shift();
                this.content = getContent(spaceTokens.join(" "));
                return;
            }
        }

        const format = text => text.split("\n").map(l => l.trim()).join("\\n");
        throw Error("unknown node: " + format(code));
    }

    stringify(padding) {
        const formatContents = (contents) => `${contents.map(s => s.stringify(padding + padLayer)).map(s => "\n" + s).join(",")}\n${padding}`;
        const toTitleCase = text => text.split(" ").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
        const formatOp = op => ({"add":"+","sub":"-","mul":"*","div":"/","pow":"^","mod":"%"})[op] ?? op;
        return padding + (
            this.kind == "command" ? (
                this.name == "if" ? `If [${this.conds.map(c => c.stringify(padding + padLayer)).join(",")}] {${formatContents(this.content)}}` :
                `Command ${this.name}`
            ) :
            this.kind == "operation" ? (
                ["increment","decrement"].includes(this.type) ? `${toTitleCase(this.type)} of ${this.scope} ${this.key}` :
                `Operation ${this.type}`
            ) :
            this.kind == "attached_event" ? `Attached Event [${this.event}] {${formatContents(this.content)}}` :
            this.kind == "assignment" ? `Assignment ${this.scope} ${this.key} ${formatOp(this.op ?? "")}= ${this.value.stringify(padding)}` :
            `Node ${this.kind}`
        ) + (!!this.modifiers ? " : " + this.modifiers.map(m => m[0] + ": " + m[1].stringify()).join(", ") : "")
    }
}

const code = `
variables {
    didClick:false
}
app {
    loc ~ 2 0 -50
    square 100 20 : c:prim
    ^- clicked {
        @didClick = true
    }
    
    text "click me :3" 10 : aligned:middle, c:text
    
    loc ~ 2
    if @didClick {
        text "wow you clicked me" 10 : aligned:middle, c:text
    }
}
`;

const script = new Script(code);
console.log(script.stringify(), JSON.stringify(script));
