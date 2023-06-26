const { Router } = require("express")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { todoModel } = require('../models/todomodel')
const todoCrudRouter = Router()

//authenticate 
const authenticate = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ msg: "Please login again" });
    }
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return res.status(401).send({ msg: "please login again" })
    }
    else {
        const decoded = jwt.verify(token, process.env.SECRET);

        const { userID } = decoded
        req.userID = userID  // we are setting the email in req.email 

        if (decoded) {
            next()
        }
        else {
            res.status(401).send("please login again")
        }
    }


}


//get
todoCrudRouter.get("/", authenticate, async (req, res) => {
    const { status, tag, todoID } = req.query;
    const query = { userID: req.userID };
  
    if (todoID) {
      // Retrieve a specific todo by its ID
      query._id = todoID;
    } else {
      // Filter by status and tag
      if (status) {
        query.status = status;
      }
  
      if (tag) {
        query.tag = tag;
      }
    }
  
    try {
      const todosList = await todoModel.find(query);
      console.log(todosList);
  
      if (todosList.length > 0) {
        res.status(200).send({ mssg: "Here are the matching todos", todosList });
      } else {
        res.status(404).send({ mssg: "No todos available for this query" });
      }
    } catch (error) {
      console.log("Error while getting the todos list");
      console.log(error);
      res.status(500).send({ mssg: "Error while getting the list", error });
    }
  });
  


//post
todoCrudRouter.post("/create", authenticate, async (req, res) => {
    const { taskname, status, tag } = req.body
    console.log(req.userID)

    try {
        const newTodo = new todoModel({
            taskname,
            status,
            tag,
            userID: req.userID
        })
        await newTodo.save();
        res.status(200).send({ mssg: "successfully created", newTodo })

    } catch (error) {
        console.log("error while creating todo")
        console.log(error)
        res.status(500).send({ mssg: "error while creating todo", error })
    }

})



//patch

todoCrudRouter.patch("/update/:id", authenticate, async (req, res) => {
    console.log(req.userID);
    
    try {
      const updateTodo = await todoModel.findOneAndUpdate( { _id: req.params.id, userID: req.userID },req.body );
      if(updateTodo){
        res.status(200).send({ mssg: "successfully updated" });
      }else{
        res.status(404).send({ mssg: "you are not authorize" })
      }
    
    } catch (error) {
      console.log("error while updating todo");
      console.log(error);
      res.status(500).send({ mssg: "error while updating todo", error });
    }
  });
  


//delete
todoCrudRouter.delete('/delete/:id', authenticate, async(req, res) => {
    const { id } = req.params
    const deleteTodo =  await todoModel.findOneAndDelete({ _id: id, userID: req.userID })
    console.log(deleteTodo)
    try {
        if (deleteTodo) {
            res.status(200).send({ mssg: "successfully deleted" })
        }
        else {
            res.status(404).send({ mssg: "you are not authorized" })
        }
    } catch (error) {
        console.log("error while deleting todo")
        console.log(error)
        res.status(500).send({ mssg: "error while deleting todo", error })
    }

})

module.exports = { todoCrudRouter }