import { useState } from 'react';
import { X, Coffee, CheckCircle2, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';

export default function BeansModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [grind, setGrind] = useState('v60');
    const [qty, setQty] = useState(1);
    const [success, setSuccess] = useState(false);

    const price = 110500;
    const normalPrice = 130000;
    const total = price * qty;

    const handleBuy = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-6">
                
                {/* Header */}
                <div className="bg-[#FAF8F5] border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full">
                            Biji Sangrai Langka
                        </span>
                        <h3 className="font-bold text-stone-900 text-base mt-1">Flores Bajawa Anaerobic 200g</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!success ? (
                    <div className="p-6 space-y-5">
                        <div className="flex gap-4 items-center">
                            <div className="h-20 w-20 rounded-2xl bg-[#F6EFE6] border border-[#E8DEC8] flex items-center justify-center text-[#56311F] shrink-0">
                                <Coffee className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-stone-600">Roastery: Mika Coffee Lab</p>
                                <p className="text-xs text-stone-500">Tasting Notes: Strawberry, Winey, Cacao nibs</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-base font-extrabold text-[#56311F]">
                                        Rp {price.toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-xs line-through text-stone-400">
                                        Rp {normalPrice.toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                        Hemat 15%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pilihan Gilingan */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                                Profil Gilingan (Grind Size)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'whole', label: 'Biji Utuh', sub: 'Roast Date: H-3' },
                                    { id: 'v60', label: 'Medium-Fine', sub: 'V60 / Filter' },
                                    { id: 'french', label: 'Coarse', sub: 'Cold Brew / Press' },
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setGrind(item.id)}
                                        className={`p-2.5 rounded-xl border text-center transition ${
                                            grind === item.id
                                                ? 'border-[#56311F] bg-amber-50 text-[#56311F] font-bold'
                                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                        }`}
                                    >
                                        <div className="text-xs">{item.label}</div>
                                        <div className="text-[10px] text-stone-400 mt-0.5">{item.sub}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Jumlah */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                            <div>
                                <span className="text-xs text-stone-500 block">Total Pembelian</span>
                                <span className="text-base font-extrabold text-[#56311F]">
                                    Rp {total.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleBuy}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#56311F] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#432516] transition"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Beli Langsung via QRIS
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center space-y-3">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h4 className="text-base font-bold text-stone-900">Pembelian Beans Berhasil!</h4>
                        <p className="text-xs text-stone-600">
                            Paket biji kopi Flores Bajawa Anaerobic sedang disiapkan untuk diambil di kasir / dikirim.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

