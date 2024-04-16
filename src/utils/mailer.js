const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "contacto.kodeclinic@gmail.com",
    pass: "dkxzeorxzlhehoks",
  },
});

transporter.verify(() => {
  console.log("ready for send emails");
});

module.exports = transporter;
