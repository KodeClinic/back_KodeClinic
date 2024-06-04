const express = require("express");
const router = express.Router();
const templatesUseCases = require("../useCases/templates");
const checkRoleAuth = require("../midlewares/roleAuth");

//GET  /api/templates/:templateId
router.get(
  "/:templateId",
  checkRoleAuth(["specialist"]),
  async (req, res, next) => {
    try {
      const { templateId } = req.params;

      const template = await templatesUseCases.getById(templateId);

      res.json({
        msg: "Template encotrado",
        data: template,
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Template no encontrado", err: error },
      });
    }
  }
);

//POSTT /api/templates/
router.post("/", checkRoleAuth(["admin"]), async (req, res, next) => {
  try {
    const { body } = req;

    const newTemplate = await templatesUseCases.create(body);

    res.json({
      msg: "Nuevo template creado",
      data: newTemplate,
    });
  } catch (error) {
    next({ status: 400, send: { msg: "Template no creado", err: error } });
  }
}); //

module.exports = router;
