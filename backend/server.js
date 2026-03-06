import express from "express"
import 'dotenv/config'
import connenctDB from "./database/db.js"
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import cors from 'cors'


 const app = express()

 app.use(express.json())
 app.use(cors({
   origin:"http://localhost:5173",
   credentials:true
 }))

 const PORT = process.env.PORT || 3000

 app.use('/api/v1/user',userRoute)
 app.use('/api/v1/product',productRoute)
 

 app.listen(PORT,()=>{
    connenctDB()
    console.log(`server is listening on port:${PORT}`);
 })