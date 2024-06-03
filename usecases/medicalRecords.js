//Los modelos se importan empezando con mayusculas
const MedicalRecord = require("../models/medicalRecords");
const jwt = require("../utils/jwt");
const Template = require("../models/templates");
const Patient = require("../models/users");
const { createMedicalRecord } = require("../src/controllers/medicalRecords");



async function create(patientId, templateId, values) { //Create new medical record
  const TemplateId = await Template.findOne({ templateID: templateId });
  const PatientId = await Patient.findById(patientId);

  let medicalRecord = await MedicalRecord.create({
    patientId: PatientId,
    templateId: TemplateId,
    values,
  });
  await Patient.findByIdAndUpdate(PatientId, {
    "patientInformation.medicalRecordId": medicalRecord._id,
  });
  return medicalRecord;
}

async function updateByPatientId(patientId, values) { //Update medical record by patientId
  const patient = await Patient.findById(patientId);
      let medRecordId = patient.patientInformation.medicalRecordId;
      const medRecord = await MedicalRecord.findByIdAndUpdate(medRecordId, {
        values
      });
      return medRecord;
}

async function getById(patientId){ //Get medical record by patientId

  const newInputList = (inputsArray, valuesObject) => {
    let result = inputsArray.map((input) => {
      const {
        propertyName,
        label,
        inputType,
        placeholder,
        optionSelect,
        _id,
      } = input;
      let inputName = propertyName;
      let value = valuesObject[inputName] ? valuesObject[inputName] : "";

      return {
        propertyName,
        label,
        inputType,
        placeholder,
        optionSelect,
        _id,
        fieldValue: value,
      };
    });

    return result;
  };

  const medRecord = await MedicalRecord.findOne({
    patientId,
  }).populate("templateId");

  const template = medRecord.templateId; //ok
  const values = medRecord.values; //ok objetc

  const newScreens = template.screens.map((screen) => {
    const { title, sections, screenNumber, _id } = screen;

    if (screen.sections.length === 0) {
      let newList = newInputList(screen.inputList, values); //result es un array de objetos
      return { title, sections, screenNumber, _id, inputList: newList };
    } else if (
      screen.inputList.length === 0 &&
      screen.sections.length !== 0
    ) {
      const newSections = screen.sections.map((section) => {
        const { name, description, isVisible, _id } = section;
        let newList = newInputList(section.inputList, values); //result es un array de objetos
        return { name, description, isVisible, _id, inputList: newList };
      });
      return { title, sections, screenNumber, _id, sections: newSections };
    }
  });

  const { templateID, name, inVisible, _id } = template;

      const newTemplate = {
        templateID,
        name,
        inVisible,
        _id,
        screens: newScreens,
      };
   return [newTemplate, medRecord.values];

}



module.exports = {
  create,
  updateByPatientId,
  getById
};
