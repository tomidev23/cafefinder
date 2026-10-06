import { Heart, Star, Hand, QrCode, LineChart } from 'lucide-react';
import Img from './Img';
import { featured, features } from '../data/cafes';

const featureIcons = { touch: Hand, qr: QrCode, chart: LineChart };

export default function Featured() {
    return (
        <section id="promosi" className="bg-stone-50 py-12">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="text-center">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold text-amber-900">SOROTAN & FITUR MITRA</span>
                    <h2 className="mt-3 text-2xl font-bold text-stone-900">Pusat Kopi Artisanal Unggulan & Teknologi Cerdas</h2>
                    <p className="text-xs text-stone-500">Roastery pilihan terbaik yang terhubung dengan infrastruktur pra-pesan digital CafeFinder.</p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {featured.map((c) => (
                        <article key={c.name} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
                            <div className="relative">
                                <Img src={c.image} alt={c.name} className="h-44 w-full" />
                                <span className="absolute left-3 top-3 rounded bg-amber-800 px-2 py-0.5 text-[10px] font-bold text-white">PROMOSI</span>
                                <button className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-stone-600 hover:text-rose-600" aria-label="Simpan">
                                    <Heart className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between text-[11px] text-stone-500">
                                    <span className="flex items-center gap-1 font-semibold text-stone-800">
                                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {c.rating}
                                    </span>
                                    <span>{c.area}</span>
                                </div>
                                <h3 className="mt-1 font-bold text-stone-900">{c.name}</h3>
                                <p className="mt-1 text-xs text-stone-600">{c.desc}</p>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {c.tags.map((t) => (
                                        <span key={t} className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">{t}</span>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t pt-3">
                                    <span className="text-xs font-semibold text-stone-900">{c.price}</span>
                                    <button className="rounded-lg bg-amber-800 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-900">Reservasi / Pesan</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div id="pesanan" className="mt-8 grid gap-6 md:grid-cols-3">
                    {features.map((f) => {
                        const Icon = featureIcons[f.icon];
                        return (
                            <div key={f.title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${f.color}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-stone-900">{f.title}</h3>
                                    <p className="mt-1 text-xs text-stone-600">{f.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
