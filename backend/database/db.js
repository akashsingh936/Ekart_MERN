  import mongoose from "mongoose";

  const connenctDB = async() =>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/Ekart`)
        console.log("mongoDB is connected succesfully")
    } catch (error) {
        console.log("MongoDB connectio failed", error)
        
    }
  }
  

  export default connenctDB