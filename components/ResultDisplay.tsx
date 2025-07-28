import React from 'react';
import type { AnalysisResult, KeyIndicator } from '../types';
import { CheckCircle2, XCircle, AlertTriangle } from './Icons';

interface ResultDisplayProps {
  result: AnalysisResult;
}

const statusIcons = {
  Pass: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  Fail: <XCircle className="h-5 w-5 text-red-500" />,
  Warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
};

const Indicator: React.FC<{ item: KeyIndicator }> = ({ item }) => (
  <li className="flex items-start space-x-4 py-3">
    <div className="flex-shrink-0 mt-0.5">{statusIcons[item.status]}</div>
    <div>
      <p className="font-semibold text-gray-100">{item.indicator}</p>
      <p className="text-gray-300">{item.details}</p>
    </div>
  </li>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { isGenuine, reason, keyIndicators } = result;
  
  const verdictClasses = isGenuine
    ? 'bg-green-900/50 text-green-300'
    : 'bg-red-900/50 text-red-300';
  
  const VerdictIcon = isGenuine ? CheckCircle2 : XCircle;
  const verdictText = isGenuine ? 'Appears Genuine' : 'Potential Fake Detected';
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 animate-fade-in">
      <div className={`p-6 rounded-t-lg ${verdictClasses}`}>
        <div className="flex items-center gap-3">
          <VerdictIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">{verdictText}</h2>
            <p className="font-medium mt-1">{reason}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Analysis Breakdown</h3>
        <ul className="divide-y divide-gray-700">
          {keyIndicators.map((item, index) => (
            <Indicator key={index} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};