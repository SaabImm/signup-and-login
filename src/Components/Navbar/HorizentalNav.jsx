import { useContext } from "react"
import {logoutContext} from "../../Context/logoutContext"
import NavLink from "../../Components/Navbar/NavLinks"
import Title from '../../Components/Title'

export default function HorizentalDash() {
    const {handleLogout}= useContext(logoutContext)
    return(
        <>
            <nav className="NavBarHorizental relative h-full w-[200px]">
                <div className="NavContainer fixed top-0 left-0 bottom-0 flex flex-col justify-between item-center px-4 py-8">
                    <div className="Logo">
                        <Title title={"MbsDash"}/>
                    </div>
                    <div className="NavLinksContainer flex flex-col justify-between item-center">
                        <NavLink text="Dashboard" path="/dash"/>
                        <NavLink text="Utilisateurs" path="/dash/user"/>
                        <NavLink text="Produits" path="/dash"/>
                        <NavLink text="Fichiers" path="/dash"/>
                    </div>

                    <div>
                        <NavLink text="Profile" path="/profile"/>
                    </div>

                    <button className='
                      p-3 text-lg font-semibold text-gray-500 border-2 border-gray-400 rounded-md bg-transparent hover:bg-gray-400 hover:text-white transition-all duration-300' 
                        onClick={()=>{handleLogout()}}>
                        Logout
                    </button>
                </div>
            </nav>
        </>
    )
}