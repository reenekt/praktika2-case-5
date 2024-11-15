class RenderHelpers {
    static DirectionHorizontal = 'dh'
    static DirectionVertical = 'dv'

    static createCanvas (width, height, filler = ' ') {
        let canvas = []

        // create rows
        for (let i = 0; i < height; i++) {
            let row = ''

            // create row columns
            for (let j = 0; j < width; j++) {
                row += filler
            }

            canvas[i] = row
        }

        return canvas
    }

    static drawLine (canvas, x, y, direction, length) {
        if (direction === this.DirectionHorizontal) {
            let row = canvas[y]

            if (x + length > row.length) {
                length = row.length - x
            }

            let line = ''
            for (let i = 0; i < length; i++) {
                line += '-'
            }

            row = row.substring(0, x) + line + row.substring(x + length)

            canvas[y] = row

            return canvas
        } else if (direction === this.DirectionVertical) {
            for (let i = y; i < Math.min(canvas.length, (y + length + 1)); i++) {
                let row = canvas[i]

                row = row.substring(0, x) + '|' + row.substring(x + 1)

                canvas[i] = row
            }

            return canvas
        } else {
            throw new Error('Wrong direction given: ' + direction)
        }
    }

    static drawCell (canvas, x, y, value) {
        let row = canvas[y]

        row = row.substring(0, x) + value + row.substring(x + 1)

        canvas[y] = row

        return canvas
    }

    static drawRectangle (canvas, x1, y1, x2, y2) {
        const lengthHorizontal = x2 - x1
        const lengthVertical = y2 - y1

        // top border
        canvas = this.drawLine(canvas, x1, y1, this.DirectionHorizontal, lengthHorizontal)

        // bottom border
        canvas = this.drawLine(canvas, x1, y2, this.DirectionHorizontal, lengthHorizontal)

        // left border
        canvas = this.drawLine(canvas, x1, y1, this.DirectionVertical, lengthVertical)

        // right border
        canvas = this.drawLine(canvas, x2, y1, this.DirectionVertical, lengthVertical)

        // corners
        canvas = this.drawCell(canvas, x1, y1, '+')
        canvas = this.drawCell(canvas, x1, y2, '+')
        canvas = this.drawCell(canvas, x2, y1, '+')
        canvas = this.drawCell(canvas, x2, y2, '+')

        return canvas
    }

    static drawText (canvas, x, y, text) {
        let row = canvas[y]

        row = row.substring(0, x) + text + row.substring(x + text.length)

        canvas[y] = row

        return canvas
    }

    static renderCanvas (canvas) {
        for (let i = 0; i < canvas.length; i++) {
            const rowContent = canvas[i]

            process.stdout.write(rowContent)
        }
    }

    static clearAllOutput() {
        process.stdout.write('\x1Bc')
    }
}

module.exports = RenderHelpers