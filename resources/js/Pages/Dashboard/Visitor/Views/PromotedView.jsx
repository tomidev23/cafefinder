import { useState } from 'react';
import {
    Tag,
    Gift,
    Percent,
    Zap,
    Sparkles,
    CheckCircle2,
    Clock,
    MapPin,
    QrCode,
    ChevronDown,
    ArrowRight,
    ShoppingBag,
    Coffee,
    Award,
    Compass,
    Check,
    Bookmark
} from 'lucide-react';

import { promotedDeals } from '@/data/cafes';

export default function PromotedView({ onOrderCafe, onReserveCafe }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [claimedPromos, setClaimedPromos] = useState({});

    const handleClaimPromo = (id, cafeName) => {
        setClaimedPromos(prev => ({ ...prev, [id]: true }));
        alert(`Voucher diskon ${cafeName} berhasil disimpan ke dompet digital Anda! Tunjukkan di kasir/meja untuk potongan otomatis.`);
    };

    const filters = [
        { id: 'all', label: 'Semua Promo (24)' },
        { id: 'manual', label: 'Diskon Manual Brew' },
        { id: 'breakfast', label: 'Paket Sarapan & Pastry' },
        { id: 'wfc', label: 'WFC Bundling (Ngopi Seharian)' },
        { id: 'free', label: 'Gratis Cup & Reward Stamp' },
    ];

    const merchantDeals = promotedDeals.merchantDeals;
    const heroDeal = promotedDeals.heroDeal;
    const flashDeal = promotedDeals.flashDeal;

    return (
        <div className="space-y-8">
            
            {/* 1. HERO PROMO HEADER */}
            <div className="rounded-3xl border border-[#EFEAE3] bg-white p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Description */}
                <div className="space-y-3 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/60">
                        <Tag className="h-3.5 w-3.5" />
                        PROMO SPESIAL QRIS • Periode: 20-31 Okt 2026
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                        Promosi Eksklusif & Mitra Roastery Pilihan
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                        Nikmati penawaran hemat mencicipi single origin pilihan, diskon pembayaran QRIS di 45+ mitra roastery tersertifikasi, serta akses eksklusif tiket cupping dan workshop barista dengan harga terjangkau.
                    </p>

                    {/* 4 Highlight Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-2 text-center text-xs font-bold text-stone-800">
                            🏷️ 20% Cashback
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-2 text-center text-xs font-bold text-stone-800">
                            ☕ Free 1 Cup Stamp
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-2 text-center text-xs font-bold text-stone-800">
                            🎟️ Diskon 50k Voucher
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-2 text-center text-xs font-bold text-stone-800">
                            ⚡ Prioritas WFC
                        </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <a
                            href="#exclusive-deals"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition shadow-xs"
                        >
                            Lihat Semua Penawaran Aktif <ChevronDown className="h-3.5 w-3.5" />
                        </a>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            48 Penawaran diverifikasi langsung oleh merchant hari ini
                        </span>
                    </div>
                </div>

                {/* Right Promo Highlight Card */}
                <div className="rounded-2xl border border-amber-200 bg-[#FAF8F5] p-4 flex flex-col justify-between gap-3 shrink-0 sm:w-72">
                    <div className="relative h-32 rounded-xl overflow-hidden bg-stone-200">
                        <img
                            src={flashDeal.image}
                            alt={flashDeal.title}
                            className="h-full w-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold">
                            Flash Deal
                        </span>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                            {flashDeal.title}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                            <div>
                                <span className="text-xs font-extrabold text-[#56311F]">{flashDeal.price}</span>
                                <span className="text-[10px] line-through text-stone-400 ml-1.5">{flashDeal.originalPrice}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleClaimPromo(flashDeal.id, flashDeal.title)}
                                className="px-3 py-1 rounded-lg bg-[#56311F] text-white text-[11px] font-bold hover:bg-[#432516] transition"
                            >
                                Klaim
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* 2. FILTER TABS ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {filters.map(f => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setActiveFilter(f.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                                activeFilter === f.id
                                    ? 'bg-[#56311F] text-white shadow-xs'
                                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 shrink-0">
                    <span>Urutkan:</span>
                    <button
                        type="button"
                        className="font-bold text-stone-900 inline-flex items-center gap-1 hover:text-[#56311F]"
                    >
                        Promo Berakhir Segera <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                    </button>
                </div>
            </div>

            {/* 3. HERO EXCLUSIVE DEAL CARD (TANAMERA BATAM CENTER WFC 4H) */}
            <div id="exclusive-deals" className="rounded-3xl border border-[#EFEAE3] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Photo (col-span-5) */}
                <div className="lg:col-span-5 relative h-64 lg:h-auto bg-stone-100 overflow-hidden">
                    <img
                        src={heroDeal.image}
                        alt={heroDeal.name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-1 items-start">
                        <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-sm uppercase tracking-wider">
                            {heroDeal.badge}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-semibold backdrop-blur-xs">
                            {heroDeal.quota}
                        </span>
                    </div>
                    <div className="absolute bottom-3 left-4 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                        Lokasi: {heroDeal.area}
                    </div>
                </div>

                {/* Right Details (col-span-7) */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                TERBATAS HARI INI
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                                Mitra Pro Terverifikasi
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                                Dukungan Bayar: QRIS • Kartu • CafePoints
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
                            {heroDeal.name}
                        </h2>

                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                            {heroDeal.desc}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                            <div>
                                <span className="text-[10px] text-stone-400 block">Jadwal Sesi</span>
                                <span className="font-bold text-stone-800">{heroDeal.schedule}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-400 block">Ketersediaan Meja</span>
                                <span className="font-bold text-emerald-700">{heroDeal.seatsLeft}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-700 pt-1">
                            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> {heroDeal.wifi}</span>
                            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Stopkontak Langsung per Meja</span>
                            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Free Mineral Water</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-xs text-stone-400 block font-medium">Harga Promo Paket</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-extrabold text-[#56311F]">Rp {heroDeal.price.toLocaleString('id-ID')}</span>
                                <span className="text-sm line-through text-stone-400">Rp {heroDeal.originalPrice.toLocaleString('id-ID')}</span>
                                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Hemat 40%</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                            >
                                Simpan
                            </button>
                            <button
                                type="button"
                                onClick={() => onOrderCafe && onOrderCafe({ name: heroDeal.cafeName, area: heroDeal.area })}
                                className="px-6 py-2.5 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition shadow-sm active:scale-[0.99]"
                            >
                                Klaim Promo & Pesan Meja
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* 4. PENAWARAN EKSKLUSIF GERAI MITRA PRO (6 CARDS GRID) */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                            Penawaran Eksklusif Gerai Mitra Pro
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Tukarkan penawaran dengan mudah via pemesanan online di aplikasi, atau tunjukkan langsung ke kasir merchant.
                        </p>
                    </div>
                    <span className="text-xs font-medium text-stone-400">
                        Menampilkan 6 Penawaran Terverifikasi
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {merchantDeals.map(deal => (
                        <div
                            key={deal.id}
                            className="rounded-3xl border border-[#EFEAE3] bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                                    <img
                                        src={deal.image}
                                        alt={deal.name}
                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
                                            {deal.badge}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                                            {deal.timer}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                                        {deal.location}
                                    </div>
                                </div>

                                <div className="p-5 space-y-2.5">
                                    <h4 className="text-base font-bold text-stone-900">{deal.name}</h4>
                                    <p className="text-xs text-stone-600 leading-relaxed">{deal.desc}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-1 pt-1">
                                        {deal.tags.map(t => (
                                            <span key={t} className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-2 text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {deal.quota}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between">
                                <span className="text-sm font-extrabold text-[#56311F]">{deal.price}</span>
                                <button
                                    type="button"
                                    onClick={() => handleClaimPromo(deal.id, deal.name)}
                                    className="px-4 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition shadow-2xs"
                                >
                                    {claimedPromos[deal.id] ? 'Tersimpan ✓' : 'Klaim Promo →'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. KOLEKSI PAKET SPESIAL PECINTA KOPI (2 CARDS) */}
            <section className="space-y-4">
                <div className="text-center max-w-xl mx-auto space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                        BUNDLING COFFEE EXPERIENCE
                    </span>
                    <h3 className="text-xl font-bold text-stone-900">
                        Koleksi Paket Spesial Pecinta Kopi
                    </h3>
                    <p className="text-xs text-stone-500">
                        Paket bundling multi-roastery eksklusif berharga hemat untuk petualangan rasa personal maupun hadiah rekan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Paket 1: Paspor Kopi Manual Brew */}
                    <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full">
                                    Paket Hemat 3 Kedai
                                </span>
                                <span className="text-xs text-stone-400">Masa Aktif: 30 Hari</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-[#56311F] text-amber-200 flex items-center justify-center">
                                    <Coffee className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-stone-900">Paspor Kopi Manual Brew</h4>
                                    <p className="text-xs text-stone-500">Beli bundling 3 kupon manual brew di Tanamera, Common Grounds, dan Manner Coffee.</p>
                                </div>
                            </div>

                            <ul className="space-y-1.5 text-xs text-stone-600 pt-1">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Berlaku di mitra roastery Batam Center, Nagoya & Batam Kota</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Bebas pilih beans single origin lokal apa saja</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Dapatkan 3 poin stempel ekstra di Paspor Kopi Anda</li>
                            </ul>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                            <div>
                                <span className="text-lg font-extrabold text-[#56311F]">Rp 113.750</span>
                                <span className="text-xs line-through text-stone-400 ml-1.5">Rp 175.000</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => alert('Paket Paspor Kopi Manual Brew siap dibayar via QRIS!')}
                                className="px-5 py-2.5 rounded-xl bg-[#56311F] text-white text-xs font-bold hover:bg-[#432516] transition shadow-xs"
                            >
                                Beli Paket Sekarang
                            </button>
                        </div>
                    </div>

                    {/* Paket 2: Tasting Experience Pass */}
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                                    Weekend Cupping Class
                                </span>
                                <span className="text-xs text-stone-400">Sabtu & Minggu</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-amber-100 text-[#56311F] flex items-center justify-center">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-stone-900">Tasting Experience Pass</h4>
                                    <p className="text-xs text-stone-500">Akses cupping session bersama Q-Grader + 1 bag roasted beans 200g.</p>
                                </div>
                            </div>

                            <ul className="space-y-1.5 text-xs text-stone-600 pt-1">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Sesi edukasi cupping dan uji sensorik selama 2 jam penuh</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Bawa pulang roasted beans single-origin seharga min Rp 120rb</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Sertifikat digital apresiasi cupper dari CafeFinder Community</li>
                            </ul>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                            <div>
                                <span className="text-lg font-extrabold text-[#56311F]">Rp 245.000</span>
                                <span className="text-xs line-through text-stone-400 ml-1.5">Rp 350.000</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => alert('Pendaftaran Tasting Experience Pass siap diproses!')}
                                className="px-5 py-2.5 rounded-xl bg-[#56311F] text-white text-xs font-bold hover:bg-[#432516] transition shadow-xs"
                            >
                                Beli Paket Sekarang
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* 6. CARA MUDAH KLAIM PROMO INSTAN (3 STEPS) */}
            <div className="rounded-3xl border border-stone-200 bg-[#FAF8F5] p-6 sm:p-8 space-y-6 text-center">
                <div>
                    <h3 className="text-lg font-bold text-stone-900">
                        Cara Mudah Klaim Promo Instan di Tempat
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                        Nikmati kemudahan voucher tanpa repot cetak kupon kertas, langsung aktif saat tiba di gerai mitra kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
                    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-2">
                        <div className="h-10 w-10 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                            1
                        </div>
                        <h4 className="text-xs font-bold text-stone-900">1. Pilih & Simpan Promo</h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                            Pilih promo yang Anda inginkan di halaman ini, lalu simpan ke dompet digital akun CafeFinder Anda.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-2">
                        <div className="h-10 w-10 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                            2
                        </div>
                        <h4 className="text-xs font-bold text-stone-900">2. Datang & Scan QRIS Meja</h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                            Kunjungi kafe mitra pilihan, duduk di meja atau ke kasir, lalu pindai kode QRIS CafeFinder yang terpasang di meja / kasir.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-2">
                        <div className="h-10 w-10 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                            3
                        </div>
                        <h4 className="text-xs font-bold text-stone-900">3. Diskon Terpotong Otomatis</h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                            Sistem secara otomatis mendeteksi voucher aktif Anda dan memotong total tagihan secara instan pada aplikasi perbankan Anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* 7. CTA BANNER MERCHANT PRO */}
            <div className="rounded-3xl bg-[#56311F] text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md">
                <div className="space-y-2 max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                        UNTUK PEMILIK KEDAI & ROASTERY
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
                        Ingin Gerai Anda Ditampilkan di Halaman Promosi? Bergabunglah dengan Merchant Pro.
                    </h3>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                        Jangkau lebih dari 85.000+ pencinta kopi aktif setiap bulannya. Naikkan okupansi meja di jam kerja sepi, tingkatkan penjualan retail beans, dan kelola promosi instan dengan dashboard khusus Merchant Pro yang intuitif.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-200 pt-1">
                        <span>✓ Pelaporan Real-Time</span>
                        <span>✓ Verifikasi Review Otomatis</span>
                        <span>✓ Pembayaran Langsung H+0 via QRIS</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button
                        type="button"
                        className="px-5 py-3 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-stone-100 transition text-center"
                    >
                        Pelajari Benefit Mitra
                    </button>
                    <button
                        type="button"
                        className="px-5 py-3 rounded-xl bg-[#3E2114] text-white text-xs font-bold hover:bg-[#321a10] transition text-center shadow-xs border border-white/20"
                    >
                        Daftarkan Gerai Kopi Sekarang
                    </button>
                </div>
            </div>

        </div>
    );
}

