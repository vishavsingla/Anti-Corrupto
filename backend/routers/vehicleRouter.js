const router = require("express").Router();
const vehicleController = require("../controllers/vehicleController");

router.post("/add", vehicleController.createVehicle);
router.get("/view", vehicleController.getAllVehicles);
router.get("/view/:id", vehicleController.getVehicleById);
router.post("/update/:id", vehicleController.updateVehicle);
router.post("/delete/:id", vehicleController.deleteVehicle);
router.post("/update/pollution/:id", vehicleController.updatePollutionDone);

module.exports = router;