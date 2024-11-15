const readline = require('readline');
const BufferedKeyListener = require('./KeyListener/BufferedKeyListener')
const WindowManager = require('./WindowManager/WindowManager')
const SampleView = require("./WindowViews/SampleView");
const SampleViewV2 = require("./WindowViews/SampleViewV2");
const TaskBoardView = require('./WindowViews/TaskBoardView')
const Task = require("./Tasks/Task");
const TaskDetailView = require("./WindowViews/TaskDetailView");

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

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

async function main () {
    console.log('Starting task board by Andrey Sementsov...');

    await delay(1500); // waiting 1.5 second.

    const keyListener = new BufferedKeyListener();

    // TODO move this commented code to example docs
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

//    await delay(1500); // waiting 1.5 second.
//
//    console.log('Finish');
//
//    process.exit(1);

    const windowManager = new WindowManager()

    const sampleView = new SampleView()
    const sampleViewV2 = new SampleViewV2()
    const taskBoardView = new TaskBoardView()
    const taskDetailView = new TaskDetailView()

    windowManager.registerView(sampleView, 'sample')
    windowManager.registerView(sampleViewV2, 'samplev2')
    windowManager.registerView(taskBoardView, 'task-board-view')
    windowManager.registerView(taskDetailView, 'task-detail-view')

    windowManager.setActiveView(taskBoardView)

    // const tasks = []
    // tasks.push(new Task(1, 'Name1', 'qwe', 'new'))
    // tasks.push(new Task(2, 'Name2_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'qwe', 'new'))
    // tasks.push(new Task(3, 'Name3', 'qwe', 'done'))
    // tasks.push(new Task(4, 'Name4_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'qwe', 'done'))
    // windowManager.context.tasks = tasks

    // keyListener.onInput((str) => {
    //     if (str === 'q') {
    //         process.exit(0)
    //     }
    //     // if (str === 'w') {
    //     //     if (windowManager.currentView === sampleView) {
    //     //         windowManager.setActiveView(sampleViewV2)
    //     //         windowManager.render()
    //     //     } else if (windowManager.currentView === sampleViewV2) {
    //     //         windowManager.setActiveView(sampleView)
    //     //         windowManager.render()
    //     //     }
    //     // }
    // })
    windowManager.registerKeyListener(keyListener)
    keyListener.start()

    windowManager.render()
}

main();