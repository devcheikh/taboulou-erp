'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPurchases } from './actions';
import AddPurchaseForm from './AddPurchaseForm';
import { Purchase, Partner, PurchaseItem } from '@prisma/client';

type PurchaseWithRelations = Purchase & {
    partner: Partner;
    items: PurchaseItem[];
};

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<PurchaseWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    async function loadPurchases() {
        const data = await getPurchases();
        setPurchases(data);
        setLoading(false);
    }

    useEffect(() => {
        let mounted = true;
        async function init() {
            const data = await getPurchases();
            if (mounted) {
                setPurchases(data);
                setLoading(false);
            }
        }
        init();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900">
            <header className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors">🏠</Link>
                    <div className="h-6 w-[1px] bg-indigo-700/50" />
                    <h1 className="text-lg font-bold tracking-tight">Achats & Fournisseurs</h1>
                </div>
            </header>

            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-[52px] z-40">
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-red-500 text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
                >
                    ➕ NOUVEL ACHAT
                </button>
            </div>

            <main className="p-8">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                    </div>
                ) : purchases.length > 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-700">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Référence</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Fournisseur</th>
                                    <th className="px-8 py-5">Articles</th>
                                    <th className="px-8 py-5 text-right">Total TTC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((p) => (
                                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-4 font-black text-red-600">{p.number}</td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-500">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                                        <td className="px-8 py-4 font-bold text-slate-800">{p.partner.name}</td>
                                        <td className="px-8 py-4 text-sm text-slate-400 font-medium">
                                            {p.items.length} articles
                                        </td>
                                        <td className="px-8 py-4 text-right font-black text-slate-900">
                                            {new Intl.NumberFormat('fr-FR').format(Number(p.totalAmount))} F
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-24 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 text-slate-400">🛒</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Historique d&apos;achats vide</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Enregistrez vos achats pour réapprovisionner votre stock Mbodja.</p>
                        <button onClick={() => setShowAddForm(true)} className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 transition-all">
                            NOUVEL ACHAT
                        </button>
                    </div>
                )}
            </main>

            {showAddForm && (
                <AddPurchaseForm
                    onClose={() => {
                        setShowAddForm(false);
                        loadPurchases();
                    }}
                />
            )}
        </div>
    );
}
