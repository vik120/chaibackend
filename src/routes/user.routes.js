import { Route, Router } from "express";
import { registerUser } from "../controllers/users.controller.js" 
import { upload } from '../middleware/multer.js'

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
// router.route("/login").post(LoginUser)

export default router