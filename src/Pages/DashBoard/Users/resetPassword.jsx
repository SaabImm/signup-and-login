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
    <div className="min-h-screen flex flex-col items-center justify-center font-urbanist py-10">
      <div className="mb-8 text-center">
        <Title title="Change Password" />
        <p className="text-gray-600 mt-2">Update your account password securely</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 font-semibold rounded-md text-white transition-colors ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Updating..." : "Change Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
