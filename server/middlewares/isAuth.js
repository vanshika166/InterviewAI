import jwt from 'jsonwebtoken';

const isAuth = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return res.json("User does not have token.")
        }
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)

        if(!verifyToken){
            return res.json("token does bot have a valid token.")
        }
        req.userId = verifyToken.userId
        next()

    } catch (error) {
        console.log(`isAuth error: ${error}`)
        return res.json({error:error.message})
    }
}

export default isAuth;