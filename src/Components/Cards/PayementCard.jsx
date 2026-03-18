// components/Cards/PaymentCard.jsx
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/dataCont';

export default function PaymentCard({ payment, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { authData } = useContext(UserContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Formater la date
  const paymentDate = payment.date ? new Date(payment.date).toLocaleDateString('fr-FR') : 'Date inconnue';

  // Obtenir le nom de l'utilisateur (si peuplé)
  const userName = payment.user?.fullName || (payment.user?.name && payment.user?.lastname 
    ? `${payment.user.name} ${payment.user.lastname}` 
    : payment.user?.email || 'Utilisateur inconnu');

  // Année de la cotisation (si peuplée)
  const cotisationYear = payment.cotisation?.year || 'N/A';

  // Icône ou label pour le mode de paiement
  const paymentMethodLabels = {
    cash: 'Espèces',
    bank_transfer: 'Virement',
    check: 'Chèque',
    online: 'En ligne',
    credit: 'Crédit',
    other: 'Autre'
  };
  const paymentMethodLabel = paymentMethodLabels[payment.type] || payment.type;

  // Couleur de fond selon le type
  const typeColors = {
    cash: 'bg-green-600/20 text-green-300 border-green-400/40',
    bank_transfer: 'bg-blue-600/20 text-blue-300 border-blue-400/40',
    check: 'bg-purple-600/20 text-purple-300 border-purple-400/40',
    online: 'bg-indigo-600/20 text-indigo-300 border-indigo-400/40',
    credit: 'bg-yellow-600/20 text-yellow-300 border-yellow-400/40',
    other: 'bg-gray-600/20 text-gray-300 border-gray-400/40'
  };

  const handleDelete = () => {
    if (window.confirm('Supprimer ce paiement ?')) {
      onDelete?.(payment._id);
    }
    setMenuOpen(false);
  };

  return (
    <div className="relative bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Menu trois points */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-400 hover:text-yellow-300 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
            <ul className="py-1 text-sm text-gray-300">
              <li
                onClick={() => {
                  navigate(`/payments/${payment._id}`);
                  setMenuOpen(false);
                }}
                className="px-4 py-2 hover:bg-yellow-400 hover:text-gray-900 cursor-pointer transition"
              >
                Détails
              </li>
              {authData?.user?.role === 'super_admin' && (
                <li
                  onClick={handleDelete}
                  className="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer transition"
                >
                  Supprimer
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* En-tête */}
      <div className="mb-3 pr-8">
        <h3 className="text-lg font-semibold text-yellow-300">
          Paiement {paymentDate}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[payment.type] || 'bg-gray-500/20 text-gray-300'}`}>
            {paymentMethodLabel}
          </span>
          {payment.fromCredit && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-400/40">
              Crédit
            </span>
          )}
        </div>
      </div>

      {/* Corps */}
      <div className="space-y-2 text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-400">Montant :</span>
          <span className="font-mono">{payment.amount.toLocaleString()} DA</span>
        </div>

        {payment.user && (
          <div className="flex justify-between">
            <span className="text-gray-400">Membre :</span>
            <span>{userName}</span>
          </div>
        )}

        {payment.cotisation && (
          <div className="flex justify-between">
            <span className="text-gray-400">Cotisation :</span>
            <span>{cotisationYear}</span>
          </div>
        )}

        {payment.notes && (
          <div className="mt-2 text-sm text-gray-400 border-t border-gray-700 pt-2">
            {payment.notes}
          </div>
        )}
      </div>
    </div>
  );
}