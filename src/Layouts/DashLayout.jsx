import { Outlet } from "react-router-dom";
import SideBar from "../Components/Navbar/HorizentalNav"

export default function AuthLayout() {
  return (
    <>
      <SideBar/>
      <main className="min-h-screen">
        <Outlet /> 
      </main>
      
    </>
  );
}
