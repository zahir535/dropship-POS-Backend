
const express = require('express');

const router = express.Router();

//mongo db user model
const User = require('./../Modules/User');

//password handler
const bcrypt = require('bcrypt');


// signup
router.post('/signup', (req, res) => {
    //get data from req body
    let { name, email, password, dateOfBirth } = req.body;

    //trim all the white spaces
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    //check if any of the variables are empty
    if (name == "" || email == "" || password == "" || dateOfBirth == "") {
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
    } else if (!new Date(dateOfBirth).getTime()) {
        // (!new Date(dateOfBirth).getTime())
        //check tha validity of the date
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
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
                                dateOfBirth
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
            .then( (data) => {
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

module.exports = router;