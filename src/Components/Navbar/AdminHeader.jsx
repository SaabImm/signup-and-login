import { useContext } from 'react';
import { UserContext } from '../../Context/dataCont';
import { logoutContext } from '../../Context/logoutContext';
import NotificationBell from '../NotificationBell/NotificationBell';

export default function AdminHeader() {
  const { authData } = useContext(UserContext);
  const { handleLogout } = useContext(logoutContext);

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex justify-between items-center ml-[300px]">
      {/* ml-[220px] matches sidebar width so header aligns with main content */}
      <div className="text-yellow-300 font-bold text-xl">Admin Dashboard</div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <span className="text-gray-300">{authData?.user?.name}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-gray-800 rounded hover:bg-yellow-400 hover:text-gray-900 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}