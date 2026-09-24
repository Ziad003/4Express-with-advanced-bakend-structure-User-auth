import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router=Router();



router.post('/',userController.createUser);
router.put("/:id",userController.updateUser);
router.delete("/:id",userController.deleteUser);
router.get("/",auth(),userController.getAllUsers);

export const userRouter=router;