import { useState, useContext } from "react";
import Title from "../../../Components/Title";
import { UserContext } from "../../../Context/dataCont";
const API_URL = import.meta.env.VITE_API_URL;

export default function UpdateUser() {
    const { authData } = useContext(UserContext);
    const id = authData?.user?.id || authData?.user?._id;
    const [message, setMessage] = useState("");
    const initialFormData= {
        name: authData.user.name,
        lastname: authData.user.lastname,
        email: authData.user.email,
        role: authData.user.role,
        dateOfBirth: "",
        password:""
    }
    const [formData, setFormData] = useState(initialFormData);
    const handleChange = (e) => {
        setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

     const handleSubmit = async (e) => {
        e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: formData.name
})
 }); 

      const data = await response.json()
      if(response.ok){
       setFormData(initialFormData)

      }
      
      setMessage(data.message)

    }
        catch {
      console.error("An error occurred during creation.");
    }
    } 
    return(
        <>
        <div className="flex flex-col justify-center items-center min-h-screen ml-[200px] gap-10 font-urbanist border-l-4 py-10">
            <div className="flex flex-col justify-center items-center ">
                <Title title={'Creer un nouvel utilisateur'}/>
            </div>
            <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400  rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8 tracking-wide">
                Remplir le Formulaire
                </h2>

                <form  className="space-y-4" onSubmit={handleSubmit}>
                <input
                onChange={handleChange}
                    type="text"
                    value={formData.name}
                    placeholder="Nom.."
                    name="name"
                    className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
                <input
                onChange={handleChange}
                    type="text"
                    value={formData.lastname}
                    placeholder="Prénom.."
                    name="lastname"
                    className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
                <input
                    onChange={handleChange}
                    type="date"
                    name="dateOfBirth"
                    min="1900-01-01"
                    className="w-full p-3 bg-gray-900/60 text-white/50 placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
                <input
                    onChange={handleChange}
                    type="email"
                    value={formData.email}
                    name="email"
                    placeholder="E-mail.."
                    className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900/60 text-white placeholder-gray-400 border border-yellow-500/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="Confirmez votre Mot de passe"
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
            <div className="errorM text-red-500 ">     
                {message && (
                <p className="text-green-400 text-center mt-4">
                    {message}
                </p>
                )}
            </div>
            </div>   
        </>
    )
}