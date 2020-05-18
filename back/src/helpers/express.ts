import express from "express";
import bodyparser from "body-parser";
export const app = express();
app.use(function (req: any, res: any, next: any) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(bodyparser.json());
