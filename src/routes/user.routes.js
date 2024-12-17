import { Route, Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/users.controller.js" 
import { upload } from '../middleware/multer.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            "name": "avatar",
            maxCount: 1
        },
        {
            "name": "coverImage",
            maxCount: 1
        }
    ]),
    registerUser

)
 router.route("/login").post(loginUser)

 // Secure Routes
 router.route("/logout").post( verifyJWT, logoutUser)

export default router