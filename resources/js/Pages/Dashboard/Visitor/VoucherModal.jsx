import { X, Gift, Sparkles, CheckCircle2, Ticket, QrCode } from 'lucide-react';

export default function VoucherModal({ isOpen, onClose, stampsCount = 7 }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-6">
                
                {/* Header Banner */}
                <div className="bg-linear-to-r from-[#56311F] to-[#7A452B] p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-full p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
                        <Gift className="h-3.5 w-3.5" />
                        Reward Paspor Kopi Digital
                    </div>
                    <h3 className="text-xl font-extrabold">1 Cup Manual Brew Gratis</h3>
                    <p className="text-xs text-amber-100/90 mt-1">
                        Pilihan single-origin bean favorit di 24+ mitra roastery CafeFinder.
                    </p>
                </div>

                <div className="p-6 space-y-5">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-stone-700">Progres Cap Paspor:</span>
                            <span className="text-[#56311F]">{stampsCount} / 8 Stamp Terkumpul</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden p-0.5 border border-stone-200">
                            <div 
                                className="bg-linear-to-r from-amber-600 to-[#56311F] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${(stampsCount / 8) * 100}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-stone-500">
                            {stampsCount >= 8 
                                ? 'Selamat! Anda sudah berhak mengklaim reward seduhan kopi gratis ini.'
                                : `Tinggal ${8 - stampsCount} kunjungan atau pesanan lagi untuk membuka voucher reward Anda!`}
                        </p>
                    </div>

                    {/* Voucher Ticket Visual */}
                    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-4 relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                                    VOUCHER SPESIAL
                                </span>
                                <h4 className="text-sm font-bold text-stone-900 mt-0.5">FREE-POUR-OVER-2026</h4>
                                <p className="text-xs text-stone-600 mt-1">
                                    Berlaku hingga 31 Desember 2026
                                </p>
                            </div>
                            <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-xs">
                                <QrCode className="h-9 w-9 text-stone-900" />
                            </div>
                        </div>
                    </div>

                    {/* Syarat & Ketentuan */}
                    <div className="text-xs text-stone-500 space-y-1">
                        <div className="font-semibold text-stone-800">Syarat & Ketentuan:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            <li>Berlaku untuk semua metode V60, Kalita Wave, atau Aeropress.</li>
                            <li>Tunjukkan barcode kepada kasir sebelum menyelesaikan pesanan.</li>
                            <li>Dapat digabungkan dengan benefit loyalty tier lainnya.</li>
                        </ul>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition"
                    >
                        Tutup & Simpan ke Wallet
                    </button>
                </div>
            </div>
        </div>
    );
}

