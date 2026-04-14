import jwt from "jsonwebtoken"


const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies

        if(!token){
            return res.status(401).json({message:"Authentication required"})
        }

        let verifyToken
        try {
          verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({message: "Token expired"})
          }
          return res.status(401).json({message: "Invalid token"})
        }

        if(!verifyToken){
            return res.status(401).json({message:"Invalid token"})
        }
        req.userId = verifyToken.userId

        next()


    } catch (error) {
        console.error('Authentication error:', error)
        return res.status(500).json({message:"Authentication failed"})
    }
    
}

export default isAuth