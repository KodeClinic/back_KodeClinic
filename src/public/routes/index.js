const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users");

//Users
router.get("/users/:id", userController.getbyId); //publico
// router.post("/users", userController.post); //publico
router.post("/users/createAccount", userController.createAccount); //público
// router.post("/users/validateEmail", userController.validateEmail); //público
router.post("/users/auth/login", userController.login); //publico

module.exports = router;
