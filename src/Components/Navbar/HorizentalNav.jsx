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
    <nav className="fixed top-0 left-0 bottom-0 w-[220px] bg-gray-900 text-gray-100 flex flex-col justify-between py-10 px-4 font-urbanist shadow-lg">
      
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
            <span className="ml-2 transform group-hover:rotate-90 transition-transform">▶</span>
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
              All Users
            </button>
            <button
              onClick={() => navigate("/dash/create")}
              className={`w-full text-left px-6 py-2 rounded-lg transition-colors ${
                isActive("/dash/createUser") 
                  ? "bg-yellow-300 text-gray-900" 
                  : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Create User
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/dash/produits")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/dash/produits") 
              ? "bg-yellow-300 text-gray-900 shadow-lg" 
              : "hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          Produits
        </button>

        <button
          onClick={() => navigate("/dash/fichiers")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/dash/fichiers") 
              ? "bg-yellow-300 text-gray-900 shadow-lg" 
              : "hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          Fichiers
        </button>

        <button
          onClick={() => navigate("/profile")}
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
