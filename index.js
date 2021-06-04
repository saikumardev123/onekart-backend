// loading of modules
const express = require('express');
const dotenv= require('dotenv');


// Express App Creation
const app= express();


// middlewares 
app.use(express.json());

dotenv.config();

// user defined modules 
var db = require('../onekart-backend/utilities/db.config');
var userRouter = require('../onekart-backend/routes/user.route');
var categoryRouter = require("../onekart-backend/routes/category.route");
var productRouter = require("../onekart-backend/routes/product.route");

db.connectToDB();


// Routes Configuration
app.use(`${process.env.API_URL}/user`,userRouter);
app.use(`${process.env.API_URL}/category`,categoryRouter);
app.use(`${process.env.API_URL}/product`,productRouter);

// http://localhost:portno/api/v1.0.0/healthcheck
app.get(`${process.env.API_URL}/healthcheck`, (req,res) => {
      res.send("<img src='https://media.makeameme.org/created/its-working-oyy433.jpg'>");
})

app.listen(process.env.PORT, () => {
    console.log("Server started on port"+process.env.PORT);
})
