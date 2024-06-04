const bcrypt = require("bcrypt");

//Encriptar contraseña
const encrypt = async (passwordPlain) => {
  const hash = await bcrypt.hash(passwordPlain, 10);
  return await hash;
};

//Comparar contraseña
const compare = async (passwordPlain, passwordHashed) => {
  return await bcrypt.compare(passwordPlain, passwordHashed);
};

module.exports = { encrypt, compare };
