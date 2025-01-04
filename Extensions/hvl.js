(function(Scratch) {
    "use strict";
    const {BlockType, ArgumentType} = Scratch;

    if (!Scratch.extensions.unsandboxed)
        throw new Error("Panel maker doesnt work in sandboxed mode.")
    
    // utils
    function removeCurlyBrackets(r){return r.replace(/^\{|\}$/g,"").trim()}function removeSquareBrackets(r){return r.replace(/^\[|\]$/g,"").trim()}function removeBrackets(r){return r.replace(/^\(|\)$/g,"").trim()}function isCurlyBrackets(r){return"string"==typeof r&&"{"==r[0]&&"}"==r[r.length-1]}function isSquareBrackets(r){return"string"==typeof r&&"["==r[0]&&"]"==r[r.length-1]}function isBrackets(r){return"string"==typeof r&&"("==r[0]&&")"==r[r.length-1]}function isNoBrackets(r){return"string"==typeof r&&!["(","[","{"].includes(r[0])&&![")","]","}"].includes(r[1])}

    // splitters
    function splitByFirstChar(i,n){let t=(i=i.trim()).indexOf(n);return -1===t?[i]:[i.slice(0,t).trim(),i.slice(t+1).trim()]}function splitCharedCommand(i,n){let t=[],e="",$=!1,u=!1,f=0,c=0,o=0,r=!1;for(let l=0;l<i.length;l++){let h=i[l];if(r){e+=h,r=!1;continue}if("\\"===h){r=!0,e+=h;continue}if('"'===h&&!u&&0===f&&0===c&&0===o){$=!$,e+=h;continue}if("'"===h&&!$&&0===f&&0===c&&0===o){u=!u,e+=h;continue}if(!$&&!u){if("("===h){f++,e+=h;continue}if("{"===h){c++,e+=h;continue}if("["===h){o++,e+=h;continue}if(")"===h&&f>0){f--,e+=h;continue}if("}"===h&&c>0){c--,e+=h;continue}if("]"===h&&o>0){o--,e+=h;continue}}h!==n||$||u||0!==f||0!==c||0!==o?e+=h:e.length>0&&(t.push(e.trim()),e="")}return e.length>0&&t.push(e.trim()),t}
    function splitSegment(input) {
        let result = [];
        let current = "";

        let inSingleQuotes = false;
        let inDoubleQuotes = false;

        let bracketDepth = 0;
        let squareDepth = 0;
        let curlyDepth = 0;

        let i = -1;
        for (let char of input) {
            i++;

            // Handle escaped quotes
            const prevChar = i > 0 ? input[i - 1] : null;
            const isEscapedQuote = prevChar === '\\';

            // Toggle quotes unless the quote is escaped
            if (char === '"' && !inSingleQuotes && !isEscapedQuote) {
                inDoubleQuotes = !inDoubleQuotes;
            }
            if (char === "'" && !inDoubleQuotes && !isEscapedQuote) {
                inSingleQuotes = !inSingleQuotes;
            }

            let inAnyQuotes = inSingleQuotes || inDoubleQuotes;

            // Handle other characters when not inside quotes
            if (!inAnyQuotes) {
                switch (char) {
                    case "{":
                        curlyDepth++;
                        current += char;
                        break;
                    case "}":
                        curlyDepth--;
                        current += char;
                        break;
                    case "[":
                        squareDepth++;
                        current += char;
                        break;
                    case "]":
                        squareDepth--;
                        current += char;
                        if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0 && input[i + 1] !== "(") {
                            if (current) {
                                result.push(current.trim());
                                current = "";
                            }
                        }
                        break;
                    case "(":
                        bracketDepth++;
                        current += char;
                        break;
                    case ")":
                        bracketDepth--;
                        current += char;
                        break;
                    case ";":
                        if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                            if (current) {
                                result.push(current.trim());
                                current = "";
                            }
                        } else {
                            current += char;
                        }
                        break;
                    default:
                        current += char;
                }
            } else {
                current += char;
            }
        }

        // Push any remaining part if necessary
        if (current) {
            result.push(current.trim());
        }

        return result;
    }

    function runCode(code) {
        let out = [];
        const elements = splitSegment(code);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const bracketTokens = splitByFirstChar(element,"[");
            if (bracketTokens.length == 2) {
                bracketTokens[1] = "[" + bracketTokens[1]
                if (isNoBrackets(bracketTokens[0]) && isSquareBrackets(bracketTokens[1])) {
                    console.log(bracketTokens);
                } else {
                    console.error("element must follow syntax: type [data]")
                }
            } else {
                console.error("unknown token '" + element + "'")
            }
        }
        return out;
    }
    function runNode(code) {
        if ((code[0] == '"' && code[code.length-1] == '"') || (code[0] == "'" && code[code.length-1] == "'")) {
            return code.slice(1, -1).replace(/\\"/g, '"');
        }
    }

    class FTL {
        constructor() {
        }
        getInfo() {
            return {
                id: "flfHvl",
                name: "HVL Language",
                color1: "#eb346b",
                blocks: [{
                    opcode: "run",
                    blockType: BlockType.REPORTER,
                    text: "Eval [code]",
                    arguments: {
                        code: {
                            type: ArgumentType.STRING,
                            defaultValue: "button [color: #ffffff, xPos: 0, yPos: 0, width: 100, height: 50, border: 10, text: \"Hello World!\", textcolor: #000000, onclick: {brdc Login}]"
                        },
                        representation: {
                            type: ArgumentType.STRING,
                            defaultValue: "json",
                            menu: 'obj_representation'
                        }
                    }
                }, ],
                menus: {
                    obj_representation: {
                        acceptReporters: true,
                        items: ['json', 'object']
                    }
                }
            }
        }

        run({code, representation}) {
            let out = runCode(code);
            if (representation == "json") {
                out = JSON.stringify(out)
            }
            return out;
        }
    }

    Scratch.extensions.register(new FTL());
}
)(Scratch);