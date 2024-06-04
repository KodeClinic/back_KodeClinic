const express = require("express");
const router = express.Router();
const specialistsUseCases = require("../useCases/specialists");
const checkRoleAuth = require("../midlewares/roleAuth");

//Specialists

//PATCH /api/specialists/:idSpecialist
router.patch(
  "/:idSpecialist",
  checkRoleAuth(["specialist"]),
  async (req, res, next) => {
    try {
      const { idSpecialist } = req.params;
      const values = req.body;

      const specialistUpdate = await specialistsUseCases.update(
        idSpecialist,
        values
      );

      res.json({
        msg: "Inforación del Especialista actualizada",
        data: specialistUpdate,
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Información no actualizada", err: error },
      });
    }
  }
);

//PATCH /api/specialists/:idSpecialist/patients
router.get(
  "/:idSpecialist/patients",
  checkRoleAuth(["specialist"]),
  async (req, res, next) => {
    try {
      const { idSpecialist } = req.params;

      const listOfPatients = await specialistsUseCases.patientList(
        idSpecialist
      );

      res.json({
        msg: "Información del Especialista actualizada",
        data: listOfPatients,
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Pacientes no encontrados", err: error },
      });
    }
  }
);
module.exports = router;
