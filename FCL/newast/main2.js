
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
        console.log(tokens);
    }
}

const code = `
void main() {
}
`;

console.log(new Node(code));