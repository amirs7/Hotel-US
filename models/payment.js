let mongoose = require("mongoose");

let PaymentSchema = new mongoose.Schema({
    title:String,
    amount:Number,
    date:Date
});

module.exports = mongoose.model("Payment",PaymentSchema);