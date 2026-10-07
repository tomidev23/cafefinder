import { Footprints, Car, Zap, Share2, Plus, Minus, LocateFixed, Navigation, Coffee, MapPin, Wifi, PawPrint, Clock3 } from 'lucide-react';
import Img from './Img';

export default function MapSection() {
    return (
        <section id="peta" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Peta discovery</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-stone-950">Lihat pin kafe yang dekat dengan posisi kamu</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Bandingkan spot dengan tag seperti WiFi Cepat, Pet Friendly, dan area outdoor. Fokusnya tetap ke keputusan datang, bukan sekadar lihat peta cantik.</p>

            <div className="mt-6 flex flex-wrap gap-2">
                {['WiFi Cepat', 'Pet Friendly', 'Outdoor Area', 'Manual Brew', '24 Jam'].map((item) => (
                    <span key={item} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow-sm">
                        {item}
                    </span>
                ))}
            </div>

            <div className="mt-6 grid gap-6 rounded-4xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60 lg:grid-cols-[2fr_1fr]">
                <div className="relative overflow-hidden rounded-3xl bg-stone-100">
                    <Img src="/images/map.jpg" alt="Peta kafe sekitar area Batam Center" className="h-105 w-full object-cover" />

                    <div className="absolute left-4 top-4 flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <button className="p-2 hover:bg-stone-100" aria-label="Perbesar"><Plus className="h-4 w-4" /></button>
                        <button className="border-t border-stone-200 p-2 hover:bg-stone-100" aria-label="Perkecil"><Minus className="h-4 w-4" /></button>
                        <button className="border-t border-stone-200 p-2 hover:bg-stone-100" aria-label="Lokasi saya"><LocateFixed className="h-4 w-4" /></button>
                    </div>

                    <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs shadow-sm">
                        <p className="font-semibold text-stone-950">Common Grounds Batam</p>
                        <p className="mt-1 text-stone-600">500m dari lokasi mu • WiFi cepat • Rp 30k–65k</p>
                    </div>

                    <div className="absolute right-4 top-24 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs shadow-sm">
                        <p className="flex items-center gap-1 font-semibold text-stone-950"><Wifi className="h-3.5 w-3.5 text-amber-900" /> 180 Mbps</p>
                        <p className="mt-1 text-stone-600">Stabil untuk kerja panjang</p>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-900">
                            <Footprints className="h-4 w-4" />
                        </span>
                        <div className="flex-1 text-xs">
                            <p className="font-semibold text-stone-950">500m dari lokasi mu • 6 menit jalan kaki</p>
                            <p className="mt-1 text-stone-500">Rute aman, trotoar lebar, dan parkir motor tersedia</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-950">
                            <Navigation className="h-3.5 w-3.5" /> Mulai Rute
                        </button>
                    </div>
                </div>

                <aside className="flex flex-col rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Spot terpilih</p>
                    <div className="mt-2 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-base font-semibold text-stone-950">Common Grounds Batam</h3>
                            <p className="text-xs text-stone-500">Batam Center • dekat One Batam Mall</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Buka</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl border border-stone-200 bg-white p-3">
                            <Clock3 className="h-4 w-4 text-amber-900" />
                            <p className="mt-2 font-semibold text-stone-950">4-6 mnt</p>
                            <p className="text-[11px] text-stone-500">Jalan kaki / motor</p>
                        </div>
                        <div className="rounded-2xl border border-stone-200 bg-white p-3">
                            <PawPrint className="h-4 w-4 text-amber-900" />
                            <p className="mt-2 font-semibold text-stone-950">Pet friendly</p>
                            <p className="text-[11px] text-stone-500">Area outdoor teduh</p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 text-xs">
                        <div className="flex justify-between font-medium text-stone-700">
                            <span>Kapasitas ruang nyata</span>
                            <span className="text-amber-900">72% terisi</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-stone-200">
                            <div className="h-2 w-[72%] rounded-full bg-emerald-600" />
                        </div>
                        <p className="mt-2 text-[11px] text-stone-500">Indoor: 4 meja kosong • Outdoor: 8 kursi kosong</p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs">
                        <p className="font-semibold text-stone-950">Seduhan rekomendasi</p>
                        <p className="mt-1 text-stone-600">Manual Brew V60 - Ethiopia Natural (Rp 42.000)</p>
                    </div>

                    <div className="mt-auto space-y-2 pt-6">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-900 py-3 text-sm font-semibold text-white hover:bg-amber-950">
                            <Zap className="h-4 w-4" /> Pesan & bayar kasir via app
                        </button>
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100">
                            <Share2 className="h-4 w-4" /> Bagikan pin lokasi
                        </button>
                    </div>
                </aside>
            </div>
        </section>
    );
}
