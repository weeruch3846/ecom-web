

import React, { useState } from "react";
import { Link, NavLink } from 'react-router-dom'
import useEcomStore from '../store/ecom-store'
import { ChevronDown } from "lucide-react";

import logo from '../../public/imges/Weeruch Logo.jpg'
function MainNav() {
    // Javascript
    const carts = useEcomStore((s)=> s.carts);
    const user = useEcomStore((s) => s.user);
    const logout = useEcomStore((s) => s.logout);
    // console.log(Boolean(user))

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    console.log(carts.length)
  return (
    <nav className='bg-blue-400 shadow-md relative z-50'>
        <div className='mx-auto px-4'>
            <div className='flex justify-between h-16'>
                <div className='flex items-center gap-6'>


                  <Link to="/">
                        <img
                            src={logo}
                            alt="Weeruch Logo"
                            className="
                                w-[55px] h-[55px]
                                rounded-full
                                object-cover
                                border-2 border-red-600
                                shadow-md
                            "
                        />
                    </Link>


                    <NavLink
                    className={({isActive})=>
                        isActive
                        ? 'bg-blue-700 px-3 py-2 rounded-md text-sm font-medium text-white'
                        : 'hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium '
                    }
                    
                    to={'/'}>
                    Home
                    </NavLink>



                    <NavLink
                    className={({isActive})=>
                        isActive
                        ? 'bg-blue-700 px-3 py-2 rounded-md text-sm font-medium text-white'
                        : 'hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium '
                    }
                    to={'/shop'}>
                    Shop
                    </NavLink>
                    {/* Badge */}

                    <NavLink
                     className={({isActive})=>
                        isActive
                        ? 'relative bg-blue-700 px-3 py-2 rounded-md text-sm font-medium text-white'
                        : 'relative hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium '
                    } 
                    to={'/cart'} >
                    Cart
                        {
                            carts.length > 0 
                            && (<span className='absolute top-0
                            bg-red-500 rounded-full px-2'>
                            {carts.length}
                            </span>)
                        }
                 
                    </NavLink>
                </div>


                {
                    user 
                    ?<div className='flex items-center gap-4 relative'>
                    <button 
                    onClick={toggleDropdown}
                    className='flex items-center gap-2 hover:bg-blue-700
                    px-2 py-3 rounded-md'>
                        <img 
                        className='w-8 h-8'
                        src="https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-icon-svg-download-png-116394.png?f=webp&w=256" />
                        <ChevronDown />
                    </button>

                    {
                        isOpen && 
                        <div className="absolute right-0 top-16 bg-blue-400 shadow-md z-50">
                            <Link 
                            to={'/user/history'}
                            className="block px-4 py-2 hover:bg-blue-700">
                            History
                            </Link>
                            <button 
                            onClick={()=>logout()}
                            className="block px-4 py-2 hover:bg-blue-700">
                            Logout
                            </button>
                        </div>

                    }
                    
                </div>
                    :
                <div className='flex items-center gap-4'>
                    <NavLink
                    className={({isActive})=>
                        isActive
                        ? 'bg-blue-700 px-3 py-2 rounded-md text-sm font-medium text-white'
                        : 'hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium '
                    }  
                    to={'/register'}>
                        Register
                    </NavLink>

                    <NavLink
                    className={({isActive})=>
                        isActive
                        ? 'bg-blue-700 px-3 py-2 rounded-md text-sm font-medium text-white'
                        : 'hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium '
                    }  

                    to={'/login'}>
                        Login
                    </NavLink>
                </div>
                }
                




            </div>
        </div>
    </nav>
  )
}

export default MainNav
