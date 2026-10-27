import { useState } from 'react';
import {
    Users,
    MessageSquare,
    ThumbsUp,
    Share2,
    Bookmark,
    CheckCircle2,
    Calendar,
    MapPin,
    Coffee,
    Sparkles,
    SlidersHorizontal,
    Plus,
    Copy,
    Check,
    Award,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

export default function CommunityView({ onCuppingRSVP }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [copiedMatrix, setCopiedMatrix] = useState(false);
    const [likes, setLikes] = useState({
        post1: 124,
        post2: 89,
    });
    const [hasLiked, setHasLiked] = useState({
        post1: false,
        post2: false,
    });
    const [savedRecipes, setSavedRecipes] = useState({
        recipe1: false,
    });

    const toggleLike = (key) => {
        setHasLiked(prev => {
            const next = !prev[key];
            setLikes(l => ({ ...l, [key]: next ? l[key] + 1 : l[key] - 1 }));
            return { ...prev, [key]: next };
        });
    };

    const handleCopyMatrix = () => {
        setCopiedMatrix(true);
        setTimeout(() => setCopiedMatrix(false), 2000);
    };

    const filters = [
        { id: 'all', label: 'Semua Diskusi' },
        { id: 'notes', label: 'Tasting Notes & Review Biji' },
        { id: 'recipe', label: 'Resep Seduh & Parameter' },
        { id: 'wfc', label: 'Rekomendasi Kafe Hening WFC' },
        { id: 'gear', label: 'Tanya Jawab Mesin & Grinder' },
        { id: 'events', label: 'Jadwal Event & Cupping' },
    ];

    const upcomingEvents = [
        {
            title: 'Workshop Latte Art & Milk Texture Control',
            date: 'Minggu ini • 19 Mei',
            location: '@ Tanamera Coffee Roastery, Batam Center',
            badge: 'Tersedia',
            badgeColor: 'emerald',
            price: 'Rp 250.000 / Org',
        },
        {
            title: 'Sensory Kalibrasi Kopi Fermentasi Ragi',
            date: '24 Mei 2024',
            location: '@ Common Grounds Batam, Penuin',
            badge: 'Barista Only',
            badgeColor: 'amber',
            price: 'Gratis (RSVP Barista)',
        },
        {
            title: 'Batam Coffee Community: Manual Brew Throwdown',
            date: '01 Juni 2024',
            location: '@ Manner Coffee, Batam Center',
            badge: 'Cupping Terbuka',
            badgeColor: 'blue',
            price: 'Open Registration',
        },
    ];

    const topContributors = [
        { name: 'Bagas Wicaksono', role: 'Q-Arabica Grader • 1.420 Poin', rank: '1', initials: 'BW' },
        { name: 'Ratih Saraswati', role: 'Sensory Brewer • 980 Poin', rank: '2', initials: 'RS' },
        { name: 'Fajar Kurniawan', role: 'Home Roaster • 945 Poin', rank: '3', initials: 'FK' },
    ];

    const trendingOrigins = [
        { tag: '#AcehGayo_Avt2024', meta: 'Proses: Wet Hulled Winey • 428 Ulasan' },
        { tag: '#FloresBajawa_YellowCaturra', meta: 'Notes: Brown Sugar & Apple • 312 Ulasan' },
        { tag: '#IjenLactic_Natural', meta: 'Notes: Strawberry Jam Yogurt • 289 Ulasan' },
        { tag: '#TorajaSapan_Washed', meta: 'Notes: Herbal Lime & Dark Chocolate • 194 Ulasan' },
    ];

    return (
        <div className="space-y-8">
            
            {/* 1. HERO HEADER */}
            <div className="rounded-3xl border border-[#EFEAE3] bg-white p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
                
                {/* Background decorative cup watermark */}
                <div className="absolute right-6 -bottom-8 opacity-5 pointer-events-none hidden lg:block">
                    <Coffee className="w-80 h-80 text-stone-900" />
                </div>

                <div className="space-y-3 max-w-2xl z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/60">
                        <Users className="h-3.5 w-3.5" />
                        Komunitas Kopi Terverifikasi & Barista Hub Indonesia
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                        Komunitas Penikmat & Penggiat Kopi Indonesia
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                        Ruang diskusi tasting notes, ulasan seduhan jujur terverifikasi QRIS, jadwal cupping session, dan forum pertukaran resep pour over antar penikmat kopi & barista profesional se-Nusantara.
                    </p>

                    {/* 4 Stats counters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                            <span className="text-lg font-extrabold text-stone-900 block">14.8K+</span>
                            <span className="text-[11px] text-stone-500 block">Catatan Rasa Terbit</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                            <span className="text-lg font-extrabold text-stone-900 block">3.2K+</span>
                            <span className="text-[11px] text-stone-500 block">Resep Parameter</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                            <span className="text-lg font-extrabold text-stone-900 block">180+</span>
                            <span className="text-[11px] text-stone-500 block">Barista & Q-Grader</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                            <span className="text-lg font-extrabold text-stone-900 block">42 Kota</span>
                            <span className="text-[11px] text-stone-500 block">Rukun Seduh Aktif</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* 2. CTA BAR FOR PARTICIPATION */}
            <div className="rounded-3xl border border-stone-200 bg-[#FAF8F5] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-stone-900">
                            Punya racikan seduh atau opini beans baru?
                        </h4>
                        <p className="text-[11px] text-stone-500">
                            Bagikan pengalaman sensorik dan parameter ekstraksi Anda hari ini.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => alert('Buka formulir pembuatan catatan rasa baru')}
                        className="px-4 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition shadow-xs"
                    >
                        📝 Tulis Catatan Rasa
                    </button>
                    <button
                        type="button"
                        onClick={() => alert('Buka formulir buat utas diskusi')}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                    >
                        💬 Buat Utas Diskusi
                    </button>
                    <button
                        type="button"
                        onClick={() => alert('Buka formulir bagikan resep parameter seduh')}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition hidden sm:inline-block"
                    >
                        ☕ Bagikan Resep Seduh
                    </button>
                </div>
            </div>

            {/* 3. FILTER TABS */}
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

            {/* 4. MAIN FEED (2 COLUMNS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT: COMMUNITY POSTS FEED (col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* POST 1: TASTING NOTE & V60 RECIPE */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
                        
                        {/* Author Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-linear-to-tr from-[#56311F] to-amber-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                                    AS
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="text-xs font-bold text-stone-900">Arya Satria</h4>
                                        <span className="text-[11px] text-stone-400">@aryaseduh</span>
                                        <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                            ✓ Ulasan QRIS Terverifikasi
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-stone-400 mt-0.5">
                                        Diseduh di Common Grounds Batam, Penuin • 2 jam yang lalu
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSavedRecipes(p => ({ ...p, recipe1: !p.recipe1 }))}
                                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-full transition"
                            >
                                <Bookmark className={`h-4 w-4 ${savedRecipes.recipe1 ? 'fill-amber-700 text-amber-700' : ''}`} />
                            </button>
                        </div>

                        {/* Title & Flavor Tags */}
                        <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
                                Kerinci Anaerobic Natural x Ethiopia Yirgacheffe Washed: Eksplorasi Sweet Jasmine & Delicate Peach
                            </h3>
                            <p className="text-xs text-stone-500 font-medium">
                                Roastery: Fugol Coffee Lab • Lot Harvest 2024
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">🌸 Floral Jasmine</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">🍑 White Peach</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-900 border border-orange-200 text-xs font-semibold">🍯 Cane Sugar</span>
                                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-medium">Acidity: Sparkling Citric (4/5)</span>
                                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-medium">Body: Silky Tea-like (2.5/5)</span>
                            </div>
                        </div>

                        {/* Review Content & Photo */}
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                            Seduhan kali ini benar-benar membuka mata terhadap potensi fermentasi terkontrol Kerinci yang dikawinkan dengan karakter klasik Yirgacheffe. Pada hirupan pertama di suhu 65°C, aroma melati mendominasi dengan acidity persik putih yang sangat manis dan bersih. Aftertaste gula tebunya lingering hingga 30 detik setelah tegukan. Tidak ada rasa fermentasi berlebih atau boozy yang menusuk.
                        </p>

                        <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-stone-100">
                            <img
                                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                                alt="Dokumentasi Seduh"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs flex items-center gap-1.5">
                                <Coffee className="h-3.5 w-3.5 text-amber-400" />
                                Dokumentasi Seduh Langsung di Bar
                            </div>
                        </div>

                        {/* Parameter Seduhan Box (4:6 Method) */}
                        <div className="rounded-2xl border border-amber-200 bg-[#FAF8F5] p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#56311F] flex items-center gap-1.5">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Parameter Seduhan V60 (4:6 Method Tweak)
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyMatrix}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-white border border-amber-300 px-2.5 py-1 rounded-lg hover:bg-amber-50 transition"
                                >
                                    {copiedMatrix ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                                    {copiedMatrix ? 'Tersalin' : 'Salin Matrik'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                                    <span className="text-[10px] text-stone-400 block font-medium">Rasio</span>
                                    <span className="font-bold text-stone-900">1:15 (15g : 225ml)</span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                                    <span className="text-[10px] text-stone-400 block font-medium">Suhu Air</span>
                                    <span className="font-bold text-stone-900">92°C (Total TDS 95ppm)</span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                                    <span className="text-[10px] text-stone-400 block font-medium">Grind Size</span>
                                    <span className="font-bold text-stone-900">Medium Coarse (22 Clicks)</span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                                    <span className="text-[10px] text-stone-400 block font-medium">Waktu Ekstraksi</span>
                                    <span className="font-bold text-stone-900">2m 30s (3 Pour)</span>
                                </div>
                            </div>
                        </div>

                        {/* Interaction Footer */}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => toggleLike('post1')}
                                    className={`inline-flex items-center gap-1.5 transition ${hasLiked.post1 ? 'text-[#56311F] font-bold' : 'hover:text-stone-900'}`}
                                >
                                    <ThumbsUp className={`h-4 w-4 ${hasLiked.post1 ? 'fill-[#56311F]' : ''}`} />
                                    <span>{likes.post1} Suka</span>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 hover:text-stone-900 transition"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    <span>19 Balasan</span>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 hover:text-stone-900 transition"
                                >
                                    <Share2 className="h-4 w-4" />
                                    <span>Share</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSavedRecipes(p => ({ ...p, recipe1: !p.recipe1 }))}
                                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-700 hover:bg-stone-50 transition"
                            >
                                {savedRecipes.recipe1 ? 'Resep Disimpan ✓' : 'Simpan Resep'}
                            </button>
                        </div>

                    </div>

                    {/* POST 2: TECHNICAL DISCUSSION & EXPERT ANSWER */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
                        
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-xs">
                                    DR
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold text-stone-900">Dhimas Ramadhan</h4>
                                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full">
                                            Head Barista @ Monolog
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-stone-400 mt-0.5">
                                        Kategori: Resep Seduh & Parameter • 5 jam yang lalu
                                    </p>
                                </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
                                Diskusi Teknis
                            </span>
                        </div>

                        <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
                                Eksperimen Suhu Air vs Ekstraksi Natural Process: Mengapa 88°C Menghasilkan Cupping Lebih Bersih Dibanding 94°C?
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                                Belakangan ini saya menguji 3 beans proses anaerobik natural dari Ijen dan Temanggung. Ketika diseduh dengan suhu 94°C, notes fermentasinya cenderung menutupi rasa asli buah (over-pronounced vinegarish). Namun ketika suhu diturunkan ke 88°C dengan flow rate stabil 4g/detik, body tetap berbobot namun claritas buah peach dan anggur merah jauh lebih terdefinisikan tanpa ada rasa sepat (dry astringency). Apakah kawan-kawan barista di sini mengamati fenomena serupa?
                            </p>
                        </div>

                        {/* Tanggapan Q-Grader Terverifikasi Card */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    Tanggapan Q-Grader Terverifikasi
                                    <span className="font-normal text-emerald-700">(Diki Nurhalim, CQI Certified Arabica Grader)</span>
                                </span>
                                <span className="text-[10px] text-emerald-600">2 jam lalu</span>
                            </div>
                            <p className="text-xs text-stone-700 leading-relaxed italic bg-white p-3 rounded-xl border border-emerald-100">
                                “Tepat sekali Mas Dhimas. Pada beans proses natural anaerobik, gula sederhana dan senyawa volatil alkohol sudah terbentuk pekat. Air di atas 92°C mengekstraksi senyawa fenolik dan tannin berbobot molekul tinggi lebih cepat, memicu sensasi astringent. Di 88°C, solubilitas asam malat dan sukrosa tetap optimal sementara ekstraksi senyawa pahit fermentasi tertekan secara signifikan.”
                            </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => toggleLike('post2')}
                                    className={`inline-flex items-center gap-1.5 transition ${hasLiked.post2 ? 'text-[#56311F] font-bold' : 'hover:text-stone-900'}`}
                                >
                                    <ThumbsUp className={`h-4 w-4 ${hasLiked.post2 ? 'fill-[#56311F]' : ''}`} />
                                    <span>{likes.post2} Suka</span>
                                </button>
                                <button type="button" className="inline-flex items-center gap-1.5 hover:text-stone-900 transition">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>32 Komentar & Analisa</span>
                                </button>
                            </div>
                            <button type="button" className="font-bold text-[#56311F] hover:underline flex items-center gap-0.5">
                                Ikut Berdiskusi →
                            </button>
                        </div>

                    </div>

                    {/* POST 3: EVENT ANNOUNCEMENT (PUBLIC CUPPING) */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#56311F] text-white flex items-center justify-center font-bold text-xs">
                                    TR
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold text-stone-900">Tanamera Coffee Roastery</h4>
                                        <span className="text-[10px] text-stone-400">Penyelenggara Terverifikasi • Batam Center</span>
                                    </div>
                                    <p className="text-[11px] text-stone-400 mt-0.5">Event Komunitas Pekan Ini</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Pendaftaran Dibuka
                            </span>
                        </div>

                        <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
                                Public Cupping Geisha & Typica: Dari Panama Boquete Hingga Aceh Pegasing
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                                Terbuka untuk umum penikmat kopi, home brewer, dan barista. Kami menyajikan 10 sample kopi kaliber kompetisi internasional bersama certified cuppers. Disediakan cupping spoon dan form evaluasi standar SCA.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200 text-xs">
                            <div className="flex items-center gap-2 text-stone-700">
                                <Calendar className="h-4 w-4 text-amber-900 shrink-0" />
                                <span>Sabtu, 18 Mei • 15:00 WIB</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-700">
                                <MapPin className="h-4 w-4 text-amber-900 shrink-0" />
                                <span>Tanamera Batam Center (One Batam Mall)</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                <Users className="h-4 w-4 shrink-0" />
                                <span>Sisa 8 Kursi dari 25 Kuota</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700">Gratis / Free RSVP Komunitas</span>
                            <div className="flex items-center gap-2">
                                <button type="button" className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50">
                                    Rincian Sesi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onCuppingRSVP && onCuppingRSVP()}
                                    className="px-5 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition shadow-xs"
                                >
                                    Reservasi Tempat
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT: SIDEBAR WIDGETS (col-span-4) */}
                <div className="lg:col-span-4 space-y-5">
                    
                    {/* WIDGET 1: EVENT & MEETUP MENDATANG */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-amber-900" />
                                Event & Meetup Mendatang
                            </h4>
                            <a href="#events" className="text-xs font-bold text-[#56311F] hover:underline">
                                Lihat Semua
                            </a>
                        </div>

                        <div className="space-y-3">
                            {upcomingEvents.map((evt, idx) => (
                                <div key={idx} className="p-3 rounded-2xl border border-stone-100 bg-[#FAF8F5] space-y-2">
                                    <div className="flex items-center justify-between gap-1">
                                        <span className="text-[10px] font-bold text-stone-500">{evt.date}</span>
                                        <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                                            evt.badgeColor === 'emerald'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : evt.badgeColor === 'amber'
                                                ? 'bg-amber-100 text-amber-900'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {evt.badge}
                                        </span>
                                    </div>
                                    <h5 className="text-xs font-bold text-stone-900 leading-snug">{evt.title}</h5>
                                    <p className="text-[11px] text-stone-500">{evt.location}</p>
                                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                                        <span className="text-[11px] font-extrabold text-[#56311F]">{evt.price}</span>
                                        <button
                                            type="button"
                                            onClick={() => alert(`Membuka pendaftaran: ${evt.title}`)}
                                            className="px-2.5 py-1 rounded-lg bg-[#56311F] text-white text-[10px] font-bold hover:bg-[#432516] transition"
                                        >
                                            Daftar Slot
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WIDGET 2: TOP KONTRIBUTOR MINGGU INI */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-stone-900">
                                Top Kontributor Minggu Ini
                            </h4>
                            <span className="text-xs font-bold text-[#56311F] hover:underline cursor-pointer">
                                Leaderboard
                            </span>
                        </div>

                        <div className="space-y-3">
                            {topContributors.map((c) => (
                                <div key={c.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 text-[#56311F] flex items-center justify-center font-bold text-xs">
                                            {c.initials}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-stone-900">{c.name}</div>
                                            <div className="text-[10px] text-stone-400">{c.role}</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.currentTarget.textContent = 'Diikuti ✓';
                                            e.currentTarget.className = 'px-3 py-1 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs';
                                        }}
                                        className="px-3 py-1 rounded-xl border border-stone-200 bg-white font-bold text-xs text-stone-700 hover:bg-stone-50 transition"
                                    >
                                        Ikuti
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WIDGET 3: TRENDING ORIGIN & BIJI KOPI */}
                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs space-y-3">
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-amber-900" />
                            Trending Origin & Biji Kopi
                        </h4>

                        <div className="space-y-2.5">
                            {trendingOrigins.map((origin) => (
                                <a
                                    key={origin.tag}
                                    href="#origin"
                                    className="p-2.5 rounded-xl border border-stone-100 bg-[#FAF8F5] block hover:border-amber-300 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#56311F]">{origin.tag}</span>
                                        <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
                                    </div>
                                    <p className="text-[10px] text-stone-500 mt-0.5">{origin.meta}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* WIDGET 4: PRINSIP KOMUNITAS CAFEFINDER */}
                    <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs space-y-2 text-xs">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-amber-900" />
                            Prinsip Komunitas CafeFinder
                        </h4>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                            Semua ulasan didorong berbasis kejujuran sensorik dan bebas promosi tersembunyi. Mari jaga budaya berdiskusi yang hangat, objektif, dan saling mengedukasi.
                        </p>
                        <a href="#etika" className="text-[11px] font-bold text-[#56311F] hover:underline block pt-1">
                            Baca Panduan Etika Seduh & Cupping →
                        </a>
                    </div>

                </div>

            </div>

        </div>
    );
}

