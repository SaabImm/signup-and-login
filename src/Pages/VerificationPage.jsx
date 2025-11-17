import { useEffect, useState, useContext } from "react";
import { useSearchParams , useNavigate } from "react-router-dom";
import { UserContext } from "../Context/dataCont";
import Title from '../Components/Title'


export default function VerifyPage() {
  const API_URL = import.meta.env.VITE_API_URL;
    const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();        
        if (response.ok) {
          // ✅ Save user and token in context
          console.log('data is set successfully')
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
  }, [token, navigate]);

  return (
        <div className='PendingContainer min-h-screen flex items-center justify-center '>
          <div className=" flex items-center flex-col justify-center m-auto gap-5 p-20 w-1/2 text-lg font-[Montserrat] rounded-2xl shadow-2xl text-center">
          <Title title={message}/>
          </div>
        </div>
  );
}
