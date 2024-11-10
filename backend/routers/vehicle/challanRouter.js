const express = require("express");
const router = express.Router();
const challanController = require("../../controllers/vehicle/challanController");
const requireSession = require("../../middlewares/requireSession");
const requireRole = require("../../middlewares/requireRole");

router.post("/add", requireSession, challanController.createChallan);
router.get("/view", requireSession, challanController.getAllChallans);
router.get("/view/:id", requireSession, challanController.getChallanById);
router.post("/change/challan/status/:id",  challanController.updateChallan);
router.delete("/:id", requireSession, challanController.deleteChallan);
router.post("/update/challan/transactionhash/:id/:hash", challanController.getChallanReceipt);

module.exports = router;
