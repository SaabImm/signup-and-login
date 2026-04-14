
import { createPortal } from "react-dom";


const API_URL = import.meta.env.VITE_API_URL;
export default function PDFPreviewModal({ type, data, onClose, authData }) {
  // Determine the endpoint and title based on type

  let previewUrl = '';
  let downloadUrl = '';
  let title = '';

  if (type === 'payment') {
    previewUrl = `${API_URL}/pdf/payment/${data._id}/receipt?token=${authData.token}&preview=true`;
    downloadUrl = `${API_URL}/pdf/payment/${data._id}/receipt`;
    title = `Aperçu du reçu de paiement – ${new Date(data.date).toLocaleDateString('fr-FR')}`;
  } else if (type === 'versement') {
    previewUrl = `${API_URL}/pdf/versement/${data._id}/receipt?token=${authData.token}&preview=true`;
    downloadUrl = `${API_URL}/pdf/versement/${data._id}/receipt`;
    title = `Aperçu du reçu de versement – ${new Date(data.date).toLocaleDateString('fr-FR')}`;
  } else {
    // Fallback (should not happen)
    previewUrl = `${API_URL}/pdf/payment/${data._id}/receipt?token=${authData.token}&preview=true`;
    downloadUrl = `${API_URL}/pdf/payment/${data._id}/receipt`;
    title = `Aperçu du reçu`;
  }

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 border border-yellow-400/20 rounded-xl p-0 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-yellow-400/20 bg-gray-800/90 rounded-t-xl">
          <h3 className="text-lg font-semibold text-yellow-300">{title}</h3>
          <div className="flex gap-3">
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-sm transition"
            >
              Ouvrir dans un onglet
            </a>
            <a
              href={downloadUrl}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
            >
              Télécharger
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition"
            >
              Fermer
            </button>
          </div>
        </div>
        {/* PDF Viewer */}
        <div className="flex-1 w-full p-2 bg-gray-900/50">
          <iframe
            src={previewUrl}
            className="w-full h-[calc(90vh-80px)] rounded-md"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}