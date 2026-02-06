import React, { useState } from 'react'
import { createPartner } from '../services/crmService'

export default function AddPartnerForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const partnerData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            isCustomer: formData.get('isCustomer') === 'on',
            isSupplier: formData.get('isSupplier') === 'on',
        }
        const result = await createPartner(partnerData)
        setLoading(false)
        if (result.success) {
            onClose()
        } else {
            alert(result.error)
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-odoo-in">
                <div className="bg-purple-900 px-8 py-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-black text-white">Nouveau Partenaire</h2>
                    <button onClick={onClose} className="text-2xl hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors text-white">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 text-slate-900">
                    <div className="space-y-2 text-slate-900">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nom Complet / Raison Sociale</label>
                        <input name="name" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-bold" placeholder="ex: Jean Dupont ou SARL Mbodja" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                            <input name="email" type="email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-bold" placeholder="email@exemple.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Téléphone</label>
                            <input name="phone" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-bold" placeholder="+221 ..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Adresse</label>
                        <input name="address" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-bold" placeholder="Dakar, Plateau..." />
                    </div>

                    <div className="flex gap-8 p-4 bg-slate-50 rounded-2xl">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="isCustomer" defaultChecked className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-purple-500" />
                            <span className="text-sm font-black text-slate-600 group-hover:text-purple-600 transition-colors uppercase tracking-tight">Client</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="isSupplier" className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-purple-500" />
                            <span className="text-sm font-black text-slate-600 group-hover:text-purple-600 transition-colors uppercase tracking-tight">Fournisseur</span>
                        </label>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black hover:bg-slate-50 transition-colors uppercase tracking-widest text-[10px]">ANNULER</button>
                        <button type="submit" disabled={loading} className="flex-2 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-purple-100 hover:bg-purple-700 disabled:opacity-50 transition-all uppercase tracking-widest text-[10px]">
                            {loading ? 'ENREGISTREMENT...' : 'SAUVEGARDER'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
