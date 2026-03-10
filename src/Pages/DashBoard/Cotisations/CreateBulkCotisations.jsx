import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { fetchWithRefresh } from '../../../Components/api';
import wilayasData from '../../../assets/data/wilayas.json'; 

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateBulkCotisation() {
  const { authData, setAuthData } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    role: 'all',
    wilaya: 'all',
    year: new Date().getFullYear(),
    amount: '',
    dueDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const response = await fetchWithRefresh(
        `${API_URL}/fee/bulk-create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        },
        authData.token,
        setAuthData
      );

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setMessage(`✅ ${data.count} cotisation(s) créée(s)`);
      } else {
        setMessage(data.message || '❌ Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title="Création en masse de cotisations" />

      <div className="max-w-2xl mx-auto bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="moderator">Modérateur</option>
              <option value="admin">Administrateur</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {/* Wilaya selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Wilaya</label>
            <select
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">Toutes les wilayas</option>
              {wilayasData.map(w => (
                <option key={w.code} value={w.code}>{w.name} ({w.code})</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Année</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              max="2100"
              required
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Montant (DA)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="1"
              required
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date d'échéance</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optionnel)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          {result && (
            <div className="p-4 bg-green-600/20 border border-green-500 rounded-lg">
              <p className="text-green-300">{result.count} cotisation(s) créée(s).</p>
              {result.skipped > 0 && (
                <p className="text-yellow-300">{result.skipped} existante(s) ignorée(s).</p>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer les cotisations'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dash/allCotisations')}
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