// pages/DashBoard/Validation/EditValidationSchema.jsx
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

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetchWithRefresh(
          `${API_URL}/validation/schemas/${schemaId}`,
          { method: 'GET' },
          authData.token,
          setAuthData
        );
        const data = await res.json();
        if (res.ok) {
          setInitialData(data.schema || data);
        } else {
          alert(data.message || 'Erreur lors du chargement');
          navigate('/dash/validation/schemas');
        }
      } catch (err) {
        console.error(err);
        alert('Erreur réseau');
        navigate('/dash/validation/schemas');
      } finally {
        setLoading(false);
      }
    };
    if (authData?.token) fetchSchema();
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
    />
  );
}