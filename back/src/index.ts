import {Response,Request} from "express";

import {app,env} from "./helpers";
import {usersRouter} from './routes'

app.get('/', (req: Request, res: Response) => {
    res.status(200).send(`Welcome to ${env.projectName} API`)
});
app.use('/users',usersRouter)

app.listen(env.apiPort || 3000, function () {
    console.log(`Webserver running on ${env.apiUrl}:${env.apiPort}`);
});