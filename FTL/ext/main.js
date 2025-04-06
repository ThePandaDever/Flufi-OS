function initFTL() {
    flf.ftl ??= {};
    flf.ftl.commands ??= {
        "echo": function(data, args) {
            data.funcs.logFunc(args.map(a => flf.ftl.runValue(a, data)));
        },
        "if": function(data, args) {
            const cond = flf.ftl.runValue(args[0], data);
            data["lastStackValue"] = cond;
            return flf.ftl.runValue(args.slice(1).join(" "), data);
        },
        "then": function(data, args) {
            if (data["lastStackValue"] && args[0])
                return flf.ftl.runValue(args[0], data);
        },
        "else": function(data, args) {
            if (!data["lastStackValue"] && args[0])
                return flf.ftl.runValue(args[0], data);
        },
        "return": function(data, args) {
            return flf.ftl.runValue(args[0], data);
        }
    };

    flf.ftl.run = runFTL;
    flf.ftl.runCommand = runCommandFTL;
    flf.ftl.runValue = runValueFTL;
    flf.ftl.runSegment = runSegmentFTL;
}

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

function runFTL(code, funcs, data) {
    funcs ??= {}

    funcs.logFunc ??= function(text) {
        console.log(...text);
    }

    data ??= {};
    data["funcs"] = funcs

    return runSegmentFTL(code, data);
}
function runCommandFTL(code, data) {
    code = code.trim();
    if (!code) {return}
    const spaceTokens = split(code, " ").filter(t => !!t.trim());
    if (flf?.ftl?.commands[spaceTokens[0]]) {
        const command = flf.ftl.commands[spaceTokens[0]];
        if (command instanceof Function) {
            return command(data, spaceTokens.slice(1));
        }
        return command.code(data, spaceTokens.slice(1));
    }
    throw Error("unknown command: " + spaceTokens[0].split("\n").map(l => l.trim()).join("\\n"));
}
function runValueFTL(code, data) {
    code = code.trim();
    if (!code) {return}
    const lines = split(code, ["\n",";"], true).filter(l => !!l.trim());
    if (lines.length > 1) {
        return runSegmentFTL(code, data);
    }

    if (is(code,"single-q") || is(code,"double-q") || is(code,"back-q"))
        return unExcape(code.slice(1,-1));
    if (is(code,"bracket"))
        return runCommandFTL(code.slice(1,-1), data);
    if (is(code,"curly"))
        return runSegmentFTL(code.slice(1,-1), data);

    switch (code) {
        case "true":
            return true;
        case "false":
            return false;
    }

    try {
        return runCommandFTL(code, data);
    } catch {}

    if (/^[A-Za-z0-9_./]+$/.test(code)) {
        return code;
    }

    throw Error("unknown syntax: `" + code.split("\n").map(l => l.trim()).join("\\n") + "`");
}
function runSegmentFTL(code, data) {
    code = code.trim();
    const lines = split(code, ["\n",";"], true).filter(l => !!l.trim());
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const out = runCommandFTL(line, data);
        if (out) {
            return out;
        }
    }
}

(function(Scratch) {
    'use strict';

    class FTL {
        getInfo() {
            return {
                id: 'flfftl',
                name: 'FTL Language',
                color1: "#db51b0",
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "Execution" },
                    {
                        opcode: 'run',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Run [code]',
                        arguments: {
                            code: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo "hi :3"' },
                        }
                    },
                    {
                        opcode: 'runWithFuncs',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Run [code] with Functions [funcs]',
                        arguments: {
                            code: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo "hi :3"' },
                            funcs: { type: Scratch.ArgumentType.STRING, defaultValue: '<js object of funcs>' },
                        }
                    },
                    {
                        opcode: 'runInTerminal',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Run [code] in [terminal]',
                        arguments: {
                            code: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo "hi :3"' },
                            terminal: { type: Scratch.ArgumentType.STRING, defaultValue: 'terminalInstanceID' },
                        }
                    },
                    {
                        opcode: 'runWithFuncsInTerminal',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Run [code] with Functions [funcs] in [terminal]',
                        arguments: {
                            code: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo "hi :3"' },
                            funcs: { type: Scratch.ArgumentType.STRING, defaultValue: '<js object of funcs>' },
                            terminal: { type: Scratch.ArgumentType.STRING, defaultValue: 'terminalInstanceID' },
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Environment" },
                    {
                        opcode: 'setCommand',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set Command [key] to [value]',
                        arguments: {
                            key: { type: Scratch.ArgumentType.STRING, defaultValue: 'myCommand' },
                            value: { type: Scratch.ArgumentType.STRING, defaultValue: '<js object or function>' },
                        }
                    },
                    {
                        opcode: 'getCommand',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get Command [key]',
                        arguments: {
                            key: { type: Scratch.ArgumentType.STRING, defaultValue: 'myCommand' },
                        }
                    },
                    "---",
                    {
                        opcode: 'init',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Init',
                    },
                ]
            };
        }

        run({ code }) {
            return runFTL(code);
        }
        runWithFuncs({ code, funcs }) {
            return runFTL(code, funcs);
        }
        runInTerminal({ code, terminal }) {
            return runFTL(code, null, {"terminal":terminal});
        }
        runWithFuncsInTerminal({ code, funcs, terminal }) {
            return runFTL(code, funcs, {"terminal":terminal});
        }

        setCommand({ key, value }) {
            flf.ftl.commands[key] = value;
        }
        getCommand({ key }) {
            return flf.ftl.commands[key];
        }

        init() {
            initFTL();
        }
    }

    Scratch.extensions.register(new FTL());
})(Scratch);