const express = require("express");
const router = express.Router();
const usersUseCases = require("../useCases/users");
const checkRoleAuth = require("../midlewares/roleAuth");

//Users

//GET /api/users/:id
router.get(
  "/:id",
  checkRoleAuth(["specialist", "patient"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await usersUseCases.getById(id);

      res.json({
        msg: "Usuario encotrado",
        data: user,
      });
    } catch (error) {
      next({ status: 401, send: { msg: "Usuario no encontrado", err: error } });
    }
  }
);

module.exports = router;
