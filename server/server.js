const express = require("express");
const path = require('path')//to jest budowane nie trzeba instalowac
const publicPath = path.join(__dirname,'../public') // dirname to folder w którym jest ten glowny plik
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
const http = require('http') //wbudowana biblioteka

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));



server.listen(port,()=>{
    console.log(`server is up on port ${port}`);
});