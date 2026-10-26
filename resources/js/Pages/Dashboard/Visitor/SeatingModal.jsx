import { X, Armchair, Wifi, Zap, CheckCircle2, MapPin } from 'lucide-react';

export default function SeatingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const spots = [
        { name: 'Ergonomic Pod #1', status: 'Kosong', plug: 'Ada (2 Slot)', wifi: '150 Mbps', type: 'Quiet' },
        { name: 'Ergonomic Pod #2', status: 'Kosong', plug: 'Ada (2 Slot)', wifi: '150 Mbps', type: 'Quiet' },
        { name: 'Private Booth #A', status: 'Terisi', plug: 'Ada', wifi: '150 Mbps', type: 'Focus' },
        { name: 'Communal Table #3', status: 'Sisa 3 Kursi', plug: 'Ada (4 Slot)', wifi: '150 Mbps', type: 'Work' },
        { name: 'Standing Desk #1', status: 'Kosong', plug: 'Ada', wifi: '150 Mbps', type: 'Quick WFC' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-6">
                
                <div className="bg-[#FAF8F5] border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Status Ketersediaan Kursi Real-Time
                        </div>
                        <h3 className="font-bold text-stone-900 text-base mt-0.5">Work Coffee Menteng</h3>
                        <p className="text-xs text-stone-500">850m dari lokasimu • Tingkat keramaian: Tenang</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="rounded-2xl border border-stone-200 bg-amber-50/40 p-3.5 text-xs text-stone-700 flex items-center justify-between">
                        <div>
                            <span className="font-bold text-[#56311F] block">Benefit Member QRIS CafeFinder</span>
                            <span className="text-[11px] text-stone-500">Free 1 Jam Private Meeting Pod setiap pembelian Manual Brew</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#56311F] text-white text-[10px] font-bold">
                            Klaim di Tempat
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        {spots.map((spot, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 transition"
                            >
                                <div className="space-y-0.5">
                                    <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                                        <Armchair className="h-3.5 w-3.5 text-stone-500" />
                                        {spot.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-stone-500">
                                        <span className="flex items-center gap-1">
                                            <Zap className="h-3 w-3 text-amber-600" />
                                            {spot.plug}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Wifi className="h-3 w-3 text-blue-600" />
                                            {spot.wifi}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                    spot.status === 'Kosong'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : spot.status === 'Terisi'
                                        ? 'bg-stone-100 text-stone-500'
                                        : 'bg-amber-100 text-amber-800'
                                }`}>
                                    {spot.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

