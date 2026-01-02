
import { GoogleGenAI } from "@google/genai";
import { Chemical } from "../types";

export const getAIReport = async (chemicals: Chemical[]): Promise<string> => {
  // API key access in browser environments can be tricky; ensuring we check both process.env and a direct fallback if needed.
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Hata: API_KEY ortam değişkeni tanımlanmamış. Vercel ayarlarından 'Environment Variables' kısmına API_KEY eklediğinizden emin olun.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Panelde istenmediği gibi AI analizinde de Saf Su gibi sınırsız stokları filtreliyoruz
    const relevantChemicals = chemicals.filter(c => !c.isInfinite);
    
    const stockInfo = relevantChemicals.map(c => 
      `- ${c.name}: ${c.currentStock} ${c.unit} (Eşik: ${c.minThreshold})`
    ).join('\n');

    if (relevantChemicals.length === 0) {
      return "Analiz edilecek sınırlı stok verisi bulunamadı.";
    }

    const prompt = `
      Aşağıda bir kimya deposunun güncel hammadde stok listesi bulunmaktadır. 
      (Not: Saf Su gibi sınırsız kaynaklar listeden hariç tutulmuştur.)
      Lütfen bu verilere dayanarak Türkçe, profesyonel ve kısa bir rapor hazırla.
      Rapor şunları içermeli:
      1. Kritik seviyedeki stoklar için acil sipariş planı önerisi.
      2. Genel depo verimliliği hakkında kısa bir yorum.
      3. Stok yönetimi için 2 adet pratik tavsiye.

      Stok Listesi:
      ${stockInfo}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Yapay zeka yanıt oluşturamadı.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error?.message?.includes('API key')) {
      return "API Anahtarı geçersiz veya yetkisiz. Lütfen Vercel ayarlarınızı kontrol edin.";
    }
    return "Rapor oluşturulurken teknik bir hata oluştu: " + (error?.message || "Bilinmeyen hata");
  }
};
