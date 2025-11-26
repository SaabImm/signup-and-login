import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../Context/dataCont";
import { logoutContext } from "../../Context/logoutContext";
import sabAvatar from '../../assets/SabrinaAvatar.jpg';

export default function Navbar() {
  const { authData } = useContext(UserContext);
  const { handleLogout } = useContext(logoutContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const id = authData.user?._id || authData.user?.id;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 text-yellow-300 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold hover:text-yellow-400 transition-colors">
              CNOA FORUM
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dash" className="hover:text-yellow-400 transition-colors">
              Dashboard
            </Link>
            <Link to="/about" className="hover:text-yellow-400 transition-colors">
              About
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-800 transition-all"
            >
              <span className="font-semibold">{authData.user?.name}</span>
              <img
                src={sabAvatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-yellow-300"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-yellow-300 shadow-lg rounded-lg py-2 z-50 border border-yellow-300">
                <button
                  onClick={() => { navigate(`/dash/update/${id}`); setDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-yellow-300 hover:text-gray-900 transition-all"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => { navigate("/dash/resetPsw"); setDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-yellow-300 hover:text-gray-900 transition-all"
                >
                  Edit Password
                </button>
                <div className="border-t border-yellow-300 my-1"></div>
                <button
                  onClick={() => { handleLogout(); setDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-500 hover:text-gray-900 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Optional Hamburger menu */}
          </div>

        </div>
      </div>
    </nav>
  );
}
