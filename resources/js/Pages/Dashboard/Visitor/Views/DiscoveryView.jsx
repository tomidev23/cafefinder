import { useState } from 'react';
import {
    MapPin,
    SlidersHorizontal,
    Wifi,
    Zap,
    Coffee,
    VolumeX,
    Star,
    Heart,
    ChevronDown,
    QrCode,
    Sparkles,
    ZoomIn,
    ZoomOut,
    LocateFixed,
    RotateCcw
} from 'lucide-react';

import { visitorCafes } from '@/data/cafes';

export default function DiscoveryView({ onOrderCafe, onReserveCafe }) {
    // Filters state
    const [selectedRadius, setSelectedRadius] = useState('Radius 3 km');
    const [openNowOnly, setOpenNowOnly] = useState(true);
    const [emptySeatsOnly, setEmptySeatsOnly] = useState(false);
    const [activeTag, setActiveTag] = useState(null);
    const [sortBy, setSortBy] = useState('Paling Relevan');
    const [selectedCafeOnMap, setSelectedCafeOnMap] = useState('common-grounds');

    const [favorites, setFavorites] = useState({
        'common-grounds': true,
        'tanamera-batam': true,
        'manner-coffee': false,
        'kedai-kopi-kita': true,
    });

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const cafes = visitorCafes;

    const popularTags = [
        '🏢 Dekat One Batam Mall',
        '🌾 Biji Anaerobic Terkini',
        '🌙 Kafe Buka 24 Jam',
        '🌳 Outdoor Rindang',
        '📶 WiFi Super Cepat >150 Mbps',
        '🐾 Pet-friendly Garden',
    ];

    const activeMapCafe = cafes.find(c => c.id === selectedCafeOnMap) || cafes[0];

    return (
        <div className="space-y-6">
            
            {/* 1. FILTER CONTROLS & POPULAR TAGS ROW */}
            <div className="rounded-3xl border border-[#EFEAE3] bg-white p-5 shadow-xs space-y-4">
                
                {/* Primary Filter Dropdowns & Toggles */}
                <div className="flex flex-wrap items-center gap-2.5">
                    
                    {/* Radius */}
                    <div className="relative">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50/80 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                        >
                            <MapPin className="h-3.5 w-3.5 text-amber-900" />
                            <span>Jarak: {selectedRadius}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                        </button>
                    </div>

                    {/* Fasilitas WFC */}
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/80 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                    >
                        <Zap className="h-3.5 w-3.5 text-amber-700" />
                        <span>Fasilitas WFC (Colokan, WiFi)</span>
                        <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                    </button>

                    {/* Metode Seduh */}
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/80 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                    >
                        <Coffee className="h-3.5 w-3.5 text-stone-600" />
                        <span>Metode: V60 & Cold Drip</span>
                        <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                    </button>

                    {/* Suasana */}
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/80 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                    >
                        <VolumeX className="h-3.5 w-3.5 text-stone-600" />
                        <span>Suasana: Tenang untuk Kerja</span>
                        <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                    </button>

                    {/* Buka Sekarang Toggle */}
                    <button
                        type="button"
                        onClick={() => setOpenNowOnly(!openNowOnly)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                            openNowOnly
                                ? 'bg-[#56311F] text-white shadow-xs'
                                : 'border border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-stone-100'
                        }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${openNowOnly ? 'bg-emerald-400' : 'bg-stone-400'}`} />
                        <span>Buka Sekarang</span>
                    </button>

                    {/* Meja Kosong Toggle */}
                    <button
                        type="button"
                        onClick={() => setEmptySeatsOnly(!emptySeatsOnly)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                            emptySeatsOnly
                                ? 'bg-[#56311F] text-white shadow-xs'
                                : 'border border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-stone-100'
                        }`}
                    >
                        <span>Meja Kosong</span>
                    </button>

                    {/* Semua Filter */}
                    <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#56311F] hover:underline ml-auto"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Semua Filter (6)
                    </button>

                </div>

                {/* Popular Tags */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-stone-100 scrollbar-none">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
                        Populer:
                    </span>
                    {popularTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
                                activeTag === tag
                                    ? 'border-[#56311F] bg-amber-50 text-[#56311F] font-bold'
                                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

            </div>

            {/* 2. SPLIT VIEW: CAFE LIST (LEFT) + INTERACTIVE MAP (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT: 48 ARTISANAL CAFES LIST (col-span-7) */}
                <div className="lg:col-span-7 space-y-4">
                    
                    {/* List Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold tracking-tight text-stone-900">
                                    Ditemukan {cafes.length} Kafe Artisanal di sekitar Anda
                                </h2>
                                <span className="rounded-full bg-amber-100/70 text-amber-900 text-[11px] font-bold px-2.5 py-0.5">
                                    Area Batam Center & Sekitarnya
                                </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Menampilkan kafe siap kerja (WFC-ready), single origin lokal & internasional.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 text-xs text-stone-500">
                            <span>Urutkan:</span>
                            <button
                                type="button"
                                className="font-bold text-stone-900 inline-flex items-center gap-1 hover:text-[#56311F]"
                            >
                                {sortBy} <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                            </button>
                        </div>
                    </div>

                    {/* Cafe Cards */}
                    <div className="space-y-4">
                        {cafes.map(cafe => (
                            <div
                                key={cafe.id}
                                onClick={() => setSelectedCafeOnMap(cafe.id)}
                                className={`rounded-3xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row ${
                                    selectedCafeOnMap === cafe.id
                                        ? 'border-[#56311F] ring-2 ring-[#56311F]/20'
                                        : 'border-[#EFEAE3]'
                                }`}
                            >
                                {/* Photo Container */}
                                <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 bg-stone-100 overflow-hidden">
                                    <img
                                        src={cafe.image}
                                        alt={cafe.name}
                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                    />
                                    
                                    {/* Top Overlay Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                                            cafe.isPro
                                                ? 'bg-[#56311F] text-amber-100'
                                                : 'bg-stone-900/80 text-white backdrop-blur-xs'
                                        }`}>
                                            {cafe.badge}
                                        </span>
                                        {cafe.seatBadge && (
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                                                cafe.seatColor === 'emerald'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-amber-600 text-white'
                                            }`}>
                                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                {cafe.seatBadge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Favorite Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(cafe.id);
                                        }}
                                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 shadow-xs hover:bg-white transition"
                                    >
                                        <Heart className={`h-4 w-4 ${favorites[cafe.id] ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                                    </button>

                                    {/* Distance Overlay */}
                                    <div className="absolute bottom-2.5 left-3">
                                        <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                                            {cafe.distance}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-base font-bold text-stone-900 leading-snug">
                                                {cafe.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                <span>{cafe.rating}</span>
                                                <span className="text-[10px] font-normal text-stone-400">({cafe.reviewsCount})</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
                                            {cafe.address}
                                        </p>

                                        {/* Features tags */}
                                        <div className="flex flex-wrap items-center gap-1.5 pt-2.5">
                                            {cafe.tags.map((tag, idx) => {
                                                const label = typeof tag === 'string' ? tag : tag.label;
                                                const lower = (label || '').toLowerCase();
                                                const Icon = typeof tag === 'object' && tag.icon
                                                    ? tag.icon
                                                    : lower.includes('wifi')
                                                    ? Wifi
                                                    : lower.includes('colokan') || lower.includes('stopkontak')
                                                    ? Zap
                                                    : lower.includes('kopi') || lower.includes('brew')
                                                    ? Coffee
                                                    : lower.includes('tenang') || lower.includes('silent')
                                                    ? VolumeX
                                                    : Sparkles;
                                                return (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 bg-[#FAF8F5] text-[11px] font-medium text-stone-600"
                                                    >
                                                        <Icon className="h-3 w-3 text-stone-400" />
                                                        {label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Card Footer Status & Actions */}
                                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                                        <div className="text-xs">
                                            <span className="text-emerald-700 font-semibold block">{cafe.status}</span>
                                            <span className="text-[11px] text-stone-400">Rata-rata: {cafe.avgPrice}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    alert(`Membuka rute Google Maps ke: ${cafe.name}`);
                                                }}
                                                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                                            >
                                                Rute
                                            </button>

                                            {cafe.isPro ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onOrderCafe) {
                                                            onOrderCafe(cafe);
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#56311F] text-xs font-bold text-white shadow-xs hover:bg-[#432516] transition active:scale-[0.99]"
                                                >
                                                    <QrCode className="h-3.5 w-3.5" />
                                                    Pesan Meja / QRIS
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onReserveCafe) {
                                                            onReserveCafe(cafe);
                                                        }
                                                    }}
                                                    className="px-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-700 hover:bg-stone-100 transition"
                                                >
                                                    Detail
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Button */}
                    <div className="pt-2 text-center">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-stone-200 bg-white text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
                        >
                            Muat 20 Kafe Lainnya <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                        </button>
                    </div>

                </div>

                {/* RIGHT: INTERACTIVE MAP CANVAS (col-span-5, sticky) */}
                <div className="lg:col-span-5 sticky top-24 rounded-3xl border border-[#EFEAE3] bg-white overflow-hidden shadow-xs flex flex-col h-170">
                    
                    {/* Map Header Controls */}
                    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                        <button
                            type="button"
                            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200 text-xs font-bold text-stone-700 shadow-sm hover:bg-white transition"
                        >
                            <RotateCcw className="h-3.5 w-3.5 text-amber-900" />
                            Cari di area peta ini
                        </button>

                        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-stone-200 rounded-xl p-1 shadow-sm">
                            <button
                                type="button"
                                title="Lokasi Saya"
                                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition"
                            >
                                <LocateFixed className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-px h-3 bg-stone-200" />
                            <button
                                type="button"
                                title="Zoom In"
                                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition"
                            >
                                <ZoomIn className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                title="Zoom Out"
                                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition"
                            >
                                <ZoomOut className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Stylized Vector Map Canvas */}
                    <div className="relative flex-1 bg-[#E8E4DF] overflow-hidden">
                        
                        {/* Map SVG vector roads & layout */}
                        <svg className="w-full h-full object-cover select-none" viewBox="0 0 500 500">
                            {/* Background Land */}
                            <rect width="500" height="500" fill="#EAE5DE" />
                            
                            {/* Water / Greenery Parks */}
                            <path d="M 0 100 Q 80 140 120 180 T 200 300 L 220 500 L 0 500 Z" fill="#DCE7D6" />
                            <circle cx="400" cy="120" r="60" fill="#D7E4D0" />
                            <circle cx="80" cy="420" r="50" fill="#D7E4D0" />

                            {/* Road Network */}
                            {/* Main Arterial Road (Senopati - Gunawarman) */}
                            <path d="M -20 220 L 520 280" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" />
                            <path d="M -20 220 L 520 280" stroke="#F1ECE5" strokeWidth="16" strokeLinecap="round" />

                            {/* Secondary Roads */}
                            <path d="M 220 -20 L 260 520" stroke="#FFFFFF" strokeWidth="16" />
                            <path d="M 120 40 L 480 400" stroke="#FFFFFF" strokeWidth="12" />
                            <path d="M 380 -20 L 320 520" stroke="#FFFFFF" strokeWidth="10" />
                            <path d="M 40 80 L 200 240 L 160 480" stroke="#FFFFFF" strokeWidth="8" />

                            {/* Center User Location Marker (Pulse) */}
                            <circle cx="240" cy="250" r="14" fill="#3B82F6" fillOpacity="0.2" className="animate-ping" />
                            <circle cx="240" cy="250" r="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2.5" />
                        </svg>

                        {/* Interactive Pins on Map */}
                        {cafes.map(cafe => {
                            const isSelected = selectedCafeOnMap === cafe.id;
                            return (
                                <div
                                    key={cafe.id}
                                    style={{ left: `${cafe.coordinates.x}%`, top: `${cafe.coordinates.y}%` }}
                                    onClick={() => setSelectedCafeOnMap(cafe.id)}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition duration-200"
                                >
                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md transition whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-[#56311F] text-white ring-3 ring-[#56311F]/30 scale-105'
                                            : cafe.isPro
                                            ? 'bg-[#6D3F28] text-amber-100 hover:scale-105'
                                            : 'bg-white text-stone-800 border border-stone-200 hover:scale-105'
                                    }`}>
                                        <Coffee className="h-3 w-3" />
                                        <span>{cafe.pricePin}</span>
                                    </div>
                                    <div className={`w-1.5 h-1.5 mx-auto rounded-full mt-0.5 ${
                                        isSelected ? 'bg-[#56311F]' : 'bg-stone-500'
                                    }`} />
                                </div>
                            );
                        })}

                        {/* Selected Cafe Card Popup Overlay (Bottom of Map) */}
                        <div className="absolute bottom-12 left-3 right-3 z-30 transition-all">
                            <div className="rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-md p-3.5 shadow-xl flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                                        <img
                                            src={activeMapCafe.image}
                                            alt={activeMapCafe.name}
                                            className="h-full w-full object-cover"
                                        />
                                        <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-[#56311F] text-amber-100 text-[8px] font-bold">
                                            {activeMapCafe.isPro ? 'Mitra Pro' : 'Publik'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-stone-500 block">
                                            {activeMapCafe.distance}
                                        </span>
                                        <h4 className="text-xs font-bold text-stone-900 leading-tight">
                                            {activeMapCafe.name}
                                        </h4>
                                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            {activeMapCafe.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-xs font-extrabold text-[#56311F] block">
                                        {activeMapCafe.avgPrice.split('/')[0]}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (activeMapCafe.isPro && onOrderCafe) {
                                                onOrderCafe(activeMapCafe);
                                            } else if (onReserveCafe) {
                                                onReserveCafe(activeMapCafe);
                                            }
                                        }}
                                        className="text-xs font-bold text-[#56311F] hover:underline mt-1 inline-block"
                                    >
                                        Lihat & Pesan →
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Map Legend Footer */}
                    <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 font-medium text-stone-700">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#56311F]" />
                                Mitra Pro (Live Seat & QRIS)
                            </span>
                            <span className="flex items-center gap-1 font-medium text-stone-700">
                                <span className="h-2.5 w-2.5 rounded-full border border-stone-400 bg-white" />
                                Listing Publik
                            </span>
                        </div>
                        <span>Peta diperbarui otomatis • Radius 3 km</span>
                    </div>

                </div>

            </div>

        </div>
    );
}

