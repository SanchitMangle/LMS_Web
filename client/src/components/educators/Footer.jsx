import React from 'react'
import { assets } from '../../assets/assets'

const S = () => {
  return (
   <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t'>

    <div className='flex items-center gap-4'>
      <img src={assets.logo} alt="" className='md:block hidden w-20'/>
      <div className='md:block hidden h-7 w-px bg-gray-500/60'></div>
      <p className='py-4 text-center text-xs md:tetx-sm tetx-gray-500'>
        All right reserved. Copyright 2025 @Edemy
      </p>
    </div>

    <div className='flex items-center gap-3 max-md:mt-4'>
      <a href="#">
        <img src={assets.facebook_icon} alt="" />
      </a>
      <a href="#">
        <img src={assets.instagram_icon} alt="" />
      </a>
      <a href="#">
        <img src={assets.twitter_icon} alt="" />
      </a>
    </div>

   </footer>
  )
}

export default S
