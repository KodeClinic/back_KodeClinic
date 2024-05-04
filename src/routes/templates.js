const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templates");

//Templates
router.get("/:templateId", templateController.getbyTemplateId); // /api/templates/:templateId
router.post("/postTemplate", templateController.postTemplate); // /api/templates/postTemplate

module.exports = router;
