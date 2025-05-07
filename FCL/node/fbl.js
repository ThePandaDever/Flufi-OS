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
function fblExcape(text) {
    let current = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char == "\n") {
            current += "\\n"; i ++;
            continue;
        }

        current += char;
    }
    return current;
}

/*
let randomNum = 0
const randomStr = () => "rand" + randomNum ++;
*/

const chooseRandom = (arr) => arr[Math.round(Math.random() * arr.length - 1)]
const randomStr = () => Array(10).fill(null).map(l => chooseRandom("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")).join("")

function allocate(value) {
    const id = randomStr();
    memory[id] = value;
    return id;
}
function deallocate(id) {
    delete memory[id];
}

class Context {
    constructor() {
        this.classes = {
            "str": new Class(),
            "num": new Class(),
        };
        const areTypes = (a,b,t) => isTypeSafe(a,new Union(t)) && isTypeSafe(b,new Union(t));
        const areNums = (a,b) => areTypes(a,b,["num"]);
        this.operation_compilers = {
            "add": (_,target,aref,bref,a,b) => {
                if (areNums(a,b))
                    return [`add ${target.id} ${aref} ${bref}`,"num"];
                if (areTypes(a,b,["str","num"]))
                    return [`add ${target.id} emptystring ${aref} space ${bref}`,"str"];
            },
            "join": (_,target,aref,bref,a,b) => areTypes(a,b,["str","num"]) ? [`add ${target.id} emptystring ${aref} ${bref}`,"str"] : null,
            "sub": (_,target,aref,bref,a,b) => areNums(a,b) ? [`sub ${target.id} ${aref} ${bref}`,"str"] : null,
            "mul": (_,target,aref,bref,a,b) => areNums(a,b) ? [`mul ${target.id} ${aref} ${bref}`,"str"] : null,
            "div": (_,target,aref,bref,a,b) => areNums(a,b) ? [`div ${target.id} ${aref} ${bref}`,"str"] : null,
            "pow": (_,target,aref,bref,a,b) => areNums(a,b) ? [`pow ${target.id} ${aref} ${bref}`,"str"] : null,
            "mod": (_,target,aref,bref,a,b) => areNums(a,b) ? [`mod ${target.id} ${aref} ${bref}`,"str"] : null
        }
        this.operation_types = {
            "add": (_,a,b) => areNums(a,b) ? "num" : areTypes(a,b,["str","num"]) ? "str" : null,
            "join": (_,a,b) => "str",
            "sub": (_,a,b) => areNums(a,b) ? "num" : null,
            "mul": (_,a,b) => areNums(a,b) ? "num" : null,
            "div": (_,a,b) => areNums(a,b) ? "num" : null,
            "pow": (_,a,b) => areNums(a,b) ? "num" : null,
            "mod": (_,a,b) => areNums(a,b) ? "num" : null
        }
    }
}
class ParseContext extends Context {
    constructor() {
        super();

        this.statements = [
            "return"
        ];
        this.standalone_statements = [
            "return"
        ];
        this.branches = [
            "forever"
        ];
        this.arg_branches = [
            "if",
            "while",
            "until"
        ];
        this.functionArgLayers = [];
    }
}
class CompileContext extends Context {
    constructor() {
        super();

        this.text = "";
        this.functionText = "";
        this.functionDataLayers = [];
        this.variableGrabs = [];
        this.variableSets = [];

        this.scope = new Scope({
            "print": new CompiledFunc("print",(args) => `print ${args.join(" ")}`)
        });
    }
}

class ScanContext extends Context {
    constructor() {
        super();

        this.returns = false;
    }
}

memory = {};

class Scope {
    constructor(variables) {
        this.layers = [];
        if (variables)
            this.newLayer(variables);
    }

    newLayer(variables) {
        this.layers.push(new ScopeLayer(variables));
    }
    exitLayer() {
        const layer = this.layers.pop();
        layer.dissolve();
        return layer;
    }

