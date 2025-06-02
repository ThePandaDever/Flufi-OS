
/* todo */ {
    /* sequenced arrays */ {
        /* syntax {
        Seq<num,str,Arr<num>> = Seq[5, "hi", [3,6]]
        } */
    }
}


function split(text, type, useendbracket, arrow) {
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
        if (char === "<" && (type == "arrow" || arrow))
            arrowDepth ++;
        if (char === ">" && (type == "arrow" || arrow))
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
            current += "\\n";
            continue;
        }

        current += char;
    }
    return current;
}
function removeComments(text) {
    let out = "";

    let inLineComment = false;
    let inMultiLineComment = false;
    
    let inSingle = false,
        inDouble = false,
        inTick = false;
        
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i],
            nextChar = text[i+1];
        
        if (char == "\\") { out += char + text[i+1]; i ++; continue; }

        if (char == "'" && !(inDouble || inTick))
            inSingle = !inSingle;
        if (char == "\"" && !(inSingle || inTick))
            inDouble = !inDouble;
        if (char == "`" && !(inSingle || inDouble))
            inTick = !inTick;

        const inQuotes = inSingle || inDouble || inTick;

        if (char + nextChar == "//" && !inMultiLineComment && !inQuotes)
            inLineComment = true;

        if (char + nextChar == "/*" && !inLineComment && !inQuotes)
            inMultiLineComment = true;
        if (char + nextChar == "*/" && !inLineComment && !inQuotes) {
            inMultiLineComment = false;
            i ++; continue;
        }
        
        if (char == "\n")
            inLineComment = false;

        if (!inLineComment && !inMultiLineComment)
            out += char;
    }
    return out;
}


let randomNum = 0
const randomStr = () => "rand" + randomNum ++;

