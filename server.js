const express = require('express');
const server = express();

const port = 8000;
const hostname = 'localhost';

server.listen(port,hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}`)
});