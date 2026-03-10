import { useEffect, useContext, useMemo } from "react";
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
        const response = await fetch(`${API_URL}/admin/allUsers`, {
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
  }, [authData.token, setData]);

  // Construction des cartes en fonction du rôle
  const cards = useMemo(() => {
    const baseCards = [
      { title: "Membres", onClick: () => navigate("/dash/allMembers") },
      { title: "Cotisations", onClick: () => navigate("/dash/allCotisations") },
    ];

    // La carte "Utilisateurs" n'est visible que pour les super admins
    if (authData?.user?.role === 'super_admin') {
      return [
        { title: "Utilisateurs", onClick: () => navigate("/dash/allUsers") },
        ...baseCards
      ];
    }
    return baseCards;
  }, [authData?.user?.role, navigate]);

  return (
    <div className="ml-[50px] p-10 min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 font-urbanist">
      <div className="mb-12">
        <SectionTitle title="Tableau de bord Admin" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="bg-gray-900 text-yellow-300 p-6 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            {/* Vous pouvez ajouter des compteurs ici plus tard */}
          </div>
        ))}
      </div>

      <div className="mt-10 text-yellow-300">
        {/* Additional dashboard info can go here */}
      </div>
    </div>
  );
}