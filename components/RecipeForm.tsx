
import React, { useState, useEffect } from 'react';
import { Recipe, RecipeIngredient, Chemical } from '../types';

interface RecipeFormProps {
  initialData?: Recipe | null;
  chemicals: Chemical[];
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, chemicals, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIngredients(initialData.ingredients);
    } else {
      setIngredients([{ chemicalId: chemicals[0]?.id || '', amountPer1000L: 0 }]);
    }
  }, [initialData, chemicals]);

  const addIngredient = () => {
    setIngredients([...ingredients, { chemicalId: chemicals[0]?.id || '', amountPer1000L: 0 }]);
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const newIngs = [...ingredients];
    newIngs[index] = { ...newIngs[index], [field]: value };
    setIngredients(newIngs);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || ingredients.length === 0) return;
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name,
      ingredients
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onCancel}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-5xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] hide-scrollbar animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">{initialData ? 'Reçete Düzenle' : 'Yeni Reçete'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Reçete Adı (Ürün İsmi)</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
              placeholder="Örn: Sıvı Sabun - Premium"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Hammaddeler (1000L İçin)</label>
              <button 
                type="button" 
                onClick={addIngredient}
                className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                + Ekle
              </button>
            </div>
            
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl items-end animate-in fade-in slide-in-from-left-4 duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 ml-2">HAMMADDE SEÇİN</label>
                    <select 
                      value={ing.chemicalId}
                      onChange={(e) => updateIngredient(index, 'chemicalId', e.target.value)}
                      className="w-full bg-white dark:bg-slate-700 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    >
                      {chemicals.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 ml-2">MİKTAR</label>
                    <input 
                      type="number" 
                      value={ing.amountPer1000L}
                      onChange={(e) => updateIngredient(index, 'amountPer1000L', Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-700 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 py-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-3xl font-bold hover:bg-slate-200 transition-all"
            >
              İptal
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-emerald-600 text-white rounded-3xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
            >
              Reçeteyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
