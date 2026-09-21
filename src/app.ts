import express, { type Request, type Response } from "express"
import { userRouter } from "./module/user/user.route"
const app = express()

app.use(express.json())

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use('/api/users',userRouter)
export default app;