'use client'

import React, { useState } from 'react'
import { createProduct } from './actions'

export default function AddProductForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const result = await createProduct(formData)
        setLoading(false)
        if (result.success) {
            onClose()
        } else {
            alert(result.error)
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-indigo-900 px-8 py-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-black">Nouveau Produit</h2>
                    <button onClick={onClose} className="text-2xl hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nom du Produit</label>
                        <input name="name" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors font-bold" placeholder="ex: Sac de Riz 50kg" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Référence (SKU)</label>
                            <input name="sku" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors font-bold" placeholder="REF-001" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Quantité Initiale</label>
                            <input name="stockQty" type="number" step="0.01" defaultValue="0" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Prix de Vente</label>
                            <div className="relative">
                                <input name="salePrice" type="number" step="0.01" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors font-bold" />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">F</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Prix d'Achat (Coût)</label>
                            <div className="relative">
                                <input name="costPrice" type="number" step="0.01" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors font-bold" />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">F</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black hover:bg-slate-50 transition-colors">ANNULER</button>
                        <button type="submit" disabled={loading} className="flex-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all">
                            {loading ? 'CRÉATION...' : 'ENREGISTRER LE PRODUIT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
