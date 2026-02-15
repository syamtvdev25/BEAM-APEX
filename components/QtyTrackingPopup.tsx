
import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  docNo: string;
  type: 'IN' | 'OUT';
  qty: number;
  balance: number;
}

const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '12/05/2024', docNo: 'PO-2024-001', type: 'IN', qty: 50, balance: 50 },
  { id: '2', date: '15/05/2024', docNo: 'SO-9921', type: 'OUT', qty: 10, balance: 40 },
  { id: '3', date: '16/05/2024', docNo: 'SO-9945', type: 'OUT', qty: 5, balance: 35 },
  { id: '4', date: '20/05/2024', docNo: 'PO-2024-008', type: 'IN', qty: 25, balance: 60 },
  { id: '5', date: '22/05/2024', docNo: 'ADJ-001', type: 'OUT', qty: 2, balance: 58 },
  { id: '6', date: '01/06/2024', docNo: 'SO-10021', type: 'OUT', qty: 15, balance: 43 },
  { id: '7', date: '05/06/2024', docNo: 'SO-10034', type: 'OUT', qty: 8, balance: 35 },
  { id: '8', date: '10/06/2024', docNo: 'PO-2024-015', type: 'IN', qty: 40, balance: 75 },
  { id: '9', date: '12/06/2024', docNo: 'SO-10088', type: 'OUT', qty: 20, balance: 55 },
  { id: '10', date: '15/06/2024', docNo: 'SO-10112', type: 'OUT', qty: 10, balance: 45 },
];

const QtyTrackingPopup: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleApply = () => {
    alert(`Filtering from ${dateFrom || 'start'} to ${dateTo || 'end'}`);
  };

  return (
    <div className="flex flex-col space-y-4 pb-6">
      {/* Filter Row */}
      <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex-1 flex space-x-2">
          <div className="flex-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Date From</label>
            <input 
              type="text" 
              placeholder="DD/MM/YYYY" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-800 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Date To</label>
            <input 
              type="text" 
              placeholder="DD/MM/YYYY" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-800 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleApply}
            className="w-full sm:w-auto px-6 py-2 bg-blue-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-blue-900/10 h-[36px]"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Transaction List Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 grid grid-cols-5 gap-2 text-center">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Doc No</span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Type</span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qty</span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bal</span>
        </div>
        
        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
          {DUMMY_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="px-4 py-3 grid grid-cols-5 gap-2 text-center items-center hover:bg-blue-50/30 transition-colors">
              <span className="text-[10px] font-bold text-gray-500">{tx.date}</span>
              <span className="text-[10px] font-black text-blue-900 truncate px-1">{tx.docNo}</span>
              <span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${
                  tx.type === 'IN' 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {tx.type}
                </span>
              </span>
              <span className={`text-[10px] font-black ${tx.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'IN' ? '+' : '-'}{tx.qty}
              </span>
              <span className="text-[10px] font-black text-gray-800">{tx.balance}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex justify-between items-center px-2">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Showing last 10 transactions
        </p>
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline">
          View Full History →
        </button>
      </div>
    </div>
  );
};

export default QtyTrackingPopup;
