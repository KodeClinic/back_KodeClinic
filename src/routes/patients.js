const express = require("express");
const router = express.Router();
const pxController = require("../controllers/patients");

/*router.get("/", (req, res) => {
  res.status(200).send("Hola mundo desde pacients");
});*/

router.post("/", pxController.createPxAdditionalInfo);
router.get("/:id", pxController.getPatientById);
router.get("/", pxController.getAllPatients);

module.exports = router;
