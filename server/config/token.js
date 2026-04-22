import jwt from 'jsonwebtoken';

const generateToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
        console.log(token)
        return token
    } catch (error) {
        console.log(`token error: ${error}`)
    }
}

export default generateToken;