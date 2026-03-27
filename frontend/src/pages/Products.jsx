import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import axios from 'axios'


const Products = () => {

    const [allProducts, setAllProducts] = useState([])

    const getAllProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/product/getallProducts`);
            console.log(res)
           if (res.data.success) {
               setAllProducts(res.data.products)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])

    console.log(allProducts)
    return (
        <div className='pt-30 pb-10'>
            <div className='max-w-7xl mx-auto flex gap-7'>
                {/* Sidebar */}

                <FilterSidebar />

                {/* Main products section */}

                <div className='flex flex-col flex-1'>
                    <div className='flex justify-end mb-4'>
                        <Select>
                            <SelectTrigger className="w-full max-w-100">
                                <SelectValue placeholder="Sort by price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>

                                    <SelectItem value="lowToHigh"> Price: Low to high</SelectItem>
                                    <SelectItem value="highToLow">Price: High to Low</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* product gird */}

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
                        {
                            allProducts.map((product) => {
                                return <ProductCard key={product._id} product={product} />
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Products