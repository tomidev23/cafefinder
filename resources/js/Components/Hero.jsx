import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, AttributionControl, useMap } from 'react-leaflet';
import { Search, Crosshair, BadgeCheck, MapPin } from 'lucide-react';
import { stats } from '../data/cafes';
import cafesData from '../data/cafes.json';

const NAMED = cafesData.filter((c) => c.name);
const CAFES = NAMED.filter((c) => c.lat != null && c.lng != null);
const BOUNDS = CAFES.length > 0 ? L.latLngBounds(CAFES.map((c) => [c.lat, c.lng])) : null;

const count = (fn) => NAMED.filter(fn).length;
const cheapest = Math.min(...NAMED.map((c) => c.price_min).filter((n) => n != null && !isNaN(n)));

const quickFacts = [
    { label: 'Coworking', value: `${count((c) => c.coworking === true)} kafe` },
    { label: 'Long table', value: `${count((c) => c.long_table === true)} kafe` },
    { label: 'Ada mushola', value: `${count((c) => c.mushola === true)} kafe` },
];

const mapFacts = [
    { label: 'Kafe terdata', value: NAMED.length },
    { label: 'WiFi 4+', value: `${count((c) => (c.wifi ?? 0) >= 4)} kafe` },
    { label: 'Harga mulai', value: isFinite(cheapest) ? `Rp ${Math.round(cheapest / 1000)}k` : '-' },
];

const chips = [
    { id: 'coworking', label: 'Coworking / WFH Friendly' },
    { id: 'wifi', label: 'WiFi Cepat' },
    { id: 'long_table', label: 'Long Table' },
    { id: 'mushola', label: 'Ada Mushola' },
    { id: 'smoking', label: 'Smoking Area' },
];

const goToMap = () => document.getElementById('peta')?.scrollIntoView({ behavior: 'smooth' });

// Helper component untuk memaksa Leaflet menghitung ulang ukuran kanvas
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

export default function Hero() {
    const [active, setActive] = useState(['wifi', 'coworking']);

    const toggle = (id) => {
        setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    return (
        <section id="eksplorasi" className="relative w-full bg-stone-50 py-6 md:py-10">
            {/* Container Full-Width */}
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">

                    {/* KOLOM KIRI (Filter & Information) */}
                    <div className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/60 sm:p-8 lg:col-span-7 lg:p-10">
                        <div>

                            {/* Heading */}
                            <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl lg:leading-tight">
                                Cari kafe lokal yang enak, terang, dan benar-benar cocok buat aktivitasmu.
                            </h1>

                            {/* Form Pencarian */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    goToMap();
                                }}
                                className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm"
                            >
                                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                                    <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5">
                                        <Search className="h-4 w-4 shrink-0 text-stone-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari: Batam Center, kopi susu gula aren, atau spot WFH"
                                            className="w-full border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={goToMap}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 hover:text-stone-900"
                                    >
                                        <Crosshair className="h-4 w-4 text-stone-500" />
                                        <span>Dekat saya</span>
                                    </button>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-xl bg-amber-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-950 active:scale-[0.99]"
                                    >
                                        Jelajahi
                                    </button>
                                </div>

                                {/* Filter Chips */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {chips.map((chip) => {
                                        const on = active.includes(chip.id);
                                        return (
                                            <button
                                                key={chip.id}
                                                type="button"
                                                onClick={() => toggle(chip.id)}
                                                aria-pressed={on}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${on
                                                        ? 'border-amber-900 bg-amber-900 text-white'
                                                        : 'border-stone-200 bg-white text-stone-600 hover:border-amber-900 hover:text-amber-900'
                                                    }`}
                                            >
                                                {chip.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </form>
                        </div>

                        {/* Statistik Bawah */}
                        <div className="mt-8 space-y-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {quickFacts.map((item) => (
                                    <div key={item.label} className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3.5">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">{item.label}</p>
                                        <p className="mt-1 text-base font-semibold text-stone-950">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            <dl className="grid grid-cols-3 gap-4 border-t border-stone-200 pt-6">
                                {stats?.map((s) => (
                                    <div key={s.label}>
                                        <dd className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">{s.value}</dd>
                                        <dt className="mt-0.5 text-xs font-medium text-stone-500">{s.label}</dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    {/* KOLOM KANAN (Map Container Fix Kepotong) */}
                    <div id="peta" className="relative flex min-h-125 w-full flex-1 overflow-hidden rounded-3xl border border-stone-200 bg-stone-900 shadow-lg shadow-stone-900/10 lg:col-span-5 lg:min-h-full">
                        <div className="relative h-full w-full flex-1 overflow-hidden">
                            {BOUNDS && (
                                <MapContainer
                                    bounds={BOUNDS}
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
                                    <TileLayer
                                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        maxZoom={19}
                                    />
                                    <AttributionControl position="topright" />
                                    {CAFES.map((c) => (
                                        <CircleMarker
                                            key={c.id || `${c.lat}-${c.lng}`}
                                            center={[c.lat, c.lng]}
                                            radius={7}
                                            pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#78350f', fillOpacity: 1 }}
                                        />
                                    ))}
                                </MapContainer>
                            )}
                        </div>

                        {/* Top Overlay */}
                        <div className="pointer-events-none absolute left-4 top-4 z-1000 rounded-2xl border border-white/20 bg-stone-950/80 px-4 py-3 backdrop-blur-md sm:left-6 sm:top-6">
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                                <MapPin className="h-4 w-4 text-amber-400" /> {CAFES.length} kafe di peta
                            </p>
                            <p className="mt-0.5 text-xs text-stone-300">Batam • rating WiFi, harga, dan fasilitas</p>
                        </div>

                        {/* Bottom Overlay */}
                        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-1000 grid grid-cols-3 gap-2 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:gap-3">
                            {mapFacts.map((f) => (
                                <div key={f.label} className="rounded-xl border border-white/10 bg-stone-950/80 p-3 text-center sm:text-left">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-stone-300">{f.label}</p>
                                    <p className="mt-0.5 text-base font-bold text-white sm:text-lg">{f.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}