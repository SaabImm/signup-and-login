import { useContext, useState, useRef, useEffect } from "react";
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

  // État pour chaque dropdown
  const [usersOpen, setUsersOpen] = useState(false);
  const [cotisationsOpen, setCotisationsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const sidebarRef = useRef(null);

  // Fermer tous les dropdowns quand on clique en dehors de la barre latérale
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setUsersOpen(false);
        setCotisationsOpen(false);
        setStatsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonctions pour basculer chaque dropdown
  const toggleUsers = (e) => {
    e.stopPropagation();
    setUsersOpen(prev => !prev);
    setCotisationsOpen(false);
    setStatsOpen(false);
  };

  const toggleCotisations = (e) => {
    e.stopPropagation();
    setCotisationsOpen(prev => !prev);
    setUsersOpen(false);
    setStatsOpen(false);
  };

  const toggleStats = (e) => {
    e.stopPropagation();
    setStatsOpen(prev => !prev);
    setUsersOpen(false);
    setCotisationsOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Fermer tous les dropdowns après navigation
    setUsersOpen(false);
    setCotisationsOpen(false);
    setStatsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav ref={sidebarRef} className="fixed top-0 left-0 bottom-0 w-[300px] bg-gray-900 text-gray-100 flex flex-col justify-between py-10 px-4 font-urbanist shadow-lg">
      
      <div className="mb-10 text-center">
        <SectionTitle title="GestOrg" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleNavigation("/dash")}
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
          <div className="relative">
            <button
              onClick={toggleUsers}
              className="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors hover:bg-yellow-400 hover:text-gray-900 flex justify-between items-center"
            >
              Utilisateurs
              <span className={`ml-2 text-[30px] transition-transform duration-200 ${usersOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {usersOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={() => handleNavigation("/dash/allUsers")}
                  className={`w-full text-left px-6 py-2 transition-colors ${
                    isActive("/dash/allUsers") 
                      ? "bg-yellow-300 text-gray-900" 
                      : "hover:bg-yellow-400 hover:text-gray-900"
                  }`}
                >
                  Tous les utilisateurs
                </button>
                <button
                  onClick={() => handleNavigation("/dash/create")}
                  className={`w-full text-left px-6 py-2 transition-colors ${
                    isActive("/dash/createUser") 
                      ? "bg-yellow-300 text-gray-900" 
                      : "hover:bg-yellow-400 hover:text-gray-900"
                  }`}
                >
                  Créer Utilisateur
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => handleNavigation("/dash/allMembers")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/dash/allMembers") 
              ? "bg-yellow-300 text-gray-900 shadow-lg" 
              : "hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          Membres
        </button>

        {/* Cotisations DropDown */}
        <div className="relative">
          <button
            onClick={toggleCotisations}
            className="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors hover:bg-yellow-400 hover:text-gray-900 flex justify-between items-center"
          >
            Cotisation
            <span className={`ml-2 text-[30px] transition-transform duration-200 ${cotisationsOpen ? 'rotate-90' : ''}`}>›</span>
          </button>
          {cotisationsOpen && (
            <div className="absolute left-0 top-full mt-1 w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg z-20 py-1">
              <button
                onClick={() => handleNavigation("/dash/allCotisations")}
                className={`w-full text-left px-6 py-2 transition-colors ${
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
                  onClick={() => handleNavigation("/dash/ajouterCotisation")}
                  className={`w-full text-left px-6 py-2 transition-colors ${
                    isActive("/dash/ajouterCotisation") 
                      ? "bg-yellow-300 text-gray-900" 
                      : "hover:bg-yellow-400 hover:text-gray-900"
                  }`}
                >
                  Ajouter Nouveau
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats DropDown */}
        <div className="relative">
          <button
            onClick={toggleStats}
            className="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors hover:bg-yellow-400 hover:text-gray-900 flex justify-between items-center"
          >
            Stats
            <span className={`ml-2 text-[30px] transition-transform duration-200 ${statsOpen ? 'rotate-90' : ''}`}>›</span>
          </button>
          {statsOpen && (
            <div className="absolute left-0 top-full mt-1 w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg z-20 py-1">
              <button
                onClick={() => handleNavigation("/dash/feeStats")}
                className={`w-full text-left px-6 py-2 transition-colors ${
                  isActive("/dash/feeStats") 
                    ? "bg-yellow-300 text-gray-900" 
                    : "hover:bg-yellow-400 hover:text-gray-900"
                }`}
              >
                Cotisation Stats
              </button>
              <button
                onClick={() => handleNavigation("/dash/userStats")}
                className={`w-full text-left px-6 py-2 transition-colors ${
                  isActive("/dash/userStats") 
                    ? "bg-yellow-300 text-gray-900" 
                    : "hover:bg-yellow-400 hover:text-gray-900"
                }`}
              >
                User Stats
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => handleNavigation("/auth/profile")}
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