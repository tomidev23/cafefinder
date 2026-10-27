import {
    Coffee,
    QrCode,
    Sparkles,
    CheckCircle2,
    Calendar,
    Receipt,
    HandMetal,
    Heart,
    Star,
    Share2,
    Gift,
    ChevronRight,
    ArrowRight,
    ThumbsUp,
    MessageSquare,
    ShieldCheck
} from 'lucide-react';

export default function OrdersView({
    userName,
    liveOrder,
    stamps,
    activeFilter,
    setActiveFilter,
    filteredCafes,
    favorites,
    toggleFavorite,
    onOpenOrderModal,
    onOpenReservationModal,
    onOpenReceiptModal,
    onOpenVoucherModal,
    onOpenBeansModal,
    onOpenSeatingModal,
    onOpenCuppingModal,
    onCallBarista,
    helpfulCount,
    hasVotedHelpful,
    onHelpfulClick,
    showComments,
    setShowComments,
}) {
    return (
        <div className="space-y-6">
            
            {/* 1. GREETING BANNER & STATS CARDS */}
            <section className="rounded-3xl border border-[#EFEAE3] bg-white p-6 lg:p-7 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left Greeting */}
                    <div className="space-y-2 max-w-xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/60">
                            <Coffee className="h-3.5 w-3.5" />
                            Selamat Pagi, Penikmat Seduhan
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                            Selamat Pagi, {userName.split(' ')[0]}! Siap Menemukan Seduhan Kopi Terbaik Hari Ini?
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                            Aroma biji sangrai segar menunggumu. Pesanan meja aktifmu sedang dalam tahap akhir ekstraksi di {liveOrder.cafeName}.
                        </p>
                    </div>

                    {/* Right 4 Metric Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                        <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                            <span className="self-start px-2 py-0.5 rounded-md bg-amber-100 text-[10px] font-extrabold text-amber-900">
                                LVL 3
                            </span>
                            <div className="mt-3">
                                <span className="text-[10px] text-stone-400 block font-medium">Pangkat Explorer</span>
                                <h4 className="text-xs font-bold text-stone-900 mt-0.5 leading-snug">Roastery Connoisseur</h4>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                            <span className="self-start px-2 py-0.5 rounded-md bg-emerald-100 text-[10px] font-extrabold text-emerald-800">
                                +1 Lagi!
                            </span>
                            <div className="mt-3">
                                <span className="text-[10px] text-stone-400 block font-medium">Stempel Kartu</span>
                                <h4 className="text-sm font-extrabold text-stone-900 mt-0.5">7 / 8 Stamp</h4>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                            <span className="self-start px-2 py-0.5 rounded-md bg-orange-100 text-[10px] font-extrabold text-orange-800">
                                QRIS
                            </span>
                            <div className="mt-3">
                                <span className="text-[10px] text-stone-400 block font-medium">Saldo CafePoints</span>
                                <h4 className="text-sm font-extrabold text-stone-900 mt-0.5">Rp 42.500</h4>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                            <span className="self-start px-2 py-0.5 rounded-md bg-stone-200 text-[10px] font-extrabold text-stone-700">
                                4 Kota
                            </span>
                            <div className="mt-3">
                                <span className="text-[10px] text-stone-400 block font-medium">Kafe Dikunjungi</span>
                                <h4 className="text-sm font-extrabold text-stone-900 mt-0.5">24 Kafe</h4>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 2. TWO-COLUMN: LIVE ORDER CARD (LEFT) & PASPOR KOPI DIGITAL (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: LIVE ORDER CARD */}
                <div className="lg:col-span-7 rounded-3xl border border-[#EFEAE3] bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
                    <div>
                        <div className="flex items-center justify-between pb-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                    LIVE ORDER SEDANG BERJALAN
                                </span>
                            </div>
                            <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold text-stone-600 border border-stone-200">
                                {liveOrder.location}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-stone-900 mt-1">
                            Meja #{liveOrder.tableNumber} • {liveOrder.cafeName}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-[#EFE9E2] bg-[#FDFBF9] p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                                    {liveOrder.itemCategory}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-700 text-[11px] font-medium">
                                    {liveOrder.temp}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                                    {liveOrder.primaryItem}
                                </h4>
                                <p className="text-xs text-stone-500 mt-1">
                                    {liveOrder.tastingNotes}
                                </p>
                            </div>

                            <div className="pt-2 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-[#56311F] flex items-center gap-1.5">
                                        <Coffee className="h-3.5 w-3.5 text-amber-800" />
                                        {liveOrder.brewStep}
                                    </span>
                                    <span className="text-stone-500 font-medium">
                                        Estimasi: {liveOrder.estimatedMinutes} Menit
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-amber-700 to-[#56311F] transition-all duration-700"
                                        style={{ width: `${liveOrder.progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sm:border-l sm:border-stone-200 sm:pl-4 flex flex-col items-center justify-center text-center shrink-0">
                            <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs mb-2">
                                <QrCode className="h-16 w-16 text-stone-800" />
                            </div>
                            <span className="text-xs font-bold text-stone-900 font-mono tracking-tight">
                                ETIKET {liveOrder.ticketCode}
                            </span>
                            <span className="text-[10px] text-stone-400 mt-0.5">
                                Tunjukkan ke barista meja
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onOpenReceiptModal}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
                            >
                                <Receipt className="h-3.5 w-3.5 text-stone-500" />
                                Lihat Struk Digital
                            </button>

                            <button
                                type="button"
                                onClick={onCallBarista}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
                            >
                                <HandMetal className="h-3.5 w-3.5 text-stone-500" />
                                Panggil Barista / Bantuan
                            </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{liveOrder.paymentStatus}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: PASPOR KOPI DIGITAL */}
                <div className="lg:col-span-5 rounded-3xl border border-[#EFEAE3] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                <div className="h-6 w-6 rounded-md bg-[#56311F] text-white flex items-center justify-center">
                                    <Coffee className="h-3.5 w-3.5" />
                                </div>
                                Paspor Kopi Digital
                            </h3>
                            <button
                                type="button"
                                onClick={onOpenVoucherModal}
                                className="text-xs font-bold text-[#56311F] hover:underline flex items-center gap-0.5"
                            >
                                Riwayat Stamp <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                            Kumpulkan 8 cap di kafe partner untuk menikmati <span className="font-bold text-stone-800">1 Cup Manual Brew Gratis</span> pilihanmu.
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 py-1">
                        {stamps.map((s) => (
                            <div
                                key={s.id}
                                className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition ${
                                    s.isReward
                                        ? 'border-2 border-dashed border-amber-400 bg-amber-50/50 text-[#56311F]'
                                        : s.stamped
                                        ? 'border border-[#EFE9E2] bg-[#FAF8F5] text-stone-800'
                                        : 'border border-stone-200 bg-stone-50 text-stone-400'
                                }`}
                            >
                                {s.stamped ? (
                                    <>
                                        <div className="relative mb-1">
                                            <div className="h-8 w-8 rounded-full bg-[#56311F] text-amber-100 flex items-center justify-center shadow-2xs">
                                                <Coffee className="h-4 w-4" />
                                            </div>
                                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                                                ✓
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold tracking-tight truncate w-full">
                                            {s.name}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative mb-1">
                                            <div className="h-8 w-8 rounded-full bg-amber-100/70 text-[#56311F] flex items-center justify-center">
                                                <Gift className="h-4 w-4 text-[#56311F]" />
                                            </div>
                                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#56311F] text-white flex items-center justify-center text-[9px] font-bold">
                                                8
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold tracking-tight text-[#56311F] truncate w-full">
                                            {s.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-xs text-stone-500 font-medium">
                            Tinggal 1 kunjungan lagi untuk klaim reward!
                        </span>
                        <button
                            type="button"
                            onClick={onOpenVoucherModal}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#56311F] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#432516] transition active:scale-[0.99]"
                        >
                            <Gift className="h-3.5 w-3.5" />
                            Tukarkan Voucher
                        </button>
                    </div>
                </div>

            </div>

            {/* 3. SECTION: KOLEKSI KEDAI PILIHAN SAYA */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                            Koleksi Kedai Pilihan Saya
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Kafe favorit tersimpan dengan status operasional & ketersediaan fasilitas real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setActiveFilter('semua')}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                                activeFilter === 'semua'
                                    ? 'bg-[#56311F] text-white shadow-xs'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            Semua (12)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('buka')}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                                activeFilter === 'buka'
                                    ? 'bg-[#56311F] text-white shadow-xs'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            Buka Sekarang (8)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('wfc')}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                                activeFilter === 'wfc'
                                    ? 'bg-[#56311F] text-white shadow-xs'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            Banyak Colokan / WFC (6)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCafes.map((cafe) => (
                        <div
                            key={cafe.id}
                            className="rounded-3xl border border-[#EFEAE3] bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative h-48 w-full bg-stone-200 overflow-hidden">
                                    <img
                                        src={cafe.image}
                                        alt={cafe.name}
                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3">
                                        {cafe.isOpen ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                {cafe.statusLabel}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                                                {cafe.statusLabel}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toggleFavorite(cafe.id)}
                                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 shadow-xs hover:bg-white transition"
                                        title="Favorit"
                                    >
                                        <Heart className={`h-4 w-4 ${favorites[cafe.id] ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                                    </button>
                                </div>

                                <div className="p-5 space-y-3">
                                    <span className="text-[11px] font-semibold text-stone-500 block">
                                        {cafe.area}
                                    </span>

                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-base font-bold text-stone-900">{cafe.name}</h3>
                                        <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                            <span>{cafe.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-stone-500 font-medium">
                                        {cafe.style}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                        {cafe.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-[11px] font-medium text-stone-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {cafe.seatsAlert && (
                                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                                                {cafe.seatsAlert}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 pt-0 flex items-center gap-2">
                                {cafe.canOrderNow ? (
                                    <button
                                        type="button"
                                        onClick={() => onOpenOrderModal(cafe)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#56311F] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#432516] transition active:scale-[0.99]"
                                    >
                                        <QrCode className="h-3.5 w-3.5" />
                                        Pesan Meja / QRIS
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onOpenReservationModal(cafe)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:border-stone-400 transition"
                                    >
                                        <Calendar className="h-3.5 w-3.5 text-stone-500" />
                                        Reservasi Meja Nanti
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="h-9 w-9 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:bg-stone-50 transition shrink-0"
                                >
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. SECTION: DIPILIHKAN KHUSUS BERDASARKAN SELERA SEDUH ANDA */}
            <section className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/60">
                            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                            Algoritma Taste Profile: Filter & Light-Medium Roast
                        </span>
                        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                            Dipilihkan Khusus Berdasarkan Selera Seduh Anda
                        </h2>
                        <p className="text-xs text-stone-500">
                            Kamu menyukai profil rasa buah-buahan asam manis dan suasana kedai tenang untuk membaca.
                        </p>
                    </div>
                    <span className="text-[11px] font-medium text-stone-400">
                        Disesuaikan dari 18 pesanan terakhir
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 text-[10px] font-bold">
                                    Biji Sangrai Langka
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                    Diskon 15% QRIS Member
                                </span>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="h-14 w-14 rounded-2xl bg-[#F6EFE6] border border-[#E8DEC8] flex items-center justify-center text-[#56311F] shrink-0">
                                    <Coffee className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900 leading-snug">Flores Bajawa Anaerobic</h3>
                                    <p className="text-xs text-stone-500">Roastery: Tanamera Coffee Roastery Batam</p>
                                    <p className="text-[11px] text-stone-400 mt-0.5">Notes: Strawberry, Winey, Cacao</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <div>
                                <span className="text-sm font-extrabold text-[#56311F]">Rp 110.500</span>
                                <span className="text-xs line-through text-stone-400 ml-1.5">Rp 130.000</span>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenBeansModal}
                                className="px-4 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition"
                            >
                                Beli Beans
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    Spot WFC Hening
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">
                                    850m dari lokasimu
                                </span>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                                    <Sparkles className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900 leading-snug">Manner Coffee Batam Center</h3>
                                    <p className="text-xs text-stone-500">220 Mbps WiFi, Ergonomic chairs & Quiet Booths</p>
                                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Free 1 Jam Private Meeting Pod</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <span className="text-xs text-stone-500 font-medium">Tingkat keramaian: <span className="font-bold text-emerald-700">Tenang</span></span>
                            <button
                                type="button"
                                onClick={onOpenSeatingModal}
                                className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                            >
                                Cek Kursi
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 text-[10px] font-bold">
                                    Cupping Session
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">
                                    Sabtu ini, 14:00
                                </span>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                                    <Coffee className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900 leading-snug">Tasting Flight: Geisha vs Typica</h3>
                                    <p className="text-xs text-stone-500">Di Common Grounds Batam • Bersama Reza D.</p>
                                    <p className="text-[11px] text-amber-800 font-bold mt-0.5">Tersisa 3 Kursi VIP</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <div>
                                <span className="text-sm font-extrabold text-[#56311F]">Rp 85.000</span>
                                <span className="text-xs text-stone-400"> / pax</span>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenCuppingModal}
                                className="px-4 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition"
                            >
                                Daftar Sesi
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. SECTION: RIWAYAT EKSPLORASI & ULASAN TERBARU ANDA */}
            <section className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                            Riwayat Eksplorasi & Ulasan Terbaru Anda
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Catatan rasa dan impresi seduhan yang Anda bagikan untuk komunitas pencinta kopi.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#56311F] hover:underline"
                    >
                        Lihat Semua Ulasan (24) <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row gap-5 items-start">
                    <div className="h-44 w-full md:w-56 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                            alt="Common Grounds Batam Pour Over"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-stone-900">
                                    Common Grounds Batam — Penuin
                                </h3>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Ulasan Terverifikasi QRIS
                                </span>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500 text-sm">
                                {'★★★★★'}
                                <span className="font-bold text-xs text-stone-900 ml-1">5.0</span>
                            </div>
                        </div>

                        <p className="text-xs text-stone-400">
                            Dikunjungi 2 hari yang lalu • Menu: Piccolo Latte & Ethiopian Yirgacheffe Pour Over
                        </p>

                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/70">
                            “Salah satu seduhan Ethiopia terbersih yang pernah saya coba di Batam Center. Rasio air dan suhu ekstraksi sangat presisi, acidity seperti buah persik matang dengan aftertaste floral jasmine yang sangat panjang. Barista sangat ramah saat diajak diskusi kalibrasi gilingan.”
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-xs font-bold text-stone-600">Tasting Profile:</span>
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                                🌸 Floral Jasmine
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                                🍋 Citrus Lemon
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-900 border border-orange-200 text-xs font-semibold">
                                🍯 Brown Sugar Sweetness
                            </span>
                        </div>

                        <div className="pt-2 flex items-center gap-4 text-xs text-stone-500">
                            <button
                                type="button"
                                onClick={onHelpfulClick}
                                className={`inline-flex items-center gap-1.5 transition ${
                                    hasVotedHelpful ? 'text-[#56311F] font-bold' : 'hover:text-stone-900'
                                }`}
                            >
                                <ThumbsUp className={`h-3.5 w-3.5 ${hasVotedHelpful ? 'fill-[#56311F]' : ''}`} />
                                <span>{helpfulCount} Membantu</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowComments(!showComments)}
                                className="inline-flex items-center gap-1.5 hover:text-stone-900 transition"
                            >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>6 Komentar</span>
                            </button>
                        </div>

                        {showComments && (
                            <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="font-bold text-stone-800">Reza (Barista):</span>
                                    <span className="text-stone-600">Terima kasih banyak reviewnya kak Dimas! Sampai jumpa di seduhan berikutnya.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-bold text-stone-800">Andi Coffee:</span>
                                    <span className="text-stone-600">Ethiopian Yirgacheffe mereka memang juara notasinya!</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}

