import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { fetchWithRefresh } from '../../../Components/api';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function ValidationRequestsList() {
  const { authData, setAuthData } = useContext(UserContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [popup, setPopup] = useState(null);

  const handlePopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  const fetchRequests = async () => {
    try {
      const res = await fetchWithRefresh(
        `${API_URL}/validation/requests/approver?status=${filter}`,
        { method: 'GET' },
        authData.token,
        setAuthData
      );
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authData?.token) fetchRequests();
  }, [filter, authData?.token]);

  const handleCancel = async (requestId) => {
    if (!confirm('Annuler cette demande de validation ?')) return;
    try {
      const res = await fetchWithRefresh(
        `${API_URL}/validation/requests/${requestId}/cancel`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'Annulée par l\'utilisateur' })
        },
        authData.token,
        setAuthData
      );
      if (res.ok) {
        handlePopup('success', 'Demande annulée');
        fetchRequests(); // refresh list
      } else {
        const err = await res.json();
        handlePopup('error', err.message || 'Erreur');
      }
    } catch (err) {
      console.error(err);
      handlePopup('error', 'Erreur réseau');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-600/20 text-yellow-300 border-yellow-500',
      partial: 'bg-blue-600/20 text-blue-300 border-blue-500',
      approved: 'bg-green-600/20 text-green-300 border-green-500',
      rejected: 'bg-red-600/20 text-red-300 border-red-500',
      cancelled: 'bg-gray-600/20 text-gray-300 border-gray-500',
      expired: 'bg-orange-600/20 text-orange-300 border-orange-500',
    };
    return colors[status] || 'bg-gray-600/20 text-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-yellow-300">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title="Demandes de validation" />
      <div className="mb-6 flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900/40 border border-gray-700 text-yellow-300"
        >
          <option value="pending">En attente</option>
          <option value="partial">Partiellement approuvées</option>
          <option value="all">Toutes</option>
        </select>
      </div>
      <div className="space-y-4">
        {requests.length === 0 && <p className="text-gray-400">Aucune demande trouvée.</p>}
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/dash/validation/requests/${req._id}`)}
              >
                <h3 className="text-lg font-semibold">
                  {req.targetType} – {req.targetId?.fullName || req.targetId}
                </h3>
                <p className="text-sm text-gray-400">Créée le {new Date(req.createdAt).toLocaleDateString()}</p>
                <div className="mt-2 flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {['pending', 'partial'].includes(req.status) && (
                  <button
                    onClick={() => handleCancel(req._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Annuler
                  </button>
                )}
                <span
                  className="text-gray-400 text-xl cursor-pointer"
                  onClick={() => navigate(`/dash/validation/requests/${req._id}`)}
                >
                  →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {popup && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800/90 text-yellow-300 px-6 py-4 rounded-xl shadow-lg border border-yellow-400/30 z-50">
          {popup.message}
        </div>
      )}
    </div>
  );
}