const WindowView = require('../WindowManager/WindowView')
const RenderHelpers = require('../WindowManager/RenderHelpers')
const Task = require("../Tasks/Task")
const ButtonGroupWidget = require('../Widgets/ButtonGroupWidget')

const saveButton = 'Сохранить'
const deleteButton = 'Удалить'
const markAsDoneButton = 'Отметить как выполненную'

class TaskDetailView extends WindowView {
    render() {
        const selectedTask = this.windowManager.context.selectedTaskForDetailView

        if (!selectedTask) {
            throw new Error('There is no selected task in details view!')
        }

        if (this.windowManager.context.TDVControlsSelectedControl === undefined) {
            /* allowed controls:
                * id_field
                * id_field_value
                * name_field
                * name_field_value
                * description_field
                * description_field_value
                * buttons_group
             */
            this.windowManager.context.TDVControlsSelectedControl = 'id_field'
        }

        const isCreatingNewTask = selectedTask.id === 0
        const isEditingExistingTask = selectedTask.id > 0

        const idLineTitle = 'ID'
        const nameLineTitle = 'Название'
        const descriptionLineTitle = 'Описание'
        const helperText1 = 'Используйте ↑, ↓, ←, → - для выбора пункта'
        const helperText2 = 'Enter - перейти к выбранному пункту, Backspace - выйти'

        let canvas = RenderHelpers.createCanvas(this.windowManager.getMaxWidth(), this.windowManager.getMaxHeight())
        canvas = RenderHelpers.drawRectangle(canvas, 0, 0, this.windowManager.getMaxWidth() - 1, this.windowManager.getMaxHeight() - 3)

        // Render card and titles
        canvas = RenderHelpers.drawText(canvas, 2, 1, ` ${this.windowManager.context.TDVControlsSelectedControl === 'id_field' ? '>' : ' '} ${idLineTitle}`)
        canvas = RenderHelpers.drawLine(canvas, 1, 3, RenderHelpers.DirectionHorizontal, this.windowManager.getMaxWidth() - 1)

        canvas = RenderHelpers.drawText(canvas, 2, 4, ` ${this.windowManager.context.TDVControlsSelectedControl === 'name_field' ? '>' : ' '} ${nameLineTitle}`)
        canvas = RenderHelpers.drawLine(canvas, 1, 6, RenderHelpers.DirectionHorizontal, this.windowManager.getMaxWidth() - 1)

        canvas = RenderHelpers.drawText(canvas, 2, 7, ` ${this.windowManager.context.TDVControlsSelectedControl === 'description_field' ? '>' : ' '} ${descriptionLineTitle}`)
        canvas = RenderHelpers.drawLine(canvas, 1, 9, RenderHelpers.DirectionHorizontal, this.windowManager.getMaxWidth() - 1)

        // Render fields' values
        const idLineValue = (isCreatingNewTask ? '(будет сгенерировано автоматически)' : selectedTask.id) + ' ' + (`[${ selectedTask.status === 'new' ? 'Новая' : 'Выполнена' }]`)
        const nameLineValue = selectedTask.name
        const descriptionLineValue = selectedTask.description

        canvas = RenderHelpers.drawText(canvas, 2, 2, ` ${this.windowManager.context.TDVControlsSelectedControl === 'id_field_value' ? '>' : ' '} ${idLineValue}`)
        canvas = RenderHelpers.drawText(canvas, 2, 5, ` ${this.windowManager.context.TDVControlsSelectedControl === 'name_field_value' ? '>' : ' '} ${nameLineValue}`)
        canvas = RenderHelpers.drawText(canvas, 2, 8, ` ${this.windowManager.context.TDVControlsSelectedControl === 'description_field_value' ? '>' : ' '} ${descriptionLineValue}`)

        // Render buttons group
        if (this.windowManager.context.TDVControlsBGW === undefined) {
            this.windowManager.context.TDVControlsBGW = new ButtonGroupWidget([
                // saveButton,
                // deleteButton,
                // markAsDoneButton,
            ])
        }
        if (isCreatingNewTask) {
            this.windowManager.context.TDVControlsBGW.setButtons([
                saveButton,
            ])
        } else if (isEditingExistingTask) {
            if (selectedTask.status === 'new') {
                this.windowManager.context.TDVControlsBGW.setButtons([
                    deleteButton,
                    markAsDoneButton,
                ])
            } else {
                this.windowManager.context.TDVControlsBGW.setButtons([
                    deleteButton,
                ])
            }
        }
        canvas = this.windowManager.context.TDVControlsBGW.render(canvas, 1, 10)

        // canvas = RenderHelpers.drawLine(canvas, 1, this.windowManager.getMaxHeight() - 3, RenderHelpers.DirectionHorizontal, this.windowManager.getMaxWidth() - 1)
        canvas = RenderHelpers.drawText(canvas, 1, this.windowManager.getMaxHeight() - 2, helperText1)
        canvas = RenderHelpers.drawText(canvas, 1, this.windowManager.getMaxHeight() - 1, helperText2)

        RenderHelpers.renderCanvas(canvas)
    }

    onBackspace () {
        // if (this.windowManager.context.TDVControlsSelectedControl === 'id_field_value') {
        //     this.windowManager.context.TDVControlsSelectedControl = 'id_field'
        //     return
        // }

        if (this.windowManager.context.TDVControlsSelectedControl === 'name_field_value') {
            this.windowManager.context.TDVControlsSelectedControl = 'name_field'
            this.windowManager.keyListener.inputBuffer = ''
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'description_field_value') {
            this.windowManager.context.TDVControlsSelectedControl = 'description_field'
            this.windowManager.keyListener.inputBuffer = ''
            return
        }

        this.windowManager.context.selectedTaskForDetailView = null
        this.windowManager.setActiveView(this.windowManager.previousView)
        this.windowManager.render()
    }

    onUp () {
        if (this.windowManager.context.TDVControlsSelectedControl === 'id_field') {
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'name_field') {
            this.windowManager.context.TDVControlsSelectedControl = 'id_field'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'description_field') {
            this.windowManager.context.TDVControlsSelectedControl = 'name_field'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'buttons_group') {
            this.windowManager.context.TDVControlsBGW.unselectButton()
            this.windowManager.context.TDVControlsSelectedControl = 'description_field'
            return
        }
    }

    onDown () {
        if (this.windowManager.context.TDVControlsSelectedControl === 'id_field') {
            this.windowManager.context.TDVControlsSelectedControl = 'name_field'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'name_field') {
            this.windowManager.context.TDVControlsSelectedControl = 'description_field'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'description_field') {
            this.windowManager.context.TDVControlsBGW.selectButtonAtIndex(0)
            this.windowManager.context.TDVControlsSelectedControl = 'buttons_group'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'buttons_group') {
            return
        }
    }

    onLeft () {
        if (this.windowManager.context.TDVControlsSelectedControl === 'buttons_group') {
            this.windowManager.context.TDVControlsBGW.selectPreviousButton()
            return
        }
    }

    onRight () {
        if (this.windowManager.context.TDVControlsSelectedControl === 'buttons_group') {
            this.windowManager.context.TDVControlsBGW.selectNextButton()
            return
        }
    }

