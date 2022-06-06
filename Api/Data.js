require('dotenv').config();
const express = require('express');

//mongodb
const { MongoClient } = require('mongodb');

//router
const router = express.Router();

//mongo db data model
const Data = require('./../Modules/Data');


//CRUD operation save new data/doc
router.post('/crud/saveData', (req, res) => {

    //get data from req body
    let { user, business, inventory, customer, order, } = req.body;

    // res.json({
    //     status: "FAILED",
    //     message: "Invalid name entered"
    // });


    const newData = new Data({
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

module.exports = router;