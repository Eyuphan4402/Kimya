
import React, { useState, useEffect } from 'react';
import { Chemical, Recipe, ProductionLog, TabType } from './types';
import { INITIAL_CHEMICALS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChemicalTable from './components/ChemicalTable';
import RecipeList from './components/RecipeList';
import ProductionHistory from './components/ProductionHistory';
import ChemicalForm from './components/ChemicalForm';
import RecipeForm from './components/RecipeForm';
import ProductionModal from './components/ProductionModal';

const App: React.FC = () => {
  const [chemicals, setChemicals] = useState<Chemical[]>(() => {
    const saved = localStorage.getItem('necm_chemicals');
    return saved ? JSON.parse(saved) : INITIAL_CHEMICALS;
  });
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('necm_recipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [logs, setLogs] = useState<ProductionLog[]>(() => {
    const saved = localStorage.getItem('necm_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('necm_dark') === 'true');

  const [activeModal, setActiveModal] = useState<'chemical' | 'recipe' | 'production' | null>(null);
  const [editingChemical, setEditingChemical] = useState<Chemical | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [producingRecipe, setProducingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    localStorage.setItem('necm_chemicals', JSON.stringify(chemicals));
    localStorage.setItem('necm_recipes', JSON.stringify(recipes));
    localStorage.setItem('necm_logs', JSON.stringify(logs));
    localStorage.setItem('necm_dark', String(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [chemicals, recipes, logs, darkMode]);

  const handleUpdateStock = (id: string, newStock: number) => {
    setChemicals(prev => prev.map(c => c.id === id ? { ...c, currentStock: Math.max(0, newStock) } : c));
  };

  const handleAddChemical = (chem: Chemical) => {
    if (editingChemical) {
      setChemicals(prev => prev.map(c => c.id === chem.id ? chem : c));
    } else {
      setChemicals(prev => [...prev, chem]);
    }
    setActiveModal(null);
    setEditingChemical(null);
  };

  const handleAddRecipe = (recipe: Recipe) => {
    if (editingRecipe) {
      setRecipes(prev => prev.map(r => r.id === recipe.id ? recipe : r));
    } else {
      setRecipes(prev => [...prev, recipe]);
    }
    setActiveModal(null);
    setEditingRecipe(null);
  };

  const handleConfirmProduction = (recipeId: string, amount: number) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const factor = amount / 1000;
    const consumed = recipe.ingredients.map(ing => {
      const chem = chemicals.find(c => c.id === ing.chemicalId)!;
      const consumedAmount = ing.amountPer1000L * factor;
      return {
        chemicalId: chem.id,
        chemicalName: chem.name,
        amount: consumedAmount,
        unit: chem.unit
      };
    });

    // Deduct from stock
    setChemicals(prev => prev.map(c => {
      const consumption = consumed.find(cons => cons.chemicalId === c.id);
      if (consumption && !c.isInfinite) {
        return { ...c, currentStock: c.currentStock - consumption.amount };
      }
      return c;
    }));

    // Add to logs
    const newLog: ProductionLog = {
      id: Math.random().toString(36).substr(2, 9),
      recipeId: recipe.id,
      recipeName: recipe.name,
      amountProduced: amount,
      timestamp: Date.now(),
      consumedIngredients: consumed.map(c => ({ chemicalName: c.chemicalName, amount: c.amount, unit: c.unit }))
    };
    setLogs(prev => [...prev, newLog]);

    setActiveModal(null);
    setProducingRecipe(null);
    setActiveTab('history');
  };

  const exportData = async () => {
    const data = JSON.stringify({ chemicals, recipes, logs }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    if (navigator.share) {
      try {
        const file = new File([blob], 'NecmKimya_Yedek.json', { type: 'application/json' });
        await navigator.share({
          files: [file],
          title: 'NecmKimya Yedek Dosyası',
          text: 'NecmKimya Stok ve Üretim Verileri'
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = `NecmKimya_Backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.chemicals && parsed.recipes && parsed.logs) {
          setChemicals(parsed.chemicals);
          setRecipes(parsed.recipes);
          setLogs(parsed.logs);
          alert('Veriler başarıyla yüklendi!');
        }
      } catch (err) {
        alert('Geçersiz dosya formatı.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1 lg:ml-72 min-h-screen p-4 lg:p-10">
        <header className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">N</div>
             <h1 className="text-lg font-bold dark:text-white">NecmKimya</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard chemicals={chemicals} logs={logs} />}
          
          {activeTab === 'inventory' && (
            <ChemicalTable 
              chemicals={chemicals} 
              onUpdateStock={handleUpdateStock}
              onDelete={(id) => setChemicals(prev => prev.filter(c => c.id !== id))}
              onEdit={(c) => { setEditingChemical(c); setActiveModal('chemical'); }}
              onAdd={() => { setEditingChemical(null); setActiveModal('chemical'); }}
            />
          )}

          {activeTab === 'recipes' && (
            <RecipeList 
              recipes={recipes} 
              chemicals={chemicals}
              onProduce={(r) => { setProducingRecipe(r); setActiveModal('production'); }}
              onEdit={(r) => { setEditingRecipe(r); setActiveModal('recipe'); }}
              onDelete={(id) => setRecipes(prev => prev.filter(r => r.id !== id))}
              onAdd={() => { setEditingRecipe(null); setActiveModal('recipe'); }}
            />
          )}

          {activeTab === 'history' && <ProductionHistory logs={logs} />}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8">
               <h2 className="text-3xl font-bold dark:text-white">Ayarlar & Yedekleme</h2>
               <div className="bg-white dark:bg-slate-900 rounded-5xl p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                 <div>
                    <h3 className="text-xl font-bold mb-2">Veri Dışa Aktar</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Tüm hammadde, reçete ve geçmiş kayıtlarını JSON formatında yedekleyin veya paylaşın.</p>
                    <button 
                      onClick={exportData}
                      className="w-full py-4 bg-blue-600 text-white rounded-3xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 7.5L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      {navigator.share ? 'Paylaş / Yedekle' : 'Yedek Dosyası İndir'}
                    </button>
                 </div>
                 
                 <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-2">Yedek Yükle</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Daha önce aldığınız bir yedeği sisteme geri yükleyin. Mevcut verilerin üzerine yazılacaktır.</p>
                    <label className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-3xl font-bold cursor-pointer hover:bg-slate-200 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" transform="rotate(180 12 12)" />
                      </svg>
                      Dosya Seç ve Geri Yükle
                      <input type="file" accept=".json" onChange={importData} className="hidden" />
                    </label>
                 </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'chemical' && (
        <ChemicalForm 
          initialData={editingChemical}
          onSave={handleAddChemical}
          onCancel={() => { setActiveModal(null); setEditingChemical(null); }}
        />
      )}

      {activeModal === 'recipe' && (
        <RecipeForm 
          initialData={editingRecipe}
          chemicals={chemicals}
          onSave={handleAddRecipe}
          onCancel={() => { setActiveModal(null); setEditingRecipe(null); }}
        />
      )}

      {activeModal === 'production' && producingRecipe && (
        <ProductionModal 
          recipe={producingRecipe}
          chemicals={chemicals}
          onConfirm={handleConfirmProduction}
          onClose={() => { setActiveModal(null); setProducingRecipe(null); }}
        />
      )}
    </div>
  );
};

export default App;
