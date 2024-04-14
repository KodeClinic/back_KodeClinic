const mongoose = require("mongoose");
const URI = process.env.URI;

module.exports = {
  connect: async () => {
    try {
      let conection = await mongoose.connect(URI);
      if (conection) console.log("DB Connected");
    } catch (error) {
      console.log("Error connect", error);
    }
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};
