import { config } from "dotenv"
import { resolve } from "path"
import { IEnvironment } from "../models"

config({ path: resolve(__dirname, "../../../.env") })

export const env: IEnvironment = {
    projectName: process.env.PROJECT_NAME!,
    apiPort: process.env.API_PORT!,
    apiUrl: process.env.API_URL!,
};

console.log("env", env)