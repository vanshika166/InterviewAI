import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { currentUser } from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.get("/current-user",isAuth,currentUser);

export default userRoute