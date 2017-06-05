var express = require('express');
var url = require("url");
var Service = require("../models/service");
var mongoose = require("mongoose");


exports.index  = function(req, res,next) {
    Service.find({}).populate("rType").exec(function (err, services) {
        res.render("service/index",{services:services});
    });
};

exports.create  = function(req, res,next) {
    Service.create({rate:req.body.rate, name:req.body.name}, function (err, service) {
        res.redirect("/services");
    });
};

exports.delete  = function(req, res,next) {
    Service.remove({_id:req.params.id}, function (err, service) {
        res.redirect("/services");
    });
};

exports.changeStatus = function (req, res, next) {
    Service.findById(req.params.id, function (err, service) {
        service.changeStatus();
        res.redirect("/services");
    });
};