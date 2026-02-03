// Layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Outlet />
    </main>
  );
}
