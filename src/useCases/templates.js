const Template = require("../models/templates");
const createError = require("http-errors");

async function getById(templateId) {
  let selectTemplate = await Template.findOne({ templateID: templateId });

  if (!selectTemplate) {
    throw new createError(404, "Template no encontrado");
  }

  return selectTemplate;
}

async function create(body) {
  let templateCreated = await Template.create(body);

  return templateCreated;
}

module.exports = { getById, create };
