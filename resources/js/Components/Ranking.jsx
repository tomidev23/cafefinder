import { useState, useMemo } from 'react';
import { Navigation, ShoppingBag, Star, Trophy, Gauge, Sparkles, Droplets } from 'lucide-react';
import Img from './Img';
import cafesData from '../data/cafes.json';

// Helper untuk mengekstrak wilayah utama dari alamat/area yang panjang
function getGeneralArea(rawArea) {
    if (!rawArea) return 'Batam';
    const text = rawArea.toLowerCase();
    
    if (text.includes('batam center') || text.includes('greenland') || text.includes('galael') || text.includes('mega legenda')) return 'Batam Center';
    if (text.includes('nagoya') || text.includes('pelita') || text.includes('penuin') || text.includes('jasa')) return 'Nagoya & Penuin';
    if (text.includes('tiban') || text.includes('sekupang')) return 'Tiban & Sekupang';
    if (text.includes('bengkong') || text.includes('pasir putih') || text.includes('golden prawn')) return 'Bengkong & Pasir Putih';
    if (text.includes('batu aji') || text.includes('tembesi') || text.includes('trans barelang')) return 'Batu Aji & Tembesi';
    if (text.includes('batam kota') || text.includes('sungai panas')) return 'Sungai Panas';
    
    return 'Lainnya';
}

function Rating({ value }) {
    return (
        <span className="inline-flex items-center gap-0.5 font-semibold text-stone-900">
            {value} <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
        </span>
    );
}

function SideCard({ cafe }) {
    if (!cafe) return null;
    return (
        <article className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60">
            <div className="flex items-center justify-between text-[11px]">
                <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-900">
                    {cafe.badge || 'Recommended'}
                </span>
                <span className="font-medium text-emerald-700">● Buka Sekarang</span>
            </div>
            
            <div className="relative mt-3 overflow-hidden rounded-2xl">
                <Img src={cafe.image || '/images/default-cafe.jpg'} alt={cafe.name} className="h-40 w-full object-cover" />
                {cafe.distance && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-stone-950/80 px-2.5 py-0.5 text-[11px] text-white backdrop-blur-sm">
                        {cafe.distance}
                    </span>
                )}
            </div>

            <h3 className="mt-3 text-base font-semibold text-stone-950">{cafe.name}</h3>
            <p className="line-clamp-2 text-xs leading-5 text-stone-500">
                {cafe.area || cafe.district || cafe.address || 'Batam'}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-600">
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Rating Kopi</p>
                    <p className="mt-1 font-bold text-stone-950"><Rating value={cafe.rating ?? 4.5} /></p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Harga</p>
                    <p className="mt-1 font-bold text-stone-950">
                        {cafe.price_min ? `Rp ${Math.round(cafe.price_min / 1000)}k+` : cafe.price || 'Rp 20k+'}
                    </p>
                </div>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-stone-600">
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">WiFi Speed</p>
                    <p className="mt-1 font-bold text-stone-950">{cafe.wifi ? `${cafe.wifi} Mbps` : 'Cepat'}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Ambiance</p>
                    <p className="mt-1 font-bold text-stone-950">{cafe.ambiance || '90'}/100</p>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50">
                    <Navigation className="h-3.5 w-3.5" /> Lihat Rute
                </button>
                <button className="flex-1 rounded-xl bg-amber-900 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-950">
                    Pesan Sekarang
                </button>
            </div>
        </article>
    );
}

