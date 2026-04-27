import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { fetchWithRefresh } from '../../../Components/api';

const API_URL = import.meta.env.VITE_API_URL;

export default function ValidationSchemaVersions() {
  const { schemaId } = useParams();
  const navigate = useNavigate();
  const { authData, setAuthData } = useContext(UserContext);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schemaName, setSchemaName] = useState('');

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await fetchWithRefresh(
          `${API_URL}/validation/schemas/${schemaId}/versions`,
          { method: 'GET' },
          authData.token,
          setAuthData
        );
        const data = await res.json();
        setVersions(data.versions);
        if (data.versions.length) setSchemaName(data.versions[0].name);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (authData?.token) fetchVersions();
  }, [schemaId, authData?.token]);

  const handleReactivate = async (versionId) => {
    if (!confirm('Réactiver cette version ? Elle deviendra active et l\'ancienne version active sera archivée.')) return;
    try {
      const res = await fetchWithRefresh(
        `${API_URL}/validation/schemas/${versionId}/reactivateVersion`,
        { method: 'POST' },
        authData.token,
        setAuthData
      );
      if (res.ok) {
        alert('Version réactivée avec succès');
        // Rafraîchir la liste
        const updated = await fetchWithRefresh(
          `${API_URL}/validation/schemas/${schemaId}/versions`,
          { method: 'GET' },
          authData.token,
          setAuthData
        );
        const data = await updated.json();
        setVersions(data.versions);
      } else {
        const err = await res.json();
        alert(err.message || 'Échec de la réactivation');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-300">Chargement...</div>;

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <Title title={`Versions du schéma : ${schemaName}`} />
      <div className="mt-6 space-y-4">
        {versions.map(version => (
          <div key={version._id} className="bg-gray-800/60 border border-yellow-400/20 rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">Version {version.version}</h3>
                <div className="text-sm text-gray-400 mt-1">
                  Statut : {version.isActive ? '✓ Actif' : '✗ Inactif'} | Status: {version.status}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Créée le {new Date(version.createdAt).toLocaleString()}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {version.steps?.length} étape(s)
                </div>
              </div>
              <div className="flex gap-2">
                {!version.isActive && version.status !== 'flawed' && (
                  <button
                    onClick={() => handleReactivate(version._id)}
                    className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                  >
                    Réactiver
                  </button>
                )}
                <button
                  onClick={() => navigate(`/dash/validation/schemas/${version._id}/edit`)}
                  className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
        {versions.length === 0 && <p className="text-center text-gray-400 py-8">Aucune version trouvée.</p>}
      </div>
    </div>
  );
}