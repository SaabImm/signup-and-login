import { useEffect, useState, useContext } from "react";
import { useSearchParams , useNavigate } from "react-router-dom";
import { UserContext } from "../Context/dataCont";



export default function VerifyPage() {
  const API_URL = import.meta.env.VITE_API_URL;
    const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your email...");
  const { setAuthData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
            console.log("🔍 API_URL:", API_URL);
            console.log("🔍 TOKEN:", token);
            console.log("🔍 FULL VERIFY URL:", `${API_URL}/auth/verify?token=${token}`);
        const response = await fetch(`${API_URL}/auth/verify?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.log("✅ RESPONSE STATUS:", response.status);
        const data = await response.json();
        console.log("✅ RESPONSE DATA:", data);
        
        if (response.ok) {
          // ✅ Save user and token in context
          setAuthData({
            user: data.user,
            token: data.token
          });

          setMessage("✅ Email verified! Redirecting to your profile...");
          
          // Wait a moment for UX, then navigate
          setTimeout(() => navigate("/profile"), 1500);
        } else {
          setMessage(data.message || "❌ Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("⚠️ Verification failed. The link may be invalid or expired.");
      }
    };

    verifyUser();
  }, [token, navigate, setAuthData]);

  return (
        <div className='PendingContainer min-h-screen flex items-center justify-center '>
          <div className=" flex items-center flex-col justify-center m-auto gap-5 p-20 w-1/2 text-lg font-[Montserrat] rounded-2xl shadow-2xl text-center">
          <Title title={message}/>
          </div>
        </div>
  );
}
