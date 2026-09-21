import express, { type Request, type Response } from "express"
import { userRouter } from "./module/user/user.route"
import { Profilerouter } from "./module/profile/profile.route"
const app = express()

app.use(express.json())

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use('/api/users',userRouter);
app.use('/api/profile',Profilerouter)

export default app;