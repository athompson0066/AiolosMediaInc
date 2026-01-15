
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  CheckCircle2, 
  Globe, 
  User, 
  MessageSquare, 
  ArrowLeft, 
  Loader2, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { LeadPainPoint, LeadData } from '../types';
import { submitLeadToSheet } from '../services/sheetService';

const LeadWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    website: '',
    painPoint: LeadPainPoint.MISSED_CALLS,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const success = await submitLeadToSheet(formData);
      if (success) {
        setStep(5);
      } else {
        setSubmitError("We couldn't reach the server. Please check your connection.");
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: 'Contact' },
    { id: 2, label: 'Business' },
    { id: 3, label: 'Needs' },
    { id: 4, label: 'Details' }
  ];

  const isStep1Valid = formData.name && formData.email && formData.phone;
  const isStep2Valid = formData.companyName && formData.jobTitle && formData.website;

  return (
    <section id="audit-form" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Get Your Custom AI Audit</h2>
          <p className="text-white/50">Tell us about your business and we'll show you how much revenue you're leaving on the table.</p>
        </div>

        <div className="glass p-8 rounded-[40px] relative overflow-hidden shadow-2xl">
          {/* Progress Bar */}
          <div className="flex justify-between mb-8">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  step >= s.id ? 'bg-[#39FF14] text-black' : 'bg-white/10 text-white/40'
                }`}>
                  {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">Personal Info</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#39FF14]/50 transition-colors"
                        placeholder="Your Full Name"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#39FF14]/50 transition-colors"
                        placeholder="Work Email Address"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#39FF14]/50 transition-colors"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Next Step <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">Company Details</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#39FF14]/50 transition-colors"
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#39FF14]/50 transition-colors"
                        placeholder="Job Title"
                      />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        required
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#39FF14]/50 transition-colors"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 border border-white/10 rounded-2xl py-4 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeft size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={nextStep}
                      disabled={!isStep2Valid}
                      className="flex-[2] bg-[#39FF14] text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      Continue <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">The Goal</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <select
                        value={formData.painPoint}
                        onChange={(e) => setFormData({...formData, painPoint: e.target.value as LeadPainPoint})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 focus:border-[#39FF14]/50 transition-colors appearance-none"
                      >
                        {Object.values(LeadPainPoint).map(p => (
                          <option key={p} value={p} className="bg-[#1a1a1a] text-white">{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 border border-white/10 rounded-2xl py-4 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeft size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="flex-[2] bg-[#39FF14] text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                      Almost Done <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">Additional Feedback or Notes</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-6 text-white/30" size={18} />
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#39FF14]/50 transition-colors h-32 resize-none"
                        placeholder="Anything else we should know? (e.g. current software, specific goals...)"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl text-sm"
                    >
                      <AlertCircle size={16} />
                      {submitError}
                    </motion.div>
                  )}

                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 border border-white/10 rounded-2xl py-4 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeft size={18} />
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[3] bg-[#39FF14] text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.4)] disabled:opacity-50"
                    >
                      {isSubmitting ? <><Loader2 className="animate-spin" /> Submitting...</> : "Generate My Audit"}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 text-center">
                    By submitting, your data will be securely sent to our team's Google Sheet for analysis.
                  </p>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-[#39FF14]/20 text-[#39FF14] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Audit Request Received!</h3>
                  <p className="text-white/60 mb-8 leading-relaxed">
                    Thanks {formData.name.split(' ')[0]}! Our team is analyzing <strong>{formData.companyName}</strong>. 
                    Your details have been successfully saved to our database. 
                    We'll send your custom report to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        companyName: '',
                        jobTitle: '',
                        website: '',
                        painPoint: LeadPainPoint.MISSED_CALLS,
                        notes: ''
                      });
                    }}
                    className="text-[#39FF14] font-semibold hover:underline"
                  >
                    Send another request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadWizard;
