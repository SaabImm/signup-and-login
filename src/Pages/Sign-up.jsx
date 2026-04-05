import { React, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/dataCont";
import SectionTitle from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

export default function FormulaireCNOA() {
  const [message, setMessage] = useState("");
  const { setAuthData } = useContext(UserContext);
  const navigate = useNavigate();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const maxDate = `${yyyy}-${mm}-${dd}`;

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    dateOfBirth: "",
    sexe: "",
    registrationNumber: "",
    startDate: "",
    password: "",
    secondPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.secondPassword) {
      setMessage("Please make sure your passwords match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          sexe: formData.sexe,
          registrationNumber: formData.registrationNumber,
          startDate: formData.startDate,
        }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setAuthData({ user: data.user, token: data.token });
        navigate("/auth/verify-pending");
      } else {
        console.error(data.message || "Signup error");
      }
    } catch (err) {
      console.error("An error occurred during signup.");
      setMessage("⚠️ Network error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-10 font-urbanist bg-gray-800 text-yellow-300 p-10">
      <SectionTitle title="Formulaire CNOA" />

      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl border border-yellow-300/40">
        <h2 className="text-2xl font-bold text-center text-yellow-300 mb-6">
          Remplir le Formulaire
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nom */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Nom</label>
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Prénom</label>
            <input
              type="text"
              name="lastname"
              placeholder="Votre prénom"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Date de naissance</label>
            <input
              type="date"
              name="dateOfBirth"
              min="1900-01-01"
              max={maxDate}
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          {/* Sexe */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Sexe</label>
            <select
              name="sexe"
              value={formData.sexe}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            >
              <option value="">Sélectionnez votre sexe</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </select>
          </div>

          {/* Numéro d'inscription */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Numéro d'inscription</label>
            <input
              type="text"
              name="registrationNumber"
              placeholder="N° d'inscription à l'ordre"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          {/* Date de début d'activité */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Date de début d'activité</label>
            <input
              type="date"
              name="startDate"
              min="1900-01-01"
              max={maxDate}
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Adresse e-mail</label>
            <input
              type="email"
              name="email"
              placeholder="email@exemple.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-sm text-yellow-300 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              name="secondPassword"
              placeholder="Confirmez votre mot de passe"
              value={formData.secondPassword}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-yellow-300 border-2 border-yellow-300 rounded-md bg-transparent hover:bg-yellow-300 hover:text-gray-900 transition-all duration-300"
          >
            Envoyer
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>

      <div className="text-center text-yellow-300">
        By continuing, you agree to our Terms and Privacy Policy. <br />
        Already have an account? <a href="/" className="underline hover:text-yellow-400">Log In</a>
      </div>
    </div>
  );
}