import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../../Context/userDataCont';
import { UserContext } from '../../Context/dataCont';
import SectionTitle from '../../Components/Title';

export default function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { data, setData } = useContext(UserDataContext);
  const { authData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authData?.token) return;

    const getElements = async () => {
      try {
        const response = await fetch(`${API_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        });
        const results = await response.json();
        setData(results);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    getElements();
  }, [authData.token]);

  const cards = [
    { title: "Utilisateurs", count: data?.users?.length || 0, onClick: () => navigate("/dash/allUsers") },
    { title: "Produits", count: 0, onClick: () => navigate("/dash/produits") },
    { title: "Fichiers", count: 0, onClick: () => navigate("/dash/fichiers") },
  ];

  return (
    <div className="ml-[220px] p-10 min-h-screen bg-gray-800/80 backdrop-blur-xl font-urbanist">
      <SectionTitle title="Bienvenue dans le tableau de bord Admin" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="bg-gray-900 text-yellow-300 p-6 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-lg font-medium">{card.count}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-yellow-300">
        {/* Additional dashboard info can go here */}
      </div>
    </div>
  );
}
