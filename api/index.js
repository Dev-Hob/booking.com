import express from "express"
const app = express()
import env from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser"

env.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongoDB!")
    } catch (error) {
        throw error;
    }
}

mongoose.connection.on("disconnection", () => {
    console.log("mongodb disconnected!")
})

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!")
})

//middlewares
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth" , authRoute)
app.use("/api/users" , usersRoute)
app.use("/api/hotels" , hotelsRoute)
app.use("/api/rooms" , roomsRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMsg = err.message || "Something went wrong!";
    return res.status(errorStatus).json(
        {   success: false,
            status: errorStatus, 
            message: errorMsg,
            stack: err.stack
        })
})
    
app.listen(8300, () => {
    connect()
    console.log("Connected to backend!")
})