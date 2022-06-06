require('dotenv').config();
const express = require('express');

//mongodb
const { MongoClient } = require('mongodb');

//router
const router = express.Router();

//mongo db user model
const User = require('./../Modules/User');

//password handler
//const bcrypt = require('../index.js').bcrypt
const bcrypt = require('bcrypt');

// signup
router.post('/signup1', (req, res) => {
    //get data from req body
    let { name, email, password } = req.body;

    //trim all the white spaces
    name = name.trim();
    email = email.trim();
    password = password.trim();

    //check if any of the variables are empty
    if (name == "" || email == "" || password == "") {
        //if any is empty, return json object
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        // (!/^[a-zA-Z ]*$/.test(name)) 
        //if none of the variables is empty
        //we check the format of the name using regular ecpression

        //if the name doesnt match regular expression
        //return json object
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        });

    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        //  (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        //if none of the variables is empty
        //we check the format of the email using regular ecpression

        //if the name doesnt match regular expression
        //return json object
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if (password.length < 8) {
        // (password.length < 8)
        //if date passes, check the length of the password
        res.json({
            status: "FAILED",
            message: "Password is too short"
        });
    } else {
        //once there is no issue with the variables
        //start the sign up process

        //checking if user already exists
        //check using the module we created with mongoose in modulses folder
        //search using find function of the model
        User.find({ email })
            .then(result => {
                if (result.length) {
                    //if user already exists
                    //return a message saying the user already exists
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists"
                    })
                } else {
                    //create new user

                    //password handling

                    //original code
                    const saltRounds = 10;
                    bcrypt
                        .hash(password, saltRounds)
                        .then(hashedPassword => {
                            //create a new user with the data we have
                            //using hashed password
                            //this new user is created with the module we created using mongoose

                            const newUser = new User({
                                name,
                                email,
                                password: hashedPassword,
                            });

                            //once that is done
                            //we will save the user
                            newUser.save()
                                .then(result => {
                                    //if the user saved successfully
                                    //return a success message
                                    res.json({
                                        status: "SUCCESS",
                                        message: "SignUp successfull",

                                        //in addition, add the data that we just stored
                                        //to be sent to the client
                                        data: result,
                                    })
                                })
                                .catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occured when saving new user data",
                                    })
                                })
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured when hashing password new user",
                            })
                        })

                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "An error occured when checking for existing user"
                })
            })

    }

})

router.post('/dbLists', (req, res) => {

    //function 
    async function main() {
        const url = process.env.MONGODB_URI;
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            await client.connect();
            await listDatabases(client);

        } catch (e) {
            console.log(e)
        } finally {
            await client.close();
        }
    }

    //listDatabases function ref
    async function listDatabases(client) {
        databasesList = await client.db().admin().listDatabases();

        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    };

    //execute the function
    main().catch(console.error);

})

// signin
router.post('/signin', (req, res) => {

    //get data from req body
    let { email, password } = req.body;

    //trim all the white spaces
    email = email.trim();
    password = password.trim();

    //check if variable is empty
    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials"
        });
    } else {
        //check if user exists
        User.find({ email })
            .then((data) => {
                if (data.length) {
                    //if user exists, take the passwords 
                    //and compare with the hashed password in the db

                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword)
                        .then(result => {
                            if (result) {
                                //if password matched
                                res.json({
                                    status: "SUCCESSFUL",
                                    message: "Sign in successfull",
                                    data: data
                                });
                            } else {
                                //if password NOT matched
                                res.json({
                                    status: "FAILED",
                                    message: "Invalid password entered",
                                    data: data
                                });
                            }
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error when comparing password"
                            });
                        })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials entered"
                    });
                }
            })
            .catch(err => {
                //if email not existed in db
                res.json({
                    status: "FAILED",
                    message: "An error entered when checking existing email"
                });
            })
    }
})


