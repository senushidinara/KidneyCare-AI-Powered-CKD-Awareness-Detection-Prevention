import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";

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
  Flask: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 2v7.31"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>
};

// --- Custom Diagrams ---
const KidneyDiagram = () => (
  <svg viewBox="0 0 200 200" className="w-full h-48 mx-auto drop-shadow-lg">
    <defs>
      <linearGradient id="kidneyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#ef4444', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#991b1b', stopOpacity:1}} />
      </linearGradient>
    </defs>
    {/* Left Kidney */}
    <path d="M60,60 C30,60 20,100 30,130 C40,160 80,160 90,130 C95,115 90,80 80,75 C75,70 70,60 60,60 Z" fill="url(#kidneyGrad)" stroke="white" strokeWidth="2" />
    {/* Right Kidney */}
    <path d="M140,60 C170,60 180,100 170,130 C160,160 120,160 110,130 C105,115 110,80 120,75 C125,70 130,60 140,60 Z" fill="url(#kidneyGrad)" stroke="white" strokeWidth="2" />
    {/* Ureters */}
    <path d="M80,120 Q85,150 90,180" fill="none" stroke="#fca5a5" strokeWidth="4" strokeLinecap="round"/>
    <path d="M120,120 Q115,150 110,180" fill="none" stroke="#fca5a5" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

// --- Utilities ---
const STORAGE_KEY = 'kidneycare_data_v2';

const getLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { 
      water: 0, 
      bpHistory: [], 
      urineHistory: [], 
      creatinineHistory: [],
      assessment: null,
      quizScore: 0,
      badges: [] 
    };
  } catch (e) {
    return { water: 0, bpHistory: [], urineHistory: [], creatinineHistory: [], assessment: null, quizScore: 0, badges: [] };
  }
};

const setLocalStorage = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// --- Components ---

function Dashboard({ setActiveTab, data, updateWater }) {
  const waterTarget = 8; // cups
  const progress = Math.min((data.water / waterTarget) * 100, 100);

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ayubowan! 🙏</h1>
          <p className="text-slate-500 text-sm">Protect your kidneys today.</p>
        </div>
        <div className="flex gap-2">
          {data.badges.includes('guardian') && (
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 animate-pulse">
              <Icons.Trophy />
            </div>
          )}
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Icons.Heart />
          </div>
        </div>
      </header>

      {/* Hydration Widget */}
      <div className="glass-panel p-6 rounded-3xl shadow-lg border-l-8 border-blue-500 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icons.Droplet />
        </div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Hydration
          </h2>
          <span className="text-3xl font-black text-blue-600">{data.water}<span className="text-sm font-normal text-slate-400">/{waterTarget}</span></span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-blue-200 shadow-lg" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => updateWater(1)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-md transition active:scale-95 flex justify-center items-center gap-2"
          >
            <span className="text-xl">+</span> Add Cup
          </button>
          <button 
             onClick={() => updateWater(-1)}
             className="px-5 py-3 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 active:scale-95 font-bold"
          >
            -
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setActiveTab('assess')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 text-center active:scale-95 transition hover:shadow-md"
        >
          <div className="bg-red-50 p-4 rounded-full text-red-500">
            <Icons.Activity />
          </div>
          <span className="font-bold text-slate-700">Check Risk</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('track')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 text-center active:scale-95 transition hover:shadow-md"
        >
          <div className="bg-purple-50 p-4 rounded-full text-purple-500">
             <Icons.Flask />
          </div>
          <span className="font-bold text-slate-700">Lab Tracker</span>
        </button>
      </div>

      {/* Daily Tip - Sri Lankan Context */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-5 -bottom-5 text-white opacity-20 transform rotate-12">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">🌱 Healthy Habit</h3>
        <p className="opacity-95 leading-relaxed font-medium text-sm">
          Avoid excessive "dry fish" (Karawala) and salty "bites". Try replacing salt with spices like Goraka or Tamarind for flavor without the sodium spike!
        </p>
      </div>
    </div>
  );
}

