const express = require("express");
const router = express.Router();

//Controlador
const facturaController = require("../controllers/facturaController");

//Rutas locahost:3000/factura/

//Listado factura
router.get("/", facturaController.get);

//Obtener factura
router.get("/:id", facturaController.getById);

//Obtener factura
router.get("/getByFechaNormal/:fecha", facturaController.getByFechaNormal);

//Obtener factura
router.get("/getByIdCliente/:id", facturaController.getByIdCliente);

//Obtener factura por fecha y idCliente
router.get("/getByFechaAndByIdUsuario/:fecha/:idUsuario", facturaController.getByFechaAndByIdUsuario);

//Obtener factura por idSucursal
router.get("/facturasByIdSucursal/:id", facturaController.getByIdSucursal);

//Obtener factura por idSucursal
router.get("/facturasByFecha/:fecha/:idSucursal", facturaController.getByFecha);

//Obtener Reserva por Filtro de nombre cliente
router.get("/byCliente/:nombre/:idSucursal", facturaController.getByCliente);

//Obtener Reserva por Filtro de nombre cliente
router.post("/", facturaController.create);

//Obtener Reserva por Filtro de nombre cliente
router.put("/:id", facturaController.update);

router.put("/updateStatus/:id", facturaController.updateStatus);

module.exports = router;
