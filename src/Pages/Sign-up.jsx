import {React, useState, useEffect} from "react";
import Title from '../Components/Title'
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar/Navbar'
import { useContext } from "react";
import { UserContext } from "../Context/dataCont";

export default function FormulaireCNOA () {
    const [formData, setFormData] = useState({
      name: "",
      lastname: "",
      email:"",
      password: ""
    });
    const navigate = useNavigate(); 
    const handleChange = (e)=>{
      e.preventDefault();
      setFormData({
        ...formData, [e.target.name]: e.target.value,
      });
  }



const { setUser } = useContext(UserContext);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data.user); // ✅ save to context
      navigate("/profile");
    } else {
      console.log("Signup failed:", data);
    }

  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
          <Navbar />
    <div className="flex flex-col justify-center items-center min-h-screen gap-10 font-[Orbitron] border border-t-4 border-b-4 py-10">
      <div className="flex flex-col justify-center items-center ">
        <Title title={'Formulaire CNOA'}/>
      </div>
      <div className="w-full max-w-md bg-gradient-to-br from-[#334A4F] to-[#5b8b96] backdrop-blur-md border-[2px] border-yellow-500/40 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8 tracking-wide">
          Remplir le Formulaire
        </h2>

        <form  className="space-y-4" onSubmit={handleSubmit}>
          <input
          onChange={handleChange}
            type="text"
            placeholder="Nom.."
            name="name"
            className="w-full p-3 bg-[#334A4F]/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
          <input
          onChange={handleChange}
            type="text"
            placeholder="Prénom.."
            name="lastname"
            className="w-full p-3 bg-[#334A4F]/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
          <input
            type="date"
            name="dateOfBirth"
            className="w-full p-3 bg-[#334A4F]/60 text-white/50 placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="E-mail.."
            className="w-full p-3 bg-[#334A4F]/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Mod de Passe.."
            className="w-full p-3 bg-[#334A4F]/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
          <input
            type="password"
            placeholder="Confirmez votre Mot de passe.."
            className="w-full p-3 bg-[#334A4F]/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-yellow-400 border-2 border-yellow-400 rounded-md bg-transparent hover:bg-yellow-400 hover:text-blue-950 transition-all duration-300"
          >
              Envoyer
          </button>
        </form>
      </div>
      <div className="text-center">
        
        By continuing, you agree to our Terms and Privacy Policy. <br /> 
        Already have an account? <a href="/">Log In</a>
    </div>
    </div> 
    </>
  );
};

