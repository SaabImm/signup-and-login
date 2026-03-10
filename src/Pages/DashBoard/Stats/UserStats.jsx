import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { fetchWithRefresh } from '../../../Components/api';

const API_URL = import.meta.env.VITE_API_URL;

export default function UserStats() {
  const { authData, setAuthData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchWithRefresh(
          `${API_URL}/user/stats`,
          { method: 'GET' },
          authData.token,
          setAuthData
        );
        const data = await res.json();
        if (data.success) {
          setStats(data);
        } else {
          setError('Impossible de charger les statistiques');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    if (authData?.token) fetchStats();
  }, [authData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-yellow-300">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const {
    totalUsers,
    byRole,
    byWilaya,
    byProfession,
    byVerification,
    byStatus,
    newUsers,
    bySexe
  } = stats;

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title="Statistiques des utilisateurs" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total utilisateurs"
          value={totalUsers}
          bg="bg-blue-600/20"
          border="border-blue-500"
        />
        <StatCard
          label="Nouveaux (30 jours)"
          value={newUsers}
          bg="bg-green-600/20"
          border="border-green-500"
        />
        <StatCard
          label="Email vérifié"
          value={byVerification?.verified || 0}
          bg="bg-yellow-600/20"
          border="border-yellow-500"
        />
        <StatCard
          label="Admin vérifié"
          value={byVerification?.adminVerified || 0}
          bg="bg-purple-600/20"
          border="border-purple-500"
        />
      </div>

      {/* Two‑column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* By role */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Par rôle</h3>
          <div className="space-y-3">
            {byRole.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{item._id}</span>
                <span className="font-mono text-yellow-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By account status */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Par statut de compte</h3>
          <div className="space-y-3">
            {byStatus.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{item._id}</span>
                <span className="font-mono text-yellow-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top wilayas */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Top wilayas</h3>
          <div className="space-y-3">
            {byWilaya.slice(0, 5).map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-300">Wilaya {item._id}</span>
                <span className="font-mono text-yellow-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top professions */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Top professions</h3>
          <div className="space-y-3">
            {byProfession.slice(0, 5).map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{item._id}</span>
                <span className="font-mono text-yellow-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gender distribution (if any) */}
      {bySexe && bySexe.length > 0 && (
        <div className="mt-8 bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Répartition par sexe</h3>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {bySexe.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span className="text-gray-300 capitalize">{item._id}</span>
                <span className="font-mono text-yellow-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, bg, border }) {
  return (
    <div className={`${bg} backdrop-blur-sm border ${border} rounded-xl p-6 shadow-lg`}>
      <p className="text-gray-300 text-sm">{label}</p>
      <p className="text-2xl font-bold text-yellow-300 mt-2">{value}</p>
    </div>
  );
}