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
  
    try {
      const user = await todoUserModel.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ mssg: "User not found" });
      }
  
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ mssg: "Invalid password" });
      }
  
      const token = jwt.sign({ userID: user._id }, process.env.SECRET);
      return res.json({ mssg: "Login successful", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ mssg: "Login failed" });
    }
  });
  

module.exports = { todoUserRouter }