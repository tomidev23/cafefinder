import {
    ArrowUpRight,
    ChefHat,
    Clock3,
    Ticket,
    Wallet,
} from 'lucide-react';

export default function CashierDashboard() {
    const stats = [
        { label: 'Antrian order', value: '24', detail: 'menunggu diproses', icon: Clock3 },
        { label: 'Hari ini', value: 'Rp 12.6Jt', detail: 'omzet kasir', icon: Wallet },
        { label: 'Order dibayar', value: '196', detail: 'transaksi selesai', icon: Ticket },
        { label: 'Staff aktif', value: '08', detail: 'kasir & barista', icon: ChefHat },
    ];

    const highlights = [
        {
            title: 'Antrian kasir terdekat',
            description: 'Ada 3 pelanggan yang menunggu pembayaran di kursi nomor 3, 5, dan 7.',
            meta: 'Waktu rata-rata 2 menit',
        },
        {
            title: 'Pembayaran prioritas',
            description: 'QRIS dan e-wallet sedang mendominasi transaksi saat ini.',
            meta: 'Konsentrasi: 68%',
        },
        {
            title: 'Catatan stok',
            description: 'Stok kopi tubruk dan roti keju turun 12% dibanding hari sebelumnya.',
            meta: 'Perlu restock',
        },
    ];

    const activity = [
        'Pesanan meja 08 berhasil dibayar dengan QRIS.',
        '2 order batal karena pelanggan menunggu terlalu lama.',
        'Kasir baru melaporkan adanya perubahan playlist barista.',
    ];

    return (
        <div className="space-y-8">
            <div className="rounded-3xl border border-[#E8DDD1] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#8D4B00]">Ringkasan</p>
                        <h3 className="mt-1 text-2xl font-bold text-[#2A1D16]">
                            Kelola transaksi, antrian order, dan pembayaran kasir dengan cepat.
                        </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F6EDE4] px-3 py-2 text-sm font-medium text-[#8D4B00]">
                        <ArrowUpRight className="h-4 w-4" />
                        Update terakhir 15 menit lalu
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, detail, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-[#E8DDD1] bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="rounded-xl bg-[#F8EFE7] p-2 text-[#8D4B00]">
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-xs font-medium text-[#6B584D]">{detail}</span>
                        </div>
                        <div className="mt-5">
                            <p className="text-sm text-[#6B584D]">{label}</p>
                            <h4 className="mt-2 text-3xl font-bold text-[#2A1D16]">{value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="rounded-3xl border border-[#E8DDD1] bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2A1D16]">Poin penting</h3>
                        <span className="rounded-full bg-[#F6EDE4] px-3 py-1 text-xs font-semibold text-[#8D4B00]">
                            Live
                        </span>
                    </div>

                    <div className="space-y-4">
                        {highlights.map((item) => (
                            <div key={item.title} className="rounded-2xl border border-[#F0E5DC] bg-[#FBF8F6] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h4 className="text-base font-semibold text-[#2A1D16]">{item.title}</h4>
                                        <p className="mt-2 text-sm leading-6 text-[#5D4A3E]">{item.description}</p>
                                    </div>
                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8D4B00]">
                                        Baru
                                    </span>
                                </div>
                                <p className="mt-3 text-xs font-medium text-[#8D4B00]">{item.meta}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-[#E8DDD1] bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2A1D16]">Aktivitas terbaru</h3>
                        <span className="text-sm text-[#6B584D]">Hari ini</span>
                    </div>

                    <ul className="space-y-4">
                        {activity.map((item) => (
                            <li key={item} className="flex gap-3">
                                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#8D4B00]" />
                                <span className="text-sm leading-6 text-[#4E3F35]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
