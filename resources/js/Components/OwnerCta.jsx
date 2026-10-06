import { Link } from '@inertiajs/react';

export default function OwnerCta() {
    return (
        <section id="mitra" className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
            <div className="grid items-center gap-8 rounded-3xl bg-slate-800 p-8 text-white lg:grid-cols-[1.5fr_1fr] lg:p-10">
                <div>
                    <span className="rounded-full border border-amber-500/50 px-3 py-1 text-[10px] font-semibold tracking-wide text-amber-300">
                        GABUNG BERSAMA 12.000+ PENIKMAT KOPI
                    </span>
                    <h2 className="mt-4 text-2xl font-bold">Miliki Kafe Artisanal atau Roastery Spesialti?</h2>
                    <p className="mt-3 max-w-xl text-sm text-slate-300">
                        Daftarkan kafe Anda di CafeFinder, jangkau komunitas profesional remote worker secara langsung, dan tingkatkan penjualan di jam santai hari kerja.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={route('register')} className="rounded-lg bg-amber-800 px-5 py-2.5 text-sm font-semibold hover:bg-amber-700">
                            Daftarkan Kafe Gratis
                        </Link>
                        <Link href={route('login')} className="rounded-lg bg-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-white">
                            Jelajahi Portal Pemilik
                        </Link>
                    </div>
                </div>

                <figure className="rounded-xl bg-stone-200 p-4 text-stone-800">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-800 text-xs font-bold text-white">BK</span>
                        <figcaption className="text-xs">
                            <p className="font-semibold">Barista Kevin</p>
                            <p className="text-stone-500">Kepala Roaster @ Tanamera</p>
                        </figcaption>
                    </div>
                    <blockquote className="mt-3 text-xs italic">
                        "CafeFinder mendongkrak pesanan takeaway pagi hingga 35% lewat sistem pra-pesan QRIS terintegrasi."
                    </blockquote>
                </figure>
            </div>
        </section>
    );
}
