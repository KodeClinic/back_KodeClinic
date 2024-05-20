const express = require("express");
const router = express.Router();
const editInformationController = require("../controllers/specialists");


// Ruta para mostrar el formulario de edición
//router.get("/:id/edit", editInformationController.showEditForm);

// Ruta para manejar el envío del formulario de edición
router.put("/:id/edit", editInformationController.editInformation);

module.exports = router;

