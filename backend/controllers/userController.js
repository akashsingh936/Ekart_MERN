// import { User } from "../models/userModel.js"
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOtpMail.js";
import cloudinary from "../utils/Cloudinary.js";



export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        verifyEmail(token, email)
        newUser.token = token
        await newUser.save();


        return res.status(201).json({
            success: true,
            message: "user registered successfully",
            user: newUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const verify = async (req, res) => {

    try {
        const authHeader = req.headers.authorization
        // console.log("auth",authHeader)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Authrization token is missing or invalid"
            })
        }
        const token = authHeader.split(" ")[1]  //Beareer kjkldjfjkljdksfkjujdsfk
        let decoded
        try {
            console.log("authHeader", authHeader);
            // console.log(token);
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "the registeration has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: error
            })
        }

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null
        user.isVerified = true
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email Verified successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        verifyEmail(token, email)
        user.token = token
        await user.save()

        return res.status(200).json({
            success: true,
            message: "verification email is sent again successfully",
            token: user.token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "user is not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: " Invalid Credentials"
            })
        }
        if (existingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "Verify your account then login"
            })
        }

        // generate token

        const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '10d' })
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '30d' })
        existingUser.isLoggedIn = true
        await existingUser.save()


        // check for existing Session and delete
        const existingSession = await Session.findOne({ userId: existingUser._id })
        if (existingSession) {
            await Session.deleteOne({ userId: existingUser._id })
        }
        // creating a new session

        await Session.create({ userId: existingUser._id })
        return res.status(200).json({
            success: true,
            message: `welcome back ${existingUser.firstName}`,
            user: existingUser,
            accessToken,
            refreshToken
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const logout = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "User loggedout Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user Not found"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) //10min
        user.otp = otp
        user.otpExpiry = otpExpiry

        await user.save()

        await sendOTPMail(otp, email)
        return res.status(200).json({
            success: true,
            message: "Otp sent on mail successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const verifyOTP = async (req, res) => {
    console.log("kjkldjkjgkldjkljdfgjkl", req)
    try {
        const { otp } = req.body
        const email = req.params.email
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Otp is Required"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "Otp is not Generated or Already Verified"
            })
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Otp has Expired Please request a new one"
            })
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "otp is Invalid"
            })
        }

        user.otp = null
        user.otpExpiry = null
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Otp Verified Successfully"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export const ChangePassword = async (req, res) => {
    try {
        const { newPasswrd, confirmPassword } = req.body
        const { email } = req.params
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        if (!newPasswrd || !confirmPassword) {
            console.log("kjdklfjkl", newPasswrd)
            console.log("kjdklfjkl", confirmPassword)

            return res.status(400).json({
                succes: false,
                message: "All Fields are Required"
            })
        }

        if (newPasswrd !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password Does not matched"
            })
        }

        const hashedPassword = await bcrypt.hash(newPasswrd, 10)
        user.password = hashedPassword
        await user.save()
        return res.status(200).json({
            succes: true,
            message: " Password Changed Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const allUsers = async (_, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const getUSerById = async (req, res) => {
    try {
        const { userId } = req.params;  //extrect userId from request params
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            succes: true,
            user,
        })
    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: error.message
        })
    }
}






export const uploadUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id
        const loggedInUser = req.user
        const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body

        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this profile"
            })
        }

        let user = await User.findById(userIdToUpdate)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        let profilePicUrl = user.profilePic
        let profilePicPublicId = user.profilePicPublicId

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId)
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profile" },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })

            profilePicUrl = uploadResult.secure_url
            profilePicPublicId = uploadResult.public_id
        }

        user.firstName = firstName || user.firstName
        user.lastName = lastName || user.lastName
        user.address = address || user.address
        user.city = city || user.city
        user.zipCode = zipCode || user.zipCode
        user.phoneNo = phoneNo || user.phoneNo
        user.role = role || user.role
        user.profilePic = profilePicUrl
        user.profilePicPublicId = profilePicPublicId

        const updatedUser = await user.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}




