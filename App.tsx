import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputTabs } from './components/InputTabs';
import { FileUpload } from './components/FileUpload';
import { TextInput } from './components/TextInput';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { AlertTriangle, Cpu } from './components/Icons';
import { analyzeOfferLetter } from './services/geminiService';
import { AnalysisResult, InputType } from './types';

const App: React.FC = () => {
  const [inputType, setInputType] = useState<InputType>('file');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setText('');
    setResult(null);
    setError(null);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!file && !text.trim()) {
      setError('Please upload a file or paste text to analyze.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const analysisResult = await analyzeOfferLetter(file, text);
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [file, text]);

  const isSubmitDisabled = (!file && text.trim().length < 50) || isLoading;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto">
        <Header />

        <main className="mt-8 bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8 border border-gray-700">
          <InputTabs selected={inputType} onSelect={setInputType} />

          <div className="mt-6">
            {inputType === 'file' ? (
              <FileUpload onFileChange={handleFileChange} />
            ) : (
              <TextInput value={text} onChange={handleTextChange} />
            )}
          </div>
          
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
           )}

          <div className="mt-8 border-t border-gray-700 pt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="w-full flex items-center justify-center gap-3 rounded-md bg-brand-700 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Analyzing...
                </>
              ) : (
                <>
                  <Cpu className="h-6 w-6" />
                  Verify Offer
                </>
              )}
            </button>
          </div>
        </main>
        
        {isLoading && (
            <div className="mt-8 text-center text-gray-500">
                <p>AI is analyzing the document. This may take a moment...</p>
            </div>
        )}
        
        {result && (
          <div className="mt-8">
            <ResultDisplay result={result} />
          </div>
        )}
      </div>
       <footer className="text-center mt-12 text-gray-600 text-sm">
            <p>Powered by Google Gemini. For informational purposes only.</p>
        </footer>
    </div>
  );
};

export default App;