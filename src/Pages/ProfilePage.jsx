import Title from '../Components/Title';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/dataCont";
import { useParams } from "react-router-dom";

import sabAvatar from '../assets/SabrinaAvatar.jpg';
import FileCard from '../Components/Cards/FileCrad';
import CotisationCard from '../Components/Cards/CotisationCard';
import AddFileCard from '../Components/Cards/AddFileCard';

const API_URL = import.meta.env.VITE_API_URL;

// Petit composant pour afficher un paiement
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

export default function ProfilePage({ user }) {
  const { authData, setAuthData } = useContext(UserContext);
  const { id } = useParams();

  const [displayUser, setDisplayUser] = useState(user || authData.user);
  const [permissions, setPermissions] = useState(null);
  const [perform, setPerform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [payments, setPayments] = useState([]); // ← nouvel état

  const targetUserId = user?._id || id || authData.user?._id;
  const isOwner = authData.user?._id === targetUserId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Récupérer les données utilisateur
        let userData = user;
        if (!userData && id) {
          const userRes = await fetch(`${API_URL}/user/${id}`, {
            headers: { Authorization: `Bearer ${authData.token}` }
          });
          const result = await userRes.json();
          userData = result.user;
        }
        setDisplayUser(userData || authData.user);

        // 2. Permissions (champs visibles)
        const permRes = await fetch(`${API_URL}/permissions/user/${targetUserId}/vwFields?model=User`, {
          headers: { Authorization: `Bearer ${authData.token}` }
        });
        const permData = await permRes.json();
        setPermissions(permData);

        // 3. Opérations autorisées (pour les fichiers)
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

        // 4. Récupérer les paiements de l'utilisateur
        const paymentsRes = await fetch(`${API_URL}/payement/user/${targetUserId}`, {
          headers: { Authorization: `Bearer ${authData.token}` }
        });
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          setPayments(paymentsData);
        } else {
          console.warn("Impossible de charger les paiements");
        }

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

  const PROFILE_URL = displayUser?.profilePicture || sabAvatar;
  const files = displayUser?.files || [];
  const fees = displayUser?.fees;

  const roleColors = {
    admin: "bg-red-200/20 text-red-300 border-red-400/40",
    user: "bg-blue-200/20 text-blue-300 border-blue-400/40",
    moderator: "bg-purple-200/20 text-purple-300 border-purple-400/40",
  };

  const verificationTag = displayUser?.isAdminVerified
    ? "bg-slate-200/20 text-slate-100 border-slate-300/30"
    : "bg-yellow-400/20 text-yellow-300 border-yellow-400/40";

  const verificationText = displayUser?.isAdminVerified ? "Validated" : "Pending Validation";

  // --- Handlers ---
  const handlePopup = (type, message, duration = 3000) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), duration);
  };

  const handleUpload = async (file) => { /* inchangé */ };
  const handleReplace = async (file, newFile) => { /* inchangé */ };
  const handleDelete = async (file) => { /* inchangé */ };

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
        {/* Spinner, popup, gold cover... (inchangé) */}
        {isUploading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
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

        <div className="h-40 bg-yellow-400/80 shadow-md"></div>

        {/* --- PROFILE CARD --- */}
        <div className="w-3/4 mx-auto -mt-20 bg-gray-800/80 backdrop-blur-xl border border-yellow-400/30 rounded-xl shadow-xl p-10 flex gap-10 items-center relative">
          {/* Avatar */}
          {displayUser?.profilePicture && (
            <img src={PROFILE_URL} alt="Profile" className="w-40 h-40 object-cover rounded-full border-4 border-yellow-300 shadow-[0_0_20px_rgba(255,215,100,0.4)]" />
          )}
          {/* Infos principales */}
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
          {/* Admin tag */}
          {isVisible('role') && displayUser?.role === "admin" && (
            <div className="absolute top-6 right-6 bg-yellow-300/10 px-4 py-1 rounded-full text-sm shadow-md text-yellow-200 border border-yellow-300/20">
              ADMIN ACCESS
            </div>
          )}

          {/* --- CRÉDIT & CRÉANCE --- */}
          <div className="w-2/4 mx-auto mt-6 bg-blue-900/30 border border-blue-400/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-300 font-medium">Crédit disponible :</span>
              <span className="text-blue-200 font-mono text-xl">{displayUser.credit} DA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-300 font-medium">Créance :</span>
              <span className="text-blue-200 font-mono text-xl">{displayUser.totalDebt} DA</span>
            </div>
          </div>
        </div>

        {/* --- PERSONAL DETAILS --- */}
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

        {/* --- FILES --- */}
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

        {/* --- COTISATIONS --- */}
        <div className="w-3/4 mx-auto mt-12 bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-yellow-400/20 p-10">
          <div className="flex justify-between items-center mb-6">
            <Title title="Cotisations" textColor="text-yellow-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {fees && fees.length > 0 ? (
              fees.map((fee) => <CotisationCard key={fee._id} cotisation={fee} />)
            ) : (
              <p className="text-gray-400 col-span-full text-center py-8">Aucune cotisation trouvée pour ce membre.</p>
            )}
          </div>
        </div>

        {/* --- PAIEMENTS --- */}
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
      </div>
    </>
  );
}

// --- DetailBox Component ---
function DetailBox({ label, value }) {
  return (
    <div className="p-4 rounded-lg bg-gray-900/40 border border-yellow-400/10">
      <p className="text-yellow-300 text-sm font-medium">{label}</p>
      <p className="text-gray-300 mt-1">{value || '-'}</p>
    </div>
  );
}