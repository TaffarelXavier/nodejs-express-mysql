const express = require('express');
const token = require("../lib/token.lib");

const router = express.Router();


const UsersController = require("../controllers/users.controller.js");

router.get('/', function(req, res, next) {
  res.json({message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

// Create a new Customer
router.post("/login", UsersController.login);

router.post("/users", UsersController.create);
router.get("/users", token.verify, UsersController.findAll);
router.get("/users/:id", UsersController.findOne);
router.put("/users/:id", UsersController.update);
router.delete("/users/:id", UsersController.delete);
router.delete("/users", UsersController.deleteAll);

module.exports = router;
