require("module-alias/register")
import {Response,Request} from "express"
import {DBconnect} from "@utils"
import {app,env} from "@helpers"
import {usersRouter} from "@routes"

DBconnect()
.then(() => console.log("DB Connected!"))
.catch(err => {console.error(`DB Connection Error:${err.message}`)})

app.get("/", (req: Request, res: Response) => {
    res.status(200).send(`Welcome to ${env.projectName} API`)
})
app.use("/users",usersRouter)

app.listen(env.apiPort || 3000, () => {
    console.log(`Webserver running on ${env.apiUri}`)
})