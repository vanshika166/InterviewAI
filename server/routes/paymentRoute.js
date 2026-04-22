import express from 'express';
import isAuth from '../middlewares/isAuth.js'
import {payment} from '../controllers/paymentController.js';

const paymentRoute = express.Router()
paymentRoute.post("/pay",isAuth,payment)

export default paymentRoute;