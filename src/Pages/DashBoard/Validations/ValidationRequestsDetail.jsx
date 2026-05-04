import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { fetchWithRefresh } from '../../../Components/api';

const API_URL = import.meta.env.VITE_API_URL;

export default function ValidationRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authData, setAuthData } = useContext(UserContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [popup, setPopup] = useState(null);

  const handlePopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetchWithRefresh(
          `${API_URL}/validation/request/${id}`,
          { method: 'GET' },
          authData.token,
          setAuthData
        );
        const data = await res.json();
        setRequest(data);
      } catch (err) {
        console.error(err);
        handlePopup('error', 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    if (authData?.token) fetchRequest();
  }, [id, authData.token]);

  const handleStepAction = async (stepOrder, action) => {
    const comment = comments[stepOrder] || '';
    if (!comment && action !== 'skip') {
      handlePopup('error', 'Veuillez ajouter un commentaire');
      return;
    }
    setActionLoading(true);
    try {
      const url = `${API_URL}/validation/requests/${id}/${action}/${stepOrder}`;
      const body = action === 'skip' ? { reason: comment } : { comments: comment };
      const res = await fetchWithRefresh(
        url,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        authData.token,
        setAuthData
      );
      const data = await res.json();
      if (res.ok) {
        setRequest(data.request);
        setComments(prev => ({ ...prev, [stepOrder]: '' }));
        handlePopup('success', `Étape ${action}ée avec succès`);
      } else {
        handlePopup('error', data.error || 'Erreur');
      }
    } catch (err) {
      console.error(err);
      handlePopup('error', 'Erreur réseau');
    } finally {
      setActionLoading(false);
    }
  };

  const updateComment = (stepOrder, value) => {
    setComments(prev => ({ ...prev, [stepOrder]: value }));
  };

  const getStepStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-600/20 text-yellow-300',
      approved: 'bg-green-600/20 text-green-300',
      rejected: 'bg-red-600/20 text-red-300',
      expired: 'bg-orange-600/20 text-orange-300',
      skipped: 'bg-gray-600/20 text-gray-300',
    };
    return colors[status] || 'bg-gray-600/20';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-300">Chargement...</div>;
  if (!request) return <div className="min-h-screen flex items-center justify-center text-red-400">Demande non trouvée</div>;

  const userRole = authData.user?.role;
  const userId = authData.user?._id;

  // Helper: can user act on a given step?
  const canActOnStep = (step) => {
    return step.status === 'pending' &&
      (step.requiredRole === userRole ||
       (step.allowedUserIds && step.allowedUserIds.some(id => id.toString() === userId?.toString())));
  };

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title={`Demande #${request._id.slice(-6)}`} />
      <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-6">
        <p><span className="text-gray-400">Cible :</span> {request.targetType} – {request.targetId?.fullName || request.targetId}</p>
        <p><span className="text-gray-400">Statut :</span> {request.status}</p>
        {request.expiresAt && <p><span className="text-gray-400">Expire le :</span> {new Date(request.expiresAt).toLocaleString()}</p>}
      </div>

      <h3 className="text-lg font-semibold mb-4">Étapes</h3>
      <div className="space-y-4 mb-6">
        {request.steps.map((step, idx) => {
          const isActionable = canActOnStep(step);
          const stepDisabled = !isActionable && step.status === 'pending';
          const isProcessed = ['approved', 'rejected', 'expired', 'skipped'].includes(step.status);
          return (
            <div
              key={idx}
              className={`bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 transition ${
                stepDisabled ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{step.stepName}</h4>
                  <p className="text-sm text-gray-400">Rôle requis : {step.requiredRole}</p>
                  {step.comments && <p className="text-sm text-gray-300 mt-1">Commentaire : {step.comments}</p>}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStepStatusBadge(step.status)}`}>
                  {step.status}
                </span>
              </div>

              {step.status === 'pending' && !isActionable && (
                <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 italic">
                  Cette étape ne vous est pas assignée ou vous n'avez pas le rôle requis.
                </div>
              )}

              {step.status === 'pending' && isActionable && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <textarea
                    value={comments[step.order] || ''}
                    onChange={(e) => updateComment(step.order, e.target.value)}
                    placeholder="Commentaire (obligatoire pour approbation/rejet)"
                    className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-gray-200"
                    rows="2"
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleStepAction(step.order, 'approve')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleStepAction(step.order, 'reject')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Rejeter
                    </button>
                    {(authData.user?.role === 'admin' || authData.user?.role === 'super_admin') && (
                      <button
                        onClick={() => handleStepAction(step.order, 'skip')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Ignorer (admin)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isProcessed && (
                <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400">
                  Cette étape a déjà été traitée.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {popup && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800/90 text-yellow-300 px-6 py-4 rounded-xl shadow-lg border border-yellow-400/30 z-50">
          {popup.message}
        </div>
      )}
    </div>
  );
}