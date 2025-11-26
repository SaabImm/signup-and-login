import { useContext, useEffect } from "react";
import DataCards from "../../../Components/Cards/DataCards";
import { UserDataContext } from '../../../Context/userDataCont';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { SearchBarContext } from "../../../Context/searchContext";
import { IoSearchOutline } from "react-icons/io5";
import {fetchWithRefresh} from '../../../Components/api'
export default function GetUsers() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { data, setData } = useContext(UserDataContext);
  const { authData, setAuthData } = useContext(UserContext);
  const { keyWord, selectedRole, handleChange } = useContext(SearchBarContext);
  

  useEffect(() => {
    if (!authData?.token) return;

    const getElements = async () => {
      try {
        
        const response = await fetchWithRefresh(
          `${API_URL}/user`,
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
  }, [authData.token]);

    const searchableFields = ["name", "lastname", "email"];
    const displayedUsers = data.users.filter((user) => {
    // check if any searchable field matches the keyword
    const matchesSearch = searchableFields.some((field) =>
        String(user[field]).toLowerCase().includes(keyWord.toLowerCase())
    );

    // check if the user matches selected role
    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    // include only if both match
    return matchesSearch && matchesRole;
    });


  return (
    <div className="UsersPage min-h-screen ml-[200px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">

      {/* Title */}
      <Title title="Users Management" />

      {/* ALWAYS VISIBLE SEARCH BAR */}
      <div className="relative mb-6 mt-4 flex items-center gap-3">
        <IoSearchOutline size={22} className="text-yellow-300" />
        <input
        type="text"
        name="search" 
        onChange={handleChange}
        placeholder="Search users by name, email..."
        className="w-1/4 px-4 py-2 rounded-xl outline-none text-yellow-300 placeholder-yellow-200/40
                    bg-gray-900/40 backdrop-blur-md border border-gray-700/40 shadow-lg shadow-black/30 transition-all animate-fadeIn"
        />

        <select
        name="role"
        onChange={handleChange}
        className="w-1/4 px-4 py-2 rounded-xl bg-gray-900/40 backdrop-blur-md text-yellow-300 placeholder-yellow-200/40
                    border border-gray-700/40 shadow-lg shadow-black/30 focus:outline-none focus:ring-2 focus:ring-yellow-400
                    hover:bg-gray-900/60 transition-all duration-200 animate-fadeIn"
        >
        <option value="all">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        </select>


      </div>

      {/* USER CARDS */}
      <div className="CardsContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        { displayedUsers?.map((item) => (
          <DataCards key={item._id} userItem={item} />
        ))}
      </div>
    </div>
  );
}
