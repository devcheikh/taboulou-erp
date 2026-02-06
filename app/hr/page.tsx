'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEmployees } from './actions';
import AddEmployeeForm from './AddEmployeeForm';
import { Employee } from '@prisma/client';

export default function HRPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    async function loadEmployees() {
        // No need to setLoading(true) here if it's already true on mount
        // Only call it if it was false (e.g. after an add)
        const data = await getEmployees();
        setEmployees(data);
        setLoading(false);
    }

    useEffect(() => {
        let mounted = true;
        async function init() {
            const data = await getEmployees();
            if (mounted) {
                setEmployees(data);
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
                    <h1 className="text-lg font-bold tracking-tight">Ressources Humaines</h1>
                </div>
            </header>

            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-[52px] z-40">
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all"
                    >
                        ➕ NOUVEL EMPLOYÉ
                    </button>
                    <button className="bg-white border border-slate-300 text-slate-600 px-6 py-2.5 rounded-xl font-black text-sm">LISTE DES PAIES</button>
                </div>
            </div>

            <main className="p-8">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                    </div>
                ) : employees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                        {employees.map((emp) => (
                            <div key={emp.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-orange-50 transition-all group overflow-hidden relative">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-3xl bg-orange-100 flex items-center justify-center text-2xl font-black text-orange-600">
                                        {emp.firstName[0]}{emp.lastName[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">{emp.firstName} {emp.lastName}</h3>
                                        <p className="text-sm font-bold text-orange-600 uppercase tracking-tighter">{emp.jobTitle}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="w-5">📧</span> {emp.email || 'Pas d\'email'}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-slate-400 uppercase">Salaire Base</span>
                                        <span className="font-black text-slate-900">{new Intl.NumberFormat('fr-FR').format(Number(emp.baseSalary))} F</span>
                                    </div>
                                </div>

                                {/* DECORATIVE ELEMENT */}
                                <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 grayscale group-hover:grayscale-0 transition-all duration-500">👥</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-24 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 text-orange-400">👥</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Gestion de l&apos;équipe</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Ajoutez vos employés pour gérer leurs fiches de paie et leurs présences.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all"
                        >
                            CRÉER MA PREMIÈRE FICHE
                        </button>
                    </div>
                )}
            </main>

            {showAddForm && (
                <AddEmployeeForm
                    onClose={() => {
                        setShowAddForm(false);
                        loadEmployees();
                    }}
                />
            )}
        </div>
    );
}
