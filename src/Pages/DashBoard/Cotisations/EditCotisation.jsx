// pages/DashBoard/Cotisations/EditCotisation.jsx
import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/dataCont";
import { fetchWithRefresh } from "../../../Components/api";
import Title from "../../../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditCotisation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authData, setAuthData } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    year: "",
    amount: "",
    dueDate: "",
    paymentDate: "",
    status: "pending",
    paymentMethod: "",
    notes: ""
  });

  // Charger la cotisation
  useEffect(() => {
    const fetchCotisation = async () => {
      try {
        const response = await fetch(
          `${API_URL}/fee/${id}`,
          { method: "GET",
            headers: {
            Authorization: `Bearer ${authData.token}`,
          },
           },
          authData.token,
          setAuthData
        );
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          const cot = data.cotisation || data; // adapter selon la structure de réponse
          setFormData({
            year: cot.year || "",
            amount: cot.amount || "",
            dueDate: cot.dueDate ? cot.dueDate.split("T")[0] : "",
            paymentDate: cot.paymentDate ? cot.paymentDate.split("T")[0] : "",
            status: cot.status || "pending",
            paymentMethod: cot.paymentMethod || "",
            notes: cot.notes || ""
          });
        } else {
          setMessage(data.message || "Erreur lors du chargement");
        }
      } catch (error) {
        console.error(error);
        setMessage("Erreur réseau");
      } finally {
        setLoading(false);
      }
    };
    if (authData?.token) fetchCotisation();
  }, [id, authData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetchWithRefresh(
        `${API_URL}/fee/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        },
        authData.token,
        setAuthData
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Cotisation mise à jour !");
        setTimeout(() => navigate("/dash/allCotisations"), 2000);
      } else {
        setMessage(data.message || "❌ Échec de la mise à jour");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-yellow-300">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gradient-to-br from-gray-900 to-gray-800 font-urbanist">
      <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-xl border border-yellow-400/20 rounded-2xl shadow-xl p-8">
        <Title title="Modifier la cotisation" textColor="text-yellow-300" />
        <p className="text-gray-400 text-center mb-6">Année {formData.year}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Année</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Montant (DA)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date d'échéance</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date de paiement</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="overdue">En retard</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mode de paiement</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Non renseigné</option>
              <option value="cash">Espèces</option>
              <option value="bank_transfer">Virement</option>
              <option value="check">Chèque</option>
              <option value="online">En ligne</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {message && (
            <p className={`text-sm text-center ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-lg font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dash/allCotisations")}
              className="flex-1 py-3 rounded-lg font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}