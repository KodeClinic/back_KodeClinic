//Los modelos se importan empezando con mayusculas
const MedicalRecord = require("../models/medicalRecords");
const jwt = require("../utils/jwt");
const Template = require("../models/templates");
const Patient = require("../models/users");
const { restart } = require("nodemon");
const inputsSchema = require("../models/submodels/inputsSchema");

module.exports = {
  createMedicalRecord: async (req, res, next) => {
    const { patientId, templateId } = req.params;
    // const {} = req.body;

    try {
      const TemplateId = await Template.findOne({ templateID: templateId });
      const PatientId = await Patient.findById(patientId);
      let medicalRecord = await MedicalRecord.create({
        patientId: PatientId,
        templateId: TemplateId,
        values: req.body,
      });

      await Patient.findByIdAndUpdate(PatientId, {
        "patientInformation.medicalRecordId": medicalRecord,
      });

      next({
        status: 201,
        send: {
          msg: "Antecedentes médicos creados con éxito",
          data: medicalRecord,
        },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Antecedentes no creados", err: error },
      });
    }
  },

  getMedicalRecord: async (req, res, next) => {
    const { patientId, templateId } = req.params;

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

    try {
      const medRecord = await MedicalRecord.findOne({
        patientId: patientId,
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

      next({
        status: 201,
        send: {
          msg: "Antecedentes médicos encontrados con éxito",
          data: newTemplate,
        },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Antecedentes médicos no encotrados", err: error },
      });
    }
  },
};
