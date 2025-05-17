
const fs = require('fs');

const code = process.argv[2];
const compiler = fs.readFileSync("D:/Flufi-OS/FCL/node/fbl.js", 'utf8').split("// NODE JS")[0];
console.log("compiled output:\n" + eval(compiler + `;const script = new Script(${JSON.stringify(code)});script.compile(null,null,getDefaultFs());`));