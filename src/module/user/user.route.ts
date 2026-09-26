import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router=Router();


router.post('/',userController.createUser);
router.put("/:id",userController.updateUser);
router.delete("/:id",userController.deleteUser);
router.get("/",auth(USER_ROLE.admin,USER_ROLE.agent),userController.getAllUsers);

export const userRouter=router;