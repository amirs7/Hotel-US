let express = require('express');
let reserveController = require("../controller/reserve");
//
module.exports = function (app) {
    app.route("/reserves")
        .get(reserveController.index)
        .post(reserveController.create);
    app.route("/reserves/new")
        .get(reserveController.showCreate);
    app.route("/reserves/:id/checkIn")
        .get(reserveController.showCheckIn);
    app.route("/reserves/:id")
        .delete(reserveController.delete);
};