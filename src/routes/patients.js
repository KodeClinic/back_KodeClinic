const express = require("express");
const router = express.Router();
const pxController = require("../controllers/patients");

router.get("/", (req, res) => {
  res.status(200).send("Hola mundo desde pacients");
});

router.post("/:id/newPx", pxController.createNewPx); // :id Corresponde al ID del especialista.
router.get("/:id/myPx", pxController.getAllPatients); // :id Corresponde al ID del especialista para buscar en el arreglo de pacientes.
router.get("/:id", pxController.getPatientById); // :id Corresponde al ID del paciente.

module.exports = router;
