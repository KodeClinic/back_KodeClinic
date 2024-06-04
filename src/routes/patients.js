const express = require("express");
const router = express.Router();
const patientsUseCases = require("../useCases/patients");
const checkRoleAuth = require("../midlewares/roleAuth");

//Patients

// POST /api/patients/specialists/:id
router.post(
  "/specialists/:id",
  checkRoleAuth(["specialist"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const newPatient = await patientsUseCases.create(id);

      res.json({
        msg: "Paciente creado",
        data: newPatient,
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Paciente no creado: ", err: error } });
    }
  }
);

//GET /api/patients/
router.get("/", checkRoleAuth(["admin"]), async (req, res, next) => {
  try {
    const allPatients = await patientsUseCases.all();

    res.json({
      msg: "Pacientes encontrados",
      data: allPatients,
    });
  } catch (error) {
    next({ status: 404, send: { msg: "Pacientes no encontrados" } });
  }
});

// GET /api/patients/:id
router.get("/:id", checkRoleAuth(["specialist"]), async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await patientsUseCases.getById(id);

    res.json({
      msg: "Paciente encontrado",
      data: patient,
    });
  } catch (error) {
    next({ status: 404, send: { msg: "Paciente no encontrado" } });
  }
});

module.exports = router;
