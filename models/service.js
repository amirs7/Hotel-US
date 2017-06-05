var mongoose = require("mongoose");

var ServiceSchema = new mongoose.Schema({
    name:String,
    rate:Number,
    status:{
        type:String,
        default:"active",
        enum:["inActive","active"]
    },
    availableHours:[Number]
});

ServiceSchema.methods.changeStatus = function() {
    if(this.status == "active")
        this.status = "inActive";
    else if(this.status == "inActive")
        this.status = "active";
    this.save();
};

module.exports = mongoose.model("Service", ServiceSchema);
