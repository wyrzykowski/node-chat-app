const express = require("express");
const path = require('path')//to jest budowane nie trzeba instalowac
const socketIO = require('socket.io');
const http = require('http') //wbudowana biblioteka
const Filter = require('bad-words')

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public') // dirname to folder w którym jest ten glowny plik

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on('connection',(socket)=>{
    console.log('New WebSocket connection')
    socket.emit('helloMessage','Node chat app')
   socket.broadcast.emit('sendMessage',"A new user has joined!"); //broadcast send to everyone except that actually connected

    socket.on('sendMessage',(sendMessage,callback)=>{
        const filter = new Filter() //bad-wrods npm
        if(filter.isProfane(sendMessage))
        {
            return callback('Profanity is not allowed!')
        }

        console.log(sendMessage);
        io.emit('sendMessage',sendMessage);
        callback('Delivered!');//wywoluje gdy wysle wiamdosc dow syztskoch to wtedy uzytknik dostanie wiadomosc ze dostarczona
    })

    socket.on('position',(position,callback)=>{
        io.emit('sendMessage',`https://google.com/maps?q=${position.latitude},${position.longitude}`);
        console.log(position);
        callback('Delivered!');
    })

    socket.on('disconnect',()=>{
        io.emit('sendMessage',"A user has left!");
    })
})


server.listen(port,()=>{
    console.log(`server is up on port ${port}`);
});

