let mongoose = require("mongoose");
let deepPopulate = require('mongoose-deep-populate')(mongoose);
let OccupantSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    nationalId: String,
    birthDate: Date,
});
let CustomerSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: String,
    mobile: String,
    nationalId: String,
    birthDate: Date,
    address: String,
    currentRoom:Number,
    occupants:[OccupantSchema],
    checkedOut:{type:Boolean,default:true},
    receipts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receipt"
    }]
});

CustomerSchema.methods.addOccupant = function (fn,ln,id,bd) {
  this.occupants.push({
      firstname:fn,
      lastname:ln,
      nationalId:id,
      birthDate:bd
  });
};

CustomerSchema.plugin(deepPopulate);
module.exports = mongoose.model("Customer",CustomerSchema);