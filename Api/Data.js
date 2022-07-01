require('dotenv').config();
const express = require('express');

//assert 
const assert = require('assert');

//mongodb
const { MongoClient } = require('mongodb');

//router
const router = express.Router();

//mongo db data model
const Data = require('./../Modules/Data');

//bcrypt
const bcrypt = require('bcrypt');


//CRUD operation save new data/doc
router.post('/crud/saveNewData', (req, res) => {

    //get data from req body
    let { email, user, business, inventory, customer, order, } = req.body;

    // res.json({
    //     status: "FAILED",
    //     message: "Invalid name entered"
    // });


    const newData = new Data({
        email,
        user,
        business,
        inventory,
        customer,
        order
    });


    //we will save the data
    //execute the function to save data in mongoDB

    main(newData).catch(console.error);


    //main function to save new data
    async function main(newData) {
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
            await saveData(client, newData);

        } catch (e) {
            console.log(e);
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    }

    async function saveData(client, newData) {
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne for the insertOne() docs
        const result = await client.db("posDB").collection("userData").insertOne(newData);
        console.log(`New data registered id: ${result.insertedId}`);
    }
})


//USED IN FRONTEND
//CRUD operation update data/doc
router.post('/crud/updateData', (req, res) => {

    //get data from req body
    let { email, user, business, inventory, customer, order, } = req.body;

    // res.json({
    //     status: "FAILED",
    //     message: "Invalid name entered"
    // });

    let newData = {
        user,
        business,
        inventory,
        customer,
        order
    };


    //we will save the data
    //execute the function to save data in mongoDB
    main(newData, email).catch(error => {
        res.send({
            status: 'FAILED',
            message: 'main fx to update data failed !'
        })
    });


    //main function to save new data
    async function main(newData, email) {
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

            // find listing by email
            await findListingByEmail(client, email)

            //update listing by email
            await updateListingByEmail(client, email, {
                dataUser: newData
            })

        } catch (e) {
            console.log(e);
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    }


    //find listing by email
    async function findListingByEmail(client, emailOfListing) {
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
        const result = await client.db("posDB").collection("userData").findOne({ email: emailOfListing });

        if (result) {
            console.log(`Found a listing in the db with the name '${emailOfListing}':`);
            console.log(result);
        } else {
            console.log(`No listings found with the name '${emailOfListing}'`);
        }
    }

    //update listing by email
    async function updateListingByEmail(client, emailOfListing, updatedListing) {
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
        const result = await client.db("posDB").collection("registerUser").updateOne({ email: emailOfListing }, { $set: updatedListing }, { upsert: true });

        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);

        const JsonResult = JSON.stringify(result);

        res.send({
            status: 'SUCCESS',
            message: 'Data in DB updated !',
            result: JsonResult
        })
    }
})

//USED IN FRONTEND
//CRUD operation get data/doc
router.post('/crud/getData', (req, res) => {
    let { email, password } = req.body;


    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
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

        //execute the function to save data in mongoDB
        main(email, password)
            .catch(error => {
                res.send({
                    status: 'FAILED',
                    message: 'Failed to getData'
                })
            });

    }


    //execute the function to save data in mongoDB
    // main(email)
    //     .catch(error => {
    //         res.send({
    //             status: 'FAILED',
    //             message: 'Failed to getData'
    //         })
    //     });


    //main function to save new data
    async function main(email, password) {
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

            // find listing by email
            await findListingByEmail(client, email, password)


        } catch (e) {
            console.log(e);
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    }


    //find listing by email
    async function findListingByEmail(client, emailOfListing, passwordOfListing) {
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
        const result = await client.db("posDB").collection("registerUser").findOne({ email: emailOfListing });

        if (result) {
            console.log(`Found a listing in the db with the name '${emailOfListing}':`);
            console.log(result);


            const JsonResult = JSON.stringify(result);

            // res.send({
            //     status: 'FAILED',
            //     message: 'Failed to compare password in DB !',
            //     dataUser: JsonResult
            // })

            bcrypt.compare(passwordOfListing, result.password)
                .then(resCompare => {
                    if (resCompare == true) {
                        res.send({
                            status: 'SUCCESS',
                            message: 'User existed in DB !',
                            result: JsonResult
                        })
                    } else {
                        res.send({
                            status: 'FAILED',
                            message: 'Password incorrect !'
                        })
                    }
                })
                .catch(err => {
                    res.send({
                        status: 'FAILED',
                        message: 'Failed to compare password in DB !'
                    })
                })


        } else {
            console.log(`No listings found with the name '${emailOfListing}'`);

            res.send({
                status: 'FAILED',
                message: 'User not existed. PLease register !'
            })
        }
    }


})

module.exports = router;