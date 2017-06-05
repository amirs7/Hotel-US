var express = require('express');
var url = require("url");
var Customer = require("../models/customer");
var Receipt = require("../models/receipt");
var Room = require("../models/room");
var Reserve = require("../models/reserve");
var RoomType = require("../models/roomType");
var Payment = require("../models/payment");
var Service = require("../models/service");
var RoomReceipt = require("../models/roomReceipt");
var ServiceReceipt = require("../models/serviceReciept");
var mongoose = require("mongoose");
let _ = require("underscore")

exports.index  = function(req, res,next) {
    Customer.find({}).populate("rType").exec(function (err, customers) {
        res.render("./customer/index",{customers:customers});
    });
};

exports.show  = function(req, res,next) {
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and:[{_id:{$in:customer.receipts}},{payed:false}]})
            .deepPopulate(["roomReceipts","roomReceipts.room","serviceReceipts","roomReceipts.service","payments"])
            .exec(function (err, receipt) {
                Service.find({}).exec(function (err, services) {
                    Room.find({}).exec(function (err, rooms) {
                        res.render("./customer/show",{customer:customer, services:services, rooms:rooms, receipt:receipt});
                    });
                });
            });
    });
};

exports.showCreate  = function(req, res,next) {
    res.render("./customer/new" ,{info:{}});
};

exports.create  = function(req, res,next) {
    Customer.create(req.body, function (err, customer) {
        RoomType.find({}).exec(function (err, roomTypes) {
            res.render("./customer/checkIn",{customer:customer,info:req.body, roomTypes:roomTypes});
        });
    });
};

exports.delete  = function(req, res,next) {
    Customer.remove({_id:req.params.id}, function (err, customer) {
        res.redirect("/customers");
    });
};

exports.showCheckIn  = function(req, res,next) {
    Customer.findById(req.params.id).exec(function (err, customer) {
        RoomType.find({}).exec(function (err, roomTypes) {
            res.render("./customer/checkIn",{customer:customer,info:{}, roomTypes:roomTypes});
        });
    });
};

function findEmptyRooms(roomType, inDate, length, occupants, cb) {
    // var roomType = new mongoose.Types.ObjectId(roomType);
    var inDate = new Date(inDate);
    var outDate = new Date(inDate);
    outDate.setUTCDate(outDate.getUTCDate()+Number(length) );
    Reserve.find({roomType:roomType}).exec(function (err, reserves) {
        Room.find({rType:roomType}).exec(function (err, rooms) {
            RoomReceipt.find({room:{$in:rooms}}).exec(function (err, rrs) {
                var conflict = [];
                reserves.forEach(function (reserve) {
                    if((reserve.inDate >= inDate && reserve.inDate < outDate)||(reserve.outDate > inDate && reserve.outDate < outDate))
                        conflict.push(reserve);
                });
                rrs.forEach(function (rr) {
                    // console.log(reserve.inDate +" - " +reserve.outDate);
                    if((rr.inDate >= inDate && rr.inDate < outDate)||(rr.outDate > inDate && rr.outDate < outDate))
                        conflict.push(rr);
                });
                var maxRooms = 0;
                var d = inDate;
                while (d <= outDate){
                    var neededRooms = 0;
                    conflict.forEach(function (conf) {
                        if(conf.inDate < d && conf.outDate > d)
                            neededRooms++;
                    });
                    if(maxRooms < neededRooms)
                        maxRooms = neededRooms;
                    d.setUTCDate(d.getUTCDate()+1);
                }
                if(maxRooms < rooms.length) {
                    Room.find({status:"empty",rType:roomType}).exec(function (err, rooms) {
                        cb(rooms);
                    })
                }else{
                    cb(null);
                }
            });
        })
    });
};

exports.checkIn  = function(req, res,next) {
    Customer.findById(req.params.id).exec(function (err, customer) {
           findEmptyRooms(req.body.roomType,req.body.inDate, req.body.length, req.body.occupants,function (avRooms) {
           if(avRooms == null)
               avRooms = [];
               res.render("./customer/confirmCheckIn",{rooms:avRooms,customer:customer,info:req.body});
       });
    });
};

