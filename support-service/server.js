const express = require('express');

const app = express();

app.get('/support',(req,res)=>{

    res.send("Support Service Running");

});

app.listen(3000, ()=>{

    console.log("Support Service Started");

});
