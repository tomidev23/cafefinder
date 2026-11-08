import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, useMapEvents } from 'react-leaflet';
import {
    Footprints,
    Car,
    Zap,
    Share2,
    Plus,
    Minus,
    LocateFixed,
    Navigation,
    Coffee,
    Wifi,
    Clock3,
    ExternalLink,
    Loader2,
    Wallet,
    Search,
    MapPin,
    RotateCcw,
    CornerUpLeft,
    CornerUpRight,
    ArrowUp,
    Check,
    X,
    SlidersHorizontal,
    Layers,
    Compass,
    Crosshair,
    ChevronDown,
    ChevronUp,
    List,
    Map as MapIcon,
} from 'lucide-react';
import fallbackCafesData from '../data/cafes.json';


const FILTERS = [
    { key: 'wifi', label: 'WiFi Cepat', test: (c) => (c.wifi ?? c.wifi_rating ?? 0) >= 4 || (c.wifi_speed ?? 0) >= 100 },
    { key: 'coworking', label: 'Coworking', test: (c) => Boolean(c.coworking) },
    { key: 'long_table', label: 'Long Table', test: (c) => Boolean(c.long_table) },
    { key: 'smoking', label: 'Smoking Area', test: (c) => Boolean(c.smoking) },
    { key: 'mushola', label: 'Mushola', test: (c) => Boolean(c.mushola) },
];

const FACILITIES = [
    { key: 'coworking', label: 'Coworking' },
    { key: 'long_table', label: 'Long Table' },
    { key: 'smoking', label: 'Smoking Area' },
    { key: 'mushola', label: 'Mushola' },
];

const PROFILES = {
    'driving-car': { label: 'Motor / Mobil', Icon: Car, googleTravelMode: 'driving' },
    'foot-walking': { label: 'Jalan Kaki', Icon: Footprints, googleTravelMode: 'walking' },
};

// Preset locations in Batam for manual origin selection
const ORIGIN_PRESETS = [
    { name: 'Batam Center', lat: 1.1305, lng: 104.0485, icon: '' },
    { name: 'Grand Batam Mall', lat: 1.1345, lng: 104.0090, icon: '' },
    { name: 'Nagoya Hill', lat: 1.1448, lng: 104.0152, icon: '' },
    { name: 'One Batam Mall', lat: 1.1310, lng: 104.0495, icon: '' },
    { name: 'Harbour Bay', lat: 1.1555, lng: 103.9925, icon: '' },
];

/* ------------------------------ Map Icons ------------------------------ */

