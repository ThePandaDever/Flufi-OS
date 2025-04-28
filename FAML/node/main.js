
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

    }

    stringify(padding="") {
        return `${padding}App {}`;
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
                this.data[keyPair[0]] = new ScriptValue(keyPair[1]);
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

class ScriptValue {
    constructor(code) {
        this.code = code;
        this.formattedCode = code.split("\n").map(l => l.trim()).join("\\n");
        this.parse(code);
    }

    parse(code) {
        switch (code) {
            case "false":
                this.type = "bool";
                this.value = false;
                return;
            case "true":
                this.type = "bool";
                this.value = true;
                return;
        }

        const format = text => text.split("\n").map(l => l.trim()).join("\\n");
        throw Error("unknown value: " + format(code));
    }

    stringify(padding) {
        return `<${this.type}>`;
    }
}

const code = `
variables {
    didClick: false
}
app {
    loc ~ 2 0 -50
    square 100 20 : c:prim
    ^- [clicked] {
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
console.log(script.stringify());
