const User = require("../models/users");

async function update(idSpecialist, values) {
  const update = {
    name: values.name,
    lastName: values.lastName,
    birthDate: values.birthDate,
    gender: values.gender,
    cellphone: values.cellphone,
    address: values.address,
    colony: values.colony,
    state: values.state,
    informationComplete: true,
    "specialistInformation.medicalLicense": values.medicalLicense,
    "specialistInformation.medicalSpeciality": values.medicalSpeciality.value,
  };

  let Specialist = await User.findById(idSpecialist);
  if (!Specialist) {
    throw new createError(404, "Usuario no encontrado");
  }

  const specialsitUpdate = await User.findByIdAndUpdate(idSpecialist, update);
  return specialsitUpdate;
}

async function patientList(idSpecialist) {
  const specialist = await User.findById(idSpecialist);
  const patientList = specialist.specialistInformation.patientList;

  return patientList;
}

module.exports = { update, patientList };
