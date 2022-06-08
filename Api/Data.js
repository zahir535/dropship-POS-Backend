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


//CRUD operation get data/doc
router.post('/crud/getData', (req, res) => {
    let { email } = req.body;

    //execute the function to save data in mongoDB
    main(email)
        .catch(error => {
            res.send({
                status: 'FAILED',
                message: 'Failed to getData'
            })
        });


    //main function to save new data
    async function main(email) {
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
        const result = await client.db("posDB").collection("registerUser").findOne({ email: emailOfListing });

        if (result) {
            console.log(`Found a listing in the db with the name '${emailOfListing}':`);
            console.log(result);

            const JsonResult = JSON.stringify(result);

            res.send({
                status: 'SUCCESS',
                message: 'User existed in DB !',
                result: JsonResult
            })
        } else {
            console.log(`No listings found with the name '${emailOfListing}'`);

            res.send({
                status: 'FAILED',
                message: 'User not existed in DB. PLease register !'
            })
        }
    }


})

module.exports = router;