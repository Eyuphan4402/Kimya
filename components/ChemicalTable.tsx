
import React from 'react';
import { Chemical, UnitType } from '../types';
import { Icons } from '../constants';

interface ChemicalTableProps {
  chemicals: Chemical[];
  onUpdateStock: (id: string, newStock: number) => void;
  onDelete: (id: string) => void;
  onEdit: (chemical: Chemical) => void;
  onAdd: () => void;
}

const ChemicalTable: React.FC<ChemicalTableProps> = ({ chemicals, onUpdateStock, onDelete, onEdit, onAdd }) => {
  const handleQuickAdjust = (chemical: Chemical, amount: number) => {
    onUpdateStock(chemical.id, chemical.currentStock + amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Envanter</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tüm hammaddeler ve güncel stok durumları</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <Icons.Plus />
          Hammadde Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-6 text-sm font-semibold text-slate-400">Hammadde</th>
                  <th className="px-8 py-6 text-sm font-semibold text-slate-400 text-center">Durum</th>
                  <th className="px-8 py-6 text-sm font-semibold text-slate-400">Güncel Stok</th>
                  <th className="px-8 py-6 text-sm font-semibold text-slate-400 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {chemicals.map((chem) => (
                  <tr key={chem.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: chem.color || '#cbd5e1' }}>
                          {chem.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{chem.name}</p>
                          <p className="text-xs text-slate-400">Eşik: {chem.minThreshold} {chem.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {chem.isInfinite ? (
                        <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-bold rounded-full">Sınırsız</span>
                      ) : chem.currentStock <= chem.minThreshold ? (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">Kritik</span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">Normal</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bold ${!chem.isInfinite && chem.currentStock <= chem.minThreshold ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                          {chem.currentStock} <span className="text-sm font-normal text-slate-400">{chem.unit}</span>
                        </span>
                        {!chem.isInfinite && (
                          <div className="flex items-center gap-1">
                             <button 
                              onClick={() => handleQuickAdjust(chem, -10)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
                              -10
                            </button>
                             <button 
                              onClick={() => handleQuickAdjust(chem, 10)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            >
                              +10
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onEdit(chem)}
                          className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                          title="Düzenle"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm(`${chem.name} silinecektir, emin misiniz?`)) {
                              onDelete(chem.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Sil"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemicalTable;
