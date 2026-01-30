import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'
import { useAppContext } from '../../context/AppContext'

const Navbar = () => {
  const {setShowHotelReg} = useAppContext();

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
        <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-9 invert opacity-80' />
        </Link>
        <div className='flex items-center gap-4'>
            <button 
                onClick={() => setShowHotelReg(true)}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-all'
            >
                + Add Hotel
            </button>
            <UserButton/>
        </div>
    </div>
  )
}

export default Navbar
