
import React from 'react';
import { Recipe, Chemical } from '../types';
import { Icons } from '../constants';

interface RecipeListProps {
  recipes: Recipe[];
  chemicals: Chemical[];
  onProduce: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, chemicals, onProduce, onEdit, onDelete, onAdd }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Reçeteler</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">1000L bazlı üretim reçeteleri</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
        >
          <Icons.Plus />
          Reçete Oluştur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white dark:bg-slate-900 rounded-5xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{recipe.name}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(recipe)} className="p-2 text-slate-400 hover:text-blue-500"><Icons.Plus /></button>
                <button onClick={() => onDelete(recipe.id)} className="p-2 text-slate-400 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-8">
              {recipe.ingredients.map((ing, idx) => {
                const chem = chemicals.find(c => c.id === ing.chemicalId);
                return (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{chem?.name || 'Bilinmeyen'}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{ing.amountPer1000L} {chem?.unit || ''}</span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => onProduce(recipe)}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-3xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
              Üretime Başla
            </button>
          </div>
        ))}
        {recipes.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-5xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400">Henüz hiç reçete eklenmemiş.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
