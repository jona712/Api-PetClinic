const express = require("express");
const router = express.Router();
const sendEmailController = require("../controllers/sendEmailController");

// Ruta para enviar factura confirmada
router.post("/send-factura", sendEmailController.sendFactura);

module.exports = router;