function makeCafeIcon(selected, name) {
    const size = selected ? 42 : 32;
    const html = renderToStaticMarkup(
        <div className="relative flex items-center justify-center">
            {selected && (
                <span className="absolute -inset-1.5 animate-ping rounded-full bg-amber-600/30" />
            )}
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: '9999px',
                    background: selected ? '#56311F' : '#ffffff',
                    color: selected ? '#ffffff' : '#56311F',
                    border: selected ? '3px solid #ffffff' : '2px solid #78350f',
                    boxShadow: selected
                        ? '0 4px 12px rgba(86, 49, 31, 0.45)'
                        : '0 2px 6px rgba(0,0,0,0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}
            >
                <Coffee size={selected ? 20 : 15} />
            </div>
            {selected && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#56311F] px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                    {name ? (name.length > 18 ? `${name.slice(0, 18)}...` : name) : 'Terpilih'}
                </div>
            )}
        </div>
    );
    return L.divIcon({
        html,
        className: 'cafe-marker-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

function makeOriginIcon(isManual) {
    const size = 38;
    const html = renderToStaticMarkup(
        <div className="relative flex items-center justify-center">
            <span className="absolute -inset-2 animate-pulse rounded-full bg-blue-500/30" />
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: '9999px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: '3px solid #ffffff',
                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Crosshair size={18} />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                {isManual ? 'Titik Awal' : 'Lokasi Anda'}
            </div>
        </div>
    );
    return L.divIcon({
        html,
        className: 'origin-marker-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

/* ------------------------------ Helper Utilities ------------------------------ */

function haversine(a, b) {
    if (!a || !b || a.lat == null || b.lat == null) return null;
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
}

const formatDistance = (m) => {
    if (m == null) return '-';
    return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
};

const formatDuration = (s) => {
    if (s == null) return '-';
    const min = Math.max(1, Math.round(s / 60));
    if (min < 60) return `${min} menit`;
    const hours = Math.floor(min / 60);
    const remMin = min % 60;
    return remMin > 0 ? `${hours} jam ${remMin} mnt` : `${hours} jam`;
};

function formatPrice(c) {
    if (!c || c.price_min == null) return 'Harga terjangkau';
    const k = (n) => `${Math.round(n / 1000)}k`;
    return c.price_min === c.price_max ? `Rp ${k(c.price_min)}` : `Rp ${k(c.price_min)}–${k(c.price_max)}`;
}

function getStepIcon(type, modifier) {
    if (type === 'arrive') return <MapPin className="h-3.5 w-3.5 text-emerald-600" />;
    if (type === 'roundabout' || type === 'rotary') return <RotateCcw className="h-3.5 w-3.5 text-amber-700" />;
    if (modifier?.includes('left')) return <CornerUpLeft className="h-3.5 w-3.5 text-blue-600" />;
    if (modifier?.includes('right')) return <CornerUpRight className="h-3.5 w-3.5 text-blue-600" />;
    return <ArrowUp className="h-3.5 w-3.5 text-stone-600" />;
}

/* ------------------------------ Leaflet Click Listener ------------------------------ */

function MapClickHandler({ isPickingLocation, onLocationPick }) {
    useMapEvents({
        click(e) {
            if (isPickingLocation && onLocationPick) {
                onLocationPick({ lat: e.latlng.lat, lng: e.latlng.lng, name: 'Titik Pilihan di Peta' });
            }
        },
    });
    return null;
}

/* ------------------------------ Main MapSection Component ------------------------------ */

export default function MapSection() {
    const [map, setMap] = useState(null);
    const [cafes, setCafes] = useState([]);
    const [loadingCafes, setLoadingCafes] = useState(true);
    const [activeFilters, setActiveFilters] = useState([]);
    const [searchCafeQuery, setSearchCafeQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Starting location (origin): GPS or manual
    const [origin, setOrigin] = useState({
        lat: 1.1305,
        lng: 104.0485,
        name: 'Batam Center (Default)',
        isManual: true,
    });
    const [isPickingLocation, setIsPickingLocation] = useState(false);

    // Address search state (Priority 2)
    const [addressQuery, setAddressQuery] = useState('');
    const [addressResults, setAddressResults] = useState([]);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);
    const searchDropdownRef = useRef(null);

    // Routing & OSRM state (Priority 5 & 6)
    const [profile, setProfile] = useState('driving-car');
    const [route, setRoute] = useState(null);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // Mobile view mode toggle (Priority 8)
    const [mobileTab, setMobileTab] = useState('map'); // 'map' | 'list' | 'route'

    /* 1. Fetch Cafes from Laravel API with fallback (Priority 1) */
    useEffect(() => {
        let isMounted = true;
        const fetchCafes = async () => {
            try {
                const res = await fetch('/api/cafes', { headers: { Accept: 'application/json' } });
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted && json.data && json.data.length > 0) {
                        setCafes(json.data);
                        setSelectedId(json.data[0].id);
                        setLoadingCafes(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn('API /api/cafes unavailable, using static dataset fallback.', err);
            }

            // Fallback to local json dataset
            if (isMounted) {
                const validStatic = fallbackCafesData.filter((c) => c.name && c.lat != null && c.lng != null);
                setCafes(validStatic);
                if (validStatic.length > 0) setSelectedId(validStatic[0].id);
                setLoadingCafes(false);
            }
        };

        fetchCafes();
        return () => {
            isMounted = false;
        };
    }, []);

    /* 2. Debounced Address Search for Starting Point (Priority 2) */
    useEffect(() => {
        if (!addressQuery || addressQuery.trim().length < 2) {
            setAddressResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoadingAddress(true);
            try {
                const res = await fetch(`/api/places/search?q=${encodeURIComponent(addressQuery)}`, {
                    headers: { Accept: 'application/json' },
                });
                if (res.ok) {
                    const json = await res.json();
                    setAddressResults(json.data || []);
                    setShowAddressDropdown(true);
                }
            } catch (err) {
                console.error('Error searching address:', err);
            } finally {
                setLoadingAddress(false);
            }
        }, 320);

        return () => clearTimeout(timer);
    }, [addressQuery]);

    // Close address dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setShowAddressDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* 3. Filter and Sort Cafes relative to Origin */
    const visibleCafes = useMemo(() => {
        const tests = FILTERS.filter((f) => activeFilters.includes(f.key)).map((f) => f.test);
        let list = cafes.filter((c) => tests.every((t) => t(c)));

        if (searchCafeQuery.trim()) {
            const q = searchCafeQuery.toLowerCase();
            list = list.filter(
                (c) =>
                    (c.name && c.name.toLowerCase().includes(q)) ||
                    (c.area && c.area.toLowerCase().includes(q)) ||
                    (c.address && c.address.toLowerCase().includes(q))
            );
        }

        if (origin) {
            return [...list].sort((a, b) => {
                const distA = haversine(origin, a) ?? Infinity;
                const distB = haversine(origin, b) ?? Infinity;
                return distA - distB;
            });
        }

        return list;
    }, [cafes, activeFilters, searchCafeQuery, origin]);

    const selected = useMemo(() => {
        return cafes.find((c) => c.id === selectedId) || visibleCafes[0] || cafes[0];
    }, [cafes, selectedId, visibleCafes]);

    /* Fit bounds whenever visible cafes change */
    useEffect(() => {
        if (!map || visibleCafes.length === 0 || route) return;
        const validCoords = visibleCafes.filter((c) => c.lat != null && c.lng != null).map((c) => [c.lat, c.lng]);
        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [map, activeFilters]);

    /* Invalidate Leaflet size to ensure tiles fill full width without clipping */
    useEffect(() => {
        if (!map) return;
        map.invalidateSize();
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);
        const handleResize = () => {
            map.invalidateSize();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [map, mobileTab]);

    /* Select Cafe */
    const selectCafe = (cafe) => {
        setSelectedId(cafe.id);
        setRoute(null);
        setError('');
        map?.flyTo([cafe.lat, cafe.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
    };

    /* Priority 4: Manual Origin Handlers */
    const handleSelectPresetOrigin = (preset) => {
        setOrigin({
            lat: preset.lat,
            lng: preset.lng,
            name: preset.name,
            isManual: true,
        });
        setIsPickingLocation(false);
        setRoute(null);
        setError('');
        map?.flyTo([preset.lat, preset.lng], 15, { duration: 0.6 });
    };

    const handleSelectAddressResult = (item) => {
        setOrigin({
            lat: item.lat,
            lng: item.lng,
            name: item.name || item.display_name.split(',')[0],
            isManual: true,
        });
        setAddressQuery(item.name || item.display_name.split(',')[0]);
        setShowAddressDropdown(false);
        setIsPickingLocation(false);
        setRoute(null);
        setError('');
        map?.flyTo([item.lat, item.lng], 15, { duration: 0.6 });
    };

    const handleMapLocationPick = (picked) => {
        setOrigin({
            lat: picked.lat,
            lng: picked.lng,
            name: `Titik Pilihan (${picked.lat.toFixed(4)}, ${picked.lng.toFixed(4)})`,
            isManual: true,
        });
        setIsPickingLocation(false);
        setRoute(null);
        setError('');
    };

    /* Request Browser GPS */
    const handleGetGPSLocation = () => {
        if (!navigator.geolocation) {
            setError('Browser Anda tidak mendukung Geolocation.');
            return;
        }

        setError('');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const userLoc = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    name: 'Lokasi GPS Saya',
                    isManual: false,
                };
                setOrigin(userLoc);
                setIsPickingLocation(false);
                setRoute(null);
                map?.flyTo([userLoc.lat, userLoc.lng], 15, { duration: 0.6 });
            },
            () => {
                setError('Izin GPS ditolak. Silakan gunakan pilihan lokasi manual di atas.');
            },
            { credentials: false, timeout: 8000 }
        );
    };

    /* Priority 5 & 6: OSRM Routing & Instructions */
    const handleStartRoute = async (nextProfile = profile) => {
        if (!selected || selected.lat == null || selected.lng == null) {
            setError('Pilih kafe tujuan terlebih dahulu.');
            return;
        }
        if (!origin || origin.lat == null || origin.lng == null) {
            setError('Tentukan titik awal perjalanan Anda.');
            return;
        }

        setError('');
        setLoadingRoute(true);

        try {
            const qs = new URLSearchParams({
                from_lat: origin.lat,
                from_lng: origin.lng,
                to_lat: selected.lat,
                to_lng: selected.lng,
                profile: nextProfile,
            });

            const res = await fetch(`/api/route?${qs}`, {
                headers: { Accept: 'application/json' },
            });

            if (!res.ok) throw new Error('Gagal memuat rute dari server.');
            const data = await res.json();

            setRoute(data);
            setShowInstructions(true);

            // Fit polyline bounds on map
            if (data.coordinates && data.coordinates.length > 0) {
                map?.fitBounds(L.latLngBounds(data.coordinates), { padding: [60, 60] });
            }

            // On mobile, switch to route tab if requested
            if (window.innerWidth < 1024) {
                setMobileTab('route');
            }
        } catch (e) {
            setRoute(null);
            setError(e.message || 'Tidak dapat menghitung rute saat ini.');
        } finally {
            setLoadingRoute(false);
        }
    };

    const changeProfile = (nextProfile) => {
        setProfile(nextProfile);
        if (route) {
            handleStartRoute(nextProfile);
        }
    };

    /* Priority 7: Google Maps Integration */
    const googleMapsUrl = useMemo(() => {
        if (!selected || selected.lat == null) return '#';
        const travelMode = PROFILES[profile]?.googleTravelMode || 'driving';
        if (origin && origin.lat != null) {
            return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${selected.lat},${selected.lng}&travelmode=${travelMode}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`;
    }, [selected, origin, profile]);

    const handleShare = async () => {
        if (!selected) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: selected.name,
                    text: `Temukan ${selected.name} di CafeFinder: ${selected.area || ''}`,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            // Cancelled
        }
    };

    const straightDist = origin && selected ? haversine(origin, selected) : null;
    const facilities = selected ? FACILITIES.filter((f) => selected[f.key] === true) : [];

    return (
        <section id="peta" className="w-full bg-stone-50 py-12 md:py-16 text-stone-900">
            {/* Full Width Container matching Hero, Ranking, and Featured */}
            <div className="w-full px-4 sm:px-6 lg:px-10">
                
                {/* ── Section Header ── */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/20 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                            <Compass className="h-3.5 w-3.5" /> Peta &amp; Navigasi Kafe
                        </div>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950 sm:text-3xl lg:text-4xl">
                            Eksplorasi &amp; Panduan Rute Kafe di Batam
                        </h2>
                        <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-stone-600">
                            Pilih titik awal Anda, temukan kafe terbaik dengan filter spesifik, dan dapatkan rute lengkap langkah demi langkah serta navigasi Google Maps.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-semibold text-stone-700">
                            {visibleCafes.length} dari {cafes.length} Kafe
                        </span>
                    </div>
                </div>

                {/* ── Priority 4 & 2: Origin Selection & Address Search Bar ── */}
                <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                        
                        {/* Address Autocomplete Input */}
                        <div ref={searchDropdownRef} className="relative flex-1">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                <input
                                    type="text"
                                    value={addressQuery}
                                    onChange={(e) => {
                                        setAddressQuery(e.target.value);
                                        setShowAddressDropdown(true);
                                    }}
                                    onFocus={() => setShowAddressDropdown(true)}
                                    placeholder="Ketik alamat atau mall (mis: Grand Batam, Nagoya, Batam Center)..."
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-900 transition"
                                />
                                {loadingAddress ? (
                                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-stone-400" />
                                ) : addressQuery ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddressQuery('');
                                            setAddressResults([]);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                ) : null}
                            </div>

                            {/* Dropdown Results */}
                            {showAddressDropdown && addressResults.length > 0 && (
                                <div className="absolute left-0 right-0 top-full z-1100 mt-1 max-h-60 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-xl">
                                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 bg-stone-50">
                                        Hasil Pencarian Lokasi
                                    </p>
                                    <ul className="divide-y divide-stone-100">
                                        {addressResults.map((item, idx) => (
                                            <li key={idx}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectAddressResult(item)}
                                                    className="flex w-full items-start gap-2.5 px-3 py-2 text-left hover:bg-amber-50/80 transition"
                                                >
                                                    <MapPin className="h-4 w-4 shrink-0 text-amber-800 mt-0.5" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-bold text-stone-950 truncate">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-[11px] text-stone-500 truncate">
                                                            {item.display_name}
                                                        </p>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons: GPS & Click-to-pick */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleGetGPSLocation}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition focus-visible:outline-none"
                                title="Gunakan koordinat GPS perangkat Anda"
                            >
                                <LocateFixed className="h-3.5 w-3.5 text-blue-600" />
                                <span>Lokasi GPS</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsPickingLocation((prev) => !prev)}
                                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                    isPickingLocation
                                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                                }`}
                                title="Klik titik mana pun pada peta untuk menetapkan lokasi awal"
                            >
                                <Crosshair className="h-3.5 w-3.5 text-blue-600" />
                                <span>{isPickingLocation ? 'Klik pada Peta...' : 'Pilih di Peta'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Presets & Active Origin Chip */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
                        <span className="font-semibold text-stone-400 text-[11px]">Cepat:</span>
                        {ORIGIN_PRESETS.map((p) => (
                            <button
                                key={p.name}
                                type="button"
                                onClick={() => handleSelectPresetOrigin(p)}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                                    origin.name === p.name
                                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                }`}
                            >
                                <span className="mr-1">{p.icon}</span>
                                {p.name}
                            </button>
                        ))}

                        <div className="ml-auto flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-900 border border-blue-200/60">
                            <Crosshair className="h-3 w-3 text-blue-600" />
                            <span>Titik Awal: <strong>{origin.name}</strong></span>
                        </div>
                    </div>
                </div>

                {/* ── Filter Controls Row ── */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {FILTERS.map((f) => {
                        const active = activeFilters.includes(f.key);
                        return (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() =>
                                    setActiveFilters((prev) =>
                                        prev.includes(f.key) ? prev.filter((k) => k !== f.key) : [...prev, f.key]
                                    )
                                }
                                aria-pressed={active}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                                    active
                                        ? 'border-amber-900 bg-amber-900 text-white'
                                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                }`}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Priority 8: Mobile Tab Switcher ── */}
                <div className="mt-4 flex lg:hidden items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold shadow-xs">
                    <button
                        type="button"
                        onClick={() => setMobileTab('map')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                            mobileTab === 'map' ? 'bg-[#56311F] text-white' : 'text-stone-600 hover:bg-stone-50'
                        }`}
                    >
                        <MapIcon className="h-3.5 w-3.5" /> Peta
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileTab('list')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                            mobileTab === 'list' ? 'bg-[#56311F] text-white' : 'text-stone-600 hover:bg-stone-50'
                        }`}
                    >
                        <List className="h-3.5 w-3.5" /> Daftar ({visibleCafes.length})
                    </button>
                    {route && (
                        <button
                            type="button"
                            onClick={() => setMobileTab('route')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                                mobileTab === 'route' ? 'bg-[#56311F] text-white' : 'text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            <Navigation className="h-3.5 w-3.5 text-amber-300" /> Rute
                        </button>
                    )}
                </div>

                {/* ── Main Content Grid: Map (8/12) + Sidebar (4/12) ── */}
                <div className="mt-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    
                    {/* ── Left Column: Leaflet Map (Priority 3 & 5) ── */}
                    <div
                        className={`relative isolate flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-md lg:col-span-8 ${
                            mobileTab !== 'map' ? 'hidden lg:flex' : 'flex'
                        } min-h-125 lg:min-h-155`}
                    >
                        {isPickingLocation && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
                                <Crosshair className="h-3.5 w-3.5" />
                                <span>Klik pada peta untuk menetapkan titik awal</span>
                            </div>
                        )}

                        <MapContainer
                            ref={setMap}
                            center={[origin.lat, origin.lng]}
                            zoom={13}
                            zoomControl={false}
                            scrollWheelZoom={true}
                            className="h-full w-full flex-1 min-h-120 lg:min-h-150 z-0"
                            aria-label="Peta kafe Batam"
                        >
                            <TileLayer
                                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                maxZoom={19}
                            />

                            {/* Click listener for manual location pick */}
                            <MapClickHandler
                                isPickingLocation={isPickingLocation}
                                onLocationPick={handleMapLocationPick}
                            />

                            {/* Origin Marker */}
                            {origin && origin.lat != null && (
                                <Marker
                                    position={[origin.lat, origin.lng]}
                                    icon={makeOriginIcon(origin.isManual)}
                                    zIndexOffset={1200}
                                />
                            )}

                            {/* Cafe Markers */}
                            {visibleCafes.map((cafe) => {
                                if (cafe.lat == null || cafe.lng == null) return null;
                                const isSelected = cafe.id === selectedId;
                                return (
                                    <Marker
                                        key={cafe.id}
                                        position={[cafe.lat, cafe.lng]}
                                        icon={makeCafeIcon(isSelected, cafe.name)}
                                        zIndexOffset={isSelected ? 1000 : 100}
                                        eventHandlers={{
                                            click: () => selectCafe(cafe),
                                        }}
                                    />
                                );
                            })}

                            {/* Polyline Route Display (Priority 6) */}
                            {route && route.coordinates && (
                                <Polyline
                                    positions={route.coordinates}
                                    pathOptions={{
                                        color: '#56311F',
                                        weight: 6,
                                        opacity: 0.9,
                                        lineCap: 'round',
                                        lineJoin: 'round',
                                    }}
                                />
                            )}
                        </MapContainer>

                        {/* Floating Map Zoom / Center Controls */}
                        <div className="absolute left-4 top-4 z-1000 flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white/95 shadow-md backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => map?.zoomIn()}
                                className="p-2.5 hover:bg-stone-100 transition"
                                aria-label="Perbesar"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => map?.zoomOut()}
                                className="border-t border-stone-200 p-2.5 hover:bg-stone-100 transition"
                                aria-label="Perkecil"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (origin) map?.flyTo([origin.lat, origin.lng], 15, { duration: 0.6 });
                                }}
                                className="border-t border-stone-200 p-2.5 hover:bg-stone-100 transition"
                                aria-label="Pusatkan ke lokasi awal"
                                title="Pusatkan ke lokasi awal"
                            >
                                <LocateFixed className="h-4 w-4 text-blue-600" />
                            </button>
                        </div>

                        {/* Bottom Floating Navigation Toolbar */}
                        <div className="absolute bottom-4 left-4 right-4 z-1000 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
                            {/* Profile Selector */}
                            <div className="flex shrink-0 overflow-hidden rounded-xl border border-stone-200 text-xs">
                                {Object.entries(PROFILES).map(([key, { label, Icon }]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => changeProfile(key)}
                                        className={`flex items-center gap-1.5 px-3 py-2 font-medium transition ${
                                            profile === key
                                                ? 'bg-[#56311F] text-white font-bold'
                                                : 'bg-white text-stone-700 hover:bg-stone-50'
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">{label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Summary Text */}
                            <div className="min-w-0 flex-1 text-xs">
                                <p className="font-bold text-stone-950 truncate">
                                    {route
                                        ? `${route.distance_formatted} • ${route.duration_formatted} (${PROFILES[profile]?.label})`
                                        : straightDist != null
                                        ? `±${formatDistance(straightDist)} garis lurus dari ${origin.name}`
                                        : selected?.name || 'Pilih kafe'}
                                </p>
                                <p className={`truncate text-[11px] ${error ? 'text-red-600 font-semibold' : 'text-stone-500'}`}>
                                    {error || (route ? 'Rute aktif di peta' : 'Tekan Mulai Rute untuk panduan jalan')}
                                </p>
                            </div>

                            {/* Route Action Button (Priority 5) */}
                            <button
                                type="button"
                                onClick={() => handleStartRoute()}
                                disabled={loadingRoute}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#56311F] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#6e3f28] disabled:opacity-60 transition"
                            >
                                {loadingRoute ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Navigation className="h-3.5 w-3.5" />
                                )}
                                <span>{route ? 'Perbarui Rute' : 'Mulai Rute'}</span>
                            </button>

                            {/* Google Maps Button (Priority 7) */}
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                                title="Buka navigasi suara di Google Maps"
                            >
                                <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                                <span className="hidden sm:inline">Google</span> Maps
                            </a>

                            {/* Clear Route if active */}
                            {route && (
                                <button
                                    type="button"
                                    onClick={() => setRoute(null)}
                                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                                    title="Tutup rute"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Right Column: Cafe Info & Turn-by-Turn Instructions (4/12) ── */}
                    <aside
                        className={`flex flex-col gap-4 lg:col-span-4 ${
                            mobileTab === 'map' ? 'hidden lg:flex' : 'flex'
                        }`}
                    >
                        {/* Selected Cafe Card */}
                        {selected && (
                            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                                            Spot Terpilih
                                        </span>
                                        <h3 className="mt-2 text-lg font-bold text-stone-950">
                                            {selected.name}
                                        </h3>
                                        <p className="text-xs text-stone-500">
                                            {selected.area || selected.address || 'Batam'}
                                        </p>
                                    </div>
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#56311F] text-white shadow-xs">
                                        <Coffee className="h-5 w-5" />
                                    </span>
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-xl border border-stone-100 bg-stone-50 p-2.5">
                                        <Clock3 className="mx-auto h-3.5 w-3.5 text-amber-900" />
                                        <p className="mt-1 text-xs font-bold text-stone-900">
                                            {route ? route.duration_formatted : straightDist != null ? formatDistance(straightDist) : '-'}
                                        </p>
                                        <p className="text-[10px] text-stone-500">
                                            {route ? PROFILES[profile]?.label : 'Jarak'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-stone-100 bg-stone-50 p-2.5">
                                        <Wifi className="mx-auto h-3.5 w-3.5 text-amber-900" />
                                        <p className="mt-1 text-xs font-bold text-stone-900">
                                            {selected.wifi_speed ? `${selected.wifi_speed} Mbps` : selected.wifi ? `${selected.wifi}/5` : 'Tersedia'}
                                        </p>
                                        <p className="text-[10px] text-stone-500">WiFi</p>
                                    </div>
                                    <div className="rounded-xl border border-stone-100 bg-stone-50 p-2.5">
                                        <Wallet className="mx-auto h-3.5 w-3.5 text-amber-900" />
                                        <p className="mt-1 text-xs font-bold text-stone-900">
                                            {formatPrice(selected)}
                                        </p>
                                        <p className="text-[10px] text-stone-500">Kisaran</p>
                                    </div>
                                </div>

                                {/* Facilities Pills */}
                                {facilities.length > 0 && (
                                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                                        {facilities.map((f) => (
                                            <span
                                                key={f.key}
                                                className="rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900"
                                            >
                                                ✓ {f.label}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Note */}
                                {selected.note && (
                                    <p className="mt-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                                        {selected.note}
                                    </p>
                                )}

                                {/* Share & Google Maps Action Bar (Priority 7) */}
                                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-stone-100">
                                    <a
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        <span>Buka Google Maps</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={handleShare}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                                            copied
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                        }`}
                                        title="Bagikan koordinat kafe"
                                    >
                                        <Share2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Priority 6: Turn-by-Turn Route Instructions Panel */}
                        {route && (
                            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Navigation className="h-4 w-4 text-[#56311F]" />
                                        <h4 className="text-sm font-bold text-stone-950">
                                            Instruksi Rute ({route.steps?.length || 0} Langkah)
                                        </h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowInstructions((prev) => !prev)}
                                        className="text-stone-400 hover:text-stone-700 p-1"
                                    >
                                        {showInstructions ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {showInstructions && (
                                    <div className="mt-3">
                                        <div className="mb-2 flex items-center justify-between text-xs font-bold text-stone-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200/60">
                                            <span>Total: {route.distance_formatted}</span>
                                            <span>Est: {route.duration_formatted}</span>
                                        </div>

                                        <ol className="max-h-64 space-y-2 overflow-y-auto pr-1 text-xs">
                                            {route.steps?.map((step) => (
                                                <li
                                                    key={step.index}
                                                    className="flex items-start gap-2.5 rounded-xl border border-stone-100 bg-stone-50/70 p-2.5 hover:bg-stone-100/70 transition"
                                                >
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white border border-stone-200 shadow-2xs mt-0.5">
                                                        {getStepIcon(step.type, step.modifier)}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-stone-900">
                                                            {step.instruction}
                                                        </p>
                                                        <p className="text-[10px] text-stone-500 mt-0.5">
                                                            {step.distance_formatted} • {step.duration_formatted}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cafe List Section (with distance relative to Origin) */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-stone-950">
                                    Kafe Terdekat dari {origin.name}
                                </h4>
                                <span className="text-[11px] font-semibold text-stone-400">
                                    {visibleCafes.length} spot
                                </span>
                            </div>

                            <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                                {visibleCafes.map((c) => {
                                    const isSelected = c.id === selectedId;
                                    const dist = haversine(origin, c);
                                    return (
                                        <li key={c.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    selectCafe(c);
                                                    if (window.innerWidth < 1024) setMobileTab('map');
                                                }}
                                                className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-left transition ${
                                                    isSelected
                                                        ? 'border-[#56311F] bg-[#56311F]/5 ring-1 ring-[#56311F]/20'
                                                        : 'border-stone-200 bg-white hover:bg-stone-50'
                                                }`}
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#56311F]' : 'text-stone-900'}`}>
                                                        {c.name}
                                                    </p>
                                                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                                                        {c.area || c.address || 'Batam'}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <span className="block text-xs font-bold text-amber-900">
                                                        {dist != null ? formatDistance(dist) : formatPrice(c)}
                                                    </span>
                                                    <span className="text-[10px] text-stone-400">
                                                        WiFi {c.wifi ?? c.wifi_rating ?? 4}/5
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}

                                {visibleCafes.length === 0 && (
                                    <li className="py-6 text-center text-xs text-stone-500">
                                        Tidak ada kafe yang cocok dengan filter yang dipilih.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </aside>

                </div>
            </div>
        </section>
    );
}