exports.confirmCheckIn  = function(req, res,next) {
    var occupants = req.body.occupants;
    Customer.findById(req.params.id).exec(function (err, customer) {
        Receipt.create({},function (err, receipt) {
            RoomReceipt.create(req.body, function (err, roomReceipt) {
                Room.findById(req.body.roomId).populate("rType").exec(function (err, room) {
                    for(i=0;i<req.body.occupants;i++){
                        customer
                            .addOccupant(req.body["firstname"+i], req.body["lastname"+i], req.body["birthDate"+i], req.body["nationalId"+i]);
                    }
                    room.status = "full";
                    room.save();
                    roomReceipt.room = room;
                    roomReceipt.roomNo = room.no;
                    roomReceipt.cost = room.rType.rate * roomReceipt.length;
                    receipt.cost -= roomReceipt.cost;
                    roomReceipt.save();
                    receipt.roomReceipts.push(roomReceipt);
                    customer.receipts.push(receipt);
                    customer.currentRoom = room.no;
                    customer.checkedOut = false;
                    receipt.save();
                    customer.save();
                    if(req.body.reserveId){
                        Reserve.findById(req.body.reserveId).populate("payment").exec(function (err, reserve) {
                            receipt.payments.push(reserve.payment);
                            receipt.cost += reserve.payment.amount;
                            receipt.save();

                            res.redirect("/customers");
                        })
                    }
                    else {
                        res.redirect("/customers");
                    }
                });
            });
        });
    });
};

exports.showCheckOut  = function(req, res,next) {
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and:[{_id:{$in:customer.receipts}},{payed:false}]})
            .deepPopulate(["roomReceipts","roomReceipts.room","serviceReceipts","roomReceipts.service","payments"])
            .exec(function (err, receipt) {
                res.render("./customer/checkOut",{customer:customer, receipt:receipt});
        });
    });
};

exports.checkOut  = function(req, res,next) {
    var receiptId = req.body.receiptId;
    Customer.findById(req.params.id).exec(function (err, customer) {
        Receipt.findById(receiptId,function (err, receipt) {
            Payment.create({title:"Check Out",amount:receipt.total}, function (err, payment) {
                Room.findOne({no:customer.currentRoom}).exec(function (err, room) {
                    room.status = "empty";
                    room.save();
                    receipt.payments.push(payment);
                    receipt.payed = true;
                    receipt.save();
                    customer.checkedOut = true;
                    customer.save();
                    res.redirect("/customers");
                });
            });
        });
    });
};

exports.showAddRoomReceipt  = function(req, res,next) {
    var occupants = req.body.occupants;
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and:[{_id:{$in:customer.receipts}},{payed:false}]},function (err, receipt) {
            Room.find({}).exec(function (err, rooms) {
                res.render("./customer/newRoomReceipt",{customer:customer,receipt:receipt,rooms:rooms});
            });
        });
    });
};

exports.addRoomReceipt  = function(req, res,next) {
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and:[{_id:{$in:customer.receipts}},{payed:false}]},function (err, receipt) {
            RoomReceipt.create(req.body, function (err, roomReceipt) {
                roomReceipt.calculateCost(function () {
                    roomReceipt.save();
                    receipt.roomReceipts.push(roomReceipt);
                    receipt.save();
                    res.redirect("/customers/"+customer._id);
                });
            });
        });
    });
};

exports.showAddServiceReceipt  = function(req, res,next) {
    var occupants = req.body.occupants;
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and:[{_id:{$in:customer.receipts}},{payed:false}]},function (err, receipt) {
            Service.find({}).exec(function (err, services) {
                res.render("./customer/newServiceReceipt",{customer:customer,services:services});
            });
        });
    });
};

exports.addServiceReceipt  = function(req, res,next) {
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and: [{_id: {$in: customer.receipts}}, {payed: false}]}, function (err, receipt) {
            ServiceReceipt.create(req.body, function (err, serviceReceipt) {
                serviceReceipt.calculateCost(function () {
                    receipt.serviceReceipts.push(serviceReceipt);
                    receipt.total -= serviceReceipt.cost;
                    receipt.save();
                    res.redirect("/customers/"+customer._id);
                });
            });
        });
    });
};

exports.showAddPayment  = function(req, res,next) {
    var occupants = req.body.occupants;
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and:[{_id:{$in:customer.receipts}},{payed:false}]},function (err, receipt) {
            res.render("./customer/newPayment",{customer:customer});
        });
    });
};

exports.addPayment  = function(req, res,next) {
    var occupants = req.body.occupants;
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        Receipt.findOne({$and:[{_id:{$in:customer.receipts}},{payed:false}]},function (err, receipt) {
            Payment.create(req.body, function (err, payment) {
                console.log(payment);
                receipt.payments.push(payment);
                receipt.total += payment.amount;
                receipt.save();
                res.redirect("/customers/"+customer._id);
            });
        });
    });
};

