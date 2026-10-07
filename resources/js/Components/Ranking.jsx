import { useState } from 'react';
import { Navigation, ShoppingBag, Star, Trophy, Wifi, Armchair, Droplets, Gauge, Sparkles } from 'lucide-react';
import Img from './Img';
import { areas, podium, ranking } from '../data/cafes';

function Rating({ value }) {
    return (
        <span className="inline-flex items-center gap-0.5 font-semibold text-stone-900">
            {value} <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
        </span>
    );
}

function SideCard({ cafe }) {
    return (
        <article className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60">
            <div className="flex items-center justify-between text-[11px]">
                <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-900">{cafe.badge}</span>
                <span className="font-medium text-emerald-700">● Buka Sekarang</span>
            </div>
            <div className="relative mt-3 overflow-hidden rounded-2xl">
                <Img src={cafe.image} alt={cafe.name} className="h-40 w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full bg-stone-950/80 px-2 py-0.5 text-[11px] text-white">{cafe.distance}</span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-stone-950">{cafe.name}</h3>
            <p className="text-xs leading-5 text-stone-500">{cafe.area} • {cafe.tagline}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-600">
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-stone-500">Rating kopi</p>
                    <p className="mt-1 font-semibold text-stone-950"><Rating value={cafe.rating} /></p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-stone-500">Harga</p>
                    <p className="mt-1 font-semibold text-stone-950">{cafe.price}</p>
                </div>
            </div>
            <div className="mt-3 flex justify-between gap-2 text-xs text-stone-600">
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-stone-500">WiFi</p>
                    <p className="mt-1 font-semibold text-stone-950">{cafe.wifi}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-stone-500">Ambiance</p>
                    <p className="mt-1 font-semibold text-stone-950">91/100</p>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50">
                    <Navigation className="h-3.5 w-3.5" /> Lihat Rute
                </button>
                <button className="flex-1 rounded-xl bg-amber-900 py-2.5 text-xs font-semibold text-white hover:bg-amber-950">Pesan Sekarang</button>
            </div>
        </article>
    );
}

function Champion({ cafe }) {
    return (
        <article className="relative overflow-hidden rounded-4xl border border-amber-200 bg-white p-4 shadow-sm shadow-stone-200/60">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-900 bg-amber-900 px-3 py-1 text-[10px] font-semibold tracking-wide text-white">
                <Trophy className="mr-1 inline h-3 w-3" /> Rank #1 Minggu Ini
            </span>
            <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-900">{cafe.badge}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">● {cafe.seats}</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-3xl">
                <Img src={cafe.image} alt={cafe.name} className="h-52 w-full object-cover" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-stone-950">{cafe.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">{cafe.area}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-amber-900"><Rating value={cafe.rating} /></p>
                    <p className="text-xs text-stone-500">Rating kopi</p>
                </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-600">{cafe.tagline}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-stone-50 p-3 text-center">
                    <Gauge className="mx-auto h-4 w-4 text-amber-900" />
                    <p className="mt-1 text-sm font-semibold text-stone-950">{cafe.wifi}</p>
                    <p className="text-[11px] text-stone-500">WiFi speed</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3 text-center">
                    <Sparkles className="mx-auto h-4 w-4 text-amber-900" />
                    <p className="mt-1 text-sm font-semibold text-stone-950">91/100</p>
                    <p className="text-[11px] text-stone-500">Ambiance</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3 text-center">
                    <Droplets className="mx-auto h-4 w-4 text-amber-900" />
                    <p className="mt-1 text-sm font-semibold text-stone-950">{cafe.price}</p>
                    <p className="text-[11px] text-stone-500">Range harga</p>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-stone-600">
                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">{cafe.distance}</span>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">{cafe.orders}</span>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">{cafe.signature}</span>
            </div>
            <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50">
                    <Navigation className="h-3.5 w-3.5" /> Petunjuk Arah
                </button>
                <button className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-amber-900 py-2.5 text-xs font-semibold text-white hover:bg-amber-950">
                    <ShoppingBag className="h-3.5 w-3.5" /> Pesan Sekarang
                </button>
            </div>
        </article>
    );
}

export default function Ranking() {
    const [area, setArea] = useState(areas[0]);
    const [second, first, third] = podium;

    return (
        <section id="peringkat" className="bg-stone-50 py-14">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Peringkat kurasi komunitas</p>
                        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-stone-950">Top rated spots berdasarkan kopi, WiFi, dan suasana</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Kami menilai rating kopi, kecepatan WiFi, ambience, serta range harga espresso dan kopi susu. Hasilnya lebih berguna untuk orang yang benar-benar mau datang dan duduk.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 rounded-full border border-stone-200 bg-white p-1 text-xs shadow-sm">
                        {areas.map((a) => (
                            <button
                                key={a}
                                onClick={() => setArea(a)}
                                className={`rounded-full px-4 py-2 font-medium transition ${area === a ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
                    <div className="order-2 lg:order-1"><SideCard cafe={second} /></div>
                    <div className="order-1 lg:order-2"><Champion cafe={first} /></div>
                    <div className="order-3"><SideCard cafe={third} /></div>
                </div>

                <div className="mt-10 rounded-4xl border border-stone-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-stone-950">Peringkat #4 – #10 spot yang lagi ramai dibicarakan</h3>
                        <span className="text-[11px] text-stone-500">Diperbarui dari check-in komunitas, rating, dan frekuensi order</span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        {ranking.map((r) => (
                            <div
                                key={r.rank}
                                className={`flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 ${r.full ? 'md:col-span-2' : ''}`}
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-700 ring-1 ring-stone-200">#{r.rank}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-stone-950">{r.name}</p>
                                    <p className="text-[11px] leading-5 text-stone-500">{r.meta}</p>
                                </div>
                                <button className="shrink-0 rounded-xl bg-amber-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-950">Pesan</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
