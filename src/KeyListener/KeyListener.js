const readline = require('readline');

class KeyListener {
    constructor() {
        this.onUpCb = () => {}
        this.onDownCb = () => {}
        this.onLeftCb = () => {}
        this.onRightCb = () => {}
        this.onEnterCb = () => {}
        this.onBackspaceCb = () => {}
        this.onInputCb = (charStr) => {}
    }

    onUp(callback) {
        this.onUpCb = callback
    }

    onDown(callback) {
        this.onDownCb = callback
    }

    onLeft(callback) {
        this.onLeftCb = callback
    }

    onRight(callback) {
        this.onRightCb = callback
    }

    onEnter(callback) {
        this.onEnterCb = callback
    }

    onBackspace(callback) {
        this.onBackspaceCb = callback
    }

    onInput(callback) {
        this.onInputCb = callback
    }

    start() {
        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', (chunk, key) => {
            if (key) {
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
                        this.onInputCb(key.sequence)
                    }
                }
            }
        });
    }
}

module.exports = KeyListener