const fs = require('fs')
const path = require('path')
const colors = require('colors')
const dotenv = require('dotenv')

// Configure Angular `environment.ts` file path
dotenv.config({ path: path.resolve(__dirname, "../.env") })
const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';


const envConfigFile = `export const environment = {
  production: false,
  apiUri:'http://${process.env.API_URL}:${process.env.API_PORT}',
  project_name:'${process.env.PROJECT_NAME}'
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  apiUri:'http://${process.env.API_URL}:${process.env.API_PORT}',
  project_name:'${process.env.PROJECT_NAME}'
};
`;

setEnv(envConfigFile,targetPath);
setEnv(envProdConfigFile,targetProdPath)

function setEnv(envConfigFile,targetPath){
  console.log(colors.magenta(`The file ${targetPath} will be written with the following content: \n`));
  console.log(colors.grey(envConfigFile));
  fs.writeFile(targetPath, envConfigFile, function (err) {
     if (err) {
         throw console.error(err);
     } else {
         console.log(colors.magenta(`Angular environment file generated correctly at ${targetPath} \n`));
     }
  });
}