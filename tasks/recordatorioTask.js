const cron = require("node-cron");
const nodemailer = require("nodemailer");
const chalk = require("chalk");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config(); // Cargar las variables de entorno

// Función para obtener reservas para mañana
async function getReservasForTomorrow() {
  try {
    // Obtener la fecha actual y ajustar para hora central
    const now = new Date();
    now.setDate(now.getDate());

    // Obtener la fecha de mañana y pasado mañana
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

    // Obtener reservas para mañana directamente desde la base de datos
    const reservas = await prisma.reserva.findMany({
      where: {
        fecha: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      include: {
        Estado: true,
        usuario: true,
        sucursal: true,
        servicio: true,
      },
    });

    console.log(
      chalk.blue.bgYellow("Reservas para mañana: " + reservas.length)
    );
    return reservas;
  } catch (error) {
    console.error("Error obteniendo reservas para mañana:", error);
    throw error;
  }
}

// Función para enviar recordatorio de reserva
function sendEmailReminder(reserva) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: reserva.usuario.correo, // Usar el correo del usuario asociado a la reserva
    subject: "Recordatorio de Reserva",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h4>Hola <span>${reserva.usuario.nombre}</span>,</h4>
        <p>Te recordamos que tienes una reserva programada para mañana. Aquí tienes los detalles:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; background-color: #058a78; padding: 10px; border: 1px solid #ddd;"><strong style="color: #fff;">Hora</strong></th>
              <th style="text-align: left; background-color: #058a78; padding: 10px; border: 1px solid #ddd;"><strong style="color: #fff;">Servicio</strong></th>
              <th style="text-align: left; background-color: #058a78; padding: 10px; border: 1px solid #ddd;"><strong style="color: #fff;">Sucursal</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${formatHour(
                reserva.hora
              )}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                reserva.servicio.descripcion
              }</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                reserva.sucursal.nombre
              }</td>
            </tr>
          </tbody>
        </table>
        <p>Por favor, asegúrate de llegar a tiempo. Si tienes alguna pregunta o necesitas hacer algún cambio, no dudes en contactarnos.</p>
        <p>Gracias por confiar en nuestros servicios.</p>
        <p>Saludos,<br>El equipo de PetClinic</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
    } else {
      console.log(
        `Recordatorio enviado a: ${reserva.usuario.correo}`,
        info.response
      );
    }
  });
}

// Programar la tarea para ejecutarse todos los días a las 8 AM
cron.schedule("* 8 * * *", async () => {
  try {
    const reservas = await getReservasForTomorrow();
    reservas.forEach((reservas) => {
      sendEmailReminder(reservas);
    });
  } catch (error) {
    console.error("Error ejecutando la tarea programada:", error);
  }
});

// Función para formatear la hora
function formatHour(hourString) {
  const hour = parseInt(hourString.slice(0, 2), 10);
  const minutes = hourString.slice(2);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convertir a formato de 12 horas y manejar medianoche
  return `${formattedHour}:${minutes} ${period}`;
}
