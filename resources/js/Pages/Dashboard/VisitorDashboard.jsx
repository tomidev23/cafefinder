import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Coffee, Search, MapPin, Bell, Plus, QrCode, Sparkles, CheckCircle2,
    Calendar, Receipt, HandMetal, Heart, Star, Wifi, Zap, Share2, Gift,
    ChevronRight, ArrowRight, ThumbsUp, MessageSquare, X, ShieldCheck,
    Volume2, Award, Compass, Armchair, Clock, UserCheck, LogOut, User
} from 'lucide-react';

import OrderModal from './Visitor/OrderModal';
import ReservationModal from './Visitor/ReservationModal';
import ReceiptModal from './Visitor/ReceiptModal';
import VoucherModal from './Visitor/VoucherModal';
import BeansModal from './Visitor/BeansModal';
import SeatingModal from './Visitor/SeatingModal';
import CuppingModal from './Visitor/CuppingModal';
import Footer from '@/Components/Footer';

export default function VisitorDashboard() {
    const { auth } = usePage().props || {};
    const userName = auth?.user?.name || 'Dimas Pratama';

    // Modals state
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedOrderCafe, setSelectedOrderCafe] = useState(null);
    const [reservationModalOpen, setReservationModalOpen] = useState(false);
    const [selectedReservationCafe, setSelectedReservationCafe] = useState(null);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [voucherModalOpen, setVoucherModalOpen] = useState(false);
    const [beansModalOpen, setBeansModalOpen] = useState(false);
    const [seatingModalOpen, setSeatingModalOpen] = useState(false);
    const [cuppingModalOpen, setCuppingModalOpen] = useState(false);

    // Active live order state
    const [liveOrder, setLiveOrder] = useState({
        cafeName: 'Tanamera Artisanal Roastery',
        location: 'Menteng, Jakarta Pusat',
        tableNumber: '4',
        ticketCode: '#TMH-0492',
        customerName: userName,
        primaryItem: 'V60 Pour Over — Aceh Gayo Natural Process',
        itemCategory: 'Single Origin Manual Brew',
        temp: 'Hot • 250ml',
        tastingNotes: 'Tasting: Citrus, Dark Plum, Brown Sugar | Barista: Reza M.',
        barista: 'Reza M.',
        brewStep: 'Sedang Diseduh (Tahap Pour Kedua)',
        progressPercent: 75,
        estimatedMinutes: 4,
        paymentStatus: 'Pembayaran Lunas via QRIS CafeFinder',
        items: [
            { name: 'V60 Pour Over — Aceh Gayo Natural', qty: 1, price: 45000, note: 'Hot • 250ml' },
        ],
        subtotal: 45000,
        discount: 6750,
        tax: 3825,
        total: 42075,
        paymentMethod: 'QRIS CafeFinder',
        time: 'Hari ini, 09:42 WIB',
        authCode: 'AUTH-QRIS-982341-CF',
    });

    // Passport stamps state
    const [stamps, setStamps] = useState([
        { id: 1, name: 'Crematology', stamped: true },
        { id: 2, name: 'Tanamera', stamped: true },
        { id: 3, name: 'Pigeonhole', stamped: true },
        { id: 4, name: 'Giyanti', stamped: true },
        { id: 5, name: 'Dua Coffee', stamped: true },
        { id: 6, name: 'Common Gr.', stamped: true },
        { id: 7, name: 'Anomali', stamped: true },
        { id: 8, name: 'Gratis Cup!', stamped: false, isReward: true },
    ]);

    // Cafe Filter state
    const [activeFilter, setActiveFilter] = useState('buka');

    // Favorites state
    const [favorites, setFavorites] = useState({
        pigeonhole: true,
        onefifteen: true,
        giyanti: true,
    });

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Review like counter
    const [helpfulCount, setHelpfulCount] = useState(38);
    const [hasVotedHelpful, setHasVotedHelpful] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const handleHelpfulClick = () => {
        if (!hasVotedHelpful) {
            setHelpfulCount(c => c + 1);
            setHasVotedHelpful(true);
        } else {
            setHelpfulCount(c => c - 1);
            setHasVotedHelpful(false);
        }
    };

    // Toast notification state
    const [showBaristaToast, setShowBaristaToast] = useState(true);
    const [baristaCallNotification, setBaristaCallNotification] = useState(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const handleCallBarista = () => {
        setBaristaCallNotification('Barista Reza M. telah menerima notifikasi dan sedang menuju Meja #4 (Est. 1-2 menit)');
        setTimeout(() => {
            setBaristaCallNotification(null);
        }, 5000);
    };

    const handleOrderComplete = (newOrder) => {
        setLiveOrder({
            ...newOrder,
            customerName: userName,
            brewStep: 'Sedang Diseduh (Tahap Pour Pertama)',
            progressPercent: 35,
            paymentStatus: `Pembayaran Lunas via ${newOrder.paymentMethod}`,
            time: `Hari ini, ${newOrder.orderTime} WIB`,
            authCode: `AUTH-CF-${Math.floor(100000 + Math.random() * 900000)}`,
        });
        setShowBaristaToast(true);
    };

    const handleReservationComplete = (reservation) => {
        setBaristaCallNotification(`Reservasi di ${reservation.cafeName} berhasil dikonfirmasi! Kode Etiket: ${reservation.code}`);
        setTimeout(() => {
            setBaristaCallNotification(null);
        }, 6000);
    };

    const cafes = [
        {
            id: 'pigeonhole',
            name: 'Pigeonhole Coffee',
            area: '1.4 km • Bintaro Sektor 1',
            rating: '4.8',
            style: 'Nordic Roasting Style • Pastry Artisan',
            tags: ['Colokan Melimpah', '120 Mbps WiFi', 'Tenang (WFC)'],
            status: 'buka',
            statusLabel: 'Buka Sekarang',
            image: '',
            hasWfc: true,
            isOpen: true,
            canOrderNow: true,
        },
        {
            id: 'onefifteen',
            name: '1/15 Coffee',
            area: '3.2 km • Senopati, Jaksel',
            rating: '4.9',
            style: 'Filter Pioneers • Brunch Menu',
            tags: ['Ruang Luar Asri', 'Parkir Luas'],
            seatsAlert: 'Sisa 2 Meja Kosong',
            status: 'buka',
            statusLabel: 'Buka Sekarang',
            image: '',
            hasWfc: true,
            isOpen: true,
            canOrderNow: true,
        },
        {
            id: 'giyanti',
            name: 'Giyanti Coffee Roastery',
            area: '2.1 km • Jl. Surabaya, Menteng',
            rating: '4.9',
            style: 'Direct Trade Beans • Secret Courtyard',
            tags: ['Pet-Friendly Outdoor', 'Apple Pie Legend', 'Suasana Tropis'],
            status: 'tutup',
            statusLabel: 'Tutup • Buka 10.00',
            image: '',
            hasWfc: false,
            isOpen: false,
            canOrderNow: false,
        },
    ];

    const filteredCafes = cafes.filter(cafe => {
        if (activeFilter === 'buka') return cafe.isOpen;
        if (activeFilter === 'wfc') return cafe.hasWfc;
        return true;
    });

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#FBF9F6] text-[#2B1B12] font-sans antialiased selection:bg-[#56311F] selection:text-white pb-16">
            <Head title="CafeFinder — Visitor Orders & Reservasi Meja" />

            <header className="sticky top-0 z-40 w-full border-b border-[#EFEAE3] bg-white/95 backdrop-blur-md">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-3">

                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <img src="/img/logo/logoamber.svg" alt="logo CafeFinder" className="h-13 w-13" />
                            </Link>

                            <div className="relative hidden md:flex items-center w-64 lg:w-80">
                                <Search className="absolute left-3.5 h-4 w-4 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kafe, single-origin beans, spot kerja"
                                    className="w-full rounded-full border border-stone-200 bg-stone-50/80 pl-10 pr-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#56311F] focus:bg-white focus:outline-none focus:ring-0 transition"
                                />
                            </div>
                        </div>

                        <nav className="hidden lg:flex items-center gap-7 text-sm">
                            <a href="#discovery" className="font-medium text-stone-600 hover:text-stone-950 transition">Discovery</a>
                            <a href="#leaderboard" className="font-medium text-stone-600 hover:text-stone-950 transition">Leaderboard</a>
                            <a href="#promoted" className="font-medium text-stone-600 hover:text-stone-950 transition">Promoted</a>
                            <div className="relative py-2">
                                <span className="font-bold text-[#56311F] cursor-pointer">Orders</span>
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#56311F] rounded-full" />
                            </div>
                            <a href="#community" className="font-medium text-stone-600 hover:text-stone-950 transition">Community</a>
                            <button type="button" title="Ganti Lokasi" className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition">
                                <MapPin className="h-4 w-4" />
                            </button>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setVoucherModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-full bg-[#F6EFE6] px-3.5 py-1.5 text-xs font-bold text-[#56311F] border border-[#E9DCCF] hover:bg-[#EFE5D9] transition"
                            >
                                <div className="h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white">CP</div>
                                <span>42,500 CP</span>
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => handleCallBarista()}
                                    className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition relative"
                                    title="Notifikasi"
                                >
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600 ring-2 ring-white" />
                                </button>
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 hover:bg-stone-100/70 transition"
                                >
                                    <div className="h-8 w-8 rounded-full bg-linear-to-tr from-[#56311F] to-amber-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                                        DP
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <div className="text-xs font-bold leading-none text-stone-900">{userName}</div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-medium text-stone-500">Roastery Connoisseur</span>
                                        </div>
                                    </div>
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-stone-200 bg-white py-2 shadow-xl z-50">
                                        <div className="px-4 py-2 border-b border-stone-100">
                                            <p className="text-xs font-bold text-stone-900">{userName}</p>
                                            <p className="text-[11px] text-stone-500 truncate">{auth?.user?.email || 'dimas@example.com'}</p>
                                        </div>
                                        <Link href={route('profile.edit')} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50">
                                            <User className="h-3.5 w-3.5" /> Pengaturan Profil
                                        </Link>
                                        <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left">
                                            <LogOut className="h-3.5 w-3.5" /> Keluar Akun
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {baristaCallNotification && (
                <div className="bg-amber-500 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-16 z-30 shadow-sm flex items-center justify-center gap-2">
                    <UserCheck className="h-4 w-4 shrink-0" />
                    <span>{baristaCallNotification}</span>
                </div>
            )}

  
            <main className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

                <section className="rounded-3xl border border-[#EFEAE3] bg-white p-6 lg:p-7 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl">

                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                                Selamat Pagi, {userName.split(' ')[0]}! Siap Menemukan Seduhan Kopi Terbaik Hari Ini?
                            </h1>
                            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                                Aroma biji sangrai segar menunggumu. Pesanan meja aktifmu sedang dalam tahap akhir ekstraksi di {liveOrder.cafeName}.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                            <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                                <span className="self-start px-2 py-0.5 rounded-md bg-amber-100 text-[10px] font-extrabold text-amber-900">LVL 3</span>
                                <div className="mt-3">
                                    <span className="text-[10px] text-stone-400 block font-medium">Pangkat Explorer</span>
                                    <h4 className="text-xs font-bold text-stone-900 mt-0.5 leading-snug">Roastery Connoisseur</h4>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                                <span className="self-start px-2 py-0.5 rounded-md bg-emerald-100 text-[10px] font-extrabold text-emerald-800">+1 Lagi!</span>
                                <div className="mt-3">
                                    <span className="text-[10px] text-stone-400 block font-medium">Stempel Kartu</span>
                                    <h4 className="text-sm font-extrabold text-stone-900 mt-0.5">7 / 8 Stamp</h4>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                                <span className="self-start px-2 py-0.5 rounded-md bg-orange-100 text-[10px] font-extrabold text-orange-800">QRIS</span>
                                <div className="mt-3">
                                    <span className="text-[10px] text-stone-400 block font-medium">Saldo CafePoints</span>
                                    <h4 className="text-sm font-extrabold text-stone-900 mt-0.5">Rp 42.500</h4>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3.5 flex flex-col justify-between">
                                <span className="self-start px-2 py-0.5 rounded-md bg-stone-200 text-[10px] font-extrabold text-stone-700">4 Kota</span>
                                <div className="mt-3">
                                    <span className="text-[10px] text-stone-400 block font-medium">Kafe Dikunjungi</span>
                                    <h4 className="text-sm font-extrabold text-stone-900 mt-0.5">24 Kafe</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 rounded-3xl border border-[#EFEAE3] bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
                        <div>
                            <div className="flex items-center justify-between pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">LIVE ORDER SEDANG BERJALAN</span>
                                </div>
                                <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold text-stone-600 border border-stone-200">{liveOrder.location}</span>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mt-1">Meja #{liveOrder.tableNumber} • {liveOrder.cafeName}</h3>
                        </div>

                        <div className="rounded-2xl border border-[#EFE9E2] bg-[#FDFBF9] p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">{liveOrder.itemCategory}</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-700 text-[11px] font-medium">{liveOrder.temp}</span>
                                </div>
                                <div>
                                    <h4 className="text-base font-extrabold text-stone-900 leading-snug">{liveOrder.primaryItem}</h4>
                                    <p className="text-xs text-stone-500 mt-1">{liveOrder.tastingNotes}</p>
                                </div>
                                <div className="pt-2 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-[#56311F] flex items-center gap-1.5">
                                            <Coffee className="h-3.5 w-3.5 text-amber-800" />
                                            {liveOrder.brewStep}
                                        </span>
                                        <span className="text-stone-500 font-medium">Estimasi: {liveOrder.estimatedMinutes} Menit</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                                        <div className="h-full rounded-full bg-linear-to-r from-amber-700 to-[#56311F] transition-all duration-700" style={{ width: `${liveOrder.progressPercent}%` }} />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:border-l sm:border-stone-200 sm:pl-4 flex flex-col items-center justify-center text-center shrink-0">
                                <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs mb-2">
                                    <QrCode className="h-16 w-16 text-stone-800" />
                                </div>
                                <span className="text-xs font-bold text-stone-900 font-mono tracking-tight">ETIKET {liveOrder.ticketCode}</span>
                                <span className="text-[10px] text-stone-400 mt-0.5">Tunjukkan ke barista meja</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => setReceiptModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 hover:border-stone-300 transition">
                                    <Receipt className="h-3.5 w-3.5 text-stone-500" /> Lihat Struk Digital
                                </button>
                                <button type="button" onClick={handleCallBarista} className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 hover:border-stone-300 transition">
                                    <HandMetal className="h-3.5 w-3.5 text-stone-500" /> Panggil Barista / Bantuan
                                </button>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>{liveOrder.paymentStatus}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 rounded-3xl border border-[#EFEAE3] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                    <img src="/img/logo/logoamber.svg" alt="logo CafeFinder" className="h-10 w-10" />
                                    Paspor Kopi Digital
                                </h3>
                                <button type="button" onClick={() => setVoucherModalOpen(true)} className="text-xs font-bold text-[#56311F] hover:underline flex items-center gap-0.5">
                                    Riwayat Stamp <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                                Kumpulkan 8 cap di kafe partner untuk menikmati <span className="font-bold text-stone-800">1 Cup Manual Brew Gratis</span> pilihanmu.
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-2.5 py-1">
                            {stamps.map((s) => (
                                <div key={s.id} className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition ${s.isReward ? 'border-2 border-dashed border-amber-400 bg-amber-50/50 text-[#56311F]' : s.stamped ? 'border border-[#EFE9E2] bg-[#FAF8F5] text-stone-800' : 'border border-stone-200 bg-stone-50 text-stone-400'}`}>
                                    {s.stamped ? (
                                        <>
                                            <div className="relative mb-1">
                                                <div className="h-8 w-8 rounded-full bg-[#56311F] text-amber-100 flex items-center justify-center shadow-2xs"><Coffee className="h-4 w-4" /></div>
                                                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                                            </div>
                                            <span className="text-[10px] font-bold tracking-tight truncate w-full">{s.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative mb-1">
                                                <div className="h-8 w-8 rounded-full bg-amber-100/70 text-[#56311F] flex items-center justify-center"><Gift className="h-4 w-4 text-[#56311F]" /></div>
                                                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#56311F] text-white flex items-center justify-center text-[9px] font-bold">8</span>
                                            </div>
                                            <span className="text-[10px] font-bold tracking-tight text-[#56311F] truncate w-full">{s.name}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <span className="text-xs text-stone-500 font-medium">Tinggal 1 kunjungan lagi untuk klaim reward!</span>
                            <button type="button" onClick={() => setVoucherModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#56311F] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#432516] transition active:scale-[0.99]">
                                <Gift className="h-3.5 w-3.5" /> Tukarkan Voucher
                            </button>
                        </div>
                    </div>
                </div>

                <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Koleksi Kedai Pilihan Saya</h2>
                            <p className="text-xs text-stone-500 mt-0.5">Kafe favorit tersimpan dengan status operasional & ketersediaan fasilitas real-time.</p>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            <button type="button" onClick={() => setActiveFilter('semua')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${activeFilter === 'semua' ? 'bg-[#56311F] text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Semua (12)</button>
                            <button type="button" onClick={() => setActiveFilter('buka')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${activeFilter === 'buka' ? 'bg-[#56311F] text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Buka Sekarang (8)</button>
                            <button type="button" onClick={() => setActiveFilter('wfc')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${activeFilter === 'wfc' ? 'bg-[#56311F] text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Banyak Colokan / WFC (6)</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredCafes.map((cafe) => (
                            <div key={cafe.id} className="rounded-3xl border border-[#EFEAE3] bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                                <div>
                                    <div className="relative h-48 w-full bg-stone-200 overflow-hidden">
                                        <img src={cafe.image} alt={cafe.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                                        <div className="absolute top-3 left-3">
                                            {cafe.isOpen ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> {cafe.statusLabel}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">{cafe.statusLabel}</span>
                                            )}
                                        </div>
                                        <button type="button" onClick={() => toggleFavorite(cafe.id)} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 shadow-xs hover:bg-white transition" title="Favorit">
                                            <Heart className={`h-4 w-4 ${favorites[cafe.id] ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <span className="text-[11px] font-semibold text-stone-500 block">{cafe.area}</span>
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-base font-bold text-stone-900">{cafe.name}</h3>
                                            <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                <span>{cafe.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-stone-500 font-medium">{cafe.style}</p>
                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {cafe.tags.map((tag) => (
                                                <span key={tag} className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-[11px] font-medium text-stone-600">{tag}</span>
                                            ))}
                                            {cafe.seatsAlert && (
                                                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">{cafe.seatsAlert}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 pt-0 flex items-center gap-2">
                                    {cafe.canOrderNow ? (
                                        <button type="button" onClick={() => { setSelectedOrderCafe(cafe); setOrderModalOpen(true); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#56311F] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#432516] transition active:scale-[0.99]">
                                            <QrCode className="h-3.5 w-3.5" /> Pesan Meja / QRIS
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => { setSelectedReservationCafe(cafe); setReservationModalOpen(true); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:border-stone-400 transition">
                                            <Calendar className="h-3.5 w-3.5 text-stone-500" /> Reservasi Meja Nanti
                                        </button>
                                    )}
                                    <button type="button" title="Bagikan atau Opsi Lainnya" className="h-9 w-9 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:bg-stone-50 transition shrink-0">
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                        <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/60">
                            </span>
                            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Dipilihkan Khusus Berdasarkan Selera Seduh Anda</h2>
                            <p className="text-xs text-stone-500">Kamu menyukai profil rasa buah-buahan asam manis dan suasana kedai tenang untuk membaca.</p>
                        </div>
                        <span className="text-[11px] font-medium text-stone-400">Disesuaikan dari 18 pesanan terakhir</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 text-[10px] font-bold">Biji Sangrai Langka</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Diskon 15% QRIS Member</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="h-14 w-14 rounded-2xl bg-[#F6EFE6] border border-[#E8DEC8] flex items-center justify-center text-[#56311F] shrink-0"><Coffee className="h-7 w-7" /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-stone-900 leading-snug">Flores Bajawa Anaerobic</h3>
                                        <p className="text-xs text-stone-500">Roastery: Mika Coffee Lab</p>
                                        <p className="text-[11px] text-stone-400 mt-0.5">Notes: Strawberry, Winey, Cacao</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-extrabold text-[#56311F]">Rp 110.500</span>
                                    <span className="text-xs line-through text-stone-400 ml-1.5">Rp 130.000</span>
                                </div>
                                <button type="button" onClick={() => setBeansModalOpen(true)} className="px-4 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition">Beli Beans</button>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Spot WFC Hening</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">850m dari lokasimu</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0"><Armchair className="h-7 w-7" /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-stone-900 leading-snug">Work Coffee Menteng</h3>
                                        <p className="text-xs text-stone-500">Ergonomic chairs & Quiet Booths</p>
                                        <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Free 1 Jam Private Meeting Pod</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                <span className="text-xs text-stone-500 font-medium">Tingkat keramaian: <span className="font-bold text-emerald-700">Tenang</span></span>
                                <button type="button" onClick={() => setSeatingModalOpen(true)} className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition">Cek Kursi</button>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 text-[10px] font-bold">Cupping Session</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">Sabtu ini, 14:00</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0"><Award className="h-7 w-7" /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-stone-900 leading-snug">Tasting Flight: Geisha vs Typica</h3>
                                        <p className="text-xs text-stone-500">Bersama Q-Grader Ari Widodo</p>
                                        <p className="text-[11px] text-amber-800 font-bold mt-0.5">Tersisa 3 Kursi VIP</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-extrabold text-[#56311F]">Rp 85.000</span>
                                    <span className="text-xs text-stone-400"> / pax</span>
                                </div>
                                <button type="button" onClick={() => setCuppingModalOpen(true)} className="px-4 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white hover:bg-[#432516] transition">Daftar Sesi</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Riwayat Eksplorasi & Ulasan Terbaru Anda</h2>
                            <p className="text-xs text-stone-500 mt-0.5">Catatan rasa dan impresi seduhan yang Anda bagikan untuk komunitas pencinta kopi.</p>
                        </div>
                        <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-[#56311F] hover:underline">
                            Lihat Semua Ulasan (24) <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row gap-5 items-start">
                        <div className="h-44 w-full md:w-56 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                            <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80" alt="Crematology Coffee Latte Art" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-stone-900">Crematology Coffee Roasters — Senopati</h3>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                        <CheckCircle2 className="h-3 w-3" /> Ulasan Terverifikasi QRIS
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5 text-amber-500 text-sm">
                                    {'★★★★★'}
                                    <span className="font-bold text-xs text-stone-900 ml-1">5.0</span>
                                </div>
                            </div>
                            <p className="text-xs text-stone-400">Dikunjungi 2 hari yang lalu • Menu: Piccolo Latte & Ethiopian Yirgacheffe Pour Over</p>
                            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/70">
                                “Salah satu seduhan Ethiopia terbersih yang pernah saya coba di Jakarta Selatan. Rasio air dan suhu ekstraksi sangat presisi, acidity seperti buah persik matang dengan aftertaste floral jasmine yang sangat panjang. Barista sangat ramah saat diajak diskusi kalibrasi gilingan.”
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-xs font-bold text-stone-600">Tasting Profile:</span>
                                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">Floral Jasmine</span>
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">Citrus Lemon</span>
                                <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-900 border border-orange-200 text-xs font-semibold">Brown Sugar Sweetness</span>
                            </div>
                            <div className="pt-2 flex items-center gap-4 text-xs text-stone-500">
                                <button type="button" onClick={handleHelpfulClick} className={`inline-flex items-center gap-1.5 transition ${hasVotedHelpful ? 'text-[#56311F] font-bold' : 'hover:text-stone-900'}`}>
                                    <ThumbsUp className={`h-3.5 w-3.5 ${hasVotedHelpful ? 'fill-[#56311F]' : ''}`} />
                                    <span>{helpfulCount} Membantu</span>
                                </button>
                                <button type="button" onClick={() => setShowComments(!showComments)} className="inline-flex items-center gap-1.5 hover:text-stone-900 transition">
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
            </main>

            {showBaristaToast && (
                <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-2xl border border-stone-200 bg-white p-4 shadow-xl transition-all duration-300 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F6EFE6] text-[#56311F] flex items-center justify-center shrink-0">
                        <img src="/img/logo/logoamber.svg" alt="logo CafeFinder" className="h-10 w-10 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div className="space-y-0.5 flex-1 pr-2">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">Barista Meja 4 Sedang Menggiling Biji</h4>
                        <p className="text-[11px] text-stone-500">V60 Aceh Gayo siap dihidangkan sebentar lagi.</p>
                    </div>
                    <button type="button" onClick={() => setShowBaristaToast(false)} className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

         
   <Footer/>
            <OrderModal isOpen={orderModalOpen} cafe={selectedOrderCafe} onClose={() => setOrderModalOpen(false)} onOrderComplete={handleOrderComplete} />
            <ReservationModal isOpen={reservationModalOpen} cafe={selectedReservationCafe} onClose={() => setReservationModalOpen(false)} onReservationComplete={handleReservationComplete} />
            <ReceiptModal isOpen={receiptModalOpen} order={liveOrder} onClose={() => setReceiptModalOpen(false)} />
            <VoucherModal isOpen={voucherModalOpen} stampsCount={stamps.filter(s => s.stamped).length} onClose={() => setVoucherModalOpen(false)} />
            <BeansModal isOpen={beansModalOpen} onClose={() => setBeansModalOpen(false)} />
            <SeatingModal isOpen={seatingModalOpen} onClose={() => setSeatingModalOpen(false)} />
            <CuppingModal isOpen={cuppingModalOpen} onClose={() => setCuppingModalOpen(false)} />
        </div>
        
    );
    
}