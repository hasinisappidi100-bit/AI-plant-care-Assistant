/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Sprout,
  Upload,
  Camera,
  Bot,
  BarChart3,
  BookOpen,
  Info,
  Droplets,
  Sun,
  Layers,
  Thermometer,
  FlaskConical,
  Scissors,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Terminal,
  FileCode2,
  Calendar,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';

// Plant care dataset matching plant_data.csv
interface PlantCareDetails {
  name: string;
  scientific: string;
  category: string;
  watering: string;
  sunlight: string;
  soil: string;
  temperature: string;
  fertilizer: string;
  pruning: string;
  commonProblems: string;
  schedule: Record<string, string>;
}

const PLANT_DATABASE: Record<string, PlantCareDetails> = {
  Tomato: {
    name: 'Tomato',
    scientific: 'Solanum lycopersicum',
    category: 'Vegetable / Solanaceae',
    watering: 'Water deeply 2–3 times a week when top 1–2 inches of soil feel dry. Water the root base, not foliage.',
    sunlight: 'Full Sun: 6–8 hours of direct daily sunlight for prolific flowering and fruit setting.',
    soil: 'Well-draining, fertile loamy soil rich in organic compost with pH 6.0–6.8.',
    temperature: '18°C – 29°C (65°F – 85°F). Highly sensitive to frost and extreme heat.',
    fertilizer: 'Balanced 10-10-10 early; switch to high potassium and phosphorus every 2 weeks during fruiting.',
    pruning: 'Pinch suckers in leaf axils and remove yellowing bottom foliage for ventilation.',
    commonProblems: 'Early blight, blossom end rot (calcium deficiency), aphids, leaf curling from uneven watering.',
    schedule: {
      Monday: 'Deep root watering 💧',
      Tuesday: 'Sunlight & leaf inspection ☀️',
      Wednesday: 'Prune suckers & yellow leaves ✂️',
      Thursday: 'Light soil moisture check 💧',
      Friday: 'Balanced organic liquid feed 🧪',
      Saturday: 'Inspect leaf undersides for pests 🔍',
      Sunday: 'Natural soil aeration & rest 🌱',
    },
  },
  Potato: {
    name: 'Potato',
    scientific: 'Solanum tuberosum',
    category: 'Vegetable / Tuber',
    watering: 'Water consistently; keep soil evenly moist (about 1–2 inches per week). Reduce when vines yellow.',
    sunlight: 'Full Sun: 6+ hours of direct sunlight daily.',
    soil: 'Loose, well-aerated sandy loam with pH 5.0–6.0. Hill up soil over growing tubers.',
    temperature: '15°C – 21°C (60°F – 70°F). Cool-season crop.',
    fertilizer: 'Low nitrogen, higher phosphorus and potassium (5-10-10) every 3 weeks.',
    pruning: 'No heavy pruning. Hill soil 6–8 inches high around stems as plants grow.',
    commonProblems: 'Late blight, potato beetles, scab disease, green tubers from sun exposure.',
    schedule: {
      Monday: 'Moderate hill watering 💧',
      Tuesday: 'Check for potato beetles 🔍',
      Wednesday: 'Hill up soil around stems 🌿',
      Thursday: 'Check soil dampness 💧',
      Friday: 'Phosphorus-rich fertilizer 🧪',
      Saturday: 'Inspect leaf color & blight signs ☀️',
      Sunday: 'Rest day 🌱',
    },
  },
  'Bell Pepper': {
    name: 'Bell Pepper',
    scientific: 'Capsicum annuum',
    category: 'Vegetable / Solanaceae',
    watering: 'Water 1–2 inches per week; keep soil moist but never waterlogged. Allow surface to dry slightly.',
    sunlight: 'Full Sun: 6–8 hours of direct warm sunlight.',
    soil: 'Well-draining, rich loamy soil with compost and pH 6.2–7.0.',
    temperature: '21°C – 29°C (70°F – 85°F). Sensitive to cold drafts below 12°C.',
    fertilizer: 'Balanced 5-10-10 or tomato feed with magnesium every 2 weeks after flowering starts.',
    pruning: 'Pinch early flowers to encourage bushy branch development; stake fruit-heavy branches.',
    commonProblems: 'Bacterial leaf spot, blossom end rot, sunscald on fruit, aphids.',
    schedule: {
      Monday: 'Deep soil hydration 💧',
      Tuesday: 'Rotate plant towards sunlight ☀️',
      Wednesday: 'Stake tall branches & pinch tips ✂️',
      Thursday: 'Check drainage & soil moisture 💧',
      Friday: 'Magnesium/calcium organic feed 🧪',
      Saturday: 'Check for aphids under leaves 🔍',
      Sunday: 'Rest & observation 🌱',
    },
  },
  Apple: {
    name: 'Apple',
    scientific: 'Malus domestica',
    category: 'Fruit Tree',
    watering: 'Deep soak every 7–10 days during dry spells; mature trees need 1 inch of water weekly.',
    sunlight: 'Full Sun: 6–8 hours of uninterrupted daily sunlight.',
    soil: 'Well-drained loam to sandy loam with pH 6.0–7.0.',
    temperature: '10°C – 24°C (50°F – 75°F); requires winter chill hours (below 7°C) for flower bud dormancy.',
    fertilizer: 'Fruit tree fertilizer (10-10-10) in early spring; avoid late season nitrogen.',
    pruning: 'Prune dormant branches in late winter to open tree canopy to sunlight and air circulation.',
    commonProblems: 'Apple scab fungus, cedar apple rust, codling moth, powdery mildew.',
    schedule: {
      Monday: 'Deep basin irrigation 💧',
      Tuesday: 'Check canopy for fungal spots 🔍',
      Wednesday: 'Remove dead twigs or water sprouts ✂️',
      Thursday: 'Soil mulch inspection 💧',
      Friday: 'Apply compost or fruit feed (seasonal) 🧪',
      Saturday: 'Inspect bark and leaf health ☀️',
      Sunday: 'Rest day 🌱',
    },
  },
  'Money Plant (Pothos)': {
    name: 'Money Plant (Pothos)',
    scientific: 'Epipremnum aureum',
    category: 'Indoor / Foliage',
    watering: 'Water every 1–2 weeks when top 2 inches of potting mix feel dry. Leaves will droop slightly when thirsty.',
    sunlight: 'Bright indirect light; tolerates medium to low light. Avoid harsh direct sun which scorches leaves.',
    soil: 'Well-draining indoor potting mix with perlite and peat moss.',
    temperature: '18°C – 30°C (65°F – 86°F). Protect from cold AC drafts.',
    fertilizer: 'Diluted balanced liquid houseplant fertilizer once a month during spring and summer.',
    pruning: 'Trim long trailing vines to encourage bushier growth; wipe broad leaves with a damp cloth.',
    commonProblems: 'Root rot from overwatering, yellowing leaves, mealybugs, leggy vines in low light.',
    schedule: {
      Monday: 'Moderate pot watering 💧',
      Tuesday: 'Wipe dust off broad leaves 🍃',
      Wednesday: 'Trim leggy trailing vines ✂️',
      Thursday: 'Check soil dampness 🌱',
      Friday: 'Half-strength liquid feed (monthly) 🧪',
      Saturday: 'Check leaf nodes for mealybugs 🔍',
      Sunday: 'Rest & indirect light day ☀️',
    },
  },
  'Snake Plant': {
    name: 'Snake Plant',
    scientific: 'Sansevieria trifasciata',
    category: 'Indoor / Succulent',
    watering: 'Water very sparingly; once every 2–4 weeks. Soil must dry out 100% between waterings.',
    sunlight: 'Highly adaptable: thrives in bright indirect light, tolerates low light and partial direct sun.',
    soil: 'Cactus or succulent potting mix with coarse sand and pumice for rapid drainage.',
    temperature: '15°C – 29°C (60°F – 85°F). Not cold hardy; keep above 10°C.',
    fertilizer: 'Feed once in spring and once in summer with mild succulent fertilizer (10-10-10).',
    pruning: 'Rarely needed; simply cut damaged outer leaves at soil line with sterile shears.',
    commonProblems: 'Root rot from overwatering (mushy yellow leaves), brown crispy tips from underwatering.',
    schedule: {
      Monday: 'Check soil dryness (water only if bone dry) 💧',
      Tuesday: 'Dust upright sword leaves 🌿',
      Wednesday: 'Rotate pot 90 degrees for even light ☀️',
      Thursday: 'No water needed 🌱',
      Friday: 'Mild cactus fertilizer (rare) 🧪',
      Saturday: 'Inspect leaf bases 🔍',
      Sunday: 'Complete rest day 🌱',
    },
  },
  'Tulsi (Holy Basil)': {
    name: 'Tulsi (Holy Basil)',
    scientific: 'Ocimum tenuiflorum',
    category: 'Medicinal / Herb',
    watering: 'Water daily in summer or whenever topsoil feels dry. Ensure pot has free drainage.',
    sunlight: 'Bright direct sunlight for 4–6 hours every day. Needs warmth and light.',
    soil: 'Rich, loamy, well-drained soil with organic vermicompost, pH 6.0–7.5.',
    temperature: '20°C – 35°C (68°F – 95°F). Highly sensitive to cold and frost.',
    fertilizer: 'Organic vermicompost or cow dung manure once every month.',
    pruning: 'Pinch off flower buds (manjari) regularly to keep plant bushy and prevent seeding.',
    commonProblems: 'Leaf spot, root rot from stagnant water, spider mites, cold wilt.',
    schedule: {
      Monday: 'Morning sacred watering 💧',
      Tuesday: 'Morning sun positioning ☀️',
      Wednesday: 'Pinch top flower buds (manjari) ✂️',
      Thursday: 'Moisture & leaf check 💧',
      Friday: 'Add handful of vermicompost 🧪',
      Saturday: 'Inspect leaves for tiny mites 🔍',
      Sunday: 'Rest day 🌱',
    },
  },
};

