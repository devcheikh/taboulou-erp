'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { seedInitialData, exportAllData } from './actions';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSeed() {
        if (!confirm('Cela va initialiser les journaux et le plan comptable de base. Continuer ?')) return;
        setLoading(true);
        const result = await seedInitialData();
        setLoading(false);
        setMessage(result.success ? 'Initialisation réussie !' : result.error || 'Erreur');
    }

    async function handleExport() {
        setLoading(true);
        const data = await exportAllData();
        setLoading(false);
        if (data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_erp_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            setMessage('Export terminé avec succès !');
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900">
            <header className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors">🏠</Link>
                    <div className="h-6 w-[1px] bg-indigo-700/50" />
                    <h1 className="text-lg font-bold tracking-tight">Configuration Système</h1>
                </div>
            </header>

            <main className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
                {message && (
                    <div className="bg-emerald-100 border-2 border-emerald-200 text-emerald-700 p-4 rounded-2xl font-bold text-sm animate-bounce">
                        ✅ {message}
                    </div>
                )}

                {/* INITIALIZATION SECTION */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">⚡</div>
                        <div>
                            <h3 className="text-xl font-black">Mise en place initiale</h3>
                            <p className="text-xs text-slate-400 font-medium">Configurez les journaux, entrepôts et comptes de base (SYSCOHADA).</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSeed}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase tracking-widest text-sm"
                    >
                        {loading ? 'CHARGEMENT...' : 'INITIALISER LES DONNÉES DE BASE'}
                    </button>
                </section>

                {/* BACKUP SECTION */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">📦</div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Sauvegarde & Export</h3>
                            <p className="text-xs text-slate-400 font-medium">Téléchargez l'intégralité de vos données au format JSON pour archive.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full border-2 border-amber-200 text-amber-700 py-4 rounded-2xl font-black hover:bg-amber-50 disabled:opacity-50 transition-all uppercase tracking-widest text-sm"
                    >
                        TÉLÉCHARGER UNE SAUVEGARDE COMPLÈTE
                    </button>
                </section>

                {/* SETTINGS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Utilisateurs & Droits', 'Paramètres de la Société', 'Devises & Taxes', 'Stock & Entrepôts'].map(item => (
                        <div key={item} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 cursor-pointer transition-all opacity-50 grayscale select-none">
                            <h3 className="font-bold text-slate-800 mb-2">{item}</h3>
                            <p className="text-xs text-slate-400 font-medium">Coming Soon...</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
