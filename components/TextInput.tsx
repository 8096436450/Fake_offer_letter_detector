import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-1">
        Paste Offer Letter Text
      </label>
      <textarea
        id="text-input"
        value={value}
        onChange={onChange}
        rows={8}
        className="block w-full rounded-md border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-gray-950 placeholder:text-gray-500 text-gray-200 transition-colors"
        placeholder="Paste the full text of your offer letter here. Minimum 50 characters required."
      />
    </div>
  );
};