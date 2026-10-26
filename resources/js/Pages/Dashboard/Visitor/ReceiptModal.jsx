import { X, Receipt, Download, Printer, CheckCircle2, QrCode } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, order }) {
    if (!isOpen) return null;

    const receiptData = order || {
        cafeName: 'Tanamera Artisanal Roastery',
        location: 'Menteng, Jakarta Pusat',
        tableNumber: '4',
        ticketCode: '#TMH-0492',
        customerName: 'Dimas Pratama',
        barista: 'Reza M.',
        time: '25 Okt 2026, 09:42 WIB',
        items: [
            { name: 'V60 Pour Over — Aceh Gayo Natural', qty: 1, price: 45000, note: 'Hot • 250ml • Clean floral profile' },
        ],
        subtotal: 45000,
        discount: 6750,
        tax: 3825,
        total: 42075,
        paymentMethod: 'QRIS CafeFinder',
        authCode: 'AUTH-QRIS-982341-CF',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-6">
                
                {/* Header */}
                <div className="bg-[#FAF8F5] border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-amber-900" />
                        <h3 className="font-bold text-stone-900 text-base">Struk Digital Transaksi</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Struk Content */}
                <div className="p-6 space-y-4 text-xs font-mono">
                    <div className="text-center pb-3 border-b border-dashed border-stone-300">
                        <h4 className="font-bold text-stone-900 text-sm">{receiptData.cafeName}</h4>
                        <p className="text-stone-500 font-sans mt-0.5">{receiptData.location}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-bold text-[10px]">
                            Lunas via {receiptData.paymentMethod}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-stone-600 font-sans">
                        <div>
                            <span className="text-[10px] text-stone-400 uppercase block">No. Etiket</span>
                            <span className="font-bold text-stone-900">{receiptData.ticketCode}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-stone-400 uppercase block">Meja</span>
                            <span className="font-bold text-stone-900">Meja #{receiptData.tableNumber}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-stone-400 uppercase block">Pelanggan</span>
                            <span className="font-semibold text-stone-800">{receiptData.customerName}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-stone-400 uppercase block">Barista Seduh</span>
                            <span className="font-semibold text-stone-800">{receiptData.barista}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-[10px] text-stone-400 uppercase block">Waktu Transaksi</span>
                            <span className="text-stone-600">{receiptData.time}</span>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="border-t border-b border-dashed border-stone-300 py-3 space-y-2">
                        {receiptData.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start font-sans">
                                <div>
                                    <div className="font-semibold text-stone-900">
                                        {item.qty}x {item.name}
                                    </div>
                                    {item.note && (
                                        <div className="text-[11px] text-stone-400">{item.note}</div>
                                    )}
                                </div>
                                <span className="font-semibold text-stone-900">
                                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5 font-sans">
                        <div className="flex justify-between text-stone-500">
                            <span>Subtotal</span>
                            <span>Rp {receiptData.subtotal?.toLocaleString('id-ID')}</span>
                        </div>
                        {receiptData.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-medium">
                                <span>Diskon QRIS Member (15%)</span>
                                <span>-Rp {receiptData.discount?.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-stone-500">
                            <span>PB1 Restoran (10%)</span>
                            <span>Rp {receiptData.tax?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-stone-900 font-extrabold text-sm pt-2 border-t border-stone-200">
                            <span>TOTAL BAYAR</span>
                            <span className="text-[#56311F]">
                                Rp {receiptData.total?.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Verification Footer */}
                    <div className="pt-3 text-center space-y-2 border-t border-dashed border-stone-300 font-sans">
                        <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-bold">
                            <CheckCircle2 className="h-4 w-4" />
                            Transaksi Terverifikasi oleh POS CafeFinder
                        </div>
                        <p className="text-[10px] text-stone-400">
                            Auth Code: {receiptData.authCode}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-[#FAF8F5] border-t border-stone-200 px-6 py-3 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        Cetak Struk
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
}

