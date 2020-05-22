import {createTransport} from "nodemailer"
import {env,smtpOptions} from "@helpers"

export const sendResetPasswordEmail = (email:string,refreshToken:string) : Promise<boolean> => {
    return new Promise((res) => {
          let transporter = createTransport(smtpOptions) 
          let mailOptions = {
            from: env.email,
            to: email,
            subject: `${env.projectName} : Password reset`,
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${env.frontUri}/reset-password/${refreshToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
          };
          
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
            res(true)
        });         
    })
}