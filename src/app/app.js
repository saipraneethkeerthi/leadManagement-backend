//Importing Express and Mongoose
const express = require('express')
const mongoose = require('mongoose')
const jwt =require('../jwtToken')
const userroutes = require('../apiRoutes/userRoute')
const productRoutes = require('../apiRoutes/productRoute')
const categoryRoutes= require('../apiRoutes/categoryRoutes')
const paymentRoutes = require('../apiRoutes/paymentRoutes')


require('../database/connect')


//Assiging Express to varaible app
const app = express();

// Created use function to get body i.e data
app.use(express.json())
// app.use(jwt()) 


//Assigning port number to port varaible
const port = process.env.PORT || 1109

const cors = require('cors')
app.use(cors())
app.use("/", userroutes)
app.use("/", productRoutes)
app.use("/",categoryRoutes)
app.use('/payment',paymentRoutes)


app.use(express.urlencoded({ extended: true }))


app.listen(port, () => { 
	console.log(`app listening http://localhost:${port}`)
})
