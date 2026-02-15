
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ImportScreen: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="px-6 py-4 border-b flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 text-blue-600 font-bold">← Back</button>
        <h2 className="text-xl font-bold">Import Screen</h2>
      </header>
      <main className="p-8">
        <h1 className="text-2xl text-gray-800">Data Import</h1>
        <p className="text-gray-500 mt-2">Upload and synchronize external data sources.</p>
      </main>
    </div>
  );
};

export default ImportScreen;
