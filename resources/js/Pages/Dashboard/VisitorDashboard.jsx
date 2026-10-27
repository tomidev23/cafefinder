import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Coffee,
    Search,
    MapPin,
    Bell,
    Plus,
    X,
    User,
    LogOut,
    UserCheck,
    Compass,
    Trophy,
    Tag,
    Users,
    Receipt
} from 'lucide-react';

import OrdersView from './Visitor/Views/OrdersView';
import DiscoveryView from './Visitor/Views/DiscoveryView';
import LeaderboardView from './Visitor/Views/LeaderboardView';
import PromotedView from './Visitor/Views/PromotedView';
import CommunityView from './Visitor/Views/CommunityView';

import OrderModal from './Visitor/OrderModal';
import ReservationModal from './Visitor/ReservationModal';
import ReceiptModal from './Visitor/ReceiptModal';
import VoucherModal from './Visitor/VoucherModal';
import BeansModal from './Visitor/BeansModal';
import SeatingModal from './Visitor/SeatingModal';
import CuppingModal from './Visitor/CuppingModal';

import {
    visitorCafes,
    visitorStamps,
    defaultLiveOrder,
    latestVerifiedReview,
} from '@/data/cafes';

export default function VisitorDashboard({ initialTab = 'orders' }) {
    const { auth } = usePage().props || {};
    const userName = auth?.user?.name || 'Dimas Pratama';

    // Active Tab State: 'discovery' | 'leaderboard' | 'promoted' | 'orders' | 'community'
    const [activeTab, setActiveTab] = useState(initialTab);

    // Sync tab with URL search parameter if present
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam && ['discovery', 'leaderboard', 'promoted', 'orders', 'community'].includes(tabParam)) {
                setActiveTab(tabParam);
            }
        }
    }, []);

    const changeTab = (tab) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined' && window.history) {
            const url = new URL(window.location);
            url.searchParams.set('tab', tab);
            window.history.pushState({}, '', url);
        }
    };

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
        ...defaultLiveOrder,
        customerName: userName,
    });

    // Passport stamps
    const [stamps, setStamps] = useState(visitorStamps);

    // Cafe Filter in Orders Tab
    const [activeOrderFilter, setActiveOrderFilter] = useState('buka');

    // Favorites state
    const [favorites, setFavorites] = useState({
        'common-grounds': true,
        'tanamera-batam': true,
        'manner-coffee': true,
    });

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Review like counter
    const [helpfulCount, setHelpfulCount] = useState(latestVerifiedReview.helpfulCount || 38);
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

    // Profile dropdown
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // Call Barista Action
    const handleCallBarista = () => {
        setBaristaCallNotification(`Barista ${liveOrder.barista || 'Reza M.'} telah menerima notifikasi dan sedang menuju Meja #${liveOrder.tableNumber} (Est. 1-2 menit)`);
        setTimeout(() => {
            setBaristaCallNotification(null);
        }, 5000);
    };

    // Handler when order is submitted from OrderModal
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

    const handleOpenOrderWithCafe = (cafe) => {
        setSelectedOrderCafe(cafe);
        setOrderModalOpen(true);
    };

    const handleOpenReservationWithCafe = (cafe) => {
        setSelectedReservationCafe(cafe);
        setReservationModalOpen(true);
    };

    const handleReservationComplete = (reservation) => {
        setBaristaCallNotification(`Reservasi di ${reservation.cafeName} berhasil dikonfirmasi! Kode Etiket: ${reservation.code}`);
        setTimeout(() => {
            setBaristaCallNotification(null);
        }, 6000);
    };

    // Cafe Cards Data for Orders Tab sourced from cafes.js
    const cafes = visitorCafes;

    const filteredCafes = cafes.filter(cafe => {
        if (activeOrderFilter === 'buka') return cafe.isOpen;
        if (activeOrderFilter === 'wfc') return cafe.hasWfc;
        return true;
    });

    // Dynamic Search Placeholder
    const searchPlaceholders = {
        discovery: 'Batam Center, WFC Hening, Single Origin...',
        leaderboard: 'Cari roastery, beans, lokasi di Batam...',
        promoted: 'Cari promo, diskon mitra, free brew...',
        orders: 'Cari kafe, single-origin beans, spot kerja...',
        community: 'Cari seduhan, roastery, atau resep...',
    };

    // Page titles
    const tabTitles = {
        discovery: 'Discovery — Eksplorasi 48 Kafe Artisanal',
        leaderboard: 'Leaderboard — Peringkat Kedai Kopi Terbaik Pekan Ini',
        promoted: 'Promoted — Penawaran Eksklusif Mitra Roastery',
        orders: 'Orders — Live Order & Reservasi Meja',
        community: 'Community — Komunitas Penikmat & Penggiat Kopi',
    };

    return (
        <div className="min-h-screen bg-[#FBF9F6] text-[#2B1B12] font-sans antialiased selection:bg-[#56311F] selection:text-white pb-16">
            <Head title={`CafeFinder — ${tabTitles[activeTab] || 'Portal'}`} />

            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-40 w-full border-b border-[#EFEAE3] bg-white/95 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-3">
                        
                        {/* Brand Logo */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-[#56311F] flex items-center justify-center text-white shadow-xs">
                                    <Coffee className="h-5 w-5" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-[#3A1E11]">
                                    CafeFinder
                                </span>
                            </Link>

                            {/* Search bar adapting to active tab */}
                            <div className="relative hidden md:flex items-center w-64 lg:w-80">
                                <Search className="absolute left-3.5 h-4 w-4 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholders[activeTab] || 'Cari di CafeFinder...'}
                                    className="w-full rounded-full border border-stone-200 bg-stone-50/80 pl-10 pr-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#56311F] focus:bg-white focus:outline-none focus:ring-0 transition"
                                />
                            </div>
                        </div>

                        {/* Navigation Links with Active Tab Underline */}
                        <nav className="hidden lg:flex items-center gap-7 text-sm">
                            <button
                                type="button"
                                onClick={() => changeTab('discovery')}
                                className={`relative py-2 font-medium transition ${
                                    activeTab === 'discovery'
                                        ? 'font-bold text-[#56311F]'
                                        : 'text-stone-600 hover:text-stone-950'
                                }`}
                            >
                                Discovery
                                {activeTab === 'discovery' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#56311F] rounded-full" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => changeTab('leaderboard')}
                                className={`relative py-2 font-medium transition flex items-center gap-1.5 ${
                                    activeTab === 'leaderboard'
                                        ? 'font-bold text-[#56311F]'
                                        : 'text-stone-600 hover:text-stone-950'
                                }`}
                            >
                                <Trophy className={`h-4 w-4 ${activeTab === 'leaderboard' ? 'text-amber-700' : 'text-stone-400'}`} />
                                Leaderboard
                                {activeTab === 'leaderboard' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#56311F] rounded-full" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => changeTab('promoted')}
                                className={`relative py-2 font-medium transition ${
                                    activeTab === 'promoted'
                                        ? 'font-bold text-[#56311F]'
                                        : 'text-stone-600 hover:text-stone-950'
                                }`}
                            >
                                Promoted
                                {activeTab === 'promoted' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#56311F] rounded-full" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => changeTab('orders')}
                                className={`relative py-2 font-medium transition ${
                                    activeTab === 'orders'
                                        ? 'font-bold text-[#56311F]'
                                        : 'text-stone-600 hover:text-stone-950'
                                }`}
                            >
                                Orders
                                {activeTab === 'orders' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#56311F] rounded-full" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => changeTab('community')}
                                className={`relative py-2 font-medium transition ${
                                    activeTab === 'community'
                                        ? 'font-bold text-[#56311F]'
                                        : 'text-stone-600 hover:text-stone-950'
                                }`}
                            >
                                Community
                                {activeTab === 'community' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#56311F] rounded-full" />
                                )}
                            </button>

                            <button
                                type="button"
                                title="Lokasi Saat Ini: Batam Center"
                                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                            >
                                <MapPin className="h-4 w-4" />
                            </button>
                        </nav>

                        {/* Right Actions & Profile */}
                        <div className="flex items-center gap-3">
                            
                            {/* CafePoints Pill */}
                            <button
                                type="button"
                                onClick={() => setVoucherModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-full bg-[#F6EFE6] px-3.5 py-1.5 text-xs font-bold text-[#56311F] border border-[#E9DCCF] hover:bg-[#EFE5D9] transition"
                            >
                                <div className="h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white">
                                    CP
                                </div>
                                <span>42,500 CP</span>
                            </button>

                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={handleCallBarista}
                                    className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition relative"
                                    title="Notifikasi"
                                >
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600 ring-2 ring-white" />
                                </button>
                            </div>

                            {/* + Add Cafe */}
                            <button
                                type="button"
                                onClick={() => alert('Pendaftaran listing kafe baru')}
                                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add Cafe</span>
                            </button>

                            {/* User Profile */}
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
                                        <div className="text-xs font-bold leading-none text-stone-900">
                                            {userName}
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-medium text-stone-500">
                                                Roastery Connoisseur
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-stone-200 bg-white py-2 shadow-xl z-50">
                                        <div className="px-4 py-2 border-b border-stone-100">
                                            <p className="text-xs font-bold text-stone-900">{userName}</p>
                                            <p className="text-[11px] text-stone-500 truncate">{auth?.user?.email || 'dimas@example.com'}</p>
                                        </div>
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                                        >
                                            <User className="h-3.5 w-3.5" />
                                            Pengaturan Profil
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                                        >
                                            <LogOut className="h-3.5 w-3.5" />
                                            Keluar Akun
                                        </Link>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* Mobile Tab Bar */}
                    <div className="flex lg:hidden items-center justify-around border-t border-stone-100 py-2 overflow-x-auto text-xs">
                        {['discovery', 'leaderboard', 'promoted', 'orders', 'community'].map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => changeTab(tab)}
                                className={`px-2.5 py-1 rounded-full capitalize font-semibold ${
                                    activeTab === tab ? 'bg-[#56311F] text-white' : 'text-stone-600'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                </div>
            </header>

            {/* Notification Banner when Barista is called */}
            {baristaCallNotification && (
                <div className="bg-amber-500 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-16 z-30 shadow-sm flex items-center justify-center gap-2">
                    <UserCheck className="h-4 w-4 shrink-0" />
                    <span>{baristaCallNotification}</span>
                </div>
            )}

            {/* MAIN DASHBOARD CONTENT (VIEWS SWITCHER) */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
                
                {activeTab === 'discovery' && (
                    <DiscoveryView
                        onOrderCafe={handleOpenOrderWithCafe}
                        onReserveCafe={handleOpenReservationWithCafe}
                    />
                )}

                {activeTab === 'leaderboard' && (
                    <LeaderboardView
                        onOrderCafe={handleOpenOrderWithCafe}
                        onReserveCafe={handleOpenReservationWithCafe}
                    />
                )}

                {activeTab === 'promoted' && (
                    <PromotedView
                        onOrderCafe={handleOpenOrderWithCafe}
                        onReserveCafe={handleOpenReservationWithCafe}
                    />
                )}

                {activeTab === 'orders' && (
                    <OrdersView
                        userName={userName}
                        liveOrder={liveOrder}
                        stamps={stamps}
                        activeFilter={activeOrderFilter}
                        setActiveFilter={setActiveOrderFilter}
                        filteredCafes={filteredCafes}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                        onOpenOrderModal={handleOpenOrderWithCafe}
                        onOpenReservationModal={handleOpenReservationWithCafe}
                        onOpenReceiptModal={() => setReceiptModalOpen(true)}
                        onOpenVoucherModal={() => setVoucherModalOpen(true)}
                        onOpenBeansModal={() => setBeansModalOpen(true)}
                        onOpenSeatingModal={() => setSeatingModalOpen(true)}
                        onOpenCuppingModal={() => setCuppingModalOpen(true)}
                        onCallBarista={handleCallBarista}
                        helpfulCount={helpfulCount}
                        hasVotedHelpful={hasVotedHelpful}
                        onHelpfulClick={handleHelpfulClick}
                        showComments={showComments}
                        setShowComments={setShowComments}
                    />
                )}

                {activeTab === 'community' && (
                    <CommunityView
                        onCuppingRSVP={() => setCuppingModalOpen(true)}
                    />
                )}

            </main>

            {/* FLOATING REAL-TIME TOAST (BOTTOM-RIGHT) */}
            {showBaristaToast && (
                <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-2xl border border-stone-200 bg-white p-4 shadow-xl transition-all duration-300 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F6EFE6] text-[#56311F] flex items-center justify-center shrink-0">
                        <Coffee className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div className="space-y-0.5 flex-1 pr-2">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                            Barista Meja {liveOrder.tableNumber} Sedang Menggiling Biji
                        </h4>
                        <p className="text-[11px] text-stone-500">
                            {liveOrder.primaryItem} di {liveOrder.cafeName} siap dihidangkan sebentar lagi.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowBaristaToast(false)}
                        className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* FOOTER */}
            <footer className="mt-16 border-t border-[#EFEAE3] bg-white pt-12 pb-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-100">
                        
                        {/* Brand Column */}
                        <div className="space-y-3 md:col-span-1">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-lg bg-[#56311F] flex items-center justify-center text-white">
                                    <Coffee className="h-4 w-4" />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-[#3A1E11]">
                                    CafeFinder
                                </span>
                            </div>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                Temukan pengalaman menikmati kopi terbaik di sekitarmu. Dari kedai sangrai mikro tersembunyi hingga ruang kerja kreatif yang tenang.
                            </p>
                        </div>

                        {/* Eksplorasi */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                                Eksplorasi
                            </h4>
                            <ul className="space-y-2 text-xs text-stone-600">
                                <li><a href="#explore" onClick={() => changeTab('discovery')} className="hover:text-stone-950 transition">Explore Cafes</a></li>
                                <li><a href="#leaderboard" onClick={() => changeTab('leaderboard')} className="hover:text-stone-950 transition">Neighborhood Directory & Leaderboard</a></li>
                                <li><a href="#pourover" onClick={() => changeTab('community')} className="hover:text-stone-950 transition">Top Rated Pour Overs</a></li>
                                <li><a href="#quiet" onClick={() => changeTab('discovery')} className="hover:text-stone-950 transition">Quiet Workspaces</a></li>
                            </ul>
                        </div>

                        {/* Kemitraan */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                                Mitra & Barista
                            </h4>
                            <ul className="space-y-2 text-xs text-stone-600">
                                <li><a href="#owners" className="hover:text-stone-950 transition">For Cafe Owners</a></li>
                                <li><a href="#claim" className="hover:text-stone-950 transition">Claim Your Listing</a></li>
                                <li><a href="#merchant" className="hover:text-stone-950 transition">Merchant Portal</a></li>
                                <li><a href="#community" onClick={() => changeTab('community')} className="hover:text-stone-950 transition">Barista Community</a></li>
                            </ul>
                        </div>

                        {/* Aplikasi & Bantuan */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                                Aplikasi & Ketentuan
                            </h4>
                            <ul className="space-y-2 text-xs text-stone-600">
                                <li className="flex items-center gap-1.5"><Compass className="h-3.5 w-3.5 text-stone-400" /><a href="#ios" className="hover:text-stone-950 transition">Download iOS App</a></li>
                                <li className="flex items-center gap-1.5"><Compass className="h-3.5 w-3.5 text-stone-400" /><a href="#android" className="hover:text-stone-950 transition">Download Android App</a></li>
                                <li><a href="#privacy" className="hover:text-stone-950 transition">Privacy Policy</a></li>
                                <li><a href="#terms" className="hover:text-stone-950 transition">Terms of Service</a></li>
                            </ul>
                        </div>

                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
                        <span>© 2026 CafeFinder Inc. Cozy cafe discovery and artisanal spaces. All rights reserved.</span>
                        <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Server Aktif (Jakarta Cloud) v2.4.0
                        </span>
                    </div>
                </div>
            </footer>

            {/* INTERACTIVE MODALS */}
            <OrderModal
                isOpen={orderModalOpen}
                cafe={selectedOrderCafe}
                onClose={() => setOrderModalOpen(false)}
                onOrderComplete={handleOrderComplete}
            />

            <ReservationModal
                isOpen={reservationModalOpen}
                cafe={selectedReservationCafe}
                onClose={() => setReservationModalOpen(false)}
                onReservationComplete={handleReservationComplete}
            />

            <ReceiptModal
                isOpen={receiptModalOpen}
                order={liveOrder}
                onClose={() => setReceiptModalOpen(false)}
            />

            <VoucherModal
                isOpen={voucherModalOpen}
                stampsCount={stamps.filter(s => s.stamped).length}
                onClose={() => setVoucherModalOpen(false)}
            />

            <BeansModal
                isOpen={beansModalOpen}
                onClose={() => setBeansModalOpen(false)}
            />

            <SeatingModal
                isOpen={seatingModalOpen}
                onClose={() => setSeatingModalOpen(false)}
            />

            <CuppingModal
                isOpen={cuppingModalOpen}
                onClose={() => setCuppingModalOpen(false)}
            />

        </div>
    );
}
