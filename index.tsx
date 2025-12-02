import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// --- Icons (Inline SVG) ---
const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Book: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Activity: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Clipboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  MessageCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Droplet: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  Heart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  Bot: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="m14 9 2 2-2 2" /><path d="m9 9-2 2 2 2" /></svg>,
  Trophy: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Flask: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 2v7.31"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>,
  Pen: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  XCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
};

// --- Educational Content (Sri Lanka Context) ---
const EDUCATION_MODULES = [
  {
    id: 1,
    title: "Anatomy: The Kidney",
    content: "Your kidneys are two bean-shaped organs, each about the size of a fist. In Sri Lanka, heat stress significantly impacts kidney function. They filter about 120-150 quarts of blood daily to produce 1-2 quarts of urine, composed of wastes and extra fluid.",
    icon: <Icons.Heart />,
    color: "bg-red-100 text-red-600"
  },
  {
    id: 2,
    title: "CKDu in Sri Lanka",
    content: "CKDu (Chronic Kidney Disease of unknown etiology) is prevalent in the North Central Province (Rajarata). Unlike traditional CKD, it's not caused by Diabetes or Hypertension but potentially by agrochemicals, hard water, and heavy metals combined with dehydration.",
    icon: <Icons.Activity />,
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: 3,
    title: "Dietary Habits",
    content: "A healthy Sri Lankan diet for kidneys involves reducing salt (avoiding too much dry fish/Karawala). Native vegetables like Kohila and fibrous rice (Red Rice/Kurakkan) are beneficial, but moderation is key. Avoid excessive use of painkillers (NSAIDs).",
    icon: <Icons.Droplet />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 4,
    title: "Early Symptoms",
    content: "CKD is often silent. Look out for: swollen ankles/feet (Edema), fatigue/weakness, foamy urine (protein leakage), and frequent urination at night. In farming communities, back pain combined with heat exhaustion is a warning sign.",
    icon: <Icons.Activity />,
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    id: 5,
    title: "Diagnosis & Testing",
    content: "Early detection saves lives. Key tests include Serum Creatinine (blood test) and Urine Albumin (urine test). eGFR is calculated from Creatinine. In Sri Lanka, routine screening is free at government hospitals.",
    icon: <Icons.Clipboard />,
    color: "bg-purple-100 text-purple-600"
  }
];

// --- Components ---

