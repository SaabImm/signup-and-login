import { useContext, useState } from "react";
import { UserContext } from "../../Context/dataCont";
import PDFPreviewModal from '../Modals/pdfPreviexModal';

const API_URL = import.meta.env.VITE_API_URL;

export default function CreditTransactionCard({ transaction, handlePopup }) {
  const { authData } = useContext(UserContext);
  const [showPreview, setShowPreview] = useState(false);
  const dateTime = new Date(transaction.date).toLocaleString('fr-FR');
  const isPositive = transaction.amount > 0;
  const amountColor = isPositive ? 'text-green-400' : 'text-red-400';
  const amountPrefix = isPositive ? '+' : '';

  const typeLabels = {
    deposit: 'Dépôt',
    used_for_fee: 'Utilisé pour cotisation',
    excess_from_fee: 'Remboursement (excedent)',
    versement: 'Versement',
    repayment: 'Retrait'
  };

  const handleDownloadVersementReceipt = async () => {
    if (transaction.amount <= 0) return;
    try {
      const response = await fetch(`${API_URL}/pdf/versement/${transaction._id}/receipt`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors du téléchargement');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recu_versement_${transaction._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      if (handlePopup) handlePopup('error', 'Impossible de télécharger le reçu');
    }
  };

  const handleEmailVersementReceipt = async () => {
    if (transaction.amount <= 0) return;
    try {
      const response = await fetch(`${API_URL}/pdf/versement/${transaction._id}/email`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        if (handlePopup) handlePopup('success', 'Reçu envoyé par email avec succès');
      } else {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      console.error(err);
      if (handlePopup) handlePopup('error', 'Impossible d\'envoyer le reçu par email');
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <span className="text-blue-300 font-medium">Crédit</span>
        <span className="text-xs text-gray-400">{dateTime}</span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Montant :</span>
          <span className={`font-mono ${amountColor}`}>
            {amountPrefix}{transaction.amount} DA
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Type :</span>
          <span className="capitalize">{typeLabels[transaction.type] || transaction.type}</span>
        </div>
        {transaction.paymentMethod && (
          <div className="flex justify-between">
            <span className="text-gray-400">Mode :</span>
            <span className="capitalize">{transaction.paymentMethod}</span>
          </div>
        )}
        {transaction.notes && <div className="text-gray-500 text-xs mt-1">{transaction.notes}</div>}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleDownloadVersementReceipt}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          Télécharger
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="px-3 py-1 bg-yellow-400 text-gray-900 rounded text-sm hover:bg-yellow-300"
        >
          Aperçu
        </button>
        <button
          onClick={handleEmailVersementReceipt}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Envoyer par email
        </button>
      </div>
      {showPreview && (
        <PDFPreviewModal
          type="versement"
          data={transaction}
          onClose={() => setShowPreview(false)}
          authData={authData}
        />
      )}
    </div>
  );
}