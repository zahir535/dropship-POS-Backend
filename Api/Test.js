const express = require('express');

const router = express.Router();

//mongo db user model
const Test = require('./../Modules/Test');


// test
router.post('/saveObj', (req, res) => {

    //get data from req body
    let { name, user } = req.body;


    //check if variable is empty
    if (name == "" || user == null) {
        res.json({
            status: "FAILED",
            message: "Empty credentials"
        });
    } else {

        const newTest = new Test({
            name,
            user,
        });
        //check if Test exists
        //once that is done
        //we will save the user
        newTest.save()
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