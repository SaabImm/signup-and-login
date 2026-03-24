// components/RuleListEditor.jsx
const availableRoles = [
  { name: 'user', level: 0 },
  { name: 'moderator', level: 1 },
  { name: 'admin', level: 2 },
  { name: 'super_admin', level: 3 },
  { name: 'any', level: null } // special: we'll map condition later
];

const conditionOptions = [
  'self', 'any', 'same_tenant', 'tenant_admin', 'higher_level', 'lower_level', 'same_level', 'custom'
];

export default function RuleListEditor({ rules, onChange }) {
  const addRule = () => {
    onChange([...rules, { role: { name: 'user', level: 0 }, condition: 'any' }]);
  };

  const removeRule = (index) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index, field, value) => {
    const newRules = [...rules];
    if (field === 'role') {
      const selectedRole = availableRoles.find(r => r.name === value);
      newRules[index].role = { name: value, level: selectedRole.level };
    } else {
      newRules[index][field] = value;
    }
    onChange(newRules);
  };

  return (
    <div className="space-y-2">
      {rules.map((rule, idx) => (
        <div key={idx} className="flex items-center gap-2 bg-gray-700/50 p-2 rounded">
          <select
            value={rule.role.name}
            onChange={(e) => updateRule(idx, 'role', e.target.value)}
            className="bg-gray-800 text-gray-200 border border-gray-600 rounded px-2 py-1 text-sm"
          >
            {availableRoles.map(r => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
          <select
            value={rule.condition}
            onChange={(e) => updateRule(idx, 'condition', e.target.value)}
            className="bg-gray-800 text-gray-200 border border-gray-600 rounded px-2 py-1 text-sm"
          >
            {conditionOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => removeRule(idx)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRule}
        className="text-sm text-yellow-300 hover:text-yellow-400"
      >
        + Ajouter une règle
      </button>
    </div>
  );
}