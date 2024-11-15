const readline = require('readline');
const KeyListener = require("./KeyListener");

class BufferedKeyListener extends KeyListener {
    constructor() {
        super();
        this.inputBuffer = '';
        this.onInputingCb = (str) => {}
    }

    onInputing (callback) {
        this.onInputingCb = callback
    }

    // getter
    get isInputBufferUsing () {
        return this.inputBuffer !== '';
    }

    readInputBuffer() {
        const value = this.inputBuffer;
        this.inputBuffer = '';
        return value;
    }

    start() {
        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', (chunk, key) => {
            if (key) {
                if (this.isInputBufferUsing) {
                    if (key.name == 'return') {
                        this.onInputCb(this.readInputBuffer())
                    } else if (key.name == 'backspace') {
                        this.inputBuffer = this.inputBuffer.slice(0, -1)
                        this.onInputingCb(this.inputBuffer)
                    } else if (key.sequence && key.sequence.length === 1) {
                        this.inputBuffer += key.sequence
                        this.onInputingCb(this.inputBuffer)
                    }
                } else {
                    // parent behavior + onInputing event
                    if (key.name === 'up') {
                        this.onUpCb()
                    } else if (key.name === 'down') {
                        this.onDownCb()
                    } else if (key.name === 'left') {
                        this.onLeftCb()
                    } else if (key.name === 'right') {
                        this.onRightCb()
                    } else if (key.name === 'return') {
                        this.onEnterCb()
                    } else if (key.name === 'backspace') {
                        this.onBackspaceCb()
                    } else {
                        if (key.sequence && key.sequence.length === 1) {
                            this.inputBuffer += key.sequence
                            this.onInputingCb(this.inputBuffer)
                        }
                    }
                }
            }
        });
    }
}

module.exports = BufferedKeyListener