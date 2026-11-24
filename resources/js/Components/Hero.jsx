import { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, AttributionControl, useMap, Tooltip } from 'react-leaflet';
import { motion } from 'framer-motion';
import ScrollWordReveal from './ScrollWordReveal';
import {
    Search,
    Crosshair,
    MapPin,
    Laptop,
    MessagesSquare,
    Gamepad2,
    Coffee,
    Check,
    X,
    Loader2,
    ArrowRight,
    Star,
    Navigation,
    Sparkles,
} from 'lucide-react';

/* ── Haversine Distance Calculation (km) ── */
function haversineDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371; // radius bumi dalam km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function formatKm(km) {
    if (km == null) return null;
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
}

const PRESET_AREAS = [
    { name: 'Batam Center', lat: 1.1305, lng: 104.0485 },
    { name: 'Nagoya / Penuin', lat: 1.1440, lng: 104.0160 },
    { name: 'Grand Batam', lat: 1.1345, lng: 104.0090 },
    { name: 'Harbour Bay', lat: 1.1555, lng: 103.9925 },
    { name: 'Tiban', lat: 1.1120, lng: 103.9780 },
];

const chips = [
    { id: 'coworking', label: 'Coworking / WFH Friendly', key: 'coworking' },
    { id: 'wifi', label: 'WiFi Cepat (4+)', key: 'wifi' },
    { id: 'long_table', label: 'Long Table', key: 'long_table' },
    { id: 'mushola', label: 'Ada Mushola', key: 'mushola' },
    { id: 'smoking', label: 'Smoking Area', key: 'smoking' },
];

const intents = [
    {
        id: 'wfh',
        label: 'Nugas / WFH Serius',
        description: 'WiFi cepat, tenang, dan ada colokan',
        icon: Laptop,
    },
    {
        id: 'meeting',
        label: 'Diskusi / Meeting',
        description: 'Long table dan ruang lebih lega',
        icon: MessagesSquare,
    },
    {
        id: 'hangout',
        label: 'Nongkrong / Mabar',
        description: 'Santai, ramai, dan lebih fleksibel',
        icon: Gamepad2,
    },
    {
        id: 'takeaway',
        label: 'Ngopi Cepat / Takeaway',
        description: 'Dekat dan siap dipesan online',
        icon: Coffee,
    },
];

/* ── Leaflet Helper: Resize Map ── */
function ResizeMap() {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
}

/* ── Leaflet Helper: Reactive Camera Controller ── */
function MapCameraController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] != null && center[1] != null) {
            map.flyTo(center, zoom || 14, { duration: 0.8 });
        }
    }, [center, zoom, map]);
    return null;
}

