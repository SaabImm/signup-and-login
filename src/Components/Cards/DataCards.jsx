import { useState } from "react";
import { Link } from "react-router-dom";
export default function DataCards({ userItem }) {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div
      className="relative bg-gray-900/50 backdrop-blur-md text-yellow-300 rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      {/* Card content */}
      <div className={`${active ? "blur-sm" : ""} transition-all duration-300`}>
        <h3 className="text-xl font-semibold">{userItem.name} {userItem.lastname}</h3>
        <p className="text-gray-300">{userItem.email}</p>
        <p className="text-gray-400">Role: {userItem.role}</p>
      </div>

      {/* Action overlay */}
      {active && (
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-black/40 rounded-xl transition-opacity">
          <Link to={`/dash/adminUser/${userItem._id}`}>
          <button className="basis-1 px-8 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-black/30">
             Edit 
          </button>
          </Link>
          <Link to={`/dash/delete/${userItem._id}`}>
          <button className="basis-1 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-black/30">
            Delete
          </button>
          </Link>
        </div>
      )}
    </div>
  );
}
