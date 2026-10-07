import { Heart, Star, Hand, QrCode, LineChart, Leaf, Coffee, Sparkles } from 'lucide-react';
import Img from './Img';
import { featured, features } from '../data/cafes';

const featureIcons = { touch: Hand, qr: QrCode, chart: LineChart };

export default function Featured() {
    return (
        <section id="promosi" className="bg-stone-50 py-14">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Sorotan kurasi</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">Editorial picks buat kerja, ngobrol, dan ngopi serius</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">Semua kartu dibuat untuk terasa seperti majalah kopi lokal, bukan banner promosi generik.</p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {featured.map((c) => (
                        <article key={c.name} className="overflow-hidden rounded-4xl border border-stone-200 bg-white shadow-sm shadow-stone-200/60">
                            <div className="relative">
                                <Img src={c.image} alt={c.name} className="h-52 w-full object-cover" />
                                <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-stone-950/80 px-3 py-1 text-[10px] font-semibold text-white">Curated</span>
                                <button className="absolute right-3 top-3 rounded-full border border-stone-200 bg-white p-2 text-stone-600 shadow-sm hover:text-rose-600" aria-label="Simpan">
                                    <Heart className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center justify-between text-[11px] text-stone-500">
                                    <span className="flex items-center gap-1 font-semibold text-stone-800">
                                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {c.rating}
                                    </span>
                                    <span>{c.area}</span>
                                </div>
                                <h3 className="mt-2 text-lg font-semibold text-stone-950">{c.name}</h3>
                                <p className="mt-1 text-sm leading-6 text-stone-600">{c.desc}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {c.tags.map((t) => (
                                        <span key={t} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-medium text-stone-700">{t}</span>
                                    ))}
                                </div>
                                <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
                                    <span className="text-sm font-semibold text-stone-950">{c.price}</span>
                                    <button className="rounded-xl bg-amber-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-amber-950">Reservasi / Pesan</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div id="pesanan" className="mt-8 grid gap-6 md:grid-cols-3">
                    {features.map((f) => {
                        const Icon = featureIcons[f.icon];
                        return (
                            <div key={f.title} className="flex gap-4 rounded-4xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/60">
                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${f.color}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="font-semibold text-stone-950">{f.title}</h3>
                                    <p className="mt-1 text-sm leading-6 text-stone-600">{f.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
