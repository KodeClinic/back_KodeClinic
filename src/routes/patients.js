// const express = require("express");
// const router = express.Router();
// const pxController = require("../controllers/patients");

// router.get("/", (req, res) => {
//   res.status(200).send("Hola mundo desde pacients");
// });

// router.post("/:id/newPx", pxController.createNewPx); // :id Corresponde al ID del especialista.
// router.get("/:id/myPx", pxController.getAllPatients); // :id Corresponde al ID del especialista para buscar en el arreglo de pacientes.
// router.get("/:id", pxController.getPatientById); // :id Corresponde al ID del paciente.

// module.exports = router;

const express = require("express");
const router = express.Router();
const patientsUseCases = require("../useCases/patients");

//Patients

// POST /api/patients/specialists/:id
router.post("/specialists/:id", async (req, res, next) => {
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
});

//GET /api/patients/
router.get("/", async (req, res, next) => {
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
router.get("/:id", async (req, res, next) => {
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
