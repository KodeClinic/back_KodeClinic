//Los modelos se importan empezando con mayusculas
const User = require("../models/users");
const jwt = require("../utils/jwt");
const transporter = require("../utils/mailer");
const createError = require("http-errors");
const { compare, encrypt } = require("../utils/handleBcrypt");

async function getById(id) {
  let selectuser = await User.findById(id);
  if (!selectuser) {
    throw new createError(404, "Usuario no encontrado");
  }

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
    role: "specialist",
  });

  await transporter.sendMail({
    from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
    to: email,
    subject: `Código de Verificación de Email: ${securityCode}`,
    html: `
    <body style="font-family: Arial, sans-serif;">

    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">
        <tr>
            <td align="center">
                <h1 style="color: #333;">¡Bienvenido a KodeClinic!</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Estimado/a Especialista,</p>
                <p>Nos complace informarte que tu cuenta ha sido creada con éxito.</p>
                <p>Para completar el proceso de registro y garantizar la seguridad de tu cuenta, necesitamos verificar tu dirección de correo electrónico. Por favor, utiliza el siguiente código de verificación:</p>
                <p style="font-size: 24px; font-weight: bold; color: #007bff;">${securityCode}</p>
                <p>Utiliza este código dentro de la plataforma de KodeClinic para validar tu correo electrónico.</p>
                <p>Si no reconoces este proceso o no has solicitado la creación de una cuenta en KodeClinic, por favor ignora este correo electrónico.</p>
                <p>¡Gracias por elegir KodeClinic!</p>
                <p>Atentamente,</p>
                <p>El equipo de KodeClinic</p>
            </td>
        </tr>
    </table>

</body>`, // html body
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
    to: email,
    subject: `Código de Verificación de Email: ${securityCode}`,
    html: `
    <body style="font-family: Arial, sans-serif;">

      <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">
          <tr>
              <td align="center">
                  <h1 style="color: #333;">Validación de Correo Electrónico</h1>
              </td>
          </tr>
          <tr>
              <td>
                  <p>Estimado/a Usuario,</p>
                  <p>Para garantizar la seguridad de tu cuenta, necesitamos verificar tu dirección de correo electrónico. A continuación, te proporcionamos un código de verificación que deberás ingresar en la plataforma para completar el proceso:</p>
                  <p style="font-size: 24px; font-weight: bold; color: #007bff;">${securityCode}</p>
                  <p>Utiliza este código dentro de KodeClinic para validar tu correo electrónico. Si no has realizado este registro o no reconoces esta solicitud, por favor, ignora este correo electrónico.</p>
                  <p>Si necesitas ayuda o tienes alguna pregunta, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
                  <p>¡Gracias por elegir KodeClinic!</p>
                  <p>Atentamente,</p>
                  <p>El equipo de KodeClinic</p>
              </td>
          </tr>
      </table>

    </body>`, // html body
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

  let token = await jwt.tokenSign(user);

  return [token, user.temporalyPassword];
}

async function login(email, password) {
  let user = await User.findOne({ email: email });

  if (user == null) {
    throw new createError(401, "Email pendiente de validar");
  }
  const checkPassword = await compare(password, user.password);

  if (!checkPassword) {
    throw new createError(401, "Email o password incorrecto");
  } else if (user.validatedAccount === false) {
    throw new createError(406, "Email pendiente de validar");
  }

  let token = await jwt.tokenSign(user);

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
    to: email,
    subject: `Código de restablecimiento de contraseña: ${securityCode}`,
    // text: "Hello world?", // plain text body
    html: `
    <body style="font-family: Arial, sans-serif;">
      <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">
          <tr>
              <td align="center">
                  <h1 style="color: #333;">Restablecimiento de Contraseña</h1>
              </td>
          </tr>
          <tr>
              <td>
                  <p>Estimado/a Usuario,</p>
                  <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en KodeClinic. A continuación, te proporcionamos un código de verificación que necesitarás para completar el proceso:</p>
                  <p style="font-size: 24px; font-weight: bold; color: #007bff;">${securityCode}</p>
                  <p>Por favor, utiliza este código dentro de la plataforma de KodeClinic para restablecer tu contraseña. Si no has solicitado este cambio o no reconoces esta solicitud, te recomendamos que ignores este correo electrónico.</p>
                  <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
                  <p>¡Gracias por confiar en KodeClinic!</p>
                  <p>Atentamente,</p>
                  <p>El equipo de KodeClinic</p>
              </td>
          </tr>
      </table>
    </body>`, // html body
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

async function moreInformation(email) {
  await transporter.sendMail({
    from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
    to: email,
    subject: `Conociendo más sobre KodeClinic`,
    html: `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Descubre KodeClinic: Simplifica tu práctica médica</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .header {
        background-color: #0745CB;
        color: #ffffff;
        text-align: center;
        padding: 10px;
        border-radius: 5px 5px 0 0;
      }
      .content {
        padding: 20px 0;
      }
      .cta-button {
        display: inline-block;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        border-style: solid;
        border-color: #0745CB;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>implifica tu práctica médica con KodeClinic</h1>
      </div>
      <div class="content">
        <p>Estimado/a Especialista,</p>
        <p>Espero que este correo electrónico le encuentre bien. Nos complace presentarle KodeClinic, una innovadora aplicación web diseñada específicamente para especialistas médicos como usted.</p>
        <p>KodeClinic ha sido desarrollada para brindarle todas las herramientas que necesita para gestionar su práctica médica de manera eficiente y efectiva. Entre sus características principales se incluyen:</p>
        <ul>
          <li>Generación ágil de citas con sus pacientes.</li>
          <li>Documentación detallada de los antecedentes médicos.</li>
          <li>Seguimiento exhaustivo a través de historias clínicas digitales.</li>
          <li>Y muchas otras funcionalidades diseñadas para facilitar su día a día.</li>
        </ul>
        <p>Todo esto y más está disponible dentro de la plataforma de KodeClinic. Para comenzar a beneficiarse de estas herramientas, todo lo que necesita hacer es registrarse y generar una nueva cuenta.</p>
        <p>No pierda más tiempo en tareas administrativas tediosas. Únase a KodeClinic hoy mismo y optimice su práctica médica.</p>
        <p><a href="kodeclinic.mx/CreateAccount" class="cta-button">Regístrese ahora</a></p>
        <p>Si tiene alguna pregunta o necesita más información, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
        <p>Atentamente,<br>
        El equipo de KodeClinic<br></p>
      </div>
    </div>
  </body>`,
  });
}

module.exports = {
  getById,
  createAccount,
  validateEmail,
  forgotPassword,
  login,
  restorePassword,
  sendEmailCode,
  moreInformation,
};
