// loading of modules
const express = require('express');
const dotenv= require('dotenv');

// Express App Creation
const app= express();
dotenv.config();

// http://localhost:portno/api/v1.0.0/healthcheck
app.get(`${process.env.API_URL}/healthcheck`, (req,res) => {
      res.send("<img src='https://media.makeameme.org/created/its-working-oyy433.jpg'>");
})



app.listen(process.env.PORT, () => {
    console.log("Server started on port"+process.env.PORT);
})
