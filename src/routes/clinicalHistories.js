const express = require("express");
const router = express.Router();
const clinicalHistoriesUseCases = require("../useCases/clinicalHistories");
const checkRoleAuth = require("../midlewares/roleAuth");

//Update
router.patch(
  "/patients/:patientId/templates/:templateId/appointments/:appointmentId",
  checkRoleAuth(["specialist"]),
  async (req, res, next) => {
    try {
      const { patientId, templateId, appointmentId } = req.params;
      const { body } = req;

      const clinicalHistoryUpdate = await clinicalHistoriesUseCases.update(
        patientId,
        templateId,
        appointmentId,
        body
      );

      res.json({
        msg: "Historia Clinica actualizada con éxito",
        data: clinicalHistoryUpdate,
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Historia Clinica no creada", err: error },
      });
    }
  }
);

router.get(
  "/patients/:patientId/appointments/:appointmentId",
  checkRoleAuth(["specialist"]),
  async (req, res, next) => {
    try {
      const { patientId } = req.params;
      const { appointmentId } = req.params;

      const clinicalHistory = await clinicalHistoriesUseCases.get(
        patientId,
        appointmentId
      );

      res.json({
        msg: "Historia Clinica encontrada con éxito",
        data: clinicalHistory,
      });
    } catch (error) {
      next({
        status: 401,
        send: { msg: "Historia Clínica no encontrada", err: error },
      });
    }
  }
);

module.exports = router;
