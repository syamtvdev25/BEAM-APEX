
import React from 'react';
import { ItemVariant } from './ItemQueryScreen';

interface KpiFieldProps {
  label: string;
  value: string | number;
}

const KpiField: React.FC<KpiFieldProps> = ({ label, value }) => (
  <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm transition-all active:scale-[0.98] flex flex-col justify-center min-h-[70px]">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 leading-tight">
      {label}
    </label>
    <span className="text-sm font-black text-slate-800 truncate">
      {value}
    </span>
  </div>
);

interface GroupHeaderProps {
  title: string;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ title }) => (
  <div className="col-span-2 mt-4 mb-2">
    <div className="flex items-center space-x-3">
      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] whitespace-nowrap">
        {title}
      </h4>
      <div className="flex-1 h-[1px] bg-slate-100"></div>
    </div>
  </div>
);

const ProductDetailsPopup: React.FC<{ selectedVariant?: ItemVariant }> = ({ selectedVariant }) => {
  return (
    <div className="flex flex-col pb-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-3">
        
        {/* Commercial Section */}
        <GroupHeader title="Commercial" />
        <KpiField label="Unit Name" value="Nos" />
        <KpiField label="Currency" value="EUR" />
        <KpiField label="Min. Order Qty" value="0.00" />
        <KpiField label="Safety Stock" value="0.00" />

        {/* Regulatory & Logistics Section */}
        <GroupHeader title="Regulatory & Logistics" />
        <KpiField label="Shelf Life" value="0.00" />
        <KpiField label="HS Code" value="87088000" />
        <KpiField label="Country Made" value="GERMANY" />
        <KpiField label="Packing" value="1" />

        {/* Physical Dimensions Section */}
        <GroupHeader title="Physical Dimensions" />
        <KpiField label="Length" value="0.00" />
        <KpiField label="Width" value="0.00" />
        <KpiField label="Height" value="0.00" />
        <KpiField label="Weight" value="3.40" />
        <KpiField label="Volume" value="0.00" />

        {/* System Flags Section */}
        <GroupHeader title="System Flags" />
        <KpiField label="Use in Packing" value="True" />
        <KpiField label="Use in Bill Entry" value="Yes" />

      </div>

      <div className="mt-8 bg-slate-50/50 border border-slate-200/40 rounded-2xl p-4 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">
          Master data dimensions are derived from technical datasheets.
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsPopup;
