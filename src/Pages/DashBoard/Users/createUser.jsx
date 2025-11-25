import { useState, useContext } from "react";
import { UserContext } from '../../../Context/dataCont';
import Title from "../../../Components/Title";
import { fetchWithRefresh }  from "../../../Components/api";
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateUser() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { authData, setAuthData } = useContext(UserContext);
  const initialFormData = {
    name: "",
    lastname: "",
    email: "",
    role: "user",
    dateOfBirth: "",
    password: "",
    secondPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name || !formData.lastname || !formData.email || !formData.password || !formData.secondPassword) {
      setIsError(true);
      setMessage("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.secondPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetchWithRefresh(`${API_URL}/user`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          dateOfBirth: formData.dateOfBirth || null,

        }),

      },   
          authData.token,
          setAuthData);

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage("✅ User created successfully!");
        setFormData(initialFormData);
      } else {
        setIsError(true);
        setMessage(data.message || "❌ Failed to create user.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setIsError(true);
      setMessage("⚠️ Network error. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen ml-[200px] gap-10 font-urbanist border-l-4 py-10">
        <div className="flex flex-col justify-center items-center">
          <Title title="Créer un nouvel utilisateur" />
        </div>

        <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 tracking-wide">
            Remplir le Formulaire
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              onChange={handleChange}
              type="text"
              placeholder="Nom.."
              name="name"
              value={formData.name}
              className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            <input
              onChange={handleChange}
              type="text"
              placeholder="Prénom.."
              name="lastname"
              value={formData.lastname}
              className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            <input
              onChange={handleChange}
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              min="1900-01-01"
              className="w-full p-3 bg-gray-900/60 text-white/50 placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="E-mail.."
              value={formData.email}
              className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900/60 text-white border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Mot de passe.."
              value={formData.password}
              className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            <input
              onChange={handleChange}
              type="password"
              name="secondPassword"
              placeholder="Confirmez votre mot de passe.."
              value={formData.secondPassword}
              className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />

            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold text-yellow-400 border-2 border-yellow-400 rounded-md bg-transparent hover:bg-yellow-400 hover:text-blue-950 transition-all duration-300"
            >
              Envoyer
            </button>
          </form>
        </div>

        {message && (
          <div className={`text-center mt-4 font-medium ${isError ? "text-red-500" : "text-green-400"}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}
