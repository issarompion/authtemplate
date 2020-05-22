import {IUser} from "./entities"

export interface userResponse {
    status : number,
    body : IUser|IUser[]|string
}

export interface httpError {
    body : string,
    status : number
}