const KidneyDiagram = () => (
  <div className="flex justify-center my-6">
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 40 C 30 50, 20 100, 60 150 C 90 170, 120 140, 110 100 C 105 80, 80 30, 60 40 Z" fill="#e89ca9" stroke="#be4d5c" strokeWidth="4"/>
      <path d="M140 40 C 170 50, 180 100, 140 150 C 110 170, 80 140, 90 100 C 95 80, 120 30, 140 40 Z" fill="#e89ca9" stroke="#be4d5c" strokeWidth="4"/>
      <path d="M85 100 L 85 180" stroke="#fca5a5" strokeWidth="8" strokeLinecap="round" />
      <path d="M115 100 L 115 180" stroke="#fca5a5" strokeWidth="8" strokeLinecap="round" />
      <circle cx="65" cy="80" r="5" fill="#be4d5c" opacity="0.5"/>
      <circle cx="135" cy="80" r="5" fill="#be4d5c" opacity="0.5"/>
      <text x="100" y="190" textAnchor="middle" fill="#881337" fontSize="12" fontFamily="sans-serif">Ureters to Bladder</text>
    </svg>
  </div>
);

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Icons.Home },
    { id: 'education', label: 'Learn', icon: Icons.Book },
    { id: 'assessment', label: 'Risk Test', icon: Icons.Clipboard },
    { id: 'tracker', label: 'Tracker', icon: Icons.Activity },
    { id: 'chat', label: 'Dr. Kidney', icon: Icons.MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-16 shadow-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 ${
            activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <tab.icon />
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const Header = () => (
  <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
    <div className="relative z-10">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Icons.Droplet /> KidneyCare
      </h1>
      <p className="text-blue-100 text-sm mt-1 opacity-90">Arm-Powered Offline Health 🇱🇰</p>
    </div>
  </header>
);

const EssayGenerator = () => {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEssay = async () => {
    if (!topic) return;
    setLoading(true);
    setEssay("");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Write a detailed 2000-word educational guide about: "${topic}". 
      Structure:
      1. Introduction & Physiology
      2. Relevance to Sri Lanka (Statistics, geography like Rajarata)
      3. Causes & Risk Factors (Local context)
      4. Symptoms & Early Warning Signs
      5. Diagnosis & Treatment
      6. Prevention (Dietary specifics like Kurakkan, Red Rice, hydration)
      7. Conclusion.
      Ensure the content is medically accurate but accessible.`;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: "You are a specialized medical educator for Sri Lankan kidney health. Write comprehensive, 2000-word structured essays. Format with clear Markdown headers, bullet points for symptoms/prevention, and bold text for key terms. Focus heavily on local context (Sri Lankan diet, agriculture, heat stress, Ayurvedic perspectives vs Western medicine). Tone: Professional, empathetic, educational."
        },
        contents: prompt
      });

      const text = result.text;
      setEssay(text);
    } catch (error) {
      console.error("Error generating essay:", error);
      setEssay("Sorry, I couldn't generate the essay offline. Please check your connection if using the AI feature.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
          <Icons.Pen />
        </div>
        <h3 className="font-bold text-gray-800">Kidney Scholar AI</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">Generate comprehensive study guides (2000+ words) on specific topics.</p>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Impact of Dehydration on Kidneys"
          className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button 
          onClick={generateEssay}
          disabled={loading || !topic}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <span className="animate-spin">⌛</span> : <Icons.Sparkles />}
          Write
        </button>
      </div>

      {essay && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl max-h-96 overflow-y-auto border border-gray-200 prose prose-sm max-w-none">
             <div className="markdown-container">
                <ReactMarkdown>{essay}</ReactMarkdown>
             </div>
        </div>
      )}
    </div>
  );
};

const Quiz = () => {
  const allQuestions = [
    {
      q: "Which part of the kidney filters blood?",
      a: ["Nephron", "Ureter", "Bladder", "Urethra"],
      c: 0,
      explanation: "The Nephron is the microscopic structural and functional unit of the kidney responsible for filtering blood."
    },
    {
      q: "What is a common cause of CKDu in Sri Lanka?",
      a: ["Eating too much sugar", "Dehydration & Agrochemicals", "Lack of sleep", "Vitamin C deficiency"],
      c: 1,
      explanation: "CKDu in regions like Rajarata is strongly linked to chronic dehydration combined with exposure to agrochemicals and hard water."
    },
    {
      q: "What color is healthy urine?",
      a: ["Dark Brown", "Red", "Pale Yellow", "Clear like water"],
      c: 2,
      explanation: "Pale yellow (straw color) indicates good hydration. Clear means over-hydration, while dark indicates dehydration."
    },
    {
      q: "Which Sri Lankan food is good for kidneys in moderation?",
      a: ["Salty Dry Fish (Karawala)", "Red Rice", "Instant Noodles", "Pickles (Achcharu)"],
      c: 1,
      explanation: "Red Rice (Heenati, Suwandel) has fiber and a lower glycemic index compared to white polished rice. Salty foods like Karawala damage kidneys."
    },
    {
      q: "Why should you avoid NSAIDs (Painkillers)?",
      a: ["They cause headaches", "They reduce blood flow to kidneys", "They make you sleepy", "They increase hunger"],
      c: 1,
      explanation: "NSAIDs (like Ibuprofen/Diclofenac) constrict blood vessels to the kidney, potentially causing acute injury if used often."
    },
    {
      q: "What is the function of the Glomerulus?",
      a: ["Store Urine", "Filter waste from blood", "Produce hormones", "Transport urine"],
      c: 1,
      explanation: "The Glomerulus is a cluster of capillaries that acts as the initial filter in the nephron."
    },
    {
      q: "Is King Coconut (Thambili) safe for advanced CKD patients?",
      a: ["Yes, always", "No, it has high Potassium", "Only in the morning", "Yes, it cleans kidneys"],
      c: 1,
      explanation: "Patients with advanced CKD cannot filter Potassium well. Thambili is very high in Potassium and can cause heart issues for them."
    },
    {
      q: "What is a sign of 'Edema'?",
      a: ["Hair loss", "Swollen feet and ankles", "Red eyes", "Coughing"],
      c: 1,
      explanation: "Edema occurs when kidneys fail to remove excess fluid, causing it to build up in tissues like feet and ankles."
    },
    {
      q: "Which heavy metal is suspected in CKDu?",
      a: ["Gold", "Cadmium & Arsenic", "Iron", "Zinc"],
      c: 1,
      explanation: "Cadmium and Arsenic, often found in fertilizers and pesticides, are key suspects in the etiology of CKDu."
    },
    {
      q: "How much water should a healthy adult drink in a hot climate?",
      a: ["1 Liter", "2-3 Liters", "5 Liters", "Only when thirsty"],
      c: 1,
      explanation: "In hot climates like Sri Lanka's dry zone, 2.5 to 3 liters is recommended to prevent crystal formation and kidney stress."
    },
    // New Questions
    {
      q: "What is Creatinine?",
      a: ["A vitamin", "A waste product from muscles", "A type of sugar", "A kidney hormone"],
      c: 1,
      explanation: "Creatinine is a waste product produced by muscles. Healthy kidneys filter it out; high levels in blood suggest kidney trouble."
    },
    {
      q: "Which local grain is often recommended for fiber?",
      a: ["White Bread", "Kurakkan (Finger Millet)", "Cake", "Pol Roti"],
      c: 1,
      explanation: "Kurakkan is rich in fiber and has a low glycemic index, helping control blood sugar, which protects kidneys."
    },
    {
      q: "What is 'Rat Fever' (Leptospirosis) risk to kidneys?",
      a: ["No risk", "Causes acute kidney failure", " Improves function", "Causes kidney stones"],
      c: 1,
      explanation: "Leptospirosis is common in paddy fields and can cause Acute Kidney Injury (AKI) if untreated."
    },
    {
      q: "Why is high blood pressure bad for kidneys?",
      a: ["It makes them grow", "It damages blood vessels in kidneys", "It cools them down", "It has no effect"],
      c: 1,
      explanation: "Hypertension damages the delicate filtering units (nephrons) over time, leading to CKD."
    },
    {
      q: "What is the best drink for kidney health?",
      a: ["Soda", "Pure Water", "Tea with much sugar", "Energy drinks"],
      c: 1,
      explanation: "Pure water is the best solvent to flush out toxins. Sugary drinks increase diabetes risk, a leading cause of CKD."
    },
    {
      q: "Does smoking affect kidneys?",
      a: ["No, only lungs", "Yes, reduces blood flow", "Yes, increases size", "No effect"],
      c: 1,
      explanation: "Smoking slows blood flow to important organs like the kidneys and worsens kidney disease."
    },
    {
      q: "What is a 'Kidney Stone'?",
      a: ["A piece of bone", "Hard deposits of minerals/salts", "A tumor", "A type of infection"],
      c: 1,
      explanation: "Kidney stones are hard deposits made of minerals and salts that form inside your kidneys."
    },
    {
      q: "Can herbal medicines (Arishta) harm kidneys?",
      a: ["Never", "Always safe", "Some contain harmful toxins/metals", "They cure CKD"],
      c: 2,
      explanation: "Some unregulated herbal products may contain aristolochic acid or heavy metals that are toxic to kidneys."
    },
    {
      q: "What is 'Proteinuria'?",
      a: ["Sugar in urine", "Blood in urine", "Protein in urine", "Bacteria in urine"],
      c: 2,
      explanation: "Protein in urine is an early sign of kidney damage, as healthy kidneys shouldn't let protein pass through filters."
    },
    {
      q: "Who is at highest risk for CKD?",
      a: ["Teenagers", "People with Diabetes/Hypertension", "Athletes", "People who eat fruit"],
      c: 1,
      explanation: "Diabetes and High Blood Pressure are the two leading causes of Chronic Kidney Disease worldwide."
    }
  ];

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  // Feedback States
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Shuffle and pick 5 random questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswer = (index) => {
    if (showFeedback) return; // Prevent clicking while feedback is showing

    const correct = index === questions[currentQ].c;
    setIsCorrect(correct);
    setSelectedOption(index);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setIsCorrect(null);

    const nextQ = currentQ + 1;
    if (nextQ < questions.length) {
      setCurrentQ(nextQ);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrentQ(0);
    setScore(0);
    setShowScore(false);
    setShowFeedback(false);
  };

  if (questions.length === 0) return <div>Loading Quiz...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 my-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
          <Icons.Trophy />
        </div>
        <h3 className="font-bold text-gray-800">Knowledge Quiz</h3>
      </div>

      {showScore ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-4">
            {score === questions.length ? "🛡️" : score > questions.length / 2 ? "🎉" : "📚"}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">You scored {score} / {questions.length}</h3>
          <p className="text-gray-500 mb-6">
            {score === questions.length ? "Perfect! You are a Kidney Guardian!" : "Keep learning to protect your health."}
          </p>
          <button 
            onClick={resetQuiz}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">{questions[currentQ].q}</h4>
          
          <div className="space-y-3">
            {questions[currentQ].a.map((ans, idx) => {
              // Determine button style based on state
              let btnClass = "w-full text-left p-3 rounded-xl text-sm font-medium transition-all border ";
              if (!showFeedback) {
                 btnClass += "bg-gray-50 hover:bg-gray-100 border-transparent text-gray-700";
              } else {
                 if (idx === questions[currentQ].c) {
                    btnClass += "bg-green-100 border-green-500 text-green-800"; // Always highlight correct answer
                 } else if (idx === selectedOption && !isCorrect) {
                    btnClass += "bg-red-100 border-red-500 text-red-800"; // Highlight wrong selection
                 } else {
                    btnClass += "opacity-50 bg-gray-50 border-transparent"; // Dim others
                 }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showFeedback}
                  className={btnClass}
                >
                  {ans}
                  {showFeedback && idx === questions[currentQ].c && <span className="float-right">✅</span>}
                  {showFeedback && idx === selectedOption && !isCorrect && <span className="float-right">❌</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl border-l-4 animation-fade-in ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{isCorrect ? "🎉" : "💡"}</div>
                <div>
                  <h5 className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? "Spot on!" : "Not quite right."}
                  </h5>
                  {!isCorrect && (
                    <p className="text-sm text-gray-600 mt-1">
                      The correct answer is: <span className="font-semibold">{questions[currentQ].a[questions[currentQ].c]}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2 italic border-t border-gray-200 pt-2">
                    {questions[currentQ].explanation}
                  </p>
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium"
              >
                {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Education = () => (
  <div className="p-6 pb-24 space-y-6">
    <h2 className="text-xl font-bold text-gray-800">Kidney Health Library</h2>
    <KidneyDiagram />
    <div className="grid gap-4">
      {EDUCATION_MODULES.map((mod) => (
        <div key={mod.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${mod.color}`}>
              {mod.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{mod.title}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{mod.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <Quiz />
    <EssayGenerator />
  </div>
);

const Assessment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ age: '', bp: '', diabetes: false, family: false, fatigue: false });
  const [risk, setRisk] = useState(null);

  const calculateRisk = () => {
    let score = 0;
    if (parseInt(formData.age) > 50) score += 2;
    if (formData.bp === 'high') score += 3;
    if (formData.diabetes) score += 4;
    if (formData.family) score += 2;
    if (formData.fatigue) score += 1;

    setRisk(score > 6 ? 'High' : score > 3 ? 'Moderate' : 'Low');
    setStep(2);
  };

  return (
    <div className="p-6 pb-24">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Icons.Clipboard /> Risk Assessment
        </h2>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border-none" 
                value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
              <select className="w-full p-3 bg-gray-50 rounded-xl border-none"
                value={formData.bp} onChange={e => setFormData({...formData, bp: e.target.value})}>
                <option value="">Select...</option>
                <option value="normal">Normal</option>
                <option value="high">High (Hypertension)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" checked={formData.diabetes} onChange={e => setFormData({...formData, diabetes: e.target.checked})} />
                <span className="text-sm text-gray-700">I have Diabetes</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" checked={formData.family} onChange={e => setFormData({...formData, family: e.target.checked})} />
                <span className="text-sm text-gray-700">Family History of CKD</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" checked={formData.fatigue} onChange={e => setFormData({...formData, fatigue: e.target.checked})} />
                <span className="text-sm text-gray-700">Frequent Fatigue / Swelling</span>
              </label>
            </div>

            <button onClick={calculateRisk} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold mt-4 shadow-lg shadow-blue-200">
              Analyze Risk
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className={`text-6xl mb-4 ${risk === 'High' ? 'text-red-500' : risk === 'Moderate' ? 'text-orange-500' : 'text-green-500'}`}>
              {risk === 'High' ? '⚠️' : risk === 'Moderate' ? '⚖️' : '✅'}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{risk} Risk Detected</h3>
            <p className="text-gray-500 mt-2 mb-6">
              {risk === 'High' ? "Please consult a Nephrologist immediately. Avoid NSAIDs and monitor BP." : 
               risk === 'Moderate' ? "Monitor your hydration and reduce salt intake. Re-check in 3 months." : 
               "Great job! Keep maintaining a healthy lifestyle with good hydration."}
            </p>
            <button onClick={() => setStep(1)} className="text-blue-600 font-medium">Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Tracker = () => {
  const [logs, setLogs] = useState([]);
  const [urineColor, setUrineColor] = useState(1);
  const [creatinine, setCreatinine] = useState("");

  const addLog = () => {
    const newLog = { 
      date: new Date().toLocaleDateString(), 
      urine: urineColor,
      creat: creatinine || 'N/A'
    };
    setLogs([newLog, ...logs]);
    setCreatinine("");
  };

  const urineColors = [
    { val: 1, color: '#fef9c3', label: 'Hydrated' }, // Clear/Pale
    { val: 2, color: '#fde047', label: 'Okay' },    // Yellow
    { val: 3, color: '#eab308', label: 'Dehydrated' }, // Dark Yellow
    { val: 4, color: '#a16207', label: 'Danger' },  // Brownish
  ];

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Health Journal</h2>
      
      {/* Urine Tracker */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3">Urine Color Check</h3>
        <div className="flex justify-between gap-2 mb-4">
          {urineColors.map((u) => (
            <button
              key={u.val}
              onClick={() => setUrineColor(u.val)}
              className={`flex-1 h-12 rounded-lg border-2 transition-all ${urineColor === u.val ? 'border-blue-500 scale-105' : 'border-transparent'}`}
              style={{ backgroundColor: u.color }}
            />
          ))}
        </div>
        <p className="text-center text-sm font-medium text-gray-600">
          Status: <span className={urineColor > 2 ? 'text-red-500' : 'text-green-500'}>
            {urineColors.find(u => u.val === urineColor)?.label}
          </span>
        </p>
      </div>

      {/* Creatinine Tracker */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3">Lab Values</h3>
        <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Creatinine (mg/dL)" 
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              className="flex-1 p-3 bg-gray-50 rounded-xl"
            />
            <button onClick={addLog} className="bg-blue-600 text-white px-4 rounded-xl">Save</button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3">History</h3>
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="flex justify-between text-sm p-2 border-b border-gray-50">
              <span className="text-gray-500">{log.date}</span>
              <div className="flex gap-4">
                <span className="font-medium">Cr: {log.creat}</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: urineColors.find(u => u.val === log.urine)?.color }}></div>
              </div>
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-400 text-center text-sm">No logs yet.</p>}
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Ayubowan! I am Dr. Kidney AI. How can I help you protect your kidneys today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    const newMsgs = [...messages, { role: 'user', text: input }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
             systemInstruction: "You are a helpful nephrology assistant for Sri Lankans. Keep answers short (under 50 words), simple, and culturally relevant. Mention seeing a doctor for serious issues."
        },
        contents: newMsgs.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] }))
      });
      
      setMessages([...newMsgs, { role: 'model', text: result.text }]);
    } catch (e) {
      setMessages([...newMsgs, { role: 'model', text: "I'm having trouble connecting. Please check your internet." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-xs text-gray-400 animate-pulse">Thinking...</div>}
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask about kidney health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-full">
            <Icons.ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ setTab }) => (
  <div className="p-6 pb-24 space-y-6">
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
      <h2 className="text-xl font-bold mb-2">Daily Tip 🇱🇰</h2>
      <p className="text-indigo-100 text-sm leading-relaxed mb-4">
        "Avoid dehydration in the heat! Drink water before you feel thirsty. Coconut water is good, but limit it if you already have kidney issues."
      </p>
      <button onClick={() => setTab('education')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm transition-colors">
        Read More
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <button onClick={() => setTab('assessment')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors">
        <div className="bg-red-100 p-3 rounded-full text-red-500"><Icons.Activity /></div>
        <span className="font-semibold text-gray-700 text-sm">Check Risk</span>
      </button>
      <button onClick={() => setTab('tracker')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors">
        <div className="bg-blue-100 p-3 rounded-full text-blue-500"><Icons.Flask /></div>
        <span className="font-semibold text-gray-700 text-sm">Log Health</span>
      </button>
    </div>

    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Hydration Goal</h3>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">1.2 / 3.0 L</span>
      </div>
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 w-[40%] rounded-full relative">
          <div className="absolute top-0 right-0 h-full w-full bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">Keep drinking small amounts often!</p>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#f8fafc] max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <Header />
      <main className="h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard setTab={setActiveTab} />}
        {activeTab === 'education' && <Education />}
        {activeTab === 'assessment' && <Assessment />}
        {activeTab === 'tracker' && <Tracker />}
        {activeTab === 'chat' && <Chat />}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);