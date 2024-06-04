require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./src/routes/index");
const publicRoutes = require("./src/public/routes/index");
const db = require("./src/utils/db");
const auth = require("./src/midlewares/auth");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors("*"));

app.use(express.json());
app.use(morgan("dev"));

//Importacion de rutas públicas
app.use("/", publicRoutes);

//Importacion de rutas privadas
// app.use("/api", jwt.verify, routes); //validateToken, validateSpecialist, isSpecialist
app.use("/api", auth, routes); //validateToken, validateSpecialist, isSpecialist

//Midleware del final
app.use((resp, req, res, next) => {
  res.status(resp.status).send(resp.send);
});

// app.use((resp, req, res, next) => {
//   console.log(resp);
// });

db.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening in port ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB conection error");
  });
