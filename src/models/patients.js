const mongoose = require("mongoose");

const PatientInformationSchema = new mongoose.Schema({
  specialistId: { type: mongoose.Types.ObjectId, ref: "Users" },
  occupation: { type: String, required: false },
  bloodType: { type: String, required: false },
  religion: { type: String, required: false },
  emergencyContact: [
    {
      name: { type: String, required: false },
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
