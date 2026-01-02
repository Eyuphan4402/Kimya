
import React, { useState, useEffect } from 'react';
import { Chemical, UnitType } from '../types';
import { COLORS } from '../constants';

interface ChemicalFormProps {
  initialData?: Chemical | null;
  onSave: (chemical: Chemical) => void;
  onCancel: () => void;
}

const ChemicalForm: React.FC<ChemicalFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Chemical>>({
    name: '',
    currentStock: 0,
    unit: UnitType.KG,
    minThreshold: 10,
    isInfinite: false,
    color: COLORS[0]
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave({
      ...formData as Chemical,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onCancel}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-5xl shadow-2xl p-8 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">{initialData ? 'Hammadde Düzenle' : 'Yeni Hammadde'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Hammadde Adı</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              placeholder="Örn: Sodyum Klorür"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Birim</label>
              <select 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value as UnitType})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              >
                {Object.values(UnitType).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Renk</label>
              <div className="flex gap-2 flex-wrap pt-1">
                {COLORS.map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setFormData({...formData, color: c})}
                    className={`w-8 h-8 rounded-full border-4 ${formData.color === c ? 'border-blue-400' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Mevcut Stok</label>
              <input 
                type="number" 
                disabled={formData.isInfinite}
                value={formData.currentStock}
                onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Kritik Eşik</label>
              <input 
                type="number" 
                value={formData.minThreshold}
                onChange={(e) => setFormData({...formData, minThreshold: Number(e.target.value)})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <button 
              type="button"
              onClick={() => setFormData({...formData, isInfinite: !formData.isInfinite})}
              className={`w-14 h-8 rounded-full transition-all relative ${formData.isInfinite ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isInfinite ? 'translate-x-6' : ''}`} />
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Sınırsız Stok (Örn: Şebeke Suyu)</span>
          </div>

          <div className="flex gap-3 pt-6">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-3xl font-bold hover:bg-slate-200 transition-all"
            >
              İptal
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-blue-600 text-white rounded-3xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChemicalForm;
