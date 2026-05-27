const express = require('express');

const app = express();

app.get('/ai',(req,res)=>{

    res.send("AI Service Running");

});

app.listen(3000, ()=>{

    console.log("AI Service Started");

});
