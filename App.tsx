
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, ShieldCheck, ArrowUpRight, Calculator, TrendingUp } from 'lucide-react';
import ChatDemo from './components/ChatDemo.tsx';
import PainPoints from './components/PainPoints.tsx';
import LeadWizard from './components/LeadWizard.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-[#39FF14] selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-[#39FF14] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.3)]">
              <Bot className="text-black" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter">Aiolos <span className="text-[#39FF14]">Media</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pain-points" className="hover:text-white transition-colors">Revenue Leak</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
          </div>

          <a href="#audit-form" className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white/10 transition-colors">
            Contact Sales
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#BF00FF]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-[600px] h-[600px] bg-[#39FF14]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#39FF14] text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap size={14} /> The Future of Business Automation
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              Stop Losing <span className="text-[#39FF14]">30%</span> of Your Revenue to Missed Calls.
            </h1>
            <div className="relative">
              <p className="text-xl text-white/60 mb-6 leading-relaxed max-w-xl">
                We build custom AI Agents that answer phones, provide live cost estimate quotes, text leads, and book appointments 24/7. Never miss a customer again.
              </p>
              
              {/* Live Cost Estimation Quotes */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <div className="glass px-4 py-3 rounded-2xl border-l-4 border-l-[#39FF14] flex items-center gap-3">
                  <Calculator className="text-[#39FF14]" size={18} />
                  <div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Typical Setup</div>
                    <div className="text-sm font-bold text-white">Starting at <span className="text-[#39FF14]">$499</span></div>
                  </div>
                </div>
                <div className="glass px-4 py-3 rounded-2xl border-l-4 border-l-[#BF00FF] flex items-center gap-3">
                  <TrendingUp className="text-[#BF00FF]" size={18} />
                  <div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Avg. Monthly ROI</div>
                    <div className="text-sm font-bold text-white">Estimated <span className="text-[#BF00FF]">12x - 15x</span></div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#audit-form" 
                className="bg-[#39FF14] text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)]"
              >
                Get Your Custom Audit <ArrowUpRight size={20} />
              </a>
              <a 
                href="#demo" 
                className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                Watch Video Demo
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#39FF14]" />
                Zero Setup Risk
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#39FF14]" />
                Go-Live in 48 Hours
              </div>
            </div>
          </motion.div>

          <div id="demo" className="relative">
            <ChatDemo />
            {/* Annotation for Demo */}
            <div className="absolute -bottom-6 -right-6 glass p-4 rounded-2xl hidden md:block border border-white/20 max-w-[200px]">
              <p className="text-xs font-medium text-white/80 italic">
                "This agent handled 400+ calls for a local dental clinic last month."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
          <span className="text-2xl font-bold tracking-tighter">RE/MAX</span>
          <span className="text-2xl font-bold tracking-tighter">LAWGROUP</span>
          <span className="text-2xl font-bold tracking-tighter">SMARTPLUMB</span>
          <span className="text-2xl font-bold tracking-tighter">DENTALCO</span>
          <span className="text-2xl font-bold tracking-tighter">HVAC.AI</span>
        </div>
      </div>

      {/* Revenue Leak Section */}
      <div id="pain-points">
        <PainPoints />
      </div>

      {/* Qualification Wizard */}
      <LeadWizard />

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#39FF14] rounded-lg flex items-center justify-center">
                <Bot className="text-black" size={20} />
              </div>
              <span className="text-lg font-black tracking-tighter">Aiolos <span className="text-[#39FF14]">Media</span></span>
            </div>
            <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
              We empower local businesses with enterprise-grade AI automation that's affordable and effective. Built by CRO experts and engineers.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                <span className="text-white font-bold">X</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                <span className="text-white font-bold">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">SMS Agents</a></li>
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">Voice AI Agents</a></li>
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">CRM Integrations</a></li>
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">Call Tracking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#39FF14] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/20">
          <p>© {new Date().getFullYear()} Aiolos Media. All rights reserved.</p>
          <div className="flex gap-8">
            <p>Made for high-growth businesses</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
