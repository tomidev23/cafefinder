import { useCallback, useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker } from 'react-leaflet';
import {
    Footprints, Car, Zap, Share2, Plus, Minus, LocateFixed, Navigation,
    Coffee, Wifi, PawPrint, Clock3, ExternalLink, Loader2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Data contoh. Ganti dengan data dari Laravel (Inertia props / API). */
/* Koordinat hanya perkiraan, sesuaikan dengan lokasi sebenarnya.      */
/* ------------------------------------------------------------------ */
const CAFES = [
    {
        id: 1,
        name: 'Common Grounds Batam',
        area: 'Batam Center • dekat One Batam Mall',
        lat: 1.1297,
        lng: 104.0531,
        tags: ['WiFi Cepat', 'Pet Friendly', 'Outdoor Area', 'Manual Brew'],
        price: 'Rp 30k–65k',
        open: true,
        wifiMbps: 180,
        occupancy: 72,
        seats: 'Indoor: 4 meja kosong • Outdoor: 8 kursi kosong',
        brew: 'Manual Brew V60 - Ethiopia Natural (Rp 42.000)',
    },
    {
        id: 2,
        name: 'Kafe Contoh A',
        area: 'Batam Center',
        lat: 1.1262,
        lng: 104.0498,
        tags: ['WiFi Cepat', '24 Jam'],
        price: 'Rp 20k–45k',
        open: true,
        wifiMbps: 90,
        occupancy: 45,
        seats: 'Indoor: 10 meja kosong',
        brew: 'Es Kopi Susu Aren (Rp 25.000)',
    },
    {
        id: 3,
        name: 'Kafe Contoh B',
        area: 'Batam Center',
        lat: 1.1331,
        lng: 104.0562,
        tags: ['Pet Friendly', 'Outdoor Area', 'Manual Brew'],
        price: 'Rp 28k–60k',
        open: false,
        wifiMbps: 40,
        occupancy: 0,
        seats: 'Tutup, buka besok 08.00',
        brew: 'Manual Brew Aceh Gayo (Rp 38.000)',
    },
];

const FILTERS = ['WiFi Cepat', 'Pet Friendly', 'Outdoor Area', 'Manual Brew', '24 Jam'];
const DEFAULT_CENTER = [1.1297, 104.0531];

const PROFILES = {
    'foot-walking': { label: 'Jalan kaki', Icon: Footprints },
    'driving-car': { label: 'Motor / mobil', Icon: Car },
};

/* ------------------------------ helpers ------------------------------ */
function makeCafeIcon(selected) {
    const html = renderToStaticMarkup(
        <div
            style={{
                width: selected ? 40 : 34,
                height: selected ? 40 : 34,
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
            <Coffee size={selected ? 20 : 16} />
        </div>,
    );
    const size = selected ? 40 : 34;
    return L.divIcon({
        html,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

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

/* ----------------------------- component ----------------------------- */
export default function MapSection() {
    const [map, setMap] = useState(null);
    const [activeTags, setActiveTags] = useState([]);
    const [selectedId, setSelectedId] = useState(CAFES[0].id);
    const [userPos, setUserPos] = useState(null); // { lat, lng }
    const [profile, setProfile] = useState('foot-walking');
    const [route, setRoute] = useState(null); // { coordinates, distance, duration }
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [error, setError] = useState('');

    const selected = CAFES.find((c) => c.id === selectedId) ?? CAFES[0];

    const visibleCafes = useMemo(
        () => CAFES.filter((c) => activeTags.every((t) => c.tags.includes(t))),
        [activeTags],
    );

    const toggleTag = (tag) =>
        setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

    const selectCafe = (cafe) => {
        setSelectedId(cafe.id);
        setRoute(null);
        setError('');
        map?.flyTo([cafe.lat, cafe.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
    };

    /* Ambil posisi pengguna (butuh HTTPS, kecuali localhost). */
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
            map?.flyTo([p.lat, p.lng], 16, { duration: 0.6 });
        } catch (e) {
            setError(e.message);
        }
    };

    /* Minta rute ke endpoint Laravel (proxy ke OpenRouteService). */
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
        if (route) handleStartRoute(p); // hitung ulang kalau rute sedang tampil
    };

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}&travelmode=${
        profile === 'foot-walking' ? 'walking' : 'driving'
    }`;

    const handleShare = async () => {
        const url = `https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: selected.name, text: selected.area, url });
            } else {
                await navigator.clipboard.writeText(url);
                setError('');
                alert('Link lokasi disalin.');
            }
        } catch {
            /* dibatalkan pengguna */
        }
    };

    /* Info di bar bawah peta */
    const straight = userPos ? haversine(userPos, selected) : null;
    const barTitle = route
        ? `${formatDistance(route.distance)} dari lokasi mu • ${formatDuration(route.duration)} ${PROFILES[profile].label.toLowerCase()}`
        : straight !== null
            ? `±${formatDistance(straight)} dari lokasi mu (garis lurus)`
            : selected.name;
    const barSub = error
        ? error
        : route
            ? 'Rute ditampilkan di peta'
            : userPos
                ? 'Tekan Mulai Rute untuk melihat jalur'
                : 'Aktifkan lokasi untuk melihat jarak dan rute';

    return (
        <section id="peta" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Peta discovery</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-stone-950">Lihat pin kafe yang dekat dengan posisi kamu</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Bandingkan spot dengan tag seperti WiFi Cepat, Pet Friendly, dan area outdoor. Fokusnya tetap ke keputusan datang, bukan sekadar lihat peta cantik.</p>

            <div className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((item) => {
                    const active = activeTags.includes(item);
                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => toggleTag(item)}
                            aria-pressed={active}
                            className={`rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition ${
                                active
                                    ? 'border-amber-900 bg-amber-900 text-white'
                                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 grid gap-6 rounded-4xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60 lg:grid-cols-[2fr_1fr]">
                <div className="relative isolate overflow-hidden rounded-3xl bg-stone-100">
                    <MapContainer
                        ref={setMap}
                        center={DEFAULT_CENTER}
                        zoom={15}
                        zoomControl={false}
                        scrollWheelZoom
                        className="h-105 w-full"
                        aria-label="Peta kafe sekitar area Batam Center"
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
                                icon={makeCafeIcon(cafe.id === selectedId)}
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
                            <Polyline
                                positions={route.coordinates}
                                pathOptions={{ color: '#78350f', weight: 5, opacity: 0.85 }}
                            />
                        )}
                    </MapContainer>

                    {/* Kontrol zoom / lokasi (z-[1000] agar di atas pane Leaflet) */}
                    <div className="absolute left-4 top-4 z-[1000] flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <button type="button" onClick={() => map?.zoomIn()} className="p-2 hover:bg-stone-100" aria-label="Perbesar"><Plus className="h-4 w-4" /></button>
                        <button type="button" onClick={() => map?.zoomOut()} className="border-t border-stone-200 p-2 hover:bg-stone-100" aria-label="Perkecil"><Minus className="h-4 w-4" /></button>
                        <button type="button" onClick={handleLocate} className="border-t border-stone-200 p-2 hover:bg-stone-100" aria-label="Lokasi saya"><LocateFixed className="h-4 w-4" /></button>
                    </div>

                    {/* Chip spot terpilih */}
                    <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs shadow-sm">
                        <p className="font-semibold text-stone-950">{selected.name}</p>
                        <p className="mt-1 text-stone-600">{selected.tags[0]} • {selected.price}</p>
                    </div>

                    {/* Bar rute */}
                    <div className="absolute bottom-4 left-4 right-4 z-[1000] flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-900">
                            {(() => {
                                const Icon = PROFILES[profile].Icon;
                                return <Icon className="h-4 w-4" />;
                            })()}
                        </span>
                        <div className="min-w-0 flex-1 text-xs">
                            <p className="font-semibold text-stone-950">{barTitle}</p>
                            <p className={`mt-1 ${error ? 'text-red-600' : 'text-stone-500'}`}>{barSub}</p>
                        </div>

                        <div className="flex overflow-hidden rounded-xl border border-stone-200 text-xs">
                            {Object.entries(PROFILES).map(([key, { label, Icon }]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => changeProfile(key)}
                                    aria-label={label}
                                    title={label}
                                    className={`p-2.5 ${profile === key ? 'bg-amber-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleStartRoute()}
                            disabled={loadingRoute || !selected.open}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingRoute ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
                            Mulai Rute
                        </button>

                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
                            title="Navigasi suara lewat Google Maps"
                        >
                            <ExternalLink className="h-3.5 w-3.5" /> Buka di Maps
                        </a>
                    </div>
                </div>

                <aside className="flex flex-col rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Spot terpilih</p>
                    <div className="mt-2 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-base font-semibold text-stone-950">{selected.name}</h3>
                            <p className="text-xs text-stone-500">{selected.area}</p>
                        </div>
                        <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                selected.open ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-600'
                            }`}
                        >
                            {selected.open ? 'Buka' : 'Tutup'}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl border border-stone-200 bg-white p-3">
                            <Clock3 className="h-4 w-4 text-amber-900" />
                            <p className="mt-2 font-semibold text-stone-950">
                                {route ? formatDuration(route.duration) : straight !== null ? `±${formatDistance(straight)}` : '-'}
                            </p>
                            <p className="text-[11px] text-stone-500">{PROFILES[profile].label}</p>
                        </div>
                        <div className="rounded-2xl border border-stone-200 bg-white p-3">
                            {selected.tags.includes('Pet Friendly') ? (
                                <>
                                    <PawPrint className="h-4 w-4 text-amber-900" />
                                    <p className="mt-2 font-semibold text-stone-950">Pet friendly</p>
                                    <p className="text-[11px] text-stone-500">
                                        {selected.tags.includes('Outdoor Area') ? 'Area outdoor teduh' : 'Boleh bawa hewan'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Wifi className="h-4 w-4 text-amber-900" />
                                    <p className="mt-2 font-semibold text-stone-950">{selected.wifiMbps} Mbps</p>
                                    <p className="text-[11px] text-stone-500">Kecepatan WiFi</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 text-xs">
                        <div className="flex justify-between font-medium text-stone-700">
                            <span>Kapasitas ruang nyata</span>
                            <span className="text-amber-900">{selected.occupancy}% terisi</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-stone-200">
                            <div
                                className="h-2 rounded-full bg-emerald-600 transition-all"
                                style={{ width: `${selected.occupancy}%` }}
                            />
                        </div>
                        <p className="mt-2 text-[11px] text-stone-500">{selected.seats}</p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs">
                        <p className="font-semibold text-stone-950">Seduhan rekomendasi</p>
                        <p className="mt-1 text-stone-600">{selected.brew}</p>
                    </div>

                    {visibleCafes.length > 1 && (
                        <div className="mt-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Spot lain</p>
                            <ul className="mt-2 space-y-1.5">
                                {visibleCafes.filter((c) => c.id !== selectedId).map((c) => (
                                    <li key={c.id}>
                                        <button
                                            type="button"
                                            onClick={() => selectCafe(c)}
                                            className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 text-left text-xs hover:bg-stone-100"
                                        >
                                            <span className="font-medium text-stone-800">{c.name}</span>
                                            <span className="text-stone-500">{c.price}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {visibleCafes.length === 0 && (
                        <p className="mt-4 text-xs text-stone-500">Belum ada kafe yang cocok dengan filter ini.</p>
                    )}

                    <div className="mt-auto space-y-2 pt-6">
                        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-900 py-3 text-sm font-semibold text-white hover:bg-amber-950">
                            <Zap className="h-4 w-4" /> Pesan & bayar kasir via app
                        </button>
                        <button type="button" onClick={handleShare} className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100">
                            <Share2 className="h-4 w-4" /> Bagikan pin lokasi
                        </button>
                    </div>
                </aside>
            </div>
        </section>
    );
}