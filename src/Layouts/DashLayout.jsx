// Layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import SideBar from "../Components/Navbar/HorizentalNav";

export default function DashLayout() {
  return (
    <>
      <SideBar /> {/* admin sidebar */}
      <main className="ml-[220px] min-h-screen">
        <Outlet />
      </main>
    </>
  );
}
