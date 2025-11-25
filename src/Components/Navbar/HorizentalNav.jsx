import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutContext } from "../../Context/logoutContext";
import Title from '../../Components/Title';

export default function SideBar() {
  const { handleLogout } = useContext(logoutContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 bottom-0 w-[200px] text-black flex flex-col justify-between py-8 px-4 font-urbanist">
      {/* Logo */}
      <div className="mb-8">
        <Title title={"MbsDash"} />
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate("/dash")}
          className={`w-full text-left px-3 py-2 rounded transition-colors ${
            isActive("/dash") ? "text-blue-600" : "hover:text-blue-400"
          }`}
        >
          Dashboard
        </button>

        {/* Utilisateurs Dropdown */}
        <div className="group relative">
          <button className="w-full text-left px-3 py-2 rounded transition-colors hover:text-blue-400">
            Utilisateurs
          </button>

          <div className="absolute left-0 top-full mt-1 w-full bg-gray-800 text-white rounded shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={() => navigate("/dash/allUsers")}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${
                isActive("/dash/allUsers") ? "text-blue-600" : "hover:text-blue-400"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => navigate("/dash/create")}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${
                isActive("/dash/createUser") ? "text-blue-600" : "hover:text-blue-400"
              }`}
            >
              Create User
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/dash/produits")}
          className={`w-full text-left px-3 py-2 rounded transition-colors ${
            isActive("/dash/produits") ? "text-blue-600" : "hover:text-blue-400"
          }`}
        >
          Produits
        </button>

        <button
          onClick={() => navigate("/dash/fichiers")}
          className={`w-full text-left px-3 py-2 rounded transition-colors ${
            isActive("/dash/fichiers") ? "text-blue-600" : "hover:text-blue-400"
          }`}
        >
          Fichiers
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`w-full text-left px-3 py-2 rounded transition-colors ${
            isActive("/profile") ? "text-blue-600" : "hover:text-blue-400"
          }`}
        >
          Profile
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-4 px-3 py-2 text-gray-500 border-2 border-gray-400 rounded-md bg-transparent hover:bg-gray-400 hover:text-white transition-all duration-300"
      >
        Logout
      </button>
    </nav>
  );
}
