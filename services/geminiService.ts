
import { GoogleGenAI } from "@google/genai";
import { Chemical } from "../types";

export const getAIReport = async (chemicals: Chemical[]): Promise<string> => {
  // Obtain API key exclusively from environment variable
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API Anahtarı bulunamadı. Lütfen kontrol edin.";

  // Initialize client with named parameter apiKey as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const stockInfo = chemicals.map(c => 
    `- ${c.name}: ${c.currentStock} ${c.unit} (Eşik: ${c.minThreshold}${c.isInfinite ? ', Sınırsız' : ''})`
  ).join('\n');

  const prompt = `
    Aşağıda bir kimya deposunun güncel hammadde stok listesi bulunmaktadır. 
    Lütfen bu verilere dayanarak Türkçe, profesyonel ve kısa bir rapor hazırla.
    Rapor şunları içermeli:
    1. Kritik seviyedeki stoklar için acil sipariş planı önerisi.
    2. Genel depo verimliliği hakkında kısa bir yorum.
    3. Stok yönetimi için 2 adet pratik tavsiye.

    Stok Listesi:
    ${stockInfo}
  `;

  try {
    // Generate content using the recommended model for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Extract text using .text property (not a function)
    return response.text || "Yapay zeka yanıt oluşturamadı.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Rapor oluşturulurken bir hata oluştu.";
  }
};
