// pages/DashBoard/Validation/NewValidationSchema.jsx
import React from 'react';
import ValidationSchemaForm from '../../../Components/Modals/ValidationSchemaForm';

export default function NewValidationSchema() {
  return (
    <ValidationSchemaForm
      initialData={null}
      schemaId={null}
      onSuccess={() => {}}
    />
  );
}