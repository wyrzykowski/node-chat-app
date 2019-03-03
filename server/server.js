const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

   //Listen for join users and then send message, and broadcast his name to other users in room
   socket.on('join',({username,room},callback)=>{
       const {error,user} =  addUser({id: socket.id,username: username,room: room})
           if(error)
           {
               return callback(error)
           }

       socket.join(room)

       socket.emit('message', generateMessage('Admin','Node chat App'))
       socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))//broadcast send message to everyone when somone join, .to send message to room
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
       //socket.emit,io.emit, socket.broadcast.emit
       //io.to.emit
   })
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()//bad-words libraary

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        const {room,username,id} = getUser(socket.id)
        io.to(room).emit('message', generateMessage(username,message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const {room,username,id} = getUser(socket.id)

        io.to(room).emit('locationMessage', generateLocationMessage(username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){ // update list of logeed in users:
            io.to(user.room).emit('message',generateMessage(`A ${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users:getUsersInRoom(user.room)
            })
        }

    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})