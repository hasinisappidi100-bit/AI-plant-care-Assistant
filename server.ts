import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI SDK with recommended settings
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback botanical answers when Gemini API is offline or not configured
const LOCAL_BOTANICAL_ANSWERS: Record<string, string> = {
  water: `💧 **Watering Best Practice:**
• **Finger Moisture Test:** Insert your index finger 1–2 inches into the soil. If it feels dry, water deeply. If damp, wait 1–2 days.
• **Morning Watering:** Water early at root level so leaf moisture evaporates during the day, preventing fungal spores.
• **Drainage Check:** Always use pots with drainage holes. Overwatering leads to root rot!`,

  yellow: `🍂 **Why Leaves Turn Yellow (Chlorosis):**
• **Overwatering (Most Common):** Roots suffocate and cannot uptake iron or nitrogen.
• **Underwatering:** Leaves become dry, crispy, and droop before yellowing.
• **Nitrogen Deficiency:** Older lower leaves turn pale yellow first while younger leaves stay light green.
• **Insufficient Light:** Move plant to bright, indirect sunlight to resume healthy photosynthesis.`,

  sun: `☀️ **Sunlight Requirements:**
• **Full Sun (6–8 hrs direct):** Tomatoes, Peppers, Corn, Basil, Succulents, Fruit trees.
• **Bright Indirect Light:** Money Plant (Pothos), Monstera, Spider Plant, Peace Lily.
• **Low/Medium Light:** Snake Plant, ZZ Plant, Philodendron.`,

  fertilizer: `🧪 **Fertilizer & Soil Nutrition:**
• **N-P-K Formula:** Nitrogen (leaf growth), Phosphorus (roots & flowers/fruit), Potassium (disease resistance).
• **Feeding Routine:** Apply balanced organic liquid fertilizer (10-10-10) every 2–3 weeks during active growth (Spring & Summer).
• **Organic Alternatives:** Vermicompost, cow dung compost, bone meal, or diluted seaweed extract.`,

  curl: `🍃 **Why Leaves are Curling:**
• **Upward Curling:** Heat stress or intense direct sunlight reducing transpiration.
• **Downward Cupping:** Overwatering or excess nitrogen fertilizer.
• **Wrinkled / Puckered:** Sap-sucking pests (aphids/mites) or viral leaf curl. Inspect leaf undersides!`,

  pest: `🐛 **Natural Pest Protection:**
• **Organic Neem Spray:** Mix 1 tsp organic neem oil + 1/2 tsp gentle dish soap in 1L warm water. Spray upper and lower leaf surfaces every 7 days.
• **Aphids & Mites:** Spray with a firm stream of clean water, then follow with neem treatment.
• **Mealybugs:** Wipe infested leaf crevices with a cotton swab dipped in 70% rubbing alcohol.`
};

function getLocalBotanicalAnswer(query: string, plantName?: string): string {
  const q = query.toLowerCase();
  const matched: string[] = [];
  if (q.includes('water') || q.includes('dry') || q.includes('moisture') || q.includes('often')) {
    matched.push(LOCAL_BOTANICAL_ANSWERS.water);
  }
  if (q.includes('yellow') || q.includes('pale') || q.includes('chlorosis')) {
    matched.push(LOCAL_BOTANICAL_ANSWERS.yellow);
  }
  if (q.includes('sun') || q.includes('light') || q.includes('shade')) {
    matched.push(LOCAL_BOTANICAL_ANSWERS.sun);
  }
  if (q.includes('fertilizer') || q.includes('feed') || q.includes('npk') || q.includes('compost')) {
    matched.push(LOCAL_BOTANICAL_ANSWERS.fertilizer);
  }
  if (q.includes('curl') || q.includes('wrinkle') || q.includes('twist')) {
    matched.push(LOCAL_BOTANICAL_ANSWERS.curl);
  }
  if (q.includes('pest') || q.includes('bug') || q.includes('insect') || q.includes('mite') || q.includes('aphid')) {
    matched.push(LOCAL_BOTANICAL_ANSWERS.pest);
  }

  const prefix = plantName ? `🌿 **Botanical Advice for ${plantName}:**\n\n` : '';
  const body = matched.length > 0
    ? matched.join('\n\n')
    : `🌿 **General Plant Health Guidance:**
• Ensure 6 hours of appropriate light daily for your plant.
• Allow top 1–2 inches of soil to dry before watering.
• Keep good room air circulation to prevent fungal leaf spot.
• Clean leaves periodically with a damp cloth to encourage sunlight absorption.`;

  const footer = `\n\n---\n*💡 [Local botanical knowledge base response. For live interactive Gemini generation, configure your GEMINI_API_KEY in the Secrets panel or .env file.]*`;
  return prefix + body + footer;
}

