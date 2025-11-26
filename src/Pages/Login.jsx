import { React, useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../Context/dataCont";
import SectionTitle from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const { authData, setAuthData, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    logout();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthData({ user: data.user, token: data.token });
        const roleRedirects = { admin: "/dash", user: "/profile" };
        navigate(roleRedirects[data.user.role] || "/");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("⚠️ Network error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-10 font-urbanist bg-gray-800 text-yellow-300 p-10">
      <SectionTitle title="Welcome Back" />
      <p className="text-center text-yellow-300 mb-6">
        Log in and access your profile
      </p>

      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl border border-yellow-300/40">
        <h2 className="text-2xl font-bold text-center text-yellow-300 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-yellow-300 placeholder-yellow-500 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-yellow-300 border-2 border-yellow-300 rounded-md bg-transparent hover:bg-yellow-300 hover:text-gray-900 transition-all duration-300"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>

      <div className="text-center text-yellow-300 mt-4">
        By continuing, you agree to our Terms and Privacy Policy. <br />
        Don't have an account?{" "}
        <Link to="/signup" className="underline hover:text-yellow-400">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
