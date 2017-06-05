let express = require('express');
let roomController = require("../controller/room");
//
module.exports = function (app) {
    app.route("/rooms")
        .get(roomController.index)
        .post(roomController.create);
    app.route("/rooms/:id")
        .delete(roomController.delete);
    app.route("/rooms/:id/changeStatus")
        .get(roomController.changeStatus)
};