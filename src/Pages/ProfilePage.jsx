import Title from '../Components/Title';
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../Context/dataCont";
import Navbar from '../Components/Navbar/Navbar';
import sabAvatar from '../assets/SabrinaAvatar.jpg';
import FileCard from '../Components/Cards/FileCrad';
import AddFileCard from '../Components/Cards/AddFileCard';

export default function ProfilePage({ user }) {
  const { authData, setAuthData } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const owner = user || authData.user;
  const [displayUser, setDisplayUser] = useState(owner);
  const [popup, setPopup] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const isOwner = authData.user === displayUser;

  useEffect(() => {
    if (user) setDisplayUser(user);
    else if (authData?.user) setDisplayUser(authData.user);
  }, [user, authData?.user]);

  const PROFILE_URL = displayUser?.profilePicture || sabAvatar;
  const files = displayUser?.files || [];

  const roleColors = {
    admin: "bg-red-200/20 text-red-300 border-red-400/40",
    user: "bg-blue-200/20 text-blue-300 border-blue-400/40",
    moderator: "bg-purple-200/20 text-purple-300 border-purple-400/40",
  };

  const verificationTag = displayUser?.isAdminVerified
    ? "bg-slate-200/20 text-slate-100 border-slate-300/30"
    : "bg-yellow-400/20 text-yellow-300 border-yellow-400/40";

  const verificationText = displayUser?.isAdminVerified ? "Validated" : "Pending Validation";

  // --- Handlers ---

  const handlePopup = (type, message, duration = 3000) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), duration);
  };

  const handleUpload = async (file) => {
    try {
      setIsUploading(true);

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "uploads");

      const response = await fetch(`${API_URL}/upload/${displayUser._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authData.token}` },
        body: uploadData,
      });

      const data = await response.json();

      if (response.status === 413) {
        handlePopup("error", data.message || "File is too large");
        return;
      }

      if (!response.ok) {
        handlePopup("error", data.message || "Upload failed");
        return;
      }

      if (isOwner) setAuthData(prev => ({ token: data.token || prev.token, user: data.user || prev.user }));
      else setDisplayUser(data.user);

      handlePopup("success", "File uploaded successfully ✅");

    } catch (err) {
      console.error(err);
      handlePopup("error", "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplace = async (file, newFile) => {
    try {
      setIsUploading(true);

      const uploadData = new FormData();
      uploadData.append("file", newFile);
      uploadData.append("folder", "uploads");

      const response = await fetch(`${API_URL}/upload/${file._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authData.token}` },
        body: uploadData,
      });

      const data = await response.json();

      if (response.status === 413) {
        handlePopup("error", data.message || "File is too large");
        return;
      }

      if (!response.ok) {
        handlePopup("error", data.message || "Replace failed");
        return;
      }

      if (isOwner) setAuthData(prev => ({ token: data.token || prev.token, user: data.user || prev.user }));
      else setDisplayUser(data.user);

      handlePopup("success", "File replaced successfully ✅");

    } catch (err) {
      console.error(err);
      handlePopup("error", "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file) => {
    try {
      setIsUploading(true);

      const response = await fetch(`${API_URL}/upload/${file._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authData.token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        handlePopup("error", data.message || "Delete failed");
        return;
      }

      if (isOwner) setAuthData(prev => ({ token: data.token || prev.token, user: data.user || prev.user }));
      else setDisplayUser(data.user);

      handlePopup("success", "File deleted successfully ✅");

    } catch (err) {
      console.error(err);
      handlePopup("error", "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- JSX ---

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pb-16 relative">

        {/* --- Spinner Overlay --- */}
        {isUploading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* --- Centered Popup --- */}
        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className={`px-6 py-4 rounded-lg shadow-xl border text-sm font-medium pointer-events-auto
              transform transition-all duration-300
              ${popup.type === "error"
                ? "bg-red-500/20 text-red-300 border-red-400/40"
                : "bg-green-500/20 text-green-300 border-green-400/40"}`}>
              {popup.message}
            </div>
          </div>
        )}

        {/* --- GOLD COVER --- */}
        <div className="h-40 bg-yellow-400/80 shadow-md"></div>

        {/* --- PROFILE CARD --- */}
        <div className="w-3/4 mx-auto -mt-20 bg-gray-800/80 backdrop-blur-xl 
                        border border-yellow-400/30 rounded-xl shadow-xl p-10 flex gap-10 items-center relative">

          {/* Avatar */}
          {displayUser?.profilePicture && (
            <img
              src={PROFILE_URL}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-yellow-300 shadow-[0_0_20px_rgba(255,215,100,0.4)]"
            />
          )}

          {/* User main info */}
          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-semibold text-white tracking-tight">
              {displayUser?.name} {displayUser?.lastname}
            </h2>

            <p className="text-gray-300 text-lg">{displayUser?.email}</p>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Role Badge */}
              <span
                className={`px-3 py-1 rounded-full border text-sm font-medium 
                  ${roleColors[displayUser?.role] || "bg-yellow-300/20 text-yellow-300 border-yellow-400/40"}`}>
                {displayUser?.role.toUpperCase()}
              </span>

              {/* Verification Badge */}
              <span
                className={`px-3 py-1 rounded-full border text-sm font-medium ${verificationTag}`}>
                {verificationText}
              </span>
            </div>
          </div>

          {/* Optional Admin Tag */}
          {displayUser?.role === "admin" && (
            <div className="absolute top-6 right-6 bg-yellow-300/10 px-4 py-1 rounded-full text-sm shadow-md text-yellow-200 border border-yellow-300/20">
              ADMIN ACCESS
            </div>
          )}
        </div>

        {/* --- PERSONAL DETAILS CARD --- */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl 
                        rounded-xl shadow-xl border border-yellow-400/20 p-10">

          <div className="flex justify-between items-center mb-6">
            <Title title="Personal Details" textColor="text-yellow-300" />
          </div>

          <div className="grid grid-cols-2 gap-8 text-gray-200">
            <DetailBox label="Name" value={displayUser?.name} />
            <DetailBox label="Last Name" value={displayUser?.lastname} />
            <DetailBox label="Role" value={displayUser?.role} />
            <DetailBox label="Email" value={displayUser?.email} />
          </div>
        </div>

        {/* --- FILES --- */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl 
                        rounded-xl shadow-xl border border-yellow-400/20 p-10">

          <div className="flex justify-between items-center mb-6">
            <Title title="Files" textColor="text-yellow-300" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {files
              .filter(file => file.folder === "uploads")
              .map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  handleDelete={handleDelete}
                  handleReplace={handleReplace}
                />
            ))}

            <AddFileCard onUpload={handleUpload} />
          </div>
        </div>
      </div>
    </>
  );
}

// --- DetailBox Component ---
function DetailBox({ label, value }) {
  return (
    <div className="p-4 rounded-lg bg-gray-900/40 border border-yellow-400/10">
      <p className="text-yellow-300 text-sm font-medium">{label}</p>
      <p className="text-gray-300 mt-1">{value}</p>
    </div>
  );
}
