// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/users");
// const specialistController = require("../controllers/specialists");

// //Users
// router.get("/get/:id", userController.getbyId); // /api/users/get/:id

// //Specialists
// router.patch(
//   "/completeInformation/:idSpecialist",
//   specialistController.completeInformation
// ); //api/users/completeInformation/:idSpecialist

// router.get("/patientList/:idSpecialist", specialistController.getPatients); //api/users/patientList/:idSpecialist
// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const specialistController = require("../controllers/specialists");

//Users
router.get("/get/:id", userController.getbyId); // /api/users/get/:id

//Specialists
router.patch(
  "/completeInformation/:idSpecialist",
  specialistController.completeInformation
); //api/users/completeInformation/:idSpecialist

router.get("/patientList/:idSpecialist", specialistController.getPatients); //api/users/patientList/:idSpecialist
module.exports = router;
