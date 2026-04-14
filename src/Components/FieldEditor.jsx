// components/FieldEditor.jsx
import RuleListEditor from './RuleListEditor';

const fieldTypes = [
  'text', 'email', 'password', 'number', 'tel', 'date', 'datetime', 'textarea',
  'select', 'multiselect', 'checkbox', 'radio', 'file', 'image', 'richtext'
];

const uiGroups = [
  'personal_info', 'professional_info', 'contact_info',
  'security', 'preferences', 'admin_only', 'public'
];

export default function FieldEditor({ field, onChange, onDelete }) {
  const handleChange = (key, value) => {
    onChange({ ...field, [key]: value });
  };

  const handleNestedChange = (path, value) => {
    const parts = path.split('.');
    const newField = { ...field };
    let target = newField;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!target[parts[i]]) target[parts[i]] = {};
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = value;
    onChange(newField);
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-yellow-300 font-medium">{field.name || 'Nouveau champ'}</h3>
        <button onClick={onDelete} type='button' className="text-red-400 hover:text-red-300">Supprimer</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Basic info */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">Nom</label>
          <input
            type="text"
            value={field.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Label</label>
          <input
            type="text"
            value={field.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Type</label>
          <select
            value={field.type || 'text'}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200"
          >
            {fieldTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Ordre UI</label>
          <input
            type="number"
            value={field.ui?.order || 0}
            onChange={(e) => handleNestedChange('ui.order', parseInt(e.target.value) || 0)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Groupe UI</label>
          <select
            value={field.ui?.group || 'personal_info'}
            onChange={(e) => handleNestedChange('ui.group', e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200"
          >
            {uiGroups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">colSpan</label>
          <input
            type="number"
            min="1"
            max="12"
            value={field.ui?.colSpan || 12}
            onChange={(e) => handleNestedChange('ui.colSpan', parseInt(e.target.value) || 12)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200"
          />
        </div>
      </div>

      {/* Validation */}
      <div className="mt-4">
        <h4 className="text-gray-300 text-sm font-medium mb-2">Validation</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs">Requis</label>
            <input
              type="checkbox"
              checked={field.validation?.required || false}
              onChange={(e) => handleNestedChange('validation.required', e.target.checked)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs">Message requis</label>
            <input
              type="text"
              value={field.validation?.requiredMessage || ''}
              onChange={(e) => handleNestedChange('validation.requiredMessage', e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs">minLength</label>
            <input
              type="number"
              value={field.validation?.minLength || ''}
              onChange={(e) => handleNestedChange('validation.minLength', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs">maxLength</label>
            <input
              type="number"
              value={field.validation?.maxLength || ''}
              onChange={(e) => handleNestedChange('validation.maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="mt-4">
        <h4 className="text-gray-300 text-sm font-medium mb-2">Création (creatableBy)</h4>
        <RuleListEditor
          rules={field.creatableBy || []}
          onChange={(val) => handleChange('creatableBy', val)}
        />
      </div>
      <div className="mt-4">
        <h4 className="text-gray-300 text-sm font-medium mb-2">Édition (editableBy)</h4>
        <RuleListEditor
          rules={field.editableBy || []}
          onChange={(val) => handleChange('editableBy', val)}
        />
      </div>
      <div className="mt-4">
        <h4 className="text-gray-300 text-sm font-medium mb-2">Visibilité (visibleTo)</h4>
        <RuleListEditor
          rules={field.visibleTo || []}
          onChange={(val) => handleChange('visibleTo', val)}
        />
      </div>
    </div>
  );
}