const express = require('express')

const app = express()

app.get('/users', (req, res) => {

    res.send('User Service Running')
})

app.get('/register', (req, res) => {

    res.send('Register API Running')
})

app.listen(3000, () => {

    console.log('User Service Started')
})
