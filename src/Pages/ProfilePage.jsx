import Title from '../Components/Title';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/dataCont";
import { useParams } from "react-router-dom";

import sabAvatar from '../assets/SabrinaAvatar.jpg';
import FileCard from '../Components/Cards/FileCrad';
import CotisationCard from '../Components/Cards/CotisationCard';
import AddFileCard from '../Components/Cards/AddFileCard';

const API_URL = import.meta.env.VITE_API_URL;

function PaymentCard({ payment }) {
  const date = new Date(payment.date).toLocaleDateString('fr-FR');
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <span className="text-yellow-300 font-medium">Paiement</span>
        <span className="text-xs text-gray-400">{date}</span>
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
        {payment.fromCredit && (
          <div className="text-blue-400 text-xs">Payé par crédit</div>
        )}
        {payment.notes && (
          <div className="text-gray-500 text-xs mt-1">{payment.notes}</div>
        )}
      </div>
    </div>
  );
}

// New component for credit transactions
function CreditTransactionCard({ transaction }) {
  const date = new Date(transaction.date).toLocaleDateString('fr-FR');
  const isPositive = transaction.amount > 0;
  const amountColor = isPositive ? 'text-green-400' : 'text-red-400';
  const amountPrefix = isPositive ? '+' : '';

  const typeLabels = {
    deposit: 'Dépôt',
    used_for_fee: 'Utilisé pour cotisation',
    excess_from_fee: 'Remboursement (excedent)',
    versement: 'Versement'
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <span className="text-blue-300 font-medium">Crédit</span>
        <span className="text-xs text-gray-400">{date}</span>
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
        {transaction.notes && (
          <div className="text-gray-500 text-xs mt-1">{transaction.notes}</div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage({ user }) {
  const { authData, setAuthData } = useContext(UserContext);
  const { id } = useParams();

  const [displayUser, setDisplayUser] = useState(user || authData.user);
  const [permissions, setPermissions] = useState(null);
  const [perform, setPerform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [userFees, setUserFees] = useState([]);
  const [creditTransactions, setCreditTransactions] = useState([]); // new state

  // Versement modal state
  const [showVersementModal, setShowVersementModal] = useState(false);
  const [versementAmount, setVersementAmount] = useState('');
  const [versementMethod, setVersementMethod] = useState('cash');
  const [versementNotes, setVersementNotes] = useState('');

  const targetUserId = user?._id || id || authData.user?._id;
  const isOwner = authData.user?._id === targetUserId;

  // --- Popup handler ---
  const handlePopup = (type, message, duration = 3000) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), duration);
  };

  // --- File handlers (unchanged) ---
  const handleUpload = async (file) => {
    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "uploads");

      const response = await fetch(`${API_URL}/upload/${displayUser._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authData.token}` },
        body: uploadData,
      });

      const data = await response.json();

      if (response.status === 413) {
        handlePopup("error", data.message || "File is too large");
        return;
      }
      if (!response.ok) {
        handlePopup("error", data.message || "Upload failed");
        return;
      }

      if (isOwner) setAuthData(prev => ({ token: data.token || prev.token, user: data.user || prev.user }));
      else setDisplayUser(data.user);

      handlePopup("success", "File uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      handlePopup("error", "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplace = async (file, newFile) => {
    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append("file", newFile);
      uploadData.append("folder", "uploads");

      const response = await fetch(`${API_URL}/upload/${file._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authData.token}` },
        body: uploadData,
      });

      const data = await response.json();

      if (response.status === 413) {
        handlePopup("error", data.message || "File is too large");
        return;
      }
      if (!response.ok) {
        handlePopup("error", data.message || "Replace failed");
        return;
      }

      if (isOwner) setAuthData(prev => ({ token: data.token || prev.token, user: data.user || prev.user }));
      else setDisplayUser(data.user);

      handlePopup("success", "File replaced successfully ✅");
    } catch (err) {
      console.error(err);
      handlePopup("error", "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file) => {
    try {
      setIsUploading(true);
      const response = await fetch(`${API_URL}/upload/${file._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        handlePopup("error", data.message || "Delete failed");
        return;
      }

      if (isOwner) setAuthData(prev => ({ token: data.token || prev.token, user: data.user || prev.user }));
      else setDisplayUser(data.user);

      handlePopup("success", "File deleted successfully ✅");
    } catch (err) {
      console.error(err);
      handlePopup("error", "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Refresh user (credit) and fees after versement ---
  const refreshUserAndFees = async () => {
    try {
      // Refresh user data (including credit)
      const userRes = await fetch(`${API_URL}/user/${targetUserId}`, {
        headers: { Authorization: `Bearer ${authData.token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        const updatedUser = userData.user;
        setDisplayUser(updatedUser);
        if (isOwner) setAuthData(prev => ({ ...prev, user: updatedUser }));
      }
      // Refresh fees
      await refreshUserFees();
      // Refresh credit transactions as well
      await fetchCreditTransactions();
    } catch (error) {
      console.error("Error refreshing user and fees:", error);
    }
  };

  const refreshUserFees = async () => {
    try {
      const feesRes = await fetch(`${API_URL}/fee/user/${targetUserId}`, {
        headers: { Authorization: `Bearer ${authData.token}` }
      });
      if (feesRes.ok) {
        const feesData = await feesRes.json();
        setUserFees(feesData.cotisations);
      } else {
        console.warn("Erreur lors du rafraîchissement des cotisations");
      }
    } catch (error) {
      console.error("Error refreshing fees:", error);
    }
  };

  // Fetch credit transactions from backend
  const fetchCreditTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/credit/user/${targetUserId}`, {
        headers: { Authorization: `Bearer ${authData.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCreditTransactions(data.transactions || data);
      } else {
        console.warn("Impossible de charger les transactions de crédit");
      }
    } catch (error) {
      console.error("Error fetching credit transactions:", error);
    }
  };

  // --- Versement handler ---
  const handleVersement = async (amount, method, notes) => {
    try {
      const res = await fetch(`${API_URL}/fee/versement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authData.token}` },
        body: JSON.stringify({ userId: targetUserId, amount, paymentMethod: method, notes })
      });
      const data = await res.json();
      if (res.ok) {
        handlePopup('success', `${data.usedForFees} DA utilisé pour les cotisations, ${data.creditAdded} DA ajoutés au crédit.`);
        await refreshUserAndFees();
        setShowVersementModal(false);
        // Reset form
        setVersementAmount('');
        setVersementMethod('cash');
        setVersementNotes('');
      } else {
        handlePopup('error', data.error);
      }
    } catch (err) {
      console.error(err);
      handlePopup('error', 'Erreur réseau');
    }
  };

  // --- Data fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let userData = user;
        if (!userData && id) {
          const userRes = await fetch(`${API_URL}/user/${id}`, {
            headers: { Authorization: `Bearer ${authData.token}` }
          });
          const result = await userRes.json();
          userData = result.user;
        }
        setDisplayUser(userData || authData.user);

        const permRes = await fetch(`${API_URL}/permissions/user/${targetUserId}/vwFields?model=User`, {
          headers: { Authorization: `Bearer ${authData.token}` }
        });
        const permData = await permRes.json();
        setPermissions(permData);

        const opRes = await fetch(`${API_URL}/permissions/${targetUserId}/check-operation`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ operation: "create", model: "File" })
        });
        const opData = await opRes.json();
        setPerform(opData.canPerform);

        const paymentsRes = await fetch(`${API_URL}/payement/user/${targetUserId}`, {
          headers: { Authorization: `Bearer ${authData.token}` }
        });
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          setPayments(paymentsData);
        }

        const feesRes = await fetch(`${API_URL}/fee/user/${targetUserId}`, {
          headers: { Authorization: `Bearer ${authData.token}` }
        });
        if (feesRes.ok) {
          const feesData = await feesRes.json();
          setUserFees(feesData.cotisations);
        }

        // Fetch credit transactions
        await fetchCreditTransactions();

      } catch (error) {
        console.error("Error fetching data:", error);
        handlePopup("error", "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    if (authData?.token && targetUserId) {
      fetchData();
    }
  }, [id, user, authData, targetUserId]);

  const totalDebt = userFees.reduce((sum, fee) => {
    const computed = fee.computed || {};
    const remaining = computed.remaining || 0;
    return sum + (remaining > 0 ? remaining : 0);
  }, 0);

  const PROFILE_URL = displayUser?.profilePicture || sabAvatar;
  const files = displayUser?.files || [];

  const roleColors = {
    admin: "bg-red-200/20 text-red-300 border-red-400/40",
    user: "bg-blue-200/20 text-blue-300 border-blue-400/40",
    moderator: "bg-purple-200/20 text-purple-300 border-purple-400/40",
  };

  const verificationTag = displayUser?.isAdminVerified
    ? "bg-slate-200/20 text-slate-100 border-slate-300/30"
    : "bg-yellow-400/20 text-yellow-300 border-yellow-400/40";

  const verificationText = displayUser?.isAdminVerified ? "Validated" : "Pending Validation";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-300">Chargement...</div>
      </div>
    );
  }

  const visibleFields = permissions?.fields || [];
  const isVisible = (fieldName) => visibleFields.includes(fieldName);

  return (
    <>
      <div className="min-h-screen bg-gray-900 pb-16 relative">

        {/* Spinner Overlay */}
        {isUploading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Popup Toast */}
        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className={`px-6 py-4 rounded-lg shadow-xl border text-sm font-medium pointer-events-auto
              transform transition-all duration-300
              ${popup.type === "error"
                ? "bg-red-500/20 text-red-300 border-red-400/40"
                : "bg-green-500/20 text-green-300 border-green-400/40"}`}>
              {popup.message}
            </div>
          </div>
        )}

        {/* Gold Cover */}
        <div className="h-40 bg-yellow-400/80 shadow-md"></div>

        {/* Profile Card */}
        <div className="w-3/4 mx-auto -mt-20 bg-gray-800/80 backdrop-blur-xl border border-yellow-400/30 rounded-xl shadow-xl p-10 flex gap-10 items-center relative">
          {displayUser?.profilePicture && (
            <img src={PROFILE_URL} alt="Profile" className="w-40 h-40 object-cover rounded-full border-4 border-yellow-300 shadow-[0_0_20px_rgba(255,215,100,0.4)]" />
          )}
          <div className="flex-1 space-y-2">
            {isVisible('name') && isVisible('lastname') && (
              <h2 className="text-3xl font-semibold text-white tracking-tight">
                {displayUser?.name} {displayUser?.lastname}
              </h2>
            )}
            {isVisible('email') && <p className="text-gray-300 text-lg">{displayUser?.email}</p>}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {isVisible('role') && (
                <span className={`px-3 py-1 rounded-full border text-sm font-medium ${roleColors[displayUser?.role] || "bg-yellow-300/20 text-yellow-300 border-yellow-400/40"}`}>
                  {displayUser?.role.toUpperCase()}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${verificationTag}`}>
                {verificationText}
              </span>
            </div>
          </div>
          {isVisible('role') && displayUser?.role === "admin" && (
            <div className="absolute top-6 right-6 bg-yellow-300/10 px-4 py-1 rounded-full text-sm shadow-md text-yellow-200 border border-yellow-300/20">
              ADMIN ACCESS
            </div>
          )}

          {/* Credit & Debt Card - with Versement Button inside */}
          <div className="w-2/4 mx-auto mt-6 bg-blue-900/30 border border-blue-400/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-300 font-medium">Crédit disponible :</span>
              <div className="flex items-center gap-3">
                <span className="text-blue-200 font-mono text-xl">{displayUser.credit} DA</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-blue-300 font-medium">Créances :</span>
              <span className="text-blue-200 font-mono text-xl">{totalDebt} DA</span>
            </div>

            <div className="w-2/4 mx-auto mt-3 flex justify-center">
              <button
                onClick={() => setShowVersementModal(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition shadow-md"
              >
                + Effectuer un versement
              </button>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-yellow-400/20 p-10">
          <div className="flex justify-between items-center mb-6">
            <Title title="Personal Details" textColor="text-yellow-300" />
          </div>
          <div className="grid grid-cols-2 gap-8 text-gray-200">
            {isVisible('name') && <DetailBox label="Name" value={displayUser?.name} />}
            {isVisible('lastname') && <DetailBox label="Last Name" value={displayUser?.lastname} />}
            {isVisible('role') && <DetailBox label="Role" value={displayUser?.role} />}
            {isVisible('email') && <DetailBox label="Email" value={displayUser?.email} />}
            {isVisible('wilaya') && <DetailBox label="Wilaya" value={displayUser?.wilaya} />}
            {isVisible('commune') && <DetailBox label="Commune" value={displayUser?.commune} />}
            {isVisible('profession') && <DetailBox label="Profession" value={displayUser?.profession} />}
            {isVisible('specialty') && <DetailBox label="Specialty" value={displayUser?.specialty} />}
            {isVisible('registrationNumber') && (
              <DetailBox label="Registration Number" value={displayUser?.registrationNumber} />
            )}
            {isVisible('dateOfBirth') && (
              <DetailBox label="Date of Birth" value={displayUser?.dateOfBirth ? new Date(displayUser.dateOfBirth).toLocaleDateString() : ''} />
            )}
          </div>
        </div>

        {/* Files */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-yellow-400/20 p-10">
          <div className="flex justify-between items-center mb-6">
            <Title title="Files" textColor="text-yellow-300" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {files.filter(file => file.folder !== "profile").map((file) => (
              <FileCard key={file._id} file={file} handleDelete={handleDelete} handleReplace={handleReplace} />
            ))}
            {perform && <AddFileCard onUpload={handleUpload} />}
          </div>
        </div>

        {/* Cotisations */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-yellow-400/20 p-10">
          <div className="flex justify-between items-center mb-6">
            <Title title="Cotisations" textColor="text-yellow-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {userFees && userFees.length > 0 ? (
              userFees.map((fee) => (
                <CotisationCard
                  key={fee._id}
                  cotisation={fee}
                  isOwner={isOwner}
                  onCotisationUpdated={refreshUserFees}
                />
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center py-8">Aucune cotisation trouvée pour ce membre.</p>
            )}
          </div>
        </div>

        {/* Payments */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-yellow-400/20 p-10">
          <div className="flex justify-between items-center mb-6">
            <Title title="Historique des paiements" textColor="text-yellow-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {payments.length > 0 ? (
              payments.map((payment) => <PaymentCard key={payment._id} payment={payment} />)
            ) : (
              <p className="text-gray-400 col-span-full text-center py-8">Aucun paiement enregistré.</p>
            )}
          </div>
        </div>

        {/* Credit Transactions (new section) */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-blue-400/20 p-10">
          <div className="flex justify-between items-center mb-6">
            <Title title="Historique des crédits" textColor="text-blue-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {creditTransactions.length > 0 ? (
              creditTransactions.map((tx) => (
                <CreditTransactionCard key={tx._id} transaction={tx} />
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center py-8">Aucune transaction de crédit trouvée.</p>
            )}
          </div>
        </div>
      </div>

      {/* Versement Modal */}
      {showVersementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 border border-yellow-400/30 shadow-2xl">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">Versement</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Montant (DA)"
                value={versementAmount}
                onChange={(e) => setVersementAmount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 rounded text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
              />
              <select
                value={versementMethod}
                onChange={(e) => setVersementMethod(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 rounded text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
              >
                <option value="cash">Espèces</option>
                <option value="bank_transfer">Virement</option>
                <option value="check">Chèque</option>
                <option value="online">En ligne</option>
                <option value="other">Autre</option>
              </select>
              <textarea
                placeholder="Notes (optionnel)"
                value={versementNotes}
                onChange={(e) => setVersementNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 rounded text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
                rows="2"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowVersementModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition text-white"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const amountNum = parseFloat(versementAmount);
                    if (isNaN(amountNum) || amountNum <= 0) {
                      handlePopup('error', 'Montant invalide');
                      return;
                    }
                    handleVersement(amountNum, versementMethod, versementNotes);
                  }}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition text-white"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailBox({ label, value }) {
  return (
    <div className="p-4 rounded-lg bg-gray-900/40 border border-yellow-400/10">
      <p className="text-yellow-300 text-sm font-medium">{label}</p>
      <p className="text-gray-300 mt-1">{value || '-'}</p>
    </div>
  );
}