const ClinicalHistory = require("../models/clinicalHistories");
const Patient = require("../models/users");
const Template = require("../models/templates");
const Appointment = require("../models/appointments");

async function update(patientId, templateId, appointmentId, body) {
  const template = await Template.findOne({ templateID: templateId });
  const appointment = await Appointment.findById(appointmentId);
  const clinicalHistory = await ClinicalHistory.findByIdAndUpdate(
    appointment.clinicalHistory,
    {
      templateId: template._id,
      values: body,
      status: "completed",
    }
  );
  await Appointment.findByIdAndUpdate(appointmentId, {
    status: "completed",
  });

  return [clinicalHistory, appointment.specialistId];
}

async function get(patientId, appointmentId) {
  const newInputList = (inputsArray, valuesObject) => {
    let result = inputsArray.map((input) => {
      const { propertyName, label, inputType, placeholder, optionSelect, _id } =
        input;
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

  const clinicalHistory = await ClinicalHistory.find({
    appointmentId: appointmentId,
  });

  const template = await Template.findOne({ templateID: 2 });

  if (clinicalHistory[0].hasOwnProperty("values")) {
    throw new createError(404, "Historia Clinica vacía");
  } else {
    const values = clinicalHistory[0].values;

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
        return {
          title,
          sections,
          screenNumber,
          _id,
          sections: newSections,
        };
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

    return [newTemplate, values];
  }
}

module.exports = { update, get };
