const RenderHelpers = require("../WindowManager/RenderHelpers");

class ButtonGroupWidget {
    constructor(buttons = []) {
        this.buttons = buttons
        this.selectedButtonIndex = null
    }

    get selectedButton() {
        if (!this.buttons || this.buttons.length === 0 || this.selectedButtonIndex === null) {
            return null
        }

        return this.buttons[this.selectedButtonIndex]
    }

    setButtons (buttons) {
        this.buttons = buttons
    }

    selectNextButton() {
        if (!this.buttons || this.buttons.length === 0 || this.selectedButtonIndex === null) {
            return
        }

        // already at last position
        if (this.buttons.length === (this.selectedButtonIndex + 1)) {
            return
        }

        this.selectedButtonIndex++
    }

    selectPreviousButton() {
        if (!this.buttons || this.buttons.length === 0 || this.selectedButtonIndex === null) {
            return
        }

        // already at first position
        if (this.selectedButtonIndex === 0) {
            return
        }

        this.selectedButtonIndex--
    }

    selectButtonAtIndex (index) {
        if (index < 0 || index > (this.buttons.length - 1)) {
            return
        }

        this.selectedButtonIndex = index
    }

    unselectButton () {
        if (this.selectedButtonIndex !== null) {
            this.selectedButtonIndex = null
        }
    }

    render (canvas, x, y) {
        let currentX = x

        this.buttons.forEach((button, index) => {
            const isSelected = index === this.selectedButtonIndex

            canvas = RenderHelpers.drawText(canvas, currentX, y, ` ${isSelected ? '>' : ' '} [ ${button} ]`)

            currentX += 7 + button.length
        })

        return canvas
    }
}

module.exports = ButtonGroupWidget