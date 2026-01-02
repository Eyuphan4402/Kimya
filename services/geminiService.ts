
import { GoogleGenAI } from "@google/genai";
import { Chemical } from "../types";

export const getAIReport = async (chemicals: Chemical[]): Promise<string> => {
  // Use a safer way to access API_KEY that works across different bundlers
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;

  if (!apiKey) {
    return "Hata: API_KEY bulunamadı. Lütfen Vercel ortam değişkenlerini (Environment Variables) kontrol edin.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Only finite chemicals are relevant for stock management reports
    const finiteChemicals = chemicals.filter(c => !c.isInfinite);
    
    const stockInfo = finiteChemicals.map(c => 
      `- ${c.name}: ${c.currentStock} ${c.unit} (Eşik: ${c.minThreshold})`
    ).join('\n');

    if (finiteChemicals.length === 0) {
      return "Analiz edilecek sınırlı stok verisi bulunamadı.";
    }

    const prompt = `
      Sen profesyonel bir kimya deposu yönetim asistanısın.
      Aşağıda, sınırsız kaynaklar (Saf Su vb.) hariç tutulmuş güncel hammadde stok listesi bulunmaktadır:
      
      ${stockInfo}
      
      Lütfen bu verilere dayanarak Türkçe bir rapor hazırla:
      1. Kritik seviyedeki (eşik altı) stoklar için acil tedarik önerisi.
      2. Depo doluluk ve verimlilik yorumu.
      3. Gelecek üretimler için 2 adet stratejik tavsiye.
      
      Yanıtın kısa, öz ve profesyonel olsun.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Yapay zeka şu an yanıt veremiyor.";
  } catch (error: any) {
    console.error("AI Report Error:", error);
    return `Analiz sırasında bir hata oluştu: ${error.message || "Bilinmeyen hata"}`;
  }
};
