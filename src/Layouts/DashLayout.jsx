import { Outlet } from "react-router-dom";
import HorizentalDash from "../Components/Navbar/HorizentalNav"

export default function AuthLayout() {
  return (
    <>
      <HorizentalDash/>
      <main className="min-h-screen">
        <Outlet /> 
      </main>
      
    </>
  );
}
