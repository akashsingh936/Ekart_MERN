 import React from 'react'
 import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Button } from './components/ui/button'
 import Navbar from './components/Navbar'
 
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Verify from './pages/verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'



const router = createBrowserRouter([
  {
  path:'/',
  element:<><Navbar /><Home/><Footer/></>

  },

  {
  path:'/signup',
  element:<><Signup /></>

  },

   {
  path:'/login',
  element:<><Login /></>

  },
   {
  path:'/verify',
  element:<><Verify /></>

  },
   {
  path:'/verify/:token',
  element:<>< VerifyEmail /></>

  },
   {
  path:'/profile',
  element:<><Navbar/><Profile/></>

  }
   
])
 
 const App = () => {
   return (
      <>
        <RouterProvider router = {router} />
      
      </>
   )
 }
 
 export default App