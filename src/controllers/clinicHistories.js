const ClinicalHistory = require("../models/clinicalHistories");
const Patient = require("../models/users");
const Template = require("../models/templates");
const Appointment = require("../models/appointments");

module.exports = {
  updateClinicalHistory: async (req, res, next) => {
    const { patientId, templateId, appointmentId } = req.params;

    try {
      const template = await Template.findOne({ templateID: templateId });
      const appointment = await Appointment.findById(appointmentId);
      const clinicalHistory = await ClinicalHistory.findByIdAndUpdate(
        appointment.clinicalHistory,
        {
          templateId: template._id,
          values: req.body,
          status: "completed",
        }
      );
      const updateAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          status: "completed",
        }
      );

      next({
        status: 201,
        send: {
          msg: "Historia Clinica creada con éxito",
          data: req.body,
          data: [clinicalHistory, appointment.specialistId],
        },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Historia Clinica no creada", err: error },
      });
    }
  },

  getClinicalHistory: async (req, res, next) => {
    const { patientId, appointmentId } = req.params;

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
      const appointment = await Appointment.findById(appointmentId);
      const clinicalHistory = await ClinicalHistory.findById(
        appointment.clinicalHistory
      );
      const template = await Template.findOne({ templateID: 2 });

      if (!clinicalHistory.hasOwnProperty("values")) {
        next({
          status: 404,
          send: {
            msg: "Historia Clinica vacía",
            // data: [newTemplate, values],
          },
        });
      } else {
        const values = clinicalHistory.values;

        // console.log("appointment", appointment);
        // console.log("clinicalHistory", clinicalHistory);
        // console.log("template", template);
        // console.log("values", values);

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

        console.log(newTemplate);

        next({
          status: 201,
          send: {
            msg: "Historia Clinica encontrada con éxito",
            data: [newTemplate, values],
          },
        });
      }
    } catch (error) {
      console.log(error);
      next({
        status: 401,
        send: { msg: "Historia Clínica no encontrada", err: error },
      });
    }
  },
};
