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
        if (res.ok) {
          setStats(data);
        } else {
          setError(data.message || 'Impossible de charger les statistiques');
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
    totalFees = 0,
    totalProjected = 0,
    totalPaid = 0,
    totalRemaining = 0,
    totalPaidByCredit = 0,
    totalPaidByCash = 0,
    totalVersements = 0,
    totalRepayments = 0,
    netCreditAdded = 0,
    byStatus = {}
  } = stats || {};

  const paymentRate = totalProjected > 0 ? ((totalPaid / totalProjected) * 100).toFixed(1) : 0;

  const formatAmount = (amount) => new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(amount || 0);

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title="Statistiques des cotisations" />

      {/* Cartes récapitulatives principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total collecté"
          value={formatAmount(totalPaid)}
          bg="bg-green-600/20"
          border="border-green-500"
        />
        <StatCard
          label="Total restant dû"
          value={formatAmount(totalRemaining)}
          bg="bg-yellow-600/20"
          border="border-yellow-500"
        />
        <StatCard
          label="Nombre de cotisations"
          value={totalFees}
          bg="bg-blue-600/20"
          border="border-blue-500"
        />
        <StatCard
          label="Taux de paiement"
          value={`${paymentRate} %`}
          bg="bg-purple-600/20"
          border="border-purple-500"
        />
      </div>

      {/* Cartes pour crédit et versements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Payé par crédit"
          value={formatAmount(totalPaidByCredit)}
          bg="bg-indigo-600/20"
          border="border-indigo-500"
        />
        <StatCard
          label="Payé par espèces/autre"
          value={formatAmount(totalPaidByCash)}
          bg="bg-cyan-600/20"
          border="border-cyan-500"
        />
        <StatCard
          label="Total versements"
          value={formatAmount(totalVersements)}
          bg="bg-emerald-600/20"
          border="border-emerald-500"
        />
        <StatCard
          label="Total retraits"
          value={formatAmount(totalRepayments)}
          bg="bg-rose-600/20"
          border="border-rose-500"
        />
      </div>

      {/* Carte pour le net crédit ajouté */}
      <div className="grid grid-cols-1 mb-8">
        <StatCard
          label="Net crédit ajouté (versements - retraits)"
          value={formatAmount(netCreditAdded)}
          bg="bg-orange-600/20"
          border="border-orange-500"
        />
      </div>

      {/* Répartition par statut */}
      <div className="mt-8 bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-300 mb-4">Répartition par statut</h3>
        <div className="space-y-3">
          <StatusBar label="Payées" value={byStatus.paid || 0} total={totalFees} color="bg-green-500" />
          <StatusBar label="Partielles" value={byStatus.partial || 0} total={totalFees} color="bg-blue-500" />
          <StatusBar label="En attente" value={byStatus.pending || 0} total={totalFees} color="bg-yellow-500" />
          <StatusBar label="En retard" value={byStatus.overdue || 0} total={totalFees} color="bg-red-500" />
          <StatusBar label="Annulées" value={byStatus.cancelled || 0} total={totalFees} color="bg-gray-500" />
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