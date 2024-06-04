const { verifyToken } = require("../utils/jwt");
const createError = require("http-errors");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["bearerauth"];

    if (!token) {
      throw new createError(401, "Token requerido");
    }

    const payload = await verifyToken(token);

    if (!payload) {
      throw new createError(401, "No se pudo verificar el token");
    }

    next();
  } catch (error) {
    res.status(401);
    res.json({
      message: "No autorizado",
      error: error.message,
    });
  }
};

module.exports = auth;
