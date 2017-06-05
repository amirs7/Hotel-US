let mongoose = require("mongoose");

let RoomTypeSchema = new mongoose.Schema({
    title:String,
    rate:Number
});

module.exports = mongoose.model("RoomType", RoomTypeSchema);