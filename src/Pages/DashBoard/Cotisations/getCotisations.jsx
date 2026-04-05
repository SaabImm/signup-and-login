import { useContext, useEffect, useState } from "react";
import { CotisationContext } from '../../../Context/CotisationContext';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { SearchBarContext } from "../../../Context/searchContext";
import { IoSearchOutline } from "react-icons/io5";
import { fetchWithRefresh } from '../../../Components/api';
import CotisationCard from '../../../Components/Cards/CotisationCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function GetCotisations() {
  const { data, setData } = useContext(CotisationContext);
  const { authData, setAuthData } = useContext(UserContext);
  const { keyWord, handleChange } = useContext(SearchBarContext);

  // État pour les filtres supplémentaires
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [selectedFeeType, setselectedFeeType] = useState("all");

  // Récupérer les années uniques pour le filtre
  const years = data?.cotisations
    ? [...new Set(data.cotisations.map(c => c.year))].sort((a, b) => b - a)
    : [];

  // Fonction de rafraîchissement des données
  const refreshCotisations = async () => {
    if (!authData?.token) return;
    try {
      const response = await fetchWithRefresh(
        `${API_URL}/fee/`,
        { method: "GET" },
        authData.token,
        setAuthData
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erreur lors du chargement des cotisations :", error);
    }
  };

  useEffect(() => {
    refreshCotisations();
  }, [authData.token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Champs sur lesquels on peut rechercher
  const searchableFields = ["year", "status", "amount", "paymentMethod", "feeType"];

  // Filtrage combiné
  const displayedCotisations = data?.cotisations?.filter((cot) => {

    const matchesSearch = searchableFields.some((field) =>
      String(cot[field] || "").toLowerCase().includes(keyWord.toLowerCase())
    );
    if (!matchesSearch) return false;

    if (selectedStatus !== "all" && cot.status !== selectedStatus) return false;
    if (selectedFeeType !== "all" && cot.feeType !== selectedFeeType) return false;
    if (selectedYear !== "all" && cot.year !== parseInt(selectedYear)) return false;

    if (selectedPaymentMethod !== "all") {
      const method = cot.paymentMethod || "null";
      if (selectedPaymentMethod === "null" && cot.paymentMethod !== null) return false;
      if (selectedPaymentMethod !== "null" && cot.paymentMethod !== selectedPaymentMethod) return false;
    }
    return true;
  }) || [];

  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedYear("all");
    setSelectedPaymentMethod("all");
    setselectedFeeType("all");
    handleChange({ target: { name: "search", value: "" } });
  };

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">

      <Title title="Gestion des cotisations" />

      <div className="relative mb-6 mt-4 flex flex-wrap items-center gap-3">
        <IoSearchOutline size={22} className="text-yellow-300" />
        <input
          type="text"
          name="search"
          onChange={handleChange}
          value={keyWord}
          placeholder="Rechercher par année, statut, montant..."
          className="w-64 px-4 py-2 rounded-xl outline-none text-yellow-300 placeholder-yellow-200/40
                     bg-gray-900/40 backdrop-blur-md border border-gray-700/40 shadow-lg shadow-black/30 transition-all animate-fadeIn"
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900/40 backdrop-blur-md text-yellow-300 border border-gray-700/40 shadow-lg outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="paid">Payée</option>
          <option value="partial">Partiel</option>
          <option value="overdue">En retard</option>
          <option value="cancelled">Annulée</option>
        </select>

          <select
          value={selectedFeeType}
          onChange={(e) => setselectedFeeType(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900/40 backdrop-blur-md text-yellow-300 border border-gray-700/40 shadow-lg outline-none"
        >
          <option value="all">Tous les types</option>
          <option value="annual">Anuelle</option>
          <option value="event">Evenement</option>
          <option value="training">Formation</option>
          <option value="exceptional">Exceptionelle</option>
          <option value="other">Autre</option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900/40 backdrop-blur-md text-yellow-300 border border-gray-700/40 shadow-lg outline-none"
        >
          <option value="all">Toutes les années</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900/40 backdrop-blur-md text-yellow-300 border border-gray-700/40 shadow-lg outline-none"
        >
          <option value="all">Tous les modes</option>
          <option value="cash">Espèces</option>
          <option value="bank_transfer">Virement</option>
          <option value="check">Chèque</option>
          <option value="online">En ligne</option>
          <option value="other">Autre</option>
          <option value="null">Non renseigné</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
        >
          Réinitialiser
        </button>
      </div>

      <p className="mb-4 text-gray-400">
        {displayedCotisations.length} cotisation(s) trouvée(s)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCotisations.map((cot) => (
          <CotisationCard
            key={cot._id}
            cotisation={cot}
            onCotisationUpdated={refreshCotisations} // ← callback de rafraîchissement
          />
        ))}
      </div>
    </div>
  );
}