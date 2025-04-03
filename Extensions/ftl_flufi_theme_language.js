(function(Scratch) {
    "use strict";
    const {BlockType, ArgumentType} = Scratch;

    // utils
    Object.clone = function(e) {
        if (null === e)
            return null;
        if ("object" == typeof e) {
            if (Array.isArray(e))
                return e.map((e => Object.clone(e)));
            if (e instanceof RegExp)
                return new RegExp(e);
            {
                let n = {};
                for (let r in e)
                    e.hasOwnProperty(r) && (n[r] = Object.clone(e[r]));
                return n
            }
        }
        return e
    }
    ;
    Object.merge = function(e, t) {
        if ("object" != typeof e || "object" != typeof t)
            return t;
        {
            let o = Object.clone(e);
            for (let r in t)
                t.hasOwnProperty(r) && ("object" == typeof t[r] ? o[r] = Object.merge(e[r], t[r]) : o[r] = t[r]);
            return o
        }
    }
    ;

    // splitter functions
    function splitLogic(t){let i=[],e="",$=!1,n=!1,r=0,u=0,s=0,l=!1,c=/(\|\||&&)/;for(let m=0;m<t.length;m++){let h=t[m];if(l){e+=h,l=!1;continue}if("\\"===h){l=!0,e+=h;continue}if("'"!==h||n||l?'"'!==h||$||l||(n=!n):$=!$,!$&&!n&&("["===h?r++:"]"===h?r--:"{"===h?u++:"}"===h?u--:"("===h?s++:")"===h&&s--),!$&&!n&&0===r&&0===u&&0===s){let f=t.slice(m).match(c);if(f&&0===f.index){e.trim()&&(i.push(e.trim()),e=""),i.push(f[0]),m+=f[0].length-1;continue}}e+=h}return e.trim()&&i.push(e.trim()),i}function splitOperators(t){let i=["+","-","*","/"],e=[],$="",n=!1,r=!1,u=0,s=0,l=0,c=!1;for(let m=0;m<t.length;m++){let h=t[m];if(c){c=!1,$+=h;continue}if("\\"===h){c=!0,$+=h;continue}"'"!==h||r||u||s||l?'"'!==h||n||u||s||l?n||r?$+=h:("["===h?u++:"]"===h?u--:"{"===h?s++:"}"===h?s--:"("===h?l++:")"===h&&l--,i.includes(h)&&0===u&&0===s&&0===l?"+"!=h||"+"==h&&"+"!=t[m-1]&&"+"!=t[m+1]?($.trim()&&e.push($.trim()),e.push(h),$=""):("+"==h&&"+"==t[m+1]&&(e.push($.trim()),$=""),$+=h,"+"==h&&"+"==t[m-1]&&(e.push($.trim()),$="")):$+=h):(c||(r=!r),$+=h):(c||(n=!n),$+=h)}return $.trim()&&e.push($.trim()),e}function splitComparsion(t){let i=/(==|!=|~=|:=|>=|<=)/,e=[],$="",n=!1,r=!1,u=0,s=0,l=0;for(let c=0;c<t.length;c++){let m=t[c],h=t[c+1],f=t[c-1],o="\\"===f&&"'"===m,p="\\"===f&&'"'===m;"'"!==m||r||o||u||s||l?'"'!==m||n||p||u||s||l||(r=!r):n=!n,!n&&!r&&("["===m?u++:"]"===m?u--:"{"===m?s++:"}"===m?s--:"("===m?l++:")"===m&&l--),!i.test(m+h)||n||r||0!==u||0!==s||0!==l?![">","<"].includes(m)||n||r||0!==u||0!==s||0!==l?$+=m:($.trim()&&e.push($.trim()),e.push(m),$=""):($.trim()&&e.push($.trim()),e.push(m+h),$="",c++)}return $.trim()&&e.push($.trim()),e}function splitStatement(t){let i=[],e="",$=0,n=0,r=!1,u="",s=0;for(;s<t.length;){let l=t[s],c="\\"===t[s-1];'"'!==l&&"'"!==l||c||(r?l===u&&(r=!1):(r=!0,u=l)),r?e+=l:"("===l?(n++,e+=l):")"===l?(n--,e+=l):"{"===l?(0===n&&0===$&&e.trim()&&(i.push(e.trim()),e=""),e+=l,$++):"}"===l?($--,e+=l,0===n&&0===$&&e.trim()&&(i.push(e.trim()),e="")):";"===l&&0===$&&0===n?(i.push(e.trim()),e=""):e+=l,s++}return e.trim()&&i.push(e.trim()),i}function splitSegment(t){let i=[],e="",$=!1,n=!1,r=0,u=0,s=0,l=-1;for(let c of t){let m="\\"===(++l>0?t[l-1]:null);if('"'!==c||$||m||(n=!n),"'"!==c||n||m||($=!$),$||n)e+=c;else switch(c){case"{":s++,e+=c;break;case"}":s--,e+=c,0===r&&0===s&&0===u&&"("!==t[l+1]&&e&&(i.push(e.trim()),e="");break;case"[":u++,e+=c;break;case"]":u--,e+=c;break;case"(":r++,e+=c;break;case")":r--,e+=c;break;case";":0===r&&0===s&&0===u?e&&(i.push(e.trim()),e=""):e+=c;break;default:e+=c}}return e&&i.push(e.trim()),i}function splitAssignment(t){let i=[],e="",$=!1,n=!1,r=!0,u=0,s=0,l=0,c=["+","-","*","/"],m=c.concat("="),h=-1;for(let f of t){let o="\\"===(++h>0?t[h-1]:null);if('"'!==f||$||o||(n=!n),"'"!==f||n||o||($=!$),$||n)e+=f;else switch(f){case"{":l++,e+=f;break;case"}":l--,e+=f,0===u&&0===l&&0===s&&e&&(i.push(e.trim()),e="");break;case"[":s++,e+=f;break;case"]":s--,e+=f;break;case"(":u++,e+=f;break;case")":u--,e+=f;break;case"=":if(0===u&&0===l&&0===s&&r&&c.includes(t[h-1])&&r){e+=f,i.push(e.trim()),e="",r=!1;continue}0===u&&0===l&&0===s&&r?(c.includes(t[h-1])?((e+=f)&&i.push(e.trim()),e=""):(e.trim()&&i.push(e.trim()),i.push(f),e=""),r=!1):e+=f;break;default:c.includes(t[h+1])&&m.includes(t[h+2])&&r&&(e.trim()&&i.push(e.trim()),e=""),e+=f}}return e&&i.push(e.trim()),i}function splitByFirstChar(t,i){let e=(t=t.trim()).indexOf(i);return -1===e?[t]:[t.slice(0,e).trim(),t.slice(e+1).trim()]}function splitCharedCommand(t,i){let e=[],$="",n=!1,r=!1,u=0,s=0,l=0,c=!1;for(let m=0;m<t.length;m++){let h=t[m];if(c){$+=h,c=!1;continue}if("\\"===h){c=!0,$+=h;continue}if('"'===h&&!r&&0===u&&0===s&&0===l){n=!n,$+=h;continue}if("'"===h&&!n&&0===u&&0===s&&0===l){r=!r,$+=h;continue}if(!n&&!r){if("("===h){u++,$+=h;continue}if("{"===h){s++,$+=h;continue}if("["===h){l++,$+=h;continue}if(")"===h&&u>0){u--,$+=h;continue}if("}"===h&&s>0){s--,$+=h;continue}if("]"===h&&l>0){l--,$+=h;continue}}h!==i||n||r||0!==u||0!==s||0!==l?$+=h:$.length>0&&(e.push($.trim()),$="")}return $.length>0&&e.push($.trim()),e}function splitCommand(t){let i=[],e="",$=!1,n="",r=0,u=0,s=0,l=!1;for(let c=0;c<t.length;c++){let m=t[c];if(l){e+=m,l=!1;continue}if("\\"===m){l=!0,e+=m;continue}$?(e+=m,m===n&&($=!1)):'"'===m||"'"===m?($=!0,n=m,e+=m):"("===m?(0===r&&0===u&&0===s?(""!==e&&i.push(e.trim()),e="("):e+="(",r++):")"===m?0==--r&&0===u&&0===s?(""!=(e+=")")&&i.push(e.trim()),e=""):e+=")":"{"===m?(u++,e+=m):"}"===m?(u--,e+=m,0===r&&0===u&&0===s&&(""!==e&&i.push(e.trim()),e="")):"["===m?(s++,e+=m):"]"===m?(s--,e+=m,0===r&&0===u&&0===s&&(""!==e&&i.push(e.trim()),e="")):e+=m}return""!==e&&i.push(e.trim()),i}function splitReferences(t){let i=[],e="",$=0,n=0,r=0,u=!1,s="";for(let l=0;l<t.length;l++){let c=t[l];if(u){e+=c,c===s&&(u=!1);continue}if('"'===c||"'"===c){u=!0,s=c,e+=c;continue}if("("===c&&$++,"{"===c&&n++,"["===c&&r++,")"===c&&$--,"}"===c&&n--,"]"===c&&r--,"["===c&&1===r){0===$&&0===n&&""!==e&&(i.push(e.trim()),e=""),e+=c;continue}if("]"===c&&0===r){e+=c,0===$&&0===n&&(i.push(e.trim()),e="");continue}if(r>0){e+=c;continue}e+=c}return e.length>0&&i.push(e.trim()),i}function splitCommandParams(t){let i=[],e="",$=!1,n=!1,r=0,u=0,s=0;function l(){return $||n||r>0||u>0||s>0}for(let c=0;c<t.length;c++){let m=t[c];if(($||n)&&"\\"===m&&c+1<t.length){e+=m+t[c+1],c++;continue}'"'!==m||n?"'"!==m||$?"{"!==m||$||n?"}"!==m||$||n?"["!==m||$||n?"]"!==m||$||n?"("!==m||$||n?")"!==m||$||n?","!==m||l()?e+=m:(i.push(e.trim()),e=""):(s--,e+=m):(s++,e+=m):(u--,e+=m):(u++,e+=m):(r--,e+=m):(r++,e+=m):(n=!n,e+=m):($=!$,e+=m)}return e&&i.push(e.trim()),i}
    
    // utils
    function removeCurlyBrackets(input) {return input.replace(/^\{|\}$/g, '').trim();}
    function removeSquareBrackets(input) {return input.replace(/^\[|\]$/g, '').trim();}
    function removeBrackets(input) {return input.replace(/^\(|\)$/g, '').trim();}
    function removeStr(t){if('"'!=t[0]&&"'"!=t[0]||'"'!=t[t.length-1]&&"'"!=t[t.length-1])return t;{let e=t.replace(/\\\\n/g,"\uE000");return e=e.replace(/\\n/g,"\n"),e.replace(/\uE000/g,"\\n").slice(1,-1)}}function removeCurlyBrackets(t){return t.replace(/^\{|}$/g,"").trim()}function removeSquareBrackets(t){return t.replace(/^\[|\]$/g,"").trim()}function removeBrackets(t){return t.replace(/^\(|\)$/g,"").trim()}function removeComments(t){return t.replace(/(["'])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g,((t,e)=>e?t:""))}function isCurlyBrackets(t){return"string"==typeof t&&("{"==t[0]&&"}"==t[t.length-1])}function isSquareBrackets(t){return"string"==typeof t&&("["==t[0]&&"]"==t[t.length-1])}function isBrackets(t){return"string"==typeof t&&("("==t[0]&&")"==t[t.length-1])}function isNoBrackets(t){return"string"==typeof t&&!(isBrackets(t)||isCurlyBrackets(t)||isSquareBrackets(t))}const isNumeric=t=>/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);function isValidVariableFormat(t){return/^[A-Za-z0-9_@#]+$/.test(t)}function isValidFunctionFormat(t){return/^[A-Za-z0-9_.@#]+$/.test(t)}function isValidDefinitionFormat(t){return/^[A-Za-z0-9_.@# ]+$/.test(t)}function isValidAssignFormat(t){return/^[A-Za-z0-9_.@#\[\]\" ]+$/.test(t)}

    function isCurlyBrackets(input) {if (typeof input != "string") {return false} return input[0] == "{" && input[input.length - 1] == "}";}
    function isSquareBrackets(input) {if (typeof input != "string") {return false} return input[0] == "[" && input[input.length - 1] == "]";}
    function isBrackets(input) {if (typeof input != "string") {return false} return input[0] == "(" && input[input.length - 1] == ")";}
    function isNoBrackets(input) {if (typeof input != "string") {return false} return !["(","[","{"].includes(input[0]) && ![")","]","}"].includes(input[1])}
    const generateRandomId = () => {let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t="";for(let n=0;n<16;n++){let o=Math.floor(Math.random()*e.length);t+=e[o]}return t};

    var scopes = {};

    function shouldApply(key, e_type, e_class) {
        if (key == "all") {
            return true;
        }
        const tokens = splitCharedCommand(key,":");
        if (tokens.length == 2) {
            return tokens[0] == e_type && tokens[1] == e_class;
        } else if (tokens.length == 1) {
            return tokens[0] == e_type;
        }
    }
    function runCode(code, e_type, e_class, e_data) {
        let out = {};
        const topLayer = splitSegment(code);
        let statements = [];
        const scopeID = generateRandomId();
        for (let i = 0; i < topLayer.length; i++) {
            const tokens = splitStatement(topLayer[i]);
            if (tokens.length == 2) {
                if (isNoBrackets(tokens[0])) {
                    if (shouldApply(tokens[0], e_type, e_class)) {
                        statements.push(removeCurlyBrackets(tokens[1]));
                    }
                    continue;
                }
            }
            console.error("unknown statement type '" + topLayer[i] + "'")
        }
        scopes[scopeID] = {};
        try {
            scopes[scopeID] = JSON.parse(e_data);
        } catch (e) {}
        if (typeof e_data == "object") {
            scopes[scopeID] = Object.clone(e_data);
        }
        for (let i = 0; i < statements.length; i++) {
            const statement_out = runNode(splitSegment(statements[i]), e_type, e_class, e_data, scopeID);
            out = Object.merge(out, statement_out);
        }
        delete scopes[scopeID];
        return out;
    }
    function runNode(code, e_type, e_class, e_data, scopeID) {
        if (Array.isArray(code)) {
            let out = {};
            for (let i = 0; i < code.length; i++) {
                const command_out = runNode(code[i], e_type, e_class, e_data, scopeID);
                if (command_out && typeof command_out == "object" && !Array.isArray(command_out)) {
                    if (command_out["type"] == "assignment") {
                        out = Object.merge(out, command_out["data"]);
                    }
                }
            }
            return out;
        }
        code = code.trim();

        if (code[0] == "?") {
            let condition = runNode(code.slice(1), e_type, e_class, e_data, scopeID);
            return [(
                (condition[0] == true && condition[1] == "bool") ||
                (condition[0] > 0 && condition[1] == "number") ||
                (condition[0].length > 0 && condition[1] == "array") ||
                (Object.keys(condition[0]).length > 0 && condition[1] == "object") ||
                (condition[0] != "#000000" && condition[1] == "color")
            ),"bool"]
        }
        if (code[0] == "!") {
            let condition = runNode(code.slice(1), e_type, e_class, e_data, scopeID);
            return [!(
                (condition[0] == true && condition[1] == "bool") ||
                (condition[0] > 0 && condition[1] == "number") ||
                (condition[0].length > 0 && condition[1] == "array") ||
                (Object.keys(condition[0]).length > 0 && condition[1] == "object") ||
                (condition[0] != "#000000" && condition[1] == "color")
            ),"bool"]
        }
        
        const assignment_tokens = splitAssignment(code);
        if (assignment_tokens.length == 3) {
            if (assignment_tokens[1] == "=") {
                const keys = assignment_tokens[0].split(",").map(val => val.trim());
                const values = splitCharedCommand(assignment_tokens[2],",").map(val => val.trim());
                if (keys.length > 1 && values.length == 1) {
                    const value = runNode(values[0], e_type, e_class, e_data, scopeID);
                    if (value[1] != "array") {
                        console.error("cannot unpack non-array type '" + values[1] + "'");
                    }
                    let out = {};
                    for (let i = 0; i < keys.length; i++) {
                        if (keys[i][0] == "*") {
                            scopes[scopeID][keys[i].slice(1)] = value[0][i];
                        } else {
                            out[keys[i]] = value[i];
                            scopes[scopeID][keys[i]] = value[0][i];
                        }
                    }
                } else if (keys.length == values.length) {
                    let out = {};
                    for (let i = 0; i < keys.length; i++) {
                        if (keys[i][0] == "*") {
                            scopes[scopeID][keys[i].slice(1)] = runNode(values[i], e_type, e_class, e_data, scopeID);
                        } else {
                            out[keys[i]] = runNode(values[i], e_type, e_class, e_data, scopeID);
                            scopes[scopeID][keys[i]] = out[keys[i]];
                        }
                    }
                    return {"type":"assignment","data":out};
                } else {
                    console.error("unknown assignment type '" + code + "'");
                }
            }
        }
        
        const referenceTokens = splitReferences(code);
        if (referenceTokens.length > 1) {
            let ref = referenceTokens.pop();
            if (removeSquareBrackets(ref)) {
                ref = runNode(removeSquareBrackets(ref), e_type, e_class, e_data, scopeID);
                let out = runNode(referenceTokens.join(""), e_type, e_class, e_data, scopeID);
                if (out[1] == "array") {
                    if (ref[1] == "number") {
                        if (out[0][ref[0]]) {
                            return out[0][ref[0]];
                        }
                    }
                } else if (out[1] == "object") {
                    if (ref[1] == "string") {
                        if (out[0][ref[0]]) {
                            return out[0][ref[0]];
                        }
                    }
                }
                console.error("cannot get key of type " + ref[1] + " from type " + out[1]);
            }
        }

        if (isSquareBrackets(code)) {
            const values = splitByFirstChar(removeSquareBrackets(code),",");
            let out = [];
            for (let i = 0; i < values.length; i++) {
                out.push(runNode(values[i], e_type, e_class, e_data, scopeID));
            }
            return [out,"array"];
        }
        if (isCurlyBrackets(code)) {
            const values = splitByFirstChar(removeCurlyBrackets(code),",");
            let out = {};
            for (let i = 0; i < values.length; i++) {
                const key_value = splitByFirstChar(values[i],":");
                out[key_value[0]] = runNode(key_value[1], e_type, e_class, e_data, scopeID);
            }
            return [out,"object"];
        }

        if (isBrackets(code)) {
            return runNode(code, e_type, e_class, e_data, scopeID)
        }

        const operationTokens = splitOperators(code);
        if (operationTokens.length > 1) {
            let val = runNode(operationTokens[0], e_type, e_class, e_data, scopeID);
            let i = 1;
            while (i < operationTokens.length) {
                switch(operationTokens[i]) {
                    case "+":
                        i++;
                        const nextVal = runNode(operationTokens[i], e_type, e_class, e_data, scopeID);
                        if (val[1] != "number" && nextVal[1] != "number") {
                            val = [String(val[0]) + String(nextVal[0]), "string"];
                        } else {
                            val = [val[0] + nextVal[0], "number"];
                        }
                        break
                    case "-":
                        i ++;
                        val = [val[0] - runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    case "*":
                        i ++;
                        val = [val[0] * runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    case "/":
                        i ++;
                        val = [val[0] / runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    case "^":
                        i ++;
                        val = [val[0] ^ runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    case "*":
                        i ++;
                        val = [val[0] * runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    case "/":
                        i ++;
                        val = [val[0] / runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    case "^":
                        i ++;
                        val = [val[0] ^ runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    case "%":
                        i ++;
                        val = [val[0] % runNode(operationTokens[i], e_type, e_class, e_data, scopeID)[0],"number"];
                        break
                    default:
                        console.error("unknown token '" + operationTokens[i] + "'")
                }
                i ++;
            }
            return val;
        }

        const ternaryA = splitByFirstChar(code,"?");
        if (ternaryA.length == 2) {
            const condition = runNode(ternaryA[0], e_type, e_class, e_data, scopeID);
            const values = splitByFirstChar(ternaryA[1],":");
            const a = values[0];
            const b = values[1];
            return (
                (condition[0] == true && condition[1] == "bool") ||
                (condition[0] > 0 && condition[1] == "number") ||
                (condition[0].length > 0 && condition[1] == "array") ||
                (Object.keys(condition[0]).length > 0 && condition[1] == "object") ||
                (condition[0] != "#000000" && condition[1] == "color")
            ) ? runNode(a, e_type, e_class, e_data, scopeID) : runNode(b, e_type, e_class, e_data, scopeID);
        }

        if (isNumeric(code)) {
            return [Number(code),"number"];
        }

        const methodTokens = splitCharedCommand(code,".");
        if (methodTokens.length > 1) {
            const method = methodTokens.pop();
            const object = runNode(methodTokens.join("."), e_type, e_class, e_data, scopeID);
            switch (method) {
                case "length":
                    return [object.length,"number"];
            }
            if (object[method]) {
                return object[method];
            }
            console.error("unknown method '" + method + "'")
            return ["null","null"];
        }

        if (code[0] == "#") {
            return [code,"color"];
        }

        if (code == "true") {
            return [true,"bool"];
        }
        if (code == "false") {
            return [false,"bool"];
        }

        if (code[0] == '"' || code[code.length - 1] == '"') {
            return [removeStr(code.slice(1, -1)),"string"];
        }

        if (scopes[scopeID][code]) {
            return scopes[scopeID][code];
        }
        
        console.error("unknown node '" + code + "'")
        return ["null","null"];
    }

    class FTL {
        constructor() {
        }
        getInfo() {
            return {
                id: "flfFtl",
                name: "FTL Language",
                color1: "#eb346b",
                blocks: [{
                    opcode: "run",
                    blockType: BlockType.REPORTER,
                    text: "Run [code] with the element [e_type][e_class][e_data] as [representation]",
                    arguments: {
                        code: {
                            type: ArgumentType.STRING,
                            defaultValue: "rect{ border = true ? 5 : 2; color = #ffffff; } rect:wow{ color = #33ffff; }"
                        },
                        e_type: {
                            type: ArgumentType.STRING,
                            defaultValue: "rect"
                        },
                        e_class: {
                            type: ArgumentType.STRING,
                            defaultValue: "wow"
                        },
                        e_data: {
                            type: ArgumentType.STRING,
                            defaultValue: "{}"
                        },
                        representation: {
                            type: ArgumentType.STRING,
                            defaultValue: "json",
                            menu: 'obj_representation'
                        },
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

        run({code, e_type, e_class, e_data, representation}) {
            let out = runCode(code, e_type, e_class, e_data);
            if (representation == "json") {
                out = JSON.stringify(out)
            }
            return out;
        }
    }

    Scratch.extensions.register(new FTL());
}
)(Scratch);