function Education({ data, updateBadge }) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);

  const modules = [
    {
      id: 'anatomy',
      title: 'Kidney Anatomy',
      icon: '🧠',
      visual: <KidneyDiagram />,
      content: 'Your kidneys are powerful filters located in your lower back. Each kidney contains around a million tiny filters called nephrons. They work 24/7 to clean your blood.',
      points: ['2 Kidneys', 'Filter Blood', 'Make Urine']
    },
    {
      id: 'basics',
      title: 'What is CKD?',
      icon: '🩺',
      content: 'Chronic Kidney Disease (CKD) means your kidneys are damaged and can\'t filter blood the way they should. In Sri Lanka, CKDu (Unknown etiology) affects farmers in the North Central Province due to dehydration and agrochemicals.',
      points: ['Silent Disease', 'Progressive', 'CKDu in Farmers']
    },
    {
      id: 'prevention',
      title: 'Prevention & Diet',
      icon: '🥗',
      content: 'Eat fresh local vegetables like Snake Gourd (Pathola) and Ridge Gourd (Wetakolu). Drink plenty of clean water, especially if working in paddy fields under the sun. Avoid NSAID painkillers like Ibuprofen.',
      points: ['Hydrate', 'Local Veggies', 'No NSAIDs']
    }
  ];

  if (quizMode) {
    return <Quiz onFinish={(score) => {
      setQuizMode(false);
      if (score >= 3) updateBadge('guardian');
    }} />;
  }

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Learning Hub</h2>
      
      {modules.map(mod => (
        <div key={mod.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl p-2 bg-slate-50 rounded-xl">{mod.icon}</span>
              <span className="font-bold text-slate-800 text-lg">{mod.title}</span>
            </div>
            <div className={`transition-transform duration-300 ${activeModule === mod.id ? 'rotate-90' : ''}`}>
              <Icons.ArrowRight />
            </div>
          </button>
          
          {activeModule === mod.id && (
            <div className="p-6 pt-0 bg-white">
              {mod.visual && <div className="mb-4 bg-red-50 rounded-2xl p-4">{mod.visual}</div>}
              <p className="text-slate-600 leading-relaxed mb-4 text-sm font-medium">{mod.content}</p>
              <div className="flex flex-wrap gap-2">
                {mod.points.map(pt => (
                  <span key={pt} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-600">
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white text-center shadow-xl">
        <div className="mb-4 flex justify-center">
             <div className="bg-white/20 p-3 rounded-full"><Icons.Trophy /></div>
        </div>
        <h3 className="font-bold text-xl mb-1">Challenge Yourself</h3>
        <p className="opacity-90 text-sm mb-6">Take the quiz to earn the "Kidney Guardian" badge.</p>
        <button 
          onClick={() => setQuizMode(true)}
          className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition shadow-lg active:scale-95"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

function Quiz({ onFinish }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { q: "What is a major cause of CKDu in Sri Lanka?", options: ["Eating too much rice", "Dehydration & Agrochemicals", "Sleeping too much"], ans: 1 },
    { q: "Which vegetable is generally good for kidneys?", options: ["Snake Gourd (Pathola)", "Pickles", "Salty dry fish"], ans: 0 },
    { q: "What color should healthy urine be?", options: ["Dark Brown", "Red", "Pale Yellow"], ans: 2 },
    { q: "How many kidneys does a human usually have?", options: ["One", "Two", "Three"], ans: 1 },
  ];

  const handleAnswer = (idx) => {
    if (idx === questions[qIndex].ans) setScore(s => s + 1);
    
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="text-center py-10 px-6">
        <div className="text-6xl mb-6">{score >= 3 ? '🏆' : '📚'}</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
        <p className="text-slate-600 mb-8">You scored {score} out of {questions.length}</p>
        <button 
          onClick={() => onFinish(score)}
          className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold text-lg shadow-lg"
        >
          {score >= 3 ? 'Claim Badge & Exit' : 'Try Again Later'}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-400 font-bold text-sm">Question {qIndex + 1}/{questions.length}</span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Score: {score}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-8 min-h-[80px]">{questions[qIndex].q}</h3>
      
      <div className="space-y-4">
        {questions[qIndex].options.map((opt, i) => (
          <button 
            key={i}
            onClick={() => handleAnswer(i)}
            className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition font-medium text-slate-700"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Assessment({ onSave }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const questions = [
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
    { key: 'diabetes', label: 'Do you have Diabetes?', type: 'yesno' },
    { key: 'hypertension', label: 'Do you have High Blood Pressure?', type: 'yesno' },
    { key: 'family', label: 'Family History of Kidney Disease?', type: 'yesno' },
    { key: 'farming', label: 'Do you work in agriculture/farming?', type: 'yesno' },
    { key: 'water_source', label: 'Do you drink well water directly?', type: 'yesno' }
  ];

  const handleAnswer = (val: any) => {
    setAnswers({ ...answers, [questions[step].key]: val });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateRisk({ ...answers, [questions[step].key]: val });
    }
  };

  const calculateRisk = (finalAnswers: any) => {
    let score = 0;
    if (finalAnswers.diabetes === 'Yes') score += 3;
    if (finalAnswers.hypertension === 'Yes') score += 3;
    if (finalAnswers.family === 'Yes') score += 2;
    if (finalAnswers.age > 60) score += 2;
    if (finalAnswers.farming === 'Yes') score += 2;
    if (finalAnswers.water_source === 'Yes') score += 1; 

    let level = 'Low Risk';
    let color = 'text-green-600';
    let bg = 'bg-green-50';

    if (score >= 4 && score <= 6) {
      level = 'Moderate Risk';
      color = 'text-yellow-600';
      bg = 'bg-yellow-50';
    } else if (score > 6) {
      level = 'High Risk';
      color = 'text-red-600';
      bg = 'bg-red-50';
    }

    const res = { level, score, color, bg, details: finalAnswers };
    setResult(res);
    onSave(res);
  };

  const getAIAnalysis = async () => {
    setLoadingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a nephrologist. Analyze this patient profile for Chronic Kidney Disease (CKD) risk in the context of Sri Lanka.
        Keep the response concise (under 100 words), encouraging, and actionable.
        
        Profile:
        Age: ${result.details.age}
        Diabetes: ${result.details.diabetes}
        Hypertension: ${result.details.hypertension}
        Farming Occupation: ${result.details.farming}
        Drinking Well Water: ${result.details.water_source}
        
        Provide specific lifestyle advice mentioning local Sri Lankan diet or habits.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setAiAdvice(response.text);
    } catch (err) {
      console.error(err);
      setAiAdvice("Offline mode: AI analysis unavailable. Please check your connection.");
    } finally {
      setLoadingAI(false);
    }
  };

  if (result) {
    return (
      <div className="pb-20">
        <div className={`p-8 rounded-3xl ${result.bg} text-center mb-6 shadow-sm`}>
          <div className="text-6xl mb-4 animate-bounce">
            {result.level.includes('High') ? '🛑' : result.level.includes('Moderate') ? '⚠️' : '✅'}
          </div>
          <h2 className={`text-3xl font-bold ${result.color} mb-2`}>{result.level}</h2>
          <p className="text-slate-600 font-medium">Risk Score: {result.score}/10</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icons.Clipboard /> Recommendations
            </h3>
            <ul className="space-y-3 text-slate-600 text-sm font-medium">
              {result.details.farming === 'Yes' && <li className="flex gap-2">🌾 <span>Wear protective gear and hydrate well when farming.</span></li>}
              {result.details.water_source === 'Yes' && <li className="flex gap-2">💧 <span>Consider filtering or boiling your drinking water (RO filter recommended).</span></li>}
              <li className="flex gap-2">🩺 <span>Monitor your blood pressure regularly.</span></li>
              <li className="flex gap-2">🧂 <span>Limit salt intake (avoid too much achar or dried fish).</span></li>
            </ul>
          </div>

          {!aiAdvice ? (
            <button 
              onClick={getAIAnalysis}
              disabled={loadingAI}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition"
            >
              {loadingAI ? 'Consulting Dr. AI...' : <><Icons.Bot /> Get Personalized Advice</>}
            </button>
          ) : (
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
              <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2"><Icons.Bot /> Dr. Kidney AI says:</h3>
              <p className="text-slate-700 leading-relaxed text-sm">{aiAdvice}</p>
            </div>
          )}

          <button 
            onClick={() => { setResult(null); setStep(0); setAnswers({}); setAiAdvice(null); }}
            className="w-full border-2 border-slate-200 text-slate-500 p-4 rounded-2xl font-bold hover:bg-slate-50"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] justify-center">
      <div className="mb-8">
        <span className="text-sm font-bold text-blue-500 tracking-wider uppercase">Question {step + 1} of {questions.length}</span>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 mb-8">{q.label}</h2>

      <div className="space-y-3">
        {q.type === 'yesno' && (
          <>
            <button onClick={() => handleAnswer('Yes')} className="w-full p-5 text-left border-2 border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-500 transition font-bold text-lg text-slate-700">Yes</button>
            <button onClick={() => handleAnswer('No')} className="w-full p-5 text-left border-2 border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-500 transition font-bold text-lg text-slate-700">No</button>
          </>
        )}
        {q.type === 'select' && q.options.map(opt => (
           <button key={opt} onClick={() => handleAnswer(opt)} className="w-full p-5 text-left border-2 border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-500 transition font-bold text-lg text-slate-700">{opt}</button>
        ))}
        {q.type === 'number' && (
          <form onSubmit={(e) => { e.preventDefault(); const val = (e.target as any).val.value; if(val) handleAnswer(val); }}>
            <input name="val" type="number" className="w-full p-5 border-2 border-slate-200 rounded-2xl text-2xl font-bold mb-4 focus:border-blue-500 outline-none" placeholder="Enter value..." autoFocus />
            <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold text-lg shadow-lg">Next</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Tracker({ data, updateData }) {
  const [subTab, setSubTab] = useState('bp'); // bp, urine, creat

  const handleAddBP = (e) => {
    e.preventDefault();
    const sys = e.target.sys.value;
    const dia = e.target.dia.value;
    if(sys && dia) {
      updateData('bpHistory', { sys, dia, date: new Date().toLocaleDateString() });
      e.target.reset();
    }
  };

  const handleAddCreatinine = (e) => {
    e.preventDefault();
    const val = e.target.creat.value;
    if(val) {
      updateData('creatinineHistory', { val, date: new Date().toLocaleDateString() });
      e.target.reset();
    }
  };

  const handleAddUrine = (colorCode, label) => {
    updateData('urineHistory', { color: colorCode, label, date: new Date().toLocaleDateString() });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Health Log</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['bp', 'urine', 'creat'].map(t => (
            <button 
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${subTab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              {t === 'creat' ? 'Labs' : t}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'bp' && (
        <>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4 text-slate-700">Add Blood Pressure</h3>
            <form onSubmit={handleAddBP} className="flex gap-2">
              <input name="sys" type="number" placeholder="120" className="flex-1 p-3 border-2 border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 transition outline-none font-bold text-center" />
              <span className="self-center font-bold text-slate-300">/</span>
              <input name="dia" type="number" placeholder="80" className="flex-1 p-3 border-2 border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 transition outline-none font-bold text-center" />
              <button type="submit" className="bg-blue-600 text-white px-5 rounded-xl font-bold shadow-md active:scale-95">+</button>
            </form>
          </div>
          <div className="space-y-3">
             {data.bpHistory.slice().reverse().map((entry, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">{entry.date}</span>
                    <span className="font-black text-slate-700 text-xl">{entry.sys}/{entry.dia} <span className="text-xs font-normal text-slate-500">mmHg</span></span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${entry.sys > 140 || entry.dia > 90 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                </div>
             ))}
          </div>
        </>
      )}

      {subTab === 'urine' && (
        <>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4 text-slate-700">Urine Color Check</h3>
            <p className="text-xs text-slate-500 mb-4">Tap the color that matches your urine today.</p>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => handleAddUrine('#fefce8', 'Good')} className="h-16 rounded-xl bg-[#fefce8] border-2 border-slate-200 active:scale-90 transition"></button>
              <button onClick={() => handleAddUrine('#fde047', 'Fair')} className="h-16 rounded-xl bg-[#fde047] border-2 border-slate-200 active:scale-90 transition"></button>
              <button onClick={() => handleAddUrine('#eab308', 'Dehydrated')} className="h-16 rounded-xl bg-[#eab308] border-2 border-slate-200 active:scale-90 transition"></button>
              <button onClick={() => handleAddUrine('#854d0e', 'Danger')} className="h-16 rounded-xl bg-[#854d0e] border-2 border-slate-200 active:scale-90 transition"></button>
            </div>
          </div>
          <div className="space-y-3">
             {data.urineHistory.slice().reverse().map((entry, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-slate-100" style={{backgroundColor: entry.color}}></div>
                      <span className="font-bold text-slate-700">{entry.label}</span>
                   </div>
                   <span className="text-xs text-slate-400 font-medium">{entry.date}</span>
                </div>
             ))}
          </div>
        </>
      )}

      {subTab === 'creat' && (
        <>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4 text-slate-700">Add Creatinine (mg/dL)</h3>
            <form onSubmit={handleAddCreatinine} className="flex gap-2">
              <input name="creat" type="number" step="0.1" placeholder="1.0" className="flex-1 p-3 border-2 border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 transition outline-none font-bold text-center" />
              <button type="submit" className="bg-blue-600 text-white px-5 rounded-xl font-bold shadow-md active:scale-95">+</button>
            </form>
          </div>
          <div className="space-y-3">
             {data.creatinineHistory.slice().reverse().map((entry, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">{entry.date}</span>
                    <span className="font-black text-slate-700 text-xl">{entry.val} <span className="text-xs font-normal text-slate-500">mg/dL</span></span>
                  </div>
                </div>
             ))}
          </div>
        </>
      )}
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Ayubowan! I am Dr. Kidney AI. I can answer questions about Sri Lankan kidney health, CKD symptoms, and diet.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "You are a helpful, empathetic assistant for 'KidneyCare', a health app in Sri Lanka. Provide accurate, simple medical information about Chronic Kidney Disease (CKD) and CKDu. Mention local context (rice diet, ayurveda caution, farming, heat) when relevant. Keep answers concise."
        },
        history: history
      });

      const result = await chat.sendMessage({ message: userMsg });
      const responseText = result.text;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Offline Mode: Please connect to the internet to chat with Dr. AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none flex gap-1 shadow-sm">
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>
      
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about kidney health..."
          className="flex-1 p-4 rounded-2xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white p-4 rounded-2xl disabled:opacity-50 shadow-md active:scale-95"
        >
          <Icons.ArrowRight />
        </button>
      </form>
    </div>
  );
}

// --- Main App ---

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState(getLocalStorage());

  useEffect(() => {
    setLocalStorage(data);
  }, [data]);

  const updateWater = (amount) => {
    setData(prev => ({ ...prev, water: Math.max(0, prev.water + amount) }));
  };

  const updateAssessment = (result) => {
    setData(prev => ({ ...prev, assessment: result }));
  };

  const updateData = (key, val) => {
    setData(prev => ({ ...prev, [key]: [...prev[key], val] }));
  };

  const updateBadge = (badge) => {
    if(!data.badges.includes(badge)) {
      setData(prev => ({ ...prev, badges: [...prev.badges, badge] }));
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 relative shadow-2xl overflow-hidden border-x border-slate-200">
      <main className="p-6 h-screen overflow-y-auto no-scrollbar">
        {activeTab === 'home' && <Dashboard setActiveTab={setActiveTab} data={data} updateWater={updateWater} />}
        {activeTab === 'learn' && <Education data={data} updateBadge={updateBadge} />}
        {activeTab === 'assess' && <Assessment onSave={updateAssessment} />}
        {activeTab === 'track' && <Tracker data={data} updateData={updateData} />}
        {activeTab === 'chat' && <AIChat />}
      </main>

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around p-2 pb-6 safe-area-pb z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        {[
          { id: 'home', icon: Icons.Home, label: 'Home' },
          { id: 'learn', icon: Icons.Book, label: 'Learn' },
          { id: 'assess', icon: Icons.Activity, label: 'Assess' },
          { id: 'track', icon: Icons.Clipboard, label: 'Track' },
          { id: 'chat', icon: Icons.MessageCircle, label: 'Dr. AI', color: 'text-purple-600 bg-purple-50' }
        ].map(tab => (
           <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition duration-300 ${activeTab === tab.id ? (tab.color || 'text-blue-600 bg-blue-50 scale-105') : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <tab.icon />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);