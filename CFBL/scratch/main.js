function randomStr(r=10){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n="";for(let t=0;t<r;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}
function removeStr(e){if(!('"'==e[0]&&'"'==e[e.length-1]||"'"==e[0]&&"'"==e[e.length-1]))return e;let l=e.replaceAll("\\n","");return(l=(l=l.replaceAll('\\"',"")).replaceAll("\\'","")).replace(/\uE000/g,"\n").replace(/\uE001/g,'"').replace(/\uE002/g,"'").slice(1,-1)}
function splitCharedCommand(t,e){const i=[];let r="",s=!1,n=!1,u=0,c=0,o=0,l=!1;for(let p=0;p<t.length;p++){const m=t[p];if(l)r+=m,l=!1;else if("\\"!==m)if('"'!==m||n||0!==u||0!==c||0!==o)if("'"!==m||s||0!==u||0!==c||0!==o){if(!s&&!n){if("("===m){u++,r+=m;continue}if("{"===m){c++,r+=m;continue}if("["===m){o++,r+=m;continue}if(")"===m&&u>0){u--,r+=m;continue}if("}"===m&&c>0){c--,r+=m;continue}if("]"===m&&o>0){o--,r+=m;continue}}m!==e||s||n||0!==u||0!==c||0!==o?r+=m:r.length>0&&(i.push(r.trim()),r="")}else n=!n,r+=m;else s=!s,r+=m;else l=!0,r+=m}return r.length>0&&i.push(r.trim()),i}
function splitComparison(t,i){i=i.filter(t=>">"!==t&&"<"!==t);let r=RegExp(`(${i.map(escapeRegExp).join("|")})`),$=[],s="",e=!1,m=!1,p=0,u=0,l=0;for(let n=0;n<t.length;n++){let h=t[n],o=t[n+1],_=t[n-1],f="\\"===_&&"'"===h,a="\\"===_&&'"'===h;"'"!==h||m||f||p||u||l?'"'!==h||e||a||p||u||l||(m=!m):e=!e,!e&&!m&&("["===h?p++:"]"===h?p--:"{"===h?u++:"}"===h?u--:"("===h?l++:")"===h&&l--),!r.test(h+o)||e||m||0!==p||0!==u||0!==l?![">","<"].includes(h)||e||m||0!==p||0!==u||0!==l?s+=h:(s.trim()&&$.push(s.trim()),$.push(h),s=""):(s.trim()&&$.push(s.trim()),$.push(h+o),s="",n++)}return s.trim()&&$.push(s.trim()),$}
function splitKeys(t){const e=[];let i="",r=0,s=0,n=0,u=!1,c="";for(let o=0;o<t.length;o++){const l=t[o];u?(i+=l,l===c&&(u=!1)):'"'!==l&&"'"!==l?("("===l&&r++,"{"===l&&s++,"["===l&&n++,")"===l&&r--,"}"===l&&s--,"]"===l&&n--,"["!==l||1!==n?"]"!==l||0!==n?i+=l:(i+=l,0===r&&0===s&&(e.push(i.trim()),i="")):(0===r&&0===s&&""!==i&&(e.push(i.trim()),i=""),i+=l)):(u=!0,c=l,i+=l)}return i.length>0&&e.push(i.trim()),e}
function removeBrackets(t){return t.replace(/^\(|\)$/g,"").trim()}
function removeSquareBrackets(t){return t.replace(/^\[|\]$/g,"").trim()}
function isCurlyBrackets(t){return"string"==typeof t&&("{"==t[0]&&"}"==t[t.length-1])}
function isSquareBrackets(t){return"string"==typeof t&&("["==t[0]&&"]"==t[t.length-1])}
function isBrackets(t){return"string"==typeof t&&("("==t[0]&&")"==t[t.length-1])}
function isNoBrackets(t){return"string"==typeof t&&!(isBrackets(t)||isCurlyBrackets(t)||isSquareBrackets(t))}
function splitLogic(t){const e=[];let i="",r=!1,s=!1,n=0,u=0,c=0,o=!1;const l=/(\|\||&&)/;for(let p=0;p<t.length;p++){const m=t[p];if(o)i+=m,o=!1;else if("\\"!==m){if("'"!==m||s||o?'"'!==m||r||o||(s=!s):r=!r,r||s||("["===m?n++:"]"===m?n--:"{"===m?u++:"}"===m?u--:"("===m?c++:")"===m&&c--),!r&&!s&&0===n&&0===u&&0===c){const r=t.slice(p).match(l);if(r&&0===r.index){i.trim()&&(e.push(i.trim()),i=""),e.push(r[0]),p+=r[0].length-1;continue}}i+=m}else o=!0,i+=m}return i.trim()&&e.push(i.trim()),e}
function splitOperators(t,e){const i=[];let r="",s=!1,n=!1,u=0,c=0,o=0,l=!1;for(let p=0;p<t.length;p++){const m=t[p];l?(l=!1,r+=m):"\\"!==m?"'"!==m||n||u||c||o?'"'!==m||s||u||c||o?s||n?r+=m:("["===m?u++:"]"===m?u--:"{"===m?c++:"}"===m?c--:"("===m?o++:")"===m&&o--,e.includes(m)&&0===u&&0===c&&0===o?"+"!=m||"+"==m&&"+"!=t[p-1]&&"+"!=t[p+1]?(r.trim()&&i.push(r.trim()),i.push(m),r=""):("+"==m&&"+"==t[p+1]&&(i.push(r.trim()),r=""),r+=m,"+"==m&&"+"==t[p-1]&&(i.push(r.trim()),r="")):r+=m):(l||(n=!n),r+=m):(l||(s=!s),r+=m):(l=!0,r+=m)}return r.trim()&&i.push(r.trim()),i}
function splitCommand(t){const e=[];let i="",r=!1,s="",n=0,u=0,c=0,o=!1;for(let l=0;l<t.length;l++){const p=t[l];o?(i+=p,o=!1):"\\"!==p?r?(i+=p,p===s&&(r=!1)):'"'===p||"'"===p?(r=!0,s=p,i+=p):"("===p?(0===n&&0===u&&0===c?(i.trim()&&e.push(i.trim()),i="("):i+="(",n++):")"===p?(n--,0===n&&0===u&&0===c?(i+=")",i.trim()&&e.push(i.trim()),i=""):i+=")"):"{"===p?(0===n&&0===u&&0===c&&(i.trim()&&e.push(i.trim()),i=""),u++,i+=p):"}"===p?(u--,i+=p,0===n&&0===u&&0===c&&(i.trim()&&e.push(i.trim()),i="")):"["===p?(c++,i+=p):"]"===p?(c--,i+=p,0===n&&0===u&&0===c&&(""!==i&&e.push(i.trim()),i="")):i+=p:(o=!0,i+=p)}return""!==i&&e.push(i.trim()),e}
const isNumeric = (t) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);
const isValidVariable = (t) => /^[A-Za-z0-9_]+$/.test(t)
function escapeRegExp(r){return r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}

/*
list:
    win:
        Win.create() ->
            returns a new Window id (that corresponds to a Window)
        Win.get(id) ->
            returns an object of the Window's id
        Win.set(id, data)
            sets an Window's data to that object
        Win.getKey(id, key) ->
            returns the key on the specified Window
        Win.setKey(id, key, data)
            sets the key on a Window to some data
        Win.resetTimeout(id)
            resets the Window's timeout

        Win.panel.update()
            updates the Window panel with the current panel
        Win.panel.base()
            draws the Window base
        
        Win.getMouseX(id)
            gets the local mouse x
        Win.getMouseY(id)
            gets the local mouse y

        Win.focused
            returns the id of the focused window
        Win.hovered
            returns the id of the hovered window
    panel:
        Panel.clear()
            clears the current panel
        Panel.rect(x,y,w,h,b)
            draws a rectangle at x,y with size w,h, with a border of b
        Panel.icon(icon,x,y,size)
            draws an icon at x,y with size
        Panel.text(text,x,y,size)
            draws text at x,y with size
        Panel.cenText(text,x,y,size)
            draws centered text at x,y with size
        Panel.panel(panelData,x,y,size)
            adds an embedded panel at x,y with size
        Panel.clip(x1,y1,x2,y2)
            creates a clipping layer from x1,y1 to x2,y2
        Panel.clipExit()
            exits out a clipping layer
        Panel.color(c)
            sets the current color
        Panel.direction(d)
            sets the current direction
        Panel.get() ->
            gets the current panel
        Panel.startLine(w)
            starts a line segment
        Panel.linePoint(x,y)
            adds a point onto the line segment
        Panel.endLine()
            ends and draws the line segment
        Panel.file(path,x,y,size)
            draws a file at x,y
        Panel.image(url, x, y, size, stretch_x, stretch_y)
            draws an image (stretch_x and y's default is 100)
    
    process:
        Process.store(key, value)
            stores a key in the process
        Process.get(key)
            returns the value of the key
        Process.launch(path, ?data)
            launches a process
    input:
        Input.mouseX
            gets the x of the mouse
        Input.mouseY
            gets the y of the mouse
        Input.mouseLeftDown
            checks if the left mouse button is down
        Input.mouseLeftClick
            checks if the left mouse buttons has been clicked that frame
    fs:
        fs.get(path)
            returns the file's content
        fs.list(dirPath)
            returns an array of file names in that directory (with file types)
    json:
        json.parse(string) ->
            returns the parsed json object
        json.stringify(obj) ->
            returns the stringified json object
    network:
        fetch(url) ->
            returns the fetched url

other commands:
    exit
        exits and shuts down the process
    exit "label"
        exits and returns to a label on next frame
    label "name"
        defines a label
*/

