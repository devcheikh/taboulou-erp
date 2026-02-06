import { useState, useEffect } from 'react'
import { createPurchase } from '../services/purchasesService'
import { getProducts } from '../services/inventoryService'
import { getPartners } from '../services/crmService'

export default function AddPurchaseForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [partners, setPartners] = useState<any[]>([])
    const [selectedPartner, setSelectedPartner] = useState('')
    const [lineItems, setLineItems] = useState<{ productId: string, qty: number, price: number }[]>([
        { productId: '', qty: 1, price: 0 }
    ])

    useEffect(() => {
        async function init() {
            const prodData = await getProducts()
            const partData = await getPartners()
            setProducts(prodData)
            setPartners(partData.filter((p: any) => p.isSupplier))
        }
        init()
    }, [])

    function addLine() {
        setLineItems([...lineItems, { productId: '', qty: 1, price: 0 }])
    }

    function updateLine(index: number, field: string, value: string | number) {
        const newList = [...lineItems]
        newList[index] = { ...newList[index], [field]: value } as any
        if (field === 'productId') {
            const prod = products.find(p => p.id === value)
            if (prod) newList[index].price = Number(prod.costPrice)
        }
        setLineItems(newList)
    }

    function removeLine(index: number) {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter((_, i) => i !== index))
        }
    }

    const total = lineItems.reduce((sum, item) => sum + (item.qty * item.price), 0)

    async function handleSubmit() {
        if (!selectedPartner) return alert('Veuillez sélectionner un fournisseur')
        if (lineItems.some(i => !i.productId || i.qty <= 0)) return alert('Veuillez remplir correctement tous les articles')

        setLoading(true)
        const result = await createPurchase(selectedPartner, lineItems)
        setLoading(true) // Keep loading until closed
        if (result.success) {
            onClose()
        } else {
            alert(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-odoo-in">
                <div className="bg-red-900 px-8 py-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-black text-white">Nouvel Achat (Entrée Stock)</h2>
                    <button onClick={onClose} className="text-2xl hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors text-white">×</button>
                </div>

                <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Fournisseur</label>
                        <select value={selectedPartner} onChange={(e) => setSelectedPartner(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-red-500 font-bold outline-none transition-colors">
                            <option value="">Sélectionner un fournisseur...</option>
                            {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                            <div className="col-span-6">Article</div>
                            <div className="col-span-2 text-center">Qté</div>
                            <div className="col-span-3 text-right">Prix d&apos;Achat</div>
                            <div className="col-span-1"></div>
                        </div>

                        {lineItems.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-4 bg-slate-50 p-4 rounded-2xl items-center animate-odoo-in">
                                <div className="col-span-6">
                                    <select value={item.productId} onChange={(e) => updateLine(idx, 'productId', e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 font-bold text-sm outline-none focus:border-red-500">
                                        <option value="">Choisir un article...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name} (Actuel: {p.stockQty})</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <input type="number" value={item.qty} onChange={(e) => updateLine(idx, 'qty', Number(e.target.value))} className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 text-center font-bold text-sm outline-none focus:border-red-500" />
                                </div>
                                <div className="col-span-3">
                                    <div className="relative">
                                        <input type="number" value={item.price} onChange={(e) => updateLine(idx, 'price', Number(e.target.value))} className="w-full bg-white border-2 border-slate-100 rounded-xl pl-8 pr-3 py-2 text-right font-bold text-sm outline-none focus:border-red-500" />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">F</span>
                                    </div>
                                </div>
                                <div className="col-span-1 text-right">
                                    <button onClick={() => removeLine(idx)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                                </div>
                            </div>
                        ))}
                        <button onClick={addLine} className="w-full border-2 border-dashed border-slate-200 text-slate-400 py-3 rounded-2xl font-bold text-sm hover:border-red-300 hover:text-red-400 transition-all uppercase tracking-widest">+ Ajouter une ligne</button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 rounded-[2rem] p-8 text-white">
                        <div>
                            <p className="text-red-300 text-xs font-black uppercase tracking-widest mb-1">Total Achat</p>
                            <h3 className="text-3xl font-black text-white">{new Intl.NumberFormat('fr-FR').format(total)} F</h3>
                        </div>
                        <button onClick={handleSubmit} disabled={loading} className="bg-red-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-red-600 disabled:opacity-50 transition-all uppercase tracking-widest text-[10px]">
                            {loading ? 'CHARGEMENT...' : "VALIDER L'ACHAT"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
