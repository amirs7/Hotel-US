var express = require('express');
var url = require("url");
var Customer = require("../models/customer");
var Reserve = require("../models/reserve");
var RoomType = require("../models/roomType");
var Room = require("../models/room");
var Payment = require("../models/payment");
var RoomReceipt = require("../models/roomReceipt");
var ServiceReceipt = require("../models/serviceReciept");
var mongoose = require("mongoose");
let _ = require("underscore")

exports.index  = function(req, res,next) {
    Reserve.find({}).populate("roomType").exec(function (err, reserves) {
        res.render("./reserve/index",{reserves:reserves});
    });
};

exports.show  = function(req, res,next) {
    Customer.findById(req.params.id).populate("receipts").exec(function (err, customer) {
        res.render("./customer/show",{customer:customer});
    });
};

exports.showCreate  = function(req, res,next) {
    RoomType.find({}).populate("roomType").exec(function (err, roomTypes) {
        res.render("./reserve/new",{roomTypes:roomTypes});
    });
};

exports.create  = function(req, res,next) {
    var roomType = new mongoose.Types.ObjectId(req.body.roomType);
    var inDate = new Date(req.body.inDate);
    var outDate = new Date(req.body.inDate);
    outDate.setUTCDate(outDate.getUTCDate()+Number(req.body.length) );
    Reserve.find({roomType:roomType}).exec(function (err, reserves) {
        Room.find({rType:roomType}).exec(function (err, rooms) {
            RoomReceipt.find({room:{$in:rooms}}).exec(function (err, rrs) {
                var conflict = [];
                reserves.forEach(function (reserve) {
                    // console.log(reserve.inDate +" - " +reserve.outDate);
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
                    Reserve.create(req.body, function (err, reserve) {
                        Payment.create(req.body,function (err, payment) {
                            reserve.payment = payment;
                            reserve.save();
                            res.redirect("/reserves");
                        });
                    });
                }else{
                    RoomType.find({}).populate("roomType").exec(function (err, roomTypes) {
                        res.render("./reserve/reNew",{roomTypes:roomTypes,reserve:req.body});
                    });
                }
            });
        })
    });
};

exports.showCheckIn  = function(req, res,next) {
    Reserve.findById(req.params.id).populate("roomType").exec(function (err, reserve) {
        Customer.findOne({nationalId:reserve.nationalId}).exec(function (err, customer) {
            if(customer == null)
                res.render("./reserve/newCustomer",{reserve:reserve});
            else{
                RoomType.find().exec(function (err, roomTypes) {
                   res.render("./reserve/checkIn",{customer:customer,reserve:reserve,roomTypes:roomTypes});
                });
            }
        });
    });
};

exports.delete  = function(req, res,next) {
    Reserve.remove({_id:req.params.id}, function (err, reserve) {
        res.redirect("/reserves");
    });
};
