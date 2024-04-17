const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Debe ingresar un correo valido",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    required: false,
  },
  validatedAccount: {
    type: Boolean,
    required: false,
  },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
