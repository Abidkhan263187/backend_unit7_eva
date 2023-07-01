const express=require("express");
const { connection } = require("./config/db");
const cors=require("cors");
require("dotenv").config()



const {todoUserRouter}=require('./RouteController/todoUserRouter')
const {todoCrudRouter}=require('./RouteController/todoCrud')

const app=express();
app.use(express.json())
// app.use(cors({
//     origin: 'http://localhost:3000', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }));

// app.get('/',(req,res)=>{

//     res.json("getting all the todos from DB")
// })

 app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

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