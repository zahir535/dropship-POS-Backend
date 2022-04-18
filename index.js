// MAIN JS FILE FOR SERVER BACKEND DROPSHIP-POS

const express = require('express');

const app = express();

const port = 3001;

app.get('/', (req,res) => {
    res.send("Hello world. 3001 port onz! ");
})

app.listen(port, () => {
    console.log('Hello World server running on port: ' + port);
})