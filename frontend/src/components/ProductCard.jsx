 import React from 'react'

const ProductCard = ({product}) => {
    const {productImg, productPrice, productName} = product
  return (
    <div className='shadow-lg rounded-lg overflow-hidden h-max'>
        <div className='w-full h-full aspect-square overflow-hidden'>
            <img src={productImg[0]?.url} alt="" className='w-full h-full transition-transform duration-300 hover:scale-105' />
        </div>
    </div>
  )
}

export default ProductCard