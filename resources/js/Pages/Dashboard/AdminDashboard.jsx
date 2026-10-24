import { ArrowUpRight, Bell, Building2, ShieldCheck, Users } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total cafe aktif', value: '186', detail: 'mitra terdaftar', icon: Building2 },
        { label: 'Pengguna baru', value: '1.2K', detail: 'bulan ini', icon: Users },
        { label: 'Transaksi berhasil', value: '94%', detail: 'proses validasi', icon: ShieldCheck },
        { label: 'Laporan pending', value: '12', detail: 'butuh review', icon: Bell },
    ];

    const highlights = [
        {
            title: 'Kafe baru mendaftar',
            description: 'Ada 9 kafe baru yang menunggu review profil dan legalitas.',
            meta: '2 jam yang lalu',
            badge: 'Verifikasi',
        },
        {
            title: 'Kinerja platform',
            description: 'Uptime sistem stabil 99.9% dengan waktu respon API dalam 220ms.',
            meta: 'Status sehat',
            badge: 'Sistem',
        },
        {
            title: 'Performa wilayah',
            description: 'Kota Bandung dan Batam masih menjadi wilayah dengan interaksi tertinggi.',
            meta: 'Update mingguan',
            badge: 'Wilayah',
        },
    ];

    const activity = [
        'Review akses kafe “Pintu Kopi” disetujui.',
        '7 laporan keluhan pelanggan baru dipindahkan ke tim support.',
        'Pembaruan fitur promo berhasil diluncurkan ke semua mitra.',
    ];

    return (
        <div className="space-y-8">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-amber-900">Ringkasan Administrator</p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-stone-950">
                            Kelola kafe, mitra, dan performa platform secara terpusat.
                        </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 self-start rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-900">
                        <ArrowUpRight className="h-4 w-4" />
                        Ringkasan hari ini
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, detail, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="rounded-xl bg-amber-50 p-2 text-amber-900">
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-xs font-medium text-stone-500">{detail}</span>
                        </div>
                        <div className="mt-5">
                            <p className="text-sm text-stone-500">{label}</p>
                            <h4 className="mt-1.5 text-3xl font-bold text-stone-950">{value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-stone-950">Sorotan Operasional</h3>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                            Status
                        </span>
                    </div>

                    <div className="space-y-4">
                        {highlights.map((item) => (
                            <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 transition hover:bg-stone-50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h4 className="text-base font-semibold text-stone-950">{item.title}</h4>
                                        <p className="mt-1 text-sm leading-6 text-stone-600">{item.description}</p>
                                    </div>
                                    <span className="shrink-0 rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-amber-950 shadow-xs">
                                        {item.badge}
                                    </span>
                                </div>
                                <p className="mt-3 text-xs font-medium text-amber-900">{item.meta}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-stone-950">Aktivitas Sistem Terbaru</h3>
                        <span className="text-xs font-medium text-stone-500">Hari ini</span>
                    </div>

                    <ul className="space-y-4">
                        {activity.map((item) => (
                            <li key={item} className="flex gap-3">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-900" />
                                <span className="text-sm leading-6 text-stone-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
