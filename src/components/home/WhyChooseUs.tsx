import React from 'react';
import { ShieldCheck, Sparkles, HeartHandshake, Truck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: Sparkles,
      title: 'Zero Chemical Refinement',
      desc: 'No bone-char, sulfur bleaching, or artificial mineral oil coating used on any grain or sugar.',
    },
    {
      icon: ShieldCheck,
      title: 'Direct From Delta Farmers',
      desc: 'Fair procurement from traditional organic growers across Thanjavur, Erode, Udangudi & Salem.',
    },
    {
      icon: HeartHandshake,
      title: 'Ancient Heirloom Seeds',
      desc: 'Preserving indigenous seeds like Mappillai Samba & Karuppu Kavuni, naturally rich in zinc & iron.',
    },
    {
      icon: Truck,
      title: 'Direct WhatsApp Support',
      desc: 'Instant order placement, personalized weight customisation, and real-time delivery tracking.',
    },
  ];

  return (
    <section className="my-16 bg-cream-50 rounded-3xl p-8 sm:p-12 border border-cream-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
          The NJ Essentials Difference
        </span>
        <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950 mt-3 mb-2">
          Why Families Trust NJ Essentials
        </h2>
        <p className="text-sm text-slate-600">
          We bring the purity of our grandmothers’ kitchens back to your modern dining table.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-cream-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-forest-900 text-amber-400 flex items-center justify-center mb-4 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900 mb-2">
                {pt.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {pt.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
