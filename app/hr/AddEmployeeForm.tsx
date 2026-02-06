'use client'

import React, { useState } from 'react'
import { createEmployee } from './actions'

export default function AddEmployeeForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const result = await createEmployee(formData)
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
                <div className="bg-orange-600 px-8 py-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-black">Nouvel Employé</h2>
                    <button onClick={onClose} className="text-2xl hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Prénom</label>
                            <input name="firstName" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-orange-500 font-bold outline-none transition-colors" placeholder="Jean" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nom</label>
                            <input name="lastName" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-orange-500 font-bold outline-none transition-colors" placeholder="Dupont" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Poste / Fonction</label>
                        <input name="jobTitle" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-orange-500 font-bold outline-none transition-colors" placeholder="ex: Responsable de Stock" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email professionnel</label>
                        <input name="email" type="email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-orange-500 font-bold outline-none transition-colors" placeholder="j.dupont@mbodja.sn" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Salaire de Base</label>
                        <div className="relative">
                            <input name="baseSalary" type="number" step="0.01" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3 focus:border-orange-500 font-bold outline-none transition-colors" placeholder="0" />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">F</span>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black hover:bg-slate-50 transition-colors">ANNULER</button>
                        <button type="submit" disabled={loading} className="flex-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-700 disabled:opacity-50 transition-all font-display">
                            {loading ? 'INSCRIPTION...' : 'CRÉER LA FICHE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
