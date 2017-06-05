var express = require('express');
var url = require("url");
var RoomType = require("../models/roomType");
var mongoose = require("mongoose");


exports.index  = function(req, res,next) {
    RoomType.find({}).exec(function (err, roomTypes) {
        res.render("roomTypes/index",{roomTypes:roomTypes});
    });
};

exports.create  = function(req, res,next) {
    RoomType.create({title:req.body.title,rate:req.body.rate}, function (err, roomType) {
        res.redirect("/roomTypes");
    });
};

exports.delete  = function(req, res,next) {
    RoomType.remove({_id:req.params.id}, function (err, roomTypes) {
        res.redirect("/roomTypes");
    });
};

