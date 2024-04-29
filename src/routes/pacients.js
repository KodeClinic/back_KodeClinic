const express = require("express");
const router = express.Router();
const pxController = require("../controllers/pacients");

/*router.get("/", (req, res) => {
  res.status(200).send("Hola mundo desde pacients");
});*/

router.post("/", pxController.post);
router.get("/:id", pxController.getById);
router.get("/", pxController.getAll);

module.exports = router;
