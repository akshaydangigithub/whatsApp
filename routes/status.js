var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/wp");

const statusSchema = new mongoose.Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    image: {
        type: String
    },
    StatusCaption: {
        type: String
    },
    uplodTime: {
        type: Date
    }
});
module.exports = mongoose.model("status", statusSchema);