    onEnter () {
        // if (this.windowManager.context.TDVControlsSelectedControl === 'id_field') {
        //     this.windowManager.context.TDVControlsSelectedControl = 'id_field_value'
        //     return
        // }

        if (this.windowManager.context.TDVControlsSelectedControl === 'name_field') {
            this.windowManager.context.TDVControlsSelectedControl = 'name_field_value'
            this.windowManager.keyListener.inputBuffer = this.windowManager.context.selectedTaskForDetailView.name
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'description_field') {
            this.windowManager.context.TDVControlsSelectedControl = 'description_field_value'
            this.windowManager.keyListener.inputBuffer = this.windowManager.context.selectedTaskForDetailView.description
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'name_field_value') {
            this.windowManager.context.TDVControlsSelectedControl = 'name_field'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'description_field_value') {
            this.windowManager.context.TDVControlsSelectedControl = 'description_field'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'buttons_group') {
            if (this.windowManager.context.TDVControlsBGW.selectedButton === saveButton) {
                // create (save/store) new task in list (NOTE: this code is correct only for new creating tasks, not for editing tasks)
                const nextId = (Math.max(this.windowManager.context.tasks.map(task => task.id)) || 0) + 1
                this.windowManager.context.selectedTaskForDetailView.id = nextId
                this.windowManager.context.tasks.push(
                    this.windowManager.context.selectedTaskForDetailView
                )

                // return bask to list view
                this.windowManager.context.selectedTaskForDetailView = null
                this.windowManager.setActiveView(this.windowManager.previousView)
                this.windowManager.render()
            }
            if (this.windowManager.context.TDVControlsBGW.selectedButton === deleteButton) {
                // remove selected task from list
                const selectedTaskIndex = this.windowManager.context.tasks.findIndex(task => task.id === +this.windowManager.context.selectedTaskId)
                this.windowManager.context.tasks.splice(selectedTaskIndex, 1)

                // select first task
                const firstNewTaskId = this.getFirstTaskIdInListByIndex('new')
                const firstDoneTaskId = this.getFirstTaskIdInListByIndex('done')
                const firstTaskToSelect = firstNewTaskId || firstDoneTaskId
                this.windowManager.context.isAddNewTaskSelected = false
                this.windowManager.context.isLoadTasksFromFileSelected = false
                this.windowManager.context.isSaveTasksToFileSelected = false
                this.windowManager.context.isTaskSelected = true
                this.windowManager.context.selectedTaskId = firstTaskToSelect

                // return bask to list view
                this.windowManager.context.selectedTaskForDetailView = null
                this.windowManager.setActiveView(this.windowManager.previousView)
                this.windowManager.render()
            }
            if (this.windowManager.context.TDVControlsBGW.selectedButton === markAsDoneButton) {
                // change status of the selected task
                const selectedTask = this.windowManager.context.tasks.find(task => task.id === +this.windowManager.context.selectedTaskId)
                selectedTask.status = 'done'

                // return bask to list view
                this.windowManager.context.selectedTaskForDetailView = null
                this.windowManager.setActiveView(this.windowManager.previousView)
                this.windowManager.render()
            }

            return
        }
    }

    onInputing (str) {
        if (this.windowManager.context.TDVControlsSelectedControl === 'name_field_value') {
            this.windowManager.context.selectedTaskForDetailView.name = str
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'description_field_value') {
            this.windowManager.context.selectedTaskForDetailView.description = str
            return
        }
    }

    onInput (str) {
        if (this.windowManager.context.TDVControlsSelectedControl === 'name_field_value') {
            this.windowManager.context.selectedTaskForDetailView.name = str
            this.windowManager.context.TDVControlsSelectedControl = 'name_field'
            return
        }

        if (this.windowManager.context.TDVControlsSelectedControl === 'description_field_value') {
            this.windowManager.context.selectedTaskForDetailView.description = str
            this.windowManager.context.TDVControlsSelectedControl = 'description_field'
            return
        }
    }

    getFirstTaskIdInListByIndex (listName = 'all') {
        const entries = Object.entries(this.windowManager.context.taskIndexById[listName])

        if (entries.length === 0) {
            return null
        }

        return entries.sort((a, b) => {
            if (a[1] > b[1]) { return 1 }
            if (a[1] < b[1]) { return -1 }
            return 0
        })[0][0]
    }
}

module.exports = TaskDetailView