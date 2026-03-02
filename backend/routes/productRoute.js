import express from "express"
import { allUsers, ChangePassword, forgotPassword, getUSerById, login, logout, register, reVerify, uploadUser, verify, verifyOTP } from "../controllers/userController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"
// import { verify } from "jsonwebtoken"


const router = express.Router()


router.post("/register", register)


 






export default router