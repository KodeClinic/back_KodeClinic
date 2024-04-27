const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

//Users
router.get("/:id", userController.getbyId);

module.exports = router;
