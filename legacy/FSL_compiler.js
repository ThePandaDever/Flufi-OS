// Name: FSL
// By: @mistium on discord
// Description: FSL compiles to js? very cool

(function(Scratch) {
    "use strict";

    const vm = Scratch.vm,
      runtime = vm.runtime;
  
    class PSL {
      getInfo() {
        return {
          id: 'FSL',
          name: 'FSL',
          blocks: [{
            opcode: 'compileFSL',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Compile FSL [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'print "hi"'
              },
            },
          }, ],
        };
      }

      compileFSL({CODE}) {
        this.jsCode = "";

        // Function to add indentation
        const beautify = (indentLevel) => {
          return '    '.repeat(indentLevel);
        };

        // Splitting the PSL code into lines
        const lines = CODE.split('\n');

        this.indentLevel = 0;

        // Loop through each line of PSL code
        lines.forEach(line => {
          // Trim whitespace from the line
          line = line.trim();
          line = line.replace(/<(.*)>/g, '($1)')
          line = line.replace(/([\( ])@([^ ]+)/g, '$1$2')
          // Ignore empty lines
          if (line === "") {
            return
          }

          // Splitting the line by space
          const tokens = line.split(' ');

          // Processing different PSL keywords
          switch (tokens[0]) {
            case 'func':
              let i = 0
              if (tokens.length > 2) {
                let inputs = tokens.filter((_, index) => index % 2 === 1)
                inputs = inputs.slice(1, inputs.length)
                this.jsCode += beautify(this.indentLevel) + 'function ' + tokens[1] + '(' + (inputs.length > 0 ? inputs : line) + ') {\n';
              } else {
                this.jsCode += beautify(this.indentLevel) + 'function ' + tokens[1] + '() {\n';
              }
              this.indentLevel++;
              break;
            case 'local':
              this.jsCode += beautify(this.indentLevel) + 'let ' + tokens[1] + ' = ' + tokens.slice(3, tokens.length).join(" ") + ';\n';
              break;
            case 'print':
              this.jsCode += beautify(this.indentLevel) + 'console.log(' + tokens[1].replace('@', '') + ');\n';
              break;
            case 'while':
              this.jsCode += beautify(this.indentLevel) + 'while (' + tokens[1] + ') {\n';
              this.indentLevel++;
              break;
            case 'for':
              this.jsCode += beautify(this.indentLevel) + 'for (var ' + tokens[1] + ' = ' + tokens[3] + '; ' + tokens[1] + ' <= ' + tokens[4] + '; ' + tokens[1] + '++) {\n';
              this.indentLevel++;
              break;
            case 'js':
              this.jsCode += beautify(this.indentLevel) + tokens.slice(1,tokens.length).join(" ")
              break;
            case 'end':
              this.indentLevel--;
              this.jsCode += beautify(this.indentLevel) + '}\n';
              break;
            default:
              // Handling arithmetic operations and function calls
              if (line.includes('++') || line.includes('+=') || line.includes('-=') || line.includes('=')) {
                // Replace angle brackets with parentheses
                line = line.replace(/<(.*)>/g, '($1)');
                this.jsCode += beautify(this.indentLevel) + line + ';\n';
              } else {
                // Custom function call
                const parts = line.split(' ');
                const functionName = parts[0];
                this.inputs = tokens.filter((_, index) => index % 2 === 0).slice(1);

                // Check if the input is a string, and if it is, add double quotes around it
                this.inputs = this.inputs.map(input => typeof input === 'string' && (input[0] + input[input.length - 1] != '""') ? `"${input}"` : input);
                this.jsCode += beautify(this.indentLevel) + functionName + '(' + this.inputs.join(', ') + ');\n';
              }
              break;
          }
        });
        return this.jsCode + "main()";
      }
    }
      Scratch.extensions.register(new PSL());
    })(Scratch);
