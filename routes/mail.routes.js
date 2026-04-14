import express from "express"
import isAuth from "../middlewares/isAuth.js"
import sendMail from "../services/mail.services.js"





const mailRouter = express.Router()

// mailRouter.post("/sendmail"  , sendMail)

mailRouter.post("/sendmail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Pass the data as an object
    await sendMail({ 
      userEmail: email, 
      message: message, 
      name: name 
    });
    
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



export default mailRouter