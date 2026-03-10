import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { fetchWithRefresh } from '../../../Components/api';

const API_URL = import.meta.env.VITE_API_URL;

export default function FeeStats() {
  const { authData, setAuthData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchWithRefresh(
          `${API_URL}/fee/stats`,
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

  const { global, byYear, byMethod } = stats || { global: {}, byYear: [], byMethod: [] };

  // Formater les montants (exemple : en DA)
  const formatAmount = (amount) => new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(amount || 0);

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title="Statistiques des cotisations" />

      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total collecté"
          value={formatAmount(global.totalPaid)}
          bg="bg-green-600/20"
          border="border-green-500"
        />
        <StatCard
          label="Total en attente"
          value={formatAmount(global.totalPending)}
          bg="bg-yellow-600/20"
          border="border-yellow-500"
        />
        <StatCard
          label="Nombre de cotisations"
          value={global.countAll || 0}
          bg="bg-blue-600/20"
          border="border-blue-500"
        />
        <StatCard
          label="Taux de paiement"
          value={`${global.paymentRate || 0} %`}
          bg="bg-purple-600/20"
          border="border-purple-500"
        />
      </div>

      {/* Graphiques simples – sous forme de listes pour l'instant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par année */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Par année</h3>
          <div className="space-y-3">
            {byYear.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-300">{item._id}</span>
                <span className="font-mono text-yellow-200">{formatAmount(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par mode de paiement */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Par mode de paiement</h3>
          <div className="space-y-3">
            {byMethod.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{item._id}</span>
                <span className="font-mono text-yellow-200">{formatAmount(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Répartition par statut (exemple de barre de progression) */}
      <div className="mt-8 bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-300 mb-4">Répartition par statut</h3>
        <div className="space-y-3">
          <StatusBar label="Payées" value={global.countPaid || 0} total={global.countAll} color="bg-green-500" />
          <StatusBar label="En attente" value={global.countPending || 0} total={global.countAll} color="bg-yellow-500" />
          <StatusBar label="En retard" value={global.countOverdue || 0} total={global.countAll} color="bg-red-500" />
          <StatusBar label="Annulées" value={global.countCancelled || 0} total={global.countAll} color="bg-gray-500" />
        </div>
      </div>
    </div>
  );
}

// Composant pour une carte de statistique
function StatCard({ label, value, bg, border }) {
  return (
    <div className={`${bg} backdrop-blur-sm border ${border} rounded-xl p-6 shadow-lg`}>
      <p className="text-gray-300 text-sm">{label}</p>
      <p className="text-2xl font-bold text-yellow-300 mt-2">{value}</p>
    </div>
  );
}

// Barre de progression pour les statuts
function StatusBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{label}</span>
        <span>{value} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}