const mongoose = require("mongoose");

const PatientInformationSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  specialistId: { type: mongoose.Types.ObjectId, ref: "Users" },
  occupation: { type: String, required: false },
  bloodType: { type: String, required: false },
  religion: { type: String, required: false },
  emergencyContact: [
    {
      number: { type: String, required: false },
      relationship: { type: String, required: false },
    },
  ],
  appointmentList: [
    {
      appointmentId: { type: mongoose.Types.ObjectId, ref: "Appointment" },
    },
  ],
  medicalRecordId: { type: mongoose.Types.ObjectId, ref: "MedicalRecord" },
});

module.exports = PatientInformationSchema;
