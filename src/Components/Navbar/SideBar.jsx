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
  const isSuperAdmin = userRole === 'super_admin';

  const [usersOpen, setUsersOpen] = useState(false);
  const [cotisationsOpen, setCotisationsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [validationOpen, setValidationOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setUsersOpen(false);
        setCotisationsOpen(false);
        setStatsOpen(false);
        setValidationOpen(false);
        setConfigOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (setter, otherSetters = []) => {
    setter(prev => !prev);
    otherSetters.forEach(s => s(false));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setUsersOpen(false);
    setCotisationsOpen(false);
    setStatsOpen(false);
    setValidationOpen(false);
    setConfigOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isValidationActive = () => location.pathname.startsWith('/dash/validation');
  const isConfigActive = () => location.pathname === '/dash/permissions' || location.pathname === '/dash/validation/schemas';

  return (
    <nav
      ref={sidebarRef}
      className="fixed top-0 left-0 h-full w-[300px] bg-gray-900 text-gray-100 flex flex-col py-6 px-4 font-urbanist shadow-xl z-40"
    >
      <div className="mb-8 text-center flex-shrink-0">
        <SectionTitle title="GestOrg" />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleNavigation("/dash")}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive("/dash") 
                ? "bg-yellow-300 text-gray-900 shadow-md" 
                : "hover:bg-yellow-400 hover:text-gray-900"
            }`}
          >
            Dashboard
          </button>

          {isSuperAdmin && (
            <div>
              <button
                onClick={() => toggleDropdown(setUsersOpen, [setCotisationsOpen, setStatsOpen, setValidationOpen, setConfigOpen])}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  usersOpen ? "bg-gray-800" : "hover:bg-yellow-400 hover:text-gray-900"
                }`}
              >
                Utilisateurs
              </button>
              {usersOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                  <button
                    onClick={() => handleNavigation("/dash/allUsers")}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive("/dash/allUsers") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                    }`}
                  >
                    Tous les utilisateurs
                  </button>
                  <button
                    onClick={() => handleNavigation("/dash/createUser")}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive("/dash/createUser") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                    }`}
                  >
                    Créer utilisateur
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => handleNavigation("/dash/allMembers")}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive("/dash/allMembers") 
                ? "bg-yellow-300 text-gray-900 shadow-md" 
                : "hover:bg-yellow-400 hover:text-gray-900"
            }`}
          >
            Membres
          </button>

          <div>
            <button
              onClick={() => toggleDropdown(setCotisationsOpen, [setUsersOpen, setStatsOpen, setValidationOpen, setConfigOpen])}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                cotisationsOpen ? "bg-gray-800" : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Cotisation
            </button>
            {cotisationsOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                <button
                  onClick={() => handleNavigation("/dash/allCotisations")}
                  className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                    isActive("/dash/allCotisations") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                  }`}
                >
                  Toutes les cotisations
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => handleNavigation("/dash/ajouterCotisation")}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive("/dash/ajouterCotisation") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                    }`}
                  >
                    Ajouter nouveau
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleDropdown(setValidationOpen, [setUsersOpen, setCotisationsOpen, setStatsOpen, setConfigOpen])}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isValidationActive() && validationOpen ? "bg-yellow-300 text-gray-900" : validationOpen ? "bg-gray-800" : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Validation
            </button>
            {validationOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                <button
                  onClick={() => handleNavigation("/dash/validation/requests")}
                  className="block w-full text-left px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                >
                  Demandes à valider
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleDropdown(setStatsOpen, [setUsersOpen, setCotisationsOpen, setValidationOpen, setConfigOpen])}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                statsOpen ? "bg-gray-800" : "hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              Statistiques
            </button>
            {statsOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                <button
                  onClick={() => handleNavigation("/dash/feeStats")}
                  className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                    isActive("/dash/feeStats") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                  }`}
                >
                  Cotisations
                </button>
                <button
                  onClick={() => handleNavigation("/dash/userStats")}
                  className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                    isActive("/dash/userStats") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                  }`}
                >
                  Utilisateurs
                </button>
              </div>
            )}
          </div>

          {isSuperAdmin && (
            <div>
              <button
                onClick={() => toggleDropdown(setConfigOpen, [setUsersOpen, setCotisationsOpen, setStatsOpen, setValidationOpen])}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  configOpen ? "bg-gray-800" : "hover:bg-yellow-400 hover:text-gray-900"
                }`}
              >
                Configuration
              </button>
              {configOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                  <button
                    onClick={() => handleNavigation("/dash/permissions")}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive("/dash/permissions") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                    }`}
                  >
                    Permissions
                  </button>
                  <button
                    onClick={() => handleNavigation("/dash/validation/schemas")}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive("/dash/validation/schemas") ? "bg-yellow-300 text-gray-900" : "hover:bg-gray-700"
                    }`}
                  >
                    Schémas de validation
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => handleNavigation("/auth/profile")}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive("/auth/profile") 
                ? "bg-yellow-300 text-gray-900 shadow-md" 
                : "hover:bg-yellow-400 hover:text-gray-900"
            }`}
          >
            Mon profil
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-yellow-400 hover:text-gray-900 font-medium transition-all duration-300"
        >
          Déconnexion
        </button>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.2s;
        }
        .custom-scrollbar:hover {
          scrollbar-color: #4b5563 #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: transparent;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-track {
          background-color: #1f2937;
        }
      `}</style>
    </nav>
  );
}