var mongoose = require("mongoose");

var RoomSchema = new mongoose.Schema({
    no:Number,
    rType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType"
    },
    status:{
        type:String,
        enum:["full","empty","reserve"]
    }
});


RoomSchema.virtual('type').get( function () {
    return this.rType.title;
});

RoomSchema.methods.findEmptyRoom = function(roomType, inDate, length, cb) {
  mongoose.model("Room").findOne({roomType:roomType}).exec(cb);
};

RoomSchema.methods.changeStatus = function() {
    if(this.status == "empty") {
        this.status = "reserve";
    }
    else if(this.status == "reserve")
        this.status = "empty";
    this.save();
};

module.exports = mongoose.model("Room", RoomSchema);
