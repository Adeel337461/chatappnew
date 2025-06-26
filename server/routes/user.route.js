import { Router } from "express";
import {
  RegisterUser,
  LoginUser,
  UserDetails,
  TokenAuth,
  UserProfile,
  UserList
} from "../controller/user.controller.js";

const userRouter = Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.post("/details", UserDetails);
userRouter.post("/token", TokenAuth);
userRouter.post("/profile", UserProfile);
userRouter.post("/list", UserList);

export default userRouter;
