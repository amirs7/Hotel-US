var express = require('express');
var url = require("url");
var User = require("../models/user");
var RoomType = require("../models/roomType");
var mongoose = require("mongoose");


exports.index  = function(req, res,next) {
    res.render("admin/index",{rooms:rooms,roomTypes:roomTypes});
};

exports.create  = function(req, res,next) {
    User.create(req.body,function (err, user) {
      res.redirect("/admin/users")
    })
};

exports.listUsers = function (req, res, next) {
    User.find({}).exec(function (err, users) {
        res.render("admin/users",{users:users});
    });
};