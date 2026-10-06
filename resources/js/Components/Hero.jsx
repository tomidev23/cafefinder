import { useState } from 'react';
import { Search, Crosshair, Wifi, Plug, Armchair, Wallet, Leaf, X, BadgeCheck, Star, QrCode } from 'lucide-react';
import Img from './Img';
import { filters, stats } from '../data/cafes';

const filterIcons = { wifi: Wifi, power: Plug, terrace: Armchair, price: Wallet, calm: Leaf };

export default function Hero() {
    const [active, setActive] = useState(['wifi']);
    const toggle = (id) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

    return (
        <section id="eksplorasi" className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-6 lg:py-16">
            <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-amber-900">
                    <BadgeCheck className="h-3.5 w-3.5" /> Platform Pencarian Kafe #1 di Jakarta Selatan
                </span>

                <h1 className="mt-5 text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
                    Temukan, Pesan & Nikmati Tempat Kopi Lokal Terbaik
                </h1>
                <p className="mt-4 max-w-md text-sm text-stone-600">
                    Kurasi specialty roastery, ruang kerja tenang terverifikasi, dan kemudahan pra-pesan QRIS untuk para pencinta espresso sejati.
                </p>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-stone-100"
                >
                    <Search className="ml-2 h-4 w-4 text-amber-800" />
                    <input
                        placeholder="Cari berdasarkan distrik, roastery, atau biji kopi"
                        className="min-w-0 flex-1 border-0 bg-transparent text-sm focus:ring-0"
                    />
                    <button type="button" className="hidden items-center gap-1 rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-700 sm:flex">
                        <Crosshair className="h-3.5 w-3.5" /> Dekat Saya
                    </button>
                    <button className="rounded-lg bg-amber-800 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-900">Jelajahi</button>
                </form>

                <div className="mt-6">
                    <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-stone-500">
                        <span>FILTER CEPAT</span>
                        <button onClick={() => setActive([])} className="text-amber-800 hover:underline">Reset filter</button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {filters.map((f) => {
                            const Icon = filterIcons[f.id];
                            const on = active.includes(f.id);
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => toggle(f.id)}
                                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                                        on ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" /> {f.label} {on && <X className="h-3 w-3" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-stone-200 pt-6">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <dd className="text-xl font-bold text-stone-900">{s.value}</dd>
                            <dt className="text-xs text-stone-500">{s.label}</dt>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="relative">
                <Img src="/images/hero.jpg" alt="Barista menyeduh espresso" className="h-[420px] w-full rounded-3xl shadow-xl" />
                <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-xs shadow">
                    <p className="flex items-center gap-1 font-semibold text-stone-900">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4.9 ★ (1.240 Tegukan Terverifikasi)
                    </p>
                    <p className="text-[11px] font-medium text-emerald-700">● Master Roaster Bertugas</p>
                </div>
                <div className="absolute bottom-4 right-4 w-64 rounded-xl bg-white/95 p-3 text-xs shadow-lg">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <BadgeCheck className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="font-semibold text-stone-900">Pesanan #2041 Siap!</p>
                            <p className="text-stone-500">Oat Flat White • Meja 2</p>
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] font-medium text-amber-800">
                        <span>Siap dalam 3 menit</span>
                        <span className="flex items-center gap-1"><QrCode className="h-3 w-3" /> Lihat Resi QR</span>
                    </div>
                </div>
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-stone-800">
                    <span className="text-emerald-600">●</span> 6 Meja Teras Tersedia
                </span>
            </div>
        </section>
    );
}
