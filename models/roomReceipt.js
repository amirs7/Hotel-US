var mongoose = require("mongoose");

var RoomReceiptSchema = new mongoose.Schema({
    roomNo:Number,
    inDate:Date,
    length:Number,
    occupants:Number,
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    cost:Number
});

RoomReceiptSchema.methods.calculateCost = function (cb) {
    var rr = this;
    mongoose.model("Room").findById(new mongoose.Types.ObjectId(rr.room)).populate("rType").exec(function (err, rt) {
        rr.roomNo = rt.no;
        rr.cost = rt.rType.rate * rr.length;
        rr.save(cb);
    });
};

RoomReceiptSchema.virtual("outDate").get(function () {
    var outDate = new Date(this.inDate);
    outDate.setDate(outDate.getDate()+this.length);
    return outDate;
});
RoomReceiptSchema.virtual("getInDate").get(function () {
    return this.inDate()+"/"+this.inDate.getMonth()+"/"+this.inDate.getDate();
});


module.exports = mongoose.model("RoomReceipt", RoomReceiptSchema);
