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
  <div className="min-h-screen flex flex-col items-center justify-center font-urbanist py-10 bg-gray-100">
    
    {/* Title */}
    <div className="mb-8 text-center">
      <Title title="Créer un nouvel utilisateur" />
      <p className="text-gray-600 mt-2">
        Ajouter un nouvel utilisateur au système
      </p>
    </div>

    {/* Card */}
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <form className="space-y-4" onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          name="lastname"
          placeholder="Prénom"
          value={formData.lastname}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          min="1900-01-01"
          className="w-full p-3 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md bg-white
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="password"
          name="secondPassword"
          placeholder="Confirmer le mot de passe"
          value={formData.secondPassword}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          type="submit"
          className="w-full py-3 font-semibold rounded-md text-gray-900
            bg-yellow-400 hover:bg-yellow-500 transition-colors"
        >
          Créer l’utilisateur
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            isError ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  </div>
);

}
