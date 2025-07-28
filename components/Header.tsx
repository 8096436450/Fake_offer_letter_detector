import React from 'react';
import { Cog } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-3">
        <Cog className="w-10 h-10 text-brand-500 animate-spin [animation-duration:10s]" />
        <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl uppercase">
          OfferSecure
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400">
        AI-powered verification to help you distinguish genuine job offers from scams.
      </p>
    </header>
  );
};