[npm init -y]
[npm i -D typescript]
[npx tsc --init] {here uncomment rootDir and outDir. And change "module":nodenext to "module":esnext also 'type':["node"] lastly at the bottom {commentout "jsx":"React-jsx"}
in package.json, change {"type":"commonjs" to "type":"module"}
[npm i -D tsx]
Write ["dev":"tsx watch ./ServerFileLocation"] {inside "Script":{} in the package.json file}
[npm install express]

File manage:
Next, src-> server.ts, app.ts, config->index.ts, db->index.ts, modules->product->product.route.ts, product.controller.ts,product.service.ts,product.interface.ts

Struct:
Next, .env=> CONNECTIONSTRING=''
PORT=
JWT_SECRET=sdfjasdfhsdhfs //need for auth token
JWT_REFRESH_SECRET=asdfasgfbknsadd

{Write app and server code}

config->index.ts=> [npm i dotenv]
import dotenv from "dotenv"
import path from "path";

dotenv.config({path:path.join(process.cwd(),".env")});

const config={
connection_string:process.env.CONNECTIONSTRING as string,
port:process.env.PORT,
secret: process.env.JWT_SECRET,
refresh_secret: process.env.JWT_REFRESH_SECRET
}

export default config;

Connect DB:
db->index.ts=> [npm i pg]
import {Pool} from "pg";
import config from "../config";

export const pool=new Pool({
connectionString:config.connection_string
})

export const initDB=async()=>{
try {
await pool.query(`     CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        age INT NOT NULL
)
            `)
console.log("Database initialized successfully");
} catch (error) {
console.error("Error initializing database:", error);
}
}

Auth:
PW encryption: (When user is created using post method)
[npm i bcryptjs]
import bcrypt from "bcryptjs";
const hashPassword=await bcrypt.hash(password,10);

PW compare with encrypted pw:
const matchPassword=await bcrypt.compare(password,user.password); (here password is plain text new password and user.password is encrypted password with which the new password is comparing)

Token Generate (in auth.service.ts):
[npm i jsonwebtoken]
{import jwt from "jsonwebtoken"}

const jwtpayload = {
id: user.id,
name: user.name,
role:user.role,
age: user.age,
email: user.email,
};
const accessToken = jwt.sign(jwtpayload, config.secret as string, {
expiresIn: "1d",
});

const refreshToken = jwt.sign(jwtpayload, config.refresh_secret as string, {
expiresIn: "1d",
});

return { accessToken,refreshToken};
};

To set refreshToken in cookie:
(in auth.controller.ts) add in loginUser:
const {refreshToken} = result;

        res.cookie("refreshToken",refreshToken,{
            secure:false, // In production => true
            httpOnly:true,
            sameSite:'lax'
        });

(To get this refreshToken from cookie by using req.cookies.refreshToken)
[npm i cookie-parser] then ,
src-> app.ts:
{import CookieParser from "cookie-parser"}
app.use(CookieParser());

Middlewares:
Logger Middleware:
src-> middleware->logger.ts:
import fs from "fs"

const logger=(req:Request, res:Response, next:NextFunction) => {
console.log('Method - URL - Time:',req.method, req.url, Date.now());
const log=`\nMethod -> ${req.method} - Time -> ${Date.now()} - Url -> ${req.url}\n`;
fs.appendFile(`logger.txt`,log,(err)=>{
//console.log(err)
})
next();
}

export default logger;

app.ts:
app.use(logger)

Types:
src-> types -> index.ts:
export const USER_ROLE={
admin: "admin",
agent: "agent",
user: "user"
} as const;
export type ROLES= "admin" | "agent" | "user";

Auth Middleware:
src-> middleware->auth.ts:
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth=(...roles:ROLES[])=>{
return async(req:Request,res:Response,next:NextFunction)=>{
console.log(roles)
try {
// console.log("This is protected route");
// console.log(req.headers.authorization)

        const token=req.headers.authorization;
        console.log(token)
        if(!token){
             res.status(401).json({ success: false,
                 message: "Unauthorized access!!"
                });
        }

        const decoded=jwt.verify(token as string,config.secret as string) as JwtPayload;

        const userData= await pool.query(`
                SELECT * FROM users WHERE email=$1
            `,[decoded.email])

        // console.log(userData);

        const user=userData.rows[0]

        //validation with logic
        if(userData.rows.length===0){
            res.status(403).json({ success: false,
                message: "User not found!!"
            });
        }

        // console.log("Auth Role: ",user.role)

        if(roles.length && !roles.includes(user.role)){
            res.status(403).json({ success: false,
                 message: "Access denied. You do not have the required role to perform this action."
                });
        }

        req.user=decoded

        next();
        } catch (error) {
            next(error)
        }
    }

}

export default auth;

src-> middleware-> index.d.ts:
import type { JwtPayload } from "jsonwebtoken";

declare global{
namespace Express {
interface Request {
user?: JwtPayload
}
}
}

src-> types -> index.ts:
export const USER_ROLE={
admin: "admin",
agent: "agent",
user: "user"
} as const;
export type ROLES= "admin" | "agent" | "user";

user.route.ts:
router.get("/",auth(USER_ROLE.admin,USER_ROLE.moderator),userController.getAllUsers)
(Now we have to pass the token)

Do not accept other origin's request except given origin:
[npm i cors]
src-> app.ts:
{import cors from "cors"}

const corsOptions = {
origin: 'http://localhost:3000',
}
app.use(cors(corsOptions));

Global errorHandler:
src-> middleware-> globalErrorHandler.ts:
const globalErrorHandler=(err:any, req:Request, res:Response, next:NextFunction) => {
// console.error(err.stack); // Log the error

res.status(500).json({
success: false,
message: err.message || "Internal Server Error",
});
}

export default globalErrorHandler;

next, src-> app.ts:
app.use(globalErrorhandler
