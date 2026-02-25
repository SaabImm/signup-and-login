import { useContext, useState, useEffect } from "react";
import { UserContext } from "../Context/dataCont";
import Title from "../Components/Title";
import FileCard from "../Components/Cards/FileCrad";
import AddFileCard from "../Components/Cards/AddFileCard";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const { authData, setAuthData } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();


  const [displayUser, setDisplayUser] = useState(authData.user);

  useEffect(() => {
    if (authData?.user) {
      setDisplayUser(authData.user);
    }
  }, [authData?.user]);

  const user = displayUser;

  const [isUploading, setIsUploading] = useState(false);
  const [popup, setPopup] = useState(null);

  const handlePopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };


  const onboardingFiles =
    (displayUser?.files || []).filter(f => f.folder === "onboarding");

  const pdfFile = onboardingFiles.find(
    f => f.type === "pdf"
  );

  const imageFile = onboardingFiles.find(
    f => f.type === "jpg"
  );
  console.log(imageFile)
  const isComplete = !!pdfFile && !!imageFile;

  const progress =
    (pdfFile ? 50 : 0) + (imageFile ? 50 : 0);

  /* -------------------- UPLOAD HANDLERS -------------------- */

  const handleUpload = async (file) => {
    try {
      setIsUploading(true);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "onboarding");

      const res = await fetch(`${API_URL}/upload/${user._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) return handlePopup("error", data.message);

      // 🔥 update BOTH states
      setAuthData(prev => ({
        ...prev,
        user: data.user,
      }));

      setDisplayUser(data.user);

      handlePopup("success", "File uploaded ✅");
    } catch {
      handlePopup("error", "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplace = async (file, newFile) => {
    try {
      setIsUploading(true);

      const fd = new FormData();
      fd.append("file", newFile);
      fd.append("folder", "onboarding");

      const res = await fetch(`${API_URL}/upload/${file._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) return handlePopup("error", data.message);

      setAuthData(prev => ({
        ...prev,
        user: data.user,
      }));

      setDisplayUser(data.user);

      handlePopup("success", "File replaced ✅");
    } catch {
      handlePopup("error", "Replace failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file) => {
    try {
      setIsUploading(true);

      const res = await fetch(`${API_URL}/upload/${file._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return handlePopup("error", data.message);

      setAuthData(prev => ({
        ...prev,
        user: data.user,
      }));

      setDisplayUser(data.user);

      handlePopup("success", "File deleted ✅");
    } catch {
      handlePopup("error", "Delete failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------- NAVIGATION -------------------- */

  const handleNext = () => {
    if (!isComplete) {
      handlePopup("error", "Please upload 1 PDF and 1 image");
      return;
    }
    navigate("/auth/profile");
  };

  /* -------------------- RENDER -------------------- */

  return (
    <>

      <div className="min-h-screen bg-gray-900 flex flex-col items-center pt-24 pb-16">

        {isUploading && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className={`px-6 py-3 rounded-lg border text-sm
                ${popup.type === "error"
                  ? "bg-red-500/20 text-red-300 border-red-400/40"
                  : "bg-green-500/20 text-green-300 border-green-400/40"}`}
            >
              {popup.message}
            </div>
          </div>
        )}

        <div className="w-3/4 max-w-4xl bg-gray-800/80 backdrop-blur-xl border border-yellow-400/20 rounded-2xl shadow-xl p-10">

          <div className="text-center mb-8">
            <Title title="Complete Your Onboarding" textColor="text-yellow-300" />
            <p className="text-gray-400 mt-2">
              Upload the required documents to continue
              <br />
              <span className="font-semibold text-gray-200">
                1 PDF + 1 Image
              </span>
            </p>

            <div className="mt-6 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            {pdfFile ? (
              <FileCard
                file={pdfFile}
                handleDelete={handleDelete}
                handleReplace={handleReplace}
                small
              />
            ) : (
              <AddFileCard
                onUpload={handleUpload}
                accept="application/pdf"
                label="Upload PDF"
                small
              />
            )}

            {imageFile ? (
              <FileCard
                file={imageFile}
                handleDelete={handleDelete}
                handleReplace={handleReplace}
                small
              />
            ) : (
              <AddFileCard
                onUpload={handleUpload}
                accept="image/*"
                label="Upload Image"
                small
              />
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleNext}
              disabled={!isComplete}
              className={`px-6 py-2 rounded-md font-semibold transition
                ${isComplete
                  ? "bg-yellow-300 text-black hover:bg-yellow-400"
                  : "bg-yellow-300/50 text-black cursor-not-allowed"}`}
            >
              {isComplete
                ? "Next → Profile"
                : "Upload required files to continue"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
