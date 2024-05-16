const depthadd = [
    "func"
]
const depthless = [
    "end"
]

function print(val){
    console.log(val)
}

function splitby(text,by){
    tokens = [""]
    instring = false
    otherchar = false
    for (const char of text) {
        if (char == '"'){
            instring = !instring
        }
        if (char == by && !instring){
            if (otherchar) {
                tokens.push("")
            }
        }
        else{
            tokens[tokens.length-1] = tokens[tokens.length-1] + char
            otherchar =  true
        }
    };
    return tokens
}

function parse(text){
    return splitby(text, " ")
}

function getend(code,line){
    end = true
    depth = 0
    while (end){
        cmd = parse(code[line])
        if (depthadd.includes(cmd[0])){depth ++}
        if (depthless.includes(cmd[0])){depth --}
        if (cmd[0] == "end" && depth == 0){return line}
        line ++
        if (line==code.length){end=false}
    }
    return -1
}

function getfunc(code,func){
    out = null
    code.forEach(function (item, index) {
        cmd = parse(item)
        
        if (cmd[0] == "func"){
            if (cmd[1] == func){
                out = {"start":index,"end":getend(code,index)}
            }
        }
    })
    if (out == null){
        console.error(`couldnt find func "${func}"`)
        return {"start":-1,"end":-1}
    } else{
        return out
    }
}

function sametype(a,b){return a == b || a == "any" || b == "any"}

function eval(v,type){
    if (!sametype("any",type)){
      	etype = eval(v,"any")["type"]
        if (!sametype(type,etype)){
            console.log(`wanted ${type}, got ${etype}`)
        }
    }
  	if (v.split('"').length - 1 == 2){
    	return {"type":"string","value":v.replace(/^"(.*)"$/, '$1')}
    }
  	console.error(`couldnt eval ${v}`)
  	return {"type":"null","value":"null"}
}

function run(code,func,environment){
    var env = environment
    
    //setup
    env["func"] = getfunc(code,func)
    env["line"] = env["func"]["start"]
    
    script = []
    code.forEach(function (item, index) {
        cmd = parse(item)
        script.push(cmd)
        switch(cmd[0]) {
          case "func":
            break;
          case "end":
            break;
          case "print":
            break;
          case "":
            break;
          default:
            console.error(`unknown command "${cmd[0]}"`)
        }
    })
    
    //execution
    running = true
    while (running){
        cmd = script[env["line"]]
        
        //merging env with command output
        env = Object.assign({}, env, command(cmd,env));
        
        env["line"] = env["line"] + 1
        if (env["line"] > env["func"]["end"] -1){running = false}
    }
    
    return "ES1"
}

function command(cmd,env){
    if (cmd[0] == "print"){
        print(eval(cmd[1],"string")["value"])
    }
}

print(run([
    'func main',
    '  print "this is epico"',
    'end',
    'func test',
    '  print "):"',
    'end'
    ],"main",{})
);
