import React, { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X } from './Icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileChange(file);
    }
  }, [onFileChange]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);
        onFileChange(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileChange(null);
  };

  return (
    <div>
      <label
        htmlFor="dropzone-file"
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-800/50 transition-colors duration-200 ${
          dragActive 
            ? 'border-brand-500 bg-brand-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold text-gray-300">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleChange}/>
      </label>

      {selectedFile && (
        <div className="mt-4 p-3 rounded-lg bg-gray-800 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="truncate text-gray-300">{selectedFile.name}</span>
            </div>
            <button 
                onClick={handleRemoveFile} 
                className="p-1 rounded-full text-gray-400 hover:bg-gray-700 transition-colors"
                aria-label="Remove file"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
      )}
    </div>
  );
};