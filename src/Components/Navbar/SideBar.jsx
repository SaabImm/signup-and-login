import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutContext } from "../../Context/logoutContext";
import { UserContext } from "../../Context/dataCont";
import SectionTitle from '../Title';

export default function SideBar() {
  const { handleLogout } = useContext(logoutContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { authData } = useContext(UserContext);
  const userRole = authData?.user?.role;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 bottom-0 w-[300px] bg-gray-900 text-gray-100 flex flex-col justify-between py-10 px-4 font-urbanist shadow-lg">
      
      <div className="mb-10 text-center">
        <SectionTitle title="GestOrg" />
      </div>

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

        {/* Utilisateurs dropdown – visible uniquement aux super admins */}
        {userRole === 'super_admin' && (
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
        )}

        <button
          onClick={() => navigate("/dash/allMembers")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/dash/allMembers") 
              ? "bg-yellow-300 text-gray-900 shadow-lg" 
              : "hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          Membres
        </button>

        {/* Cotisations DropDown */}
        <div className="group relative">
          <button className="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors hover:bg-yellow-400 hover:text-gray-900 flex justify-between items-center">
            Cotisation
            <span className="ml-2 text-[30px] opacity-50">›</span>
          </button>
          <div className="absolute left-0 top-full mt-1 w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              onClick={() => navigate("/dash/allCotisations")}
              className={`w-full text-left px-6 py-2 rounded-lg transition-colors ${
                isActive("/dash/allCotisations") 
                  ? "bg-yellow-300 text-gray-900" 
                  : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Toutes les cotisations
            </button>
            {/* Ajouter Nouveau visible seulement aux super admins */}
            {userRole === 'super_admin' && (
              <button
                onClick={() => navigate("/dash/ajouterCotisation")}
                className={`w-full text-left px-6 py-2 rounded-lg transition-colors ${
                  isActive("/dash/ajouterCotisation") 
                    ? "bg-yellow-300 text-gray-900" 
                    : "hover:bg-yellow-400 hover:text-gray-900"
                }`}
              >
                Ajouter Nouveau
              </button>
            )}
          </div>
        </div>

        {/* Stats DropDown */}
        <div className="group relative">
          <button className="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors hover:bg-yellow-400 hover:text-gray-900 flex justify-between items-center">
            Stats
            <span className="ml-2 text-[30px] opacity-50">›</span>
          </button>
          <div className="absolute left-0 top-full mt-1 w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              onClick={() => navigate("/dash/feeStats")}
              className={`w-full text-left px-6 py-2 rounded-lg transition-colors ${
                isActive("/dash/feeStats") 
                  ? "bg-yellow-300 text-gray-900" 
                  : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Cotisation Stats
            </button>
            <button
              onClick={() => navigate("/dash/userStats")}
              className={`w-full text-left px-6 py-2 rounded-lg transition-colors ${
                isActive("/dash/userStats") 
                  ? "bg-yellow-300 text-gray-900" 
                  : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              User Stats
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/auth/profile")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/auth/profile") 
              ? "bg-yellow-300 text-gray-900 shadow-lg" 
              : "hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          Profile
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="w-full mt-6 px-4 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-yellow-300 hover:text-gray-900 font-medium transition-all duration-300 shadow-md"
      >
        Logout
      </button>
    </nav>
  );
}