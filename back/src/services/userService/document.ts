import {Document} from "mongoose"
import {IUser} from "@models"

export interface IUserDocument extends Document {
  // properites
  email: string,
  name: string,
  password: string,
  tokens : string[]
  // methods
  convert(token?:string):IUser
}