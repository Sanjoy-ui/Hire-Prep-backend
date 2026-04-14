import genToken from "../config/token.js"
import User from "../models/user.model.js"

// Helper function for email validation
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body

        // Input validation
        if (!email || !validateEmail(email)) {
          return res.status(400).json({message: "Invalid email format"})
        }
        if (!name || name.trim().length === 0) {
          return res.status(400).json({message: "Name is required"})
        }

        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name , 
                email
            })
        }
        let token = await genToken(user._id)
        res.cookie("token" , token , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge:7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)



    } catch (error) {
        console.error('Google auth error:', error)
        return res.status(500).json({message:"Authentication failed. Please try again."})
    }
    
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
         console.error('Logout error:', error)
         return res.status(500).json({message:"Logout failed. Please try again."})
    }
    
}