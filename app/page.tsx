import React from 'react';
import Link from 'next/link';

const modules = [
  { name: 'Ventes', icon: '🛍️', color: 'bg-indigo-600', path: '/sales' },
  { name: 'Achats', icon: '🛒', color: 'bg-red-500', path: '/purchases' },
  { name: 'Inventaire', icon: '📦', color: 'bg-emerald-500', path: '/inventory' },
  { name: 'Comptabilité', icon: '🧾', color: 'bg-blue-600', path: '/accounting' },
  { name: 'RH', icon: '👥', color: 'bg-orange-500', path: '/hr' },
  { name: 'Caisse', icon: '💰', color: 'bg-teal-500', path: '/cash' },
  { name: 'CRM', icon: '🤝', color: 'bg-purple-600', path: '/crm' },
  { name: 'Configuration', icon: '⚙️', color: 'bg-slate-600', path: '/settings' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] selection:bg-indigo-100">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl font-black text-slate-800 tracking-tight mb-4">
            TABOULOU <span className="text-indigo-600">ERP</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">
            Gérez votre entreprise avec la simplicité du moderne et la puissance de l&apos;Odoo.
          </p>
        </div>

        {/* APP GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {modules.map((module, idx) => (
            <Link
              key={module.name}
              href={module.path}
              className="group relative flex flex-col items-center p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-300 animate-in fade-in zoom-in-95 duration-700"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`w-20 h-20 rounded-3xl ${module.color} flex items-center justify-center text-4xl shadow-lg shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                {module.icon}
              </div>
              <span className="mt-4 font-bold text-slate-700 text-sm md:text-base group-hover:text-indigo-600 transition-colors">
                {module.name}
              </span>

              {/* DECORATIVE DOT */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
            </Link>
          ))}
        </div>

        {/* BOTTOM STATS PREVIEW (OPTIONAL) */}
        <div className="mt-20 p-8 rounded-[3rem] bg-indigo-900 text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-1">Résumé Global</p>
              <h2 className="text-3xl font-black">Performance en temps réel</h2>
            </div>
            <div className="flex gap-12">
              <div className="text-center">
                <p className="text-4xl font-black text-emerald-400">0</p>
                <p className="text-xs text-indigo-300 font-bold uppercase mt-1">Ventes / Mois</p>
              </div>
              <div className="text-center border-l border-indigo-800 pl-12">
                <p className="text-4xl font-black text-orange-400">0</p>
                <p className="text-xs text-indigo-300 font-bold uppercase mt-1">Alertes Stock</p>
              </div>
            </div>
          </div>

          {/* DECORATIVE MESH */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full -mr-20 -mt-20" />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 text-center">
        <div className="flex justify-center gap-6 mb-4">
          {['Support', 'Documentation', 'Mise à jour'].map(item => (
            <span key={item} className="text-slate-400 text-xs font-bold uppercase cursor-pointer hover:text-indigo-600 transition-colors">{item}</span>
          ))}
        </div>
        <p className="text-slate-400 text-[10px] font-medium tracking-widest">
          &copy; 2026 TABOULOU ERP - PREMIUM SOLUTION
        </p>
      </footer>
    </div>
  );
}