//CRUD operation register
router.post('/crud/register', (req, res) => {

    //get data from req body
    let { name, email, password } = req.body;

    //trim all the white spaces
    name = name.trim();
    email = email.trim();
    password = password.trim();

    //check if any of the variables are empty
    if (name == "" || email == "" || password == "") {
        //if any is empty, return json object
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        // (!/^[a-zA-Z ]*$/.test(name)) 
        //if none of the variables is empty
        //we check the format of the name using regular ecpression

        //if the name doesnt match regular expression
        //return json object
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        });

    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        //  (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        //if none of the variables is empty
        //we check the format of the email using regular ecpression

        //if the name doesnt match regular expression
        //return json object
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if (password.length < 8) {
        // (password.length < 8)
        //if date passes, check the length of the password
        res.json({
            status: "FAILED",
            message: "Password is too short"
        });
    } else {
        //once there is no issue with the variables
        //start the sign up process

        //checking if user already exists
        //check using the module we created with mongoose in modulses folder
        //search using find function of the model
        //conditional here

        //create new user

        //password handling

        //original code
        const saltRounds = 10;
        bcrypt
            .hash(password, saltRounds)
            .then(hashedPassword => {
                //create a new user with the data we have
                //using hashed password
                //this new user is created with the module we created using mongoose

                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                });

                //once that is done
                //we will save the user
                //execute the function to save user in mongoDB

                main(newUser).catch(console.error);

            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occured when hashing password new user",
                })
            })

    }


    //main function to save new doc
    async function main(newUser) {
        const uri = process.env.MONGODB_URI;

        /**
         * The Mongo Client you will use to interact with your database
         * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
         * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
         * pass option { useUnifiedTopology: true } to the MongoClient constructor.
         * const client =  new MongoClient(uri, {useUnifiedTopology: true})
         */
        const client = new MongoClient(uri);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            // create a doc for a new user

            // Create a single new listing
            await registerNewuser(client, newUser);

        } catch (e) {
            console.log(e);
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    }

    //function to find one doc
    async function mainFindDoc(email) {
        const uri = process.env.MONGODB_URI;

        /**
         * The Mongo Client you will use to interact with your database
         * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
         * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
         * pass option { useUnifiedTopology: true } to the MongoClient constructor.
         * const client =  new MongoClient(uri, {useUnifiedTopology: true})
         */
        const client = new MongoClient(uri);

        let final;

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            // create a doc for a new user

            // find if email already existed in the db or not
            final = await findOneUser(client, email);

        } catch (e) {
            console.log(e);
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }

        return final;
    }


    // Add functions that make DB calls here
    //     /**
    //  * Create a new Airbnb listing
    //  * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
    //  * @param {Object} newListing The new listing to be added
    //  */
    async function registerNewuser(client, newUser) {
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne for the insertOne() docs
        const result = await client.db("posDB").collection("registerUser").insertOne(newUser);
        console.log(`New user registered id: ${result.insertedId}`);
    }

    async function findOneUser(client, email) {
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
        const result = await client.db("posDB").collection("registerUser").findOne({ email: email });

        if (result) {
            // console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
            // console.log(result);
            return true;
        } else {
            // console.log(`No listings found with the name '${nameOfListing}'`);
            return false;
        }
    }
})

//CRUD operation login
//suggestion: change this API to GET
router.get('/crud/login', (req, res) => {

    //get data from req body
    let { email, password } = req.body;

    //trim all the white spaces
    email = email.trim();
    password = password.trim();

    //check if any of the variables are empty
    if (email == "" || password == "") {
        //if any is empty, return json object
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        //  (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        //if none of the variables is empty
        //we check the format of the email using regular ecpression

        //if the name doesnt match regular expression
        //return json object
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if (password.length < 8) {
        // (password.length < 8)
        //if date passes, check the length of the password
        res.json({
            status: "FAILED",
            message: "Password is too short"
        });
    } else {
        //once there is no issue with the variables
        //start the login process

        //checking if user already exists
        //check using the module we created with mongoose in modulses folder
        //search using find function of the model
        //conditional here


        //original code
        // mainFindDoc(email);
        mainFindDoc("Tom@gmail.com")
            .catch(console.error);

    }



    //function to find one doc
    async function mainFindDoc(email) {
        const uri = process.env.MONGODB_URI;

        /**
         * The Mongo Client you will use to interact with your database
         * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
         * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
         * pass option { useUnifiedTopology: true } to the MongoClient constructor.
         * const client =  new MongoClient(uri, {useUnifiedTopology: true})
         */
        const client = new MongoClient(uri);


        try {
            // Connect to the MongoDB cluster
            await client.connect();

            // create a doc for a new user

            // find if email already existed in the db or not
            await findOneUser(client, email);

        } catch (e) {
            console.log(e);
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    }


    async function findOneUser(client, email) {
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
        const result = await client.db("posDB").collection("registerUser").findOne({ email: email });

        if (result) {
            // console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
            console.log(result);

            res.send(result)
        } else {
            console.log(`No listings found with the name '${nameOfListing}'`);
        }
    }
})

// save data
router.post('/addNew', (req, res) => {
    //get data from req body
    let { id, user, business, inventory, customer, order } = req.body;

    //check the variables
    if (id == "" || user == null || business == null || inventory == null || customer == null || order == null) {
        //if any is empty, return json object
        res.json({
            status: "FAILED",
            message: "Empty datas"
        });
    } else {
        const newUser = new User({
            // id,
            // user,
            // business,
            // inventory,
            // customer,
            // order
        });

        //once that is done
        //we will save the user
        newUser.save()
            .then(result => {
                //if the user saved successfully
                //return a success message
                res.json({
                    status: "SUCCESS",
                    message: "Save data successfull",

                    //in addition, add the data that we just stored
                    //to be sent to the client
                    data: result,
                })
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occured when saving data",
                })
            })
    }


})

module.exports = router;