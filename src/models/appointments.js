const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
  },
  consultType: {
    type: String,
    required: true,
    enum: ["therapy", "valoration"],
  },
  paymentType: { type: String, required: true, enum: ["cash", "pending"] },
  paymentStatus: { type: String, required: true, enum: ["paid", "topay"] },
  status: {
    type: String,
    required: true,
    enum: ["completed", "start", "schedule"],
  },
  timeLapse: { type: String, required: true },
  consultingAddress: { type: String, required: true },
  clinicalHistory: { type: mongoose.Types.ObjectId, ref: "clinicalHistories" },
  specialistId: { type: mongoose.Types.ObjectId, ref: "Users" },
  patientId: { type: mongoose.Types.ObjectId, ref: "Users" },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
