
import React from 'react';
import { ProductionLog } from '../types';

interface ProductionHistoryProps {
  logs: ProductionLog[];
}

const ProductionHistory: React.FC<ProductionHistoryProps> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  // Group by date
  const groupedLogs = sortedLogs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, ProductionLog[]>);

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Üretim Günlüğü</h2>
        <p className="text-slate-500 dark:text-slate-400">Geçmişe dönük üretim kayıtları ve malzeme kullanımı</p>
      </div>

      <div className="space-y-12">
        {/* Fix: Explicitly type the entries to prevent 'unknown' type error on dayLogs */}
        {Object.entries(groupedLogs).map(([date, dayLogs]: [string, ProductionLog[]]) => (
          <div key={date} className="relative pl-10 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              {date}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dayLogs.map((log) => (
                <div key={log.id} className="bg-white dark:bg-slate-900 rounded-5xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white">{log.recipeName}</h4>
                      <p className="text-slate-400 text-sm font-medium">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-2xl font-bold text-lg">
                      {log.amountProduced} <span className="text-xs font-normal">L</span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-50 dark:border-slate-800/50 pt-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">KULLANILAN MALZEMELER</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {log.consumedIngredients.map((ing, idx) => (
                        <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/30">
                          <span className="text-slate-500 dark:text-slate-400">{ing.chemicalName}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{ing.amount.toFixed(2)} {ing.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Henüz hiçbir üretim kaydı bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionHistory;
