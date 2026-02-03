import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar"; // normal top nav

export default function AuthLayout() {
  return (
    <>
      <Navbar />  {/* top navigation */}
      <main className="min-h-screen">
        <Outlet /> {/* nested pages: profile, reset password, onboarding */}
      </main>
    </>
  );
}
