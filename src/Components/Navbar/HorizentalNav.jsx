import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutContext } from "../../Context/logoutContext";
import SectionTitle from '../Title';

export default function SideBar() {
  const { handleLogout } = useContext(logoutContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed  top-0 left-0 bottom-0 w-[300px] bg-gray-900 text-gray-100 flex flex-col justify-between py-10 px-4 font-urbanist shadow-lg">
      
      {/* Logo / Title */}
      <div className="mb-10 text-center">
        <SectionTitle title="MbsDash" />
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/dash")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/dash") 
              ? "bg-yellow-300 text-gray-900 shadow-lg" 
              : "hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          Dashboard
        </button>

        {/* Utilisateurs Dropdown */}
        <div className="group relative">
          <button className="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors hover:bg-yellow-400 hover:text-gray-900 flex justify-between items-center">
            Utilisateurs
           <span className="ml-2 text-[30px] opacity-50">›</span>
          </button>

          <div className="absolute left-0 top-full mt-1 w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              onClick={() => navigate("/dash/allUsers")}
              className={`w-full text-left px-6 py-2 rounded-lg transition-colors ${
                isActive("/dash/allUsers") 
                  ? "bg-yellow-300 text-gray-900" 
                  : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Tous les utilisateurs
            </button>
            <button
              onClick={() => navigate("/dash/create")}
              className={`w-full text-left px-6 py-2 rounded-lg transition-colors ${
                isActive("/dash/createUser") 
                  ? "bg-yellow-300 text-gray-900" 
                  : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Créer Utilisateur
            </button>
          </div>
        </div>



        <button
          onClick={() => navigate("/auth/profile")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/profile") 
              ? "bg-yellow-300 text-gray-900 shadow-lg" 
              : "hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          Profile
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 px-4 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-yellow-300 hover:text-gray-900 font-medium transition-all duration-300 shadow-md"
      >
        Logout
      </button>
    </nav>
  );
}
