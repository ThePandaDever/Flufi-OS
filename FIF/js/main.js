
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

function compile(code) {
    const tokens = split(code, [" ", "\n"]).filter(t => ![" ", "\n"].includes(t));
    const outSplit = [];
    const params = {};
    let isNeeded = false;
    
    const isNumeric = (t) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);
    const compileArg = (arg) => {const isNum = isNumeric(arg); if (!isNum) isNeeded = true; return isNum ? arg : ["arg",arg]}

    const shiftArg = () => compileArg(tokens.shift());

    while (tokens.length > 0) {
        let token = tokens.shift();

        switch (token) {
            case "#": {
                const kind = tokens.shift();
                switch (kind) {
                    case "param": {
                        const name = tokens.shift();
                        const param = {"name":name};
                        if (tokens[0] === "default") {
                            tokens.shift();
                            param["default"] = tokens.shift();
                        }
                        params[name] = param;
                    }
                }
                continue;
            }
            
            case "w":
                outSplit.push(["w", shiftArg()]);
                continue;
            case "c":
                outSplit.push(["c", shiftArg()]);
                continue;
            
            case "line":
                outSplit.push(["square", shiftArg(), shiftArg(), shiftArg(), shiftArg()]);
                continue;
            case "cont":
                outSplit.push(["square", shiftArg(), shiftArg()]);
                continue;
            case "square":
                outSplit.push(["square", shiftArg(), shiftArg(), shiftArg(), shiftArg()]);
                continue;
            case "dot":
                outSplit.push(["dot", shiftArg(), shiftArg()]);
                continue;
            case "cutcircle":
                outSplit.push(["cutcircle", shiftArg(), shiftArg(), shiftArg(), shiftArg(), shiftArg()]);
                continue;
            case "circle":
                outSplit.push(["cutcircle", shiftArg(), shiftArg(), shiftArg(), "0", "180"]);
                continue;
            case "ellipse":
                outSplit.push(["ellipse", shiftArg(), shiftArg(), shiftArg(), shiftArg(), shiftArg()]);
                continue;
        }

        throw Error("unexpected token '" + token + "'");
    }
    let out = outSplit.map(o => o.map(a => Array.isArray(a) ? a[0] + ":" + a[1] : a).join(" ")).join(" ");
    return {"icn":out.trim(),"split":outSplit,"params":params,"isNeeded":isNeeded};
}

function run(compiled, args) {
    args ??= {};
    return compiled["split"].map(c => c[0] + " " + c.slice(1).map(a => {
        if (a[0] == "arg") {
            const param = compiled["params"][a[1]];
            const arg = args[a[1]];
            if (param) {
                if (arg || param["default"]) {
                    return arg ?? param["default"];
                } else {
                    throw Error("arg '" + a[1] + "' not given");
                }
            } else {
                return "0";
            }
        }
        return a.toString();
    }).join(" ").trim()).join(" ").trim();
}

const code = `
# param funny default 2
# param crazy

line -10 crazy 0 funny
`;

console.log(run(compile(code)));