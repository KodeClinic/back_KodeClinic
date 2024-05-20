
const Specialist = require("../models/users");

module.exports = {
  
  editInformation: async (req, res, next) => {
    try {
      const specialist = await Specialist.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      if (!specialist) {
        return res.status(404).send({ message: "Specialist information not found" });
      }
      res.status(200).send({ message: "Specialist information updated successfully", data: specialist });
    } catch (error) {
      next(error);
    }
  }
};
