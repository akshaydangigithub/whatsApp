var mongoose = require("mongoose");
var plm = require("passport-local-mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/wp");

// mongoose.connect("mongodb+srv://hdangi224:hdangi224@cluster0.gilhcih.mongodb.net/facebook-clone?retryWrites=true&w=majority");

momngoose.connect(
  "mongodb+srv://hdangi224:C5x37OozR9uEys9j@cluster0.lrh9oam.mongodb.net/whatsApp?retryWrites=true&w=majority"
);
var userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    LastName: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    is_online: {
      type: String,
      default: "0",
    },
    Profile_photo: {
      type: String,
    },
    status: {
      type: {
        content: String,
        uploadTime: Date,
        StatusCaption: String,
      },
      default: {
        content: "",
        uploadTime: null,
        StatusCaption: "",
      },
    },
  },
  { timestamps: true }
);

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