let funcArgs = [];

function compileFunction(tokens, name, args, argKeys) {
    switch (tokens[0]) {
        case "Win.create":
            return `win create ${name}\n`;
        case "Win.get":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}win getData ${argKeys[0]} ${name}\n`;
            break;
        case "Win.set":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}win setData ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Win.getKey":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}win getKey ${argKeys[0]} ${argKeys[1]} ${name}\n`;
            break;
        case "Win.setKey":
            if (args.length == 3)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}win setKey ${argKeys[0]} ${argKeys[1]} ${argKeys[2]}\n`;
            break;
        case "Win.resetTimeout":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}win timeout ${argKeys[0]}\n`;
            break;
        case "Win.panel.update":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}win panel update ${argKeys[0]}\n`;
            break;
        case "Win.panel.base":
            if (args.length == 1 || args.length == 2)
                return `${compileValue(args[0], argKeys[0])}win panel base ${argKeys[0]}\n`;
            break;
        case "Win.getMouseX":
            if (args.length == 1)
                return compileValue(`Input.mouseX - Win.getKey(${args[0]},"position")[0]`, name);
            break;
        case "Win.getMouseY":
            if (args.length == 1)
                return compileValue(`Input.mouseY - Win.getKey(${args[0]},"position")[1]`, name);
            break;
        case "Win.buttons":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}win buttons ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Win.topbar":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}win topbar ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Win.setPosition":
            if (args.length == 2)
                return compileValue(`Win.setKey(${args[0]},"position",${args[1]})`, name);
            break;
        case "Win.setSize":
            if (args.length == 2)
                return compileValue(`Win.setKey(${args[0]},"size",${args[1]})`, name);
            break;
        case "Win.setTitle":
            if (args.length == 2)
                return compileValue(`Win.setKey(${args[0]},"title",${args[1]})`, name);
            break;
        case "Win.setGrabbable":
            if (args.length == 2)
                return compileValue(`Win.setKey(${args[0]},"grabbable",${args[1]})`, name);
            break;
        case "Win.setResizable":
            if (args.length == 2)
                return compileValue(`Win.setKey(${args[0]},"resizable",${args[1]})`, name);
            break;
        case "Win.getPosition":
            if (args.length == 1)
                return compileValue(`Win.getKey(${args[0]},"position")`, name);
            break;
        case "Win.getSize":
            if (args.length == 1)
                return compileValue(`Win.getKey(${args[0]},"size")`, name);
            break;
        case "Win.getTitle":
            if (args.length == 1)
                return compileValue(`Win.getKey(${args[0]},"title")`, name);
            break;
        case "Win.getGrabbable":
            if (args.length == 1)
                return compileValue(`Win.getKey(${args[0]},"grabbable")`, name);
            break;
        case "Win.getResizable":
            if (args.length == 1)
                return compileValue(`Win.getKey(${args[0]},"resizable")`, name);
            break;

        case "Panel.clear":
            return `panel clear\n`;
        case "Panel.rect":
            if (args.length == 5)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}${compileValue(args[4], argKeys[4])}panel rect ${argKeys[0]} ${argKeys[1]} ${argKeys[2]} ${argKeys[3]} ${argKeys[4]}\n`;
            break;
        case "Panel.icon":
            if (args.length == 4)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}panel icon ${argKeys[1]} ${argKeys[2]} ${argKeys[3]} ${argKeys[0]}\n`;
            break;
        case "Panel.text":
            if (args.length == 4)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}panel text ${argKeys[1]} ${argKeys[2]} ${argKeys[3]} ${argKeys[0]}\n`;
            break;
        case "Panel.cenText":
            if (args.length == 4)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}panel centext ${argKeys[1]} ${argKeys[2]} ${argKeys[3]} ${argKeys[0]}\n`;
            break;
        case "Panel.panel":
            if (args.length == 4)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}panel panel ${argKeys[1]} ${argKeys[2]} ${argKeys[3]} ${argKeys[0]}\n`;
            break;
        case "Panel.clip":
            if (args.length == 4)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}panel clip ${argKeys[0]} ${argKeys[1]} ${argKeys[2]} ${argKeys[3]}\n`;
            break;
        case "Panel.clipExit":
            return `panel clipexit\n`;
        case "Panel.color":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}panel color ${argKeys[0]}\n`;
            break;
        case "Panel.direction":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}panel direction ${argKeys[0]}\n`;
            break;
        case "Panel.get":
            return `panel get ${name}\n`;
        case "Panel.startLine":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}panel linestart ${argKeys[0]}\n`;
            break;
        case "Panel.linePoint":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}panel linepoint ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Panel.endLine":
            return `panel lineend\n`;
        case "Panel.file":
            if (args.length == 4)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}panel file ${argKeys[0]} ${argKeys[1]} ${argKeys[2]} ${argKeys[3]}\n`;
            break;
        case "Panel.image":
            if (args.length == 6)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}${compileValue(args[3], argKeys[3])}${compileValue(args[4], argKeys[4])}${compileValue(args[5], argKeys[5])}panel image ${argKeys[0]} ${argKeys[1]} ${argKeys[2]} ${argKeys[3]} ${argKeys[4]} ${argKeys[5]}\n`;
            break;

        case "Process.store":
            if (args.length == 2)
                return `${compileValue("\"var_\" + (" + args[0] + ")", argKeys[0])}${compileValue(args[1], argKeys[1])}proc store ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Process.get":
            if (args.length == 1)
                return `${compileValue("\"var_\" + (" + args[0] + ")", argKeys[0])}proc get ${argKeys[0]} ${name}\n`;
            break;
        case "Process.launch":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}proc launch ${argKeys[0]}\n`;
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}proc launch ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Process.getData":
            return `${compileValue(args[0], argKeys[0])}proc getData ${argKeys[0]} ${name}\n`;
        case "Process.kill":
            return `${compileValue(args[0], argKeys[0])}proc kill ${argKeys[0]}\n`;
        
        case "fs.get":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}fs get ${name} ${argKeys[0]}\n`;
            break;
        case "fs.list":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}fs list ${name} ${argKeys[0]}\n`;
            break;
        case "json.parse":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}json parse ${name} ${argKeys[0]}\n`;
            break;
        case "json.stringify":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}json stringify ${name} ${argKeys[0]}\n`;
            break;

        case "fetch":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}fetch ${name} ${argKeys[0]}\n`;
            break;
        
        case "Terminal.create":
            return `terminal create ${name}\n`;
        case "Terminal.getText":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}terminal getText ${argKeys[0]} ${name}\n`;
            break;
        case "Terminal.setText":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}terminal setText ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Terminal.run":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}terminal run ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Terminal.write":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}terminal write ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Terminal.delete":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}terminal delete ${argKeys[0]}\n`;
            break;
        case "Terminal.running":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}terminal running ${argKeys[0]} ${name}\n`;
            break;
        case "Terminal.get":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}terminal get ${argKeys[0]} ${name}\n`;
            break;
        
        case "Input.init":
            return `input init\n`;
        case "Input.get":
            return `input get ${name}\n`;
        case "Input.set":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}input set ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "Input.pop":
            return `input pop ${name}\n`;

        case "str.slice":
            if (args.length == 3)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}${compileValue(args[2], argKeys[2])}slice ${name} ${argKeys[0]} ${argKeys[1]} ${argKeys[2]}\n`;
        case "str.repeat":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}repeat ${name} ${argKeys[0]} ${argKeys[1]}\n`;
        
        
        case "FTL.run":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ftl run ${name} ${argKeys[0]}\n`;
            break;
        case "FTL.runWithFuncs":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}ftl runwithfuncs ${name} ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "FTL.runTerminal":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}ftl runterminal ${name} ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "FTL.setCommand":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}ftl setcommand ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "FTL.getCommand":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ftl getcommand ${name} ${argKeys[0]}\n`;
            break;
        
        case "WS.connect":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ws connect ${name} ${argKeys[0]}\n`;
            break;
        case "WS.send":
            if (args.length == 2)
                return `${compileValue(args[0], argKeys[0])}${compileValue(args[1], argKeys[1])}ws send ${argKeys[0]} ${argKeys[1]}\n`;
            break;
        case "WS.pop":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ws pop ${name} ${argKeys[0]}\n`;
            break;
        case "WS.isConnected":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ws isconnected ${name} ${argKeys[0]}\n`;
            break;
        case "WS.connected":
            return `ws connected ${name}\n`;
        case "WS.hasNew":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ws hasNew ${name} ${argKeys[0]}\n`;
            break;
        case "WS.getAll":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ws getAll ${name} ${argKeys[0]}\n`;
            break;
        case "WS.disconnect":
            if (args.length == 1)
                return `${compileValue(args[0], argKeys[0])}ws disconnect ${argKeys[0]}\n`;
            break;
        case "WS.disconnectAll":
            if (args.length == 1)
                return `ws disconnectall\n`;
            break;
    }
}

function compileScript(code) {
    let newScript = "";

    const lines = code.split(/[\n;]+/);

    let depth = 0;
    const depthStack = [];

    for (let i = 0; i < lines.length; i++) {
        const line = splitCharedCommand(lines[i].trim()," ");
        if (line.length > 0) {
            if (line[1] === "=" && isNoBrackets(line[0])) {
                const objKeys = splitKeys(line[0]);
                if (objKeys.length == 2 && isSquareBrackets(objKeys[1])) {
                    const key = removeSquareBrackets(objKeys[1]);
                    const keyKey = compileValueKey(key);
                    const value = line.slice(2).join(" ");
                    const valueKey = compileValueKey(value);
                    newScript += `${compileValue(key,keyKey)}${compileValue(value,valueKey)}obj set var_${objKeys[0]} ${keyKey} ${valueKey}\n`;
                } else {
                    const key = compileValueKey(line.slice(2).join(" "));
                    newScript += `${compileValue(line.slice(2).join(" "), key)}dupe var_${line[0]} ${key}\n`;
                }
                continue;
            }
            if (["+=","-=","*=","/=","%="].includes(line[1])) {
                const val = randomStr();
                newScript += `${compileValue(line.slice(2).join(" "), val)}${{"+=":"add","-=":"sub","*=":"mul","/=":"div","%=":"mod"}[line[1]]} var_${line[0]} var_${line[0]} ${val}\n`;
                continue;
            }

            switch (line[0]) {
                case "fn":
                    funcArgs = line.slice(2);
                    newScript += `~ ${line[1]}\n`;
                    depth ++;
                    break;
                case "end":
                    depth --;
                    if (depth > 0 || depthStack.length > 0) {
                        const depthStackItem = depthStack.pop();
                        if (depthStackItem) {
                            switch (depthStackItem[0]) {
                                case "if":
                                    newScript += `: ${depthStackItem[1]}\n`;
                                    break;
                                case "while":
                                    if (depthStackItem[2].length >= 0) {
                                        const condKey = randomStr();
                                        newScript += `${compileValue(depthStackItem[2], condKey)}ji ${depthStackItem[1]} ${condKey}\n`;
                                    }
                                    break;
                                case "until":
                                    if (depthStackItem[2].length >= 0) {
                                        const condKey = randomStr();
                                        newScript += `${compileValue(depthStackItem[2], condKey)}\njn ${depthStackItem[1]} ${condKey}\n`;
                                    }
                                    break;
                                case "Panel.clip":
                                    newScript += `panel clipexit\n`;
                                    break;
                                case "forever":
                                    newScript += `quitTo ${depthStackItem[1]}\n`;
                                    break;
                                case "switch":
                                    newScript += `: ${depthStackItem[1]}\n`;
                                    break;
                                case "case": case "caseif":
                                    newScript += `jp ${depthStackItem[3]}\n`;
                                    newScript += `: ${depthStackItem[1]}\n`;
                                    break;
                            }
                        }
                    } else {
                        newScript += "~\n";
                        funcArgs = [];
                    }
                    break;
                case "print":
                    const name = compileValueKey(line[1]);
                    newScript += compileValue(line[1], name);
                    newScript += `print ${name}\n`;
                    break;
                case "if":
                    depth ++;
                    const lbl = randomStr();
                    const cond = line.slice(1).join(" ");
                    const condKey = compileValueKey(cond);
                    depthStack.push(["if",lbl]);
                    newScript += `${compileValue(cond, condKey)}jn ${lbl} ${condKey}\n`;
                    break;
                case "while":
                    depth ++;
                    const whileLbl = randomStr();
                    const whileCond = line.slice(1).join(" ");
                    depthStack.push(["while",whileLbl,whileCond]);
                    newScript += `: ${whileLbl}\n`;
                    break;
                case "until":
                    depth ++;
                    const untilLbl = randomStr();
                    const untilCond = line.slice(1).join(" ");
                    depthStack.push(["until",untilLbl,untilCond]);
                    newScript += `: ${untilLbl}\n`;
                    break;
                case "forever":
                    depth ++;
                    const foreverLbl = randomStr();
                    depthStack.push(["forever",foreverLbl]);
                    newScript += `quitTo ${foreverLbl}\n: ${foreverLbl}\n`;
                    break;
                case "switch":
                    depth ++;
                    const switchLbl = randomStr();
                    const switchValue = line.slice(1).join(" ");
                    const switchValueKey = compileValueKey(switchValue);
                    depthStack.push(["switch",switchLbl,switchValueKey]);
                    newScript += compileValue(switchValue,switchValueKey);
                    break;
                case "case":
                    depth ++;
                    const caseLatestDepth = depthStack[depthStack.length - 1];
                    if ((caseLatestDepth ?? [])[0] == "switch") {
                        const caseLbl = randomStr();
                        const caseValue = line.slice(1).join(" ");
                        const caseValueKey = compileValueKey(caseValue);
                        depthStack.push(["case",caseLbl,caseValue,caseLatestDepth[1]]);
                        newScript += `${compileValue(caseValue, caseValueKey)}jne ${caseLbl} ${caseValueKey} ${caseLatestDepth[2]}\n`;
                    } else {
                        throw Error("case outside switch");
                    }
                    break;
                case "caseif":
                    depth ++;
                    const caseifLatestDepth = depthStack[depthStack.length - 1];
                    if ((caseifLatestDepth ?? [])[0] == "switch") {
                        const caseLbl = randomStr();
                        const caseValue = line.slice(1).join(" ");
                        const caseValueKey = compileValueKey(caseValue);
                        depthStack.push(["case",caseLbl,caseValue,caseifLatestDepth[1]]);
                        newScript += `${compileValue(caseValue, caseValueKey)}jn ${caseLbl} ${caseValueKey}\n`;
                    } else {
                        throw Error("case outside switch");
                    }
                    break;
                case "return":
                    const data = line.slice(1).join(" ");
                    const dataKey = compileValueKey(data);
                    newScript += `${compileValue(data, dataKey)}ret ${dataKey}\n`
                    break;
                case "Panel.clip":
                    depth ++;
                    depthStack.push(["Panel.clip"]);
                    const x1Key = compileValueKey(line[1]);
                    const y1Key = compileValueKey(line[2]);
                    const x2Key = compileValueKey(line[3]);
                    const y2Key = compileValueKey(line[4]);
                    newScript += `${compileValue(line[1], x1Key)}${compileValue(line[2], y1Key)}${compileValue(line[3], x2Key)}${compileValue(line[4], y2Key)}panel clip ${x1Key} ${y1Key} ${x2Key} ${y2Key}\n`;
                    break;
                case "exit":
                    if (line.length == 1) {
                        newScript += "quit\n";
                    } else if (line.length == 2) {
                        newScript += `quitTo ${line[1]}\n`;
                    }
                    break;
                case "label":
                    newScript += `: ${line[1]}`;
                    break;
                default:
                    if (line[0]) {
                        const commandTokens = splitCommand(line.join(" ").trim());
                        if (commandTokens.length == 2 && isNoBrackets(commandTokens[0]) && isBrackets(commandTokens[1])) {
                            const args = splitCharedCommand(removeBrackets(commandTokens[1]),",");
                            const argKeys = args.map(v => compileValueKey(v));
                            const builtin = compileFunction(commandTokens, randomStr(), args, argKeys);
                            newScript += builtin ? builtin :
                                `${args.map((v,i) => compileValue(v, argKeys[i])).join("")}call ${commandTokens[0]} ${argKeys.join(" ")}\n`
                        }
                    }
            }
        }
    }

    return newScript;
}

function compileValue(code, name) {
    const pipe = splitCharedCommand(code, " ");
    if (pipe.length > 2 && pipe[pipe.length-2] == "|>") {
        const op = pipe.pop();
        pipe.pop();
        const a = pipe.join(" ");
        const aKey = compileValueKey(a);
        return `${compileValue(a, aKey)}${op} ${name} ${aKey}\n`;
    }
    const logic = splitLogic(code);
    if (logic.length > 2) {
        const b = logic.pop();
        const log = logic.pop();
        const a = logic.join("");
        const aKey = compileValueKey(a);
        const bKey = compileValueKey(b);
        return `${compileValue(a, aKey)}${compileValue(b, bKey)}${{"||":"or","&&":"and"}[log]} ${name} ${aKey} ${bKey}\n`;
    }
    const comp = splitComparison(code,["==","!=",">","<",">=","<="]);
    if (comp.length == 3) {
        const b = comp.pop();
        const c = comp.pop();
        const a = comp.join("");
        const aKey = compileValueKey(a);
        const bKey = compileValueKey(b);
        switch (c) {
            case "==": case ">": case "<":
                return `${compileValue(a, aKey)}${compileValue(b, bKey)}${{"==":"eql",">":"gtr","<":"sml"}[c]} ${name} ${aKey} ${bKey}\n`;
            case ">=": case "<=":
                const oKey = randomStr();
                const eKey = randomStr();
                return `${compileValue(a, aKey)}${compileValue(b, bKey)}${{">=":"gtr","<=":"sml"}[c]} ${oKey} ${aKey} ${bKey}\neql ${eKey} ${aKey} ${bKey}\nor ${name} ${oKey} ${eKey}\n`;
            case "!=":
                const iKey = randomStr();
                return `${compileValue(a, aKey)}${compileValue(b, bKey)}eql ${iKey} ${aKey} ${bKey}\ninv ${name} ${iKey}\n`;
        }
    }
    const ops = splitOperators(code,["+","-","*","/","%"]);
    if (ops.length > 2) {
        const b = ops.pop();
        const op = ops.pop();
        const a = ops.join("");
        const aKey = compileValueKey(a);
        const bKey = compileValueKey(b);
        return `${compileValue(a, aKey)}${compileValue(b, bKey)}${{"+":"add","-":"sub","*":"mul","/":"div","%":"mod"}[op]} ${name} ${aKey} ${bKey}\n`;
    }
    if (code[0] == "!") {
        const aKey = randomStr();
        return `${compileValue(code.slice(1), aKey)}inv ${name} ${aKey}\n`;
    }
    const keyTokens = splitKeys(code);
    if (keyTokens.length > 1) {
        if (isSquareBrackets(keyTokens[keyTokens.length-1])) {
            const key = removeSquareBrackets(keyTokens.pop());
            const value = keyTokens.join("");
            const keyKey = compileValueKey(key);
            const valueKey = compileValueKey(value);
            return `${compileValue(value,valueKey)}${compileValue(key, keyKey)}obj get ${valueKey} ${name} ${keyKey}\n`;
        }
    }
    try {
        obj = JSON.parse(code);
        if (typeof obj === "object") {
            return `set obj ${name} ${code}\n`;
        }
    } catch {}
    const commandTokens = splitCommand(code);
    if (commandTokens.length == 2 && isNoBrackets(commandTokens[0]) && isBrackets(commandTokens[1])) {
        const args = splitCharedCommand(removeBrackets(commandTokens[1]),",");
        const argKeys = args.map(v => compileValueKey(v));

        const builtin = compileFunction(commandTokens, name, args, argKeys);
        if (builtin)
            return builtin;

        return `${args.map((v,i) => compileValue(v, argKeys[i])).join("")}callget ${name} ${commandTokens[0]} ${argKeys.join(" ")}\n`
    }
    if (isBrackets(code))
        return compileValue(removeBrackets(code), name);
    if (code[0] == "\"" && code[code.length-1] == "\"")
        return `set str ${name} ${removeStr(code)}\n`;
    if (isNumeric(code))
        return `set num ${name} ${code}\n`;
    switch (code) {
        case "true":
            return `set bool ${name} true\n`;
        case "false":
            return `set bool ${name} false\n`;
        case "newline":
            return `dupe ${name} newline\n`;
        case "Time.deltaTime":
            return `const dt ${name}\n`;
        case "Time.fps":
            return `const fps ${name}\n`;
        case "Screen.width":
            return `const screenwidth ${name}\n`;
        case "Screen.height":
            return `const screenheight ${name}\n`;
        case "Input.mouseX":
            return `const mousex ${name}\n`;
        case "Input.mouseY":
            return `const mousey ${name}\n`;
        case "Input.mouseLeftDown":
            return `const mouseld ${name}\n`;
        case "Input.mouseLeftClick":
            return `const mouselc ${name}\n`;
        case "Win.selected":
            return `const winselected ${name}\n`;
        case "Win.focused":
            return `const winfocused ${name}\n`;
        case "Win.buttons.default":
            return `const winbuttonsdefault ${name}\n`;
        case "Process.list":
            return `proc list ${name}\n`;
        case "Process.this":
            return `proc this ${name}\n`;
    }
    if (isValidVariable(code)) {
        return ``;
    }
    if (code) {
        throw Error("unknown value '" + code + "'");
    }
    return `\n`;
}

function compileValueKey(code) {
    return funcArgs.indexOf(code) >= 0 ? `arg${funcArgs.indexOf(code)}` : (isValidVariable(code) && !isNumeric(code)) ? "var_" + code : randomStr();
}

window.flf ??= {};
flf.cfbl ??= {};
flf.cfbl.compileFunction = compileFunction;
flf.cfbl.compileScript = compileScript;
flf.cfbl.compileValue = compileValue;
flf.cfbl.compileValueKey = compileValueKey;

(function(Scratch) {
    'use strict';

    class CFBL {
        getInfo() {
            return {
                id: 'flfcfbl',
                name: 'CFBL Language',
                color1: "#7a60fc",
                blocks: [
                    {
                        opcode: 'compileValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Compile Value [text], value id: [name]',
                        arguments: {
                            text: { type: Scratch.ArgumentType.STRING, defaultValue: 'sin(5)' },
                            name: { type: Scratch.ArgumentType.STRING, defaultValue: 'myID' }
                        }
                    },
                    {
                        opcode: 'compileScript',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Compile [text]',
                        arguments: {
                            text: { type: Scratch.ArgumentType.STRING, defaultValue: 'fn main; print "hi"; end' },
                        }
                    },
                ]
            };
        }

        compileValue({ text, name }) {
            return compileValue(text, name);
        }
        compileScript({ text }) {
            return compileScript(text);
        }
    }

    Scratch.extensions.register(new CFBL());
})(Scratch);