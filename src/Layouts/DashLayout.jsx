// Layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import SideBar from "../Components/Navbar/SideBar";
import AdminHeader from "../Components/Navbar/AdminHeader";
export default function DashLayout() {
  return (
    <>
     <AdminHeader />
      <SideBar /> {/* admin sidebar */}
      <main className="ml-[220px] min-h-screen">
        <Outlet />
      </main>
    </>
  );
}