    get(key) {
        const ref = this.getRef(key);
        const value = memory[ref];
        if (value)
            value.ref = ref;
        return value;
    }
    getRef(key) {
        this.layers.reverse();
        const layers = [...this.layers];
        this.layers.reverse();
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            const r = layer.getRef(key);
            if (r)
                return r;
        }
    }
    assign(key, value) {
        const ref = this.getRef(key);
        if (ref) {
            memory[ref] = value;
        } else {
            const newRef = allocate(value);
            this.assignRef(key, newRef);
            return newRef;
        }
        return ref;
    }
    assignRef(key, ref) {
        const top = this.layers[this.layers.length - 1];
        top.variables[key] = ref;
    }
    assignTop(key, value) {
        const ref = this.layers[this.layers.length-1].getRef(key);
        if (ref) {
            memory[ref] = value;
        } else {
            const newRef = allocate(value);
            this.assignRef(key, newRef);
            return newRef;
        }
        return ref;
    }
}
class ScopeLayer {
    constructor(variables) {
        variables ??= {};
        variables = Object.fromEntries(
            Object.entries(variables).map(([key, value]) => [key, allocate(value)])
        );
        this.variables = variables;
    }

    dissolve() {
        const refs = Object.values(this.variables);
        for (let i = 0; i < refs.length; i++) {
            deallocate(refs[i]);
        }
    }

    get(key) {
        return memory[this.getRef(key)];
    }
    getRef(key) {
        return this.variables[key];
    }
}

function isTypeSafe(typea,compare) {
    if (typea instanceof Type) {
        typea = typea.name;
    }
    if (compare instanceof Type) {
        compare = compare.name;
    }
    if (compare instanceof Union) {
        return compare.elements.reduce((acc,v) => acc || isTypeSafe(typea,v), false);
    }
    if (compare == "void") {
        compare = "null";
    }
    return typea === compare || compare === "any";
}

class Node {
    constructor(code, context) {
        this.code = code.trim();
        this.formattedCode = code.split("\n").map(l => l.trim()).join("\\n");
        this.kind = "unknown";
        return this.parse(this.code, context);
    }

    parse(code, context) {
        if (!context) throw Error("no context");
        //console.trace(code);

        /* segment */ {
            const elements = split(code, ";", true).filter(t => t !== ";");
            if (has(code, ";") || elements.length > 1 && elements[elements.length-1] !== "()") {
                this.kind = "segment";
                this.elements = elements.map(e => new Node(e, context)).filter(e => !!e);
                return;
            }
        }

        /* statement */ {
            const spaceTokens = split(code, " ").filter(t => t !== " ");
            /* has a value */ {
                if (context.statements.includes(spaceTokens[0]) && spaceTokens.length > 1) {
                    this.kind = "statement";
                    this.key = spaceTokens[0];
                    this.value = new Node(spaceTokens.slice(1).join(" "), context);
                    return;
                }
            }
            /* standalone */ {
                if (context.standalone_statements.includes(code)) {
                    this.kind = "statement";
                    this.key = code;
                    return;
                }
            }
        }

        /* branch */ {
            /* standalone */ {
                const bracketTokens = split(code, "curly");
                if (bracketTokens.length == 2 && is(bracketTokens[1], "curly") && context.branches.includes(bracketTokens[0])) {
                    this.kind = "branch";
                    this.key = bracketTokens[0];
                    this.content = new Node(bracketTokens[1].slice(1,-1), context);
                    return;
                }
            }
            /* args */ {
                const curlyTokens = split(code, "curly");
                const bracketTokens = split(curlyTokens[0], "bracket");
                if (curlyTokens.length == 2 && is(curlyTokens[1], "curly") && bracketTokens.length == 2 && is(bracketTokens[1], "bracket") && context.arg_branches.includes(bracketTokens[0])) {
                    this.kind = "arg_branch";
                    this.key = bracketTokens[0];
                    this.args = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Node(p, context));
                    this.content = new Node(curlyTokens[1].slice(1,-1), context);
                    return;
                }
            }
        }
        
        /* assignment */ {
            const chars = ["=","+","-","*","/","^","%"];
            const tokens = split(code,chars);
            let key = tokens.shift();
            let op = "";
            let token;
            while (chars.includes(token = tokens.shift())) op += token;
            if (token) tokens.unshift(token);
            const types = {
                "": "default",

                "+": "add",
                "++": "join",
                "-": "sub",
                "*": "mul",
                "/": "div",
                "^": "pow",
                "%": "mod"
            }
            if (Object.keys(types).map(k => k + "=").includes(op)) {
                this.kind = "assignment";
                this.key = key;
                this.type = types[op.slice(0,-1)];
                this.value = new Node(tokens.join(""), context);
                return;
            }
        }