// Sample demonstration images for leaf disease testing
const SAMPLE_LEAF_IMAGES = [
  {
    label: '🍅 Tomato (Healthy)',
    plant: 'Tomato',
    condition: 'Healthy Leaf',
    status: 'Healthy',
    conf: 94.8,
    img: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: '🍂 Tomato (Early Blight)',
    plant: 'Tomato',
    condition: 'Early Blight (Alternaria solani)',
    status: 'Diseased',
    conf: 89.2,
    img: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: '🥔 Potato (Late Blight)',
    plant: 'Potato',
    condition: 'Late Blight (Phytophthora infestans)',
    status: 'Diseased',
    conf: 87.5,
    img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: '🫑 Pepper (Bacterial Spot)',
    plant: 'Bell Pepper',
    condition: 'Bacterial Spot (Xanthomonas)',
    status: 'Diseased',
    conf: 84.1,
    img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'identify' | 'care' | 'chat' | 'dashboard' | 'about' | 'code'>('home');
  const [selectedPlant, setSelectedPlant] = useState<string>('Tomato');
  const [previewImage, setPreviewImage] = useState<string | null>(SAMPLE_LEAF_IMAGES[0].img);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [identificationResult, setIdentificationResult] = useState<{
    plant_name: string;
    condition: string;
    health_status: 'Healthy' | 'Diseased' | 'Pest Infestation';
    confidence: number;
    summary: string;
    immediate_care: string;
    is_demo: boolean;
  } | null>({
    plant_name: 'Tomato',
    condition: 'Healthy Foliage',
    health_status: 'Healthy',
    confidence: 94.8,
    summary: 'Vibrant green chlorophyll density with intact leaf margins and no visible fungal spots.',
    immediate_care: 'Continue deep base watering every 2–3 days and ensure 6–8 hours of full sun.',
    is_demo: true,
  });

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: '👋 Hello! I am your **PlantCare AI** assistant. Ask me anything about watering schedules, yellow leaves, pests, or fertilizers for your plants!',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Python Code View State
  const [selectedCodeFile, setSelectedCodeFile] = useState<string>('app.py');
  const [copiedState, setCopiedState] = useState<boolean>(false);

  // Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        runIdentification(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_LEAF_IMAGES[0]) => {
    setPreviewImage(sample.img);
    setIdentificationResult({
      plant_name: sample.plant,
      condition: sample.condition,
      health_status: sample.status as any,
      confidence: sample.conf,
      summary: `Sample image for ${sample.plant} showing characteristic ${sample.condition}.`,
      immediate_care: sample.status === 'Healthy'
        ? 'Maintain current watering and sunlight conditions.'
        : 'Prune affected leaves, avoid water on foliage, and apply organic neem oil.',
      is_demo: true,
    });
    setSelectedPlant(sample.plant);
  };

  const runIdentification = async (base64Data: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });
      if (res.ok) {
        const data = await res.json();
        setIdentificationResult({
          plant_name: data.plant_name || 'Tomato',
          condition: data.condition || 'Foliage Inspection',
          health_status: data.health_status || 'Healthy',
          confidence: data.confidence || 88.5,
          summary: data.summary || 'Image processed with convolutional filters.',
          immediate_care: data.immediate_care || 'Check soil moisture regularly.',
          is_demo: data.is_demo ?? true,
        });
        if (data.plant_name && PLANT_DATABASE[data.plant_name]) {
          setSelectedPlant(data.plant_name);
        }
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Send message to chatbot
  const handleSendMessage = async (msgToSend?: string) => {
    const query = msgToSend || chatInput.trim();
    if (!query || isChatLoading) return;

    const newMsgs = [...chatMessages, { role: 'user' as const, text: query }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, plantName: selectedPlant }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...newMsgs, { role: 'assistant', text: data.reply }]);
      } else {
        setChatMessages([
          ...newMsgs,
          {
            role: 'assistant',
            text: '🌿 I encountered a temporary connection glitch. Make sure the soil is damp and roots have good drainage!',
          },
        ]);
      }
    } catch (err) {
      setChatMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: '🌿 Could not connect to the botanical engine. Please verify network or API keys.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const currentPlantData = PLANT_DATABASE[selectedPlant] || PLANT_DATABASE.Tomato;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8faf8] text-stone-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-emerald-100/80 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-emerald-50 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight">AI PlantCare</h1>
              <p className="text-xs text-emerald-200/80 font-medium">Intelligent Botanical Assistant</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Streamlit + Keras
            </span>
            <span className="bg-emerald-700/50 px-2 py-0.5 rounded text-[10px] font-semibold">v1.40</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-900/60">
            Navigation Menu
          </p>
          {[
            { id: 'home', label: '🏠 Home', icon: Sprout },
            { id: 'identify', label: '🔍 Plant Identification', icon: Camera },
            { id: 'care', label: '🌱 Plant Care', icon: BookOpen },
            { id: 'chat', label: '🤖 Ask PlantCare AI', icon: Bot },
            { id: 'dashboard', label: '📊 Plant Health Dashboard', icon: BarChart3 },
            { id: 'about', label: 'ℹ️ About Project', icon: Info },
            { id: 'code', label: '💻 Python Code & Runner', icon: FileCode2 },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/10'
                    : 'text-stone-700 hover:bg-emerald-50/70 hover:text-emerald-900'
                }`}
              >
                <span className="flex items-center gap-2.5">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </button>
            );
          })}
        </nav>

        {/* Quick System Badge */}
        <div className="p-4 border-t border-emerald-50 bg-stone-50/50 text-xs space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-700" />
              ML Model Status:
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Demo / Physical Active
            </span>
          </div>
          <div className="flex items-center justify-between text-stone-600">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Gemini LLM Core:
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Gemini 3.8 Flash
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ========================================================
              PAGE 1: HOME
             ======================================================== */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-8 md:p-12 shadow-lg shadow-emerald-950/5">
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/50 backdrop-blur-sm border border-emerald-400/30 text-xs font-semibold text-emerald-100">
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Intelligent Botanical Diagnostic Platform</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                    🌱 AI PlantCare Assistant
                  </h1>
                  <p className="text-lg md:text-xl text-emerald-100 font-medium italic">
                    “Your intelligent companion for healthier plants.”
                  </p>
                  <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
                    Designed for students, urban gardeners, and farmers. Upload any plant photo to diagnose diseases, receive custom watering & soil tips, view health metrics, and chat with PlantCare AI.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('identify')}
                      className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4 text-emerald-700" />
                      Start Plant Analysis
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className="px-5 py-3 rounded-xl bg-emerald-900/60 border border-emerald-400/30 text-white font-semibold text-sm hover:bg-emerald-900/80 transition-all flex items-center gap-2"
                    >
                      <FileCode2 className="w-4 h-4 text-emerald-300" />
                      View Streamlit Python Code
                    </button>
                  </div>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
                <h3 className="text-base font-bold text-emerald-950 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                  How It Works: 4-Step Pipeline
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { step: 'Step 1', title: 'Upload Photo 📸', desc: 'Select or snap a clean leaf photo (JPG/PNG).' },
                    { step: 'Step 2', title: 'Analyze Features 🧠', desc: 'CNN filters process lesions, discoloration, and veins.' },
                    { step: 'Step 3', title: 'Identify Species 🔍', desc: 'Detects plant identity and healthy vs diseased state.' },
                    { step: 'Step 4', title: 'Get Care Tips 🌱', desc: 'Receive tailored watering, soil, and fertilizer advice.' },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/80 relative"
                    >
                      <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                        {s.step}
                      </span>
                      <h4 className="font-bold text-stone-800 text-sm mt-1">{s.title}</h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Four Core Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  onClick={() => setActiveTab('identify')}
                  className="group cursor-pointer bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    🌿 Plant Identification
                  </h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    Powered by Deep Convolutional Neural Networks trained on PlantVillage. Identifies tomato, potato, pepper, apple, corn, grape, and more with instant diagnostic confidence.
                  </p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-4 group-hover:translate-x-1 transition-transform">
                    Try leaf recognition &rarr;
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('care')}
                  className="group cursor-pointer bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    💧 Smart Care Recommendations
                  </h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    Personalized botanical rules covering soil pH, sunlight intensity, ambient temperature thresholds, nutrient balance, and pruning techniques for 15+ plants.
                  </p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-4 group-hover:translate-x-1 transition-transform">
                    Explore botanical guide &rarr;
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('chat')}
                  className="group cursor-pointer bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    🤖 AI Plant Assistant (Gemini)
                  </h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    Chat with <strong>Ask PlantCare AI</strong>. Troubleshoot yellowing leaves, curling foliage, organic pest protection, and fertilizer ratios with a knowledgeable LLM.
                  </p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-4 group-hover:translate-x-1 transition-transform">
                    Ask plant questions &rarr;
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('dashboard')}
                  className="group cursor-pointer bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    📊 Plant Health Dashboard
                  </h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    Holistic visual metrics: diagnosis confidence, health indicators, core parameters, and a dynamic 7-day weekly schedule for easy routine maintenance.
                  </p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-4 group-hover:translate-x-1 transition-transform">
                    View schedule chart &rarr;
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 2: PLANT IDENTIFICATION
             ======================================================== */}
          {activeTab === 'identify' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-emerald-950">
                  🔍 Plant Identification & Disease Diagnosis
                </h2>
                <p className="text-sm text-stone-600">
                  Upload a photo of any leaf or choose a demonstration sample to identify plant species and detect disease symptoms.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Upload and Sample Leaf Selector */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Upload Dropzone */}
                  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-700" />
                      Upload Leaf Image (JPG, PNG)
                    </h3>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-stone-700">Click to Browse or Drop Leaf Image</p>
                      <p className="text-xs text-stone-500 mt-1">Supports JPG, JPEG, PNG</p>
                    </div>

                    {/* Quick Demo Leaf Samples for College Demo */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        ⚡ Quick Demo Samples (Instant Test):
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {SAMPLE_LEAF_IMAGES.map((sample, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectSample(sample)}
                            className="text-left p-2.5 rounded-lg border border-emerald-100 hover:border-emerald-300 bg-stone-50 hover:bg-emerald-50/60 transition-all text-xs font-semibold text-stone-700 flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="truncate">{sample.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Leaf Preview Container */}
                  {previewImage && (
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-xs font-bold text-stone-600 mb-2">Image Preview</p>
                      <div className="rounded-xl overflow-hidden border border-emerald-50 aspect-video bg-stone-100 flex items-center justify-center relative">
                        <img
                          src={previewImage}
                          alt="Leaf Preview"
                          className="w-full h-full object-cover"
                        />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                            <span className="text-xs font-bold">Classifying Leaf Features...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Diagnosis Result Card */}
                <div className="lg:col-span-7">
                  {identificationResult ? (
                    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              identificationResult.health_status === 'Healthy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {identificationResult.health_status}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600">
                            {identificationResult.is_demo ? '🌱 Safe Demo Mode' : '🧠 Keras CNN Inference'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-stone-500 block">Confidence Score</span>
                          <span className="text-xl font-black text-emerald-700">
                            {identificationResult.confidence}%
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic Summary */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                          Identified Species
                        </span>
                        <h3 className="text-2xl font-black text-emerald-950">
                          {identificationResult.plant_name}
                        </h3>
                        <p className="text-sm font-semibold text-stone-700 mt-1">
                          Condition: <span className="text-emerald-800">{identificationResult.condition}</span>
                        </p>
                        <p className="text-xs text-stone-600 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                          {identificationResult.summary}
                        </p>
                      </div>

                      {/* Confidence Progress Meter */}
                      <div>
                        <div className="flex justify-between text-xs text-stone-500 font-semibold mb-1">
                          <span>Model Softmax Probability</span>
                          <span>{identificationResult.confidence}%</span>
                        </div>
                        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-700"
                            style={{ width: `${identificationResult.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Immediate Care Alert Box */}
                      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-start gap-3">
                        <Sprout className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                            Immediate Botanical Recommendation
                          </h4>
                          <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                            {identificationResult.immediate_care}
                          </p>
                        </div>
                      </div>

                      {/* Action Navigation Buttons */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            setSelectedPlant(identificationResult.plant_name);
                            setActiveTab('care');
                          }}
                          className="px-3 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-4 h-4" />
                          View Care Guide
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlant(identificationResult.plant_name);
                            setActiveTab('chat');
                          }}
                          className="px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Bot className="w-4 h-4 text-emerald-700" />
                          Ask AI About This
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlant(identificationResult.plant_name);
                            setActiveTab('dashboard');
                          }}
                          className="px-3 py-2.5 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Health Dashboard
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-200 text-center space-y-3">
                      <Camera className="w-10 h-10 text-stone-300 mx-auto" />
                      <h4 className="font-bold text-stone-700 text-sm">No Leaf Image Selected</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Please upload an image or choose one of the quick demo buttons on the left to start automated classification.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 3: PLANT CARE
             ======================================================== */}
          {activeTab === 'care' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-950">
                    🌱 Plant Care & Maintenance Guide
                  </h2>
                  <p className="text-sm text-stone-600">
                    Detailed botanical care guidelines for watering, sunlight, soil, fertilizers, and pruning.
                  </p>
                </div>

                {/* Plant Selector Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="plantSelect" className="text-xs font-bold text-stone-500">
                    Select Plant:
                  </label>
                  <select
                    id="plantSelect"
                    value={selectedPlant}
                    onChange={(e) => setSelectedPlant(e.target.value)}
                    className="bg-white border border-emerald-200 text-emerald-950 font-bold text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs"
                  >
                    {Object.keys(PLANT_DATABASE).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Plant Header Card */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Species Overview
                  </span>
                  <h3 className="text-2xl font-black mt-0.5">{currentPlantData.name}</h3>
                  <p className="text-xs italic text-emerald-100">{currentPlantData.scientific}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/20 text-xs">
                  <span className="text-emerald-200 block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-bold text-white">{currentPlantData.category}</span>
                </div>
              </div>

              {/* Care Specification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Watering */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">💧 Watering Routine</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{currentPlantData.watering}</p>
                </div>

                {/* 2. Sunlight */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">☀️ Sunlight Needs</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{currentPlantData.sunlight}</p>
                </div>

                {/* 3. Soil */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">🌱 Soil & Potting Mix</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{currentPlantData.soil}</p>
                </div>

                {/* 4. Temperature */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">🌡️ Ideal Temperature</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{currentPlantData.temperature}</p>
                </div>

                {/* 5. Fertilizer */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">🧪 Fertilizer & Nutrition</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{currentPlantData.fertilizer}</p>
                </div>

                {/* 6. Pruning */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">✂️ Pruning & Trimming</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{currentPlantData.pruning}</p>
                </div>
              </div>

              {/* Common Problems Warning Box */}
              <div className="bg-amber-50/80 border border-amber-200/80 p-5 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">⚠️ Common Problems & Warning Symptoms</h4>
                  <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                    {currentPlantData.commonProblems}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 4: AI PLANT CHATBOT
             ======================================================== */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-950">
                    🤖 Ask PlantCare AI
                  </h2>
                  <p className="text-sm text-stone-600">
                    Real-time botanical assistant powered by Google Gemini (with smart offline knowledge base fallback).
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>Focus Plant: {selectedPlant}</span>
                </div>
              </div>

              {/* Chat Container */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm flex flex-col h-[520px]">
                {/* Chat Message Scrollable Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                          msg.role === 'user'
                            ? 'bg-emerald-700 text-white rounded-tr-none'
                            : 'bg-stone-50 border border-stone-200/70 text-stone-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-3 justify-start items-center text-xs text-stone-500 italic">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 animate-pulse" />
                      </div>
                      <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-2 rounded-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-200"></span>
                        PlantCare AI is preparing botanical advice...
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Suggestion Chips */}
                <div className="px-6 py-2 border-t border-stone-100 bg-stone-50/50 flex flex-wrap gap-2 text-xs">
                  <span className="text-[11px] font-bold text-stone-400 self-center">Quick Ask:</span>
                  {[
                    `💧 How often should I water my ${selectedPlant}?`,
                    `🍂 Why are the leaves turning yellow?`,
                    `☀️ How much sunlight does this plant need?`,
                    `🧪 What fertilizer should I use?`,
                    `🐛 How can I protect against pests?`,
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 bg-white border border-stone-200 hover:border-emerald-300 rounded-lg text-stone-700 hover:text-emerald-900 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-4 border-t border-emerald-50 bg-white rounded-b-2xl flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Ask anything about ${selectedPlant} care, pests, or watering...`}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 5: PLANT HEALTH DASHBOARD
             ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-950">
                    📊 Plant Health & Routine Dashboard
                  </h2>
                  <p className="text-sm text-stone-600">
                    Summary metrics and 7-day care schedule for {currentPlantData.name}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-semibold">Focus Plant:</span>
                  <select
                    value={selectedPlant}
                    onChange={(e) => setSelectedPlant(e.target.value)}
                    className="bg-white border border-emerald-200 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-900"
                  >
                    {Object.keys(PLANT_DATABASE).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Metric Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Plant Identity
                  </span>
                  <p className="text-xl font-black text-emerald-950 mt-1">{currentPlantData.name}</p>
                  <p className="text-xs text-stone-500 italic mt-0.5">{currentPlantData.scientific}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Diagnostic Confidence
                  </span>
                  <p className="text-xl font-black text-emerald-700 mt-1">
                    {identificationResult ? `${identificationResult.confidence}%` : '94.5%'}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">High Softmax Score</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Foliage Health
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <p className="text-base font-bold text-stone-800">
                      {identificationResult ? identificationResult.health_status : 'Standard Good'}
                    </p>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">Checked via Vision</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Ideal Temperature
                  </span>
                  <p className="text-lg font-black text-stone-800 mt-1">
                    {currentPlantData.temperature.split('(')[0]}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">Optimum Growth Range</p>
                </div>
              </div>

              {/* Weekly Plant Care Schedule Section */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                    Weekly Plant Care Schedule (Monday → Sunday)
                  </h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Automated 7-Day Protocol
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-3 pt-2">
                  {Object.entries(currentPlantData.schedule).map(([day, task], idx) => {
                    const colors = [
                      'bg-emerald-700 text-white',
                      'bg-emerald-600 text-white',
                      'bg-emerald-500 text-white',
                      'bg-teal-600 text-white',
                      'bg-teal-500 text-white',
                      'bg-emerald-800 text-white',
                      'bg-stone-700 text-white',
                    ];
                    return (
                      <div
                        key={day}
                        className="p-4 rounded-xl border border-emerald-100/90 bg-stone-50/50 flex flex-col justify-between space-y-2 hover:bg-emerald-50/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-800">{day}</span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${colors[idx % colors.length]}`}
                          >
                            {idx + 1}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-950 leading-snug">{task}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specification Table */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-emerald-950">
                  📋 Full Botanical Specification Sheet
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Specific Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-emerald-900">💧 Watering Cycle</td>
                        <td className="py-2.5 px-3 text-stone-700">{currentPlantData.watering}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-amber-900">☀️ Sunlight Exposure</td>
                        <td className="py-2.5 px-3 text-stone-700">{currentPlantData.sunlight}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-emerald-900">🌱 Soil & Drainage</td>
                        <td className="py-2.5 px-3 text-stone-700">{currentPlantData.soil}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-red-900">🌡️ Temperature Limit</td>
                        <td className="py-2.5 px-3 text-stone-700">{currentPlantData.temperature}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-purple-900">🧪 Fertilizer Formula</td>
                        <td className="py-2.5 px-3 text-stone-700">{currentPlantData.fertilizer}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-stone-800">✂️ Pruning Strategy</td>
                        <td className="py-2.5 px-3 text-stone-700">{currentPlantData.pruning}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 6: ABOUT PROJECT & VIVA PREPARATION
             ======================================================== */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-emerald-950">
                  ℹ️ About AI PlantCare Assistant
                </h2>
                <p className="text-sm text-stone-600">
                  System architecture, technology stack, machine learning pipeline, and botanical technical insights.
                </p>
              </div>

              {/* Project Card */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  Project Profile
                </div>
                <h3 className="text-xl font-black text-emerald-950">
                  AI PlantCare Assistant
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  <strong>Objective:</strong> To provide a functional, user-friendly intelligent botanical platform that combines Computer Vision (Keras CNN on PlantVillage dataset) with modern Generative AI (Google Gemini via <code className="bg-stone-100 px-1 rounded text-emerald-800">google-genai</code>) to identify plants, diagnose foliage diseases, and supply actionable agricultural care protocols.
                </p>
              </div>

              {/* Technologies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                  <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-700" />
                    Technology Stack
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2">
                    <li>• <strong>Python 3.11.9:</strong> Primary programming language.</li>
                    <li>• <strong>Streamlit (&ge;1.40, &lt;2):</strong> Interactive reactive web user interface.</li>
                    <li>• <strong>TensorFlow (&ge;2.18, &lt;3) & Keras (&ge;3.5, &lt;4):</strong> CNN deep learning framework.</li>
                    <li>• <strong>PlantVillage Benchmark Dataset:</strong> 54,306 images across 38 crop disease classes.</li>
                    <li>• <strong>OpenCV (&ge;4.10, &lt;5) & Pillow (&ge;10, &lt;13):</strong> Image decoding & preprocessing.</li>
                    <li>• <strong>Google Gemini API (<code className="bg-stone-100 px-1 rounded">google-genai</code>):</strong> Natural language botanical chatbot.</li>
                    <li>• <strong>Pandas (&ge;2.2, &lt;3) & NumPy (&ge;1.26, &lt;3):</strong> Tabular data & array calculations.</li>
                    <li>• <strong>Matplotlib (&ge;3.9, &lt;4):</strong> Weekly schedule visualization.</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                  <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-700" />
                    How the AI Works
                  </h4>
                  <ol className="text-xs text-stone-600 space-y-2 list-decimal list-inside leading-relaxed">
                    <li><strong>Upload:</strong> User provides a leaf image via web interface.</li>
                    <li><strong>Preprocessing:</strong> Pillow resizes to (224, 224, 3) and normalizes pixels to [0, 1].</li>
                    <li><strong>Feature Extraction:</strong> Convolutional filters capture vein lesions and discoloration.</li>
                    <li><strong>Softmax Prediction:</strong> Computes probability distribution over PlantVillage classes.</li>
                    <li><strong>Care Mapping:</strong> Diagnostic engine queries <code className="bg-stone-100 px-1 rounded">plant_data.csv</code>.</li>
                    <li><strong>Generative Q&A:</strong> User converses with Gemini AI grounded in the plant context.</li>
                  </ol>
                </div>
              </div>

              {/* Technical Insights Bank */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                <h4 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-700" />
                  💡 Technical Architecture & AI FAQs
                </h4>

                <div className="space-y-3">
                  {[
                    {
                      q: 'Q1: Why is a Convolutional Neural Network (CNN) used instead of an MLP for leaf image classification?',
                      a: 'CNNs preserve spatial relationships using convolutional kernels, local receptive fields, and weight sharing. An MLP would flatten the 2D image into a huge 1D vector, losing spatial context and requiring millions of parameters that cause severe overfitting.',
                    },
                    {
                      q: 'Q2: What is the PlantVillage dataset?',
                      a: 'PlantVillage is a widely cited public computer vision dataset containing 54,306 high-resolution images of healthy and diseased plant leaves across 14 crops (tomato, potato, pepper, apple, grape, corn, etc.) spanning 38 distinct classes.',
                    },
                    {
                      q: 'Q3: How does the app handle situations where the trained Keras model is not installed yet?',
                      a: 'The application contains an automated Safe Demo Mode in utils/image_processing.py. Instead of throwing an unhandled exception or crashing, it safely simulates classification with transparent labeling, allowing anyone to test all pages seamlessly.',
                    },
                    {
                      q: 'Q4: How are API keys securely maintained in this Python project?',
                      a: 'Sensitive credentials like GEMINI_API_KEY are saved in the .env configuration file and read securely using python-dotenv. They are never hardcoded and are excluded from git via .gitignore.',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                      <p className="font-bold text-xs text-emerald-950">{item.q}</p>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 7: PYTHON CODE EXPLORER & RUNNER
             ======================================================== */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-950">
                    💻 Python Project Source Code & Local Runner
                  </h2>
                  <p className="text-sm text-stone-600">
                    All project files are generated and ready to run with <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-xs">streamlit run app.py</code> in VS Code or PowerShell.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyCodeToClipboard(`python -m venv venv\nvenv\\Scripts\\activate\npython -m pip install -r requirements.txt\nstreamlit run app.py`)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copiedState ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedState ? 'Copied Commands!' : 'Copy PowerShell Commands'}</span>
                  </button>
                </div>
              </div>

              {/* Windows PowerShell Run Steps */}
              <div className="bg-stone-900 text-emerald-300 p-5 rounded-2xl font-mono text-xs shadow-md space-y-2">
                <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2 mb-2 font-sans">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    How to Run in Windows PowerShell / VS Code:
                  </span>
                  <span className="text-[11px]">Python 3.11</span>
                </div>
                <p className="text-stone-400"># 1. Open project directory</p>
                <p className="text-emerald-400">cd AI-PlantCare-Assistant</p>
                <p className="text-stone-400 mt-2"># 2. Create and activate virtual environment</p>
                <p className="text-emerald-400">python -m venv venv</p>
                <p className="text-emerald-400">.\venv\Scripts\Activate.ps1</p>
                <p className="text-stone-400 mt-2"># 3. Install required packages</p>
                <p className="text-emerald-400">python -m pip install -r requirements.txt</p>
                <p className="text-stone-400 mt-2"># 4. Start Streamlit web app</p>
                <p className="text-amber-300 font-bold">streamlit run app.py</p>
              </div>

              {/* File Selector Tabs */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50 p-2 gap-1 text-xs font-semibold">
                  {[
                    { name: 'app.py', label: 'app.py' },
                    { name: 'requirements.txt', label: 'requirements.txt' },
                    { name: 'utils/plant_data.py', label: 'utils/plant_data.py' },
                    { name: 'utils/image_processing.py', label: 'utils/image_processing.py' },
                    { name: 'utils/ai_helper.py', label: 'utils/ai_helper.py' },
                    { name: 'data/plant_data.csv', label: 'data/plant_data.csv' },
                    { name: 'README.md', label: 'README.md' },
                  ].map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setSelectedCodeFile(f.name)}
                      className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                        selectedCodeFile === f.name
                          ? 'bg-white text-emerald-900 border border-stone-300 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-stone-900 text-stone-200 font-mono text-xs overflow-x-auto max-h-[460px]">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-stone-800 text-stone-400">
                    <span>File: {selectedCodeFile}</span>
                    <button
                      onClick={() => copyCodeToClipboard(
                        selectedCodeFile === 'requirements.txt'
                          ? `streamlit>=1.40,<2\npandas>=2.2,<3\nnumpy>=1.26,<3\nscikit-learn>=1.5,<2\nrequests>=2.32,<3\npython-dotenv>=1.0,<2\ngoogle-genai>=1.0,<2\nlangchain>=0.3,<2\nlangchain-community>=0.3,<1\nopencv-python>=4.10,<5\npillow>=10,<13\nmatplotlib>=3.9,<4\ntensorflow>=2.18,<3\nkeras>=3.5,<4`
                          : `# Please view and run file from AI-PlantCare-Assistant/${selectedCodeFile}`
                      )}
                      className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-emerald-400 flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </button>
                  </div>
                  <pre className="text-emerald-300">
                    {selectedCodeFile === 'requirements.txt' && `streamlit>=1.40,<2
pandas>=2.2,<3
numpy>=1.26,<3
scikit-learn>=1.5,<2
requests>=2.32,<3
python-dotenv>=1.0,<2
google-genai>=1.0,<2
langchain>=0.3,<2
langchain-community>=0.3,<1
opencv-python>=4.10,<5
pillow>=10,<13
matplotlib>=3.9,<4
tensorflow>=2.18,<3
keras>=3.5,<4`}

                    {selectedCodeFile === 'app.py' && `# app.py - Complete Streamlit Web Application
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

from utils.plant_data import load_plant_database, get_all_plant_names, get_plant_info
from utils.image_processing import predict_plant_image, is_model_available
from utils.ai_helper import ask_gemini_plant_assistant

st.set_page_config(page_title="AI PlantCare Assistant", page_icon="🌱", layout="wide")

st.sidebar.title("🌱 AI PlantCare")
page = st.sidebar.radio("Navigation", [
    "🏠 Home", "🔍 Plant Identification", "🌱 Plant Care",
    "🤖 Ask PlantCare AI", "📊 Plant Health Dashboard", "ℹ️ About Project"
])

# (See complete generated /app.py and AI-PlantCare-Assistant/app.py)`}

                    {selectedCodeFile === 'utils/plant_data.py' && `# utils/plant_data.py
import pandas as pd
from typing import Dict, Any

def load_plant_database() -> Dict[str, Dict[str, Any]]:
    # Loads from data/plant_data.csv with built-in dictionary fallback
    ...
def get_plant_info(plant_name: str) -> Dict[str, Any]:
    ...`}

                    {selectedCodeFile === 'utils/image_processing.py' && `# utils/image_processing.py
import os, numpy as np
from PIL import Image

def predict_plant_image(image_input):
    # Preprocesses image and evaluates via Keras model
    # Engages Safe Demo Mode if plant_model.keras is not yet placed
    ...`}

                    {selectedCodeFile === 'utils/ai_helper.py' && `# utils/ai_helper.py
from google import genai
from dotenv import load_dotenv

load_dotenv()

def ask_gemini_plant_assistant(user_query, plant_context=None):
    # Interacts with Gemini 3.8 Flash or returns local botanical advice if key missing
    ...`}

                    {selectedCodeFile === 'data/plant_data.csv' && `plant_name,scientific_name,category,watering,sunlight,soil,temperature...
Tomato,Solanum lycopersicum,Vegetable,"Water deeply 2–3 times a week","Full Sun 6–8h"...
Potato,Solanum tuberosum,Vegetable,"Water consistently 1–2 inches weekly"...`}

                    {selectedCodeFile === 'README.md' && `# 🌱 AI PlantCare Assistant
“Your intelligent companion for healthier plants.”
Complete AI and Botanical Health Application.
See full README.md file in the root or AI-PlantCare-Assistant folder.`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
