import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/dataCont";
import MarkFeePaidModal from '../../Pages/DashBoard/Cotisations/PayFee';

export default function CotisationCard({ cotisation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const { authData, setAuthData } = useContext(UserContext);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dueDate = new Date(cotisation.dueDate).toLocaleDateString('fr-FR');
  const paymentDate = cotisation.paymentDate
    ? new Date(cotisation.paymentDate).toLocaleDateString('fr-FR')
    : 'Non payé';

  const totalDue = cotisation.amount + (cotisation.penalty || 0);
  const paid = cotisation.paidAmount || 0;
  const remaining = totalDue - paid;

  const statusColors = {
    pending: 'bg-yellow-200/20 text-yellow-300 border-yellow-400/40',
    paid: 'bg-green-200/20 text-green-300 border-green-400/40',
    partial: 'bg-blue-200/20 text-blue-300 border-blue-400/40',
    overdue: 'bg-red-200/20 text-red-300 border-red-400/40',
    cancelled: 'bg-gray-200/20 text-gray-300 border-gray-400/40'
  };

  const statusLabels = {
    pending: 'En attente',
    paid: 'Payée',
    partial: 'Partielle',
    overdue: 'En retard',
    cancelled: 'Annulée'
  };

  const handleEdit = () => {
    navigate(`/auth/edit/fee/${cotisation._id}`);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    navigate(`/dash/delete/fee/${cotisation._id}`);
    setMenuOpen(false);
  };

  return (
    <div className="relative bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-yellow-300">
          Cotisation {cotisation.year}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[cotisation.status] || 'bg-gray-500/20 text-gray-300'}`}>
            {statusLabels[cotisation.status] || cotisation.status}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-yellow-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                <ul className="py-1 text-sm text-gray-300">
                  <li
                    onClick={handleEdit}
                    className="px-4 py-2 hover:bg-yellow-400 hover:text-gray-900 cursor-pointer transition"
                  >
                    Modifier
                  </li>
                  <li
                    onClick={() => setShowPaidModal(true)}
                    className="px-4 py-2 hover:bg-green-600 hover:text-white cursor-pointer transition"
                  >
                    {cotisation.paidAmount ? 'Modifier le paiement' : 'Marquer comme payée'}
                  </li>
                  <li
                    onClick={handleDelete}
                    className="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer transition"
                  >
                    Supprimer
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-400">Montant :</span>
          <span className="font-mono">{cotisation.amount} DA</span>
        </div>

        {cotisation.penalty > 0 && (
          <div className="flex justify-between text-red-400">
            <span>Pénalité :</span>
            <span className="font-mono">{cotisation.penalty} DA</span>
          </div>
        )}

        <div className="flex justify-between font-medium">
          <span className="text-gray-400">Total dû :</span>
          <span className="font-mono text-yellow-300">{totalDue} DA</span>
        </div>

        {paid > 0 && (
          <>
            <div className="flex justify-between text-green-400">
              <span>Déjà payé :</span>
              <span className="font-mono">{paid} DA</span>
            </div>
            {remaining > 0 && (
              <div className="flex justify-between text-yellow-300">
                <span>Reste à payer :</span>
                <span className="font-mono">{remaining} DA</span>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400">Échéance :</span>
          <span>{dueDate}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Paiement :</span>
          <span>{paymentDate}</span>
        </div>

        {cotisation.paymentMethod && (
          <div className="flex justify-between">
            <span className="text-gray-400">Mode :</span>
            <span className="capitalize">
              {cotisation.paymentMethod === 'bank_transfer' ? 'Virement' : cotisation.paymentMethod}
            </span>
          </div>
        )}

        {cotisation.user && (
          <div className="flex justify-between">
            <span className="text-gray-400">Membre :</span>
            <span>{cotisation.user.fullName || cotisation.user.name + ' ' + cotisation.user.lastname}</span>
          </div>
        )}
      </div>

      {cotisation.notes && (
        <div className="mt-3 pt-2 border-t border-gray-700 text-sm text-gray-400">
          {cotisation.notes}
        </div>
      )}

      {showPaidModal && (
        <MarkFeePaidModal
          cotisation={cotisation}
          onClose={() => setShowPaidModal(false)}
          onSuccess={(updated) => {
            // You might want to refresh the data here
            setShowPaidModal(false);
          }}
          authData={authData}
          setAuthData={setAuthData}
        />
      )}
    </div>
  );
}