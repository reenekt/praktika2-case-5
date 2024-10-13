const readline = require('readline');

// TODO remove if it will be unnecessary
function isAlphaNumericChar (charStr) {
    if (charStr.length !== 1) {
        return false;
    }

    const charCode = charStr.charCodeAt(0);

    if (charCode >= '0'.charCodeAt(0) && charCode >= '9'.charCodeAt(0)) {
        return true;
    }
    if (charCode >= 'a'.charCodeAt(0) && charCode >= 'z'.charCodeAt(0)) {
        return true;
    }
    if (charCode >= 'A'.charCodeAt(0) && charCode >= 'Z'.charCodeAt(0)) {
        return true;
    }
    if (charCode >= 'а'.charCodeAt(0) && charCode >= 'я'.charCodeAt(0)) {
        return true;
    }
    if (charCode >= 'А'.charCodeAt(0) && charCode >= 'Я'.charCodeAt(0)) {
        return true;
    }

    return false;
}

class KeyListener {
    constructor () {
        this.onUpCb = () => {}
        this.onDownCb = () => {}
        this.onLeftCb = () => {}
        this.onRightCb = () => {}
        this.onEnterCb = () => {}
        this.onBackspaceCb = () => {}
        this.onInputCb = (charStr) => {}
    }

    onUp (callback) {
        this.onUpCb = callback
    }
    onDown (callback) {
        this.onDownCb = callback
    }
    onLeft (callback) {
        this.onLeftCb = callback
    }
    onRight (callback) {
        this.onRightCb = callback
    }
    onEnter (callback) {
        this.onEnterCb = callback
    }
    onBackspace (callback) {
        this.onBackspaceCb = callback
    }
    onInput (callback) {
        this.onInputCb = callback
    }

    start() {
        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', (chunk, key) => {
            if (key) {
                if (key.name == 'up') {
                    this.onUpCb()
                } else if (key.name == 'down') {
                    this.onDownCb()
                } else if (key.name == 'left') {
                    this.onLeftCb()
                } else if (key.name == 'right') {
                    this.onRightCb()
                } else if (key.name == 'return') {
                    this.onEnterCb()
                } else if (key.name == 'backspace') {
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
                        this.inputBuffer += key.name
                        this.onInputingCb(this.inputBuffer)
                    }
                } else {
                    // parent behavior + onInputing event
                    if (key.name == 'up') {
                        this.onUpCb()
                    } else if (key.name == 'down') {
                        this.onDownCb()
                    } else if (key.name == 'left') {
                        this.onLeftCb()
                    } else if (key.name == 'right') {
                        this.onRightCb()
                    } else if (key.name == 'return') {
                        this.onEnterCb()
                    } else if (key.name == 'backspace') {
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

function clearAllOutput() {
    process.stdout.write('\x1Bc')
}

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

function renderTaskList(selectedTaskIndex = 0) {
    const tasks = [
        '#1 TODO first task',
        '#2 TODO second task',
        '#3 TODO third task',
    ];

    tasks.forEach((task, index) => {
        let message = index === selectedTaskIndex ? '* ' : '  '
        message += task
        console.log(message)
    })
}

async function main () {
    console.log('Console log');

    process.stdout.write('process stdout write\n');

    await delay(1500); // waiting 1.5 second.

    clearAllOutput();

    let selectedTaskIndex = 0;

//    const keyListener = new KeyListener();
    const keyListener = new BufferedKeyListener();

//    keyListener.onUp(() => console.log('onUp called'))
//    keyListener.onDown(() => console.log('onDown called'))
//    keyListener.onLeft(() => console.log('onLeft called'))
//    keyListener.onRight(() => console.log('onRight called'))
//    keyListener.onEnter(() => console.log('onEnter called'))
//    keyListener.onBackspace(() => console.log('onBackspace called'))
//    keyListener.onInputing((str) => console.log('onInputingCb called with value: ' + str))
//    keyListener.onInput((str) => {
//        console.log('onInput called with value: ' + str)
//        if (str === 'q') {
//            process.exit(0)
//        }
//    })

    keyListener.onUp(() => {
        if (selectedTaskIndex > 0) {
            selectedTaskIndex--
        }
        clearAllOutput();
        renderTaskList(selectedTaskIndex);
    })
    keyListener.onDown(() => {
        if (selectedTaskIndex < 2) {
            selectedTaskIndex++
        }
        clearAllOutput();
        renderTaskList(selectedTaskIndex);
    })
    keyListener.onInput((str) => {
        if (str === 'q') {
            process.exit(0)
        }
    })

    keyListener.start()

    renderTaskList(selectedTaskIndex)

//    await delay(1500); // waiting 1.5 second.
//
//    console.log('Finish');
//
//    process.exit(1);
}

main();