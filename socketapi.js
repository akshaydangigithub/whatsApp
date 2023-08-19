const userModel = require('./routes/users')
const chatModel = require("./routes/chat")

const io = require("socket.io")();
const socketapi = {
    io: io
};

var usp = io.of("/user-namespace");

usp.on('connection', async (socket) => {
    console.log('a user connected');
    var userId = socket.handshake.auth.token;
    await userModel.findOneAndUpdate({ _id: userId }, { $set: { is_online: '1' } });

    //user broadcast online status
    socket.broadcast.emit("getOnlineUser", { user_id: userId });

    //chating implementation
    socket.on("newChat", function (data) {
        // console.log(data);
        socket.broadcast.emit("loadNewChat", data);
    })

    //load old chats
    socket.on("existsChat", async function (data) {
        // console.log(data.sender_id);
        var chats = await chatModel.find({
            $or: [
                { sender_id: data.sender_id, receiver_id: data.receiver_id },
                { sender_id: data.receiver_id, receiver_id: data.sender_id }
            ]
        });
        socket.emit("loadChats", { chats: chats });
        console.log(chats.receiver_id);
    });

     //new group chat addedd
     socket.on('newGroupChat', function (data) {
        console.log(data);
        socket.broadcast.emit('loadNewGroupChat', data)
    })

    socket.on('disconnect', async () => {
        console.log('user disconnected');
        var userId = socket.handshake.auth.token;
        await userModel.findOneAndUpdate({ _id: userId }, { $set: { is_online: '0' } });

        //user broadcast offline status
        socket.broadcast.emit("getOfflineUser", { user_id: userId });
    });
});


module.exports = socketapi;