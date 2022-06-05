//require('./Config/MongoDBConfig');

const express = require('express');
const app = express();

const port = process.env.PORT || 3001;

// for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());


//import router file
const UserRouter = require('./Api/User');
const TestRouter = require('./Api/Test');


//test router
app.use('/test', TestRouter)
app.use('/user', UserRouter)



//Middleware
//node automatically search folder called views
//EJS is a template engine
app.set('view engine', 'ejs');

//render
app.get("/", (req, res) => {
    res.render('index');
})

app.listen(port, () => {
    console.log("Server run on port: " + port);
})

//export module bcrypt
//module.exports.bcrypt = bcrypt;


// //test
// app.get("/testget",(req, res) => {
//     res.send("ainciuabsc");
// })