const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templates");

//Templates
router.get("/:id", templateController.getbyId); // /api/templates/:id
router.post("/postTemplate", templateController.postTemplate); // /api/templates/postTemplate

module.exports = router;
