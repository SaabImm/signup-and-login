import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../Context/dataCont';
import { fetchWithRefresh } from '../Components/api';

export default function DeleteUser() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { authData, setAuthData } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${API_URL}/user/${id}`, {
        method: "DELETE",
      },
      authData.token,
      setAuthData);

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ User ${data.user.email} was deleted`);
        setTimeout(() => navigate("/dash/allUsers"), 2000); // redirect after 2s
      } else {
        setMessage(data.message || "❌ Delete failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-[200px] min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-300 font-urbanist p-8">

      <div className="
        bg-gray-900/50 backdrop-blur-xl 
        border border-gray-700/40 
        rounded-2xl shadow-xl shadow-black/30 
        p-10 w-[450px] text-center animate-fadeIn
      ">
        <h2 className="text-xl font-bold mb-4 text-yellow-300">
          {message ? "Status" : "Confirm Deletion"}
        </h2>

        {message ? (
          <p className="text-yellow-200">{message}</p>
        ) : !confirmed ? (
          <>
            <p className="mb-6 text-yellow-200">Are you sure you want to delete this user?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmed(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => navigate("/dash/allUsers")}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-yellow-200">Deleting user...</p>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
