import generateToken from '../config/token.js';
import User from '../models/userModel.js'

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({ name, email })
        }
        let token = await generateToken(user._id)
        const isDevelopment = process.env.NODE_ENV === 'development'
        res.cookie("token", token, {
            httpOnly: true,
            secure: !isDevelopment,
            sameSite: isDevelopment ? "Lax" : "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json(user)

    } catch (error) {
        console.log(`googleAuth error: ${error}`)
        return res.json({ error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development'
        res.clearCookie("token", {
            httpOnly: true,
            secure: !isDevelopment,
            sameSite: isDevelopment ? "Lax" : "None"
        })
        return res.json({ success: true, message: "Logout successfully." })

    } catch (err) {
        console.log(`logout error: ${err}`)
    }
}