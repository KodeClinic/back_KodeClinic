//Los modelos se importan empezando con mayusculas
const Template = require("../models/templates");
const jwt = require("../utils/jwt");

module.exports = {
  getbyTemplateId: async (req, res, next) => {
    const { templateId } = req.params;
    try {
      let selectTemplate = await Template.findOne({ templateID: templateId });
      // console.log(selectTemplate);
      if (!selectTemplate) {
        next({ status: 404, send: { msg: "Template no encontrado" } });
      }
      next({
        status: 201,
        send: { msg: "Template encotrado", data: selectTemplate },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Template no encontrado", err: error },
      });
    }
  },

  postTemplate: async (req, res, next) => {
    try {
      let template = await Template.create(req.body);
      next({
        status: 201,
        send: {
          msg: "Nuevo template creado",
          data: template,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Template no creado", err: error } });
    }
  },
};
