var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Customer = require("../models/customer");
var Reserve = require("../models/reserve");

exports.showLogIn  = function(req, res,next) {
    res.render("login");
};

exports.reception = function(req, res,next) {
    Customer.find().exec(function (err, customers) {
        Reserve.find().populate("roomType").exec(function (err, reserves) {
            res.render("./reception",{reserves:reserves,customers:customers});
        });
    })

};

exports.logIn = function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            if(user.role == "receptor")
                return res.redirect("/reception");
            else
                return res.redirect("/");
        });
    })(req, res, next);
};


exports.logOut = function(req, res){
    req.logout();
    res.redirect("/");
};
