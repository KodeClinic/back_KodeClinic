const { verifyToken } = require("../utils/jwt");
const userModel = require("../models/users");

const checkRoleAuth =
  (roles = []) =>
  async (req, res, next) => {
    try {
      // const {userId, userRole} = req
      const token = req.headers["bearerauth"];
      const payload = await verifyToken(token); // Ya no es necesario vovler a validarlo, ser puede enviar el id y el rol con el req
      const user = await userModel.findById(payload._id);

      if (roles.includes(user.role)) {
        next();
      } else {
        res.status(409);
        res.send({ error: "No tienes permisos" });
      }
    } catch (error) {
      res.status(401);
      res.json({
        message: "No autorizado",
        error: error.message,
      });
    }
  };

module.exports = checkRoleAuth;
