import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker } from 'react-leaflet';
import {
    Footprints, Car, Zap, Share2, Plus, Minus, LocateFixed, Navigation,
    Coffee, Wifi, Clock3, ExternalLink, Loader2, Wallet,
} from 'lucide-react';
import cafesData from '../data/cafes.json';

/* Hanya kafe yang punya nama dan koordinat yang tampil di peta */
const CAFES = cafesData.filter((c) => c.name && c.lat != null && c.lng != null);

const FILTERS = [
    { key: 'wifi', label: 'WiFi Cepat', test: (c) => (c.wifi ?? 0) >= 4 },
    { key: 'coworking', label: 'Coworking', test: (c) => c.coworking === true },
    { key: 'long_table', label: 'Long Table', test: (c) => c.long_table === true },
    { key: 'smoking', label: 'Smoking Area', test: (c) => c.smoking === true },
    { key: 'mushola', label: 'Mushola', test: (c) => c.mushola === true },
];

const FACILITIES = [
    { key: 'coworking', label: 'Coworking' },
    { key: 'long_table', label: 'Long table' },
    { key: 'smoking', label: 'Smoking area' },
    { key: 'mushola', label: 'Mushola' },
];

const PROFILES = {
    'foot-walking': { label: 'Jalan kaki', Icon: Footprints },
    'driving-car': { label: 'Motor / mobil', Icon: Car },
};

const ALL_BOUNDS = CAFES.length > 0 ? L.latLngBounds(CAFES.map((c) => [c.lat, c.lng])) : null;

/* ------------------------------ Helpers ------------------------------ */
function makeCafeIcon(selected) {
    const size = selected ? 40 : 32;
    const html = renderToStaticMarkup(
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '9999px',
                background: selected ? '#78350f' : '#ffffff',
                color: selected ? '#ffffff' : '#78350f',
                border: '2px solid #78350f',
                boxShadow: '0 2px 6px rgba(0,0,0,.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Coffee size={selected ? 20 : 15} />
        </div>,
    );
    return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

const ICON_CACHE = { normal: makeCafeIcon(false), selected: makeCafeIcon(true) };

function haversine(a, b) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
}

const formatDistance = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);
const formatDuration = (s) => `${Math.max(1, Math.round(s / 60))} menit`;

function formatPrice(c) {
    if (c.price_min == null) return 'Harga belum ada';
    const k = (n) => `${Math.round(n / 1000)}k`;
    return c.price_min === c.price_max ? `Rp ${k(c.price_min)}` : `Rp ${k(c.price_min)}–${k(c.price_max)}`;
}

