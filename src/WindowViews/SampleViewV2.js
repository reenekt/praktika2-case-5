const WindowView = require('../WindowManager/WindowView')
const RenderHelpers = require('../WindowManager/RenderHelpers')

class SampleViewV2 extends WindowView {
    render() {
        const text = 'Sample view with text in center V2'

        const middleVertical = Math.floor(this.windowManager.getMaxHeight() / 2)
        const textPositionMiddleHorizontal = Math.floor(this.windowManager.getMaxWidth() / 2) - Math.floor(text.length / 2)

        let canvas = RenderHelpers.createCanvas(this.windowManager.getMaxWidth(), this.windowManager.getMaxHeight())
        canvas = RenderHelpers.drawRectangle(canvas, 0, 0, this.windowManager.getMaxWidth() -1, this.windowManager.getMaxHeight() -1)
        canvas = RenderHelpers.drawText(canvas, textPositionMiddleHorizontal, middleVertical, text)
        canvas = RenderHelpers.drawCell(canvas, textPositionMiddleHorizontal - 2, middleVertical, '>')
        RenderHelpers.renderCanvas(canvas)
    }
}

module.exports = SampleViewV2