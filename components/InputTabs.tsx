import React from 'react';
import { InputType } from '../types';
import { FileUp, PencilLine } from './Icons';

interface InputTabsProps {
  selected: InputType;
  onSelect: (type: InputType) => void;
}

export const InputTabs: React.FC<InputTabsProps> = ({ selected, onSelect }) => {
  const getTabClasses = (type: InputType) => {
    const isSelected = selected === type;
    return `w-1/2 flex justify-center items-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 dark:focus-visible:ring-offset-gray-900 ${
      isSelected
        ? 'bg-gray-700 text-brand-400'
        : 'text-gray-400 hover:bg-gray-700/50'
    }`;
  };

  return (
    <div className="flex space-x-2 rounded-lg bg-gray-800 p-1">
      <button className={getTabClasses('file')} onClick={() => onSelect('file')}>
        <FileUp className="h-5 w-5" />
        Upload File
      </button>
      <button className={getTabClasses('text')} onClick={() => onSelect('text')}>
        <PencilLine className="h-5 w-5" />
        Paste Text
      </button>
    </div>
  );
};