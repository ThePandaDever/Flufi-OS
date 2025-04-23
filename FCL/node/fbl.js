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
    constructor(isParse) {
        this.classes = {
            "str": new Class(),
            "num": new Class(),
        };
        this.scope = new Scope({
            "str": new ClassValue("str"),
            "num": new ClassValue("num"),
        });
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

        if (!isParse) {
            this.functions = [];
            this.function_names = [];
            this.compile_functions = {
                "print": (argKeys) => `print ${argKeys.join(" ")}`
            }
            this.text = "";
            this.segment_layers = [];
        }
    }
}
class ParseContext extends Context {
    constructor() {
        super(true);

        this.statements = [
            "return"
        ];
        this.branches = [
            "forever"
        ];
    }
}

memory = {};

class Scope {
    constructor(variables) {
        variables ??= {};
        this.layers = [];
        this.code = "";
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
        console.log(key);
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
    return typea === compare || compare === "any";
}

class Node {
    constructor(code, context) {
        this.code = code.trim();
        this.formattedCode = code.split("\n").map(l => l.trim()).join("\\n");
        this.kind = "unknown";
        this.parse(this.code, context);
    }

    parse(code, context) {
        context ??= new ParseContext();
        //console.trace(code);

        /* segment */ {
            const elements = split(code, ";", true).filter(t => t !== ";");
            if (has(code, ";") || elements.length > 1) {
                this.kind = "segment";
                this.elements = elements.map(e => new Node(e));
                return;
            }
        }

        /* statement */ {
            const spaceTokens = split(code, " ").filter(t => t !== " ");
            if (context.statements.includes(spaceTokens[0]) && spaceTokens.length > 1) {
                this.kind = "statement";
                this.key = spaceTokens[0];
                this.value = new Node(spaceTokens.slice(1).join(" "));
                return;
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
                    this.type = spaceTokens[0];
                    return;
                }
            } else if (bracketTokens.length == 3) {
                if (is(bracketTokens[1],"bracket"), is(bracketTokens[2], "curly")) {
                    this.kind = "function";
                    this.params = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Parameter(p, context));
                    this.key = "INL§" + Math.random().toString();
                    this.content = new Node(bracketTokens[2].slice(1,-1));
                    this.type = spaceTokens[0];
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

        throw Error("unexpected tokens: " + this.formattedCode)
    }

    compile(context, target) {
        context ??= new Context();
        context.scope.newLayer();
        this.compile_early(context, target);
        for (let i = 0; i < context.functions.length; i++) {
            const element = context.functions[i];
            element.compile_function(context);
        }
        this.compile_main(context, target);
        context.scope.exitLayer();
        return context.text;
    }
    compile_early(context) {
        switch (this.kind) {
            case "segment": {
                context.segment_layers.push({"funcs":[]});
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    element.compile_early(context);
                }
                this.layer = context.segment_layers.pop();
                return;
            }

            case "execution": {
                this.key.compile_early(context);
                this.args.forEach(a => a.compile_early(context));
                return;
            }
            case "statement": {
                this.value.compile_early(context);
                break;
            }
            case "branch": {
                this.content.compile_early(context);
                return;
            }
            case "operation": {
                this.a.compile_early(context);
                this.b.compile_early(context);
            }

            case "variable": return

            case "function": {
                context.functions.push(this);
                context.function_names.push(this.name);
                this.content.compile_early(context);
                return;
            }
            case "string": return
            case "number": return

            default:
                throw Error("cannot compile (early) of node kind " + this.kind);
        }
    }

    compile_main(context, target) {
        let hasValue = false;
        switch (this.kind) {
            case "segment": {
                context.scope.newLayer();
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    element.compile_main(context);
                }
                context.scope.exitLayer();
                break;
            }

            case "execution": {
                const keys = new Array(this.args.length).fill(null).map((_,i) => this.args[i].compile_ref(context))
                this.args.forEach((a,i) => a.compile_main(context, keys[i]));
                if (this.key.kind == "variable" && Object.keys(context.compile_functions).includes(this.key.key)) {
                    const out = context.compile_functions[this.key.key](keys, context);
                    if (Array.isArray(out))
                        hasValue = out[1],
                        context.text += out[0] + "\n";
                    else
                        context.text += out + "\n";
                    break;
                }
                const ref = this.key.compile_function_ref(context)
                if (!ref)
                    throw Error("attempt to call non function: " + this.formattedCode)
                if (target) {
                    context.text += `callget ${target} ${ref} ${keys.join(" ")}\n`;
                    hasValue = true;
                } else {
                    context.text += `call ${ref} ${keys.join(" ")}\n`
                }
                break;
            }
            case "statement": {
                const valueKey = this.value.compile_ref(context);
                this.value.compile_main(context, valueKey);
                switch (this.key) {
                    case "return":
                        context.text += `ret ${valueKey}\n`;
                        break;
                    default:
                        throw Error("couldnt compile statement " + this.key);
                }
                break;
            }
            case "branch": {
                const compileContent = () => this.content.compile_main(context);

                switch (this.key) {
                    case "forever": {
                        const label = randomStr();
                        context.text += ": " + label + "\n";
                        compileContent();
                        context.text += "quitTo " + label + "\n";
                        break;
                    }
                    default:
                        throw Error("cannot compile branch of type " + this.key)
                }
            }
            case "operation": {
                const a = randomStr(),
                    b = randomStr();
                this.a.compile_main(context, a);
                this.b.compile_main(context, b);
                target ??= "NOPLACE:" + randomStr();
                if (context.operations[this.type])
                    context.text += context.operations[this.type](context,target,a,b,this.a,this.b)[0] + "\n";
                else
                    throw Error("couldnt compile operation of type " + this.type);
            }

            case "variable": return;

            case "function":
                context.scope.assignTop(this.key, new DefinedFunc(this.key));
                if (target)
                    context.text += `set string ${target} func`;
                hasValue = true;
                break;
            case "string":
                context.text += `set str ${target} ${fblExcape(this.value)}\n`;
                hasValue = true;
                break;
            case "number":
                context.text += `set num ${target} ${this.value}\n`;
                hasValue = true;
                break;

            default:
                throw Error("cannot compile (main) of node kind " + this.kind);
        }
        if (!hasValue && target) {
            context.text += `set undefined ${target}\n`;
        }
    }

    compile_ref(context) {
        switch (this.kind) {
            case "variable":
                return "var_" + this.key;
        }
        return randomStr();
    }

    compile_function(context) {
        context.text += `~ ${this.key}\n`;
        this.content.compile_main(context);
        context.text += `~\n`;
    }

    compile_function_ref(context) {
        switch (this.kind) {
            case "function":
                return this.key;
            case "variable":
                return context.scope.get(this.key)?.compile_function_ref(context);
            default:
                throw Error("couldnt compile (function ref) of node kind " + this.kind);
        }
    }
    
    get_type(context) {
        switch (this.kind) {
            case "operation":
                return context.operations[this.type](context,"target","a","b",this.a,this.b)[1];

            case "function":
                return "Func";
            case "string":
                return "str";
            case "number":
                return "num";
        }
        return "any";
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
    constructor(key) {
        super();
        this.funcType = "defined";
        this.key = key;
    }

    compile_function_ref() {
        return this.key;
    }
}

code = `
void main() {
    print("a" + 3 + -3 + "sad");
}
`;

const script = new Node(code);
//console.log(JSON.stringify(script, null, "    "));
console.log(script.compile());
