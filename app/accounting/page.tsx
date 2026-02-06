'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJournals, getAccounts, getTrialBalance, getGeneralLedger } from './actions';

export default function AccountingPage() {
    const [journals, setJournals] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [trialBalance, setTrialBalance] = useState<any[]>([]);
    const [ledger, setLedger] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    async function init() {
        setLoading(true);
        const jData = await getJournals();
        const aData = await getAccounts();
        const tbData = await getTrialBalance();
        const lgData = await getGeneralLedger();

        setJournals(jData);
        setAccounts(aData);
        setTrialBalance(tbData);
        setLedger(lgData);
        setLoading(false);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 selection:bg-indigo-100">
            <header className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors">🏠</Link>
                    <div className="h-6 w-[1px] bg-indigo-700/50" />
                    <h1 className="text-lg font-bold tracking-tight">Comptabilité & Finance</h1>
                </div>
                <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                    {['dashboard', 'ledger', 'balance', 'coa'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-indigo-900 shadow-lg' : 'text-indigo-200 hover:bg-white/10'}`}
                        >
                            {tab === 'dashboard' ? 'Tableau de bord' : tab === 'ledger' ? 'Grand Livre' : tab === 'balance' ? 'Balance' : 'Plan Comptable'}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="p-8">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* 1. DASHBOARD VIEW */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {journals.filter(j => ['VEN', 'ACH', 'CSH'].includes(j.code)).map(journal => (
                                        <div key={journal.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{journal.code}</span>
                                                <span className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl">
                                                    {journal.code === 'VEN' ? '📈' : journal.code === 'ACH' ? '📉' : '💰'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-800 mb-1">{journal.name}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-6">
                                                {journal._count.entries} opérations enregistrées
                                            </p>
                                            <button onClick={() => setActiveTab('ledger')} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                                                Détails du Journal
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. GENERAL LEDGER VIEW */}
                        {activeTab === 'ledger' && (
                            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-10 py-8 border-b border-slate-200 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-black">Grand Livre Général</h2>
                                        <p className="text-sm font-medium text-slate-400">Historique complet de tous les mouvements par compte</p>
                                    </div>
                                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest">Exporter PDF</button>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-10 py-5">Date</th>
                                            <th className="px-10 py-5">Journal</th>
                                            <th className="px-10 py-5">Référence/Libellé</th>
                                            <th className="px-10 py-5">Compte</th>
                                            <th className="px-10 py-5 text-right">Débit</th>
                                            <th className="px-10 py-5 text-right">Crédit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ledger.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-4 text-xs font-bold text-slate-500">{new Date(item.entry.date).toLocaleDateString('fr-FR')}</td>
                                                <td className="px-10 py-4">
                                                    <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-1 rounded uppercase">{item.entry.journal.code}</span>
                                                </td>
                                                <td className="px-10 py-4">
                                                    <div className="font-bold text-slate-800 text-sm">{item.label}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{item.entry.reference}</div>
                                                </td>
                                                <td className="px-10 py-4 font-black text-indigo-900 text-xs">{item.account.code}</td>
                                                <td className="px-10 py-4 text-right font-black text-emerald-600">{Number(item.debit) > 0 ? new Intl.NumberFormat('fr-FR').format(item.debit) : '-'}</td>
                                                <td className="px-10 py-4 text-right font-black text-red-600">{Number(item.credit) > 0 ? new Intl.NumberFormat('fr-FR').format(item.credit) : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* 3. TRIAL BALANCE VIEW */}
                        {activeTab === 'balance' && (
                            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-10 py-8 border-b border-slate-200">
                                    <h2 className="text-2xl font-black">Balance Générale</h2>
                                    <p className="text-sm font-medium text-slate-400">Situation cumulative du plan comptable (Débit / Crédit / Solde)</p>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-10 py-5">Compte</th>
                                            <th className="px-10 py-5">Intitulé</th>
                                            <th className="px-10 py-5 text-right">Mouvement Débit</th>
                                            <th className="px-10 py-5 text-right">Mouvement Crédit</th>
                                            <th className="px-10 py-5 text-right">Solde Final</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trialBalance.map((row) => (
                                            <tr key={row.id} className="border-b border-slate-50">
                                                <td className="px-10 py-5 font-black text-indigo-600">{row.code}</td>
                                                <td className="px-10 py-5 font-bold text-slate-700">{row.name}</td>
                                                <td className="px-10 py-5 text-right font-black text-slate-900">{new Intl.NumberFormat('fr-FR').format(row.debit)}</td>
                                                <td className="px-10 py-5 text-right font-black text-slate-900">{new Intl.NumberFormat('fr-FR').format(row.credit)}</td>
                                                <td className={`px-10 py-5 text-right font-black ${row.balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                    {new Intl.NumberFormat('fr-FR').format(Math.abs(row.balance))} {row.balance < 0 ? 'C' : 'D'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* 4. CHART OF ACCOUNTS VIEW */}
                        {activeTab === 'coa' && (
                            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-10 py-8 border-b border-slate-200 flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-slate-800">Plan Comptable (SYSCOHADA)</h2>
                                    <button className="bg-white border-2 border-slate-200 text-slate-400 px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-slate-50 transition-all">Imprimer</button>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {accounts.map(acc => (
                                        <div key={acc.id} className="p-6 rounded-2xl border-2 border-slate-50 hover:border-indigo-100 transition-all bg-white shadow-sm">
                                            <p className="text-xs font-black text-indigo-600 mb-1">{acc.code}</p>
                                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{acc.name}</h4>
                                            <span className="inline-block mt-3 text-[9px] font-black text-slate-300 uppercase tracking-tighter">{acc.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
