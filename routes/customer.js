let express = require('express');
let customerController = require("../controller/customer");
//
module.exports = function (app) {
    app.route("/customers")
        .get(customerController.index)
        .post(customerController.create);
    app.route("/customers/new")
        .get(customerController.showCreate);
    app.route("/customers/:id")
        .get(customerController.show)
        .delete(customerController.delete);
    app.route("/customers/:id/checkin")
        .get(customerController.showCheckIn)
        .post(customerController.checkIn);
    app.route("/customers/:id/confirmCheckIn")
        .post(customerController.confirmCheckIn);
    app.route("/customers/:id/checkOut")
        .get(customerController.showCheckOut)
        .post(customerController.checkOut);
    app.route("/customers/:id/addRoomReceipt")
        .get(customerController.showAddRoomReceipt)
        .post(customerController.addRoomReceipt);
    app.route("/customers/:id/addServiceReceipt")
        .get(customerController.showAddServiceReceipt)
        .post(customerController.addServiceReceipt);
    app.route("/customers/:id/addPayment")
        .get(customerController.showAddPayment)
        .post(customerController.addPayment);
};