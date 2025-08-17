import SauSauLogo from '../assets/SauSauLogo2.png' 
import NavLink from './NavLinks'
import { PiShoppingCartFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";

export default function Navbar(){

    return(
        <>
            <nav className='relative'>
                <div className='fixed backdrop-blur-[10px] top-0 right-0 left-0 z-50 flex justify-between items-center px-12 py-4'>
                    <div className='w-10'>
                    <img src={SauSauLogo} alt="Sau Sau Logo" className='rounded-xl'/>
                    </div>

                    <div className='basis-1/2' >
                        <ul className='flex justify-between items-center '>
                            <NavLink text="Home" path="#home" />
                            <NavLink text="Shop" path="#shop" />  
                            <NavLink text="CheckOut" path="#chackout" />
                            <NavLink text="Contact" path="#contact" />
                            <NavLink text="About" path="#about" />
                             

                        </ul>
                    </div>

                    <div className='flex justify-between items-center basis-1/12'>
                        <a href="/" className='text-2xl'> <PiShoppingCartFill /> </a>
                        <a href="/" className='text-2xl'> <IoSearchOutline /> </a>
                    </div>
                </div>
                
            </nav>
        </>
    )
}