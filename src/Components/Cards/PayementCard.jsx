import { useContext, useState } from "react";
import { UserContext } from "../../Context/dataCont";
import PDFPreviewModal from '../Modals/pdfPreviexModal';

const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentCard({ payment, handlePopup }) {
  const { authData } = useContext(UserContext);
  const [showPreview, setShowPreview] = useState(false);
  const dateTime = new Date(payment.date).toLocaleString('fr-FR');
  const isReversed = payment.reversed === true;

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(`${API_URL}/pdf/payment/${payment._id}/receipt`, {
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
      link.setAttribute('download', `recu_paiement_${payment._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      if (handlePopup) handlePopup('error', 'Impossible de télécharger le reçu');
    }
  };

  const handleEmailReceipt = async () => {
    try {
      const response = await fetch(`${API_URL}/pdf/payment/${payment._id}/email`, {
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
    <>
      <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <span className="text-yellow-300 font-medium">Paiement</span>
          <span className="text-xs text-gray-400">{dateTime}</span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Montant :</span>
            <span className="font-mono text-green-400">{payment.amount} DA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Mode :</span>
            <span className="capitalize">{payment.type}</span>
          </div>
          {payment.fromCredit && <div className="text-blue-400 text-xs">Payé par crédit</div>}
          {payment.notes && <div className="text-gray-500 text-xs mt-1">{payment.notes}</div>}
          {isReversed && (
            <div className="text-red-400 text-xs font-semibold mt-1">⚠️ Remboursé / Annulé</div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleDownloadReceipt}
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
            onClick={handleEmailReceipt}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Envoyer par email
          </button>
        </div>
      </div>
      {showPreview && (
        <PDFPreviewModal
          type="payment"
          data={payment}
          onClose={() => setShowPreview(false)}
          authData={authData}
        />
      )}
    </>
  );
}