//const chooseRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]
//const randomStr = () => Array(10).fill(null).map(l => chooseRandom("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")).join("")

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
        const areTypes = (a,b,t) => isTypeSafe(a,new Union(t)) && isTypeSafe(b,new Union(t));
        const areNums = (a,b) => areTypes(a,b,["num"]);

        /* math */ {
            this.operation_compilers = {
                "add": (_,target,aref,bref,atype,btype) => {
                    if (areNums(atype,btype))
                        return `add ${target.id} ${aref} ${bref}`;
                    if (areTypes(atype,btype,["str","num"]))
                        return `add ${target.id} emptystring ${aref} space ${bref}`;
                },
                "join": (_,target,aref,bref,atype,btype) => areTypes(atype,btype,["str","num"]) ? `add ${target.id} emptystring ${aref} ${bref}` : null,
                "sub": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `sub ${target.id} ${aref} ${bref}` : null,
                "mul": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `mul ${target.id} ${aref} ${bref}` : null,
                "div": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `div ${target.id} ${aref} ${bref}` : null,
                "pow": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `pow ${target.id} ${aref} ${bref}` : null,
                "mod": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `mod ${target.id} ${aref} ${bref}` : null,

                "inc": (_,target,aref,bref,atype,btype) => {
                    const temp = randomStr();
                    return `set num ${temp} 1\nadd ${target.id} ${target.id} ${temp}`;
                },

                "invert": (_,target,aref,bref,atype,btype) => `inv ${target.id} ${aref}`,
                "boolify": (_,target,aref,bref,atype,btype) => `tobool ${target.id} ${aref}`,
                "positive": (_,target,aref,bref,atype,btype) => {
                    if (!isTypeSafe(atype,new Union(["num","bool"])))
                        return null;
                    const temp = randomStr();
                    return `set num ${temp} 0\nsub ${target.id} ${temp} ${aref}`
                },
                "negative": (_,target,aref,bref,atype,btype) => {
                    if (!isTypeSafe(atype,new Union(["num","bool"])))
                        return null;
                    const temp = randomStr();
                    return `set num ${temp} 0\nsub ${target.id} ${temp} ${aref}`
                },
            };
            this.operation_types = {
                "add": (_,a,b) => areNums(a,b) ? "num" : areTypes(a,b,["str","num"]) ? "str" : null,
                "join": (_,a,b) => "str",
                "sub": (_,a,b) => areNums(a,b) ? "num" : null,
                "mul": (_,a,b) => areNums(a,b) ? "num" : null,
                "div": (_,a,b) => areNums(a,b) ? "num" : null,
                "pow": (_,a,b) => areNums(a,b) ? "num" : null,
                "mod": (_,a,b) => areNums(a,b) ? "num" : null,

                "inc": (_,a,b) => isTypeSafe(a,"num") ? "num": null,
                "dec": (_,a,b) => isTypeSafe(a,"num") ? "num": null,

                "invert": (_,a,b) => "bool",
                "boolify": (_,a,b) => "bool",
                "positive": (_,a,b) => isTypeSafe(a,new Union(["num","bool"])) ? "num" : null,
                "negative": (_,a,b) => isTypeSafe(a,new Union(["num","bool"])) ? "num" : null,
            };
            this.operation_names = {
                "+": "add",
                "++": "join",
                "-": "sub",
                "*": "mul",
                "/": "div",
                "^": "pow",
                "%": "mod"
            };
        }

        /* comparison */ {
            this.comparison_compilers = {
                "equal": (_,target,aref,bref,atype,btype) => isTypeSafe(atype,btype) ? `eql ${target.id} ${aref} ${bref}` : `set bool ${target.id} false`,
                "not_equal": (_,target,aref,bref,atype,btype) => isTypeSafe(atype,btype) ? (this.neqlSupport ? `neql ${target.id} ${aref} ${bref}` : `eql ${target.id} ${aref} ${bref}\ninv ${target.id} ${target.id}`) : `set bool ${target.id} true`,
                "greater": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `gtr ${target.id} ${aref} ${bref}` : `set bool ${target.id} false`,
                "smaller": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `sml ${target.id} ${aref} ${bref}` : `set bool ${target.id} false`,
                "greater_equal": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `sml ${target.id} ${aref} ${bref}\ninv ${target.id} ${target.id}` : `set bool ${target.id} false`,
                "smaller_equal": (_,target,aref,bref,atype,btype) => areNums(atype,btype) ? `gtr ${target.id} ${aref} ${bref}\ninv ${target.id} ${target.id}` : `set bool ${target.id} false`,
                "type_equal": (_1,target,_2,_3,atype,btype) => `set bool ${target.id} ${isTypeSafe(atype,btype)}`
            };
        }

        /* worded operations */ {
            this.worded_operation_compilers = {
                "to": (context,target,aref,bref,atype,btype) => {
                    if (areNums(atype,btype)) {
                        const temp1 = randomStr(),
                            temp2 = randomStr();
                        return `
                        dupe ${temp1} ${aref}
                        set obj ${target.id} []
                        : ${temp2}
                        arr add ${target.id} ${temp1}
                        jsi ${temp2} ${temp1} ${bref}
                        `.split("\n").map(l => l.trim()).join("\n").trim()
                    }
                }
            };
            this.worded_operation_types = {
                "to": (context,atype,btype) => areNums(atype,btype) ? new TypedValueType(new Type("Arr"), new Type("num")) : null
            };
        }

        /* logic */ {
            this.logic_names = {
                "||": "or",
                "&&": "and",
                "|||": "or_bool",
                "&&&": "and_bool"
            }
            this.logic_compilers = {
                "or": (_,target,aref,bref) => `or ${target.id} ${aref} ${bref}`,
                "and": (_,target,aref,bref) => `and ${target.id} ${aref} ${bref}`,
                "or_bool": (_,target,aref,bref) => `or ${target.id} ${aref} ${bref}\ntobool ${target.id} ${target.id}`,
                "and_bool": (_,target,aref,bref) => `and ${target.id} ${aref} ${bref}\ntobool ${target.id} ${target.id}`,
            }
            this.logic_types = {
                "or": (_,a,b) => a instanceof Type && b instanceof Type && a.name == b.name ? a : new Union([a,b]),
                "and": (_,a,b) => new Union([a,b]),
                "or_bool": (_,a,b) => `bool`,
                "and_bool": (_,a,b) => `bool`,
            }
        }

        this.operation_compilers = {...this.operation_compilers, ...this.worded_operation_compilers, ...this.logic_compilers};
        this.operation_types = {...this.operation_types, ...this.worded_operation_types, ...this.logic_types};
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
        this.compiledFunctions = [];
        this.variableGrabs = [];
        this.variableSets = [];
        this.packages = {};
        this.sharesVariables = true;
        this.neqlSupport = true;

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

    newLayer(variables, isSegment) {
        const l = new ScopeLayer(variables);
        l.isSegment = isSegment ?? false;
        this.layers.push(l);
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

function isTypeSafe(type,compare) {
    if (compare instanceof Union)
        return compare.elements.reduce((acc,v) => acc || isTypeSafeStrict(type,v), false);
    return isTypeSafeStrict(type,compare);
}

function isTypeSafeStrict(type,compare) {
    if (type instanceof TypedValueType && compare instanceof TypedValueType) {
        return isTypeSafeStrict(type.baseType,compare.baseType) && isTypeSafeStrict(type.valueType,compare.valueType);
    }
    if (type instanceof Type || type instanceof Struct)
        type = type.name;
    if (compare instanceof Type || compare instanceof Struct)
        compare = compare.name;
    if (compare instanceof Union)
        throw Error("attempt to use a union for a strict type check");
    if (type === ".any" || compare === ".any")
        return true;
    if (compare == "void")
        compare = "null";
    return type === compare;
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
        code = removeComments(code);

        /* prefixes */ {
            this.kind = "operation";
            switch (code[0]) {
                case "!":
                    this.type = "invert";
                    this.a = new Node(code.slice(1), context);
                    return;
                case "?":
                    this.type = "boolify";
                    this.a = new Node(code.slice(1), context);
                    return;
                    
                case "+":
                    this.type = "positive";
                    this.a = new Node(code.slice(1), context);
                    return;
                case "-":
                    this.type = "negative";
                    this.a = new Node(code.slice(1), context);
                    return;
            }
        }

        /* obj */ {
            if (is(code, "curly")) {
                const elements = split(code.slice(1,-1), ",").filter(t => t !== ",");
                try {
                    this.kind = "object";
                    this.elements = elements.map(e => {
                        const tokens = split(e,":").filter(t => t !== ":");
                        let key = tokens[0];
                        if (is(tokens[0], "single-q") || is(tokens[0], "double-q") || is(tokens[0], "back-q"))
                            key = tokens[0].slice(1,-1);
                        if (tokens.length != 2)
                            throw Error("unknown object key-pair syntax: " + e)
                        return [key,new Node(tokens[1], context)];
                    });
                    return;
                } catch {}
            }
        }

        /* segment */ {
            const colons = split(code, ":");

            const elements = split(code, ";", true).filter(t => t !== ";");
            if (has(code, ";") || elements.length > 1 && elements[elements.length-1] !== "()") {
                this.kind = "segment";
                this.elements = elements.map(e => new Node(e, context)).filter(e => !!e);
                return;
            }

            const elements2 = split(code.slice(1,-1), ";", true).filter(t => t !== ";");
            if (is(code, "curly") && elements2.length > 0) {
                this.kind = "segment";
                this.elements = elements2.map(e => new Node(e, context)).filter(e => !!e);
                return;
            }
        }

        /* import */ {
            const spaceTokens = split(code, " ").filter(t => t != " ");
            const tokens = split(spaceTokens.slice(1).join(" "),",").filter(t => t !== ",");
            let path;
            if (spaceTokens.length >= 2 && spaceTokens.shift() == "import" && tokens.length > 0) {
                this.kind = "import";
                let imports = [];
                for (let i = 0; i < tokens.length; i++) {
                    const spaceTokens = split(tokens[i], " ").filter(t => t != " ");
                    const path = spaceTokens.shift();

                    let name = path.split("/").pop();

                    let token;
                    while (token = spaceTokens.shift()) {
                        switch (token) {
                            case "as":
                                name = spaceTokens.shift();
                                break;
                            default:
                                throw Error("unexpected token " + token);
                        }
                    }
                    imports.push({
                        path,
                        name
                    })
                }
                this.imports = imports;
                return;
            }
        }

        /* structs */ {
            const blockTokens = split(code, "curly");
            const spaceTokens = split(blockTokens[0] ?? "", " ").filter(t => t != " ");
            if (blockTokens.length == 2 && is(blockTokens[1], "curly") && spaceTokens.length == 2 && spaceTokens[0] === "struct" && /^[A-Za-z0-9_]+$/.test(spaceTokens[1])) {
                this.kind = "struct_def";
                this.name = spaceTokens[1];
                this.content = split(blockTokens[1].slice(1,-1),";",true).filter(t => t !== ";").map(elem => {
                    /* attribute */ {
                        const tokens = split(elem,"=");
                        if (tokens.length == 3 && /^[A-Za-z0-9_ ]+$/.test(tokens[0]) && tokens[1] == "=") {
                            const value = new Node(tokens[2], context);
                            let type = null;
                            let name;

                            const tokens2 = split(tokens[0], " ").filter(t => t != " ");
                            if (tokens2.length == 2) {
                                type = new Node(tokens2[0], context);
                                name = tokens2[1];
                            } else if (tokens2.length == 1) {
                                name = tokens2[0];
                            } else {
                                throw Error("unknown key syntax " + tokens[0].split("\n").map(l => l.trim()).join("\\n"))
                            }

                            return {
                                "kind": "attribute",
                                "type": type,
                                "name": name,
                                "value": value
                            }
                        }
                    }
                    /* function */ {
                        const bracketTokens = split(elem, "bracket");
                        const spaceTokens = split(bracketTokens[0], " ", null, true).filter(t => t !== " ");
                        if (bracketTokens.length == 3 && spaceTokens.length >= 2) {
                            if (is(bracketTokens[1], "bracket"), is(bracketTokens[2], "curly")) {
                                return new Node(elem, context);
                            }
                        }
                    }
                    /* auto function */ {
                        const bracketTokens = split(code, "bracket");
                        const arrowTokens = split(bracketTokens[0] ?? "", "arrow");
                        const spaceTokens = split(arrowTokens[0] ?? "", " ", null, true).filter(t => t !== " ");
                        if (bracketTokens.length == 3 && arrowTokens.length == 2 && spaceTokens.length == 2) {
                            if (
                                is(bracketTokens[1], "bracket") &&
                                is(bracketTokens[2], "curly") &&
                                is(arrowTokens[1], "arrow") &&
                                spaceTokens[0] == "auto" &&
                                /^[A-Za-z0-9_]+$/.test(spaceTokens[1]) &&
                                /^[A-Za-z0-9_]+$/.test(arrowTokens[1].slice(1,-1))
                            ) {
                                return new Node(elem, context);
                            }
                        }
                    }
                    /* null attribute */ {
                        const tokens = split(elem, " ").filter(t => t !== " ");
                        if (tokens.length >= 2) {
                            return {
                                "kind": "null_attribute",
                                "name": tokens.pop(),
                                "type": new Node(tokens.join(" "), context)
                            }
                        }
                    }
                    throw Error("unexpected tokens: " + elem.split("\n").map(l => l.trim()).join("\\n"));
                });
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
            let type;
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

            const spaceTokens = split(key, " ").filter(t => t != " ");
            if (op == "=" && spaceTokens.length >= 2 && /^[A-Za-z0-9_| <>]+$/.test(spaceTokens.slice(0,-1).join(" ")) && /^[A-Za-z0-9_]+$/.test(spaceTokens[spaceTokens.length-1])) {
                key = spaceTokens.pop();
                type = new Node(spaceTokens.join(" "),context);
            }

            const isValid = Object.keys(types).map(k => k + "=").includes(op);

            const keys = split(key, "square");
            if (keys.length > 1 && is(keys[keys.length-1], "square") && isValid) {
                this.fullKey = new Node(key, context);
                key = new Node(keys.pop().slice(1,-1), context);
                this.parent = new Node(keys.join(""), context);
            }

            if (typeof key === "string") {
                const attributes = split(key, ".").filter(t => t !== ".");
                if (attributes.length > 1 && isValid) {
                    this.fullAttribute = new Node(key, context);
                    key = attributes.pop();
                    this.parent = new Node(attributes.join("."), context);
                }
            }

            if (isValid && (typeof key == "string" ? /^[A-Za-z0-9_|]+$/.test(key) : true)) {
                this.kind = "assignment";
                this.key = key;
                this.type = types[op.slice(0,-1)];
                this.value = new Node(tokens.join(""), context);
                if (type)
                    this.varType = type;
                return;
            }
        }

        /* auto function */ {
            const bracketTokens = split(code, "bracket");
            const arrowTokens = split(bracketTokens[0] ?? "", "arrow");
            const spaceTokens = split(arrowTokens[0] ?? "", " ", null, true).filter(t => t !== " ");
            if (bracketTokens.length == 3 && arrowTokens.length == 2 && spaceTokens.length == 2) {
                if (
                    is(bracketTokens[1], "bracket") &&
                    is(bracketTokens[2], "curly") &&
                    is(arrowTokens[1], "arrow") &&
                    spaceTokens[0] == "auto" &&
                    /^[A-Za-z0-9_]+$/.test(spaceTokens[1]) &&
                    /^[A-Za-z0-9_]+$/.test(arrowTokens[1].slice(1,-1))
                ) {
                    this.kind = "auto_function";
                    this.params = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Parameter(p, context));
                    this.key = spaceTokens.pop();
                    context.functionArgLayers.push(this.params);
                    this.content = new Node(bracketTokens[2].slice(1,-1), context);
                    context.functionArgLayers.pop();
                    this.type = arrowTokens[1].slice(1,-1);
                    return
                }
            }
        }

        /* function */ {
            const bracketTokens = split(code, "bracket");
            const spaceTokens = split(bracketTokens[0], " ", null, true).filter(t => t !== " ");
            if (bracketTokens.length == 3 && spaceTokens.length >= 2) {
                if (is(bracketTokens[1], "bracket"), is(bracketTokens[2], "curly") && /^[A-Za-z0-9_]+$/.test(spaceTokens[spaceTokens.length-1])) {
                    this.kind = "function";
                    this.params = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Parameter(p, context));
                    this.key = spaceTokens.pop();
                    context.functionArgLayers.push(this.params);
                    this.content = new Node(bracketTokens[2].slice(1,-1), context);
                    context.functionArgLayers.pop();
                    this.type = new Node(spaceTokens.join(" "), context);
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
                    this.type = new Node(spaceTokens.join(" "), context);
                    return;
                }
            }
        }

        /* logic */ {
            const logic_operations = context.logic_names;
            const ops = ["|","&"];
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
                if (logic_operations[newTokens[newTokens.length-2]]) {
                    this.kind = "operation";
                    this.b = new Node(newTokens.pop(), context);
                    this.type = logic_operations[newTokens.pop()];
                    this.a = new Node(newTokens.join(""), context);
                    return;
                }
            }
        }
        
        /* union */ {
            const tokens = split(code,"|",null,true).filter(t => t !== "|");
            if (tokens.length > 1) {
                this.kind = "union";
                this.elements = tokens.map(e => new Node(e, context));
                return;
            }
        }

        /* typed value type */ {
            const tokens = split(code, "arrow");
            if (tokens.length == 2 && is(tokens[1],"arrow") && /^[A-Za-z0-9_]+$/.test(tokens[0])) {
                this.kind = "typed_value_type";
                this.baseType = new Node(tokens[0], context);
                this.valueType = new Node(tokens[1].slice(1,-1), context);
                return;
            }
        }

        /* typed method */ {
            const tokens = split(code, ".").filter(t => t !== ".");
            const bracketTokens = split(tokens[tokens.length-1], "bracket");
            const arrowTokens = split(bracketTokens[0] ?? "", "arrow");
            if (
                tokens.length > 1 && 
                bracketTokens.length >= 2 &&
                arrowTokens.length >= 2 &&
                /^[A-Za-z0-9_]+$/.test(arrowTokens[0])
            ) {
                tokens.pop();
                this.kind = "typed_method";
                this.value = new Node(tokens.join("."), context);
                this.args = split(bracketTokens[bracketTokens.length - 1].slice(1,-1),",").filter(t => t != ",").map(p => new Node(p, context));
                this.type = new Node(arrowTokens.pop().slice(1,-1), context);
                this.key = arrowTokens.join("");
                return;
            }
        }

        /* typed execution */ {
            const bracketTokens = split(code, "bracket");
            const arrowTokens = split(bracketTokens[0] ?? "", "arrow");
            if (
                bracketTokens.length >= 2 &&
                arrowTokens.length >= 2
            ) {
                this.kind = "typed_execution";
                this.args = split(bracketTokens[bracketTokens.length - 1].slice(1,-1),",").filter(t => t != ",").map(p => new Node(p, context));
                this.type = new Node(arrowTokens.pop().slice(1,-1), context);
                this.key = new Node(arrowTokens.join(""), context);
                return;
            }
        }
        
        /* comparison */ {
            const chars = ["=","!","?",">","<"];
            const tokens = split(code,chars);
            let a = tokens.shift();
            let op = "";
            let token;
            while (chars.includes(token = tokens.shift())) op += token;
            if (token) tokens.unshift(token);
            const types = {
                "==": "equal",
                "!=": "not_equal",
                ">=": "greater_equal",
                "<=": "smaller_equal",
                ">": "greater",
                "<": "smaller",
                "?=": "type_equal"
            }
            if (Object.keys(types).map(k => k).includes(op)) {
                this.kind = "comparison";
                this.a = new Node(a, context);
                this.type = types[op];
                this.b = new Node(tokens.join(""), context);
                return;
            }
        }

        /* worded operation */ {
            const tokens = split(code, " ").filter(t => t != " ");
            if (tokens.length > 2) {
                const a = tokens.shift();
                const op = tokens.shift();
                const b = tokens.join("");
                if (Object.keys(context.worded_operation_compilers).includes(op)) {
                    this.kind = "operation";
                    this.type = op;
                    this.a = new Node(a, context);
                    this.b = new Node(b, context);
                    return;
                }
            }
        }

        /* math */ {
            const operations = context.operation_names;
            const ops = Object.keys(operations);
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

        /* inc and dec */ {
            const chars = ["=","+","-","*","/","^","%"];
            const tokens = split(code,chars);
            let key = tokens.shift();
            let op = "";
            let token;
            while (chars.includes(token = tokens.shift())) op += token;
            if (token) tokens.unshift(token);

            const types = {
                "++": "inc",
                "--": "dec"
            }

            const isValid = Object.keys(types).includes(op);

            const keys = split(key, "square");
            if (keys.length > 1 && is(keys[keys.length-1], "square") && isValid) {
                this.fullKey = new Node(key, context);
                key = new Node(keys.pop().slice(1,-1), context);
                this.parent = new Node(keys.join(""), context);
            }

            const attributes = split(key, ".").filter(t => t !== ".");
            if (attributes.length > 1 && isValid) {
                this.fullAttribute = new Node(key, context);
                key = attributes.pop();
                this.parent = new Node(attributes.join("."), context);
            }

            if (isValid && (typeof key == "string" ? /^[A-Za-z0-9_|]+$/.test(key) : true)) {
                this.kind = "assignment";
                this.key = key;
                this.type = types[op];
                return;
            }
        }

        /* method */ {
            const tokens = split(code, ".").filter(t => t !== ".");
            const bracketTokens = split(tokens[tokens.length-1] ?? "","bracket");
            if (tokens.length > 1 && bracketTokens.length == 2 && is(bracketTokens[1],"bracket") && /^[A-Za-z0-9_]+$/.test(bracketTokens[0])) {
                tokens.pop();
                this.kind = "method";
                this.key = bracketTokens[0];
                this.value = new Node(tokens.join("."), context);
                this.args = split(bracketTokens[1].slice(1,-1),",").filter(t => t != ",").map(p => new Node(p, context));
                return;
            }
        }

        /* attribute */ {
            const tokens = split(code, ".").filter(t => t !== ".");
            if (tokens.length > 1 && /^[A-Za-z0-9_]+$/.test(tokens[0])) {
                this.kind = "attribute";
                this.key = tokens.pop();
                this.value = new Node(tokens.join("."), context);
                return;
            }
        }

        /* instancing */ {
            const tokens = split(code, "bracket");
            const spaceTokens = split(tokens[0] ?? "", " ").filter(t => t !== " ");

            if (tokens.length == 2 && is(tokens[1], "bracket") && spaceTokens.length == 2 && spaceTokens[0] === "new" && /^[A-Za-z0-9_:]+$/.test(spaceTokens[1])) {
                this.kind = "instance";
                this.name = spaceTokens[1];
                this.args = split(tokens[1].slice(1,-1),",").filter(t => t !== ",").map(e => new Node(e, context));
                return;
            }
        }

        /* execution */ {
            const bracketTokens = split(code, "bracket");
            if (bracketTokens.length > 1 && is(bracketTokens[bracketTokens.length - 1],"bracket") && bracketTokens.slice(0,-1).join("").length > 0) {
                this.kind = "execution";
                this.args = split(bracketTokens[bracketTokens.length - 1].slice(1,-1),",").filter(t => t != ",").map(p => new Node(p, context));
                this.key = new Node(bracketTokens.slice(0,-1).join(""), context);
                return;
            }
        }

        /* key */ {
            const tokens = split(code, "square");
            if (tokens.length > 1 && is(tokens[tokens.length-1],"square")) {
                this.kind = "key";
                this.key = new Node(tokens.pop().slice(1,-1), context);
                this.value = new Node(tokens.join(""), context);
                return;
            }
        }

        /* arr */ {
            if (is(code, "square")) {
                const elements = split(code.slice(1,-1), ",").filter(t => t !== ",");
                
                this.kind = "array";
                this.elements = elements.map(e => new Node(e, context));
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

        /* package method */ {
            const tokens = split(code, ":").filter(t => t != ":");
            if (tokens.length == 2) {
                this.kind = "package_method";
                this.package = tokens[0];
                this.key = tokens[1];
                return;
            }
        }

        /* constants */ {
            /* types */ {
                const types = [
                    "str",
                    "num",
                    "bool",

                    "Obj",
                    "Arr",
                    
                    "void",
                    "any"
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
                    
                    "null",
                    "self"
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

        /* context flags */ {
            const flags = {
                "#noAnyWarn": "noAnyWarn"
            }
            if (flags[code]) {
                this.kind = "context_flags";
                this.key = flags[code];
                return;
            }
        }

        if (!code.trim()) {
            this.kind = "empty";
            return;
        }

        throw Error("unexpected tokens: " + this.formattedCode);
    }

    compile(context, target, flags) {
        if (!context) throw Error("no context");
        if (target && !(target instanceof Target)) throw Error("no valid target");

        switch (this.kind) {
            case "segment": {
                if (!flags?.includes("noscope"))
                    context.scope.newLayer(null, true);
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    element.compile(context);
                }
                if (!flags?.includes("noscope"))
                    context.scope.exitLayer();
                if (target) {
                    context.text += `set null ${target.id}\n`;
                }
                break;
            }
            case "empty":
                if (target)
                    context.text += `set null ${target.id}\n`;
                break;
            case "import": {
                for (let i = 0; i < this.imports.length; i++) {
                    const imp = this.imports[i];
                    let current = context.fs;
                    const tokens = imp.path.split("/");
                    for (let i = 0; i < tokens.length; i++) {
                        const token = tokens[i];
                        if (current == null)
                            break;
                        current = current[token];
                    }
                    if (!current)
                        throw Error("unknown package " + imp.path + ".fcl")
                    
                    context.packages[imp.name] = current;
                    current.node.import(context, imp.name);
                }

                break;
            }

            case "execution": {
                if (this.key.formattedCode === "raw") {
                    context.text += (this.args.map(n => n.kind == "string" ? n.value : "").join("\n") + "\n").replace(".target", target?.id);
                    return;
                }
                const func = this.key.getValue(context);
                if (func instanceof CompiledFunc) {
                    const argKeys = this.args.map(a => a.compileKey(context));
                    this.args.forEach((a,i) => a.compile(context, new Target(argKeys[i])));
                    context.text += func.compileFunc(argKeys, target) + "\n";
                } else if (func instanceof AutoFunc) {
                    throw Error("cannot execute generic function as typed function");
                } else if (func instanceof DefinedFunc) {
                    let argKeys;
                    if (func.params) {
                        argKeys = [];
                        for (let i = 0; i < func.params.length; i++) {
                            const param = func.params[i];
                            const arg = this.args[i];
                            if (arg == null && param.default == null) {
                                throw Error(`argument ${param.name} not supplied.`);
                            } else if (!arg && param.default) {
                                const key = param.default.compileKey(context);
                                param.default.compile(context, new Target(key));
                                argKeys.push(key);
                            } else {
                                const key = arg.compileKey(context);
                                arg.compile(context, new Target(key));
                                argKeys.push(key);
                                const t = arg.getType(context);
                                if (!isTypeSafe(t,param.type.getValue(context))) {
                                    throw Error("expected " + t.getName() + " got " + param.type.getValue(context).getName())
                                }
                            }
                        }
                    }
                    if (target)
                        context.text += `callget ${target.id} ${func.key} ${argKeys.join(" ")}\n`;
                    else
                        context.text += `call ${func.key} ${argKeys.join(" ")}\n`;
                } else {
                    throw Error(this.key.formattedCode + " is not a function");
                }
                
                break;
            }
            case "typed_execution": {
                if (this.key.formattedCode === "raw") {
                    context.text += (this.args.map(n => n.kind == "string" ? n.value : "").join("\n") + "\n").replace(".target", target?.id);
                    return;
                }
                const func = this.key.getValue(context);
                if (func instanceof AutoFunc) {
                    let argKeys;
                    if (func.params) {
                        argKeys = [];
                        for (let i = 0; i < func.params.length; i++) {
                            const param = func.params[i];
                            const arg = this.args[i];
                            if (arg == null && param.default == null) {
                                throw Error(`argument ${param.name} not supplied.`);
                            } else if (!arg && param.default) {
                                const key = param.default.compileKey(context);
                                param.default.compile(context, new Target(key));
                                argKeys.push(key);
                            } else {
                                const key = arg.compileKey(context);
                                arg.compile(context, new Target(key));
                                argKeys.push(key);
                                const t = arg.getType(context);
                                const pType = param.type.formattedCode === func.typeName ? ".any" : param.type.getValue(context);
                                if (!isTypeSafe(t,pType)) {
                                    throw Error("expected " + t.getName() + " got " + pType.getName())
                                }
                            }
                        }
                    }
                    if (target) {
                        context.text += `callget ${target.id} ${func.key} ${argKeys.join(" ")}\n`;
                        
                        let outType = this.type.getValue(context);
                        outType = outType instanceof GenericType ? `.generic` : outType.getName();
                        const condRef = randomStr();
                        const typeRef = randomStr();
                        const errRef1 = randomStr();
                        const errRef2 = randomStr();
                        const lblRef = randomStr();
                        context.text += `set str ${typeRef} ${outType}\nistypeg ${condRef} ${target.id} ${typeRef}\n`;
                        context.text += `ji ${lblRef} ${condRef}\nset str ${errRef1} generic function returned \nset str ${errRef2}  not the specified type \nadd ${errRef1} ${errRef1} .typechecktype ${errRef2}\nadd ${errRef1} ${errRef1} ${typeRef}\nerr ${errRef1}\n: ${lblRef}\n`;
                    } else
                        context.text += `call ${func.key} ${argKeys.join(" ")}\n`;
                } else {
                    throw Error(this.key.formattedCode + " is not a generic function");
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
                            const type = this.value.getType(context);
                            if (topLayer && !isTypeSafe(type,topLayer.return_type))
                                throw Error(`attempt to return a value of type ${type.getName()} when the function should return ${topLayer.return_type.getName()}`);
                            if (topLayer.kind == "auto_function") {
                                const typeRef = randomStr();
                                context.text += `set str ${typeRef} ${type instanceof GenericType ? `.generic` : type.getName()}\nsettype ${key} ${typeRef}\n`;
                            }
                            context.text += `ret ${key}\n`;
                        } else {
                            if (topLayer && !isTypeSafe(new Type("null"),topLayer.return_type))
                                throw Error(`attempt to return null when the function should return ${topLayer.return_type.getName()}`);
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
                        b_key = this.b?.compileKey(context);
                    const a_type = this.a.getType(context),
                        b_type = this.b?.getType(context);
                    this.a.compile(context, new Target(a_key));
                    this.b?.compile(context, new Target(b_key));
                    const out = operation(context, target, a_key, b_key, a_type, b_type);
                    if (!out) {
                        throw Error(`cannot run ${this.type} operation on values of type ${a_type.getName()} ${b_type != null ? `and ${b_type?.getName()}` : ``}`)
                    } else {
                        context.text += out + "\n";
                    }
                }
                break;
            }
            case "branch": {
                switch (this.key) {
                    case "forever": {
                        const lbl = randomStr();
                        let copyVars = [];
                        if (context.sharesVariables) {
                            for (let i = context.scope.layers.length - 1; i >= 0; i--) {
                                const layer = context.scope.layers[i];
                                const keys = Object.keys(layer.variables);
                                for (let v = 0; v < keys.length; v++) {
                                    const vName = keys[v];
                                    copyVars.push(context.scope.get(vName).ref);
                                }

                                if (!layer.isSegment) break;
                            }
                            for (let i = 0; i < copyVars.length; i++) {
                                const v = copyVars[i];
                                context.text += `proc store ${v} ${v}\n`;
                            }
                        }
                        context.text += `quitTo ${lbl}\n: ${lbl}\n`;
                        const txt = context.text;
                        context.text = "";
                        if (context.sharesVariables) {
                            for (let i = 0; i < copyVars.length; i++) {
                                const v = copyVars[i];
                                context.text += `proc get ${v} ${v}\n`;
                            }
                        }
                        this.content.compile(context);
                        const contentTxt = context.text;
                        context.text = txt;
                        context.text += contentTxt;
                        context.text += `quitTo ${lbl}\n`;
                        break;
                    }
                    default:
                        throw Error("cannot compile branch of type " + this.key);
                }
                break;
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
                        throw Error("cannot compile branch with args of type " + this.key);
                }
                break;
            }
            case "assignment": {
                // the name of the assignment's output
                let targetRef;
                let targetType;
                
                let existingRef;

                // obj[key] = value stuff
                let parentKey;
                let keyKey;
                
                if (this.fullAttribute) {
                    parentKey = this.parent.compileKey(context);
                    this.parent.compile(context, new Target(parentKey));
                    targetRef = this.value.compileKey(context);
                    targetType = this.fullAttribute.getType(context);

                    switch (this.type) {
                        case "add": case "join": case "sub": case "mul": case "div": case "pow": case "mod": case "inc": case "dec":
                            targetRef = this.fullAttribute.compileKey(context);
                            this.fullAttribute.compile(context, new Target(targetRef));
                            break
                    }

                    const valueType = this.value.getType(context);
                    if (!isTypeSafeStrict(targetType, valueType))
                        throw Error(`attempt to assign an attribute which is ${targetType.getName()} to a ${valueType.getName()}`)
                    
                } else {
                    if (typeof this.key == "string") {
                        let err;
                        try {
                            targetType = new Node(this.key,new ParseContext()).getType(context);
                            const valueType = this.value.getType(context);
                            if (targetType == null ? false : !isTypeSafeStrict(targetType,valueType))
                                err = Error("attempt to assign variable to " + valueType.getName() + " while the variable should be a " + targetType.getName());
                        } catch (e) {
                            switch (this.type) {
                                case "default":
                                    targetType = this.value.getType(context);
                                    const wantedType = this?.varType?.getValue(context);
                                    if (wantedType == null ? false : !isTypeSafeStrict(targetType,wantedType))
                                        throw Error("attempt to assign variable to " + targetType.getName() + " while the variable should be a " + wantedType.getName())
                                    break;
                                case "inc": case "dec": targetType = new Type("num"); err = null; break;
                                default:
                                    throw e;
                            }
                        }
                        if (err)
                            throw err;
                        try {
                            targetRef = context.scope.assign(this.key, this.value.getValue(context));
                        } catch {
                            targetRef = context.scope.assign(this.key, new TypedValue(targetType));
                        }
                        existingRef = targetRef;
                    } else { // obj[key]
                        parentKey = this.parent.compileKey(context);
                        this.parent.compile(context, new Target(parentKey));
                        keyKey = this.key.compileKey(context);
                        this.key.compile(context, new Target(keyKey));
                        targetRef = this.value.compileKey(context);
                        targetType = this.fullKey.getType(context);

                        switch (this.type) {
                            case "add": case "join": case "sub": case "mul": case "div": case "pow": case "mod": case "inc": case "dec":
                                existingRef = this.fullKey.compileKey(context);
                                this.fullKey.compile(context, new Target(existingRef));
                                break
                        }

                        const valueType = this.value.getType(context);
                        if (!isTypeSafeStrict(targetType, valueType))
                            throw Error(`attempt to assign a key which is ${targetType.getName()} to a ${valueType.getName()}`)
                    }
                }

                // compile the assignment's value to the target
                switch (this.type) {
                    case "default": {
                        this.value.compile(context, new Target(targetRef));
                        break;
                    }
                    case "add": case "join": case "sub": case "mul": case "div": case "pow": case "mod": case "inc": case "dec": {
                        const valueRef = randomStr();
                        const valueType = this.value?.getType(context);

                        const operation = context.operation_compilers[this.type];
                        this.value?.compile(context, new Target(valueRef));
                        const out = operation(context, new Target(targetRef), targetRef, valueRef, targetType, valueType);
                        if (!out)
                            throw Error(`cannot run ${this.type} assignment operation on values of type ${targetType.getName()} and ${valueType.getName()}`)
                        context.text += out + "\n";
                        
                        const operationType = context.operation_types[this.type];
                        const outType = operationType(context, targetType, valueType);

                        if (!outType)
                            throw Error(`cannot run ${this.type} assignment operation on values of type ${targetType.getName()} and ${valueType.getName()}`)
                        
                        try {
                            context.scope.assign(this.key, this.value.getValue(context));
                        } catch {
                            context.scope.assign(this.key, new TypedValue(outType.name ?? outType));
                        }
                        break;
                    }
                }

                if (typeof this.key != "string")
                    context.text += `obj set ${parentKey} ${keyKey} ${targetRef}\n`;
                if (this.fullAttribute) {
                    const keyRef = randomStr();
                    const temp = randomStr();
                    context.text += `set str ${keyRef} attributes\nobj get arg0 ${temp} ${keyRef}\nset str ${keyRef} ${this.key}\nobj set ${temp} ${keyRef} ${targetRef}\n`
                }
            }
            case "comparison": {
                const comparison = context.comparison_compilers[this.type];
                if (comparison && target) {
                    const a_key = this.a.compileKey(context),
                        b_key = this.b.compileKey(context);
                    const a_type = this.a.getType(context),
                        b_type = this.b.getType(context);
                    this.a.compile(context, new Target(a_key));
                    this.b.compile(context, new Target(b_key));
                    const out = comparison(context, target, a_key, b_key, a_type, b_type);
                    if (!out) {
                        throw Error(`cannot run ${this.type} comparison on values of type ${a_type} and ${b_type}`)
                    } else {
                        context.text += out + "\n";
                    }
                }
                break;
            }
            case "instance": {
                const instVal = context.scope.get(this.name);
                if (!instVal || !(instVal instanceof Struct))
                    throw Error("cannot instance " + this.name);
                target ??= new Target(randomStr()); 
                let argKeys;
                const params = instVal.methods[".cns"]?.params;
                if (params) {
                    argKeys = [];
                    for (let i = 0; i < params.length; i++) {
                        const param = params[i];
                        const arg = this.args[i];
                        if (arg == null && param.default == null) {
                            throw Error(`argument ${param.name} not supplied.`);
                        } else if (!arg && param.default) {
                            const key = param.default.compileKey(context);
                            param.default.compile(context, new Target(key));
                            argKeys.push(key);
                        } else {
                            const key = arg.compileKey(context);
                            arg.compile(context, new Target(key));
                            argKeys.push(key);
                            const t = arg.getType(context);
                            if (!isTypeSafe(t,param.type.getValue(context))) {
                                throw Error("expected " + t.getName() + " got " + param.type.getValue(context).getName())
                            }
                        }
                    }
                }
                const constructortemp1 = randomStr();
                const constructortemp2 = randomStr();
                if (instVal instanceof Struct) {
                    instVal.getObj(context, target);
                    if (instVal.methods[".cns"])
                        context.text += `set str ${constructortemp2} methods\nobj get ${target.id} ${constructortemp1} ${constructortemp2}\nset str ${constructortemp2} .cns\nobj get ${constructortemp1} ${constructortemp1} ${constructortemp2}\ncallvar ${constructortemp1} ${instVal.methods[".cns"].key} ${target.id} ${argKeys.join(" ")}\n`;
                }
                break;
            }
            case "method": {
                const parentType = this.value.getType(context);
                if (parentType instanceof Type || parentType instanceof Struct) {
                    const parent = context.scope.get(parentType.name);
                    const parentRef = this.value.compileKey(context);
                    this.value.compile(context, new Target(parentRef));
                    if (parent instanceof Struct) {
                        if (Object.keys(parent.methods).includes(this.key)) {
                            const methodRef = randomStr();
                            const keyRef = randomStr();

                            const func = parent.methods[this.key];
                            let argKeys = [];
                            if (func.params) {
                                for (let i = 0; i < func.params.length; i++) {
                                    const param = func.params[i];
                                    const arg = this.args[i];
                                    if (arg == null && param.default == null) {
                                        throw Error(`argument ${param.name} not supplied.`);
                                    } else if (!arg && param.default) {
                                        const key = param.default.compileKey(context);
                                        param.default.compile(context, new Target(key));
                                        argKeys.push(key);
                                    } else {
                                        const key = arg.compileKey(context);
                                        arg.compile(context, new Target(key));
                                        argKeys.push(key);
                                        const t = arg.getType(context);
                                        if (!isTypeSafe(t,param.type.getValue(context))) {
                                            throw Error("expected " + t.getName() + " got " + param.type.getValue(context).getName())
                                        }
                                    }
                                }
                            }

                            // get the method
                            context.text += `set str ${keyRef} methods\nobj get ${parentRef} ${methodRef} ${keyRef}\nset str ${keyRef} ${this.key}\nobj get ${methodRef} ${methodRef} ${keyRef}\n`;
                            context.text += target != null ? `callgetvar ${target.id} ${methodRef} ${func.key} ${parentRef} ${argKeys.join(" ")}\n` : `callvar ${methodRef} ${func.key} ${parentRef} ${argKeys.join(" ")}\n`;
                            return;
                        }
                    }
                }
                throw Error(`cannot run ${this.key} on ${this.value.formattedCode} in ${this.formattedCode}`);
            }
            case "typed_method": {
                const parentType = this.value.getType(context);
                if (parentType instanceof Type || parentType instanceof Struct) {
                    const parent = context.scope.get(parentType.name);
                    const parentRef = this.value.compileKey(context);
                    this.value.compile(new Target(parentRef));
                    if (parent instanceof Struct) {
                        if (Object.keys(parent.genericMethods).includes(this.key)) {
                            const methodRef = randomStr();
                            const keyRef = randomStr();
                            const func = parent.genericMethods[this.key];
                            let argKeys = [];
                            if (func.params) {
                                for (let i = 0; i < func.params.length; i++) {
                                    const param = func.params[i];
                                    const arg = this.args[i];
                                    if (arg == null && param.default == null) {
                                        throw Error(`argument ${param.name} not supplied.`);
                                    } else if (!arg && param.default) {
                                        const key = param.default.compileKey(context);
                                        param.default.compile(context, new Target(key));
                                        argKeys.push(key);
                                    } else {
                                        const key = arg.compileKey(context);
                                        arg.compile(context, new Target(key));
                                        argKeys.push(key);
                                        const t = arg.getType(context);
                                        const pType = param.type.formattedCode === func.typeName ? ".any" : param.type.getValue(context);
                                        if (!isTypeSafe(t,pType)) {
                                            throw Error("expected " + t.getName() + " got " + pType.getValue(context))
                                        }
                                    }
                                }
                            }

                            // get the method
                            context.text += `set str ${keyRef} methods\nobj get ${parentRef} ${methodRef} ${keyRef}\nset str ${keyRef} ${this.key}\nobj get ${methodRef} ${methodRef} ${keyRef}\n`;
                            context.text += target != null ? `callgetvar ${target.id} ${methodRef} ${func.key} ${parentRef} ${argKeys.join(" ")}\n` : `callvar ${methodRef} ${func.key} ${parentRef} ${argKeys.join(" ")}\n`;
                            
                            let outType = this.type.getValue(context);
                            outType = outType instanceof GenericType ? `.generic` : outType.getName();
                            const condRef = randomStr();
                            const typeRef = randomStr();
                            const errRef1 = randomStr();
                            const errRef2 = randomStr();
                            const lblRef = randomStr();
                            context.text += `set str ${typeRef} ${outType}\nistypeg ${condRef} ${target.id} ${typeRef}\n`;
                            context.text += `ji ${lblRef} ${condRef}\nset str ${errRef1} generic method returned \nset str ${errRef2}  not the specified type \nadd ${errRef1} ${errRef1} .typechecktype ${errRef2}\nadd ${errRef1} ${errRef1} ${typeRef}\nerr ${errRef1}\n: ${lblRef}\n`;
                            return;
                        }
                    }
                }
                throw Error(`cannot run ${this.key} on ${this.value.formattedCode} in ${this.formattedCode}`);
            }

            case "variable":
                context.text += target != null && !(target.id == context.scope.get(this.key).ref) ? `dupe ${target.id} ${context.scope.get(this.key).ref}\n` : "";
                break;
            case "argument":
                context.text += target != null && !target.id.startsWith("arg") ? `dupe ${target.id} arg${this.index + context.argOffset ?? 0}\n` : "";
                break;
            case "constant":
                if (target == null) break;
                if (this.name === "self") {
                    const top = context.functionDataLayers[context.functionDataLayers.length - 1];
                    if (top?.hasSelf) {
                        context.text += `dupe ${target.id} arg0\n`;
                    } else {
                        throw Error("cannot access self");
                    }
                    return;
                }
                context.text += {
                    "true": `set bool ${target.id} true\n`,
                    "false": `set bool ${target.id} false\n`,

                    "null": `set null ${target.id}\n`
                }[this.name];
                break;
            case "key": {
                if (target != null) {
                    const valueType = this.value.getType(context);
                    if (valueType.canGetKey()) {
                        const keyRef = this.key.compileKey(context);
                        this.key.compile(context, new Target(keyRef));
                        const valueRef = this.value.compileKey(context);
                        this.value.compile(context, new Target(valueRef));
                        context.text += `obj get ${valueRef} ${target.id} ${keyRef}\n`;
                    } else
                        throw Error("cannot get a key from a " + valueType.getName());
                }
                return;
            }
            case "attribute": {
                const parentType = this.value.getType(context);
                if (parentType instanceof Type || parentType instanceof Struct) {
                    const parent = context.scope.get(parentType.name);
                    const parentRef = this.value.compileKey(context);
                    this.value.compile(context, new Target(parentRef));
                    if (parent instanceof Struct) {
                        if (Object.keys(parent.attributes).includes(this.key)) {
                            if (target != null) {
                                const keyRef = randomStr();
                                context.text += `set str ${keyRef} attributes\nobj get ${parentRef} ${target.id} ${keyRef}\nset str ${keyRef} ${this.key}\nobj get ${target.id} ${target.id} ${keyRef}\n`;
                            }
                            return;
                        }
                        if (Object.keys(parent.nullAttributes).includes(this.key)) {
                            if (target != null) {
                                const keyRef = randomStr();
                                const txtRef = randomStr();
                                context.text += `set str ${keyRef} attributes\nobj get ${parentRef} ${target.id} ${keyRef}\nset str ${keyRef} ${this.key}\nobj get ${target.id} ${target.id} ${keyRef}\nset str ${txtRef} ${this.key} attribute is null\nerrnull ${target.id} ${txtRef}\n`;
                            }
                            return;
                        }
                    }
                }
                throw Error(`cannot get ${this.key} on ${this.value.formattedCode} in ${this.formattedCode}`);
            }

            case "string":
                context.text += target != null ? `set str ${target.id} ${fblExcape(this.value)}\n` : "";
                return;
            case "number":
                context.text += target != null ? `set num ${target.id} ${this.value}\n` : "";
                return
            case "array": {
                let staticArr = [];
                this.getValue(context);
                if (target != null) {
                    let staticIndexes = [];
                    for (let i = 0; i < this.elements.length; i++) {
                        const element = this.elements[i];
                        switch (element.kind) {
                            case "string": case "number":
                                staticArr.push(element.value);
                                staticIndexes.push(i);
                                break;
                        }
                    }
                    context.text += `set obj ${target.id} ${JSON.stringify(staticArr)}\n`;
                    for (let i = 0; i < this.elements.length; i++) {
                        if (staticIndexes.includes(i)) continue;
                        const element = this.elements[i];
                        const key = element.compileKey(context);
                        element.compile(context, new Target(key));
                        context.text += `arr add ${target.id} ${key}\n`;
                    }
                }
                return;
            }
            case "object": {
                let staticKeyVals = {};
                this.getValue(context);
                if (target != null) {
                    let staticPairs = [];
                    for (let i = 0; i < this.elements.length; i++) {
                        const [key, element] = this.elements[i];
                        switch (element.kind) {
                            case "string": case "number":
                                staticKeyVals[key] = element.value;
                                staticPairs.push(i);
                                break;
                        }
                    }
                    context.text += `set obj ${target.id} ${JSON.stringify(staticKeyVals)}\n`;
                    for (let i = 0; i < this.elements.length; i++) {
                        if (staticPairs.includes(i)) continue;
                        const [key, element] = this.elements[i];
                        const valueKey = element.compileKey(context);
                        const keyKey = randomStr();
                        element.compile(context, new Target(valueKey));
                        context.text += `set str ${keyKey} ${fblExcape(key)}\nobj set ${target.id} ${keyKey} ${valueKey}\n`;
                    }
                }
                return;
            }
            case "function": {
                const type = this.type.getValue(context);
                if (!type || !(type instanceof Type || type instanceof Union || type instanceof TypedValueType)) throw Error("invalid type " + this.type.formattedCode);
                
                if (!context.compiledFunctions.includes(this.key)) {
                    const saveText = context.text;
                    context.text = `~ ${this.key}\n`;
                    context.functionDataLayers.push({"kind":this.kind,"return_type":type,"branch":[],"args":this.params});
                    if (type.name !== "null") {
                        const scanContext = new ScanContext();
                        this.content.scan(scanContext);
                        if (!scanContext.returns)
                            throw Error("not all code paths return a value");
                    }
                    context.scope.newLayer(Object.fromEntries(this.params.map((p,i) => [`.arg${i}`, p.type.getValue(context)])));
                    this.content.compile(context, null, ["noscope"]);
                    context.scope.exitLayer();
                    context.functionDataLayers.pop();
                    context.text += "~\n";  
                    context.functionText += context.text;
                    context.text = saveText;
                    context.compiledFunctions.push(this.key);
                }
                const value = new DefinedFunc(this.key, type, this.params);
                context.scope.assignTop(this.key.slice(this.key.lastIndexOf(":") + 1), value);
                context.scope.assignTop(this.key, value);
                context.scope.assignTop(this.key.split(":").slice(-2).join(":"), value);

                if (target) {
                    context.text += `set str ${target.id} ${value.stringify()}\n`;
                }
                break;
            }
            case "auto_function": {
                if (!context.compiledFunctions.includes(this.key)) {
                    const saveText = context.text;
                    context.text = `~ ${this.key}\n`;
                    context.functionDataLayers.push({"kind":this.kind,"return_type":".any","branch":[],"args":this.params});
                    const scanContext = new ScanContext();
                    this.content.scan(scanContext);
                    if (!scanContext.returns)
                        throw Error("not all code paths return a value");
                    context.scope.newLayer(Object.fromEntries([[this.type,new GenericType()]]));
                    context.scope.newLayer(Object.fromEntries(this.params.map((p,i) => [`.arg${i}`, p.type.getValue(context)])));
                    this.content.compile(context, null, ["noscope"]);
                    context.scope.exitLayer();
                    context.scope.exitLayer();
                    context.functionDataLayers.pop();
                    context.text += "~\n";
                    context.functionText += context.text;
                    context.text = saveText;
                    context.compiledFunctions.push(this.key);
                }
                const value = new AutoFunc(this.key, this.params, this.type);
                context.scope.assignTop(this.key.slice(this.key.lastIndexOf(":") + 1), value);
                context.scope.assignTop(this.key, value);
                context.scope.assignTop(this.key.split(":").slice(-2).join(":"), value);

                if (target) {
                    context.text += `set str ${target.id} ${value.stringify()}\n`;
                }
                break;
            }
            case "struct_def": {
                if (target != null)
                    throw Error("expected an output from struct definition");
                //console.log(JSON.stringify(this, null, "  "));
                const attributes = {};
                const nullAttributes = {};
                const methods = {};
                const genericMethods = {};
                for (let i = 0; i < this.content.length; i++) {
                    const elem = this.content[i];
                    if (elem["kind"] == "attribute")
                        attributes[elem["name"]] = elem;
                    if (elem["kind"] == "null_attribute")
                        nullAttributes[elem["name"]] = elem;
                    if (elem["kind"] == "function")
                        methods[elem.key.replace("constructor",".cns")] = new MethodFunc(elem.content,elem.type,elem.params);
                    if (elem["kind"] == "auto_function")
                        genericMethods[elem.key.replace("constructor",".cns")] = new AutoMethodFunc(elem.content,elem.params,elem.type);
                    
                    if (elem["kind"] == "auto_function" && elem.key === "constructor")
                        throw Error("constructor cannot be a generic function");
                    if (elem["kind"] == "function" && elem.key === "constructor" && elem.type.formattedCode !== "void")
                        throw Error("constructor isnt of type void");
                }
                const args = [attributes,nullAttributes,methods,genericMethods];
                context.scope.assignTop(this.name.slice(this.name.indexOf(":") + 1), new Struct(
                    this.name.slice(this.name.indexOf(":") + 1),
                    ...args
                ))
                context.scope.assignTop(this.name, new Struct(
                    this.name,
                    ...args
                ))
                context.scope.assignTop(this.name.split(":").slice(-2).join(":"), new Struct(
                    this.name,
                    ...args
                ))
                context.scope.assignTop(this.name.split(":").slice(-1).join(":"), new Struct(
                    this.name,
                    ...args
                ))
                break;
            }
            
            default:
                throw Error("cannot compile node " + this.kind);
        }
    }

    scan(context) {
        switch (this.kind) {
            case "segment": {
                const context2 = new ScanContext();
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    element.scan(context2);
                }
                context.returns ||= context2.returns;
            }
            case "statement": {
                if (this.key == "return") {
                    context.returns = true;
                }
                break;
            }
        }
    }

    import(context, name) {
        switch (this.kind) {
            case "import": {
                for (let i = 0; i < this.imports.length; i++) {
                    try {
                        const imp = this.imports[i];
                        let current = context.fs;
                        const tokens = imp.path.split("/");
                        for (let i = 0; i < tokens.length; i++) {
                            const token = tokens[i];
                            if (current == null)
                                break;
                            current = current[token];
                        }
                        if (!current)
                            throw Error("unknown package " + imp.path + ".fcl")
                        
                        context.packages[imp.name] = current;
                        const old = context.packageName;
                        context.packageName = name + ":" + imp.name;
                        current.node.import(context, name + ":" + imp.name);
                        context.packageName = old;
                    } catch (e) {
                        if (e instanceof RangeError) {
                            throw `range error while importing ${this.imports[i].path}`;
                        } else
                            throw e;
                    }
                }
                break;
            }
            case "segment": {
                for (let i = 0; i < this.elements.length; i++) {
                    const elem = this.elements[i];
                    elem.import(context, name);
                }
                break;
            }
            case "function": case "auto_function": {
                const oldName = this.key;
                this.key = name + ":" + this.key;
                this.compile(context);
                this.key = oldName;
                break;
            }
            case "struct_def": {
                const oldName = this.name;
                this.name = name + ":" + this.name;
                this.compile(context);
                this.name = oldName;
                break;
            }
        }
    }

    compileKey(context) {
        switch (this.kind) {
            case "variable":
                if (!context.variableGrabs.includes(this.key))
                    context.variableGrabs.push(this.key);
                const val = context.scope.get(this.key);
                if (!val)
                    throw Error(`${this.key} is not defined`);
                return val.ref;
            case "argument":
                return "arg" + (this.index + (context.argOffset ?? 0));
        }
        return randomStr();
    }

    getValue(context) {
        switch (this.kind) {
            case "segment": return this.elements[this.elements.length-1].getType(context);
            case "empty": return new TypedValue("null");

            case "variable": {
                if (!context.variableGrabs.includes(this.key))
                    context.variableGrabs.push(this.key);
                const val = context.scope.get(this.key);
                if (!val)
                    throw Error(`${this.key} is not defined`);
                return val;
            }
            case "constant":
                return {
                    "true": new TypedValue("bool"),
                    "false": new TypedValue("bool"),

                    "null": new TypedValue("null"),
                    "self": new TypedValue("self"),
                    "any": new TypedValue(".any")
                }[this.name];
            case "package_method":
                return context.scope.get(`${context.packageName != null ? context.packageName + ":" : ""}${this.package}:${this.key}`);

            case "string":
                return new StringValue(this.value);
            case "number":
                return new NumberValue(this.value);
            case "function":
                if (!context.compiledFunctions.includes(this.key)) {
                    this.compile(context);
                    context.compiledFunctions.push(this.key);
                }
                return new DefinedFunc(this.key, this.type.getValue(context), this.params);
            case "type":
                if (this.name == "any" && context?.noAnyWarn != null)
                    throw Error("usage of any, any is not recomended, if this is necessary, put #noAnyWarn before the usage")
                if (this.name == "any")
                    return new Type(".any");
                return new Type(this.name);
            case "typed_value_type":
                return new TypedValueType(this.baseType.getValue(), this.valueType.getValue());
            case "union":
                return new Union(this.elements.map(e => e.getValue(context)));
            case "array": {
                const items = [];
                items.type = null;
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    const elementType = element.getType(context);
                    if (items.type == null || isTypeSafeStrict(elementType,items.type)) {
                        items.type = elementType;
                    } else {
                        throw Error(`attempt to have a ${elementType.stringify()} in a presumably ${items.type.stringify()} array`);
                    }
                }
                return new ArrayValue(items.type ?? new Type("null"));
            }
            case "object": {
                const items = {};
                items.type = null;
                for (let i = 0; i < this.elements.length; i++) {
                    const [key, element] = this.elements[i];
                    const elementType = element.getType(context);
                    if (items.type == null || isTypeSafeStrict(elementType, items.type)) {
                        items.type = elementType;
                    } else {
                        throw Error(`attempt to have a ${elementType.stringify()} in a presumably ${items.type.stringify()} object`);
                    }
                }
                return new ObjectValue(items.type ?? new Type("null"));
            }

            default:
                throw Error("cannot get value of " + this.kind);
        }
    }
    getType(context) {
        switch (this.kind) {
            case "empty": return new Type("null");

            case "variable":
                const val = context.scope.get(this.key);
                if (!val)
                    throw Error(`${this.key} is not defined`);
                return val.getType(context);
            case "argument":
                return context.scope.get(`.arg${this.index}`);
            case "constant":
                if (this.name === "self"){
                    const top = context.selfDataLayers[context.selfDataLayers.length - 1];
                    if (top["type"] == "struct") {
                        return new Type(top["data"]["name"]);
                    }
                }
                return new Type(this.getValue(context)?.type);
            case "attribute":
                try {
                    return context.scope.get(this.value.getType(context).name).attributes[this.key].type.getValue(context);
                } catch {}
                try {
                    return context.scope.get(this.value.getType(context).name).nullAttributes[this.key].type.getValue(context);
                } catch {}
                return new Type("null");
            
            case "key":
                const valueType = this.value.getType(context);
                if (valueType.canGetKey())
                    return valueType.getKeyType(this.key);
                else
                    throw Error("cannot get a key from a " + valueType.getName());
            
            case "execution":
                if (this.key.formattedCode == "raw") return new Type(".any");
                return this.key.getValue(context)?.return_type;
            case "typed_execution":
                return this.type.getValue(context);
            case "operation":
                const temp1 = context.operation_types[this.type];
                if (temp1) {
                    const out = temp1(context,this.a.getType(context),this.b?.getType(context));
                    return typeof out == "string" ? new Type(out) : out;
                }
                break;
            case "comparison":
                return new Type("bool");
            case "instance":
                const instVal = context.scope.get(this.name);
                if (!instVal)
                    throw Error("cannot instance " + this.name);
                return instVal;
            case "method":
                try {
                    const temp = context.scope.get(this.value.getType(context).name)
                    return {...temp.methods,...temp.null_methods}[this.key].return_type.getValue(context);
                } catch {}
                return new Type("null");
            case "typed_method":
                return this.type.getValue(context);

            case "array": case "object": {
                const val = this.getValue(context);
                return new TypedValueType(new Type(val.type), val.valueType);
            }
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
        this.default = null;
        const assignmentTokens = split(code, "=");
        if (assignmentTokens[1] === "=")
            this.default = new Node(assignmentTokens[2], context);
        
        const spaceTokens = split(assignmentTokens[0], " ").filter(t => t !== " ");
        if (spaceTokens.length == 2) {
            this.name = spaceTokens[1];
            this.type = new Node(spaceTokens[0], context);
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

    getValueType(context) {
        return null;
    }
    compileTo(context, target) {

    }
    stringify() {
        return `<${this.type}>`;
    }
    getType() {
        return new Type(this?.type);
    }
}
class Target {
    constructor(id) {
        this.id = id;
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

class ArrayValue extends Value {
    constructor(type) {
        super();
        this.type = "Arr";
        this.valueType = type;
    }

    getValueType(context) {
        return this.valueType;
    }
    getType() {
        return new TypedValueType(new Type(this.type), this.valueType);
    }
}
class ObjectValue extends Value {
    constructor(type) {
        super();
        this.type = "Obj";
        this.valueType = type;
    }

    getValueType(context) {
        return this.valueType;
    }
    getType() {
        return new TypedValueType(new Type(this.type), this.valueType);
    }
}

class TypedValue extends Value {
    constructor(type) {
        super();
        this.type = type?.name ?? type;
    }

    getType() {
        const type = this.type;
        return typeof type === "string" ? new Type(type) : type;
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
    getName() {
        return this.name;
    }
    canGetKey() {
        return false;
    }
    getKeyType() {
        return null;
    }
    getType() {
        return new Type(this?.type);
    }
}
class TypedValueType {
    constructor(baseType, valueType) {
        this.baseType = baseType;
        this.valueType = valueType;
    }
    stringify() {
        return `<type:${this.baseType?.getName()}<${this.valueType?.getName()}>>`;
    }
    getName() {
        return `${this.baseType?.getName()}<${this.valueType?.getName()}>`;
    }
    canGetKey() {
        if (this.baseType.name === "Arr" || this.baseType.name === "Obj")
            return true;
        return false;
    }
    getKeyType() {
        return this.valueType;
    }
    getType() {
        return new Type(this?.baseType);
    }
}
class GenericType extends Type {
    constructor() {
        super(".any");
    }
    stringify() {
        return `<type:${this.name}>`;
    }
    getName() {
        return "<genericType>";
    }
    canGetKey() {
        return false;
    }
    getKeyType() {
        return null;
    }
    getType() {
        return new Type(this?.type);
    }
}
class Union extends Value {
    constructor(elements) {
        super();

        this.type = "union";
        this.elements = elements;
    }

    stringify() {
        return `<union:${this.elements.map(e => e.stringify()).join(",")}>`;
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

class Struct extends TypedValueType {
    constructor(name, attributes, nullAttributes, methods, genericMethods) {
        super();
        delete this.baseType;
        delete this.valueType;

        this.type = "struct";
        this.name = name;
        this.attributes = attributes;
        this.nullAttributes = nullAttributes;
        this.methods = methods;
        this.genericMethods = genericMethods;
    }
    stringify() {
        return `<struct:${this.name}>`;
    }
    getName() {
        return `${this.name}`;
    }
    getObj(context, target) {
        const methods = {};
        const e = Object.entries({...this.methods, ...this.genericMethods});

        for (let i = 0; i < e.length; i++) {
            const method = e[i];
            const oldText = context.text;
            let type;
            if (method[1] instanceof MethodFunc && !(method[1] instanceof AutoMethodFunc)) {
                type = method[1].return_type.getValue(context);
                if (!type || !(type instanceof Type || type instanceof Union || type instanceof TypedValueType)) throw Error("invalid type " + this.type.formattedCode);
                
                if (type.name !== "null") {
                    const scanContext = new ScanContext();
                    method[1].content.scan(scanContext);
                    if (!scanContext.returns)
                        throw Error("not all code paths return a value");
                }
            }
            const oldOffset = context.argOffset ?? 0;
            context.argOffset = 1;
            context.text = `~ ${method[1].key}\n`;
            if (method[1] instanceof AutoMethodFunc)
                context.functionDataLayers.push({"kind":"auto_function","return_type":".any","branch":[],"args":method[1].params,"hasSelf":true});
            else
                context.functionDataLayers.push({"kind":"function","return_type":type,"branch":[],"args":method[1].params,"hasSelf":true});
            context.selfDataLayers ??= [];
            context.selfDataLayers.push({"type":"struct","data":this});
            if (method[1] instanceof AutoMethodFunc)
                context.scope.newLayer(Object.fromEntries([[method[1].typeName,new GenericType()]]));
            context.scope.newLayer(Object.fromEntries(method[1].params.map((p,i) => [`.arg${i}`, p.type.getValue(context)])));
            method[1].content.compile(context);
            context.functionDataLayers.pop();
            context.selfDataLayers.pop();
            context.scope.exitLayer();
            if (method[1] instanceof AutoMethodFunc)
                context.scope.exitLayer();
            methods[method[0]] = context.text + "~";
            context.text = oldText;
            context.argOffset = oldOffset;
        }
        const attributes = {};
        const compiledAttributes = [];
        const e2 = Object.entries({...this.attributes,...this.nullAttributes});
        for (let i = 0; i < e2.length; i++) {
            const attribute = e2[i];
            if (attribute[1]["value"]) {
                const attribute_type = attribute[1]["type"]?.getValue(context) ?? attribute[1]["value"].getType(context);
                const temp = attribute[1]["value"].getType(context);
                if (!isTypeSafeStrict(temp, attribute_type))
                    throw Error("attribute type is " + temp.getName() + " while the attribute type is " + attribute_type.getName());
                
                switch (attribute[1]["value"].kind) {
                    case "string": case "number":
                        attributes[attribute[0]] = attribute[1]["value"].value;
                        break;
                    default:
                        compiledAttributes.push(attribute);
                        break;
                }
            }
        }
        context.text += `set obj ${target.id} ${JSON.stringify({"methods": methods,"attributes": attributes})}\n`;
        if (compiledAttributes.length > 0) {
            const atkey = randomStr();
            const temp = randomStr();
            context.text += `set str ${atkey} attributes\nobj get ${target.id} ${temp} ${atkey}\n`;
            for (let i = 0; i < compiledAttributes.length; i++) {
                const attribute = compiledAttributes[i];
                const target2 = new Target(randomStr());
                attribute[1]["value"].compile(context, target2);
                const key = randomStr();
                context.text += `set str ${key} ${attribute[0]}\nobj set ${temp} ${key} ${target2.id}\n`;
            }
        }
    }
}
class StructInstance extends Value {
    constructor(name) {
        super();

        this.type = name;
    }
    stringify() {
        return `<${this.name}>`;
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
    constructor(key, type, params) {
        super();
        this.funcType = "defined";
        this.key = key;
        this.return_type = type;
        this.params = params;
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
class MethodFunc extends Func {
    constructor(content, type, params) {
        super();
        this.funcType = "method";
        this.content = content;
        this.return_type = type;
        this.params = params;
        this.key = randomStr();
    }
}
class AutoFunc extends DefinedFunc {
    constructor(key, params, typeName) {
        super(key, ".any", params);
        this.funcType = "auto";
        this.typeName = typeName;
    }
}
class AutoMethodFunc extends MethodFunc {
    constructor(key, params, typeName) {
        super(key, ".any", params);
        this.funcType = "auto_method";
        this.typeName = typeName;
    }
}

class Script {
    constructor(code) {
        this.node = new Node(code, new ParseContext());
    }

    compile(context, target, fs) {
        context ??= new CompileContext();
        context.fs = fs;
        this.node.compile(context, target);
        return context.functionText + context.text;
    }
}

// NODEJSREQUIRED

function getDefaultFs() {
    return importFs("D:/Flufi-OS/FCL/packages");
}

function importFs(path) {
    return Object.fromEntries(fs.readdirSync(path).map(f => {
        if (f.split(".").length == 2 && f.split(".")[1] == "fcl")
            return [f.split(".")[0],new Script(fs.readFileSync(path+"/"+f,"utf-8"))];
        if (f.split(".").length == 1)
            return [f,importFs(path+"/"+f)];
    }).filter(f => !!f));
}

// NODE JS

const fs = require('fs');

const c = fs.readFileSync('node/code.fcl', 'utf8');
console.time("parse");
const script = new Script(c);
//console.log(JSON.stringify(script, null, "  "));
console.timeEnd("parse");
const fclfs = getDefaultFs();
console.time("compile");
try {
    const compiled = script.compile(null, null, fclfs);
    console.timeEnd("compile");
    fs.writeFileSync('node/code.fbl', compiled, 'utf8');
} catch (e) {
    fs.writeFileSync('node/code.fbl', e.toString(), 'utf8');
    throw e;
}
