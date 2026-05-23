import Products from "@/pages/Products";
import { createSlice } from "@reduxjs/toolkit";


const productSlice = createSlice({
    name: 'product',
    initialState:{
        products: [],
        Cart:[],
    }, 
    reducers :{
        setProducts:(state, action) =>{
            state.products = action.payload
        },
        setCart:(state, action) =>{
            state.Cart = action.payload
        }
    }
})

export const {setProducts, setCart} = productSlice.actions
export default productSlice.reducer