import React from 'react'
import { Button } from './ui/button'

const Hero = () => {
    return (
        <section className='bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16'>
            <div className='max-w-7xl mx-auto my-30 px-4'>
                <div className='flex gap-12 items-center'>
                    <div>
                        <h1 className=' text-4xl md:text-6xl font-bold'> Latest Electronics at Best Prices</h1>
                        <p className='text-xl mb-6 text-blue-100'>Discover cuttong-egde technology with unbeatable deals on smartphone and laptop and more...</p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Button className='bg-white text-blue-600 hover:bg-gray-100'>Shop Now</Button>
                            <Button variant='outline' className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>View Deals</Button>

                        </div>
                    </div>

                    <div className='relative'>
                        <img src="hero2.png" alt="" className='min-h-full w-60 mx-auto rounded-2xl shadow-2xl mt-10' />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero