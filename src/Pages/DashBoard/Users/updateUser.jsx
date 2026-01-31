import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../Context/dataCont";
import { UserDataContext } from "../../../Context/userDataCont";
import Title from "../../../Components/Title";
import { DayPicker } from "react-day-picker";
import { useParams } from "react-router-dom";
import sabAvatar from "../../../assets/SabrinaAvatar.jpg";
import "react-day-picker/dist/style.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UpdateUser() {
  const { authData, setAuthData } = useContext(UserContext);
  const { data } = useContext(UserDataContext);
  const { id } = useParams();

  const authId = authData?.user?.id || authData?.user?._id;
  const isOwner = authId === id;

  const UPDATE_URL = isOwner ? `${API_URL}/user/me` : `${API_URL}/user`;

  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfilePicker, setShowProfilePicker] = useState(false);

  useEffect(() => {
    setIsAdmin(authData?.user?.role === "admin");
  }, [authData]);

  const blankForm = {
    name: "",
    lastname: "",
    email: "",
    role: "user",
    profilePicture: "",
    dateOfBirth: null,
    password: "",
  };

  const [formData, setFormData] = useState(blankForm);

  const PROFILE_URL =
    formData.profilePicture ||
    authData?.user?.profilePicture ||
    sabAvatar;

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
      profilePicture: targetUser.profilePicture || "",
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

  // 🔒 SAME LOGIC AS BEFORE — untouched
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "profile");

    const response = await fetch(`${API_URL}/upload/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Upload failed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      profilePicture: data.file.url,
    }));

    setShowProfilePicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      role: formData.role,
      dateOfBirth: formData.dateOfBirth,
      profilePicture: formData.profilePicture,
      password: formData.password,
    };

    const response = await fetch(`${UPDATE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Update failed");
      setLoading(false);
      return;
    }

    if (isOwner) {
      setAuthData((prev) => ({
        token: data.token || prev.token,
        user: {
          ...prev.user,
          ...data.user,
          files: data.user.files ?? prev.user.files ?? [],
        },
      }));
    }

    setMessage("✅ Profile updated");
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-10 font-urbanist bg-gray-900">

      <div className="mb-8 text-center">
        <Title
          title={isOwner ? "Modifier Votre Profil" : "Modifier l'utilisateur"}
          className="text-yellow-300"
        />
      </div>

      {/* FORM PANEL — UNCHANGED */}
      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl rounded-2xl 
                      border border-yellow-300/20 shadow-xl p-8">

        {/* PROFILE PIC — ONLY THIS PART CHANGED */}
        {isOwner && (
          <div className="flex justify-center mb-6">
            <img
              src={PROFILE_URL}
              alt="Profile"
              onError={(e) => (e.currentTarget.src = sabAvatar)}
              onClick={() => setShowProfilePicker(true)}
              className="w-40 h-40 object-cover rounded-full 
                         border-4 border-yellow-300/40
                         shadow-[0_0_20px_rgba(255,200,80,0.2)]
                         cursor-pointer hover:opacity-90 transition"
            />
          </div>
        )}

        {/* FORM — 100% SAME */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            { name: "name", placeholder: "Nom" },
            { name: "lastname", placeholder: "Prénom" },
            { name: "email", placeholder: "E-mail", type: "email" },
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
                />
              </div>
            )}
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold
                       bg-yellow-300 text-gray-900 hover:bg-yellow-200"
          >
            {loading ? "Sauvegarde…" : "Enregistrer"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-yellow-300 font-medium">
            {message}
          </p>
        )}
      </div>

      {/* PROFILE PICTURE MODAL */}
      {showProfilePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg border border-yellow-300/20">

            <h3 className="text-yellow-300 text-center mb-4">
              Choisir une photo de profil
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {(authData?.user?.files || [])
                .filter((f) => f.folder === "profile")
                .map((file) => (
                  <img
                    key={file._id}
                    src={file.url}
                    alt="profile option"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        profilePicture: file.url,
                      }));
                      setShowProfilePicker(false);
                    }}
                    className="h-24 w-full object-cover rounded-lg
                               border border-yellow-300/20
                               hover:border-yellow-300 cursor-pointer"
                  />
                ))}

              <label
                htmlFor="file"
                className="flex items-center justify-center h-24
                           border-2 border-dashed border-yellow-300/30
                           text-yellow-300 cursor-pointer rounded-lg"
              >
                + Nouveau
              </label>
            </div>

            <input
              type="file"
              id="file"
              onChange={handleUpload}
              className="hidden"
            />

            <button
              onClick={() => setShowProfilePicker(false)}
              className="w-full py-2 bg-gray-700 text-gray-300 rounded-lg"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
