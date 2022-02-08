import React from 'react';

export const Label = (
  props: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
) => <label className="block text-sm font-medium text-gray-700" {...props} />;
