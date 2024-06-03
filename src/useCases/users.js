//Los modelos se importan empezando con mayusculas
const User = require("../models/users");
const jwt = require("../utils/jwt");
const transporter = require("../utils/mailer");
const { compare, encrypt } = require("../helpers/handleBcrypt");

async function getById(id) {
  let selectuser = await User.findById(id);
  if (!selectuser) {
    throw new createError(404, "Usuario no encontrado");
  }

  //   selectuser.password = "xxxx";

  return selectuser;
}

async function createAccount(email, password) {
  let securityCode = "";

  for (let index = 0; index <= 3; index++) {
    let character = Math.ceil(Math.random() * 9);
    securityCode += character;
  }

  const hassedPassword = await encrypt(password); //Hashea la contraseña

  let user = await User.create({
    email: email,
    password: hassedPassword,
    verificationCode: securityCode,
    validatedAccount: false,
    informationComplete: false,
    temporalyPassword: false,
  });

  await transporter.sendMail({
    from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
    to: req.body.email,
    subject: `Código de Verificación de Email: ${securityCode}`,
    html: `<b>Bienvenido a KodeClinc, el código para completar la verificación de este correo es: ${securityCode} </b>`, // html body
  });

  return user.email;
}

async function sendEmailCode(email) {
  let securityCode = "";

  for (let index = 0; index <= 3; index++) {
    let character = Math.ceil(Math.random() * 9);
    securityCode += character;
  }

  let user = await User.findOne({
    email: email,
  });

  user.verificationCode = securityCode;
  await user.save();

  await transporter.sendMail({
    from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
    to: req.body.email,
    subject: `Código de Verificación de Email: ${securityCode}`,
    html: `<b>El código para completar la verificación de este correo es: ${securityCode} </b>`, // html body
  });

  return user.email;
}

async function validateEmail(email, securityCode) {
  let user = await User.findOne({
    email: email,
    verificationCode: securityCode,
  });

  if (!user) {
    throw new createError(401, "Código incorrecto");
  }

  user.validatedAccount = true;
  user.verificationCode = "";
  await user.save();

  let token = jwt.create(user);

  return [token, user.temporalyPassword];
}

async function login(email, password) {
  let user = await User.findOne({ email: email });

  const checkPassword = await compare(password, user.password);

  if (!checkPassword) {
    throw new createError(400, "Email o password incorrecto");
  } else if (user.validatedAccount === false) {
    throw new createError(401, "Email pendiente de validar");
  }

  let token = jwt.create(user);

  const userData = {
    token: token,
    id: user._id,
    role: user.role,
    informationComplete: user.informationComplete,
    temporalyPassword: user.temporalyPassword,
  };

  return userData;
}

async function forgotPassword(email) {
  let user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw new createError(401, "Email no registrador");
  }

  let securityCode = "";

  for (let index = 0; index <= 3; index++) {
    let character = Math.ceil(Math.random() * 9);
    securityCode += character;
  }

  user.verificationCode = securityCode;
  await user.save();

  await transporter.sendMail({
    from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
    to: req.body.email,
    subject: `Código de restablecimiento de contraseña: ${securityCode}`,
    // text: "Hello world?", // plain text body
    html: `<b>El código para poder restablecer su contraseña es: ${securityCode} </b>`, // html body
  });

  return user.email;
}

async function restorePassword(email, newpassword) {
  const hassedPassword = await encrypt(newpassword); //Hashea la contraseña

  let user = await User.findOne({
    email: email,
  });

  user.password = hassedPassword;
  user.temporalyPassword = false;
  await user.save();

  return "Contraseña restablecida con éxito";
}

module.exports = {
  getById,
  createAccount,
  validateEmail,
  forgotPassword,
  login,
  restorePassword,
  sendEmailCode,
};
