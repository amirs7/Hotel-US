let express = require('express');
let userController = require("../controller/user");
//
module.exports = function (app) {
    app.route("/login")
        .get(userController.showLogIn)
        .post(userController.logIn);
    app.route("/reception")
        .get(userController.reception)
    app.route("/logout")
        .get(userController.logOut);
};