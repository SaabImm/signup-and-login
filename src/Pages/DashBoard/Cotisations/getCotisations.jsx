import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/dataCont";
import Title from "../../../Components/Title";
import { SearchBarContext } from "../../../Context/searchContext";
import { IoSearchOutline } from "react-icons/io5";
import { fetchWithRefresh } from "../../../Components/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function GetCotisations() {
  const { authData, setAuthData } = useContext(UserContext);
  const { keyWord, handleChange } = useContext(SearchBarContext);

  const [definitions, setDefinitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDef, setEditingDef] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", dueDate: "", propagate: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fetch all fee definitions
  const fetchDefinitions = async () => {
    try {
      setLoading(true);
      const res = await fetchWithRefresh(
        `${API_URL}/fee/definitions`,
        { method: "GET" },
        authData.token,
        setAuthData
      );
      const data = await res.json();
      setDefinitions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des définitions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authData?.token) fetchDefinitions();
  }, [authData?.token]);

  // Filter definitions based on search keyword
  const filteredDefinitions = definitions.filter((def) => {
    const searchLower = keyWord.toLowerCase();
    return (
      def.title?.toLowerCase().includes(searchLower) ||
      def.year?.toString().includes(searchLower) ||
      def.feeType?.toLowerCase().includes(searchLower) ||
      def.amount?.toString().includes(searchLower)
    );
  });

  // Handle edit
  const handleEditClick = (def) => {
    setEditingDef(def);
    setEditForm({
      amount: def.amount,
      dueDate: def.dueDate?.split("T")[0] || "",
      propagate: false,
    });
  };

  const handleEditSubmit = async () => {
    if (!editingDef) return;
    try {
      const url = `${API_URL}/fee/definitions/${editingDef._id}?propagate=${editForm.propagate}`;
      const res = await fetchWithRefresh(
        url,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(editForm.amount),
            dueDate: editForm.dueDate,
          }),
        },
        authData.token,
        setAuthData
      );
      if (res.ok) {
        await fetchDefinitions(); // refresh list
        setEditingDef(null);
      } else {
        const err = await res.json();
        console.error(err);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  // Handle delete
  const handleDelete = async (defId) => {
    try {
      const res = await fetchWithRefresh(
        `${API_URL}/fee/definitions/${defId}`,
        { method: "DELETE" },
        authData.token,
        setAuthData
      );
      if (res.ok) {
        await fetchDefinitions();
        setShowDeleteConfirm(null);
      } else {
        const err = await res.json();
        console.error(err);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-yellow-300">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title="Gestion des campagnes de cotisation" />

      {/* Search bar only – no status/payment filters */}
      <div className="relative mb-6 mt-4 flex flex-wrap items-center gap-3">
        <IoSearchOutline size={22} className="text-yellow-300" />
        <input
          type="text"
          name="search"
          onChange={handleChange}
          value={keyWord}
          placeholder="Rechercher par titre, année, type, montant..."
          className="w-80 px-4 py-2 rounded-xl outline-none text-yellow-300 placeholder-yellow-200/40
                     bg-gray-900/40 backdrop-blur-md border border-gray-700/40 shadow-lg"
        />
      </div>

      <p className="mb-4 text-gray-400">
        {filteredDefinitions.length} campagne(s) trouvée(s)
      </p>

      {/* Card / Table view */}
      <div className="space-y-4">
        {filteredDefinitions.map((def) => (
          <div
            key={def._id}
            className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-yellow-300">{def.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-400">Année :</span>
                    <span className="ml-2 font-mono">{def.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type :</span>
                    <span className="ml-2 capitalize">{def.feeType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Montant :</span>
                    <span className="ml-2 font-mono text-green-400">{def.amount} DA</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Échéance :</span>
                    <span className="ml-2">{new Date(def.dueDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                {def.notes && (
                  <div className="mt-2 text-gray-400 text-sm italic">{def.notes}</div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(def)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(def._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredDefinitions.length === 0 && (
          <p className="text-center text-gray-400 py-8">Aucune campagne trouvée.</p>
        )}
      </div>

      {/* Edit Modal */}
      {editingDef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 border border-yellow-400/30 shadow-2xl">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">Modifier la campagne</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Montant (DA)</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 rounded text-white border border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nouvelle échéance</label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 rounded text-white border border-gray-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="propagate"
                  checked={editForm.propagate}
                  onChange={(e) => setEditForm({ ...editForm, propagate: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="propagate" className="text-sm text-gray-300">
                  Appliquer aux cotisations existantes de tous les membres
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingDef(null)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500 text-white"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 border border-red-400/30 shadow-2xl">
            <h3 className="text-xl font-bold text-red-300 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-300 mb-4">
              Cette action supprimera la campagne et toutes les cotisations individuelles associées (ainsi que les paiements liés). Êtes-vous sûr ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}