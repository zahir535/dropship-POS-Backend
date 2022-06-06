require('dotenv').config();
const express = require('express');

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

    const newData = {
        user,
        business,
        inventory,
        customer,
        order
    };


    //we will save the data
    //execute the function to save data in mongoDB
    main(newData, email).catch(console.error);


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

        const {
            user,
            business,
            inventory,
            customer,
            order
        } = newData;

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            // create a doc for a new user

            // find listing by email
            await findListingByEmail(client, email)

            //update listing by email
            await updateListingByEmail(client, email, {
                user: user,
                business: business,
                inventory: inventory,
                customer: customer,
                order: order
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
        const result = await client.db("posDB").collection("userData").updateOne({ email: emailOfListing }, { $set: updatedListing });

        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
})


router.get('/crud/getData', (req,res) => {
    let {email} = req.body;

    //execute the function to save data in mongoDB
    main(email).catch(console.error);


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
            .then(result => {
                res.send(result)
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

})

module.exports = router;