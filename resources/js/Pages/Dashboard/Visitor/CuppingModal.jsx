import { useState } from 'react';
import { X, Award, Calendar, CheckCircle2, Users, Clock } from 'lucide-react';

export default function CuppingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [registered, setRegistered] = useState(false);

    const handleRegister = () => {
        setRegistered(true);
        setTimeout(() => {
            setRegistered(false);
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-6">
                
                <div className="bg-[#FAF8F5] border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full">
                            Cupping Session Eksklusif
                        </span>
                        <h3 className="font-bold text-stone-900 text-base mt-1">Tasting Flight: Panama Geisha vs Java Typica</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!registered ? (
                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5 text-xs text-stone-600">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-amber-900" />
                                <span className="font-bold text-stone-900">Dipandu oleh: Q-Grader Ari Widodo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-stone-500" />
                                <span>Sabtu ini, 14:00 - 16:00 WIB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-amber-700" />
                                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                                    Tersisa 3 Kursi VIP
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-3.5 space-y-2 text-xs">
                            <span className="font-bold text-stone-900 block">Yang Anda Dapatkan:</span>
                            <ul className="list-disc list-inside space-y-1 text-stone-600 text-[11px]">
                                <li>Flight 4 cup seduhan Panama Hacienda La Esmeralda Geisha & Java Typica</li>
                                <li>SCA Flavor Wheel worksheet panduan kalibrasi aroma</li>
                                <li>Free 100g sample roasted beans untuk dibawa pulang</li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                            <div>
                                <span className="text-xs text-stone-400 block">Biaya Registrasi</span>
                                <span className="text-base font-extrabold text-[#56311F]">
                                    Rp 85.000 <span className="text-xs font-normal text-stone-500">/ pax</span>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRegister}
                                className="px-5 py-2.5 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition shadow-sm"
                            >
                                Daftar Sekarang (QRIS)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center space-y-3">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h4 className="text-base font-bold text-stone-900">Registrasi Sesi Berhasil!</h4>
                        <p className="text-xs text-stone-600">
                            Tiket VIP telah dikirimkan ke email & profil CafeFinder Anda. Sampai jumpa Sabtu ini di Slow Bar!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

