import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log( `server is running on ${process.env.port || 8000}`)
    })
})
.catch((err) => {
    console.log('mogo db connection failed', err)
})

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONOGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.error('Error', error)
//     }
// })()