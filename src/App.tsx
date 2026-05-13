/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  Search, 
  Brain, 
  Zap, 
  Target,
  ArrowRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { analyzeResume, type AnalysisResult } from "@/lib/gemini";
import { extractTextFromPDF } from "@/lib/pdf";
import { cn } from "@/lib/utils";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setProgress(10);

    try {
      setProgress(30);
      const resumeText = await extractTextFromPDF(file);
      setProgress(50);
      const analysis = await analyzeResume(resumeText, jd);
      setProgress(90);
      setResult(analysis);
      setProgress(100);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById("analysis-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[160px] rounded-full pointer-events-none z-0" />
      
      <nav className="relative z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-lg text-white">R</div>
            <span className="font-bold tracking-tight text-xl">Resume<span className="text-primary">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Integrations</a>
            <Button variant="ghost" className="text-sm font-medium">Support</Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Advanced Professional Analysis Engine
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight text-gradient"
          >
            Bridge the Gap to <br /> Your Next <span className="text-primary italic">Career</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Empowering professionals with AI-driven insights. Upload your resume to unlock 
            data-backed improvements and ATS optimization in seconds.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card bg-slate-900/50 rounded-3xl p-8 space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">01 / Resume Index</h3>
                  {file && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">READY</Badge>}
                </div>
                
                <div className={cn(
                  "relative group h-64 rounded-2xl border-2 border-dashed transition-all duration-500 overflow-hidden",
                  file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/20 hover:bg-white/[0.02]"
                )}>
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    {file ? (
                      <div className="space-y-1">
                        <div className="text-sm font-bold truncate max-w-[200px]">{file.name}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">{(file.size / 1024).toFixed(1)} KB • PDF</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm font-bold">Drop PDF to begin</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Supports Standard A4 Layouts</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">02 / Target Context</h3>
                <Textarea 
                  placeholder="Paste Job Description..." 
                  className="min-h-[140px] bg-white/[0.02] border-white/10 focus:border-primary/40 rounded-2xl resize-none text-sm p-6 placeholder:text-white/10 font-medium"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
              </div>

              <Button 
                onClick={startAnalysis}
                disabled={!file || isAnalyzing}
                className="w-full h-14 rounded-2xl bg-primary text-white font-black tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all glow-primary disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SYNTHESIZING {progress}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    GENERATE INSIGHTS
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </motion.div>
            
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase flex gap-3 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Results Bento */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center py-24 space-y-8">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-t-primary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold tracking-tight uppercase">Processing Semantic Data</h3>
                    <p className="text-xs text-muted-foreground font-bold tracking-widest">System Load: Optimized</p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div key="result" id="analysis-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Performance Bento Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="glass-card bg-slate-900/50 rounded-[32px] p-8 space-y-4 md:col-span-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Index</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-primary tracking-tighter">{result.overallScore}</span>
                        <span className="text-sm font-bold opacity-20">/100</span>
                      </div>
                    </div>
                    <div className="glass-card bg-slate-900/50 rounded-[32px] p-8 space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Weight</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter text-slate-100">{result.contentScore}</span>
                        <span className="text-xs font-bold opacity-20">/100</span>
                      </div>
                      <Progress value={result.contentScore} className="h-1 bg-white/5" />
                    </div>
                    <div className="glass-card bg-slate-900/50 rounded-[32px] p-8 space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ATS Density</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter text-slate-100">{result.atsScore}</span>
                        <span className="text-xs font-bold opacity-20">/100</span>
                      </div>
                      <Progress value={result.atsScore} className="h-1 bg-white/5" />
                    </div>
                  </div>

                  <Tabs defaultValue="insights" className="w-full">
                    <TabsList className="bg-slate-900/40 border border-white/5 p-1 rounded-2xl flex w-full h-14 mb-8">
                      {["INSIGHTS", "KEYWORDS", "LEARNING"].map((tab) => (
                        <TabsTrigger 
                          key={tab} 
                          value={tab.toLowerCase()} 
                          className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-slate-400 text-[10px] font-black tracking-widest py-3 transition-all"
                        >
                          {tab}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="insights" className="space-y-6">
                      <div className="glass-card bg-slate-900/50 rounded-3xl p-8 space-y-6">
                        <h4 className="text-sm font-black text-primary uppercase tracking-widest font-mono">/ Summary</h4>
                        <p className="text-lg font-semibold leading-relaxed text-slate-50">{result.summary}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card bg-slate-900/50 rounded-3xl p-8 space-y-6 border-l-2 border-l-emerald-500/40">
                          <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">/ Verified Strengths</h4>
                          <div className="grid gap-4">
                            {result.strengths.map((s, i) => (
                              <div key={i} className="flex gap-4 group">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                <p className="text-sm font-semibold text-slate-100 leading-relaxed group-hover:text-white transition-colors">{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="glass-card bg-slate-900/50 rounded-3xl p-8 space-y-6 border-l-2 border-l-red-500/40">
                          <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">/ GAP Analysis</h4>
                          <div className="grid gap-4">
                            {result.weaknesses.map((w, i) => (
                              <div key={i} className="flex gap-4 group">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-sm font-semibold text-slate-100 leading-relaxed group-hover:text-white transition-colors">{w}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="keywords" className="space-y-8">
                      <div className="glass-card bg-slate-900/50 rounded-[32px] p-10 space-y-12">
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-4">
                            Matching Capabilities
                            <div className="h-px bg-white/5 flex-grow" />
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {result.keywordMatch.matched.map((kw, i) => (
                              <Badge key={i} className="bg-primary/20 hover:bg-primary/30 text-white border-primary/30 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] flex items-center gap-4">
                            Missing Requirements
                            <div className="h-px bg-white/5 flex-grow" />
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {result.keywordMatch.missing.map((kw, i) => (
                              <Badge key={i} variant="outline" className="bg-red-500/10 text-red-200 border-red-500/20 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="learning" className="space-y-4">
                      {result.recommendations.map((rec, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="glass-card bg-slate-900/50 hover:bg-slate-900/80 p-6 rounded-2xl flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">0{i+1}</div>
                            <span className="text-sm font-bold text-slate-50 group-hover:text-white">{rec}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                        </motion.div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center min-h-[500px] glass-card rounded-[64px] border-dashed p-12 text-center group"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-24 h-24 rounded-3xl bg-white/[0.02] flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-700">
                      <Target className="w-10 h-10 text-primary/40" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight mb-4 uppercase">Infrastructure Standby</h3>
                  <p className="text-muted-foreground text-base max-w-xs mx-auto font-medium leading-relaxed">
                    Analyzing nodes currently inactive. Feed the source input to begin high-fidelity optimization.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Footer */}
        <footer className="mt-48 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-[11px] font-black text-muted-foreground tracking-widest uppercase">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise API</a>
          </div>
          <div className="text-[11px] font-mono text-white/10">© 2026 RESUME.AI / CLOUD_DEPLOYMENT: PROD_1</div>
        </footer>
      </div>
    </div>
  );
}
