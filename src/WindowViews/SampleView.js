const WindowView = require('../WindowManager/WindowView')

class SampleView extends WindowView {
    render() {
        const text = 'Sample view with text in center'

        const middleVertical = Math.floor(this.windowManager.getMaxHeight() / 2)
        const textPositionMiddleHorizontal = Math.floor(this.windowManager.getMaxWidth() / 2) - Math.floor(text.length / 2)

        // render rows
        for (let i = 0; i < this.windowManager.getMaxHeight(); i++) {
            let rowContent = ''

            // render columns of the row
            for (let j = 0; j < this.windowManager.getMaxWidth(); j++) {
                // first and last rows filled with '-'
                if (i === 0 || i === this.windowManager.getMaxHeight() - 1) {
                    rowContent += '-'
                }

                // render text in center
                else if (i === middleVertical) {
                    if (j === 0 || j === this.windowManager.getMaxWidth() - 1) {
                        rowContent += '|'
                    } else if (j >= textPositionMiddleHorizontal && j < textPositionMiddleHorizontal + text.length) {
                        let char = text[j - textPositionMiddleHorizontal]
                        rowContent += char
                    } else {
                        rowContent += ' '
                    }
                }

                else {
                    if (j === 0 || j === this.windowManager.getMaxWidth() - 1) {
                        rowContent += '|'
                    } else {
                        rowContent += ' '
                    }
                }
            }

            process.stdout.write(rowContent)
            if (i !== this.windowManager.getMaxHeight() - 1) {
                process.stdout.write('\n')
            }
        }
    }
}

module.exports = SampleView