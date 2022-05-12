import nodemailer from 'nodemailer';


const emailOlvidePassword = async (datos) => { 
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
          subject: "Reset your password",
          text: "Reset your password",
          html: `
                <p>Hello: ${nombre}, you have requested to reset your password</p>

                <p>Click on the link to generate a new password: 
                    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reset your password</a>
                </p>

                <p>If you don't create this account, you can ignore this message</p>          
          `,
      });

      console.log("Mensade enviado: %s", info.messageId);
};

export default emailOlvidePassword;