        /* math */ {
            const ops = ["+","-","*","/","^","%"];
            const operations = {
                "+": "add",
                "++": "join",
                "-": "sub",
                "*": "mul",
                "/": "div",
                "^": "pow",
                "%": "mod"
            };
            const tokens = split(code, ops);
            const newTokens = [];
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (token == "-" && ops.includes(tokens[i - 1])) {
                    newTokens.push("-" + tokens[i + 1]);
                    i ++;
                    continue;
                } else if (ops.includes(tokens[i - 1]) && ops.includes(token)) {
                    newTokens[newTokens.length-1] += token;
                    continue;
                }
                newTokens.push(token);
            }
            if (newTokens.length > 2) {
                if (operations[newTokens[newTokens.length-2]]) {
                    this.kind = "operation";
                    this.b = new Node(newTokens.pop(), context);
                    this.type = operations[newTokens.pop()];
                    this.a = new Node(newTokens.join(""), context);
                    return;
                }
            }
        }

        /* execution */ {
            const bracketTokens = split(code, "bracket");
            if (bracketTokens.length > 1 && is(bracketTokens[bracketTokens.length - 1],"bracket")) {
                this.kind = "execution";
                this.args = split(bracketTokens[bracketTokens.length - 1].slice(1,-1),",").filter(t => t != ",").map(p => new Node(p, context));
                this.key = new Node(bracketTokens.slice(0,-1).join(""), context);
                return;
            }
        }

        /* function */ {
            const bracketTokens = split(code, "bracket");
            const spaceTokens = split(bracketTokens[0], " ").filter(t => t !== " ");
            if (bracketTokens.length == 3 && spaceTokens.length >= 2) {
                if (is(bracketTokens[1], "bracket"), is(bracketTokens[2], "curly")) {
                    this.kind = "function";
                    this.params = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Parameter(p, context));
                    this.key = spaceTokens[spaceTokens.length-1];
                    context.functionArgLayers.push(this.params);
                    this.content = new Node(bracketTokens[2].slice(1,-1), context);
                    context.functionArgLayers.pop();
                    this.type = new Node(spaceTokens.slice(0,-1).join(" "), context);
                    return;
                }
            } else if (bracketTokens.length == 3) {
                if (is(bracketTokens[1],"bracket"), is(bracketTokens[2], "curly")) {
                    this.kind = "function";
                    this.params = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Parameter(p, context));
                    this.key = "INL§" + Math.random().toString();
                    context.functionArgLayers.push(this.params);
                    this.content = new Node(bracketTokens[2].slice(1,-1), context);
                    context.functionArgLayers.pop();
                    this.type = new Node(spaceTokens[0], context);
                    return;
                }
            }
        }
        
        /* union */ {
            const tokens = split(code,"|").filter(t => t !== "|");
            if (tokens.length > 1) {
                this.kind = "union";
                this.elements = tokens.map(e => new Node(e, context));
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

        /* number */ {
            const isNumeric = (t) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);
            if (isNumeric(code)) {
                this.kind = "number";
                this.value = Number(code);
                return;
            }
        }

        /* constants */ {
            /* types */ {
                const types = [
                    "str",
                    "num",

                    "obj",
                    "arr",
                    
                    "void"
                ];
                if (types.includes(code)) {
                    this.kind = "type";
                    this.name = code;
                    return;
                }
            }
            /* values */ {
                const values = [
                    "true",
                    "false",
                    
                    "null"
                ]
                if (values.includes(code)) {
                    this.kind = "constant";
                    this.name = code;
                    return;
                }
            }
        }

        /* variable */ {
            const top = context.functionArgLayers[context.functionArgLayers.length - 1];
            if (top) {
                const data = top.reduce((_,val,i) => val.name == code ? i : _,null);
                if (data != null) {
                    this.kind = "argument";
                    this.index = data;
                    return;
                }
            }

            if (/^[A-Za-z0-9_]+$/.test(code)) {
                this.kind = "variable";
                this.key = code;
                return;
            }
        }

        /* parentheses */ {
            if (is(code, "bracket")) {
                this.parse(code.slice(1,-1),context);
                return;
            }
        }

        if (!code.trim()) {
            this.kind = "empty";
            return;
        }

        throw Error("unexpected tokens: " + this.formattedCode)
    }

    compile(context, target, flags) {
        if (!context) throw Error("no context");
        if (target && !(target instanceof Target)) throw Error("no valid target");
        //console.log(this);        

        switch (this.kind) {
            case "segment": {
                context.scope.newLayer();
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    element.compile(context);
                }
                context.scope.exitLayer();
                if (target) {
                    context.text += `set null ${target.id}\n`;
                }
                break;
            }
            case "empty": return;

            case "execution": {
                const func = this.key.getValue(context);
                const argKeys = this.args.map(a => a.compileKey(context));
                this.args.forEach((a,i) => a.compile(context, new Target(argKeys[i])));

                if (func instanceof CompiledFunc) {
                    context.text += func.compileFunc(argKeys, target) + "\n";
                } else if (func instanceof DefinedFunc) {
                    if (target)
                        context.text += `callget ${target.id} ${func.key} ${argKeys.join(" ")}\n`;
                    else
                        context.text += `call ${func.key} ${argKeys.join(" ")}\n`;
                }
                
                break;
            }
            case "statement": {
                switch (this.key) {
                    case "return": {
                        const topLayer = context.functionDataLayers[context.functionDataLayers.length-1];
                        if (this.value) {
                            const key = this.value.compileKey(context);
                            this.value.compile(context, new Target(key));
                            const value = this.value.getValue(context);
                            if (topLayer && !isTypeSafe(value.type,topLayer.return_type)) {
                                throw Error(`attempt to return a value of type ${new Type(value.type).stringify()} when the function should return ${topLayer.return_type.stringify()}`)
                            }
                            context.text += `ret ${key}\n`;
                        } else {
                            if (topLayer && !isTypeSafe(new Type("null"),topLayer.return_type)) {
                                throw Error(`attempt to return null when the function should return ${topLayer.return_type.stringify()}`)
                            }
                        }
                        break;
                    }
                    default:
                        throw Error("cannot compile statement of type " + this.key);
                }
                break;
            }
            case "operation": {
                const operation = context.operation_compilers[this.type];
                if (operation && target) {
                    const a_key = this.a.compileKey(context),
                        b_key = this.b.compileKey(context);
                    const a_type = this.a.getType(context),
                        b_type = this.b.getType(context);
                    this.a.compile(context, new Target(a_key));
                    this.b.compile(context, new Target(b_key));
                    const out = operation(context, target, a_key, b_key, a_type, b_type)
                    if (!out) {
                        throw Error(`cannot run ${this.type} operation on values of type ${a_type} and ${b_type}`)
                    }
                    if (Array.isArray(out)) {
                        context.text += out[0] + "\n";
                    }
                }
                break;
            }
            case "branch": {
                switch (this.key) {
                    case "forever": {
                        const lbl = randomStr();
                        context.text += `quitTo ${lbl}\n: ${lbl}\n`;
                        const txt = context.text;
                        context.text = "";
                        this.content.compile(context);
                        const contentTxt = context.text;
                        context.text = txt;
                        console.log(context);
                        context.text += contentTxt;
                        context.text += `quitTo ${lbl}\n`;
                        break;
                    }
                    default:
                        throw Error("cannot compile branch of type " + this.key);
                }
            }
            case "arg_branch": {
                let argKeys;
                switch (this.key) {
                    case "if": case "while": case "until":
                        argKeys = this.args.map(a => a.compileKey(context));
                        this.args.forEach((a,i) => a.compile(context, new Target(argKeys[i])));
                }
                switch (this.key) {
                    case "if": {
                        const lbl = randomStr();
                        const temp = randomStr();
                        if (this.args.length > 1)
                            context.text += `and ${temp} ${argKeys.join(" ")}\njn ${lbl} ${temp}\n`;
                        else if (this.args.length == 1)
                            context.text += `jn ${lbl} ${argKeys[0]}\n`;
                        else
                            break;
                        this.content.compile(context);
                        context.text += `: ${lbl}\n`;
                        break;
                    }
                    case "while": case "until": {
                        const lbl = randomStr();
                        const endLbl = randomStr();
                        const temp = randomStr();
                        const didntJump = this.key == "while" ? "jn" : "je";
                        const didJump = this.key == "while" ? "je" : "jn";
                        if (this.args.length > 1)
                            context.text += `: ${lbl}\nand ${temp} ${argKeys.join(" ")}\n${didntJump} ${endLbl} ${temp}\n`;
                        else if (this.args.length == 1)
                            context.text += `: ${lbl}\n${didntJump} ${endLbl} ${argKeys[0]}\n`;
                        else {
                            context.text += `: ${lbl}\n`;
                            this.content.compile(context);
                            context.text += `jp ${lbl}\n`;
                            break;
                        }
                        this.content.compile(context);
                        context.text += `${didJump} ${lbl} ${temp}\n: ${endLbl}\n`;
                        break;
                    }
                    default:
                        throw Error("cannot compile branch of type " + this.key);
                }
                break;
            }
            case "assignment": {
                let targetKey = "var_" + this.key;
                let targetType = new Node(this.key, new ParseContext()).getType(context);
                let isVariable = true;
                if (this.type == "default") {
                    this.value.compile(context, new Target(targetKey));
                    if (isVariable)
                        context.scope.assign(this.key, this.value.getValue());
                    return;
                }
                const valueKey = this.value.compileKey(context);
                const valueType = this.value.getType(context);
                this.value.compile(context, new Target(valueKey));
                switch (this.type) {
                    case "add": case "join": case "sub": case "mul": case "div": case "pow": case "mod": {
                        const operation = context.operation_compilers[this.type];
                        const out = operation(context, new Target(targetKey), targetKey, valueKey, targetType, valueType);
                        const typOperation = context.operation_types[this.type];
                        const typOut = typOperation(context, targetType, valueType);
                        if (!out || !typOut) {
                            throw Error(`cannot run ${this.type} assignment operation on values of type ${targetType.stringify()} and ${valueType.stringify()}`)
                        }
                        if (Array.isArray(out)) {
                            context.text += out[0] + "\n";
                        }
                        context.scope.assign(this.key, new TypedValue(this.value.getType(context)));
                        break;
                    }
                }
                break;
            }

            case "variable":
                context.text += target != null && !target.id.startsWith("var_") ? `dupe ${target.id} var_${this.key}\n` : "";
                break;
            case "argument":
                context.text += target != null && !target.id.startsWith("arg") ? `dupe ${target.id} arg${this.index}\n` : "";
                break;
            case "constant":
                if (target == null) break;
                context.text += {
                    "true": `set bool ${target.id} true\n`,
                    "false": `set bool ${target.id} false\n`,

                    "null": `set null ${target.id}\n`
                }[this.name]
                break;

            case "string":
                context.text += target != null ? `set str ${target.id} ${fblExcape(this.value)}\n` : "";
                return;
            case "number":
                context.text += target != null ? `set num ${target.id} ${this.value}\n` : "";
                return
            case "function": {
                const type = this.type.getValue(context);
                if (!type || !(type instanceof Type || type instanceof Union)) throw Error("invalid type " + this.type.formattedCode)
                const saveText = context.text;
                context.text = `~ ${this.key}\n`;
                context.functionDataLayers.push({"key":this.kind,"return_type":type,"branch":[],"args":this.args});
                if (type.name !== "null") {
                    const scanContext = new ScanContext();
                    this.content.scan(scanContext);
                    if (!scanContext.returns) {
                        throw Error("not all code paths return a value");
                    }
                }
                this.content.compile(context);
                context.functionDataLayers.pop();
                context.text += "~\n";
                context.functionText += context.text;
                context.text = saveText;

                const value = new DefinedFunc(this.key, type);
                context.scope.assignTop(this.key, value);

                if (target) {
                    context.text += `set str ${target.id} ${value.stringify()}\n`;
                }
                break;
            }

            default:
                throw Error("cannot compile node " + this.kind);
        }
    }

    scan(context) {
        switch (this.kind) {
            case "segment": {
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    element.scan(context);
                }
                break;
            }
            case "statement": {
                if (this.key == "return") {
                    context.returns = true;
                }
                break;
            }
        }
    }

    compileKey(context) {
        switch (this.kind) {
            case "variable":
                return "var_" + this.key;
            case "argument":
                return "arg" + this.index;
        }
        return randomStr();
    }

    getValue(context) {
        switch (this.kind) {
            case "variable": {
                if (!context.variableGrabs.includes(this.key))
                    context.variableGrabs.push(this.key);
                const val = context.scope.get(this.key);
                if (!val)
                    throw Error(`${this.key} is not defined`);
                return val;
            }
            case "argument": {
                const top = context.functionDataLayers[context.functionDataLayers.length - 1];
                console.log(top);
                break;
            }
            
            case "string":
                return new StringValue(this.value);
            case "number":
                return new NumberValue(this.value);
            case "function":
                this.compile(context);
                return new DefinedFunc(this.key);
            case "type":
                return new Type(this.name);
            case "union":
                return new Union(this.elements.map(e => e.getValue(context)));
            
            default:
                throw Error("cannot get value of " + this.kind);
        }
    }
    getType(context) {
        switch (this.kind) {
            case "execution":
                return this.key.getValue(context)?.return_type;
            case "operation":
                const temp1 = context.operation_types[this.type];
                if (temp1) {
                    return new Type(temp1(context,this.a.getType(context),this.b.getType(context)));
                }
                break;
        }
        return new Type(this.getValue(context)?.type);
    }
}
class Parameter {
    constructor(code, context) {
        this.code = code.trim();
        this.parse(this.code, context);
    }

