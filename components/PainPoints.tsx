
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, PhoneOff, Clock, TrendingDown } from 'lucide-react';

const PainPoints: React.FC = () => {
  const cards = [
    {
      title: "The 9 PM Customer",
      description: "When you stop answering, your leads start searching. Our agents pick up the slack while you sleep.",
      icon: <Moon className="text-[#BF00FF]" size={32} />,
      stat: "67% of leads go to the first to respond."
    },
    {
      title: "The Phone Tag Game",
      description: "Stop wasting hours leaving voicemails. Our AI qualifies leads and books them directly into your calendar.",
      icon: <PhoneOff className="text-[#39FF14]" size={32} />,
      stat: "Save 12+ hours per week per employee."
    },
    {
      title: "The Slow Quote",
      description: "Speed to lead is everything. Give instant answers to pricing and service questions before your competition.",
      icon: <Clock className="text-[#BF00FF]" size={32} />,
      stat: "24/7 instant response capabilities."
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest mb-4 border border-red-500/20"
        >
          <TrendingDown size={14} />
          Your Revenue Leak
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Every missed call is <span className="text-red-500">lost money</span>.
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Local businesses lose an average of 30% of potential revenue simply because they can't be at the phone 24/7. We change that.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-8 rounded-3xl hover:border-[#39FF14]/30 transition-all duration-300 group"
          >
            <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
            <p className="text-white/60 mb-6 leading-relaxed">{card.description}</p>
            <div className="pt-6 border-t border-white/10 text-sm font-semibold text-[#39FF14]">
              {card.stat}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PainPoints;
