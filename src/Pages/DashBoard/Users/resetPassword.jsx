import { useState, useContext } from "react";
import Title from "../../../Components/Title";
import { UserContext } from "../../../Context/dataCont";
import { fetchWithRefresh }  from "../../../Components/api";

const API_URL = import.meta.env.VITE_API_URL;
export default function ResetPassword() {
const { authData, setAuthData } = useContext(UserContext);
const id = authData?.user?._id || authData?.user?.id;

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional client-side check
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("⚠️ New passwords do not match.");
      return;
    }
    setMessage("");
    setIsSubmitting(true);
    try {
        const response = await fetchWithRefresh(`${API_URL}/user/psw/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            currentPassword : formData.currentPassword,
            newPassword: formData.newPassword
        }),
        },
          authData.token,
          setAuthData
      );

        const data = await response.json();

        if (response.ok) {
        setMessage("Password updated successfully! ")
        setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } else {
        setMessage(data.message || "❌ Update failed.");
        }
    } catch (err) {
        console.error(err);
        setMessage("⚠️ Network error. Please try again.");
    } finally {
  setIsSubmitting(false);
}
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-urbanist px-4">
    
    <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-xl border border-yellow-400/20 rounded-2xl shadow-2xl p-8">
      
      {/* Title */}
      <div className="mb-8 text-center">
        <Title title="Change Password" textColor="text-yellow-300" />
        <p className="text-gray-400 mt-2 text-sm">
          Update your account password securely
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        
        <input
          type="password"
          name="currentPassword"
          placeholder="Current password"
          value={formData.currentPassword}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 
                     text-gray-200 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-yellow-300"
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 
                     text-gray-200 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-yellow-300"
          required
        />

        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm new password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 
                     text-gray-200 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-yellow-300"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-md font-semibold transition
            ${
              isSubmitting
                ? "bg-yellow-300/40 text-black cursor-not-allowed"
                : "bg-yellow-300 text-black hover:bg-yellow-400"
            }`}
        >
          {isSubmitting ? "Updating..." : "Change Password"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-5 text-center text-sm font-medium ${
            message.includes("success")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  </div>
);

}
