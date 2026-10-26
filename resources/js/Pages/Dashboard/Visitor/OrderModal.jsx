import { useState } from 'react';
import {
    X,
    Coffee,
    QrCode,
    CheckCircle2,
    Plus,
    Minus,
    Zap,
    Users,
    CreditCard,
    Sparkles,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';

export default function OrderModal({ isOpen, onClose, cafe, onOrderComplete }) {
    if (!isOpen) return null;

    const [selectedTable, setSelectedTable] = useState('4');
    const [step, setStep] = useState('select'); // 'select' | 'payment' | 'success'
    const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'points'

    const availableTables = [
        { id: '1', name: 'Meja #1', seats: '2 Kursi', tag: 'Dekat Jendela', isAvailable: true },
        { id: '2', name: 'Meja #2', seats: '4 Kursi', tag: 'Colokan WFC', isAvailable: true },
        { id: '3', name: 'Meja #3', seats: '2 Kursi', tag: 'Tenang & Cozy', isAvailable: false },
        { id: '4', name: 'Meja #4', seats: '4 Kursi', tag: 'Area Brew Bar', isAvailable: true },
        { id: '5', name: 'Meja #5', seats: '6 Kursi', tag: 'Sofa Grup', isAvailable: true },
        { id: '6', name: 'Meja #6', seats: '4 Kursi', tag: 'Outdoor Asri', isAvailable: true },
    ];

    const defaultMenuItems = [
        {
            id: 'v60-gayo',
            name: 'V60 Pour Over — Aceh Gayo Natural',
            category: 'Manual Brew',
            price: 45000,
            description: 'Tasting: Citrus, Dark Plum, Brown Sugar. Body medium, aftertaste manis.',
            tags: ['Single Origin', 'Light Roast'],
            temp: 'Hot',
            qty: 1,
        },
        {
            id: 'v60-flores',
            name: 'V60 Pour Over — Flores Bajawa Anaerobic',
            category: 'Manual Brew',
            price: 48000,
            description: 'Notes: Strawberry, Winey, Cacao nibs. Rasa buah kompleks dan bersih.',
            tags: ['Rare Beans', 'Medium-Light'],
            temp: 'Hot',
            qty: 0,
        },
        {
            id: 'piccolo',
            name: 'Piccolo Latte — Brazil Cerrado Blend',
            category: 'Espresso & Milk',
            price: 38000,
            description: 'Rasio ristretto ganda dan susu velvety silky. Kuat dan seimbang.',
            tags: ['Best Seller', 'Velvety'],
            temp: 'Hot',
            qty: 0,
        },
        {
            id: 'iced-drip',
            name: 'Japanese Iced Drip — Ethiopia Yirgacheffe',
            category: 'Cold Coffee',
            price: 48000,
            description: 'Seduhan manual dingin dengan batu es murni. Floral jasmine & peach.',
            tags: ['Floral', 'Refreshing'],
            temp: 'Ice',
            qty: 0,
        },
        {
            id: 'pastry-croissant',
            name: 'Artisanal Butter Croissant',
            category: 'Pastry',
            price: 28000,
            description: 'Flaky pastry mentega Prancis, dipanggang segar setiap pagi.',
            tags: ['Freshly Baked'],
            temp: 'Warm',
            qty: 0,
        },
    ];

    const [items, setItems] = useState(defaultMenuItems);

    const updateQty = (id, delta) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const selectedItems = items.filter(i => i.qty > 0);
    const subtotal = selectedItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    const discount = paymentMethod === 'qris' ? Math.round(subtotal * 0.15) : 0;
    const tax = Math.round((subtotal - discount) * 0.1);
    const total = subtotal - discount + tax;

    const handleConfirmOrder = () => {
        const orderData = {
            cafeName: cafe?.name || 'Tanamera Artisanal Roastery',
            location: cafe?.area || 'Menteng, Jakarta Pusat',
            tableNumber: selectedTable,
            ticketCode: `#TMH-${Math.floor(1000 + Math.random() * 9000)}`,
            primaryItem: selectedItems[0]?.name || 'V60 Pour Over — Aceh Gayo Natural Process',
            itemCategory: selectedItems[0]?.category || 'Single Origin Manual Brew',
            temp: selectedItems[0]?.temp || 'Hot • 250ml',
            tastingNotes: selectedItems[0]?.description || 'Tasting: Citrus, Dark Plum, Brown Sugar | Barista: Reza M.',
            barista: 'Reza M.',
            items: selectedItems,
            subtotal,
            discount,
            tax,
            total,
            paymentMethod: paymentMethod === 'qris' ? 'QRIS CafeFinder' : 'CafePoints Saldo',
            orderTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            estimatedMinutes: 4,
            progress: 35,
        };

        setStep('success');
        setTimeout(() => {
            onOrderComplete(orderData);
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-6 transition-all">
                
                {/* Header */}
                <div className="border-b border-stone-200 bg-[#FAF8F5] px-6 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                Pesan Meja & Menu Langsung
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                            {cafe?.name || 'Tanamera Artisanal Roastery'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {step === 'select' && (
                    <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                        
                        {/* 1. Pilih Meja */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                                    <Users className="h-4 w-4 text-amber-900" />
                                    1. Pilih Nomor Meja di Lokasi
                                </label>
                                <span className="text-xs text-stone-500">Tersedia 5 meja</span>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                {availableTables.map(table => (
                                    <button
                                        key={table.id}
                                        type="button"
                                        disabled={!table.isAvailable}
                                        onClick={() => setSelectedTable(table.id)}
                                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                                            selectedTable === table.id
                                                ? 'border-[#56311F] bg-[#56311F] text-white shadow-sm ring-2 ring-[#56311F]/20'
                                                : table.isAvailable
                                                ? 'border-stone-200 bg-white hover:border-amber-700/50 hover:bg-stone-50 text-stone-800'
                                                : 'border-stone-100 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                                        }`}
                                    >
                                        <span className="text-sm font-bold">{table.name}</span>
                                        <span className={`text-[10px] mt-0.5 ${selectedTable === table.id ? 'text-amber-100' : 'text-stone-500'}`}>
                                            {table.seats}
                                        </span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full mt-1.5 font-medium ${
                                            selectedTable === table.id 
                                                ? 'bg-white/20 text-white' 
                                                : 'bg-stone-100 text-stone-600'
                                        }`}>
                                            {table.tag}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Pilih Menu Kopi & Kudapan */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                                    <Coffee className="h-4 w-4 text-amber-900" />
                                    2. Pilih Seduhan & Menu Pilihan
                                </label>
                                <span className="text-xs font-medium text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full">
                                    Diskon 15% QRIS Member
                                </span>
                            </div>

                            <div className="space-y-3">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className={`rounded-2xl border p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                            item.qty > 0 
                                                ? 'border-amber-300 bg-amber-50/30' 
                                                : 'border-stone-200 bg-white hover:border-stone-300'
                                        }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-sm text-stone-900">{item.name}</h4>
                                                <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                                                    {item.temp}
                                                </span>
                                            </div>
                                            <p className="text-xs text-stone-500 max-w-md">{item.description}</p>
                                            <div className="flex items-center gap-2 pt-0.5">
                                                <span className="text-xs font-bold text-amber-950">
                                                    Rp {item.price.toLocaleString('id-ID')}
                                                </span>
                                                {item.tags.map(t => (
                                                    <span key={t} className="text-[10px] text-amber-800 bg-amber-100/60 px-1.5 py-0.2 rounded font-medium">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                                            {item.qty === 0 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 hover:border-amber-800 transition"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Tambah
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-white border border-amber-300 rounded-xl px-2 py-1 shadow-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQty(item.id, -1)}
                                                        className="p-1 rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="text-xs font-bold text-stone-900 w-4 text-center">
                                                        {item.qty}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQty(item.id, 1)}
                                                        className="p-1 rounded-md text-amber-900 hover:bg-amber-100 transition"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ringkasan Subtotal */}
                        <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-4 space-y-2">
                            <div className="flex justify-between text-xs text-stone-600">
                                <span>Meja Terpilih</span>
                                <span className="font-bold text-stone-900">Meja #{selectedTable} (Area Brew Bar)</span>
                            </div>
                            <div className="flex justify-between text-xs text-stone-600">
                                <span>Total Item ({selectedItems.reduce((a, b) => a + b.qty, 0)})</span>
                                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-xs text-emerald-700 font-medium">
                                <span>Diskon QRIS Member (15%)</span>
                                <span>-Rp {discount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-xs text-stone-600">
                                <span>PB1 Restoran (10%)</span>
                                <span>Rp {tax.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="border-t border-stone-200/80 pt-2 flex justify-between items-center">
                                <span className="text-sm font-bold text-stone-900">Total Pembayaran</span>
                                <span className="text-base font-extrabold text-[#56311F]">
                                    Rp {total.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'payment' && (
                    <div className="p-6 space-y-6">
                        <button
                            type="button"
                            onClick={() => setStep('select')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Kembali ke Pilih Menu
                        </button>

                        <div>
                            <h3 className="text-base font-bold text-stone-900">Pilih Metode Pembayaran</h3>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Pembayaran lunas langsung mengirim pesanan ke POS barista Tanamera.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('qris')}
                                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                                    paymentMethod === 'qris'
                                        ? 'border-[#56311F] bg-[#FAF8F5] ring-2 ring-[#56311F]/20'
                                        : 'border-stone-200 bg-white hover:border-stone-300'
                                }`}
                            >
                                <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-900 shrink-0">
                                    <QrCode className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="text-sm font-bold text-stone-900">QRIS CafeFinder</h4>
                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                                            Hemat 15%
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 mt-1">
                                        BCA, GoPay, OVO, ShopeePay, Mandiri, Blu, dsb.
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('points')}
                                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                                    paymentMethod === 'points'
                                        ? 'border-[#56311F] bg-[#FAF8F5] ring-2 ring-[#56311F]/20'
                                        : 'border-stone-200 bg-white hover:border-stone-300'
                                }`}
                            >
                                <div className="p-2.5 rounded-xl bg-amber-900 text-white shrink-0">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-stone-900">CafePoints Saldo</h4>
                                    <p className="text-xs text-stone-500 mt-1">
                                        Saldo Anda: <span className="font-bold text-stone-800">Rp 42.500</span>
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Simulasi QRIS Code */}
                        {paymentMethod === 'qris' && (
                            <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 flex flex-col items-center text-center">
                                <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs mb-3">
                                    <svg viewBox="0 0 100 100" className="w-36 h-36">
                                        <rect width="100" height="100" fill="white" />
                                        {/* Corner Markers */}
                                        <rect x="10" y="10" width="22" height="22" fill="#56311F" rx="2" />
                                        <rect x="14" y="14" width="14" height="14" fill="white" rx="1" />
                                        <rect x="17" y="17" width="8" height="8" fill="#56311F" />
                                        
                                        <rect x="68" y="10" width="22" height="22" fill="#56311F" rx="2" />
                                        <rect x="72" y="14" width="14" height="14" fill="white" rx="1" />
                                        <rect x="75" y="17" width="8" height="8" fill="#56311F" />

                                        <rect x="10" y="68" width="22" height="22" fill="#56311F" rx="2" />
                                        <rect x="14" y="72" width="14" height="14" fill="white" rx="1" />
                                        <rect x="17" y="75" width="8" height="8" fill="#56311F" />

                                        {/* Pixel simulation pattern */}
                                        <rect x="38" y="12" width="6" height="6" fill="#56311F" />
                                        <rect x="48" y="12" width="6" height="6" fill="#56311F" />
                                        <rect x="38" y="24" width="16" height="6" fill="#56311F" />
                                        <rect x="12" y="38" width="6" height="6" fill="#56311F" />
                                        <rect x="24" y="42" width="8" height="8" fill="#56311F" />
                                        <rect x="38" y="38" width="24" height="24" fill="#56311F" rx="2" />
                                        <rect x="42" y="42" width="16" height="16" fill="white" />
                                        <rect x="46" y="46" width="8" height="8" fill="#56311F" />
                                        <rect x="68" y="38" width="8" height="8" fill="#56311F" />
                                        <rect x="80" y="46" width="8" height="8" fill="#56311F" />
                                        <rect x="38" y="68" width="8" height="16" fill="#56311F" />
                                        <rect x="52" y="76" width="12" height="8" fill="#56311F" />
                                        <rect x="70" y="68" width="18" height="6" fill="#56311F" />
                                        <rect x="74" y="80" width="14" height="8" fill="#56311F" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold text-stone-900">
                                    NMID: ID1020268840219 - CAFEFINDER
                                </span>
                                <span className="text-[11px] text-stone-500 mt-0.5">
                                    Scan via QRIS di aplikasi perbankan atau dompet digital Anda
                                </span>
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Verifikasi Otomatis Siap
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 text-center space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900">Pesanan Berhasil Dibayar!</h3>
                        <p className="text-sm text-stone-600 max-w-sm mx-auto">
                            Nomor pesanan Anda telah masuk ke monitor barista di Meja #{selectedTable}. Biji kopi sedang mulai digiling.
                        </p>
                    </div>
                )}

                {/* Footer Buttons */}
                {step !== 'success' && (
                    <div className="border-t border-stone-200 bg-white px-6 py-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-stone-500">Total Biaya:</span>
                            <div className="text-lg font-extrabold text-[#56311F]">
                                Rp {total.toLocaleString('id-ID')}
                            </div>
                        </div>

                        {step === 'select' ? (
                            <button
                                type="button"
                                disabled={selectedItems.length === 0}
                                onClick={() => setStep('payment')}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#56311F] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#432516] disabled:opacity-50 transition active:scale-[0.99]"
                            >
                                Lanjut Pembayaran
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleConfirmOrder}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#56311F] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#432516] transition active:scale-[0.99]"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Bayar & Kirim ke Barista
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

