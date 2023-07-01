const express=require("express");
const { connection } = require("./config/db");
const cors=require("cors");
require("dotenv").config()



const {todoUserRouter}=require('./RouteController/todoUserRouter')
const {todoCrudRouter}=require('./RouteController/todoCrud')

const app=express();
app.use(express.json())

app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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