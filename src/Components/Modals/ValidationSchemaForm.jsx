import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/dataCont';
import { fetchWithRefresh } from '../../Components/api';

const API_URL = import.meta.env.VITE_API_URL;

const STEP_ROLES = ['user', 'moderator', 'admin', 'super_admin'];
const REJECT_ACTIONS = ['reject_request', 'escalate', 'skip_step', 'notify_only', 'wait_for_another', 'cancel_request'];
const TIMEOUT_ACTIONS = ['reject_step', 'cancel_request', 'escalate'];

// Custom Multi‑Select component (dropdown with checkboxes)
function MultiSelect({ options, value = [], onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const selectedLabels = options
    .filter(opt => value.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 cursor-pointer"
      >
        {selectedLabels || placeholder || 'Sélectionner...'}
      </div>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map(opt => (
            <label key={opt.value} className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
                className="mr-2 w-4 h-4"
              />
              <span className="text-gray-200">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ValidationSchemaForm({ initialData, schemaId, onSuccess }) {
  const { authData, setAuthData } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersByRole, setUsersByRole] = useState({});
  const [formData, setFormData] = useState({
    targetType: initialData?.targetType || 'User',
    name: initialData?.name || '',
    description: initialData?.description || '',
    steps: initialData?.steps || [],
    globalTimeout: initialData?.globalTimeout || { duration: 0, action: 'reject' },
    globalRejectAction: initialData?.globalRejectAction || 'reject_request',
    globalEscalateToRole: initialData?.globalEscalateToRole || 'admin',
    notificationConfig: initialData?.notificationConfig || { methods: { email: true, system: false } }
  });

  const fetchUsersByRole = async (role) => {
    if (usersByRole[role]) return usersByRole[role];
    setLoadingUsers(true);
    try {
      const res = await fetchWithRefresh(`${API_URL}/user/role/${role}`, { method: 'GET' }, authData.token, setAuthData);
      const data = await res.json();
      const users = data.Users || [];
      setUsersByRole(prev => ({ ...prev, [role]: users }));
      return users;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoadingUsers(false);
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        {
          stepName: '',
          requiredRole: 'admin',
          order: formData.steps.length + 1,
          required: true,
          allowedUserIds: [],
          timeout: { duration: 0, action: 'reject_step', escalateToRole: 'admin' },
          rejectAction: 'reject_request',
          escalateToRole: 'super_admin',
          description: ''
        }
      ]
    });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.steps];
    if (field === 'timeout') {
      newSteps[index].timeout = { ...newSteps[index].timeout, ...value };
    } else {
      newSteps[index] = { ...newSteps[index], [field]: value };
    }
    setFormData({ ...formData, steps: newSteps });
  };

  const deleteStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    newSteps.forEach((step, idx) => (step.order = idx + 1));
    setFormData({ ...formData, steps: newSteps });
  };

  const handleRoleChange = async (index, newRole) => {
    updateStep(index, 'requiredRole', newRole);
    updateStep(index, 'allowedUserIds', []);
    await fetchUsersByRole(newRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `${API_URL}/validation/schemas/${schemaId}` : `${API_URL}/validation/schemas`;
      await fetchWithRefresh(
        url,
        { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) },
        authData.token,
        setAuthData
      );
      onSuccess?.();
      navigate('/dash/validation/schemas');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’enregistrement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const preFetch = async () => {
      const roles = new Set(formData.steps.map(s => s.requiredRole));
      for (const role of roles) {
        if (role && !usersByRole[role]) {
          await fetchUsersByRole(role);
        }
      }
    };
    if (authData?.token && formData.steps.length) preFetch();
  }, [formData.steps, authData?.token]);

  return (
    <div className="min-h-screen ml-[80px] p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-5xl mx-auto bg-gray-800/80 backdrop-blur-xl border border-yellow-400/20 rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-yellow-300 mb-6">
          {initialData ? 'Modifier le schéma' : 'Nouveau schéma de validation'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General info */}
          <div className="bg-gray-900/40 border border-yellow-400/10 rounded-lg p-5 space-y-4">
            <h3 className="text-lg font-semibold text-yellow-300">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nom du schéma</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type de cible</label>
                <select
                  value={formData.targetType}
                  onChange={e => setFormData({ ...formData, targetType: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                >
                  <option value="User">Utilisateur</option>
                  <option value="File">Fichier</option>
                  <option value="Cotisation">Cotisation</option>
                  <option value="Custom">Personnalisé</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="bg-gray-900/40 border border-yellow-400/10 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-300">Étapes du workflow</h3>
              <button type="button" onClick={addStep} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                + Ajouter une étape
              </button>
            </div>

            {formData.steps.length === 0 && (
              <p className="text-gray-400 italic text-center py-4">Aucune étape. Cliquez sur "Ajouter une étape" pour commencer.</p>
            )}

            {formData.steps.map((step, idx) => {
              const usersForRole = usersByRole[step.requiredRole] || [];
              const userOptions = usersForRole.map(u => ({
                value: u._id,
                label: `${u.name} ${u.lastname} (${u.email})`
              }));
              return (
                <div key={idx} className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 mb-5 shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-semibold text-yellow-200">Étape {step.order}</h4>
                    <div className="flex items-center gap-3">
                      {/* Toggle switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={step.required}
                          onChange={e => updateStep(idx, 'required', e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                        <span className="ml-2 text-sm text-gray-300">Requis</span>
                      </label>
                      <button type="button" onClick={() => deleteStep(idx)} className="text-red-400 text-sm hover:text-red-300">
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Nom de l'étape</label>
                      <input
                        type="text"
                        value={step.stepName}
                        onChange={e => updateStep(idx, 'stepName', e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Rôle requis</label>
                      <select
                        value={step.requiredRole}
                        onChange={e => handleRoleChange(idx, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                      >
                        {STEP_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Utilisateurs autorisés</label>
                      {loadingUsers && usersForRole.length === 0 ? (
                        <div className="text-sm text-gray-400">Chargement...</div>
                      ) : (
                        <MultiSelect
                          options={userOptions}
                          value={step.allowedUserIds || []}
                          onChange={(selected) => updateStep(idx, 'allowedUserIds', selected)}
                          placeholder="Sélectionner des utilisateurs..."
                        />
                      )}
                      <p className="text-xs text-gray-400 mt-1">Laissez vide pour autoriser tout le rôle.</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Action en cas de rejet</label>
                      <select
                        value={step.rejectAction}
                        onChange={e => updateStep(idx, 'rejectAction', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                      >
                        {REJECT_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Rôle d'escalade (si action='escalate')</label>
                      <select
                        value={step.escalateToRole || 'admin'}
                        onChange={e => updateStep(idx, 'escalateToRole', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                      >
                        {STEP_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Timeout (heures, 0 = désactivé)</label>
                      <input
                        type="number"
                        value={step.timeout.duration}
                        onChange={e => updateStep(idx, 'timeout', { duration: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Action du timeout</label>
                      <select
                        value={step.timeout.action}
                        onChange={e => updateStep(idx, 'timeout', { action: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                      >
                        {TIMEOUT_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-300 mb-1">Description de l'étape</label>
                    <textarea
                      value={step.description}
                      onChange={e => updateStep(idx, 'description', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Global config */}
          <div className="bg-gray-900/40 border border-yellow-400/10 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4">Configuration globale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Timeout global (heures)</label>
                <input
                  type="number"
                  value={formData.globalTimeout.duration}
                  onChange={e => setFormData({ ...formData, globalTimeout: { ...formData.globalTimeout, duration: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Action globale du timeout</label>
                <select
                  value={formData.globalTimeout.action}
                  onChange={e => setFormData({ ...formData, globalTimeout: { ...formData.globalTimeout, action: e.target.value } })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                >
                  <option value="reject">Rejeter la demande</option>
                  <option value="cancel">Annuler la demande</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Action de rejet globale</label>
                <select
                  value={formData.globalRejectAction}
                  onChange={e => setFormData({ ...formData, globalRejectAction: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                >
                  {REJECT_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button type="button" onClick={() => navigate('/dash/validation/schemas')} className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-200">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-500 text-white disabled:opacity-50">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}