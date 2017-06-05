let express = require('express');
let serviceController = require("../controller/service");
//
module.exports = function (app) {
    app.route("/services")
        .get(serviceController.index)
        .post(serviceController.create);
    app.route("/services/:id")
        .delete(serviceController.delete);
    app.route("/services/:id/changeStatus")
        .get(serviceController.changeStatus);
};