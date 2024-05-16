const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const specialistController = require("../controllers/specialists");

//Users
router.get("/:id", userController.getbyId); // /api/users/:id

//Specialists
router.patch(
  "/completeInformation/:idSpecialist",
  specialistController.completeInformation
); //api/users/completeInformation/:idSpecialist
module.exports = router;
