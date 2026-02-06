'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts } from './actions';
import AddProductForm from './AddProductForm';
import { Product } from '@prisma/client';

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    async function loadProducts() {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    }

    useEffect(() => {
        let mounted = true;
        async function init() {
            const data = await getProducts();
            if (mounted) {
                setProducts(data);
                setLoading(false);
            }
        }
        init();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 selection:bg-indigo-100">
            {/* MODULE HEADER */}
            <header className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors">
                        🏠
                    </Link>
                    <div className="h-6 w-[1px] bg-indigo-700/50" />
                    <h1 className="text-lg font-bold tracking-tight">Inventaire</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Mbodja Shop
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-xs font-black shadow-inner">
                        M
                    </div>
                </div>
            </header>

            {/* TOOLBAR */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-md-center gap-4 sticky top-[52px] z-40">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        <span>➕</span> NOUVEAU PRODUIT
                    </button>
                    <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <span>📤</span> IMPORTER
                    </button>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <div className="px-4 py-1.5 rounded-lg bg-white shadow-sm text-xs font-bold text-slate-800 cursor-pointer">LISTE</div>
                    <div className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">KANBAN</div>
                    <div className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">STOCK</div>
                </div>
            </div>

            <main className="p-8">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-700">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Produit</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Référence</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">En Stock</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Prix de Vente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4 font-bold text-slate-800">{product.name}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-400">{product.sku || '---'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-black ${product.stockQty <= 0 ? 'text-orange-500' : 'text-emerald-600'}`}>
                                                {product.stockQty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-slate-800">
                                            {new Intl.NumberFormat('fr-FR').format(Number(product.salePrice))} <small className="text-[10px] text-slate-400">FCFA</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-24 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 text-slate-400">
                            📦
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Aucun produit trouvé</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Commencez à gérer votre inventaire en ajoutant votre premier article de stock.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                            >
                                AJOUTER MON PREMIER PRODUIT
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {showAddForm && (
                <AddProductForm
                    onClose={() => {
                        setShowAddForm(false);
                        loadProducts();
                    }}
                />
            )}
        </div>
    );
}
