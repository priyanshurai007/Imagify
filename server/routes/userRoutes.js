import express from 'express'
import {loginUser, paymentRazorpay, registerUser,userCredential, verifyRazorpay} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/credits',userAuth,userCredential)
userRouter.post('/pay-razor',userAuth,paymentRazorpay)
userRouter.post('/verify-razor',verifyRazorpay)

export default userRouter

//http://localhost:4000/api/user/register
//http://localhost:4000/api/user/login