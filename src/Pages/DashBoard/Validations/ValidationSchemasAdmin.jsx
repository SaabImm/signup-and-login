import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title';
import { fetchWithRefresh } from '../../../Components/api';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function ValidationSchemasList() {
  const { authData, setAuthData } = useContext(UserContext);
  const navigate = useNavigate();
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const fetchSchemas = async () => {
    try {
      const url = `${API_URL}/validation/schemas?includeInactive=${showInactive}`;
      const res = await fetchWithRefresh(url, { method: 'GET' }, authData.token, setAuthData);
      const data = await res.json();
      console.log(data)
      setSchemas(data.schemas || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authData?.token) fetchSchemas();
  }, [authData?.token, showInactive]);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette version ?')) return;
    try {
      await fetchWithRefresh(`${API_URL}/validation/schemas/${id}`, { method: 'DELETE' }, authData.token, setAuthData);
      fetchSchemas();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRollback = async (schema) => {
    if (!confirm('Rollback to the previous active version? This will change the active schema.')) return;
    try {
      const res = await fetchWithRefresh(
        `${API_URL}/validation/schemas/${schema._id}/rollback`,
        { method: 'POST' },
        authData.token,
        setAuthData
      );
      if (res.ok) {
        alert('Rollback successful');
        fetchSchemas();
      } else {
        const err = await res.json();
        alert(err.message || 'Rollback failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-300">Chargement...</div>;

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
      <div className="flex justify-between items-center mb-6">
        <Title title="Schémas de validation" />
        <button
          onClick={() => navigate('/dash/validation/schemas/new')}
          className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
        >
          + Nouveau schéma
        </button>
      </div>

      <div className="mb-4 flex justify-end">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-4 h-4"
          />
          Afficher les versions inactives
        </label>
      </div>

      <div className="space-y-4">
        {schemas.map(schema => (
          <div key={schema._id} className="bg-gray-800/60 border border-yellow-400/20 rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{schema.name}</h3>
                <div className="text-sm text-gray-400 mt-1">
                  Cible : {schema.targetType} | v{schema.version} | Statut : {schema.isActive ? '✓ Actif' : '✗ Inactif'}
                </div>
                <p className="text-gray-300 mt-2">{schema.description}</p>
                <div className="mt-3 text-xs text-gray-500">
                  {schema.steps?.length} étape(s)
                </div>
              </div>
              <div className="flex gap-2">
                {schema.isActive && schema.status !== 'flawed' && (
                  <button
                    onClick={() => handleRollback(schema)}
                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Rollback
                  </button>
                )}
                <button
                  onClick={() => navigate(`/dash/validation/schemas/${schema._id}/edit`)}
                  className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Modifier
                </button>
                <button
                  onClick={() => navigate(`/dash/validation/schemas/${schema._id}/versions`)}
                  className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Versions
                </button>
                <button
                  onClick={() => handleDelete(schema._id)}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {schemas.length === 0 && <p className="text-center text-gray-400 py-8">Aucun schéma trouvé.</p>}
      </div>
    </div>
  );
}