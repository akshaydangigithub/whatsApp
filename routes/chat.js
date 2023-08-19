var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/wp");

var chatSchema = mongoose.Schema({

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message: {
        type: String,
        default:""
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchema);