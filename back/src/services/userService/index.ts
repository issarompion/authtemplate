import {verify,sign} from "jsonwebtoken"
import {compare} from "bcryptjs"
import {env} from "@helpers"
import {userResponse,IUser} from "@models"
import {sendResetPasswordEmail} from "@utils"
import {UserModel} from "./schema"
import {IUserDocument} from "./document"


export const list = () : Promise<userResponse> =>{
    return new Promise((res) => {
        UserModel.find(function(err, users) {
            if(err){
                res({body : err.message, status : 404})
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
      newUser.save(function(err,user) {
        if(err){
            res({body : err.message, status : 404})
        }else{
            generateAuthToken(newUser)
            .then(token=>{
                res({body : newUser.convert(token), status : 200})
            })
        }  
      })
    })
}

export const login = (email:string, password:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        UserModel.findOne({email:email},function(err, user) {
            if(err){
                res({body : err.message, status : 404})   
            }else{
                if(!user){
                    res({body : "Login failed! Check authentication email", status : 401})
                }else{
                    compare(password, user.password)
                    .then(isPasswordMatch =>{
                        if (!isPasswordMatch) {
                            res({body : "Login failed! Check authentication password", status : 401})
                        }else{
                            generateAuthToken(user)
                            .then(token =>{
                                res({
                                    body : user.convert(token),status : 200})
                            })
                        }
                    })
                }
            }
        })
    })
}

export const read = (token:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        verify(token,env.jwtKey,function(err,result:any){
            if(err){
                res({body : err.message,status : 401})
            }
            UserModel.findOne({ _id: result._id,"tokens.token": token },function(err, user) {
                if(err){
                    res({body : err.message,status : 404})
                }else{
                    if (!user) {
                        res({body : "Not authorized to access this resource", status : 401
                        })
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
        verify(token,env.jwtKey,function(err,result:any){
            if(err){
                res({body : err.message,status : 401})
            }
            UserModel.findOne({ _id: result._id,"tokens.token": token },function(err, user) {
                if(err){
                    res({body : err.message,status : 404})
                }else{
                    if (!user) {
                        res({body : "Not authorized to access this resource",status : 401})
                    }else{
                        user.tokens.splice(0,user.tokens.length)
                        user.save(function(err) {
                        if(err){
                            res({body : err.message,status : 404})
                        }else{
                            res({body : user.convert(),status : 200})
                            }
                        })
                    }
                }
            })
        })
    })
}

export const forgot = (email:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        UserModel.findOne({email:email},function(err, user) {
            if(err){
                res({body : err.message, status : 404})   
            }else{
                if(!user){
                    res({body : "No account with that email address exists", status : 401})
                }else{
                    generateRefreshToken(user)
                    .then(refreshToken => {
                        sendResetPasswordEmail(email,refreshToken)
                        .then(msg =>{
                            res({body:msg, status:200})
                        })
                    })
                }
            }
        })
    })
}

export const reset = (refreshToken:string,password:string) : Promise<userResponse> =>{
    return new Promise((res) => {
        UserModel.findOne({ resetPasswordToken: refreshToken, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if(err){
                res({body : err.message, status : 404})   
            }else{
                if (!user) {
                    res({body : "Password reset token is invalid or has expired", status : 401})
                }else{
                    user.password = password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function() {
                        res({body:"Success! Your password has been changed", status:200})
                    })
                }
            }
        })
    })
}

export const remove = (token:string) : Promise<userResponse> => {
    return new Promise((res) => {
        verify(token,env.jwtKey,function(err,result:any){
            if(err){
                res({body : err.message,status : 401})
            }
            UserModel.findOne({ _id: result._id,"tokens.token": token },function(err,user) {
                if(err){
                    res({body : err.message,status : 404})
                }else{
                    if (!user) {
                        res({body : "Not authorized to access this resource", status : 401
                        })
                    }else{
                        UserModel.deleteOne({_id: user._id},function(err){
                            if(err){
                                res({body : err.message,status : 404})
                            }else{
                                res({body : user.convert(), status : 200})
                            }
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
        user.save(function() {
            res(token)
        })
    }) 
}

const generateRefreshToken = (user: IUserDocument) : Promise<string> => {
    return new Promise((res) => {
        let refreshToken = sign({_id: user._id}, env.jwtKey)
        user.resetPasswordToken = refreshToken
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        user.save(function() {
            res(refreshToken)
        })
    }) 
}