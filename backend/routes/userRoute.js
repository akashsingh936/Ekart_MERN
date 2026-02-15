import express from "express"
import { allUsers, ChangePassword, forgotPassword, getUSerById, login, logout, register, reVerify, verify, verifyOTP } from "../controllers/userController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
// import { verify } from "jsonwebtoken"


const router = express.Router()


router.post("/register", register)
router.post("/verify", verify)
router.post("/reverify",reVerify)
router.post("/login",login)
router.post("/logout",isAuthenticated, logout)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp/:email",verifyOTP)
router.post("/change-password/:email", ChangePassword)
router.get("/all-user",isAuthenticated,isAdmin, allUsers)
router.get("/get-user/:userId", getUSerById)







export default router