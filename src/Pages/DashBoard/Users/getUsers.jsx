import { useContext, useEffect } from "react";
import DataCards from "../../../Components/Cards/DataCards";
import { UserDataContext } from '../../../Context/userDataCont';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { SearchBarContext } from "../../../Context/searchContext";
import { IoSearchOutline } from "react-icons/io5";
import { fetchWithRefresh } from '../../../Components/api';

export default function GetUsers({ mode }) { // mode: "membres" or "users"
  const API_URL = import.meta.env.VITE_API_URL;
  const { data, setData } = useContext(UserDataContext);
  const { authData, setAuthData } = useContext(UserContext);
  const { keyWord, handleChange } = useContext(SearchBarContext); // removed selectedRole

  useEffect(() => {
    if (!authData?.token) return;

    const getElements = async () => {
      try {
        const response = await fetchWithRefresh(
          `${API_URL}/admin/allUsers`,
          { method: "GET" },
          authData.token,
          setAuthData
        );
        const results = await response.json();
        setData(results);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getElements();
  }, [authData.token, setAuthData]);

  const searchableFields = ["name", "lastname", "email"];

  // Filter based on mode and search keyword
  const displayedUsers = data?.users?.filter((user) => {
    // Role filter based on mode
    if (mode === "membres" && user.role !== "user") return false;
    if (mode === "users" && user.role !== "admin" && user.role !== "super_admin") return false;

    // Search filter
    const matchesSearch = searchableFields.some((field) =>
      String(user[field] || "").toLowerCase().includes(keyWord.toLowerCase())
    );
    return matchesSearch;
  }) || [];

  const titleText = mode === "membres" ? "Gestion des Membres" : "Gestion des Utilisateurs (Admin)";
  const searchPlaceholder = mode === "membres"
    ? "Rechercher un membre par nom, prénom, email..."
    : "Rechercher un admin par nom, prénom, email...";

  return (
    <div className="UsersPage min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">

      {/* Title */}
      <Title title={titleText} />

      {/* Search Bar */}
      <div className="relative mb-6 mt-4 flex items-center gap-3">
        <IoSearchOutline size={22} className="text-yellow-300" />
        <input
          type="text"
          name="search"
          onChange={handleChange}
          placeholder={searchPlaceholder}
          className="w-1/4 px-4 py-2 rounded-xl outline-none text-yellow-300 placeholder-yellow-200/40
                     bg-gray-900/40 backdrop-blur-md border border-gray-700/40 shadow-lg shadow-black/30 transition-all animate-fadeIn"
        />
      </div>

      {/* User Cards */}
      <div className="CardsContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedUsers.map((item) => (
          <DataCards key={item._id} userItem={item} />
        ))}
      </div>
    </div>
  );
}