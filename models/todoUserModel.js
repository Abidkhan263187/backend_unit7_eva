const mongoose = require('mongoose')



const todoUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})
const todoUserModel = mongoose.model('todoUser', todoUserSchema)

module.exports = { todoUserModel }