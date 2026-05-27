const express = require('express');
const AWS = require('aws-sdk');

const app = express();

app.use(express.json());

AWS.config.update({
    region:'eu-north-1'
});

const dynamodb =
new AWS.DynamoDB.DocumentClient();

app.get('/users',(req,res)=>{

    res.send("User Service Running");

});

app.post('/register', async(req,res)=>{

    const data = {

        id: Date.now().toString(),

        name: req.body.name,

        email: req.body.email
    };

    const params = {

        TableName:"users",

        Item:data
    };

    try{

        await dynamodb.put(params).promise();

        res.send("User Stored In DynamoDB");

    }catch(error){

        res.send(error);

    }

});

app.listen(3000, ()=>{

    console.log("User Service Started");

});
