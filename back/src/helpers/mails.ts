import {SmtpOptions} from "nodemailer-smtp-transport"
import {env} from "@helpers"

export const smtpOptions : SmtpOptions = {
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: env.email,
      pass: env.emailPassword
    }
}