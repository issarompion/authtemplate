import {IUser} from "./entities"

export interface userResponse {
    status : number,
    body : IUser|IUser[]|string
}