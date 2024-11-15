const RenderHelpers = require("./RenderHelpers");

class WindowManager {
    constructor() {
        this.config = {
            maxWidth: null, // width in columns
        }

        /**
         * @type {WindowView|null}
         */
        this.currentView = null

        /**
         * @type {WindowView[]}
         */
        this.registeredViews = []

        this.context = {}

        this.stopped = false

        this.previousView = null

        this.registeredKeyListener = null
    }

    get keyListener() {
        return this.registeredKeyListener
    }

    getMaxWidth() {
        const terminalWidth = process.stdout.columns

        if (this.config && this.config.maxWidth) {
            return Math.min(this.config.maxWidth, terminalWidth)
        }

        return terminalWidth
    }

    getMaxHeight() {
        return process.stdout.rows
    }

    /**
     * @param {WindowView} view
     * @param {string} key
     */
    registerView (view, key) {
        view.windowManager = this
        this.registeredViews[key] = view
    }

    setActiveView(view) {
        if (!Object.values(this.registeredViews).includes(view)) {
            throw new Error('This view is not registered in WindowManager')
        }

        if (this.currentView !== null) {
            this.previousView = this.currentView
        }

        this.currentView = view
    }

    registerKeyListener(keyListener) {
        // keyListener.onUp(() => this.makeKeyListenerEventHandler('onUp'))
        // keyListener.onDown(() => this.makeKeyListenerEventHandler('onDown'))
        // keyListener.onLeft(() => this.makeKeyListenerEventHandler('onLeft'))
        // keyListener.onRight(() => this.makeKeyListenerEventHandler('onRight'))
        // keyListener.onEnter(() => this.makeKeyListenerEventHandler('onEnter'))
        // keyListener.onBackspace(() => this.makeKeyListenerEventHandler('onBackspace'))
        // keyListener.onInputing((str) => this.makeKeyListenerEventHandler('onInputing', str))
        // keyListener.onInput((str) => this.makeKeyListenerEventHandler('onInput', str))

        this.registeredKeyListener = keyListener

        keyListener.onUp(this.makeKeyListenerEventHandler('onUp'))
        keyListener.onDown(this.makeKeyListenerEventHandler('onDown'))
        keyListener.onLeft(this.makeKeyListenerEventHandler('onLeft'))
        keyListener.onRight(this.makeKeyListenerEventHandler('onRight'))
        keyListener.onEnter(this.makeKeyListenerEventHandler('onEnter'))
        keyListener.onBackspace(this.makeKeyListenerEventHandler('onBackspace'))
        keyListener.onInputing(this.makeKeyListenerEventHandler('onInputing'))
        keyListener.onInput(this.makeKeyListenerEventHandler('onInput'))
    }

    // makeKeyListenerEventHandler (eventName, ...args) {
    //     if (this.currentView[eventName] === undefined) {
    //         return null
    //     }
    //
    //     return this.currentView[eventName](...args)
    // }
    makeKeyListenerEventHandler (eventName) {
        // if (this.currentView[eventName] === undefined) {
        //     return (...args) => {}
        // }
        //
        // return (...args) => {
        //     this.currentView[eventName](...args)
        //     if (!this.stopped) {
        //         this.render()
        //     }
        // }
        return (...args) => {
            if (this.currentView[eventName] === undefined) {
                return undefined
            }

            const result = this.currentView[eventName](...args)
            if (!this.stopped) {
                this.render()
            }
            return result;
        }
    }

    render () {
        RenderHelpers.clearAllOutput()

        if (!this.currentView) {
            throw new Error('current view is not set')
        }

        this.currentView.render()
    }

    gracefulShutdown () {
        this.stopped = true

        RenderHelpers.clearAllOutput()

        console.log('Complete working with task board');

        process.exit(0);
    }
}

module.exports = WindowManager