import { useState } from 'react';
import { Navigation, ShoppingBag, Star, Trophy, Wifi, Armchair } from 'lucide-react';
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
        <article className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-stone-100 lg:mt-24">
            <div className="flex items-center justify-between text-[11px]">
                <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">{cafe.badge}</span>
                <span className="font-medium text-emerald-700">● Buka Sekarang</span>
            </div>
            <div className="relative mt-3">
                <Img src={cafe.image} alt={cafe.name} className="h-40 w-full rounded-xl" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">{cafe.distance}</span>
            </div>
            <h3 className="mt-3 font-bold text-stone-900">{cafe.name}</h3>
            <p className="text-xs text-stone-500">{cafe.area} • {cafe.tagline}</p>
            <div className="mt-3 flex justify-between text-xs text-stone-600">
                <div>
                    <Rating value={cafe.rating} />
                    <p>{cafe.orders}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-stone-900">{cafe.price}</p>
                    <p>{cafe.signature}</p>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-stone-100 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200">
                    <Navigation className="h-3.5 w-3.5" /> Lihat Rute
                </button>
                <button className="flex-1 rounded-lg bg-amber-800 py-2 text-xs font-semibold text-white hover:bg-amber-900">Pesan Sekarang</button>
            </div>
        </article>
    );
}

function Champion({ cafe }) {
    return (
        <article className="relative rounded-2xl border-2 border-amber-700 bg-white p-4 shadow-xl">
            <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-800 px-3 py-1 text-[10px] font-bold tracking-wide text-white">
                <Trophy className="h-3 w-3" /> JUARA MINGGUAN • RANK #1
            </span>
            <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900">★ {cafe.badge}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">● {cafe.seats}</span>
            </div>
            <div className="relative mt-3">
                <Img src={cafe.image} alt={cafe.name} className="h-48 w-full rounded-xl" />
                <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
                    <ShoppingBag className="h-3 w-3" /> {cafe.orders}
                </span>
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">{cafe.distance}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-stone-900">{cafe.name}</h3>
                <span className="font-bold text-amber-800">{cafe.rating} <span className="text-xs font-normal text-stone-400">/ 5</span></span>
            </div>
            <p className="text-xs text-stone-500">{cafe.area}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-stone-50 p-3 text-center">
                <div><p className="font-bold text-stone-900">{cafe.rating} ★</p><p className="text-[10px] text-stone-500">Skor Rating</p></div>
                <div><p className="font-bold text-stone-900">{cafe.price}</p><p className="text-[10px] text-stone-500">Rata-rata Tagihan</p></div>
                <div><p className="font-bold text-stone-900">{cafe.wifi}</p><p className="text-[10px] text-stone-500">Fiber Wi-Fi</p></div>
            </div>
            <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-stone-100 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-200">
                    <Navigation className="h-3.5 w-3.5" /> Petunjuk Arah
                </button>
                <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-800 py-2.5 text-xs font-semibold text-white hover:bg-amber-900">
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
        <section id="peringkat" className="bg-stone-50 py-12">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold tracking-wider text-amber-800">● PERINGKAT KURASI KOMUNITAS</p>
                        <h2 className="mt-1 text-2xl font-bold text-stone-900">Peringkat Kurasi Komunitas: Roastery & Kafe Terbaik Minggu Ini</h2>
                        <p className="text-xs text-stone-500">Penilaian riil pengunjung, konsistensi roasting, dan ketersediaan tempat duduk di Jakarta Selatan.</p>
                    </div>
                    <div className="flex rounded-lg bg-stone-100 p-1 text-xs">
                        {areas.map((a) => (
                            <button
                                key={a}
                                onClick={() => setArea(a)}
                                className={`rounded-md px-3 py-1.5 font-medium transition ${area === a ? 'bg-amber-800 text-white' : 'text-stone-600 hover:text-stone-900'}`}
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

                <div className="mt-10 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-stone-900">Peringkat #4 – #10 Pesaing Teratas</h3>
                        <span className="text-[11px] text-stone-500">Diperbarui setiap 15 menit berdasarkan volume transaksi POS riil</span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        {ranking.map((r) => (
                            <div
                                key={r.rank}
                                className={`flex items-center gap-3 rounded-xl bg-stone-50 p-3 ${r.full ? 'md:col-span-2' : ''}`}
                            >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-700">#{r.rank}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-stone-900">{r.name}</p>
                                    <p className="text-[11px] text-stone-500">{r.meta}</p>
                                </div>
                                <button className="shrink-0 rounded-lg bg-amber-800 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-900">Pesan Sekarang</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