/* ----------------------------- Component ----------------------------- */
export default function MapSection() {
    const [map, setMap] = useState(null);
    const [activeFilters, setActiveFilters] = useState([]);
    const [selectedId, setSelectedId] = useState(CAFES[0]?.id);
    const [userPos, setUserPos] = useState(null);
    const [profile, setProfile] = useState('foot-walking');
    const [route, setRoute] = useState(null);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const selected = CAFES.find((c) => c.id === selectedId) ?? CAFES[0];

    const visibleCafes = useMemo(() => {
        const tests = FILTERS.filter((f) => activeFilters.includes(f.key)).map((f) => f.test);
        const list = CAFES.filter((c) => tests.every((t) => t(c)));
        if (!userPos) return list;
        return [...list].sort((a, b) => haversine(userPos, a) - haversine(userPos, b));
    }, [activeFilters, userPos]);

    useEffect(() => {
        if (!map || visibleCafes.length === 0) return;
        const bounds = L.latLngBounds(visibleCafes.map((c) => [c.lat, c.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }, [map, activeFilters]);

    const toggleFilter = (key) =>
        setActiveFilters((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

    const selectCafe = (cafe) => {
        setSelectedId(cafe.id);
        setRoute(null);
        setError('');
        map?.flyTo([cafe.lat, cafe.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
    };

    const getUserPosition = useCallback(
        () =>
            new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Browser tidak mendukung geolocation.'));
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                        setUserPos(p);
                        resolve(p);
                    },
                    () => reject(new Error('Izin lokasi ditolak atau lokasi tidak tersedia.')),
                    { enableHighAccuracy: true, timeout: 10000 },
                );
            }),
        [],
    );

    const handleLocate = async () => {
        setError('');
        try {
            const p = await getUserPosition();
            map?.flyTo([p.lat, p.lng], 15, { duration: 0.6 });
        } catch (e) {
            setError(e.message);
        }
    };

    const handleStartRoute = async (nextProfile = profile) => {
        setError('');
        setLoadingRoute(true);
        try {
            const from = userPos ?? (await getUserPosition());
            const qs = new URLSearchParams({
                from_lat: from.lat,
                from_lng: from.lng,
                to_lat: selected.lat,
                to_lng: selected.lng,
                profile: nextProfile,
            });
            const res = await fetch(`/api/route?${qs}`, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Rute tidak tersedia saat ini.');
            const data = await res.json();
            setRoute(data);
            map?.fitBounds(L.latLngBounds(data.coordinates), { padding: [60, 60] });
        } catch (e) {
            setRoute(null);
            setError(e.message);
        } finally {
            setLoadingRoute(false);
        }
    };

    const changeProfile = (p) => {
        setProfile(p);
        if (route) handleStartRoute(p);
    };

    const googleMapsUrl = selected
        ? `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}&travelmode=${
              profile === 'foot-walking' ? 'walking' : 'driving'
          }`
        : '#';

    const handleShare = async () => {
        const url = `https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: selected.name, text: selected.area ?? '', url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            /* dibatalkan */
        }
    };

    if (!selected) return null;

    const straight = userPos ? haversine(userPos, selected) : null;
    const barTitle = route
        ? `${formatDistance(route.distance)} dari lokasimu • ${formatDuration(route.duration)} ${PROFILES[profile].label.toLowerCase()}`
        : straight !== null
            ? `±${formatDistance(straight)} dari lokasimu (garis lurus)`
            : selected.name;
    const barSub = error
        ? error
        : route
            ? 'Rute ditampilkan di peta'
            : userPos
                ? 'Tekan Mulai Rute untuk melihat jalur'
                : 'Aktifkan lokasi untuk melihat jarak dan rute';

    const facilities = FACILITIES.filter((f) => selected[f.key] === true);

    return (
        <section id="peta" className="w-full bg-stone-50 py-12 md:py-16">
            {/* Full Width Container */}
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Peta Discovery</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl">
                        Lihat Pin Kafe Dekat Lokasimu
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
                        Bandingkan spot dengan filter seperti WiFi Cepat, Coworking, Long Table, dan Mushola untuk menentukan tempat nongkrong atau kerja.
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                    {FILTERS.map((f) => {
                        const active = activeFilters.includes(f.key);
                        return (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => toggleFilter(f.key)}
                                aria-pressed={active}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                                    active
                                        ? 'border-amber-900 bg-amber-900 text-white'
                                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                                }`}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                    <span className="ml-2 text-xs font-medium text-stone-500">
                        {visibleCafes.length} dari {CAFES.length} kafe
                    </span>
                </div>

                {/* Main Content Grid */}
                <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                    
                    {/* Left Column: Leaflet Map (8/12) */}
                    <div className="relative isolate flex min-h-130 flex-col overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-sm lg:col-span-8 lg:min-h-155">
                        {ALL_BOUNDS && (
                            <MapContainer
                                ref={setMap}
                                bounds={ALL_BOUNDS}
                                boundsOptions={{ padding: [40, 40] }}
                                zoomControl={false}
                                scrollWheelZoom
                                className="h-full w-full flex-1 min-h-112.5"
                                aria-label="Peta kafe di Batam"
                            >
                                <TileLayer
                                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    maxZoom={19}
                                />

                                {visibleCafes.map((cafe) => (
                                    <Marker
                                        key={cafe.id}
                                        position={[cafe.lat, cafe.lng]}
                                        icon={cafe.id === selectedId ? ICON_CACHE.selected : ICON_CACHE.normal}
                                        zIndexOffset={cafe.id === selectedId ? 1000 : 0}
                                        eventHandlers={{ click: () => selectCafe(cafe) }}
                                    />
                                ))}

                                {userPos && (
                                    <CircleMarker
                                        center={[userPos.lat, userPos.lng]}
                                        radius={8}
                                        pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }}
                                    />
                                )}

                                {route && (
                                    <Polyline positions={route.coordinates} pathOptions={{ color: '#78350f', weight: 5, opacity: 0.85 }} />
                                )}
                            </MapContainer>
                        )}

                        {/* Map Control Buttons */}
                        <div className="absolute left-4 top-4 z-1000 flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white/90 shadow-md backdrop-blur-md">
                            <button type="button" onClick={() => map?.zoomIn()} className="p-2.5 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900" aria-label="Perbesar"><Plus className="h-4 w-4" /></button>
                            <button type="button" onClick={() => map?.zoomOut()} className="border-t border-stone-200 p-2.5 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900" aria-label="Perkecil"><Minus className="h-4 w-4" /></button>
                            <button type="button" onClick={handleLocate} className="border-t border-stone-200 p-2.5 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900" aria-label="Lokasi saya"><LocateFixed className="h-4 w-4 text-amber-900" /></button>
                        </div>

                        {/* Selected Header Chip */}
                        <div className="pointer-events-none absolute left-1/2 top-4 z-1000 max-w-[70%] -translate-x-1/2 rounded-2xl border border-stone-200 bg-white/90 px-4 py-2.5 text-xs shadow-md backdrop-blur-md text-center">
                            <p className="truncate font-bold text-stone-950">{selected.name}</p>
                            <p className="mt-0.5 text-[11px] text-stone-600">WiFi {selected.wifi ?? '-'}/5 • {formatPrice(selected)}</p>
                        </div>

                        {/* Bottom Floating Navigation Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 z-1000 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-900">
                                {(() => {
                                    const Icon = PROFILES[profile].Icon;
                                    return <Icon className="h-5 w-5" />;
                                })()}
                            </span>
                            <div className="min-w-0 flex-1 text-xs">
                                <p className="font-bold text-stone-950">{barTitle}</p>
                                <p className={`mt-0.5 ${error ? 'text-red-600' : 'text-stone-500'}`}>{barSub}</p>
                            </div>

                            <div className="flex shrink-0 overflow-hidden rounded-xl border border-stone-200 text-xs">
                                {Object.entries(PROFILES).map(([key, { label, Icon }]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => changeProfile(key)}
                                        aria-label={label}
                                        title={label}
                                        className={`p-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 ${profile === key ? 'bg-amber-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleStartRoute()}
                                disabled={loadingRoute}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loadingRoute ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
                                Mulai Rute
                            </button>

                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                                title="Navigasi suara lewat Google Maps"
                            >
                                <ExternalLink className="h-3.5 w-3.5" /> Maps
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Cafe Info Sidebar (4/12) */}
                    <aside className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-5 shadow-sm lg:col-span-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Spot Terpilih</p>
                            <div className="mt-1">
                                <h3 className="text-xl font-bold text-stone-950">{selected.name}</h3>
                                <p className="text-xs text-stone-500">{selected.area ?? selected.district ?? 'Area belum diisi'}</p>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-3">
                                    <Clock3 className="h-4 w-4 text-amber-900" />
                                    <p className="mt-2 text-xs font-bold text-stone-950">
                                        {route ? formatDuration(route.duration) : straight !== null ? `±${formatDistance(straight)}` : '-'}
                                    </p>
                                    <p className="text-[10px] text-stone-500">{PROFILES[profile].label}</p>
                                </div>
                                <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-3">
                                    <Wifi className="h-4 w-4 text-amber-900" />
                                    <p className="mt-2 text-xs font-bold text-stone-950">{selected.wifi ? `${selected.wifi}/5` : '-'}</p>
                                    <p className="text-[10px] text-stone-500">WiFi</p>
                                </div>
                                <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-3">
                                    <Wallet className="h-4 w-4 text-amber-900" />
                                    <p className="mt-2 text-xs font-bold text-stone-950">{formatPrice(selected)}</p>
                                    <p className="text-[10px] text-stone-500">Harga</p>
                                </div>
                            </div>

                            {/* Facilities & Note */}
                            {(facilities.length > 0 || selected.note) && (
                                <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3.5 text-xs">
                                    {facilities.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {facilities.map((f) => (
                                                <span key={f.key} className="rounded-full bg-amber-100/80 px-2.5 py-0.5 font-semibold text-amber-900">
                                                    {f.label}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {selected.note && <p className={`text-stone-600 ${facilities.length ? 'mt-2.5' : ''}`}>{selected.note}</p>}
                                </div>
                            )}

                            {/* Cafe List */}
                            <div className="mt-5">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                    {userPos ? 'Kafe Terdekat' : 'Daftar Kafe'}
                                </p>
                                <ul className="mt-2 max-h-52 space-y-1.5 overflow-y-auto pr-1">
                                    {visibleCafes.map((c) => (
                                        <li key={c.id}>
                                            <button
                                                type="button"
                                                onClick={() => selectCafe(c)}
                                                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${
                                                    c.id === selectedId
                                                        ? 'border-amber-900 bg-amber-50/80 font-bold text-amber-950'
                                                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                                                }`}
                                            >
                                                <span className="truncate">{c.name}</span>
                                                <span className="shrink-0 text-[11px] text-stone-500">
                                                    {userPos ? formatDistance(haversine(userPos, c)) : formatPrice(c)}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                    {visibleCafes.length === 0 && (
                                        <li className="text-xs text-stone-500">Belum ada kafe yang cocok dengan filter ini.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar Buttons */}
                        <div className="mt-6 space-y-2 pt-4 border-t border-stone-100">
                            <a
                                href="#pesanan"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-900 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2"
                            >
                                <Zap className="h-4 w-4" /> Pesan & Bayar Kasir
                            </a>
                            <button
                                type="button"
                                onClick={handleShare}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2 ${
                                    copied
                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                }`}
                            >
                                <Share2 className="h-4 w-4" />
                                {copied ? '✓ Link Berhasil Disalin!' : 'Bagikan Pin Lokasi'}
                            </button>
                        </div>
                    </aside>

                </div>
            </div>
        </section>
    );
}