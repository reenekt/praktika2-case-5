class Task {
    constructor(id, name, description, status = 'new') {
        this.id = id
        this.name = name
        this.description = description
        this.status = status
    }
}

module.exports = Task