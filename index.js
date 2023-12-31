const express=require("express");
const { connection } = require("./config/db");
const cors=require("cors");
require("dotenv").config()



const {todoUserRouter}=require('./RouteController/todoUserRouter')
const {todoCrudRouter}=require('./RouteController/todoCrud')

const app=express();
app.use(express.json())

app.use(cors({
    origin: '*'
  })) 

  app.get('/',(req,res)=>{
    res.send({mssg:"getting response from home pagge"})
  })

app.use('/user',todoUserRouter)

app.use('/todo',todoCrudRouter)




app.listen(process.env.PORT, async()=>{

    try {
         await connection
         console.log("connection established")
    } catch (error) {
        console.log("error while  connecting  to DB")
        console.log(error)
    }
    console.log("server is running on port " + process.env.PORT)
})