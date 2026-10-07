import { useState } from 'react';
import { Search, Crosshair, Wifi, Plug, Armchair, Wallet, Leaf, X, BadgeCheck, Star, QrCode, MapPin, Clock3, Coffee } from 'lucide-react';
import Img from './Img';
import { filters, stats } from '../data/cafes';

const filterIcons = { wifi: Wifi, power: Plug, terrace: Armchair, brew: Coffee, work: MapPin, '24h': Clock3 };

const quickFacts = [
    { label: 'WiFi', value: '180 Mbps' },
    { label: 'Ambiance', value: '91/100' },
    { label: 'Harga espresso', value: 'Rp 25k–40k' },
];

export default function Hero() {
    const [active, setActive] = useState(['wifi', 'work']);
    const toggle = (id) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

    return (
        <section id="eksplorasi" className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-16">
            <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/60 sm:p-8 lg:p-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                        <BadgeCheck className="h-3.5 w-3.5" /> Cafe discovery untuk kopi, kerja, dan nongkrong yang tepat
                    </span>

                    <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                        Cari kafe lokal yang enak, terang, dan benar-benar cocok buat aktivitasmu.
                    </h1>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
                        Temukan spot Batam Center, Jaksel, dan kota lain dengan filter yang masuk akal: WiFi cepat, stopkontak, outdoor area, manual brew, dan jam buka yang pas.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="mt-7 rounded-3xl border border-stone-200 bg-stone-50 p-3 shadow-sm"
                    >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3">
                                <Search className="h-4 w-4 shrink-0 text-stone-500" />
                                <input
                                    placeholder="Cari: Batam Center, kopi susu gula aren, atau spot WFH"
                                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-0"
                                />
                            </div>
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50">
                                <Crosshair className="h-4 w-4" /> Dekat saya
                            </button>
                            <button className="inline-flex items-center justify-center rounded-2xl bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-950">
                                Jelajahi
                            </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {['Colorking / WFH Friendly', 'Ada Stopkontak', 'Outdoor Area', 'Manual Brew', '24 Jam'].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition hover:border-amber-900 hover:text-amber-900"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </form>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {quickFacts.map((item) => (
                            <div key={item.label} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">{item.label}</p>
                                <p className="mt-2 text-lg font-semibold text-stone-950">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-stone-200 pt-6">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <dd className="text-2xl font-semibold tracking-tight text-stone-950">{s.value}</dd>
                                <dt className="mt-1 text-xs text-stone-500">{s.label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="relative overflow-hidden rounded-4xl border border-stone-200 bg-stone-950 p-4 text-white shadow-lg shadow-stone-900/10">
                        <Img src="/images/hero.jpg" alt="Barista menyeduh espresso" className="h-90 w-full rounded-3xl object-cover opacity-90" />
                        <div className="absolute left-6 top-6 rounded-2xl border border-white/20 bg-stone-950/85 px-4 py-3 backdrop-blur">
                            <p className="flex items-center gap-1 text-sm font-semibold text-white">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9 rating kopi
                            </p>
                            <p className="mt-1 text-xs text-stone-300">Batam Center • 180 Mbps WiFi • ambiance 91/100</p>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-300">Rating kopi</p>
                                <p className="mt-1 text-xl font-semibold text-white">4.9/5</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-300">WiFi</p>
                                <p className="mt-1 text-xl font-semibold text-white">180 Mbps</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-300">Harga espresso</p>
                                <p className="mt-1 text-xl font-semibold text-white">Rp 28k</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Spot terdekat</p>
                        <div className="mt-4 space-y-3">
                            {[
                                { name: 'Common Grounds Batam', meta: '500m dari lokasi mu • 4 menit jalan kaki • Rp 30k–65k' },
                                { name: 'Tanamera Coffee Roastery', meta: '850m dari lokasi mu • Manual brew V60 • Rp 25k–55k' },
                                { name: 'Socius Coffee', meta: '1.6km dari lokasi mu • Outdoor area • Rp 26k–48k' },
                            ].map((spot) => (
                                <div key={spot.name} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                    <p className="font-semibold text-stone-950">{spot.name}</p>
                                    <p className="mt-1 text-sm text-stone-600">{spot.meta}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <span className="rounded-full border border-stone-200 bg-white px-3 py-2">World class espresso</span>
                <span className="rounded-full border border-stone-200 bg-white px-3 py-2">Batam Center</span>
                <span className="rounded-full border border-stone-200 bg-white px-3 py-2">Jaksel</span>
                <span className="rounded-full border border-stone-200 bg-white px-3 py-2">Bandung Dago</span>
            </div>
        </section>
    );
}
