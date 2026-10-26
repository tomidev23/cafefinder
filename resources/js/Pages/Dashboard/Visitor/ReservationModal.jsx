import { useState } from 'react';
import {
    X,
    Calendar,
    Clock,
    Users,
    MapPin,
    CheckCircle2,
    Sparkles,
    ChevronRight,
    Coffee
} from 'lucide-react';

export default function ReservationModal({ isOpen, onClose, cafe, onReservationComplete }) {
    if (!isOpen) return null;

    const [selectedDate, setSelectedDate] = useState('Besok (26 Okt)');
    const [selectedTime, setSelectedTime] = useState('14:00 - 16:00');
    const [guests, setGuests] = useState(2);
    const [area, setArea] = useState('outdoor');
    const [notes, setNotes] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [bookingCode, setBookingCode] = useState('');

    const dateOptions = [
        { label: 'Hari Ini', sub: '25 Okt' },
        { label: 'Besok', sub: '26 Okt' },
        { label: 'Lusa', sub: '27 Okt' },
        { label: 'Senin Depan', sub: '28 Okt' },
    ];

    const timeSlots = [
        { time: '10:00 - 12:00', available: true },
        { time: '12:00 - 14:00', available: true },
        { time: '14:00 - 16:00', available: true },
        { time: '16:00 - 18:00', available: true },
        { time: '19:00 - 21:00', available: true },
    ];

    const areas = [
        { id: 'indoor', title: 'Indoor Non-Smoking', desc: 'AC Sejuk, meja kerja luas & colokan melimpah' },
        { id: 'outdoor', title: 'Secret Courtyard Outdoor', desc: 'Pet-friendly, pepohonan teduh & suasana tropis' },
        { id: 'bar', title: 'Barista Slow Bar', desc: 'Interaksi langsung proses manual brew V60' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = `#RES-${(cafe?.name?.substring(0, 3) || 'CFE').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        setBookingCode(code);
        setIsSubmitted(true);

        const reservation = {
            code,
            cafeName: cafe?.name || 'Giyanti Coffee Roastery',
            location: cafe?.area || 'Jl. Surabaya, Menteng',
            date: selectedDate,
            time: selectedTime,
            guests,
            area: areas.find(a => a.id === area)?.title || 'Secret Courtyard',
            notes,
        };

        setTimeout(() => {
            if (onReservationComplete) {
                onReservationComplete(reservation);
            }
            onClose();
            setIsSubmitted(false);
        }, 2200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-6 transition-all">
                
                {/* Header */}
                <div className="border-b border-stone-200 bg-[#FAF8F5] px-6 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-900" />
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                Reservasi Meja Nanti
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                            {cafe?.name || 'Giyanti Coffee Roastery'}
                        </h2>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-stone-400" />
                            {cafe?.area || 'Jl. Surabaya, Menteng'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                        
                        {/* 1. Pilih Tanggal */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2.5">
                                1. Pilih Tanggal Reservasi
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {dateOptions.map(d => {
                                    const fullStr = `${d.label} (${d.sub})`;
                                    const active = selectedDate === fullStr;
                                    return (
                                        <button
                                            key={d.label}
                                            type="button"
                                            onClick={() => setSelectedDate(fullStr)}
                                            className={`p-3 rounded-2xl border text-center transition ${
                                                active
                                                    ? 'border-[#56311F] bg-[#56311F] text-white shadow-sm'
                                                    : 'border-stone-200 bg-white hover:border-amber-700/50 text-stone-800'
                                            }`}
                                        >
                                            <span className="block text-xs font-bold">{d.label}</span>
                                            <span className={`block text-[11px] mt-0.5 ${active ? 'text-amber-100' : 'text-stone-500'}`}>
                                                {d.sub}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Pilih Jam Slot */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2.5">
                                2. Sesi Jam Kunjungan
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {timeSlots.map(t => (
                                    <button
                                        key={t.time}
                                        type="button"
                                        onClick={() => setSelectedTime(t.time)}
                                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                                            selectedTime === t.time
                                                ? 'border-[#56311F] bg-amber-50 text-[#56311F] ring-1 ring-[#56311F]'
                                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                        }`}
                                    >
                                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                                        {t.time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Jumlah Tamu */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2.5">
                                3. Jumlah Orang / Tamu
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 6, 8].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setGuests(num)}
                                        className={`h-10 w-11 rounded-xl border text-sm font-bold transition flex items-center justify-center ${
                                            guests === num
                                                ? 'border-[#56311F] bg-[#56311F] text-white shadow-xs'
                                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                        }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <span className="text-xs text-stone-500 ml-2">orang</span>
                            </div>
                        </div>

                        {/* 4. Preferensi Area Duduk */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2.5">
                                4. Preferensi Area Tempat Duduk
                            </label>
                            <div className="space-y-2">
                                {areas.map(a => (
                                    <button
                                        key={a.id}
                                        type="button"
                                        onClick={() => setArea(a.id)}
                                        className={`w-full p-3 rounded-2xl border text-left transition flex items-start gap-3 ${
                                            area === a.id
                                                ? 'border-[#56311F] bg-amber-50/50 ring-1 ring-[#56311F]'
                                                : 'border-stone-200 bg-white hover:border-stone-300'
                                        }`}
                                    >
                                        <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${
                                            area === a.id ? 'border-[#56311F] bg-[#56311F]' : 'border-stone-300'
                                        }`}>
                                            {area === a.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-900">{a.title}</h4>
                                            <p className="text-[11px] text-stone-500 mt-0.5">{a.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Catatan Tambahan */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                                Catatan Khusus (Opsional)
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Misal: Membawa laptop untuk WFC, butuh meja dekat colokan..."
                                className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#56311F] focus:ring-0"
                            />
                        </div>

                        {/* Summary Box */}
                        <div className="rounded-2xl border border-amber-200 bg-[#FAF8F5] p-3.5 text-xs text-stone-700 space-y-1">
                            <div className="font-bold text-[#56311F] flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" />
                                Garansi Reservasi Bebas Biaya Pembatalan
                            </div>
                            <p className="text-[11px] text-stone-500">
                                Meja akan ditahan hingga 15 menit dari jam yang dijadwalkan. Reservasi gratis dengan benefit +1 Stamp Paspor Kopi saat check-in.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#56311F] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#432516] transition active:scale-[0.99]"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Konfirmasi Reservasi Meja
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-10 text-center space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900">Reservasi Meja Terkonfirmasi!</h3>
                        <p className="text-xs text-stone-600 max-w-sm mx-auto">
                            Kode Etiket Reservasi Anda: <span className="font-bold text-stone-900 font-mono text-sm">{bookingCode}</span>.
                            Tunjukkan kode ini saat tiba di {cafe?.name || 'Giyanti Coffee Roastery'}.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold">
                            <Calendar className="h-3.5 w-3.5" />
                            {selectedDate} • {selectedTime} ({guests} Tamu)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