function Champion({ cafe }) {
    if (!cafe) return null;
    return (
        <article className="relative z-10 flex flex-col justify-between overflow-hidden rounded-4xl border-2 border-amber-400 bg-white p-5 shadow-xl shadow-amber-900/10 ring-4 ring-amber-400/20 lg:-translate-y-4">
            
            {/* Crown / Podium Rank 1 Header */}
            <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
            
            <div>
                {/* Badge Juara 1 */}
                <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-amber-700 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                        <Trophy className="h-3.5 w-3.5 text-amber-200" /> RANK #1
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        ● {cafe.seats || 'Banyak Tempat Sit In'}
                    </span>
                </div>

                {/* Cover Image */}
                <div className="relative overflow-hidden rounded-3xl">
                    <Img src={cafe.image || '/images/default-cafe.jpg'} alt={cafe.name} className="h-56 w-full object-cover transition duration-300 hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-amber-950/80 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                        👑 Top Choice
                    </span>
                </div>

                {/* Detail Cafe */}
                <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-stone-950">{cafe.name}</h3>
                        <p className="mt-0.5 line-clamp-1 text-sm font-medium text-stone-500">
                            {cafe.area || cafe.district || cafe.address || 'Batam'}
                        </p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-xl font-extrabold text-amber-900"><Rating value={cafe.rating ?? 4.9} /></p>
                        <p className="text-[11px] font-medium text-stone-400">Rating Kopi</p>
                    </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-stone-600 line-clamp-2">
                    {cafe.tagline || 'Spot favorit dengan kualitas kopi, WiFi kencang, dan suasana terbaik minggu ini.'}
                </p>

                {/* Stats Grid */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-3 text-center">
                        <Gauge className="mx-auto h-4 w-4 text-amber-800" />
                        <p className="mt-1 text-sm font-bold text-stone-950">{cafe.wifi ? `${cafe.wifi} Mbps` : 'Kencang'}</p>
                        <p className="text-[10px] text-stone-500">WiFi speed</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-3 text-center">
                        <Sparkles className="mx-auto h-4 w-4 text-amber-800" />
                        <p className="mt-1 text-sm font-bold text-stone-950">{cafe.ambiance || '95'}/100</p>
                        <p className="text-[10px] text-stone-500">Ambiance</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-3 text-center">
                        <Droplets className="mx-auto h-4 w-4 text-amber-800" />
                        <p className="mt-1 text-sm font-bold text-stone-950">
                            {cafe.price_min ? `Rp ${Math.round(cafe.price_min / 1000)}k+` : 'Rp 25k+'}
                        </p>
                        <p className="text-[10px] text-stone-500">Range harga</p>
                    </div>
                </div>

                {/* Badges Tag */}
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-stone-600">
                    {cafe.distance && <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-medium">{cafe.distance}</span>}
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-medium">{cafe.signature || 'Es Kopi Susu'}</span>
                    {cafe.coworking && <span className="rounded-full border border-amber-200 bg-amber-100/70 px-3 py-1 font-semibold text-amber-900">WFH Friendly</span>}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-3 text-xs font-semibold text-stone-700 transition hover:bg-stone-50">
                    <Navigation className="h-4 w-4 text-stone-500" /> Petunjuk Arah
                </button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-900 py-3 text-xs font-bold text-white shadow-md shadow-amber-900/20 transition hover:bg-amber-950 active:scale-[0.99]">
                    <ShoppingBag className="h-4 w-4" /> Pesan Sekarang
                </button>
            </div>
        </article>
    );
}

export default function Ranking() {
    const validCafes = useMemo(() => cafesData.filter((c) => c.name), []);

    // Mengelompokkan area menjadi nama wilayah yang rapi
    const areas = useMemo(() => {
        const set = new Set();
        validCafes.forEach((c) => {
            const raw = c.area || c.district || c.address;
            set.add(getGeneralArea(raw));
        });
        return ['Semua Area', ...Array.from(set)];
    }, [validCafes]);

    const [selectedArea, setSelectedArea] = useState('Semua Area');

    // Filter kafe berdasarkan wilayah yang dipilih
    const filteredCafes = useMemo(() => {
        let list = [...validCafes];
        if (selectedArea !== 'Semua Area') {
            list = list.filter((c) => {
                const raw = c.area || c.district || c.address;
                return getGeneralArea(raw) === selectedArea;
            });
        }
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }, [validCafes, selectedArea]);

    const first = filteredCafes[0];
    const second = filteredCafes[1];
    const third = filteredCafes[2];
    const restRanking = filteredCafes.slice(3, 10);

    return (
        <section id="peringkat" className="w-full bg-stone-50 py-12 md:py-16">
            <div className="w-full px-4 sm:px-6 lg:px-10">
                
                {/* Header Section */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Peringkat Kurasi Komunitas</p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl">
                            Top Rated Spots di Batam
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
                            Penilaian berdasarkan rating kopi, kecepatan WiFi, kenyamanan tempat, dan harga.
                        </p>
                    </div>

                    {/* Filter Area Rapi & Terstruktur */}
                    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-stone-200 bg-white p-1.5 text-xs shadow-sm">
                        {areas.map((a) => (
                            <button
                                key={a}
                                onClick={() => setSelectedArea(a)}
                                className={`rounded-xl px-3.5 py-2 font-medium transition ${
                                    selectedArea === a 
                                        ? 'bg-stone-900 text-white' 
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                                }`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top 3 Podium */}
                {filteredCafes.length > 0 ? (
                    <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                        <div className="order-2 lg:order-1"><SideCard cafe={second || first} /></div>
                        <div className="order-1 lg:order-2"><Champion cafe={first} /></div>
                        <div className="order-3"><SideCard cafe={third || second || first} /></div>
                    </div>
                ) : (
                    <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 text-center text-stone-500">
                        Belum ada data kafe untuk wilayah ini.
                    </div>
                )}

                {/* Ranking #4 - #10 (Bug String Text Fix) */}
                {restRanking.length > 0 && (
                    <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                            <h3 className="font-bold text-stone-950">Peringkat Lainnya yang Lagi Ramai</h3>
                            <span className="text-[11px] font-medium text-stone-500">
                                Diperbarui dari check-in komunitas dan rating
                            </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {restRanking.map((r, index) => (
                                <div
                                    key={r.id || r.name}
                                    className="flex items-center gap-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 transition hover:bg-stone-100/80"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-800 shadow-sm ring-1 ring-stone-200">
                                        #{index + 4}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-stone-950">{r.name}</p>
                                        <p className="truncate text-[11px] leading-5 text-stone-500">
                                            {r.area || r.district || 'Batam'} • Rating {r.rating ?? '4.5'} ★ {r.wifi ? `• WiFi ${r.wifi} Mbps` : ''}
                                        </p>
                                    </div>
                                    <button className="shrink-0 rounded-xl bg-amber-900 px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-amber-950">
                                        Lihat
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}