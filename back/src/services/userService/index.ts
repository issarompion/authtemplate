import {verify,sign} from "jsonwebtoken"
import {compare} from "bcryptjs"
import {env,
    userForgotSuccessMsg,
    userResetSuccessMsg,
    credentialsError,
    createAlreadyExistsError,
    createBodyError,
    loginCredentialsFailError,
    jwtError,
    notAuthorizedError,
    forgotEmailError,
    resetTokenError
} from "@helpers"
import {userResponse,IUser} from "@models"
import {sendResetPasswordEmail} from "@utils"
import {UserModel} from "./schema"
import {IUserDocument} from "./document"


export const list = () : Promise<userResponse> =>{
    return new Promise((res) => {
        UserModel.find((err, users) => {
            if(err){
                res({body : err.message, status : 500})
            }else{
                let value : IUser[] = []
                for(let i = 0; i <= users.length ; i++){
                    if(i == users.length){
                        res({body : value,status : 200})
                    }else{
                        value.push(users[i].convert())
                    }
                }
            }
        });
    });
}

export const create = (user:IUser) : Promise<userResponse> =>{
    return new Promise((res) => {
      let  newUser = new UserModel(user)
      newUser.save((err,userCreated) => {
        if(err){
            if(user.name && user.email && user.password){
                res({body : createAlreadyExistsError.body, status : createAlreadyExistsError.status})
            }else{
                res({body : createBodyError.body, status : createBodyError.status})
            }
            res({body : err.message, status : 400})
        }else{
            generateAuthToken(newUser)
            .then(token=>{
                res({body : userCreated.convert(token), status : 200})
            })
        }  
      })
    })
}

export const login = (email:string, password:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        if(email && password){
            UserModel.findOne({email:email}, (err, user) => {
                if(err){
                    res({body : err.message, status : 500})   
                }else{
                    if(!user){
                        res({body : loginCredentialsFailError.body, status : loginCredentialsFailError.status})
                    }else{
                        compare(password, user.password)
                        .then(isPasswordMatch => {
                            if (!isPasswordMatch) {
                                res({body : loginCredentialsFailError.body, status : loginCredentialsFailError.status})
                            }else{
                                generateAuthToken(user)
                                .then(token =>{
                                    res({body : user.convert(token), status : 200})
                                })
                            }
                        })
                    }
                }
            })
        }else{
            res({body: credentialsError.body, status : credentialsError.status})
        }
    })
}

export const read = (token:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        verify(token,env.jwtKey,(err,result:any) =>{
            if(err){
                res({body : jwtError.body, status : jwtError.status})
            }
            UserModel.findOne({ _id: result._id,"tokens.token": token },(err, user) => {
                if(err){
                    res({body : err.message,   status : 500})
                }else{
                    if (!user) {
                        res({body : notAuthorizedError.body, status : notAuthorizedError.status})
                    }else{
                        res({body : user.convert(token), status : 200})
                    }
                }
            })
        })
    })
}

export const logout = (token:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        verify(token,env.jwtKey,(err,result:any)=>{
            if(err){
                res({body : err.message,status : 401})
            }
            UserModel.findOne({ _id: result._id,"tokens.token": token },(err, user) => {
                if(err){
                    res({body : err.message,status : 500})
                }else{
                    if (!user) {
                        res({body : notAuthorizedError.body, status : notAuthorizedError.status})
                    }else{
                        user.tokens.splice(0,user.tokens.length)
                        user.save(() => {
                            res({body : user.convert(),status : 200})
                        })
                    }
                }
            })
        })
    })
}

export const forgot = (email:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        UserModel.findOne({email:email},(err, user) => {
            if(err){
                res({body : err.message, status : 500})   
            }else{
                if(!user){
                    res({body : forgotEmailError.body, status : forgotEmailError.status})
                }else{
                    generateRefreshToken(user)
                    .then(refreshToken => {
                        sendResetPasswordEmail(email,refreshToken)
                        .then(() =>{
                            res({body:  userForgotSuccessMsg(email), status:200})
                        })
                    })
                }
            }
        })
    })
}

export const reset = (refreshToken:string,password:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        UserModel.findOne({ resetPasswordToken: refreshToken, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
            if(err){
                res({body : err.message, status : 500})   
            }else{
                if (!user) {
                    res({body : resetTokenError.body, status : resetTokenError.status})
                }else{
                    user.password = password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(() => {
                        res({body: userResetSuccessMsg, status:  200})
                    })
                }
            }
        })
    })
}

export const remove = (token:string) : Promise<userResponse> => {
    return new Promise((res) => {
        verify(token,env.jwtKey,(err,result:any) => {
            if(err){
                res({body : jwtError.body, status : jwtError.status})
            }
            UserModel.findOne({ _id: result._id,"tokens.token": token },(err,user) => {
                if(err){
                    res({body : err.message,status : 500})
                }else{
                    if (!user) {
                        res({body : notAuthorizedError.body, status : notAuthorizedError.status})
                    }else{
                        UserModel.deleteOne({_id: user._id},() => {
                            res({body : user.convert(), status : 200})
                        })
                    }
                }
            })
        })
    })
}

const generateAuthToken = (user : IUserDocument): Promise<string> =>{
    return new Promise((res) => {
        let token = sign({_id: user._id}, env.jwtKey)
        user.tokens = (user as any).tokens.concat({token})
        user.save(() => {
            res(token)
        })
    }) 
}

const generateRefreshToken = (user: IUserDocument) : Promise<string> => {
    return new Promise((res) => {
        let refreshToken = sign({_id: user._id}, env.jwtKey)
        user.resetPasswordToken = refreshToken
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        user.save(() => {
            res(refreshToken)
        })
    }) 
}