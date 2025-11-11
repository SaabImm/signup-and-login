import Title from '../Components/Title'
import sabAvatar from '../assets/SabrinaAvatar.jpg'
import Navbar from '../Components/Navbar/Navbar'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/dataCont";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { authData, setAuthData, logout} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const id = authData.user?.id || authData.user?._id;
  useEffect(() => {
  if (authData.user !== null) {
    setLoading(false);
  }
}, [authData]);
  useEffect(() => {
      if (!authData.user && !loading) 
        {navigate("/");
          setLoading(false)
        }      
    }, [authData, loading]);
  //handles the logout button
  const handleLogout = async (e) => { 
    e.preventDefault();
      const response = await fetch(`${API_URL}/auth/logout?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      console.log(response.message)
      logout();
    } else {
      console.error(response.message || "Signup error");
    }  

  }
  return (
    <>
      <Navbar />

      <div className="min-h-screen px-10 py-16 bg-gray-50 flex flex-col items-center">

        {/* Page Header */}
        <div className="w-3/4 mx-auto mb-14 text-center">
          <Title title="Profile" />
          <p className="text-gray-600 mt-2 text-lg">
            View all your profile details here
          </p>
        </div>

        {/* Main Content */}
        <div className="w-3/4 mx-auto flex items-center gap-14">

          {/* Left Side */}
          <div className="basis-1/3 flex flex-col items-center gap-6">
            <img
              src={sabAvatar}
              alt="Profile"
              loading="lazy"
              className="w-40 h-40 object-cover rounded-full border-4 border-gray-300 shadow"
            />

            <div className="text-center">
              <h2 className="text-2xl font-semibold">{authData.user?.name} {authData.user?.lastname} </h2>
              <p className="text-gray-500 mt-1">{authData.user?.email}</p>
              <span className="text-sm px-3 py-1 bg-gray-200 rounded-full mt-2 inline-block">
                {authData.user?.role}
              </span>
            </div>
          </div>

          {/* Right Side */}
          <div className="basis-2/3 p-8 bg-white rounded-xl shadow-md">
            <Title title="Personal Details" />

            <div className="mt-6 grid grid-cols-2 gap-6 text-gray-700">
              <div>
                <p className="font-medium">Name</p>
                <p className="text-gray-500 text-sm mt-1"> {authData.user?.name} </p>
              </div>

              <div>
                <p className="font-medium">Last Name</p>
                <p className="text-gray-500 text-sm mt-1"> {authData.user?.lastname} </p>
              </div>

              <div>
                <p className="font-medium">Role</p>
                <p className="text-gray-500 text-sm mt-1"> {authData.user?.role} </p>
              </div>

              <div>
                <p className="font-medium">email</p>
                <p className="text-gray-500 text-sm mt-1"> {authData.user?.email} </p>
              </div>
            </div>

          </div>
        </div>
      <button className='w-1/4 m-auto py-3 text-lg font-semibold text-gray-500 border-2 border-gray-400 rounded-md bg-transparent hover:bg-gray-400 hover:text-white transition-all duration-300' 
      onClick={handleLogout}>
        Logout
      </button>
      </div>


    </>
  )
}
