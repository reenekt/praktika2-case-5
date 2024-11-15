const path = require('path')
const fs = require('fs')
const WindowView = require('../WindowManager/WindowView')
const RenderHelpers = require('../WindowManager/RenderHelpers')
const Task = require("../Tasks/Task")

class TaskBoardView extends WindowView {
    render() {
        if (this.windowManager.context.tasks === undefined) {
            this.windowManager.context.tasks = []
        }
        if (this.windowManager.context.isAddNewTaskSelected === undefined) {
            this.windowManager.context.isAddNewTaskSelected = true
        }

        const text1 = '| Новые задачи |'
        const text2 = '| Завершенные задачи |'
        const helperText1 = 'Используйте ↑, ↓, ←, → - для выбора пункта'
        const helperText2 = 'Enter - перейти к выбранному пункту, Backspace - выйти'

        const middleHorizontal = Math.floor(this.windowManager.getMaxWidth() / 2)
        const textPositionMiddleHorizontal1 = Math.floor(middleHorizontal / 2) - Math.floor(text1.length / 2)
        const textPositionMiddleHorizontal2 = middleHorizontal + Math.floor(middleHorizontal / 2) - Math.floor(text2.length / 2)

        /**
         * @type {Task[]}
         */
        const tasks = this.windowManager.context.tasks
        const newTasks = tasks.filter(task => task.status === 'new')
        const doneTasks = tasks.filter(task => task.status === 'done')

        const isTaskSelected = this.windowManager.context.isTaskSelected || false
        const selectedTaskId = this.windowManager.context.selectedTaskId ? +this.windowManager.context.selectedTaskId : null
        const isAddNewTaskSelected = this.windowManager.context.isAddNewTaskSelected || false
        const isLoadTasksFromFileSelected = this.windowManager.context.isLoadTasksFromFileSelected || false
        const isSaveTasksToFileSelected = this.windowManager.context.isSaveTasksToFileSelected || false

        let canvas = RenderHelpers.createCanvas(this.windowManager.getMaxWidth(), this.windowManager.getMaxHeight())

        // Render table and titles
        canvas = RenderHelpers.drawLine(canvas, 0, 0, RenderHelpers.DirectionVertical, this.windowManager.getMaxHeight() - 4)
        canvas = RenderHelpers.drawLine(canvas, middleHorizontal, 0, RenderHelpers.DirectionVertical, this.windowManager.getMaxHeight() - 4)
        canvas = RenderHelpers.drawLine(canvas, this.windowManager.getMaxWidth() - 1, 0, RenderHelpers.DirectionVertical, this.windowManager.getMaxHeight() - 4)
        canvas = RenderHelpers.drawLine(canvas, 0, 1, RenderHelpers.DirectionHorizontal, this.windowManager.getMaxWidth())
        canvas = RenderHelpers.drawLine(canvas, 0, this.windowManager.getMaxHeight() - 3, RenderHelpers.DirectionHorizontal, this.windowManager.getMaxWidth())
        canvas = RenderHelpers.drawText(canvas, textPositionMiddleHorizontal1, 0, text1)
        canvas = RenderHelpers.drawText(canvas, textPositionMiddleHorizontal2, 0, text2)
        canvas = RenderHelpers.drawText(canvas, 1, this.windowManager.getMaxHeight() - 2, helperText1)
        canvas = RenderHelpers.drawText(canvas, 1, this.windowManager.getMaxHeight() - 1, helperText2)

        // Render tasks
        const maxTaskLineLength = middleHorizontal - 4
        let taskIndexById = {all: {}, new: {}, done: {}}
        newTasks.forEach((task, index) => {
            taskIndexById.all[task.id] = index
            taskIndexById.new[task.id] = index

            let taskLine = isTaskSelected && selectedTaskId === task.id ? ' > ' : '   ';
            taskLine += `#${task.id} ${task.name}`
            if (taskLine.length > maxTaskLineLength) {
                taskLine = taskLine.substring(0, maxTaskLineLength - 4) + '...'
            }

            canvas = RenderHelpers.drawText(canvas, 2, 3 + index, taskLine)
        })
        doneTasks.forEach((task, index) => {
            taskIndexById.all[task.id] = index
            taskIndexById.done[task.id] = index

            let taskLine = isTaskSelected && selectedTaskId === task.id ? ' > ' : '   ';
            taskLine += `#${task.id} ${task.name}`
            if (taskLine.length > maxTaskLineLength) {
                taskLine = taskLine.substring(0, maxTaskLineLength - 4) + '...'
            }

            canvas = RenderHelpers.drawText(canvas, middleHorizontal + 2, 3 + index, taskLine)
        })
        this.windowManager.context.taskIndexById = taskIndexById

        // Render "Add task" button
        const addNewTaskButtonText = '+ Добавить задачу'
        canvas = RenderHelpers.drawText(canvas, 2, 2, ` ${isAddNewTaskSelected ? '>' : ' '} [ ${addNewTaskButtonText} ]`)
        // Render "Load tasks from file" button
        const loadTasksFromFileButtonText = '↓ Загрузить задачи из файла'
        canvas = RenderHelpers.drawText(canvas, 2 + 8 + addNewTaskButtonText.length, 2, ` ${isLoadTasksFromFileSelected ? '>' : ' '} [ ${loadTasksFromFileButtonText} ]`)
        // Render "Save tasks to file" button
        const saveTasksToFileButtonText = '↑ Сохранить задачи в файл'
        canvas = RenderHelpers.drawText(canvas, 2 + 8 + addNewTaskButtonText.length + 8 + loadTasksFromFileButtonText.length, 2, ` ${isSaveTasksToFileSelected ? '>' : ' '} [ ${saveTasksToFileButtonText} ]`)

        RenderHelpers.renderCanvas(canvas)
    }

