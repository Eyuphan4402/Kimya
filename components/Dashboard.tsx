
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Chemical, ProductionLog } from '../types';
import { COLORS } from '../constants';
import { getAIReport } from '../services/geminiService';

interface DashboardProps {
  chemicals: Chemical[];
  logs: ProductionLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ chemicals, logs }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Sınırsız stokları (Saf Su vb.) hesaplamalardan çıkarıyoruz
  const finiteChemicals = chemicals.filter(c => !c.isInfinite);
  
  const totalStock = finiteChemicals.reduce((acc, curr) => acc + curr.currentStock, 0);
  const criticalStockCount = finiteChemicals.filter(c => c.currentStock <= c.minThreshold).length;
  const recentProductions = logs.slice(-5).reverse();

  const chartData = finiteChemicals.map(c => ({
    name: c.name,
    value: c.currentStock,
    color: c.color || COLORS[Math.floor(Math.random() * COLORS.length)]
  })).filter(d => d.value > 0);

  const generateReport = async () => {
    setLoadingAI(true);
    const report = await getAIReport(chemicals);
    setAiReport(report);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Takip Edilen Stok</p>
          <p className="text-3xl font-bold dark:text-white">{totalStock.toLocaleString()} <span className="text-sm font-normal text-slate-400">birim</span></p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Kritik Hammadde</p>
          <p className={`text-3xl font-bold ${criticalStockCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {criticalStockCount}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Toplam Üretim</p>
          <p className="text-3xl font-bold dark:text-white">{logs.length} <span className="text-sm font-normal text-slate-400">parti</span></p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Aktif Hammadde</p>
          <p className="text-3xl font-bold dark:text-white">{finiteChemicals.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl shadow-sm border border-slate-100 dark:border-slate-800 min-h-[400px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Stok Dağılımı (Sınırlı Kaynaklar)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-5xl shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.091 3.091L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.091 3.091ZM18.213 18.213 17.25 21l-.963-2.787a2.25 2.25 0 0 0-1.547-1.546L12 15.75l2.74-1.025a2.25 2.25 0 0 0 1.546-1.547l.963-2.787.963 2.787a2.25 2.25 0 0 0 1.546 1.547L21 15.75l-2.787.963a2.25 2.25 0 0 0-1.547 1.546ZM18.213 5.787 17.25 8.5l-.963-2.713a2.25 2.25 0 0 0-1.547-1.547L12 3.25l2.74-1.025a2.25 2.25 0 0 0 1.546-1.547l.963-2.713.963 2.713a2.25 2.25 0 0 0 1.546 1.547L21 3.25l-2.787.963a2.25 2.25 0 0 0-1.547 1.547Z" />
                  </svg>
                  Gemini AI Stok Analizi
                </h3>
                <button 
                  onClick={generateReport}
                  disabled={loadingAI}
                  className="px-6 py-2 bg-white text-blue-700 rounded-full font-bold shadow-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {loadingAI ? 'Analiz Yapılıyor...' : 'Rapor Oluştur'}
                </button>
              </div>
              {aiReport ? (
                <div className="prose prose-invert max-w-none text-blue-50 bg-blue-800/20 p-6 rounded-3xl border border-white/10 whitespace-pre-wrap leading-relaxed">
                  {aiReport}
                </div>
              ) : (
                <p className="text-blue-100 opacity-80">
                  Depo verimliliğini artırmak ve kritik stokları öngörmek için yapay zekadan profesyonel destek alın. (Sınırsız stoklar analize dahil edilmez)
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Son Üretimler
          </h3>
          <div className="space-y-4">
            {recentProductions.length > 0 ? recentProductions.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{log.recipeName}</h4>
                  <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{log.amountProduced} L üretildi</p>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center py-10">Henüz üretim kaydı yok.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
