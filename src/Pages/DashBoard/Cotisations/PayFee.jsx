import { useState } from 'react';
import { fetchWithRefresh } from '../../../Components/api';

export default function MarkFeePaidModal({ cotisation, onClose, onSuccess, authData, setAuthData }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const totalDue = cotisation.amount + (cotisation.penalty || 0);
  
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paidAmount, setPaidAmount] = useState(totalDue); // pré‑rempli avec le total dû
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Déterminer le statut en fonction du montant payé
    const status = paidAmount >= totalDue ? 'paid' : 'partial';

    try {
      const response = await fetchWithRefresh(
        `${API_URL}/fee/${cotisation._id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            paymentDate,
            paymentMethod,
            paidAmount,
            notes: notes || cotisation.notes
          })
        },
        authData.token,
        setAuthData
      );

      const data = await response.json();
      if (response.ok) {
        onSuccess?.(data.cotisation || data);
        onClose();
      } else {
        setError(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-yellow-400/20 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-yellow-300 mb-4">
          {cotisation.paidAmount ? 'Modifier le paiement' : 'Enregistrer un paiement'}
        </h2>
        <p className="text-gray-300 mb-2">Cotisation {cotisation.year}</p>
        <p className="text-gray-300 mb-2">Montant initial : {cotisation.amount} DA</p>
        {cotisation.penalty > 0 && (
          <p className="text-red-400 text-sm mb-1">Pénalité : {cotisation.penalty} DA</p>
        )}
        <p className="text-yellow-300 font-semibold mb-4">Total dû : {totalDue} DA</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Montant payé (DA)</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              min="0"
              max={totalDue}
              step="1"
              required
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
            {paidAmount < totalDue && (
              <p className="text-yellow-400 text-xs mt-1">Paiement partiel – le statut sera "partiel".</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date de paiement</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mode de paiement</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Sélectionner</option>
              <option value="cash">Espèces</option>
              <option value="bank_transfer">Virement</option>
              <option value="check">Chèque</option>
              <option value="online">En ligne</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Confirmer le paiement'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}