export default function Hero({
    selectedIntent,
    onIntentChange,
    cafes = [],
    stats = {},
    onSearch,
    onSelectCafe,
    onLocationFound,
    onFilterChange,
}) {
    // Basic cafe sets
    const namedCafes = useMemo(() => cafes.filter((c) => c.name), [cafes]);
    const mapCafes = useMemo(() => namedCafes.filter((c) => c.lat != null && c.lng != null), [namedCafes]);
    const defaultBounds = useMemo(() => {
        return mapCafes.length > 0 ? L.latLngBounds(mapCafes.map((c) => [c.lat, c.lng])) : null;
    }, [mapCafes]);

    // Search and Autocomplete state
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const searchContainerRef = useRef(null);

    // Geolocation state ("Dekat Saya")
    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState(null);

    // Map preview camera state
    const [heroCenter, setHeroCenter] = useState(null);
    const [heroZoom, setHeroZoom] = useState(13);

    // Active feature chips
    const [activeChips, setActiveChips] = useState(['wifi', 'coworking']);

    // Quick stats
    const quickFacts = useMemo(() => [
        { label: 'Coworking', value: `${namedCafes.filter((c) => c.coworking).length} kafe` },
        { label: 'Long table', value: `${namedCafes.filter((c) => c.long_table).length} kafe` },
        { label: 'Ada mushola', value: `${namedCafes.filter((c) => c.mushola).length} kafe` },
    ], [namedCafes]);

    const cheapest = useMemo(() => {
        const prices = namedCafes.map((c) => c.price_min).filter((n) => n != null && !Number.isNaN(n));
        return prices.length > 0 ? Math.min(...prices) : null;
    }, [namedCafes]);

    const mapFacts = useMemo(() => [
        { label: 'Kafe terdata', value: namedCafes.length },
        { label: 'WiFi 4+', value: `${namedCafes.filter((c) => (c.wifi ?? 0) >= 4).length} kafe` },
        { label: 'Harga mulai', value: Number.isFinite(cheapest) && cheapest > 0 ? `Rp ${Math.round(cheapest / 1000)}k` : '-' },
    ], [namedCafes, cheapest]);

    // Close search dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Autocomplete filtered results
    const searchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];

        const filtered = cafes.filter((c) => {
            const nameMatch = c.name?.toLowerCase().includes(q);
            const areaMatch = c.area?.toLowerCase().includes(q);
            const addrMatch = c.address?.toLowerCase().includes(q);
            const noteMatch = c.note?.toLowerCase().includes(q);
            return nameMatch || areaMatch || addrMatch || noteMatch;
        });

        // If user location is known, sort results by distance!
        if (userLocation && userLocation.lat != null) {
            return filtered
                .map((c) => ({
                    ...c,
                    distKm: haversineDistance(userLocation.lat, userLocation.lng, c.lat, c.lng),
                }))
                .sort((a, b) => (a.distKm ?? Infinity) - (b.distKm ?? Infinity))
                .slice(0, 6);
        }

        return filtered.slice(0, 6);
    }, [cafes, searchQuery, userLocation]);

    // Toggle filter chips & propagate
    const toggleChip = (id) => {
        setActiveChips((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            if (onFilterChange) {
                onFilterChange(next);
            }
            return next;
        });
    };

    const handleSelectPreset = (preset) => {
        const loc = {
            lat: preset.lat,
            lng: preset.lng,
            name: preset.name,
            isManual: true,
        };
        setUserLocation(loc);
        setHeroCenter([preset.lat, preset.lng]);
        setHeroZoom(14);
        setLocationStatus({
            type: 'success',
            message: `Titik acuan disetel ke ${preset.name}. Kafe terdekat diurutkan dari area ini.`,
        });
        if (onLocationFound) {
            onLocationFound(loc);
        } else {
            scrollToMap();
        }
    };

    // Helper: Scroll to full map section
    const scrollToMap = () => {
        const mapEl = document.getElementById('maps');
        if (mapEl) {
            mapEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle Search Submission
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setShowDropdown(false);

        const trimmed = searchQuery.trim();
        if (onSearch) {
            onSearch(trimmed);
        } else {
            scrollToMap();
        }
    };

    // Handle Click on Cafe Suggestion
    const handleSelectSuggestion = (cafe) => {
        setSearchQuery(cafe.name);
        setShowDropdown(false);

        // Center preview map
        if (cafe.lat != null && cafe.lng != null) {
            setHeroCenter([cafe.lat, cafe.lng]);
            setHeroZoom(16);
        }

        if (onSelectCafe) {
            onSelectCafe(cafe);
        } else {
            scrollToMap();
        }
    };

    // Handle "Dekat Saya" (Near Me Geolocation)
    const handleNearMe = () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            setLocationStatus({
                type: 'warning',
                message: 'Peramban Anda tidak mendukung deteksi lokasi (Geolocation).',
            });
            return;
        }

        setLocationLoading(true);
        setLocationStatus({
            type: 'info',
            message: 'Mencari titik lokasi GPS Anda di Batam...',
        });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const accuracy = Math.round(pos.coords.accuracy || 0);

                // Periksa apakah koordinat berada di dalam wilayah pulau Batam (lat: 0.85 - 1.25, lng: 103.85 - 104.20)
                const isInsideBatam = lat >= 0.85 && lat <= 1.25 && lng >= 103.85 && lng <= 104.20;

                let userLoc;
                if (isInsideBatam) {
                    userLoc = {
                        lat,
                        lng,
                        name: 'Lokasi Anda (GPS)',
                        accuracy,
                        isManual: false,
                    };

                    setUserLocation(userLoc);
                    setLocationLoading(false);

                    // Cari kafe terdekat
                    const cafesWithDist = cafes
                        .filter((c) => c.lat != null && c.lng != null)
                        .map((c) => ({
                            ...c,
                            distKm: haversineDistance(lat, lng, c.lat, c.lng),
                        }))
                        .sort((a, b) => (a.distKm ?? Infinity) - (b.distKm ?? Infinity));

                    const nearest = cafesWithDist[0];
                    const distLabel = nearest ? formatKm(nearest.distKm) : '';
                    const accLabel = accuracy > 100 ? ` (Akurasi jaringan ±${accuracy > 1000 ? `${(accuracy / 1000).toFixed(1)}km` : `${accuracy}m`})` : '';

                    setLocationStatus({
                        type: 'success',
                        message: nearest
                            ? `GPS aktif! Kafe terdekat: ${nearest.name} (${distLabel})${accLabel}. Menyesuaikan peta...`
                            : `Lokasi Anda berhasil dideteksi!${accLabel}`,
                    });

                    // Pusatkan peta hero
                    setHeroCenter([lat, lng]);
                    setHeroZoom(14);

                    if (onLocationFound) {
                        onLocationFound(userLoc);
                    } else {
                        scrollToMap();
                    }
                } else {
                    // Terdeteksi di luar Batam (misal pengetesan dari luar kota atau routing IP provider)
                    const fallbackOrigin = {
                        lat: 1.1305,
                        lng: 104.0485,
                        name: 'Batam Center (Pusat Kota)',
                        isManual: true,
                    };

                    setUserLocation(fallbackOrigin);
                    setLocationLoading(false);

                    setLocationStatus({
                        type: 'warning',
                        message: `Lokasi terdeteksi di luar Batam (${lat.toFixed(2)}, ${lng.toFixed(2)} • IP Provider). Titik awal disetel ke Batam Center agar jarak kafe akurat.`,
                    });

                    setHeroCenter([fallbackOrigin.lat, fallbackOrigin.lng]);
                    setHeroZoom(13);

                    if (onLocationFound) {
                        onLocationFound(fallbackOrigin);
                    } else {
                        scrollToMap();
                    }
                }
            },
            (err) => {
                setLocationLoading(false);
                let message = 'Izin akses lokasi ditolak. Menggunakan titik pusat Batam Center.';
                if (err.code === 2) {
                    message = 'Sinyal GPS tidak dapat dideteksi. Menggunakan Batam Center.';
                } else if (err.code === 3) {
                    message = 'Waktu deteksi GPS habis. Silakan coba lagi.';
                }

                setLocationStatus({
                    type: 'warning',
                    message,
                });

                // Fallback origin: Batam Center
                const fallbackOrigin = {
                    lat: 1.1305,
                    lng: 104.0485,
                    name: 'Batam Center (Pusat Kota)',
                    isManual: true,
                };
                setUserLocation(fallbackOrigin);
                setHeroCenter([fallbackOrigin.lat, fallbackOrigin.lng]);

                if (onLocationFound) {
                    onLocationFound(fallbackOrigin);
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <section id="eksplorasi" className="relative w-full bg-stone-50 py-6 transition-colors duration-200 dark:bg-stone-950 md:py-10">
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">

                    {/* ── KOLOM KIRI: Headings, Omnibox Search, Filter Chips, Intent Cards ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/60 transition-colors duration-200 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/60 sm:p-8 lg:col-span-7 lg:p-10"
                    >
                        <div>
                            <ScrollWordReveal
                                as="h1"
                                text="Cari kafe lokal yang enak, tenang, dan pas buat harimu."
                                className="mt-1 text-3xl font-bold tracking-tight text-stone-950 dark:text-stone-100 sm:text-4xl lg:text-5xl lg:leading-tight"
                            />

                            {/* ── OMNIBOX SEARCH & DEKAT SAYA (Cohesive, Functional, Anti-UI-Slop) ── */}
                            <div ref={searchContainerRef} className="relative mt-7">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="rounded-2xl border border-stone-200/90 bg-stone-50/70 p-2 shadow-xs transition focus-within:border-amber-800/80 focus-within:ring-2 focus-within:ring-amber-800/15 dark:border-stone-800 dark:bg-stone-950/70 dark:focus-within:border-amber-500/80 dark:focus-within:ring-amber-500/15"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        {/* Input Box */}
                                        <div className="relative flex flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 shadow-2xs transition focus-within:border-amber-700 dark:border-stone-700 dark:bg-stone-900">
                                            <Search className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setShowDropdown(true);
                                                }}
                                                onFocus={() => setShowDropdown(true)}
                                                placeholder="Cari kafe, area (Nagoya, Batam Center), menu..."
                                                className="w-full border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-500"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setShowDropdown(false);
                                                    }}
                                                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                                                    aria-label="Hapus pencarian"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* "Dekat Saya" Geolocation Button */}
                                        <button
                                            type="button"
                                            onClick={handleNearMe}
                                            disabled={locationLoading}
                                            title="Temukan kafe terdekat dari posisi GPS Anda"
                                            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold shadow-2xs transition active:scale-[0.98] ${
                                                userLocation && !userLocation.isManual
                                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700/80 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                    : locationLoading
                                                    ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                                                    : 'border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50/60 hover:text-amber-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300'
                                            }`}
                                        >
                                            {locationLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-amber-700 dark:text-amber-400" />
                                            ) : userLocation && !userLocation.isManual ? (
                                                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <Crosshair className="h-4 w-4 text-amber-800 dark:text-amber-400" />
                                            )}
                                            <span>
                                                {locationLoading
                                                    ? 'Mencari GPS...'
                                                    : userLocation && !userLocation.isManual
                                                    ? 'GPS Aktif'
                                                    : 'Dekat Saya'}
                                            </span>
                                        </button>

                                        {/* Primary Search Submit Button */}
                                        <button
                                            type="submit"
                                            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-950 active:scale-[0.98] dark:bg-amber-700 dark:hover:bg-amber-600"
                                        >
                                            <span>Jelajahi</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    {/* ── Filter Chips Row ── */}
                                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
                                        <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 mr-1">
                                            Filter:
                                        </span>
                                        {chips.map((chip) => {
                                            const on = activeChips.includes(chip.id);
                                            // count matching
                                            const count = namedCafes.filter((c) => {
                                                if (chip.id === 'coworking') return c.coworking;
                                                if (chip.id === 'wifi') return (c.wifi ?? 0) >= 4;
                                                if (chip.id === 'long_table') return c.long_table;
                                                if (chip.id === 'mushola') return c.mushola;
                                                if (chip.id === 'smoking') return c.smoking;
                                                return false;
                                            }).length;

                                            return (
                                                <button
                                                    key={chip.id}
                                                    type="button"
                                                    onClick={() => toggleChip(chip.id)}
                                                    aria-pressed={on}
                                                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11.5px] font-medium transition active:scale-[0.98] ${
                                                        on
                                                            ? 'border-amber-900 bg-amber-900 text-white dark:border-amber-600 dark:bg-amber-700'
                                                            : 'border-stone-200 bg-white text-stone-600 hover:border-amber-800 hover:text-amber-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-amber-600 dark:hover:text-amber-300'
                                                    }`}
                                                >
                                                    <span>{chip.label}</span>
                                                    <span className={`text-[10px] ${on ? 'text-amber-200' : 'text-stone-400 dark:text-stone-500'}`}>
                                                        ({count})
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </form>

                                {/* ── Autocomplete Results Dropdown ── */}
                                {showDropdown && searchQuery.trim().length > 0 && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white/98 shadow-xl backdrop-blur-md transition-all dark:border-stone-800 dark:bg-stone-900/98">
                                        <div className="border-b border-stone-100 bg-stone-50/80 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-400">
                                            Hasil Pencarian Kafe ({searchResults.length})
                                        </div>

                                        {searchResults.length > 0 ? (
                                            <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                                                {searchResults.map((cafe) => {
                                                    const distStr = userLocation && cafe.lat != null
                                                        ? formatKm(haversineDistance(userLocation.lat, userLocation.lng, cafe.lat, cafe.lng))
                                                        : null;

                                                    return (
                                                        <button
                                                            key={cafe.id || cafe.name}
                                                            type="button"
                                                            onClick={() => handleSelectSuggestion(cafe)}
                                                            className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-amber-50/60 dark:hover:bg-amber-950/30"
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="truncate text-xs font-bold text-stone-900 dark:text-stone-100">
                                                                        {cafe.name}
                                                                    </p>
                                                                    {cafe.rating && (
                                                                        <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                                                                            <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                                                                            {cafe.rating}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="mt-0.5 truncate text-[11px] text-stone-500 dark:text-stone-400">
                                                                    {cafe.area || cafe.address || 'Batam'}
                                                                    {distStr && (
                                                                        <span className="font-semibold text-amber-800 dark:text-amber-400">
                                                                            {' '}• {distStr} dari Anda
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="shrink-0 text-right">
                                                                <span className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-[10.5px] font-semibold text-stone-700 transition hover:bg-amber-900 hover:text-white dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                                                    <span>Lihat Rute</span>
                                                                    <ArrowRight className="h-3 w-3" />
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                                <div className="bg-stone-50/80 p-2 text-center dark:bg-stone-950/60">
                                                    <button
                                                        type="button"
                                                        onClick={handleSearchSubmit}
                                                        className="text-xs font-bold text-amber-900 hover:underline dark:text-amber-400"
                                                    >
                                                        Lihat semua hasil pencarian &quot;{searchQuery}&quot; di peta navigasi →
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-stone-600 dark:text-stone-400">
                                                    Tidak ditemukan kafe dengan kata kunci &quot;<strong className="text-stone-900 dark:text-stone-200">{searchQuery}</strong>&quot;.
                                                </p>
                                                <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">
                                                    Coba cari area populer seperti: Batam Center, Nagoya, Penuin, atau Sukajadi.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── Geolocation & Feedback Toast/Banner ── */}
                                {locationStatus && (
                                    <div
                                        className={`mt-2.5 rounded-xl border p-3 text-xs font-medium transition ${
                                            locationStatus.type === 'success'
                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300'
                                                : locationStatus.type === 'warning'
                                                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300'
                                                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-start gap-2">
                                                {locationStatus.type === 'success' ? (
                                                    <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                ) : locationStatus.type === 'warning' ? (
                                                    <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
                                                ) : (
                                                    <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-blue-600 dark:text-blue-400" />
                                                )}
                                                <div>
                                                    <p className="leading-snug">{locationStatus.message}</p>
                                                    {locationStatus.type === 'warning' && (
                                                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                                            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                                                                Pilih area awal Anda di Batam:
                                                            </span>
                                                            {PRESET_AREAS.map((preset) => (
                                                                <button
                                                                    key={preset.name}
                                                                    type="button"
                                                                    onClick={() => handleSelectPreset(preset)}
                                                                    className="rounded-lg border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-bold text-amber-900 shadow-2xs hover:bg-amber-100 dark:border-amber-700 dark:bg-stone-900 dark:text-amber-300 dark:hover:bg-amber-950"
                                                                >
                                                                    {preset.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setLocationStatus(null)}
                                                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                                aria-label="Tutup notifikasi"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── INTENT ACTIVITY SELECTOR ("Mau ngapain hari ini?") ── */}
                            <div className="mt-8">
                                <div className="flex flex-wrap items-end justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold text-stone-950 dark:text-stone-100">
                                            Mau ngapain hari ini?
                                        </p>
                                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                            Pilih aktivitas, rekomendasi kafe akan otomatis disesuaikan.
                                        </p>
                                    </div>
                                    {selectedIntent && (
                                        <button
                                            type="button"
                                            onClick={() => onIntentChange(null)}
                                            className="text-xs font-semibold text-amber-900 underline-offset-4 hover:underline dark:text-amber-400"
                                        >
                                            Reset pilihan
                                        </button>
                                    )}
                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                    {intents.map((intent) => {
                                        const Icon = intent.icon;
                                        const isSelected = selectedIntent === intent.id;

                                        return (
                                            <motion.button
                                                key={intent.id}
                                                type="button"
                                                onClick={() => onIntentChange(intent.id)}
                                                aria-pressed={isSelected}
                                                whileHover={{ scale: 1.015, y: -2 }}
                                                whileTap={{ scale: 0.985 }}
                                                transition={{ duration: 0.2 }}
                                                className={`group flex items-start gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2 dark:focus-visible:ring-amber-400 ${
                                                    isSelected
                                                        ? 'border-amber-900 bg-amber-900 text-white shadow-sm dark:border-amber-600 dark:bg-amber-700'
                                                        : 'border-stone-200 bg-stone-50/80 text-stone-800 hover:border-amber-300 hover:bg-amber-50/70 dark:border-stone-800 dark:bg-stone-950/80 dark:text-stone-100 dark:hover:border-amber-700 dark:hover:bg-amber-950/30'
                                                }`}
                                            >
                                                <span
                                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                                        isSelected
                                                            ? 'bg-white/15 text-amber-100'
                                                            : 'bg-white text-amber-900 shadow-sm dark:bg-stone-900 dark:text-amber-400'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center justify-between gap-2 text-xs font-bold">
                                                        {intent.label}
                                                        {isSelected && <Check className="h-4 w-4 shrink-0" />}
                                                    </span>
                                                    <span
                                                        className={`mt-1 block text-[11px] leading-4 ${
                                                            isSelected ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'
                                                        }`}
                                                    >
                                                        {intent.description}
                                                    </span>
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Statistik Bawah */}
                        <div className="mt-8">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {quickFacts.map((item) => (
                                    <motion.div
                                        key={item.label}
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.2 }}
                                        className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3.5 dark:border-stone-800 dark:bg-stone-950/80"
                                    >
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">{item.label}</p>
                                        <p className="mt-1 text-base font-semibold text-stone-950 dark:text-stone-100">{item.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── KOLOM KANAN: PETA INTERAKTIF PREVIEW HERO ── */}
                    <motion.div
                        id="peta"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="relative flex min-h-125 w-full flex-1 overflow-hidden rounded-3xl border border-stone-200 bg-stone-900 shadow-lg shadow-stone-900/10 lg:col-span-5 lg:min-h-full"
                    >
                        <div className="relative h-full w-full flex-1 overflow-hidden">
                            {defaultBounds && (
                                <MapContainer
                                    bounds={defaultBounds}
                                    boundsOptions={{ padding: [40, 40] }}
                                    zoomControl={false}
                                    attributionControl={false}
                                    scrollWheelZoom={false}
                                    dragging={true}
                                    doubleClickZoom={false}
                                    touchZoom={true}
                                    keyboard={false}
                                    className="h-full w-full min-h-full"
                                    aria-label="Peta sebaran kafe di Batam"
                                >
                                    <ResizeMap />
                                    {heroCenter && <MapCameraController center={heroCenter} zoom={heroZoom} />}

                                    <TileLayer
                                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        maxZoom={19}
                                    />
                                    <AttributionControl position="topright" />

                                    {/* Cafe markers on map */}
                                    {mapCafes.map((c) => (
                                        <CircleMarker
                                            key={c.id || `${c.lat}-${c.lng}`}
                                            center={[c.lat, c.lng]}
                                            radius={7}
                                            eventHandlers={{
                                                click: () => handleSelectSuggestion(c),
                                            }}
                                            pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#78350f', fillOpacity: 1 }}
                                        >
                                            <Tooltip direction="top" offset={[0, -6]}>
                                                <span className="text-xs font-bold">{c.name}</span>
                                            </Tooltip>
                                        </CircleMarker>
                                    ))}

                                    {/* Distinct User GPS Location marker when detected */}
                                    {userLocation && userLocation.lat != null && (
                                        <>
                                            <CircleMarker
                                                center={[userLocation.lat, userLocation.lng]}
                                                radius={18}
                                                pathOptions={{ color: '#3b82f6', weight: 1.5, fillColor: '#60a5fa', fillOpacity: 0.25 }}
                                            />
                                            <CircleMarker
                                                center={[userLocation.lat, userLocation.lng]}
                                                radius={8}
                                                pathOptions={{ color: '#ffffff', weight: 2.5, fillColor: '#2563eb', fillOpacity: 1 }}
                                            >
                                                <Tooltip permanent direction="top" offset={[0, -8]}>
                                                    <span className="text-[11px] font-bold text-blue-900">📍 Lokasi Anda</span>
                                                </Tooltip>
                                            </CircleMarker>
                                        </>
                                    )}
                                </MapContainer>
                            )}
                        </div>

                        {/* Top Overlay Badge */}
                        <div className="pointer-events-none absolute left-4 top-4 z-1000 rounded-2xl border border-white/20 bg-stone-950/85 px-4 py-3 backdrop-blur-md sm:left-6 sm:top-6">
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                                <MapPin className="h-4 w-4 text-amber-400" />
                                {userLocation && !userLocation.isManual
                                    ? 'Posisi Anda Aktif di Peta'
                                    : `${mapCafes.length} kafe di peta`}
                            </p>
                            <p className="mt-0.5 text-xs text-stone-300">
                                {userLocation && !userLocation.isManual
                                    ? 'Kafe diurutkan berdasarkan jarak terdekat'
                                    : 'Batam • rating WiFi, harga, dan fasilitas'}
                            </p>
                        </div>

                        {/* Jump to Full Map Action Button on map */}
                        <div className="absolute right-4 top-4 z-1000 sm:right-6 sm:top-6">
                            <button
                                type="button"
                                onClick={scrollToMap}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-stone-950/85 px-3 py-2 text-xs font-semibold text-white shadow-md backdrop-blur-md transition hover:bg-amber-900"
                            >
                                <span>Peta Lengkap</span>
                                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                            </button>
                        </div>

                        {/* Bottom Overlay Facts */}
                        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-1000 grid grid-cols-3 gap-2 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:gap-3">
                            {mapFacts.map((f) => (
                                <div key={f.label} className="rounded-xl border border-white/10 bg-stone-950/80 p-3 text-center sm:text-left">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-stone-300">{f.label}</p>
                                    <p className="mt-0.5 text-base font-bold text-white sm:text-lg">{f.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
