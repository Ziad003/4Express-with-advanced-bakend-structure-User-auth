[npm init -y]
[npm i -D typescript]
[npx tsc --init] {here uncomment rootDir and outDir. And change "module":nodenext to "module":esnext also 			'type':["node"] lastly at the bottom {commentout "jsx":"React-jsx"}
in package.json, change {"type":"commonjs" to "type":"module"}
[npm i -D tsx]
[npm install express]
Write ["dev":"tsx watch ./ServerFileLocation"] {inside "Script":{} in the package.json file}


File manage:
Next, src-> server.ts, app.ts, config->index.ts, db->index.ts, modules->product->product.route.ts, product.controller.ts,product.service.ts,product.interface.ts


Struct:
Next, .env=> CONNECTIONSTRING=''
	     PORT=
	     JWT_SECRET=sdfjasdfhsdhfs //need for token 

{Write app and server code}


config->index.ts=> [npm i dotenv] 
import dotenv from "dotenv";
import path from "path";

dotenv.config({path:path.join(process.cwd(),".env")});

const config={
    connection_string:process.env.CONNECTIONSTRING as string,
    port:process.env.PORT,
    secret: process.env.JWT_SECRET //need for token 
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
        await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
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


PW encryption:
[npm i bcryptjs]
import bcrypt from "bcryptjs";
const hashPassword=await bcrypt.hash(password,10);

PW decryption:
const matchPassword=await bcrypt.compare(password,user.password); (here password is plain text new password and user.password is encrypted password with which the new password is comparing)

Token Generate:
[npm i jsonwebtoken]
{import jwt from "jsonwebtoken"}

const jwtpayload = {
    id: user.id,
    name: user.name,
    age: user.age,
    email: user.email,
  };
  const accessToken = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };