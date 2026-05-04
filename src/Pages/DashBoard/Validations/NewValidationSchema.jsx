import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/dataCont';
import { fetchWithRefresh } from '../../../Components/api';
import ValidationSchemaForm from '../../../Components/Modals/ValidationSchemaForm';

const API_URL = import.meta.env.VITE_API_URL;

export default function NewValidationSchema() {
  const { authData, setAuthData } = useContext(UserContext);
  const navigate = useNavigate();
  const [allowedFields, setAllowedFields] = useState(null);
  const [fieldConfigs, setFieldConfigs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatableFields = async () => {
      try {
        const res = await fetchWithRefresh(
          `${API_URL}/permissions/user/${authData.user._id}/crFields?model=Validation`,
          { method: 'GET' },
          authData.token,
          setAuthData
        );
        const data = await res.json();
        if (res.ok) {
          setAllowedFields(data.fields || []);
          setFieldConfigs(data.configs || {});
        } else {
          console.warn('Could not fetch creatable fields, using all fields');
          setAllowedFields(null);
        }
      } catch (err) {
        console.warn('Could not fetch creatable fields, using all fields', err);
        setAllowedFields(null);
      } finally {
        setLoading(false);
      }
    };
    if (authData?.token) fetchCreatableFields();
  }, [authData?.token]);

  if (loading) return <div className="text-yellow-300">Chargement...</div>;

  return (
    <ValidationSchemaForm
      initialData={null}
      schemaId={null}
      onSuccess={() => navigate('/dash/validation/schemas')}
      allowedFields={allowedFields}
      fieldConfigs={fieldConfigs}
    />
  );
}