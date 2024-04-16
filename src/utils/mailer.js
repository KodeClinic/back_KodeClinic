const nodemailer = require("nodemailer");
const USEREMAIL = process.env.USEREMAIL;
const PASSEMAIL = process.env.PASSEMAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: USEREMAIL,
    pass: PASSEMAIL,
  },
});

transporter.verify(() => {
  console.log("ready for send emails");
});

module.exports = transporter;
