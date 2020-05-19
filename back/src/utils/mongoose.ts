import {connect} from "mongoose"
import {env} from "@helpers"

export const DBconnect = () : Promise<typeof import("mongoose")> => {
    return connect(env.dbUri,{useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex: true})
}

export const validateEmail = (email:string) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};