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

        this.currentView = view
    }

    render () {
        if (!this.currentView) {
            throw new Error('current view is not set')
        }

        this.currentView.render()
    }
}

module.exports = WindowManager