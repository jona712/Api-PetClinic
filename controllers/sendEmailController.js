// sendEmailController.js
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

// Configura Multer para manejar la carga de archivos
const storage = multer.memoryStorage(); // Usa almacenamiento en memoria para archivos
const upload = multer({ storage: storage });

exports.sendFactura = (req, res) => {
  // Usa Multer para manejar el archivo recibido
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(500).send({ message: "Error al cargar el archivo." });
    }

    // Configura el transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tu-email@gmail.com",
        pass: "tu-contraseña",
      },
    });

    // Configura los detalles del correo
    const mailOptions = {
      from: process.env.EMAIL,
      to: "jonnanpais90@gmail.com", // Cambia esto por el email del cliente
      subject: "Factura Confirmada",
      text: "Adjunto encontrarás la factura confirmada.",
      attachments: [
        {
          filename: "Factura.pdf", // Nombre del archivo
          content: req.file.buffer, // El contenido del archivo en formato Buffer
          encoding: "base64",
        },
      ],
    };

    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ message: "Error al enviar el correo." });
      }
      res.status(200).send({ message: "Factura enviada correctamente." });
    });
  });
};
