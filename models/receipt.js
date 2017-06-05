let mongoose = require("mongoose");
let deepPopulate = require('mongoose-deep-populate')(mongoose);
let ReceiptSchema = new mongoose.Schema({
    payed:{type:Boolean,default:false},
    serviceReceipts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceReceipt"
    }],
    roomReceipts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomReceipt"
    }],
    payments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }],
    total:{type:Number,default:0}
});
ReceiptSchema.plugin(deepPopulate);
module.exports = mongoose.model("Receipt",ReceiptSchema);