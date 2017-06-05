let mongoose = require("mongoose");

let ServiceReceiptSchema = new mongoose.Schema({
    title:String,
    cost:Number,
    unit:Number,
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    }
});

ServiceReceiptSchema.methods.calculateCost = function (cb) {
  var sr = this;
    console.log(sr);
    mongoose.model("Service").findById(new mongoose.Types.ObjectId(sr.service)).exec(function (err, ser) {
        sr.title = ser.name;
        if(!sr.cost)
            sr.cost = ser.rate * sr.unit;
        sr.save();
        cb();
    })
};

module.exports = mongoose.model("ServiceReceipt",ServiceReceiptSchema);