    onBackspace () {
        this.windowManager.gracefulShutdown()
    }

    onUp () {
        let firstNewTaskId = 0
        let firstDoneTaskId = 0

        if (this.windowManager.context.tasks.length > 0) {
            firstNewTaskId = this.getFirstTaskIdInListByIndex('new')
            firstDoneTaskId = this.getFirstTaskIdInListByIndex('done')
        }

        if (this.windowManager.context.isTaskSelected && [firstNewTaskId, firstDoneTaskId].filter(v => v !== null).includes(this.windowManager.context.selectedTaskId)) {
            this.windowManager.context.isTaskSelected = false
            this.windowManager.context.selectedTaskId = null
            this.windowManager.context.isAddNewTaskSelected = true
            return
        }

        // Move from one selected task in the column to another (above)
        if (this.windowManager.context.isTaskSelected) {
            const selectedTask = this.windowManager.context.tasks.find(task => task.id === +this.windowManager.context.selectedTaskId)
            const selectedTaskList = selectedTask.status

            const selectedTaskIndex = this.getTaskIndexById(this.windowManager.context.selectedTaskId, selectedTaskList)
            const nextTaskIdByIndex = this.getTaskIdByIndex(selectedTaskIndex - 1, selectedTaskList)
            if (nextTaskIdByIndex) {
                this.windowManager.context.selectedTaskId = nextTaskIdByIndex
            }

        }
    }

    onDown () {
        // move from "Add new task" button (or other buttons) to tasks list
        if ((this.windowManager.context.isAddNewTaskSelected === true
            || this.windowManager.context.isLoadTasksFromFileSelected === true
            || this.windowManager.context.isSaveTasksToFileSelected === true)
            && this.windowManager.context.tasks.length > 0) {
            const firstNewTaskId = this.getFirstTaskIdInListByIndex('new')
            const firstDoneTaskId = this.getFirstTaskIdInListByIndex('done')
            const firstTaskToSelect = firstNewTaskId || firstDoneTaskId

            this.windowManager.context.isAddNewTaskSelected = false
            this.windowManager.context.isLoadTasksFromFileSelected = false
            this.windowManager.context.isSaveTasksToFileSelected = false
            this.windowManager.context.isTaskSelected = true
            this.windowManager.context.selectedTaskId = firstTaskToSelect
            return
        }

        // Move from one selected task in the column to another (below)
        if (this.windowManager.context.isTaskSelected) {
            const selectedTask = this.windowManager.context.tasks.find(task => task.id === +this.windowManager.context.selectedTaskId)
            const selectedTaskList = selectedTask.status

            const selectedTaskIndex = this.getTaskIndexById(this.windowManager.context.selectedTaskId, selectedTaskList)
            const nextTaskIdByIndex = this.getTaskIdByIndex(selectedTaskIndex + 1, selectedTaskList)
            if (nextTaskIdByIndex) {
                this.windowManager.context.selectedTaskId = nextTaskIdByIndex
            }
        }
    }

