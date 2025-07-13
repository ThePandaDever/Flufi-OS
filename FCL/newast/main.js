
function tokenise(str) {
    const splitters = [
        "!","?",
        ":",";",",",".","\\",
        "(",")","[","]","{","}","<",">",
        "+","-","*","/","%","^",
        "|","&",
    ]

    let tokens = [];
    while (str) {
        const matches = str.match(/\w+|\W/);
        tokens.push(matches[0]);
        str = str.slice(matches[0].length);
    }
    return tokens
}

const token_table = {
    "\n": "newline", " ": "space",

    "'": "single_quote", "\"": "double_quote", "`": "back_quote",

    ":": "colon", ";": "semi_colon", ",": "comma", ".": "period", "\\": "back_quote",

    "(": "paren_open", ")": "paren_close",
    "[": "square_open", "]": "square_close",
    "{": "curly_open", "}": "curly_close",
    "<": "angle_left", ">": "angle_right"
};
const token_ignore = {
    "symbol": [
        "newline", "space"
    ]
};

function convert(tokens) {
    return tokens.map(t => {
        if (token_table[t]) {
            return {
                "kind": "symbol",
                "data": token_table[t],
                "raw": t
            }
        } else {
            return {
                "kind": "text",
                "data": t,
                "raw": t
            }
        }
    });
}

function throwError(text, node) {
    throw text;
}

class Node {
    constructor(tokens, start, end) {
        if (!Array.isArray(code))
            tokens = convert(tokenise(tokens.toString()));
        this.parse(tokens, start, end);
    }

    parse(tokens, start, end) {
        const shift = () => countToken(tokens.shift());
        const nodeUpdateShift = (node) => {
            nodeUpdate(node);
            console.log(node);
            shift();
        }
        const nodeUpdate = (node) => {
            data.last = node;
        }
        const countToken = (token) => {
            switch (token.kind) {
                case "symbol":
                    switch (token.data) {
                        case "paren_open":
                            data.parenDepth ++;
                            break
                        case "paren_close":
                            data.parenDepth --;
                            break
                        case "square_open":
                            data.squareDepth ++;
                            break
                        case "square_close":
                            data.squareDepth --;
                            break
                        case "curly_open":
                            data.curlyDepth ++;
                            break
                        case "curly_close":
                            data.curlyDepth --;
                            break
                    }
                    break
            }
            return token;
        }

        const expect = (expects) => {
            const token = shift();
            if (token_ignore[token.kind]?.includes(token.data))
                return token;
            
            let is = false;
            for (let i = 0; i < expects.length; i++) {
                const rule = expects[i];
                if (rule.kind == token.kind && rule.data == token.data)
                    is = true;
            }
            if (!is)
                throwError(`wanted ${expects.map(r => `${r.kind} ${r.data}`).join(" or ")} but got ${token.kind} ${token.data}`);
            return token;
        };
        const skip = () => {
            while (is.Tokens.Ignored(tokens[0]))
                shift();
        }

        const expects = {
            Tokens: Object.fromEntries(
                Object.values(token_table).map(
                    token => [token, new Function(`return expect(["${token}"])`)]
                )
            ), // generates an object of basically { tokenName: () => expects(["tokenName"]) }

            DefineArgList: () => {
                skip();
                const parenDepth = data.parenDepth;
                console.log("arg list",tokens, parenDepth);
                skip();
            }
        };

        const is = {
            Tokens: {
                Type: (token) => {
                    const list = [
                        "str", "num", "bool",

                        "null",
                        "func"
                    ]
                    return token.kind == "text" && list.includes(token.data);
                },

                Identifier: (token) => {
                    return token.kind == "text" && /[a-zA-Z0-9]+/.test(token.data);
                },

                Ignored: (token) => {
                    return token_ignore[token.kind]?.includes(token.data)
                }
            },

            Type: (node) => {
                return ["type"].includes(node.kind);
            },
            Keyword: (node, type) => {
                return node.kind == "keyword" && (type != null ? node.data == type : true);
            },

            FuncDefType: (node) => {
                return is.Type(node) || is.Keyword(node, "void");
            }
        };

        console.log(tokens);

        const data = {
            last: null, // the last node

            parenDepth: 0,
            squareDepth: 0,
            curlyDepth: 0,
        }

        while (tokens.length > 0) {
            let token = tokens[0];

            // if its for example a whitespace, skip it
            if (is.Tokens.Ignored(token)) {
                shift();
                continue;
            }

            /* function def */ {
                if (data.last && is.FuncDefType(data.last) && is.Tokens.Identifier(token)) { // if the last token was a valid type
                    const nameToken = token;
                    shift();

                    expect([{kind:"symbol",data:"paren_open"}]);
                    expects.DefineArgList();
                    expect([{kind:"symbol",data:"paren_close"}]);

                    skip();

                    expect([{kind:"symbol",data:"curly_open"}]);

                    expect([{kind:"symbol",data:"curly_close"}]);

                    nodeUpdateShift(this);
                    continue;
                }
            }

            /* types */ {
                if (is.Tokens.Type(token)) {
                    this.kind = "type";
                    this.data = token.data;
                    nodeUpdateShift(this);
                    continue;
                }
            }

            /* keywords */ {
                if (token.kind == "text") {
                    switch (token.data) {
                        case "void":
                            this.kind = "keyword";
                            this.data = token.data;
                            nodeUpdateShift(this);
                            continue;
                    }
                }
            }

            throwError(`unexpected ${token.kind} token ${token.data}`, this);
        }
    }
}

const code = `
void main() {
}
`;

console.log(new Node(code));