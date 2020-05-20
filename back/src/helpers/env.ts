import {config} from "dotenv"
import {resolve} from "path"
import {IEnvironment} from "@models"

config({ path: resolve(__dirname, "../../../.env") })

export const env: IEnvironment = {
    projectName: process.env.PROJECT_NAME!,
    apiPort: process.env.API_PORT!,
    apiUri: process.env.API_URI!,
    dbUri: process.env.DB_URI!,
    frontUri: process.env.FRONT_URI!,
    jwtKey: process.env.JWT_KEY!,
    saltFactor: +process.env.SALT_FACTOR!,
    email: process.env.EMAIL!,
    emailPassword: process.env.EMAIL_PASSWORD!
}

console.log("env", env)