let express = require('express');
let roomTypeController = require("../controller/roomType");
//
module.exports = function (app) {
    app.route("/roomTypes")
        .get(roomTypeController.index)
        .post(roomTypeController.create);
    app.route("/roomTypes/:id")
        .delete(roomTypeController.delete);
};