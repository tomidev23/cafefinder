import { Footprints, Car, Zap, Share2, Plus, Minus, LocateFixed, Navigation, Coffee } from 'lucide-react';
import Img from './Img';

export default function MapSection() {
    return (
        <section id="peta" className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
            <p className="text-[11px] font-semibold tracking-wider text-amber-800">● PENCARIAN GEOLOKASI LANGSUNG</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-900">Peta Roastery Interaktif & Navigator Rute</h2>
            <p className="text-xs text-stone-500">Estimasi jalan kaki ramah pedestrian, waktu tempuh berkendara, dan ketersediaan stopkontak.</p>

            <div className="mt-6 grid gap-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 lg:grid-cols-[2fr_1fr]">
                {/* Peta */}
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-amber-50">
                    <Img src="/images/map.jpg" alt="Peta kafe sekitar Senopati" className="h-full w-full" />

                    <div className="absolute left-3 top-3 flex flex-col overflow-hidden rounded-lg bg-white shadow">
                        <button className="p-2 hover:bg-stone-100" aria-label="Perbesar"><Plus className="h-4 w-4" /></button>
                        <button className="border-t p-2 hover:bg-stone-100" aria-label="Perkecil"><Minus className="h-4 w-4" /></button>
                        <button className="border-t p-2 hover:bg-stone-100" aria-label="Lokasi saya"><LocateFixed className="h-4 w-4" /></button>
                    </div>

                    <div className="absolute left-1/2 top-1/3 -translate-x-1/2">
                        <div className="rounded-lg bg-white px-3 py-1.5 text-xs shadow-lg">
                            <p className="font-semibold text-stone-900">Tanamera Roastery</p>
                            <p className="text-[11px] text-emerald-700">4 mnt jalan kaki • 14 Kursi Tersedia</p>
                        </div>
                        <span className="mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-800 text-white shadow-lg">
                            <Coffee className="h-4 w-4" />
                        </span>
                    </div>

                    <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-white p-3 shadow-lg">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-amber-800">
                            <Footprints className="h-4 w-4" />
                        </span>
                        <div className="flex-1 text-xs">
                            <p className="font-semibold text-stone-900">Rute Jalan Kaki Optimal Aktif</p>
                            <p className="text-stone-500">Via Jl. Gunawarman • 340 meter • Trotoar rindang</p>
                        </div>
                        <div className="text-right text-xs">
                            <p className="font-bold text-stone-900">4 mnt</p>
                            <p className="text-[10px] text-emerald-700">Bebas macet</p>
                        </div>
                        <button className="rounded-lg bg-amber-800 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-900">Mulai Rute</button>
                    </div>
                </div>

                {/* Panel tujuan */}
                <aside className="flex flex-col text-sm">
                    <p className="text-[10px] font-semibold tracking-wider text-stone-500">TUJUAN TERPILIH</p>
                    <div className="mt-1 flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-stone-900">Tanamera Roastery</h3>
                            <p className="text-xs text-stone-500">Jl. Suryo No. 42, Senopati</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Buka</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-stone-50 p-3">
                            <Footprints className="h-4 w-4 text-amber-800" />
                            <p className="mt-1 font-bold text-stone-900">4 mnt</p>
                            <p className="text-[11px] text-stone-500">340m pedestrian</p>
                        </div>
                        <div className="rounded-lg bg-stone-50 p-3">
                            <Car className="h-4 w-4 text-amber-800" />
                            <p className="mt-1 font-bold text-stone-900">2 mnt</p>
                            <p className="text-[11px] text-stone-500">Mobil / Ojek online</p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-stone-50 p-3 text-xs">
                        <div className="flex justify-between font-medium text-stone-700">
                            <span>Kapasitas Ruang Nyata</span>
                            <span className="text-amber-800">72% Terisi</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-stone-200">
                            <div className="h-2 w-[72%] rounded-full bg-emerald-600" />
                        </div>
                        <p className="mt-2 text-[11px] text-stone-500">Dalam Ruang: 4 meja sedia &nbsp;|&nbsp; Teras: 8 kursi sedia</p>
                    </div>

                    <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs">
                        <p className="font-semibold text-stone-900">Seduhan Rekomendasi</p>
                        <p className="text-stone-600">Flores Bajawa Pour Over (Rp 42rb)</p>
                    </div>

                    <div className="mt-auto space-y-2 pt-6">
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-800 py-3 text-sm font-semibold text-white hover:bg-amber-900">
                            <Zap className="h-4 w-4" /> Pesan Duluan • Lewati Antrean
                        </button>
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-stone-800 hover:bg-blue-100">
                            <Share2 className="h-4 w-4" /> Bagikan Pin Lokasi
                        </button>
                    </div>
                </aside>
            </div>
        </section>
    );
}
