const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')
const messageRoutes = require('./routes/message')
dotenv.config()
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server,  {
    cors: {
      origin: '*',
    }
});

// app.use(express.json())
// app.use(bodyParser.urlencoded({extended : true, limit: '10mb'}))
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json({extended : true, limit: '30mb'}))
app.use(bodyParser.urlencoded({extended : true, limit: '30mb'}))

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("mongodb connected"))
.catch((err) => console.log(Error, err))

app.get('/', (req,res) => {
    res.json("welcome")
})

app.use('/api/v1',userRoutes)
app.use('/api/v1',chatRoutes)
app.use('/api/v1',messageRoutes)

let activeUsers = []

io.on("connection", (socket) => {
 
    
    socket.on('join', (userId) => {

        if(socket.room) {
            socket.leave(socket.room)
        }
  
          if(!activeUsers.some((user) => user.userId === userId)){
            activeUsers.push({
                userId,
                socketId: socket.id
            })
          }
      
        io.emit('onlineUsers', activeUsers)
        socket.join(`user_${userId}`)
        socket.room = `user_${userId}`


    })

    socket.on("sendMessage", ({data, recepient}) => {
        socket.to(`user_${recepient}`).emit("receiveMessage", data)

    })

    socket.on("disconnect", () => {
        
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
        
        io.emit('onlineUsers', activeUsers)
    })


})

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`server started on port ${port}`)
})


