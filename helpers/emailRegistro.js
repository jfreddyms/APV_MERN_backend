import nodemailer from 'nodemailer';


const emailRegistro = async (datos) => { 
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT ,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { nombre , email, token } = datos;

      const info = await transporter.sendMail({
          from: "APV - Administrador de Pacientes de Veterinaria",
          to: email,
          subject: "Comprueba tu cuenta en APV",
          text: "Comprueba tu cuenta en APV",
          html: `
                <p>Hola: ${nombre}, Comprueba tu cuenta en APV</p>

                <p>Tu Cuenta ya esta lista, solo debes comprobrarla en el siguiente enlace: 
                    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirm my account</a>
                </p>

                <p>Si tu no creas esta cuenta, puedes ignorar este mensaje</p>          
          `,
      });

      console.log("Mensade enviado: %s", info.messageId);
}

export default emailRegistro