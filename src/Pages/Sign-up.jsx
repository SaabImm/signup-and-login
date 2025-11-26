import { React, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/dataCont";
import SectionTitle from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

export default function FormulaireCNOA() {
  const [message, setMessage] = useState("");
  const { setAuthData, authData } = useContext(UserContext);
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
    role: "user",
    dateOfBirth: "",
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
          <input
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Nom"
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />
          <input
            onChange={handleChange}
            type="text"
            name="lastname"
            placeholder="Prénom"
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />
          <input
            onChange={handleChange}
            type="date"
            name="dateOfBirth"
            min="1900-01-01"
            max={maxDate}
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Mot de Passe"
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />
          <input
            onChange={handleChange}
            type="password"
            name="secondPassword"
            placeholder="Confirmez votre Mot de Passe"
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />

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
