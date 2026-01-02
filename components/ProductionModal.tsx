
import React, { useState, useMemo } from 'react';
import { Recipe, Chemical } from '../types';

interface ProductionModalProps {
  recipe: Recipe;
  chemicals: Chemical[];
  onConfirm: (recipeId: string, amount: number) => void;
  onClose: () => void;
}

const ProductionModal: React.FC<ProductionModalProps> = ({ recipe, chemicals, onConfirm, onClose }) => {
  const [targetAmount, setTargetAmount] = useState<number>(1000);

  const requirements = useMemo(() => {
    const factor = targetAmount / 1000;
    return recipe.ingredients.map(ing => {
      const chemical = chemicals.find(c => c.id === ing.chemicalId)!;
      const required = ing.amountPer1000L * factor;
      const isAvailable = chemical.isInfinite || chemical.currentStock >= required;
      return {
        ...chemical,
        required,
        isAvailable
      };
    });
  }, [targetAmount, recipe, chemicals]);

  const canProduce = requirements.every(r => r.isAvailable);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-5xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Üretim Planla</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">Hedef Üretim Miktarı (Litre)</label>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={targetAmount}
                onChange={(e) => setTargetAmount(Math.max(0, Number(e.target.value)))}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-2xl font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
              <div className="flex flex-col gap-1">
                 <button onClick={() => setTargetAmount(prev => prev + 100)} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">+</button>
                 <button onClick={() => setTargetAmount(prev => Math.max(0, prev - 100))} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">-</button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Hammadde İhtiyacı</h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-4xl p-6 space-y-4">
              {requirements.map((req) => (
                <div key={req.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{req.name}</p>
                    <p className="text-xs text-slate-500">Mevcut: {req.isInfinite ? 'Sınırsız' : `${req.currentStock} ${req.unit}`}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${!req.isAvailable ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                      {req.required.toFixed(2)} {req.unit}
                    </p>
                    {!req.isAvailable && <p className="text-[10px] text-red-500 font-bold uppercase">Yetersiz Stok!</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            disabled={!canProduce || targetAmount <= 0}
            onClick={() => onConfirm(recipe.id, targetAmount)}
            className={`
              w-full py-5 rounded-3xl font-bold text-lg shadow-lg transition-all active:scale-95
              ${canProduce && targetAmount > 0 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
            `}
          >
            {canProduce ? 'Üretimi Onayla' : 'Stok Yetersiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionModal;
