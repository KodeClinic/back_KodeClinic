const mongoose = require("mongoose");

const clinicalHistorySchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  appointmentId: { type: mongoose.Types.ObjectId, ref: "Appointment" },
  patientId: { type: mongoose.Types.ObjectId, ref: "User" },
  templateId: { type: mongoose.Types.ObjectId, ref: "Template" },
  evaluation: {
    structural: {
      injuryZone: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      timeOfEvolution: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      damagedStructure: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      mechanismOfInjury: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      functionalLimitation: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
    },
    studies: {
      ENApain: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      temporality: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      type: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      previousStudies: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      neurologicalDiseases: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      kidneyDiseases: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      vascularDiseases: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      goniometry: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      posturalEvaluation: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
    },
    ratings: {
      passiveROM: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      activeROM: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      danielsForce: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      muscularTone: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      trophism: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      sensitivity: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      orthopedicTests: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      functionalTest: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      suffering: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      condition: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      prognosis: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
      reassessment: {
        inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
        value: { type: String, required: false },
      },
    },
  },
  treatment: {
    typeOfExercise: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
    numberOfRepetitions: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
    periodicity: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
    observedProgress: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
    medication: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
    recomendations: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
  },
  clinic_notes: {
    discoveryNotes: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
    evolutionNote: {
      inputId: { type: mongoose.Types.ObjectId, ref: "Template" },
      value: { type: String, required: false },
    },
  },
});

const ClinicalHistory = mongoose.model(
  "ClinicalHistory",
  clinicalHistorySchema
);

module.exports = ClinicalHistory;
