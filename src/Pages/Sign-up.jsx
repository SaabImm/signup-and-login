import {React, useState, useContext, useEffect} from "react";
import Title from '../Components/Title'
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/dataCont";
const API_URL = import.meta.env.VITE_API_URL;

   export default function FormulaireCNOA() {
  const [message, setMessage] = useState("");
  const { setAuthData, authData } = useContext(UserContext);
  useEffect(() => {
  console.log("authData updated:", authData);
}, [authData]);
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const dd = String(today.getDate()).padStart(2, '0');
  const maxDate = `${yyyy}-${mm}-${dd}`;
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    role: "user",
    dateOfBirth: "",
    password: "",
    secondPassword:""
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if(formData.password!==formData.secondPassword){
        setMessage('Please make sure your passwords match.')
        return;
      }
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      })
      }); 

      const data = await response.json()
      setMessage(data.message)
      if (response.ok) {
          setAuthData({
        user: data.user,
        token: data.token, // make sure your backend returns this token
  });
      
      navigate("/auth/verify-pending");
    } else {
      console.error(data.message || "Signup error");
    }
    } catch (err) {
      console.error("An error occurred during signup.");
    }
  };

  return (
    <>
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
            onChange={handleChange}
            type="date"
            name="dateOfBirth"
            min="1900-01-01"
            max={maxDate}
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
           onChange={handleChange}
            type="password"
            name="secondPassword"
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
            <div className="errorM text-red-500 ">
        {message}      
      </div>
      <div className="text-center">
        
        By continuing, you agree to our Terms and Privacy Policy. <br /> 
        Already have an account? <a href="/">Log In</a>
    </div>
    </div> 
    </>
  );
};

