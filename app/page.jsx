"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, Loader2, Zap, AlertCircle, Trash2 } from "lucide-react";
import axios from "axios";

export default function page() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalysis = async () => {
    if (!file || !jd) {
      alert("Please upload a resume and paste the Job Description!");
      return;
    }

    setLoading(true);
    setResult(null); // Reset previous results

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);

    try {
      const response = await axios.post("/api", formData);
      if (response.data.success) {
        setResult(response.data.analysis);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between mb-12 px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            {/* Glow effect for AI feel */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-900 p-2 rounded-lg border border-blue-500/30">
              <Zap className="text-blue-400 fill-blue-400/20 group-hover:fill-blue-400 transition-colors" size={24} />
            </div>
          </div>

          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-black tracking-tighter text-white">
              GEN<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI</span>
              <span className="ml-1 font-light text-slate-400">ATS</span>
            </h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500/80 font-bold">Neural Checker</span>
          </div>
        </div>

        {/* Tech Stack Badge */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">GEN-AI ACTIVE</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div className="text-[10px] text-blue-400 font-mono font-bold italic">
            LLAMA 3.1 + GROQ
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: INPUTS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-[#151921] border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
              <Upload size={16} /> Data Input
            </h2>

            {/* Resume Upload */}
            <div className="mb-6">
              <label className="block text-sm mb-3 font-medium">1. Resume (PDF Only)</label>
              <div className={`relative group border-2 border-dashed rounded-xl p-8 transition-all text-center ${file ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500'}`}>
                <input
                  type="file" accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {!file ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <FileText size={20} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400 italic">Drop your PDF here</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-500" size={18} />
                      <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                    </div>
                    <button onClick={() => setFile(null)} className="text-slate-500 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* JD Input */}
            <div className="mb-6">
              <label className="block text-sm mb-3 font-medium">2. Job Description</label>
              <textarea
                rows={8}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none placeholder:text-slate-600"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={handleAnalysis}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/10"
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : "Start ATS Check"}
            </motion.button>
          </section>
        </div>

        {/* RIGHT COLUMN: RESULTS (7 Cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-[550px] border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-[#151921]/30 backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-400">Ready to Analyze</h3>
                <p className="text-slate-600 text-sm max-w-xs mt-2 italic">Upload your resume to see your match score and improvement areas.</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#151921] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-8"
              >
                {/* Score Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-800 pb-8">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                      <motion.circle
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={364.4}
                        initial={{ strokeDashoffset: 364.4 }}
                        animate={{ strokeDashoffset: 364.4 - (364.4 * result.matchPercentage) / 100 }}
                        className="text-blue-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold">{result.matchPercentage}%</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2 underline decoration-blue-500/50 underline-offset-8">Analysis Complete</h2>
                    <p className="text-slate-400 text-sm leading-relaxed italic">"{result.profileSummary}"</p>
                  </div>
                </div>

                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Missing Keywords */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-medium capitalize">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-green-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span> Smart Fixess
                    </h3>
                    <ul className="space-y-3">
                      {result.improvements?.map((imp, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-400 leading-tight">
                          <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}







// "use client";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Upload, FileText, CheckCircle, Loader2, Zap, AlertCircle, Trash2, Bot, BrainCircuit, SearchCode, Cpu } from "lucide-react";
// import axios from "axios";

// export default function ATSDashboard() {
//   const [file, setFile] = useState(null);
//   const [jd, setJd] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);

//   // Agentic workflow steps for visual feedback
//   const agentSteps = [
//     { icon: <FileText size={18} />, text: "LangChain PDFLoader: Extracting Text..." },
//     { icon: <SearchCode size={18} />, text: "AI Agent: Analyzing Job Description..." },
//     { icon: <Cpu size={18} />, text: "Groq Llama 3.1: Comparing Entities..." },
//     { icon: <BrainCircuit size={18} />, text: "Finalizing ATS Scoring..." }
//   ];

//   useEffect(() => {
//     let interval;
//     if (loading) {
//       interval = setInterval(() => {
//         setActiveStep((prev) => (prev < 3 ? prev + 1 : 0));
//       }, 1500);
//     } else {
//       setActiveStep(0);
//     }
//     return () => clearInterval(interval);
//   }, [loading]);

//   const handleAnalysis = async () => {
//     if (!file || !jd) {
//       alert("Please upload a resume and paste the Job Description!");
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     const formData = new FormData();
//     formData.append("resume", file);
//     formData.append("jobDescription", jd);

//     try {
//       const response = await axios.post("/api", formData);
//       if (response.data.success) {
//         setResult(response.data.analysis);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert(error.response?.data?.error || "Analysis failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">

//       {/* --- TOP BRANDING SECTION --- */}
//       <header className="max-w-6xl mx-auto mb-10">
//         <nav className="flex items-center justify-between border-b border-slate-800/60 pb-6">
//           <div className="flex items-center gap-3">
//             <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
//               <Bot className="text-white" size={28} />
//             </div>
//             <div>
//               <h1 className="text-2xl font-black tracking-tighter text-white">
//                 AGENT<span className="text-blue-500">ATS</span>
//               </h1>
//               <div className="flex items-center gap-2">
//                 <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold tracking-widest uppercase">
//                   LangChain Agent
//                 </span>
//                 <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold tracking-widest uppercase">
//                   Llama 3.1
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-6">
//             <div className="text-right">
//               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inference Engine</p>
//               <p className="text-xs font-mono text-slate-300">Groq Cloud API</p>
//             </div>
//             <div className="h-8 w-[1px] bg-slate-800"></div>
//             <div className="text-right">
//               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status</p>
//               <p className="text-xs font-mono text-green-400 flex items-center gap-1 justify-end">
//                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Systems Ready
//               </p>
//             </div>
//           </div>
//         </nav>
//       </header>

//       <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//         {/* LEFT COLUMN: INPUTS */}
//         <div className="lg:col-span-5 space-y-6">
//           <section className="bg-[#151921] border border-slate-800 p-6 rounded-2xl shadow-xl">
//             <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
//               <Upload size={14} /> Knowledge Base Input
//             </h2>

//             {/* Resume Upload */}
//             <div className="mb-6">
//               <label className="block text-sm mb-3 font-medium text-slate-300 italic font-mono tracking-tight underline underline-offset-4 decoration-blue-500/30">
//                 // 1. Load Candidate Resume (PDF)
//               </label>
//               <div className={`relative group border-2 border-dashed rounded-xl p-8 transition-all text-center ${file ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 hover:border-blue-500/30'}`}>
//                 <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
//                 {!file ? (
//                   <div className="space-y-2">
//                     <FileText size={32} className="text-slate-700 mx-auto group-hover:text-blue-500 transition-colors" />
//                     <p className="text-xs text-slate-500 font-medium">Click or Drag PDF</p>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-700">
//                     <div className="flex items-center gap-3 text-sm">
//                       <FileText size={18} className="text-blue-400" />
//                       <span className="truncate max-w-[150px] font-medium">{file.name}</span>
//                     </div>
//                     <button onClick={() => setFile(null)} className="p-1 hover:bg-red-500/10 rounded group">
//                       <Trash2 size={16} className="text-slate-500 group-hover:text-red-500" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* JD Input */}
//             <div className="mb-6">
//               <label className="block text-sm mb-3 font-medium text-slate-300 italic font-mono tracking-tight underline underline-offset-4 decoration-blue-500/30">
//                 // 2. Target Job Requirements
//               </label>
//               <textarea
//                 rows={7} value={jd} onChange={(e) => setJd(e.target.value)}
//                 placeholder="Paste the job description here..."
//                 className="w-full bg-[#0b0e14] border border-slate-800 rounded-xl p-4 text-sm font-mono focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none placeholder:text-slate-700 text-blue-100/80"
//               />
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
//               onClick={handleAnalysis}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 disabled:bg-slate-800"
//             >
//               {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} fill="white" /> Execute AI Agent</>}
//             </motion.button>
//           </section>

//           {/* AGENT STATUS PANEL */}
//           <AnimatePresence>
//             {loading && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
//                 className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
//                     <span className="relative flex h-2 w-2">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
//                     </span>
//                     Agent Live Trace
//                   </h4>
//                   <span className="text-[9px] font-mono text-slate-500">Task_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
//                 </div>
//                 <div className="space-y-4">
//                   {agentSteps.map((step, idx) => (
//                     <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${activeStep === idx ? 'translate-x-2 opacity-100' : 'opacity-20 grayscale'}`}>
//                       <div className={`p-2 rounded-lg ${activeStep === idx ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-slate-800 text-slate-500'}`}>
//                         {step.icon}
//                       </div>
//                       <span className="text-xs font-mono font-medium">{step.text}</span>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* RIGHT COLUMN: RESULTS */}
//         <div className="lg:col-span-7">
//           <AnimatePresence mode="wait">
//             {!result ? (
//               <motion.div className="h-full min-h-[500px] border border-slate-800/50 rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-[#151921]/20 backdrop-blur-sm border-dashed">
//                 <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center mb-6 border border-slate-700/50">
//                   <BrainCircuit size={40} className="text-slate-700" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-400 italic font-mono">Waiting for Data...</h3>
//                 <p className="text-slate-600 text-sm max-w-xs mt-3">Upload a resume and job description to initialize the LangChain analysis agent.</p>
//               </motion.div>
//             ) : (
//               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#151921] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-8">
//                 {/* Result content goes here (Match percentage, Missing skills, etc.) */}
//                 {/* ... Previous result logic remains same ... */}
//                 <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-center">
//                   <p className="text-xs font-mono text-green-400">Analysis successfully completed by Llama 3.1 & LangChain Agent</p>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   );
// }