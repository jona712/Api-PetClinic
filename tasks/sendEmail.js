const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

// Función para obtener los detalles de la factura desde la base de datos
async function getFacturaDetails(facturaId) {
  try {
    const factura = await prisma.factura.findUnique({
      where: { id: facturaId },
      include: {
        usuario: true, // Asegúrate de incluir el usuario para obtener el correo
        facturaDetalle: true, // Incluye los detalles de la factura
      },
    });
    return factura;
  } catch (error) {
    console.error("Error obteniendo detalles de la factura:", error);
    throw error;
  }
}

// Función para enviar el correo con la factura confirmada
async function sendFacturaEmail(facturaId) {
  try {
    const factura = await getFacturaDetails(facturaId);

    if (!factura) {
      console.log("Factura no encontrada");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: factura.usuario.correo, // Usar el correo del usuario asociado a la factura
      subject: "Factura Confirmada",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h4>Hola ${factura.usuario.nombre},</h4>
          <p>Tu factura con ID: ${factura.id} ha sido confirmada. Aquí tienes los detalles:</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; background-color: #058a78; padding: 10px; border: 1px solid #ddd;"><strong style="color: #fff;">Descripción</strong></th>
                <th style="text-align: left; background-color: #058a78; padding: 10px; border: 1px solid #ddd;"><strong style="color: #fff;">Cantidad</strong></th>
                <th style="text-align: left; background-color: #058a78; padding: 10px; border: 1px solid #ddd;"><strong style="color: #fff;">Precio</strong></th>
              </tr>
            </thead>
            <tbody>
              ${factura.facturaDetalle
                .map(
                  (detalle) => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${detalle.descripcion}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${detalle.cantidad}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">₡${detalle.precio}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <p>Gracias por tu compra.</p>
          <p>Saludos,<br>El equipo de tu empresa</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo:", error);
      } else {
        console.log(`Factura enviada a: ${factura.usuario.correo}`, info.response);
      }
    });
  } catch (error) {
    console.error("Error enviando la factura:", error);
  }
}

// Exportar la función para que pueda ser llamada desde el frontend
module.exports = { sendFacturaEmail };
