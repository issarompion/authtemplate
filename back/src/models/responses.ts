import {IUser} from "./entities"

export interface IUserResponse {
    status : number,
    body : IUser|IUser[]|string
}

export interface IHttpError {
    body : string,
    status : number
}