    onLeft () {
        if (this.windowManager.context.isTaskSelected) {
            const selectedTask = this.windowManager.context.tasks.find(task => task.id === +this.windowManager.context.selectedTaskId)
            if (selectedTask && selectedTask.status === 'done') {
                const firstNewTaskId = this.getFirstTaskIdInListByIndex('new')

                if (firstNewTaskId === null) {
                    return
                }

                this.windowManager.context.selectedTaskId = firstNewTaskId
            }
            return
        }

        if (this.windowManager.context.isLoadTasksFromFileSelected) {
            this.windowManager.context.isLoadTasksFromFileSelected = false
            this.windowManager.context.isAddNewTaskSelected = true
            return
        }

        if (this.windowManager.context.isSaveTasksToFileSelected) {
            this.windowManager.context.isSaveTasksToFileSelected = false
            this.windowManager.context.isLoadTasksFromFileSelected = true
        }
    }

    onRight () {
        if (this.windowManager.context.isTaskSelected) {
            const selectedTask = this.windowManager.context.tasks.find(task => task.id === +this.windowManager.context.selectedTaskId)
            if (selectedTask && selectedTask.status === 'new') {
                const firstDoneTaskId = this.getFirstTaskIdInListByIndex('done')

                if (firstDoneTaskId === null) {
                    return
                }

                this.windowManager.context.selectedTaskId = firstDoneTaskId
            }
            return
        }

        if (this.windowManager.context.isAddNewTaskSelected) {
            this.windowManager.context.isAddNewTaskSelected = false
            this.windowManager.context.isLoadTasksFromFileSelected = true
            return
        }

        if (this.windowManager.context.isLoadTasksFromFileSelected) {
            this.windowManager.context.isLoadTasksFromFileSelected = false
            this.windowManager.context.isSaveTasksToFileSelected = true
        }
    }

    onEnter () {
        if (this.windowManager.context.isLoadTasksFromFileSelected) {
            const filePath = path.join(__dirname, '../../tasks_database.json')
            const dataString = fs.readFileSync(filePath, 'utf8');
            const tasksDatabaseData = JSON.parse(dataString);

            const tasks = tasksDatabaseData.data.tasks.map(taskData => {
                return new Task(taskData.id, taskData.name, taskData.description, taskData.status)
            })
            this.windowManager.context.tasks = tasks

            return
        }

        if (this.windowManager.context.isSaveTasksToFileSelected) {
            const filePath = path.join(__dirname, '../../tasks_database.json')

            const tasksData = this.windowManager.context.tasks
            const tasksDatabaseData = {data: {tasks: tasksData}}
            const dataString = JSON.stringify(tasksDatabaseData, null, 2)

            fs.writeFileSync(filePath, dataString, 'utf8')
        }

        if (this.windowManager.context.isAddNewTaskSelected) {
            const selectedTask = new Task(0, '', '', 'new')
            this.windowManager.context.selectedTaskForDetailView = selectedTask

            const taskDetailView = this.windowManager.registeredViews['task-detail-view']
            this.windowManager.setActiveView(taskDetailView)
            this.windowManager.render()

            return
        }

        if (this.windowManager.context.isTaskSelected) {
            const selectedTask = this.windowManager.context.tasks.find(task => task.id === +this.windowManager.context.selectedTaskId)
            this.windowManager.context.selectedTaskForDetailView = selectedTask

            const taskDetailView = this.windowManager.registeredViews['task-detail-view']
            this.windowManager.setActiveView(taskDetailView)
            this.windowManager.render()
        }
    }

    getTaskIdByIndex (index, listName = 'all') {
        const flippedTaskIdByIndexList = Object.entries(this.windowManager.context.taskIndexById[listName])
            .reduce((obj, [key, value]) => ({ ...obj, [value]: key }), {})

        return flippedTaskIdByIndexList[index]
    }

    getTaskIndexById (id, listName = 'all') {
        return this.windowManager.context.taskIndexById[listName][id]
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

module.exports = TaskBoardView