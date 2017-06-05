var express = require('express');
var url = require("url");
var Room = require("../models/room");
var RoomType = require("../models/roomType");
var mongoose = require("mongoose");


exports.index  = function(req, res,next) {
    console.log(req.user);
    Room.find({}).populate("rType").exec(function (err, rooms) {
        RoomType.find({}).exec(function (err,roomTypes) {
            res.render("room/index",{rooms:rooms,roomTypes:roomTypes});
        });
    });
};

exports.create  = function(req, res,next) {
    Room.create({no:req.body.no, status:req.body.status, rType:req.body.rType}, function (err, room) {
        res.redirect("/rooms");
    });
};

exports.delete  = function(req, res,next) {
    Room.remove({_id:req.params.id}, function (err, roomTypes) {
        res.redirect("/rooms");
    });
};

exports.changeStatus = function (req, res, next) {
    Room.findById(req.params.id, function (err, room) {
        room.changeStatus();
        res.redirect("/rooms");
    });
};
