
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AxlesScreen: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="px-6 py-4 border-b flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 text-blue-600 font-bold">← Back</button>
        <h2 className="text-xl font-bold">Axles Screen</h2>
      </header>
      <main className="p-8">
        <h1 className="text-2xl text-gray-800">Axle Components</h1>
        <p className="text-gray-500 mt-2">Details and parts search for vehicle axles.</p>
      </main>
    </div>
  );
};

export default AxlesScreen;