// -------------------------------------------------------------
// API Route: AI Chatbot (Gemini 3.8 Flash)
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, plantName } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      try {
        const promptText = `You are 'PlantCare AI', an intelligent, warm, and highly practical botanical assistant.
Current Plant Focus: ${plantName || 'General Plant'}
User Question: ${message}

Instructions:
1. Provide actionable advice for plant care, watering, sunlight, soil, fertilizers, or leaf disease symptoms.
2. Structure answers with clean bullet points and friendly emojis (💧, ☀️, ✂️, 🌱, 🧪).
3. Keep the advice accessible to beginner plant enthusiasts.
4. If describing diseases or pests, explain how to treat them naturally (e.g. neem oil, pruning).`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        });

        if (response && response.text) {
          return res.json({ reply: response.text, source: 'gemini-3.8-flash' });
        }
      } catch (geminiError: any) {
        console.warn('Gemini generateContent call failed, using fallback:', geminiError?.message);
      }
    }

    // Local fallback
    const fallbackReply = getLocalBotanicalAnswer(message, plantName);
    return res.json({ reply: fallbackReply, source: 'local-kb' });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// -------------------------------------------------------------
// API Route: Leaf Image Diagnosis (Vision / Classification)
// -------------------------------------------------------------
app.post('/api/identify', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data required' });
    }

    // If Gemini client is active, use vision model to identify plant & health condition
    if (aiClient) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imagePart = {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        };

        const visionPrompt = `Analyze this leaf or plant photo.
Return a clean JSON object with this exact structure:
{
  "plant_name": "Common plant name (e.g. Tomato, Bell Pepper, Potato, Apple, etc.)",
  "condition": "Specific condition (e.g. Healthy Foliage, Early Blight, Late Blight, Bacterial Spot, Powdery Mildew)",
  "health_status": "Healthy" or "Diseased" or "Pest Infestation",
  "confidence": 92.5,
  "summary": "1-2 sentence description of what you observe on the leaf",
  "immediate_care": "One immediate actionable tip"
}
Output only valid JSON.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: [imagePart, { text: visionPrompt }] },
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          try {
            const parsed = JSON.parse(response.text.trim());
            return res.json({
              ...parsed,
              is_demo: false,
              source: 'gemini-vision-ai',
            });
          } catch (e) {
            console.error('Failed to parse Gemini JSON output', e);
          }
        }
      } catch (visionErr: any) {
        console.warn('Gemini vision identification failed, falling back:', visionErr?.message);
      }
    }

    // Safe Demo / PlantVillage Simulated Fallback
    const demoCandidates = [
      {
        plant_name: 'Tomato',
        condition: 'Early Blight (Alternaria solani)',
        health_status: 'Diseased',
        confidence: 88.4,
        summary: 'Concentric dark target-like spots observed on lower foliage indicating early blight fungal onset.',
        immediate_care: 'Prune infected lower foliage immediately and avoid splashing water on leaves.',
      },
      {
        plant_name: 'Tomato',
        condition: 'Healthy Foliage',
        health_status: 'Healthy',
        confidence: 94.2,
        summary: 'Vibrant green chlorophyll density with intact leaf margins and no visible lesions.',
        immediate_care: 'Maintain regular watering schedule and continue balanced nutrition.',
      },
      {
        plant_name: 'Potato',
        condition: 'Late Blight (Phytophthora infestans)',
        health_status: 'Diseased',
        confidence: 86.7,
        summary: 'Irregular dark water-soaked lesions developing along leaf tips and margins.',
        immediate_care: 'Ensure proper soil drainage and apply organic copper or neem spray.',
      },
      {
        plant_name: 'Bell Pepper',
        condition: 'Bacterial Leaf Spot',
        health_status: 'Diseased',
        confidence: 83.1,
        summary: 'Small yellowish-green translucent lesions turning brownish with yellow halos.',
        immediate_care: 'Improve spacing for air circulation and water strictly at soil line.',
      },
      {
        plant_name: 'Apple',
        condition: 'Cedar Apple Rust',
        health_status: 'Diseased',
        confidence: 87.9,
        summary: 'Bright orange-yellow circular spots visible on the upper leaf surface.',
        immediate_care: 'Remove nearby infected wild juniper sources and apply preventative fungicide.',
      },
    ];

    // Pick deterministic candidate based on image string length
    const selected = demoCandidates[imageBase64.length % demoCandidates.length];
    return res.json({
      ...selected,
      is_demo: true,
      source: 'plantvillage-demo-classifier',
    });
  } catch (error: any) {
    console.error('Identify endpoint error:', error);
    res.status(500).json({ error: 'Failed to identify plant image' });
  }
});

// -------------------------------------------------------------
// Mount Vite middlewares in dev OR static build in production
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 AI PlantCare Assistant dev server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
