let mongoose = require("mongoose");

let ReserveSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    nationalId:String,
    bookingDate:Date,
    inDate:Date,
    length:Number,
    roomNo:Number,
    roomType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType"
    },
    payment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }

});

ReserveSchema.virtual("outDate").get(function () {
    var outDate = new Date(this.inDate);
    outDate.setDate(outDate.getDate()+this.length);
    return outDate;
});

ReserveSchema.virtual("getInDate").get(function () {
    return this.inDate.getFullYear()+"/"+this.inDate.getMonth()+"/"+this.inDate.getDate();
});


module.exports = mongoose.model("Reserve",ReserveSchema);