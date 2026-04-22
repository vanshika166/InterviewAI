import express from 'express'
import { googleAuth, logout } from '../controllers/authController.js'

const authroute = express.Router()

authroute.post("/google-auth",googleAuth)
authroute.get("/logout",logout)

export default authroute;
