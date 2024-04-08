const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const appRoute = require('./routes/authRoute');
const mongoose = require('mongoose')
const Message = require('./models/Message')
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

const dbURI = 'mongodb://127.0.0.1:27017/Chatty'
mongoose.connect(dbURI)
    .then((result) => console.log("Connected to db"))
    .catch((err) => console.log('My error', err));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        allowHeaders: ['my-custom-header'],
        credentials: true,
    }
});


io.on("connection", (socket) => {

    socket.on("sendmessage", async (payload) => {
        try {
            const time = Date.now(); // Define 'time' variable with current timestamp
            const newMessage = await Message.create({ message: payload.message, user: payload.Id, time: time });
            console.log(payload);
            io.emit('sentmessage', payload); 
        } catch (error) {
            console.error("Error saving message to database:", error);
        }
    });

    socket.on("getOldMessages", async () => {
        try {
            const payload = await Message.find().populate('user');
            console.log(payload);
            const messages = payload.map(item => ({
                message: item.message,
                name: item.user.userName,
                Id: item.user.id.toString(),
                time: item.time
            }));
            console.log(messages);
            io.emit("getmsgs", messages)
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    })

})

app.use(appRoute);

server.listen(4000, () => {
    console.log("Sever is listening port 5000....");
})



