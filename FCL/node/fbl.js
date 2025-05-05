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
function randomStr(r=10){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n="";for(let t=0;t<r;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}

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
        this.operations = {
            "add": (context,target,aref,bref,a,b) => {
                if (a.get_type(context) === "num" && b.get_type(context) === "num")
                    return [`add ${target} ${aref} ${bref}`,"num"];
                return [`add ${target} emptystring ${aref} space ${bref}`,"str"];
            },
            "join": (_,target,aref,bref) => [`add ${target} emptystring ${aref} ${bref}`,"str"],
            "sub": (_,target,aref,bref) => [`sub ${target} ${aref} ${bref}`,"str"],
            "mul": (_,target,aref,bref) => [`mul ${target} ${aref} ${bref}`,"str"],
            "div": (_,target,aref,bref) => [`div ${target} ${aref} ${bref}`,"str"],
            "pow": (_,target,aref,bref) => [`pow ${target} ${aref} ${bref}`,"str"],
            "mod": (_,target,aref,bref) => [`mod ${target} ${aref} ${bref}`,"str"]
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
        ]
        this.branches = [
            "forever"
        ];
    }
}
class CompileContext extends Context {
    constructor() {
        super();
        this.text = "";
        this.functionText = "";
        this.functionDataLayers = [];

        this.scope = new Scope({
            "print": new CompiledFunc("print",(args) => `print ${args.join(" ")}`)
        });
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
        return isTypeSafe(typea,compare.name);
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
        context ??= new ParseContext();
        //console.trace(code);

        /* segment */ {
            const elements = split(code, ";", true).filter(t => t !== ";");
            if (has(code, ";") || elements.length > 1 && elements[elements.length-1] !== "()") {
                this.kind = "segment";
                this.elements = elements.map(e => new Node(e)).filter(e => !!e);
                return;
            }
        }

        /* statement */ {
            const spaceTokens = split(code, " ").filter(t => t !== " ");
            /* has a value */ {
                if (context.statements.includes(spaceTokens[0]) && spaceTokens.length > 1) {
                    this.kind = "statement";
                    this.key = spaceTokens[0];
                    this.value = new Node(spaceTokens.slice(1).join(" "));
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
            const bracketTokens = split(code, "curly");
            if (bracketTokens.length == 2 && is(bracketTokens[1], "curly") && context.branches.includes(bracketTokens[0])) {
                this.kind = "branch";
                this.key = bracketTokens[0];
                this.content = new Node(bracketTokens[1].slice(1,-1));
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
                    this.b = new Node(newTokens.pop());
                    this.type = operations[newTokens.pop()];
                    this.a = new Node(newTokens.join(""));
                    return;
                }
            }
        }

        /* execution */ {
            const bracketTokens = split(code, "bracket");
            if (bracketTokens.length > 1 && is(bracketTokens[bracketTokens.length - 1],"bracket")) {
                this.kind = "execution";
                this.args = split(bracketTokens[bracketTokens.length - 1].slice(1,-1),",").filter(t => t != ",").map(p => new Node(p, context));
                this.key = new Node(bracketTokens.slice(0,-1).join(""));
                return;
            }
        }

        /* function */ {
            const bracketTokens = split(code, "bracket");
            const spaceTokens = split(bracketTokens[0], " ").filter(t => t !== " ");
            if (bracketTokens.length == 3 && spaceTokens.length == 2) {
                if (is(bracketTokens[1], "bracket"), is(bracketTokens[2], "curly")) {
                    this.kind = "function";
                    this.params = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Parameter(p, context));
                    this.key = spaceTokens[1];
                    this.content = new Node(bracketTokens[2].slice(1,-1));
                    this.type = new Node(spaceTokens[0]);
                    return;
                }
            } else if (bracketTokens.length == 3) {
                if (is(bracketTokens[1],"bracket"), is(bracketTokens[2], "curly")) {
                    this.kind = "function";
                    this.params = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Parameter(p, context));
                    this.key = "INL§" + Math.random().toString();
                    this.content = new Node(bracketTokens[2].slice(1,-1));
                    this.type = new Node(spaceTokens[0]);
                    return;
                }
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
                }
            }
        }

        /* variable */ {
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
        if (target && !(target instanceof Target)) throw Error("no correct target");
        //console.log(this);
        

        switch (this.kind) {
            case "segment": {
                context.scope.newLayer();
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    element.compile(context);
                }
                context.scope.exitLayer();
                break;
            }
            case "function": {
                const type = this.type.getValue(context);
                if (!type || !(type instanceof Type)) throw Error("invalid type " + this.type.code)
                const saveText = context.text;
                context.text = `~ ${this.key}\n`;
                context.functionDataLayers.push({"key":this.kind,"return_type":type,"branch":[]});
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
            case "execution": {
                const func = this.key.getValue(context);
                const argKeys = this.args.map(a => a.compileKey(context));
                const args = this.args.map((a,i) => a.compile(context, new Target(argKeys[i])));

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
                            const value = this.value.getValue();
                            if (topLayer && !isTypeSafe(value.type,topLayer.return_type)) {
                                throw Error(`attempt to return a value of type ${new Type(value.type).stringify()} when the function should return ${topLayer.return_type.stringify()}`)
                            }
                            context.text += `ret ${key}\n`;
                        } else {
                            console.log(topLayer);
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

            case "string":
                context.text += `set str ${target.id} ${fblExcape(this.value)}\n`;
                return;
            case "number":
                context.text += `set num ${target.id} ${this.value}\n`;
                return

            default:
                throw Error("cannot compile node " + this.kind)
        }
    }

    compileKey(context) {
        return randomStr();
    }

    getValue(context) {
        switch (this.kind) {
            case "variable":
                return context.scope.get(this.key);
            case "function":
                this.compile(context);
                return new DefinedFunc(this.key);
            case "string":
                return new StringValue(this.value);
            case "number":
                return new NumberValue(this.value);
            case "type":
                return new Type(this.name);
            default:
                throw Error("cannot get value of " + this.kind);
        }
    }
}
class Parameter {
    constructor(code, context) {
        this.code = code.trim();
        this.parse(this.code, context);
    }

    parse(code, context) {
        this.type = "any";
        this.default = new Node("undefined");
        const assignmentTokens = split(code, "=");
        if (assignmentTokens[1] === "=")
            this.default = new Node(assignmentTokens[2], context);
        
        const spaceTokens = split(assignmentTokens[0], " ").filter(t => t !== " ");
        if (spaceTokens.length == 2) {
            this.name = spaceTokens[1];
            this.type = spaceTokens[0];
            return;
        } else if (spaceTokens.length == 1) {
            this.name = spaceTokens[1];
            return;
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

class StringValue {
    constructor() {
        this.type  = "str";
    }
    stringify() {
        return this.value;
    }
}
class NumberValue {
    constructor(value) {
        this.type = "num";
        this.value = value;
    }
    stringify() {
        return this.value.toString();
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
        this.node = new Node(code);
    }

    compile(context, target) {
        context ??= new CompileContext();
        this.node.compile(context, target);
        return context.functionText + context.text;
    }
}

code = `
num test() {
    print(void() {
        print("hi");
    }());
    return 5;
}

str main() {
    test();
    print("hi");
}
`;

const script = new Script(code);
//console.log(JSON.stringify(script, null, "    "));
console.log(script.compile());
