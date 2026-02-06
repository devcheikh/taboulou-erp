'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCashBalance, createCashMovement } from './actions';

export default function CashPage() {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showOpModal, setShowOpModal] = useState<'IN' | 'OUT' | null>(null);
    const [opAmount, setOpAmount] = useState('');
    const [opLabel, setOpLabel] = useState('');

    async function loadBalance() {
        setLoading(true);
        const bal = await getCashBalance();
        setBalance(bal);
        setLoading(false);
    }

    useEffect(() => {
        loadBalance();
    }, []);

    async function handleOperation() {
        if (!opAmount || !opLabel) return alert('Veuillez remplir tous les champs');
        setLoading(true);
        const result = await createCashMovement(showOpModal!, Number(opAmount), opLabel);
        setLoading(false);
        if (result.success) {
            setShowOpModal(null);
            setOpAmount('');
            setOpLabel('');
            loadBalance();
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900">
            <header className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors">🏠</Link>
                    <div className="h-6 w-[1px] bg-indigo-700/50" />
                    <h1 className="text-lg font-bold tracking-tight">Caisse & Trésorerie</h1>
                </div>
            </header>

            <main className="p-8 flex flex-col items-center">
                <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* CASH CARD */}
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-teal-100/50 overflow-hidden border border-teal-50 mb-8">
                        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-12 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 font-black">CASH</div>
                            <p className="text-teal-100 text-xs font-black uppercase tracking-[0.2em] mb-2">Solde de Caisse Actuel</p>
                            <h2 className="text-5xl font-black mb-2 animate-pulse">
                                {loading ? '---' : new Intl.NumberFormat('fr-FR').format(balance)} <small className="text-xl opacity-50">FCFA</small>
                            </h2>
                            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                Mise à jour directe
                            </div>
                        </div>

                        <div className="p-12 grid grid-cols-2 gap-6">
                            <button
                                onClick={() => setShowOpModal('IN')}
                                className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-emerald-50 border-2 border-transparent hover:border-emerald-200 transition-all group"
                            >
                                <span className="text-4xl group-hover:scale-110 transition-transform">💰</span>
                                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Encaisser</span>
                            </button>
                            <button
                                onClick={() => setShowOpModal('OUT')}
                                className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-red-50 border-2 border-transparent hover:border-red-200 transition-all group"
                            >
                                <span className="text-4xl group-hover:scale-110 transition-transform">💸</span>
                                <span className="text-xs font-black text-red-700 uppercase tracking-widest">Décaissement</span>
                            </button>
                        </div>

                        <div className="px-12 pb-12">
                            <button className="w-full border-2 border-slate-100 text-slate-400 py-5 rounded-[2rem] font-black text-sm hover:bg-slate-50 transition-all tracking-widest uppercase">
                                📋 Consulter le brouillard de caisse
                            </button>
                        </div>
                    </div>

                    {/* QUICK LOGS PREVIEW (Placeholder) */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Dernières opérations</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50"></div>
                                        <div className="h-3 w-32 bg-slate-100 rounded"></div>
                                    </div>
                                    <div className="h-3 w-16 bg-slate-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* OPERATION MODAL */}
            {showOpModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className={`p-8 text-white flex justify-between items-center ${showOpModal === 'IN' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                            <div>
                                <h2 className="text-xl font-black">{showOpModal === 'IN' ? 'Nouvel Encaissement' : 'Nouveau Décaissement'}</h2>
                                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Opération de caisse directe</p>
                            </div>
                            <button onClick={() => setShowOpModal(null)} className="text-2xl hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors">×</button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Montant de l'opération</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={opAmount}
                                        onChange={(e) => setOpAmount(e.target.value)}
                                        autoFocus
                                        className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl px-12 py-6 text-3xl font-black focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="0"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-black">F</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Motif / Libellé</label>
                                <input
                                    value={opLabel}
                                    onChange={(e) => setOpLabel(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="ex: Versement espèces xxxxx"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button onClick={() => setShowOpModal(null)} className="flex-1 border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black hover:bg-slate-50 transition-colors">ANNULER</button>
                                <button
                                    onClick={handleOperation}
                                    disabled={loading}
                                    className={`flex-2 px-8 py-4 rounded-2xl font-black shadow-lg transition-all text-white ${showOpModal === 'IN' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-red-600 shadow-red-100 hover:bg-red-700'}`}
                                >
                                    {loading ? 'OPÉRATION...' : 'VALIDER'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
