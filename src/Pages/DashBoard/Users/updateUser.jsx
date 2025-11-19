import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../../Context/dataCont";
import Title from "../../../Components/Title";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
const API_URL = import.meta.env.VITE_API_URL;
export default function UpdateUser() {

  const { authData, setAuthData } = useContext(UserContext);
  const id = authData?.user?._id || authData?.user?.id;
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
  if (authData?.user?.role === "admin") {
    setIsAdmin(true);
  } else {
    setIsAdmin(false);
  }
}, [authData])
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
    if (authData?.user) {
      setFormData({
        name: authData.user.name || "",
        lastname: authData.user.lastname || "",
        email: authData.user.email || "",
        role: authData.user.role || "user",
        dateOfBirth: authData.user.dateOfBirth
          ? new Date(authData.user.dateOfBirth)
          : null,
        password: "",
      });
    }
  }, [authData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
    setShowCalendar(false);
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify({
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth.toISOString()
          : null,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setAuthData(data); 
      if (!data.user.isVerified) {
        // Email changed → pending verification
        setIsPending(true);
        setMessage(
          "✉️ Your email was changed. Please verify it from your inbox."
        );
      } else {
        // Normal update
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
  }
};


  return (
    <div className="flex flex-col justify-center items-center min-h-screen ml-[200px] py-10 font-urbanist">
      <div className="mb-8 text-center">
        <Title title={"Modifier l'utilisateur"} />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Modifier vos informations
        </h2>

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
                    fromYear={1900} // earliest year selectable
                    toYear={new Date().getFullYear()} // latest year selectable
                    captionLayout="dropdown" // shows month + year dropdowns
                    className="text-sm [&_button]:px-1 [&_button]:py-0.5 [&_day]:w-6 [&_day]:h-6 [&_day]:text-sm [&_month]:bg-white/10 [&_month]:rounded-md"
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
              disabled={isPending} // disables button while verification is pending
              className={`w-full py-3 font-semibold rounded-lg transition-colors
                ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            >
              {isPending ? "Pending Verification..." : "Enregistrer"}
            </button>

        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
