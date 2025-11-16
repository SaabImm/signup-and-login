import NavLink from "../../../Components/Navbar/NavLinks"

export default function UsersPage() {
    
    return(
        <>
            <div className='min-h-screen ml-[200px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist flex flex-col items-start justify-center'>
                <NavLink text="All users" path="/dash/allUsers"/> 
                <NavLink text="About" path="" />
                <NavLink text="Create New User" path="/dash/create" />
                
            </div>
        </>
    )}