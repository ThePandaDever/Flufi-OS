(function(Scratch) {
    'use strict';

    const { BlockType, ArgumentType } = Scratch;


    if (!window.flf) {
        window.flf = {};
    }
    if (!window.flf.console) {
        window.flf.console = {
            consoleData: [],
            log: function(...args) {
                window.flf.console.consoleData.push([args, 'log']);
            },
            warn: function(...args) {
                window.flf.console.consoleData.push([args, 'warn']);
            },
            error: function(...args) {
                window.flf.console.consoleData.push([args, 'error']);
            },
        };
    }

    class Console {
        getInfo() {
            return {
                id: 'flfconsole',
                name: 'Console',
                color1: "#994299",
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: 'Logging' },
                    {
                        opcode: 'log',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Log [text]',
                        arguments: {
                            text: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello, world!' }
                        }
                    },
                    {
                        opcode: 'warn',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Warn [text]',
                        arguments: {
                            text: { type: Scratch.ArgumentType.STRING, defaultValue: 'Warning!' }
                        }
                    },
                    {
                        opcode: 'error',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Error [text]',
                        arguments: {
                            text: { type: Scratch.ArgumentType.STRING, defaultValue: 'Error!' }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: 'Management' },
                    {
                        opcode: 'getConsoleData',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get Console Data as [representation]',
                        arguments: {
                            representation: { type: Scratch.ArgumentType.STRING, defaultValue: 'json', menu: 'obj_representation' }
                        }
                    },
                    {
                        opcode: 'clearConsoleData',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Clear Console Data'
                    },
                    {
                        opcode: 'outputConsoleData',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Output Console Data'
                    }
                ],
                menus: {
                    obj_representation: {
                        acceptReporters: true,
                        items: [
                            'json',
                            'object'
                        ]
                    }
                }
            };
        }

        log({ text }) {
            window.flf.console.log(text);
        }
        warn({ text }) {
            window.flf.console.warn(text);
        }
        error({ text }) {
            window.flf.console.error(text);
        }

        getConsoleData({ representation }) {
            const data = window.flf.console.consoleData;
            if (representation === 'json') { return JSON.stringify(data); }
            return data;
        }
        clearConsoleData() {
            window.flf.console.consoleData = [];
        }
        outputConsoleData() {
            for (const [text, type] of window.flf.console.consoleData) {
                switch (type) {
                    case 'log':
                        console.log(...text);
                        break
                    case 'warn':
                        console.warn(...text);
                        break
                    case 'error':
                        console.error(...text);
                        break
                }
            }
        }
    }

    Scratch.extensions.register(new Console());
})(Scratch);