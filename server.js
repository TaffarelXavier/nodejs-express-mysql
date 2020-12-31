const express = require("express");
const CONFIG = require('./app/config/config');
const dotenv = require('dotenv');
const v1Route = require('./app/routes/v1.route');

const app = express();

dotenv.config();

// parse requests of content-type - application/json
app.use(express.json()); //json requests

app.use('/v1', v1Route);

app.use('/', function(req, res){
  res.statusCode = 200;//send the appropriate status code
  res.json("Welcome API https://github.com/brunomoraisti")
});

// set port, listen for requests
const PORT = CONFIG.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});