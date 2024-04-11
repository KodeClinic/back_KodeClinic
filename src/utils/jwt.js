const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/users");

module.exports = {
  create: (data) => {
    let token = jwt.sign({ _id: data._id, email: data.email }, JWT_SECRET, {
      expiresIn: "1 day",
    });
    return token;
  },
  verify: (req, res, next) => {
    const token = req.headers["bearerauth"];
    const dateNow = new Date();

    if (!token) {
      return res.status(401).send({ msg: "Usuario no autorizado" });
    }
    jwt.verify(token, JWT_SECRET, async (err, decode) => {
      if (err) return res.status(401).send({ msg: "Token invalido" });
      if (decode.exp < dateNow.getTime() / 1000) {
        return res.status(401).send({ msg: "Sesion expirada" });
      }
      req.loginUser = await User.findById(decode._id);
      next();
    });
  },
};
