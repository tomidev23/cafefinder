import { useState } from 'react';
import { Heart, Star, Hand, QrCode, LineChart } from 'lucide-react';
import Img from './Img';
import { featured, features } from '../data/cafes';

const featureIcons = { 
    touch: Hand, 
    qr: QrCode, 
    chart: LineChart 
};

export default function Featured() {
    const [savedCafes, setSavedCafes] = useState({});

    const toggleSave = (name) => {
        setSavedCafes((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    return (
        <section id="promosi" className="w-full bg-stone-50 py-12 md:py-16">
            <div className="w-full px-4 sm:px-6 lg:px-10">
                {/* Header Section */}
                <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">
                        Sorotan Kurasi
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl">
                        Editorial Picks Buat Kerja, Ngobrol, dan Ngopi Serius
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                        Semua kartu dibuat untuk terasa seperti majalah kopi lokal, bukan banner promosi generik.
                    </p>
                </div>

                {/* Grid Featured Cards */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featured.map((c) => {
                        const isSaved = !!savedCafes[c.name];
                        return (
                            <article 
                                key={c.name} 
                                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div>
                                    {/* Cover Image */}
                                    <div className="relative">
                                        <Img 
                                            src={c.image || '/images/default-cafe.jpg'} 
                                            alt={c.name} 
                                            className="h-52 w-full object-cover transition duration-300 hover:scale-105" 
                                        />
                                        <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-stone-950/80 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                            Curated Spot
                                        </span>
                                        <button 
                                            type="button"
                                            onClick={() => toggleSave(c.name)}
                                            aria-label={isSaved ? `Hapus ${c.name} dari favorit` : `Simpan ${c.name} ke favorit`}
                                            className={`absolute right-3 top-3 rounded-full border border-stone-200 p-2 shadow-sm transition focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2 ${
                                                isSaved 
                                                    ? 'bg-rose-50 text-rose-600' 
                                                    : 'bg-white/90 text-stone-600 hover:bg-white hover:text-rose-600'
                                            }`}
                                        >
                                            <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                                        </button>
                                    </div>

                                    {/* Content Body */}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                                            <span className="flex items-center gap-1 font-bold text-stone-800">
                                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 
                                                {c.rating ?? '4.8'}
                                            </span>
                                            <span className="font-medium text-stone-500">{c.area || 'Batam'}</span>
                                        </div>

                                        <h3 className="mt-2 text-lg font-bold text-stone-950">{c.name}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-stone-600 line-clamp-2">{c.desc}</p>

                                        {/* Tags */}
                                        {c.tags && (
                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {c.tags.map((t) => (
                                                    <span 
                                                        key={t} 
                                                        className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-medium text-stone-700"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Footer Action */}
                                <div className="mx-5 mb-5 flex items-center justify-between border-t border-stone-100 pt-4">
                                    <span className="text-sm font-bold text-stone-950">{c.price || 'Rp 20k+'}</span>
                                    <a 
                                        href="#peta" 
                                        className="rounded-xl bg-amber-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-amber-950 focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2"
                                    >
                                        Lihat Lokasi
                                    </a>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Features List Section */}
                <div id="pesanan" className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {features.map((f) => {
                        const Icon = featureIcons[f.icon] || Hand;
                        return (
                            <div 
                                key={f.title} 
                                className="flex items-start gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:bg-stone-50/50"
                            >
                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${f.color || 'bg-amber-50 text-amber-900'}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-stone-950">{f.title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-stone-600">{f.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
