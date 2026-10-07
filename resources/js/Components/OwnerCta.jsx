import { Link } from '@inertiajs/react';
import { Store, QrCode, ChartColumnIncreasing, BadgeCheck } from 'lucide-react';

export default function OwnerCta() {
    return (
        <section id="mitra" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
            <div className="grid items-stretch gap-6 rounded-4xl border border-stone-200 bg-stone-950 p-6 text-white shadow-lg shadow-stone-900/10 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
                <div>
                    <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-amber-200 uppercase">
                        Untuk pemilik kafe dan roastery
                    </span>
                    <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white">Daftarkan kafe kamu, bantu pelanggan pesan lebih cepat, dan tampil lebih mudah ditemukan.</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
                        CafeFinder dirancang untuk discovery lokal yang nyata: listing yang rapi, tag lokasi yang berguna, dan fitur pesanan yang bisa dipakai tanpa drama UI berlebihan.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {[
                            { icon: Store, title: 'Listing kafe', desc: 'Area, jam buka, dan menu unggulan.' },
                            { icon: QrCode, title: 'Pesan & bayar', desc: 'Order kasir via app dan QRIS.' },
                            { icon: ChartColumnIncreasing, title: 'Data kunjungan', desc: 'Lihat spot favorit dan jam sibuk.' },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <Icon className="h-5 w-5 text-amber-300" />
                                    <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                                    <p className="mt-1 text-xs leading-5 text-stone-300">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={route('register')} className="rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-950">
                            Daftarkan kafe kamu
                        </Link>
                        <Link href={route('login')} className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                            Lihat portal pemilik
                        </Link>
                    </div>
                </div>

                <figure className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-900 text-xs font-bold text-white">BK</span>
                            <figcaption className="text-xs text-stone-300">
                                <p className="font-semibold text-white">Barista Kevin</p>
                                <p>Kepala roaster @ Tanamera Batam</p>
                            </figcaption>
                        </div>
                        <blockquote className="mt-4 text-sm leading-6 text-stone-200">
                            “Sejak listing di CafeFinder, orang lebih cepat nemu menu manual brew dan jam ramai. Order takeaway pagi juga lebih rapih.”
                        </blockquote>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-stone-900 p-4 text-sm text-stone-200">
                        <p className="flex items-center gap-2 font-semibold text-white"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Cocok untuk kafe lokal yang serius tumbuh</p>
                        <p className="mt-2 text-xs leading-5 text-stone-300">Tampilkan area, harga, vibe, dan fitur toko dengan cara yang mudah dipindai pelanggan.</p>
                    </div>
                </figure>
            </div>
        </section>
    );
}
