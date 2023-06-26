const { Router } = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const { todoUserModel } = require('../models/todoUserModel')


const todoUserRouter = Router()



todoUserRouter.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hash_password = bcrypt.hashSync(password, 8);
    try {
        const user = todoUserModel({
            name,
            email,
            password:hash_password
        })
        await user.save()
        console.log("signup successful")
        res.status(200).send({ mssg: "successfully signup", user })
    } catch (error) {
        console.log("error while signup")
        console.log(error)
    }

})

todoUserRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const getUser = await todoUserModel.findOne({ email: email })
    console.log(getUser)
    try {

        if (!getUser) {
            return res.status(404).send({ mssg: "user not found" })
        }
        const verify = bcrypt.compareSync(password, getUser.password);
        console.log(verify)
        if (!verify) {
            return res.status(404).send({ mssg: "invalid password" })
        }
        const token = jwt.sign({ userID: getUser._id }, process.env.SECRET);
        res.send({ mssg: "login successful", token })
        console.log("login successful")

    } catch (error) {
        console.log(error)
        res.status(500).send("login failed")
        console.log("error while signup")
    }

})

module.exports = { todoUserRouter }