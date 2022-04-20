require('./Config/MongoDBConfig');

const express = require('express');
const app = express();

const port = process.env.PORT || 3001;

const UserRouter = require('./Api/User');

//import bcrypt
// const bcrypt = require('bcrypt');
// const saltRounds = 10;


// for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

// direct the application to the router in api ?
app.use('/user', UserRouter)


app.listen(port, () => {
    console.log("Server run on port: "+port);
})

//export module bcrypt
//module.exports.bcrypt = bcrypt;