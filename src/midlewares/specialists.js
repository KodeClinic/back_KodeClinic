const createError = require("http-errors");
const jwt = require("../utils/jwt");

function specialistValidation(req, res, next) {
  try {
    const token = req.headers["bearerauth"];

    if (!token) {
      throw new createError(401, "token required");
    }

    next();
  } catch (error) {
    response.status(401);
    response.json({
      message: "unauthorized",
      error: error.message,
    });
  }
}

module.exports = specialistValidation;
