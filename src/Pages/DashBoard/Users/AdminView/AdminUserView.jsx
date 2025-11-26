import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfilePage from "../../../ProfilePage";
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminUserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [validating, setValidating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_URL}/user/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  // Validate user
  const handleValidate = async () => {
    setValidating(true);
    try {
      const res = await fetch(`${API_URL}/user/validate/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMessage(data.message || "User validated");
      setUser(prev => ({ ...prev, isAdminVerified: true })); // Update local state
      setShowPopup(true);

      // Auto hide popup after 3 seconds
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Validation failed");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setValidating(false);
    }
  };

  const handleEdit = () => navigate(`/dash/update/${id}`);

  if (loading) return <div className="text-center text-yellow-300 py-10">Loading…</div>;
  if (!user) return <div className="text-center text-red-400 py-10">User not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4 relative">

      {/* PROFILE */}
      <div className="max-w-5xl mx-auto">
        <ProfilePage user={user} />
      </div>

      {/* ADMIN ACTIONS */}
      <div className="max-w-5xl mx-auto mt-10">
        <div className="bg-gray-800/70 backdrop-blur-xl border border-yellow-400/20 
                        rounded-xl shadow-xl p-8 flex gap-6 justify-center">

          {/* VALIDATE BUTTON */}
          <button
            onClick={handleValidate}
            disabled={user.isAdminVerified || validating}
            className={`px-8 py-3 rounded-lg font-semibold tracking-wide
                        ${user.isAdminVerified ? "bg-green-500 text-gray-900" :
                          validating ? "bg-yellow-400 text-gray-900" :
                          "bg-yellow-500 text-gray-900"}
                        hover:bg-yellow-400 transition-colors 
                        shadow-[0_0_10px_rgba(255,200,80,0.4)]`}
          >
            {user.isAdminVerified ? "Validated" : validating ? "Pending…" : "Validate User"}
          </button>

          {/* EDIT BUTTON */}
          <button
            onClick={handleEdit}
            className="px-8 py-3 rounded-lg font-semibold tracking-wide
                      bg-gray-900 text-yellow-300 border border-yellow-300/40
                      hover:bg-gray-800 transition-colors
                      shadow-[0_0_10px_rgba(255,200,80,0.2)]"
          >
            Edit User
          </button>
        </div>
      </div>

      {/* POPUP MESSAGE */}
      {showPopup && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800/90 text-yellow-300
                        px-6 py-4 rounded-xl shadow-lg border border-yellow-400/30 transition-all">
          {message}
        </div>
      )}
    </div>
  );
}
