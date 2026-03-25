const express = require('express');
const mongoose = require('mongoose');
const server = express();
const authRoute = require('./routes/authRoutes');
const fs = require('node:fs/promises')
const session = require('express-session');
server.use(express.json())

const dotenv = require('dotenv');
dotenv.config({path: "./config.env"})


server.use('/',authRoute)
server.use(express.urlencoded({extended:true}))

server.set('view engine','ejs')

server.use(express.urlencoded({ extended: true })); // to read form data
server.use(session({
  secret: 'secretkey', // used to sign session ID cookie
  resave: false,
  saveUninitialized: false
}));


async function connectDataBase() {
    try {
        await mongoose.connect(process.env.DB)
        console.log('Successfully connected to database')
    } catch(error)  {
        console.log('Failed to connect to database')
    }
    
}



function startserver() {
    const port = 8000;
    const hostname = 'localhost';

    server.listen(port,hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`)
    })

}


connectDataBase().then(startserver)

