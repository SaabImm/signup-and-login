import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/dataCont';
import { fetchWithRefresh } from '../../../Components/api';
import ValidationSchemaForm from '../../../Components/Modals/ValidationSchemaForm';

const API_URL = import.meta.env.VITE_API_URL;

export default function EditValidationSchema() {
  const { schemaId } = useParams();
  const navigate = useNavigate();
  const { authData, setAuthData } = useContext(UserContext);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Optional: state for permission‑based field filtering
  const [allowedFields, setAllowedFields] = useState(null);
  const [fieldConfigs, setFieldConfigs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch schema data
        const schemaRes = await fetchWithRefresh(
          `${API_URL}/validation/schemas/${schemaId}`,
          { method: 'GET' },
          authData.token,
          setAuthData
        );
        const schemaData = await schemaRes.json();
        if (!schemaRes.ok) throw new Error(schemaData.message);
        setInitialData(schemaData.schema || schemaData);

        // 2. (Optional) Fetch editable fields for this model
        try {
          const permRes = await fetchWithRefresh(
            `${API_URL}/permissions/user/${authData.user._id}/fields?model=Validation`,
            { method: 'GET' },
            authData.token,
            setAuthData
          );
          const permData = await permRes.json();
          if (permRes.ok) {
            setAllowedFields(permData.fields || []);
            setFieldConfigs(permData.configs || {});
          }
        } catch (permErr) {
          console.warn('Could not fetch editable fields, using all fields', permErr);
          // Fallback: allow all fields (default behaviour)
          setAllowedFields(null);
        }
      } catch (err) {
        console.error(err);
        alert(err.message || 'Erreur lors du chargement');
        navigate('/dash/validation/schemas');
      } finally {
        setLoading(false);
      }
    };
    if (authData?.token) fetchData();
  }, [schemaId, authData?.token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-300">
        Chargement...
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <ValidationSchemaForm
      initialData={initialData}
      schemaId={schemaId}
      onSuccess={() => navigate('/dash/validation/schemas')}
      allowedFields={allowedFields}
      fieldConfigs={fieldConfigs}
    />
  );
}