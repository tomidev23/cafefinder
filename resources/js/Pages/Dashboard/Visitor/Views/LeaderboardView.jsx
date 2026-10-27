import { useState } from 'react';
import {
    Award,
    Trophy,
    Medal,
    Star,
    CheckCircle2,
    Wifi,
    Zap,
    Coffee,
    ArrowUpRight,
    QrCode,
    Compass,
    ChevronDown,
    SlidersHorizontal,
    Bookmark,
    ChevronRight,
    Check
} from 'lucide-react';

import { podium, ranking, areas } from '@/data/cafes';

export default function LeaderboardView({ onOrderCafe, onReserveCafe }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState(areas[0] || 'Seluruh Wilayah');
    const [isChallengeScanned, setIsChallengeScanned] = useState(false);

    const categories = [
        { id: 'all', label: '★ Semua Kategori' },
        { id: 'manual', label: 'Kopi Manual Brew (V60/Aeropress)' },
        { id: 'wfc', label: 'Kafe Ramah Kerja / WFC Terbaik' },
        { id: 'espresso', label: 'Espresso & Milk-based Terfavorit' },
        { id: 'gem', label: 'Hidden Gem Terkurasi' },
    ];

    const regions = areas;

    const tableRows = ranking;

    const champ1 = podium[0] || {};
    const champ2 = podium[1] || {};
    const champ3 = podium[2] || {};

    const reviewers = [
        { initials: 'RD', name: 'Reza Dermawan', role: 'Q-Arabica Grader • 48 Ulasan', badge: '#1 Reviewer' },
        { initials: 'SK', name: 'Siti Kusuma', role: 'Manual Brewer • 39 Ulasan', badge: '#2 Reviewer' },
        { initials: 'FH', name: 'Fajar Hidayat', role: 'Sensory Judge • 34 Ulasan', badge: '#3 Reviewer' },
    ];

    return (
        <div className="space-y-8">
            
            {/* 1. HERO HEADER */}
            <div className="rounded-3xl border border-[#EFEAE3] bg-white p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Description */}
                <div className="space-y-2.5 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/60">
                        <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                        Edisi Minggu Ini: Terverifikasi 14.820 QRIS Review
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                        Peringkat & Kurasi Kedai Kopi Terbaik Minggu Ini
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                        Peringkat independen tanpa bias iklan, dihitung secara real-time berdasarkan sensori cupping barista tersertifikasi, voting penikmat kopi aktif, serta laporan stabilitas kerja remote.
                    </p>
                </div>

                {/* Right 3 Stat Metrics Box */}
                <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-4 flex items-center divide-x divide-stone-200 text-center shrink-0">
                    <div className="px-4">
                        <span className="text-xl font-extrabold text-stone-900 block">128+</span>
                        <span className="text-[11px] text-stone-500 mt-0.5 block">Roastery Terdaftar</span>
                    </div>
                    <div className="px-4">
                        <span className="text-xl font-extrabold text-stone-900 block">99.4%</span>
                        <span className="text-[11px] text-stone-500 mt-0.5 block">Keakuratan Seduh</span>
                    </div>
                    <div className="px-4">
                        <span className="text-xl font-extrabold text-stone-900 block">15 Menit</span>
                        <span className="text-[11px] text-stone-500 mt-0.5 block">Pembaruan Skor</span>
                    </div>
                </div>

            </div>

            {/* 2. CATEGORY & REGION FILTERS */}
            <div className="space-y-3">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map(c => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCategory(c.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                                selectedCategory === c.id
                                    ? 'bg-[#56311F] text-white shadow-xs'
                                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Region Chips & Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
                            Wilayah:
                        </span>
                        {regions.map((reg, idx) => (
                            <button
                                key={reg}
                                type="button"
                                onClick={() => setSelectedRegion(reg)}
                                className={`rounded-xl px-3 py-1 text-xs font-medium transition ${
                                    selectedRegion === reg || (idx === 0 && selectedRegion === 'Semua')
                                        ? 'bg-[#56311F] text-white font-bold'
                                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                {reg}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 shrink-0">
                        <span>Urutkan:</span>
                        <button
                            type="button"
                            className="font-bold text-stone-900 inline-flex items-center gap-1 hover:text-[#56311F]"
                        >
                            Skor Tertinggi (Default) <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. PODIUM KEHORMATAN PEKAN INI (TOP 3) */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-600" />
                            Podium Kehormatan Pekan Ini
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                            3 Roastery teratas dengan konsistensi seduh dan apresiasi tertinggi oleh patron kopi Indonesia.
                        </p>
                    </div>
                    <span className="text-xs font-medium text-stone-400">
                        🕒 Diumumkan tiap Minggu pukul 23:59 WIB
                    </span>
                </div>

                {/* 3 Podium Cards (Rank 2, Rank 1 Elevated, Rank 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    
                    {/* PODIUM #2: TANAMERA COFFEE ROASTERY (LEFT) */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-100">
                                <img
                                    src={champ2.image}
                                    alt={champ2.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                                    🥈 #2 Juara Dua
                                </div>
                                <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                                    {champ2.location || 'Batam Center'}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-stone-900">{champ2.name}</h3>
                                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                                        ★ {champ2.rating}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500 mt-0.5">{champ2.tagline || champ2.area}</p>
                            </div>

                            <div className="space-y-1.5 text-xs text-stone-600 bg-[#FAF8F5] p-3 rounded-xl border border-stone-100">
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Signature Beans:</span>
                                    <span className="font-bold text-stone-800">{champ2.signatureBeans || champ2.signature}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Head Roaster:</span>
                                    <span className="font-semibold text-stone-800">{champ2.headRoaster || 'Roaster Tim'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Ulasan QRIS:</span>
                                    <span className="font-bold text-emerald-700">{champ2.qrisReviews || champ2.orders}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                                type="button"
                                className="w-full py-2 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs hover:bg-blue-100 transition"
                            >
                                Detail Sensori
                            </button>
                            <button
                                type="button"
                                onClick={() => onOrderCafe && onOrderCafe({ name: champ2.name, area: champ2.area })}
                                className="w-full py-2 rounded-xl bg-[#56311F] text-white font-bold text-xs hover:bg-[#432516] transition shadow-xs"
                            >
                                Pesan Meja
                            </button>
                        </div>
                    </div>

                    {/* PODIUM #1: COMMON GROUNDS BATAM (CENTER - GRAND CHAMPION ELEVATED) */}
                    <div className="rounded-3xl border-2 border-amber-400 bg-white p-6 shadow-xl relative -mt-4 order-first md:order-none space-y-4">
                        
                        {/* Grand Champion Badge Tag */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#56311F] text-amber-200 text-xs font-black shadow-md flex items-center gap-1.5 uppercase tracking-wider">
                            <Award className="h-3.5 w-3.5 text-amber-400" />
                            Pemenang Mingguan
                        </div>

                        <div className="space-y-3.5 pt-1">
                            <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-100">
                                <img
                                    src={champ1.image}
                                    alt={champ1.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black shadow-sm flex items-center gap-1">
                                    👑 #1 Grand Champion
                                </div>
                                <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                                    ★ 99% Rekomendasi Barista
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-lg font-extrabold text-stone-900">{champ1.name}</h3>
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-black text-white bg-[#56311F] px-2.5 py-0.5 rounded-md">
                                        ★ {champ1.rating}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500">{champ1.area}</p>
                            </div>

                            {/* Sensory Scores Bar */}
                            <div className="grid grid-cols-3 gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-amber-200/60 text-center">
                                <div>
                                    <span className="text-[10px] text-stone-400 block font-medium">Sweetness</span>
                                    <span className="text-sm font-extrabold text-[#56311F]">{champ1.sensory?.sweetness || '9.8 / 10'}</span>
                                </div>
                                <div className="border-x border-stone-200">
                                    <span className="text-[10px] text-stone-400 block font-medium">Body</span>
                                    <span className="text-sm font-extrabold text-[#56311F]">{champ1.sensory?.body || '9.6 / 10'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 block font-medium">Aftertaste</span>
                                    <span className="text-sm font-extrabold text-[#56311F]">{champ1.sensory?.aftertaste || '9.9 / 10'}</span>
                                </div>
                            </div>

                            {/* Meta Specs */}
                            <div className="space-y-1.5 text-xs text-stone-600">
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Signature Beans:</span>
                                    <span className="font-bold text-stone-800">{champ1.signatureBeans || champ1.signature}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Kecepatan WiFi:</span>
                                    <span className="font-semibold text-stone-800">{champ1.wifi || '180 Mbps'} (Mesh 6)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Total Ulasan QRIS:</span>
                                    <span className="font-bold text-emerald-700">{champ1.qrisReviews || champ1.orders}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => onOrderCafe && onOrderCafe({ name: champ1.name, area: champ1.area })}
                                className="flex-1 py-3 rounded-xl bg-[#56311F] text-white font-bold text-xs hover:bg-[#432516] transition shadow-md text-center active:scale-[0.99]"
                            >
                                Kunjungi Profil Roastery
                            </button>
                            <button
                                type="button"
                                title="Simpan Bookmark"
                                className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-500 transition"
                            >
                                <Bookmark className="h-4 w-4" />
                            </button>
                        </div>

                    </div>

                    {/* PODIUM #3: MANNER COFFEE (RIGHT) */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-100">
                                <img
                                    src={champ3.image}
                                    alt={champ3.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                                    🥉 #3 Juara Tiga
                                </div>
                                <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                                    {champ3.location || 'Batam Center'}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-stone-900">{champ3.name}</h3>
                                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                                        ★ {champ3.rating}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500 mt-0.5">{champ3.tagline || champ3.area}</p>
                            </div>

                            <div className="space-y-1.5 text-xs text-stone-600 bg-[#FAF8F5] p-3 rounded-xl border border-stone-100">
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Signature Beans:</span>
                                    <span className="font-bold text-stone-800">{champ3.signatureBeans || champ3.signature}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">WiFi & Fasilitas:</span>
                                    <span className="font-semibold text-stone-800">{champ3.wifi || '220 Mbps'} & Stopkontak</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Ulasan QRIS:</span>
                                    <span className="font-bold text-emerald-700">{champ3.qrisReviews || champ3.orders}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                                type="button"
                                className="w-full py-2 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs hover:bg-blue-100 transition"
                            >
                                Detail Sensori
                            </button>
                            <button
                                type="button"
                                onClick={() => onOrderCafe && onOrderCafe({ name: champ3.name, area: champ3.area })}
                                className="w-full py-2 rounded-xl bg-[#56311F] text-white font-bold text-xs hover:bg-[#432516] transition shadow-xs"
                            >
                                Pesan Meja
                            </button>
                        </div>
                    </div>

                </div>

            </section>

            {/* 4. TWO-COLUMN LOWER: TOP 4-15 TABLE (LEFT) & WIDGETS (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT: TOP 4-15 TABLE (col-span-8) */}
                <div className="lg:col-span-8 rounded-3xl border border-[#EFEAE3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-stone-900">
                                Peringkat 4 hingga 15 Terpilih
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
                                12 Kafe Terkurasi
                            </span>
                        </div>
                        <span className="text-[11px] text-stone-400">
                            Disaring otomatis oleh sistem verifikasi anti-bot
                        </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-stone-200/80 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                                    <th className="py-2.5 px-2">Rank</th>
                                    <th className="py-2.5 px-3">Nama Kafe & Lokasi</th>
                                    <th className="py-2.5 px-3">Citarasa & Sensori</th>
                                    <th className="py-2.5 px-3">WiFi / WFC</th>
                                    <th className="py-2.5 px-3">Kepuasan</th>
                                    <th className="py-2.5 px-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {tableRows.map((r) => (
                                    <tr key={r.rank} className="hover:bg-stone-50/80 transition">
                                        <td className="py-3.5 px-2 font-mono font-bold text-stone-500">
                                            #{r.rank}
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <div className="font-bold text-stone-900">{r.name}</div>
                                            <div className="text-[11px] text-stone-400 mt-0.5">{r.location}</div>
                                            <div className="text-[10px] text-amber-800 font-medium">{r.highlight}</div>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-900">
                                                    {r.flavor.label1}: {r.flavor.val1}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] font-bold text-stone-700">
                                                    {r.flavor.label2}: {r.flavor.val2}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <div className="font-semibold text-stone-800 flex items-center gap-1">
                                                <Wifi className="h-3 w-3 text-stone-400" />
                                                {r.wifi}
                                            </div>
                                            <div className="text-[10px] text-stone-400">{r.wifiSub}</div>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                                                {r.satisfaction}
                                            </span>
                                            <div className="text-[10px] text-stone-400 mt-0.5">{r.reviewsCount}</div>
                                        </td>
                                        <td className="py-3.5 px-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() => onOrderCafe && onOrderCafe({ name: r.name, area: r.location })}
                                                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 font-semibold text-[11px] text-stone-700 transition"
                                            >
                                                Lihat Profil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span>Menampilkan 10 dari 128 Kedai Terverifikasi</span>
                        <div className="flex items-center gap-1">
                            <button type="button" className="px-2.5 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-50">Sebelumnya</button>
                            <button type="button" className="px-2.5 py-1 rounded-md bg-[#56311F] text-white font-bold">1</button>
                            <button type="button" className="px-2.5 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-50">2</button>
                            <button type="button" className="px-2.5 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-50">3</button>
                            <button type="button" className="px-2.5 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-50">Berikutnya</button>
                        </div>
                    </div>

                </div>

                {/* RIGHT: 3 SIDEBAR WIDGETS (col-span-4) */}
                <div className="lg:col-span-4 space-y-5">
                    
                    {/* WIDGET 1: TANTANGAN JELAJAH MINGGU INI */}
                    <div className="rounded-3xl border border-amber-200 bg-linear-to-b from-amber-50/60 to-white p-5 shadow-xs space-y-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Compass className="h-3 w-3" />
                                Tantangan Jelajah Minggu Ini
                            </span>
                            <h4 className="text-sm font-bold text-stone-900 mt-2">
                                Kunjungi 3 Roastery di Batam Center
                            </h4>
                            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                Scan struk QRIS transaksi di 3 Roastery bertanda khusus di Batam Center untuk mengklaim bonus poin!
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-amber-200/80">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-stone-700">Progres Anda (1/3 Kafe)</span>
                                <span className="text-[#56311F]">15.000 CafePoints</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                                <div className="h-full rounded-full bg-linear-to-r from-amber-600 to-[#56311F] w-1/3" />
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold pt-1 flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Tanamera Batam Center (Selesai pada 24 Okt)
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setIsChallengeScanned(true);
                                alert('Kamera scanner struk QRIS aktif. Siap verifikasi transaksi berikutnya!');
                            }}
                            className="w-full py-2.5 rounded-xl bg-[#56311F] text-white text-xs font-bold hover:bg-[#432516] transition shadow-xs"
                        >
                            Pindai Struk QRIS Sekarang
                        </button>
                    </div>

                    {/* WIDGET 2: PATRON & Q-GRADER TERAKTIF */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-stone-900">
                                Patron & Q-Grader Teraktif
                            </h4>
                            <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                                Bulan Ini
                            </span>
                        </div>

                        <div className="space-y-3">
                            {reviewers.map(r => (
                                <div key={r.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                                            {r.initials}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-stone-900">{r.name}</div>
                                            <div className="text-[10px] text-stone-400">{r.role}</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                                        {r.badge}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <a href="#community" className="block text-center text-xs font-bold text-[#56311F] hover:underline pt-1">
                            Gabung Diskusi di Forum Komunitas →
                        </a>
                    </div>

                    {/* WIDGET 3: TRANSPARANSI PERHITUNGAN SKOR */}
                    <div className="rounded-3xl border border-stone-200 bg-[#FAF8F5] p-5 shadow-xs space-y-3 text-xs">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            Transparansi Perhitungan Skor
                        </h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                            Peringkat CafeFinder bukan daftar berbayar. Kami menggunakan formula terbobot untuk menjaga integritas:
                        </p>
                        <ul className="space-y-2 text-[11px] text-stone-700 pt-1">
                            <li className="flex items-start gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#56311F] mt-1 shrink-0" />
                                <span><strong className="text-stone-900">40% Verifikasi QRIS:</strong> Ulasan hanya sah setelah memindai pembayaran asli di kasir.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#56311F] mt-1 shrink-0" />
                                <span><strong className="text-stone-900">35% Penilaian Sensori:</strong> Cupping skor barista tersertifikasi SCA / Q-Grader.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#56311F] mt-1 shrink-0" />
                                <span><strong className="text-stone-900">25% Fasilitas Kerja:</strong> Kecepatan unduh WiFi dan ketersediaan stopkontak nyata.</span>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>

        </div>
    );
}

