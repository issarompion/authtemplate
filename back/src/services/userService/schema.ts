import {Schema, model} from "mongoose"
import {hash,genSalt} from "bcryptjs"
import {IUserDocument} from "./document"
import {IUser} from "@models"
import {DBconnect,validateEmail} from "@utils"

DBconnect()
.then(() => console.log("DB Connected!"))
.catch(err => {console.error(`DB Connection Error:${err.message}`)})

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, "Please fill a valid email address"],
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.pre<IUserDocument>("save", function (next) {
    var user = this
    if (user.isModified("password")) {
        genSalt(10, function (err, salt) {
            if (err) { return next(err) }
            hash(user.password, salt, (err, hash) => {
                if (err) { return next(err) }
                user.password = hash
                return next()
            })
        })
    }else{
        return next()
    }
})

UserSchema.methods.convert = function(token : string | undefined = undefined) : IUser {
    if(token){
        return {
            userId : this._id,
            email : this.email,
            name : this.name,
            token : token
        }
    }else{
        return {
            userId : this._id,
            email : this.email,
            name : this.name,
          }
    }

}

export const UserModel = model<IUserDocument>("user", UserSchema)