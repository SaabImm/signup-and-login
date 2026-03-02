import { useState, useContext, useEffect } from "react";
import Title from "../../../Components/Title";
import { UserContext } from "../../../Context/dataCont";
import { fetchWithRefresh } from "../../../Components/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const { authData, setAuthData } = useContext(UserContext);
  const id = authData?.user?._id || authData?.user?.id;

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState(""); // messages d'erreur
  const [successMessage, setSuccessMessage] = useState(""); // message de succès
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(null); // temps restant (secondes)

  // Calculer le délai initial de 24h à partir de passwordChangedAt
  useEffect(() => {
    if (authData?.user?.passwordChangedAt) {
      const lastChange = new Date(authData.user.passwordChangedAt).getTime();
      const now = Date.now();
      const elapsedSeconds = (now - lastChange) / 1000;
      const remaining = 24 * 3600 - elapsedSeconds;
      if (remaining > 0) {
        setLockSeconds(Math.ceil(remaining));
      }
    }
  }, [authData]);

  // Gestion du compte à rebours
  useEffect(() => {
    let interval;
    if (lockSeconds > 0) {
      interval = setInterval(() => {
        setLockSeconds((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockSeconds]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("⚠️ Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetchWithRefresh(
        `${API_URL}/user/psw/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        },
        authData.token,
        setAuthData
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Mot de passe mis à jour avec succès !");
        setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        // Mettre à jour authData avec le nouvel utilisateur
        if (data.user) {
          setAuthData((prev) => ({ ...prev, user: data.user }));
        }
        // Bloquer pour 24h
        setLockSeconds(24 * 3600);
      } else if (response.status === 429) {
        const match = data.message?.match(/(\d+)\s*secondes?/);
        const seconds = match ? parseInt(match[1], 10) : 60;
        setLockSeconds(seconds);
        setMessage(data.message || "Trop de tentatives. Veuillez patienter.");
      } else {
        setMessage(data.message || "❌ Échec de la mise à jour.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}min`;
    if (mins > 0) return `${mins}min ${secs}s`;
    return `${secs}s`;
  };

  const isLocked = lockSeconds > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-urbanist px-4">
      <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-xl border border-yellow-400/20 rounded-2xl shadow-2xl p-8">
        
        {/* Title */}
        <div className="mb-8 text-center">
          <Title title="Change Password" textColor="text-yellow-300" />
          <p className="text-gray-400 mt-2 text-sm">
            {isLocked 
              ? "Modification temporairement bloquée" 
              : "Update your account password securely"}
          </p>
          {isLocked && (
            <p className="text-yellow-300 mt-2 font-mono text-lg">
              {formatTime(lockSeconds)}
            </p>
          )}
        </div>

        {/* Message de succès (affiché même si bloqué) */}
        {successMessage && (
          <div className="mb-4 text-center text-sm font-medium text-green-400">
            {successMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={isLocked || isSubmitting}
            className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 
                       text-gray-200 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-yellow-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={isLocked || isSubmitting}
            className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 
                       text-gray-200 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-yellow-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />

          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm new password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            disabled={isLocked || isSubmitting}
            className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 
                       text-gray-200 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-yellow-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />

          <button
            type="submit"
            disabled={isLocked || isSubmitting}
            className={`w-full py-3 rounded-md font-semibold transition
              ${
                isLocked || isSubmitting
                  ? "bg-yellow-300/40 text-black cursor-not-allowed"
                  : "bg-yellow-300 text-black hover:bg-yellow-400"
              }`}
          >
            {isLocked 
              ? `Bloqué (${formatTime(lockSeconds)})` 
              : isSubmitting 
                ? "Updating..." 
                : "Change Password"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-5 text-center text-sm font-medium text-red-400`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}