const mongoose = require("mongoose")


const todoSchema = new mongoose.Schema({
    taskname: { type: String, required: true },
    status: { type: String, required: true, enum:["pending","done"] },
    tag: { type: String, required: true },
    userID:{type: String, required: true}
})


const todoModel = mongoose.model('todo', todoSchema)

module.exports = { todoModel }