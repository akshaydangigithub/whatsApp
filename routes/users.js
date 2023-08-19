var mongoose = require("mongoose");
var plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/wp");

var userSchema = mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  LastName: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  is_online: {
    type: String,
    default: "0"
  },
  Profile_photo: {
    type: String
  }
},
  { timestamps: true }
);

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
