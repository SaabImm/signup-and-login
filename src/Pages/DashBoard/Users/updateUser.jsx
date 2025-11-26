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
  const authId= authData?.user?.id || authData?.user?._id
  const isOwner = authId  === id;
  console.log(isOwner)

  const UPDATE_URL = isOwner
    ? `${API_URL}/user/me`
    : `${API_URL}/user`;
  const PROFILE_URL = authData.user?`${API_URL}${authData.user?.profilePicture}` : sabAvatar;
  useEffect(() => {
    if (authData?.user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
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
    password: ""
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
      password: ""
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

  // file input handler
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      for (let key in formData) {
        if (key !== "password") {
          if (formData[key] !== null && formData[key] !== "") {
            formDataToSend.append(key, formData[key]);
          }
        }
      }

      if (formData.password)
        formDataToSend.append("password", formData.password);

      if (selectedFile)
        formDataToSend.append("file", selectedFile);

      const response = await fetch(`${UPDATE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        method: "PATCH",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        if (isOwner) setAuthData(data);

        if (!data.user.isVerified) {
          setIsPending(true);
          setMessage(
            "✉️ Your email was changed. Please verify it from your inbox."
          );
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
      setMessage("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen ml-[200px] py-10 font-urbanist">
      <div className="mb-8 text-center">
        <Title
          title={
            isOwner
              ? "Modifier Votre Profil"
              : "Modifier l'utilisateur"
          }
        />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
              
        {/* PROFILE PICTURE */}
        <div className={`flex justify-center mb-6 ${isOwner ? "" : "hidden"}`}>
          <label htmlFor="file">
            <img
              src={PROFILE_URL}
              alt="Profile"
              loading="lazy"
              className="w-40 h-40 object-cover rounded-full border-4 border-gray-300 shadow cursor-pointer hover:opacity-90"
            />
          </label>
          <input 
            type="file" 
            name="file" 
            id="file" 
            onChange={handleUpload}
            className="hidden"/>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 transition-colors placeholder-gray-400"
          />

          <input
            type="text"
            name="lastname"
            placeholder="Prénom"
            value={formData.lastname || ""}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 transition-colors placeholder-gray-400"
          />

          {/* Modern calendar input */}
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
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 transition-colors placeholder-gray-400 cursor-pointer"
            />

            {showCalendar && (
              <div
                ref={calendarRef}
                className="absolute z-50 mt-1 bg-white/20 backdrop-blur-md shadow-lg rounded-lg p-2"
              >
                <DayPicker
                  mode="single"
                  selected={formData.dateOfBirth}
                  onSelect={handleDateSelect}
                  disabled={{ after: new Date() }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  captionLayout="dropdown"
                  className="text-sm 
                    [&_button]:px-1 [&_button]:py-0.5 
                    [&_day]:w-6 [&_day]:h-6 [&_day]:text-sm 
                    [&_month]:bg-white/10 [&_month]:rounded-md"
                />
              </div>
            )}
          </div>

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 transition-colors placeholder-gray-400"
          />

          <select
            name="role"
            value={formData.role || "user"}
            onChange={handleChange}
            disabled={!isAdmin}
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 bg-transparent text-gray-700 transition-colors"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Mot de passe actuel"
            value={formData.password || ""}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 transition-colors placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading || isPending}
            className={`
              w-full py-3 font-semibold rounded-lg flex items-center justify-center gap-2
              transition-all duration-300
              ${
                isPending
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : loading
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
              }
            `}
          >
            {loading && !isPending && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}

            {isPending
              ? "Pending Verification..."
              : loading
              ? "Saving..."
              : "Enregistrer"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