    parse(code, context) {
        this.default = new Node("undefined", context);
        const assignmentTokens = split(code, "=");
        if (assignmentTokens[1] === "=")
            this.default = new Node(assignmentTokens[2], context);
        
        const spaceTokens = split(assignmentTokens[0], " ").filter(t => t !== " ");
        if (spaceTokens.length == 2) {
            this.name = spaceTokens[1];
            this.type = spaceTokens[0];
            return;
        } else if (spaceTokens.length == 1) {
            throw Error("param needs a type");
        }

        throw Error("unexpected tokens: " + code.split("\n").map(l => l.trim()).join("\\n"))
    }
}
class Value {
    constructor() {
        this.type = "unknown";
    }

    get_type(context) {
        return this.type;
    }
    compileTo(context, target) {

    }
    stringify() {
        return `<${this.type}>`;
    }
}
class Target {
    constructor(id,type) {
        this.id = id;
        this.type = type;
    }
}

class StringValue extends Value {
    constructor() {
        super()
        this.type  = "str";
    }
    stringify() {
        return this.value;
    }
}
class NumberValue extends Value {
    constructor(value) {
        super();
        this.type = "num";
        this.value = value;
    }
    stringify() {
        return this.value.toString();
    }
}
class TypedValue extends Value {
    constructor(type) {
        super();
        this.type = type?.name ?? type;
    }
}

