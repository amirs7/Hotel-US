let express = require('express');
let adminController = require("../controller/admin");
//
module.exports = function (app) {
    app.route("/admin")
        .get(adminController.index);
    app.route("/admin/users")
        .post(adminController.create)
        .get(adminController.listUsers);
    ;
};