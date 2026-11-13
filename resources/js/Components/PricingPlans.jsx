import { Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, BarChart3, Megaphone, Store } from 'lucide-react';
import { useState } from 'react';

const plans = [
    {
        name: 'Starter',
        eyebrow: 'Untuk mulai ditemukan',
        monthly: '149.000',
        description: 'Listing terverifikasi untuk kafe yang ingin tampil lebih rapi di CafeFinder.',
        features: ['Profil kafe lengkap', 'Menu dan jam buka', 'Badge terverifikasi'],
        icon: Store,
    },
    {
        name: 'Growth',
        eyebrow: 'Paling dipilih mitra',
        monthly: '299.000',
        description: 'Dorong kunjungan dengan posisi yang lebih menonjol dan insight yang mudah dibaca.',
        features: ['Semua fitur Starter', 'Sorotan di halaman utama', 'Insight kunjungan bulanan'],
        icon: Megaphone,
        featured: true,
    },
    {
        name: 'Pro',
        eyebrow: 'Untuk kafe yang sedang tumbuh',
        monthly: '599.000',
        description: 'Promosi lebih terarah dengan prioritas visibilitas dan data operasional.',
        features: ['Semua fitur Growth', 'Prioritas di hasil eksplorasi', 'Laporan performa mingguan'],
        icon: BarChart3,
    },
];

const comparison = [
    ['Listing terverifikasi', 'Semua paket', 'Semua paket', 'Semua paket'],
    ['Tampil di halaman utama', '—', '1 slot aktif', '3 slot aktif'],
    ['Insight kunjungan', '—', 'Bulanan', 'Mingguan'],
    ['Prioritas hasil eksplorasi', '—', '—', 'Ya'],
];

export default function PricingPlans({ compact = false }) {
    const [annual, setAnnual] = useState(false);

    return (
        <section id="paket" className={compact ? 'w-full px-4 py-14 sm:px-6 lg:px-10' : 'w-full'}>
            <div className={compact ? 'mx-auto max-w-7xl' : 'mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16'}>
                <div className="flex flex-col gap-6 border-b border-stone-200 pb-8 dark:border-stone-800 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400">Untuk pemilik kafe</p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 dark:text-stone-100 sm:text-4xl">
                            Buat kafe kamu lebih mudah ditemukan.
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                            Pilih paket yang sesuai dengan tahap kafe kamu. Mulai dari listing yang rapi sampai promosi yang terukur.
                        </p>
                    </div>

                    <div className="inline-flex w-fit rounded-full border border-stone-200 bg-stone-100 p-1 dark:border-stone-700 dark:bg-stone-900">
                        <button
                            type="button"
                            onClick={() => setAnnual(false)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${!annual ? 'bg-white text-stone-950 shadow-sm dark:bg-stone-700 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}
                        >
                            Bulanan
                        </button>
                        <button
                            type="button"
                            onClick={() => setAnnual(true)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${annual ? 'bg-white text-stone-950 shadow-sm dark:bg-stone-700 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}
                        >
                            Tahunan <span className="text-emerald-700 dark:text-emerald-400">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-3">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const price = annual ? Math.round(Number(plan.monthly.replace('.', '')) * 0.8 / 1000) * 1000 : Number(plan.monthly.replace('.', ''));
                        return (
                            <article
                                key={plan.name}
                                className={`relative flex flex-col rounded-3xl border p-6 ${plan.featured ? 'border-amber-800 bg-stone-950 text-white shadow-xl shadow-stone-900/15 dark:border-amber-600' : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900'}`}
                            >
                                {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950">Rekomendasi</span>}
                                <Icon className={`h-6 w-6 ${plan.featured ? 'text-amber-300' : 'text-amber-800 dark:text-amber-400'}`} />
                                <p className={`mt-5 text-xs font-semibold uppercase tracking-wider ${plan.featured ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400'}`}>{plan.eyebrow}</p>
                                <h2 className="mt-1 text-2xl font-bold">{plan.name}</h2>
                                <p className={`mt-3 min-h-12 text-sm leading-5 ${plan.featured ? 'text-stone-300' : 'text-stone-600 dark:text-stone-300'}`}>{plan.description}</p>
                                <div className="mt-6 flex items-end gap-1">
                                    <span className="text-sm">Rp</span>
                                    <span className="text-3xl font-bold">{price.toLocaleString('id-ID')}</span>
                                    <span className={`pb-1 text-xs ${plan.featured ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'}`}>/ bulan</span>
                                </div>
                                <ul className={`mt-6 space-y-3 border-t pt-5 text-sm ${plan.featured ? 'border-white/10' : 'border-stone-200 dark:border-stone-800'}`}>
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <BadgeCheck className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? 'text-emerald-300' : 'text-emerald-700 dark:text-emerald-400'}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={route('register', { role: 'owner', plan: plan.name.toLowerCase() })}
                                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${plan.featured ? 'bg-amber-300 text-amber-950 hover:bg-amber-200 focus-visible:ring-offset-stone-950' : 'bg-stone-900 text-white hover:bg-amber-900 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-300'}`}
                                >
                                    Pilih paket <ArrowRight className="h-4 w-4" />
                                </Link>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-12 overflow-hidden rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex flex-col gap-2 border-b border-stone-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
                        <div>
                            <h2 className="text-lg font-bold text-stone-950 dark:text-stone-100">Bandingkan fitur paket</h2>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Semua paket dapat dibatalkan kapan saja.</p>
                        </div>
                        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Harga belum termasuk pajak</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500 dark:bg-stone-950 dark:text-stone-400">
                                <tr><th className="px-5 py-4 font-semibold">Fitur</th><th className="px-5 py-4 font-semibold">Starter</th><th className="px-5 py-4 font-semibold">Growth</th><th className="px-5 py-4 font-semibold">Pro</th></tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                                {comparison.map((row) => <tr key={row[0]} className="text-stone-700 dark:text-stone-300">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index === 0 ? 'font-medium text-stone-950 dark:text-stone-100' : ''}`}>{cell}</td>)}</tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