class Type {
    constructor(name) {
        this.type = "type";
        name = name == "void" ? "null" : name;
        this.name = name;
    }
    stringify() {
        return `<type:${this.name}>`;
    }
}
class Union extends Value {
    constructor(elements) {
        super();

        this.type = "union";
        this.elements = elements;
    }
}

class Class {

}
class ClassValue extends Value {
    constructor(name) {
        super();
        this.type = "Class";
        this.name = name;
    }
}

class Func extends Value {
    constructor() {
        super();
        this.type = "Func";
        this.funcType = "unknown";
    }
}
class DefinedFunc extends Func {
    constructor(key, type) {
        super();
        this.funcType = "defined";
        this.key = key;
        this.return_type = type;
    }

    compile_function_ref() {
        return this.key;
    }
}
class CompiledFunc extends Func {
    constructor(key, func) {
        super();
        this.funcType = "builtin";
        this.key = key;
        this.compileFunc = func;
    }
}

class Script {
    constructor(code) {
        this.node = new Node(code, new ParseContext());
    }

    compile(context, target) {
        context ??= new CompileContext();
        this.node.compile(context, target);
        return context.functionText + context.text;
    }
}

code = `
num test(num wow) {
    return wow;
}

str crazy() {
    return "proof:";
}

void main() {
    t = "hi";
    myNum = 5;
    myNum += test(6);
    myNum ++= 5;
}
`;

const script = new Script(code);
//console.log(JSON.stringify(script, null, "    "));
console.log(script.compile());
