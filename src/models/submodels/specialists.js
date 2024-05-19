const mongoose = require("mongoose");

const SpecialistInformationSchema = new mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  medicalLicense: { type: String, required: false },
  medicalSpeciality: { type: String, required: false },
  education: {
    universityName: { type: String, required: false },
    carrer: { type: String, required: false },
    title: { type: String, required: false },
  },
  certifications: {
    institutionName: { type: String, required: false },
    certificationDate: { type: String, required: false },
    certificationName: { type: String, required: false },
  },
  patientList: [
    {
      patientID: { type: mongoose.Types.ObjectId, ref: "Users" },
      patientName: { type: String, required: false },
      patientLastName: { type: String, required: false },
      patientGender: { type: String, required: false },
      patientCellphone: { type: String, required: false },
    },
  ],
  availability: [
    {
      day: { type: String, required: false },
      start: { type: String, required: false },
      end: { type: String, required: false },
    },
  ],
  // appointmentList: [
  //   {
  //     appointmentId: { type: mongoose.Types.ObjectId, required: false },
  //   },
  // ],
});

module.exports = SpecialistInformationSchema;
