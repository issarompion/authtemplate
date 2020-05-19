import {verify,sign} from "jsonwebtoken"
import {compare} from "bcryptjs"
import {env} from "@helpers"
import {userResponse,IUser} from "@models"
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

const generateAuthToken = (user : IUserDocument): Promise<string> =>{
    return new Promise((res) => {
        let token = sign({_id: user._id}, env.jwtKey)
        user.tokens = (user as any).tokens.concat({token})
        user.save(function() {
            res(token)
        })
    }) 
}