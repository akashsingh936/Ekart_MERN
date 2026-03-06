import express from "express"
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
import { multipleUpload } from "../middleware/multer.js"
 


const router = express.Router()


router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct) 
router.get("/getAllProducts", getAllProduct) 
router.delete("/delete/:product", isAuthenticated, isAdmin, deleteProduct)
router.put("/update/:productId", isAuthenticated, isAdmin, multipleUpload, updateProduct)


 






export default router