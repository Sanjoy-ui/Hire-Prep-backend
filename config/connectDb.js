import mongoose from "mongoose";

const connectDb = async () => {
    const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI

    if (!mongoUri) {
        console.log("DataBase Error Missing MONGODB_URL or MONGODB_URI in .env")
        return false
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        })
        console.log("DataBase Connected")
        return true
    } catch (error) {
        if (error?.message?.includes("ENOTFOUND") && mongoUri.startsWith("mongodb+srv://")) {
            console.log("DataBase Error Atlas host not found (DNS ENOTFOUND). Verify cluster hostname in MONGODB_URL.")
        }

        console.log(`DataBase Error ${error.message}`)
        return false
    }
}

export default connectDb