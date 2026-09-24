import express, { type Request, type Response } from "express"
import { userRouter } from "./module/user/user.route"
import { Profilerouter } from "./module/profile/profile.route"
import { authRoute } from "./module/auth/auth.route"
import fs from "fs"
import logger from "./middleware/logger"

const app = express()

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));

app.use(logger);

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use('/api/users',userRouter);
app.use('/api/profile',Profilerouter);
app.use('/api/auth',authRoute)

export default app;