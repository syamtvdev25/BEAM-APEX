
import React from 'react';
import { ItemVariant } from './ItemQueryScreen';

interface GeneralData {
  code: string;
  name: string;
  description: string;
  manufacturer: string;
  group: string;
  subGroup: string;
  brand: string;
  suffix: string;
  createdBy: string;
  createdDate: string;
  remarksSales: string;
  remarksPurchase: string;
}

const getDummyData = (variant?: ItemVariant): GeneralData => ({
  code: variant?.partNo || '316.699',
  name: 'DB CAB SUSPENSION DAMPER',
  description: 'DB CAB SUSPENSION DAMPER',
  manufacturer: 'Mercedes Benz-Truck',
  group: 'Other applications',
  subGroup: 'Shock absorber cab',
  brand: variant?.brand || 'SACHS',
  suffix: variant?.suffix || 'SX',
  createdBy: 'admin',
  createdDate: '18/07/2017',
  remarksSales: '',
  remarksPurchase: '',
});

interface InfoFieldProps {
  label: string;
  value: string | number;
  fullWidth?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, fullWidth }) => (
  <div className={`${fullWidth ? 'col-span-1 md:col-span-3' : 'col-span-1'} flex flex-col space-y-1`}>
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm min-h-[46px] flex items-center">
      <span className="text-sm font-bold text-gray-800 truncate">
        {value === '' || value === null || value === undefined ? <span className="text-gray-200">—</span> : value}
      </span>
    </div>
  </div>
);

const GeneralPopup: React.FC<{ selectedVariant?: ItemVariant }> = ({ selectedVariant }) => {
  const data = getDummyData(selectedVariant);

  const sections = [
    {
      title: "IDENTIFICATION",
      fields: [
        { key: 'code', label: 'CODE' },
        { key: 'brand', label: 'BRAND' },
        { key: 'suffix', label: 'SUFFIX' },
        { key: 'name', label: 'NAME', fullWidth: true },
        { key: 'description', label: 'DESCRIPTION', fullWidth: true },
      ]
    },
    {
      title: "CLASSIFICATION",
      fields: [
        { key: 'manufacturer', label: 'MANUFACTURER' },
        { key: 'group', label: 'GROUP' },
        { key: 'subGroup', label: 'SUBGROUP' },
      ]
    },
    {
      title: "SYSTEM LOGS",
      fields: [
        { key: 'createdBy', label: 'CREATED BY' },
        { key: 'createdDate', label: 'CREATED DATE' },
      ]
    },
    {
      title: "REMARKS",
      fields: [
        { key: 'remarksSales', label: 'REMARKS SALES', fullWidth: true },
        { key: 'remarksPurchase', label: 'REMARKS (PURCHASE)', fullWidth: true },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-6 animate-in fade-in duration-500">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-4">
          <div className="flex items-center space-x-3">
            <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.2em]">
              {section.title}
            </h4>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.fields.map((field) => (
              <InfoField
                key={field.key}
                label={field.label}
                value={(data as any)[field.key]}
                fullWidth={field.fullWidth}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight text-center italic">
          Master data identity fields are managed by the Head of Procurement.
        </p>
      </div>
    </div>
  );
};

export default GeneralPopup;
