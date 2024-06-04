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
const usersUseCases = require("../useCases/users");

//Users

//GET /api/users/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await usersUseCases.getById(id);

    res.json({
      msg: "Usuario encotrado",
      data: user,
    });
  } catch (error) {
    next({ status: 401, send: { msg: "Usuario no encontrado", err: error } });
  }
});

module.exports = router;
