import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPartners } from '../services/crmService';
import AddPartnerForm from './AddPartnerForm';

export default function CRMPage() {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const loadPartners = React.useCallback(async (isInitial = false) => {
        if (!isInitial) setLoading(true);
        const data = await getPartners();
        setPartners(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadPartners(true);
    }, [loadPartners]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 selection:bg-purple-100">
            <header className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors text-white">🏠</Link>
                    <div className="h-6 w-[1px] bg-indigo-700/50" />
                    <h1 className="text-lg font-bold tracking-tight text-white">CRM & Partenaires</h1>
                </div>
            </header>

            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-[52px] z-40">
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all font-display"
                >
                    ➕ NOUVEAU PARTENAIRE
                </button>
            </div>

            <main className="p-8">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    </div>
                ) : partners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-odoo-in">
                        {partners.map((partner) => (
                            <div key={partner.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-50 transition-all group flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl group-hover:bg-purple-100 transition-colors">
                                            👤
                                        </div>
                                        <div className="flex gap-2">
                                            {partner.isCustomer && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tight">Client</span>}
                                            {partner.isSupplier && <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tight">Fournisseur</span>}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">{partner.name}</h3>
                                    <p className="text-sm text-slate-400 font-medium mb-4">{partner.email || 'Pas d\'email'}</p>
                                    <p className="text-sm font-bold text-slate-600">{partner.phone || 'Pas de numéro'}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-black text-slate-400 group-hover:text-purple-400 transition-colors">
                                    <span>VOIR L&apos;HISTORIQUE</span>
                                    <span>→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-24 text-center max-w-4xl mx-auto animate-odoo-in">
                        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🤝</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Pas encore de partenaires</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Créez vos clients et fournisseurs pour commencer à enregistrer vos opérations financières.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all font-display"
                        >
                            CRÉER MON PREMIER PARTENAIRE
                        </button>
                    </div>
                )}
            </main>

            {showAddForm && (
                <AddPartnerForm
                    onClose={() => {
                        setShowAddForm(false);
                        loadPartners();
                    }}
                />
            )}
        </div>
    );
}
