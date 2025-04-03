function split(text, type, useendbracket) {
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
function unExcape(text) {
    let current = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char == "\\") { current += text[i + 1]; i ++; continue; }

        current += char;
    }
    return current;
}
function is(text, type) {
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

function run(code, funcs) {
    funcs ??= {}

    funcs.logFunc ??= function(text) {
        console.log(...text);
    }

    const data = {
        funcs: funcs
    };

    return runSegment(code, data);
}
function runCommand(code, data) {
    code = code.trim();
    if (!code) {return}
    const spaceTokens = split(code, " ").filter(t => !!t.trim());
    switch (spaceTokens[0]) {
        case "echo":
            data.funcs.logFunc(spaceTokens.slice(1).map(a => runValue(a, data)));
            return;
        case "if": {
            const cond = runValue(spaceTokens[1], data);
            data["lastStackValue"] = cond;
            return runValue(spaceTokens.slice(2).join(" "), data);
        }
        case "then": {
            if (data["lastStackValue"] && spaceTokens[1])
                return runValue(spaceTokens[1], data);
            break;
        }
        case "else": {
            if (!data["lastStackValue"] && spaceTokens[1])
                return runValue(spaceTokens[1], data);
            break;
        }
        case "return":
            return runValue(spaceTokens[1], data);
        default:
            throw Error("unknown command: " + spaceTokens[0].split("\n").map(l => l.trim()).join("\\n"));
    }
}
function runValue(code, data) {
    code = code.trim();
    if (!code) {return}
    const lines = split(code, ["\n",";"], true).filter(l => !!l.trim());
    if (lines.length > 1) {
        return runSegment(code, data);
    }

    if (is(code,"single-q") || is(code,"double-q") || is(code,"back-q"))
        return unExcape(code.slice(1,-1));
    if (is(code,"bracket"))
        return runCommand(code.slice(1,-1), data);
    if (is(code,"curly"))
        return runSegment(code.slice(1,-1), data);

    switch (code) {
        case "true":
            return true;
        case "false":
            return false;
    }

    throw Error("unknown syntax: `" + code.split("\n").map(l => l.trim()).join("\\n") + "`");
}
function runSegment(code, data) {
    code = code.trim();
    const lines = split(code, ["\n",";"], true).filter(l => !!l.trim());
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const out = runCommand(line, data);
        if (out) {
            return out;
        }
    }
}

run(`
if true
echo {then "funny"; else "sad"}
`)
