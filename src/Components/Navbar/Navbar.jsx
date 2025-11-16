import NavLink from './NavLinks'
import { Link } from "react-router-dom";
import { useState, useContext} from "react"
import { IoSearchOutline } from "react-icons/io5";
import { PiUser } from "react-icons/pi";


export default function Navbar(){
    const [isOpenBar, setIsOpenBar]=  useState(false)
    const toggleSearchBar= ()=>{
        setIsOpenBar(prev => !prev)
    }

    return(
        <nav className='NavBar'>
            <div className='top-0 right-0 left-0 flex justify-between items-center rounded-b-lg px-12 py-2 text-[#383838] text-shadow-lg/30'>
                <Link to='/'>
                CNOA FORUMS
                </Link>

                <div className='NavLinks ' >
                    <ul className='flex justify-between items-center gap-5'>
                        <NavLink text="Home" path='/'/> 
                        <NavLink text="Contact US" path="#contact" />
                        <NavLink text="About" path="#about" />
                    </ul>
                </div>

                <ul className='flex justify-between gap-6 items-center'>
                    
                    {isOpenBar &&
                    <input type="text" className="rounded-md border px-2 py-1 ml-2 outline-none font-[Montserrat,sans-serif]"   onChange={handleChange}/>}
                    <button onClick={toggleSearchBar}>
                    <li ><IoSearchOutline  size={20}/> </li>
                    </button>
                    <button className='transition duration-200'>
                    <Link to={`/`} >
                        <li><PiUser   size={20}/> </li>
                    </Link>
                    </button>
                </ul>
            </div>
            
        </nav>
        
    )
}