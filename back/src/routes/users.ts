import e, {Router, Request, Response} from "express"
import {IUser} from "@models"
import {list, create, login, read, logout} from "@services"

const router: Router = Router()

router.get("/", async (request: Request, response: Response) => {
    list().then(res =>{
        response.status(res.status).send(res.body)
    })
})

router.post("/", async (request: Request, response: Response) => {
    let user : IUser = request.body
    create(user).then(res =>{
        if(res.status == 200){
           (request as RequestWithCurrentUser).currentUser = res.body as IUser
        }
        response.status(res.status).send(res.body)
    })
})

router.post("/login", async (request: Request, response: Response) => {
    let email: string = request.body.email
    let password : string = request.body.password
    login(email, password).then(res =>{
        if(res.status == 200){
           (request as RequestWithCurrentUser).currentUser = res.body as IUser
        }
        response.status(res.status).send(res.body)
    })
})

router.get("/me", async (request: Request, response: Response) => {
    if(request.headers.authorization){
        let token = request.headers.authorization.replace("Bearer ", "")
        read(token).then(res =>{
            if(res.status == 200){
               (request as RequestWithCurrentUser).currentUser = res.body as IUser
            }
            response.status(res.status).send(res.body)
        })
    }else{
        response.status(401).send("No authorization header")
    }
})

router.post("/logout", async (request: Request, response: Response) => {
    if(request.headers.authorization){
        let token = request.headers.authorization.replace("Bearer ", "")
        logout(token).then(res =>{
            response.status(res.status).send(res.body)
        })
    }else{
        response.status(401).send("No authorization header")
    }
})

interface RequestWithCurrentUser extends Request {
    currentUser?: IUser;
}

export const usersRouter = router