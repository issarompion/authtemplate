export interface IEnvironment {
    projectName: string,
    apiUri:string,
    apiPort:string,
    dbUri:string,
    frontUri:string,
    jwtKey:string,
    saltFactor:number,
    email:string,
    emailPassword:string
}