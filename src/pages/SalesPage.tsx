import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSales } from '../services/salesService';
import AddSaleForm from './AddSaleForm';

export default function SalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const loadSales = React.useCallback(async (isInitial = false) => {
        if (!isInitial) setLoading(true);
        try {
            const data = await getSales();
            setSales(data);
        } catch (err) {
            console.error('Error loading sales:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSales(true);
    }, [loadSales]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 selection:bg-indigo-100">
            <header className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors text-white">🏠</Link>
                    <div className="h-6 w-[1px] bg-indigo-700/50" />
                    <h1 className="text-lg font-bold tracking-tight text-white">Ventes & Commandes</h1>
                </div>
            </header>

            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-[52px] z-40">
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all font-display"
                >
                    ➕ NOUVELLE VENTE
                </button>
            </div>

            <main className="p-8">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : sales.length > 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-odoo-in">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Numéro</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Client</th>
                                    <th className="px-8 py-5">Articles</th>
                                    <th className="px-8 py-5 text-right">Total TTC</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale) => (
                                    <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-4 font-black text-indigo-600">{sale.number}</td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-500">{new Date(sale.date).toLocaleDateString('fr-FR')}</td>
                                        <td className="px-8 py-4 font-bold text-slate-800">{sale.partner?.name || '---'}</td>
                                        <td className="px-8 py-4 text-sm text-slate-400 font-medium">
                                            {sale.items?.length || 0} {sale.items?.length > 1 ? 'articles' : 'article'}
                                        </td>
                                        <td className="px-8 py-4 text-right font-black text-slate-900">
                                            {new Intl.NumberFormat('fr-FR').format(Number(sale.totalAmount))} F
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase">Validé</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-24 text-center max-w-4xl mx-auto animate-odoo-in">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🛍️</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Historique de ventes vide</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Commencez à enregistrer vos premières transactions clients ici.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all font-display"
                        >
                            ENREGISTRER UNE VENTE
                        </button>
                    </div>
                )}
            </main>

            {showAddForm && (
                <AddSaleForm
                    onClose={() => {
                        setShowAddForm(false);
                        loadSales();
                    }}
                />
            )}
        </div>
    );
}
