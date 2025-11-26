import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../../Context/dataCont";
import { UserDataContext } from "../../../Context/userDataCont";
import Title from "../../../Components/Title";
import { DayPicker } from "react-day-picker";
import { useParams } from "react-router-dom";
import sabAvatar from '../../../assets/SabrinaAvatar.jpg'
import "react-day-picker/dist/style.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UpdateUser() {
  const { authData, setAuthData } = useContext(UserContext);
  const { data } = useContext(UserDataContext);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const authId = authData?.user?.id || authData?.user?._id;
  const isOwner = authId === id;

  const UPDATE_URL = isOwner ? `${API_URL}/user/me` : `${API_URL}/user`;
  const PROFILE_URL = authData.user ? `${API_URL}${authData.user?.profilePicture}` : sabAvatar;

  useEffect(() => {
    setIsAdmin(authData?.user?.role === "admin");
  }, [authData]);

  const [message, setMessage] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const blankForm = {
    name: "",
    lastname: "",
    email: "",
    role: "user",
    dateOfBirth: null,
    password: "",
  };

  const [formData, setFormData] = useState(blankForm);
  const calendarRef = useRef();

  useEffect(() => {
    if (!authData?.user && !data?.users) return;

    const targetUser = isOwner
      ? authData.user
      : data.users?.find((u) => String(u._id) === String(id));

    if (!targetUser) return;

    setFormData({
      name: targetUser.name || "",
      lastname: targetUser.lastname || "",
      email: targetUser.email || "",
      role: targetUser.role || "user",
      dateOfBirth: targetUser.dateOfBirth
        ? new Date(targetUser.dateOfBirth)
        : null,
      password: "",
    });
  }, [authData, data, isOwner, id]);

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
    setShowCalendar(false);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      for (let key in formData) {
        if (key !== "password" && formData[key] !== null && formData[key] !== "")
          formDataToSend.append(key, formData[key]);
      }

      if (formData.password)
        formDataToSend.append("password", formData.password);

      if (selectedFile)
        formDataToSend.append("file", selectedFile);

      const response = await fetch(`${UPDATE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
        method: "PATCH",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        if (isOwner) setAuthData(data);

        if (!data.user.isVerified) {
          setIsPending(true);
          setMessage("✉️ Your email was changed. Please verify it.");
        } else {
          setFormData(blankForm);
          setMessage("✅ Profile updated successfully!");
          setIsPending(false);
        }
      } else {
        setMessage(data.message || "❌ Update failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-10 font-urbanist bg-gray-900">

      <div className="mb-8 text-center">
        <Title
          title={isOwner ? "Modifier Votre Profil" : "Modifier l'utilisateur"}
          className="text-yellow-300"
        />
      </div>

      {/* FORM PANEL */}
      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl rounded-2xl 
                      border border-yellow-300/20 shadow-xl p-8">

        {/* PROFILE PIC */}
        {isOwner && (
          <div className="flex justify-center mb-6">
            <label htmlFor="file">
              <img
                src={PROFILE_URL}
                alt="Profile"
                className="w-40 h-40 object-cover rounded-full 
                           border-4 border-yellow-300/40 shadow-[0_0_20px_rgba(255,200,80,0.2)]
                           cursor-pointer hover:opacity-90 transition"
              />
            </label>
            <input type="file" id="file" onChange={handleUpload} className="hidden" />
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* INPUT TEMPLATE */}
          {[
            { name: "name", placeholder: "Nom" },
            { name: "lastname", placeholder: "Prénom" },
            { name: "email", placeholder: "E-mail", type: "email" }
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 
                       border-yellow-300/30 focus:border-yellow-300 
                       text-yellow-200 placeholder-yellow-300/40
                       outline-none py-2 transition"
            />
          ))}

          {/* DATE PICKER */}
          <div className="relative">
            <input
              type="text"
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
              value={
                formData.dateOfBirth
                  ? formData.dateOfBirth.toLocaleDateString()
                  : ""
              }
              placeholder="Date de naissance"
              className="w-full bg-transparent border-b-2 
                         border-yellow-300/30 focus:border-yellow-300 
                         text-yellow-200 placeholder-yellow-300/40
                         outline-none py-2 cursor-pointer transition"
            />

            {showCalendar && (
              <div className="absolute z-50 mt-2 bg-gray-900 rounded-xl p-3 
                              shadow-xl border border-yellow-300/20">
                <DayPicker
                  mode="single"
                  selected={formData.dateOfBirth}
                  onSelect={handleDateSelect}
                  disabled={{ after: new Date() }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  captionLayout="dropdown"
                  className="text-yellow-200"
                />
              </div>
            )}
          </div>

          {/* ROLE */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={!isAdmin}
            className="w-full bg-transparent border-b-2 
                       border-yellow-300/30 focus:border-yellow-300 
                       text-yellow-200 outline-none py-2 transition"
          >
            <option className="text-gray-900" value="user">User</option>
            <option className="text-gray-900" value="admin">Admin</option>
          </select>

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Mot de passe actuel"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 
                       border-yellow-300/30 focus:border-yellow-300 
                       text-yellow-200 placeholder-yellow-300/40
                       outline-none py-2 transition"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || isPending}
            className={`
              w-full py-3 rounded-lg font-semibold
              transition-all duration-300
              shadow-[0_0_10px_rgba(255,200,80,0.4)]
              ${
                isPending
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : loading
                  ? "bg-yellow-300/60 text-gray-900 cursor-not-allowed"
                  : "bg-yellow-300 text-gray-900 hover:bg-yellow-200"
              }
            `}
          >
            {loading && !isPending && (
              <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin inline-block mr-2" />
            )}

            {isPending ? "En attente de vérification…" :
             loading ? "Sauvegarde…" :
             "Enregistrer"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-yellow-300 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
