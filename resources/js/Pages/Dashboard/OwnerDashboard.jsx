import {
    ArrowUpRight,
    Bell,
    ChevronDown,
    Download,
    MapPinned,
    Store,
    Wallet,
} from 'lucide-react';

export default function OwnerDashboard() {
    const stats = [
        { label: 'Total Pendapatan', value: 'Rp 28.450.000', change: '+14.2% vs minggu lalu', tone: 'text-emerald-700' },
        { label: 'Total Pesanan', value: '642 pesanan', change: '+8.7% lebih cepat / jam', tone: 'text-amber-900' },
        { label: 'Rata-rata Transaksi', value: 'Rp 44.300', change: 'Bundle kopi + pastry', tone: 'text-stone-600' },
        { label: 'Kepuasan Pelanggan', value: '4.9 / 5.0', change: 'Top 2% mitra terbaik', tone: 'text-emerald-700' },
    ];

    const hourlyBars = [34, 52, 60, 48, 65, 58, 78, 62, 44, 71, 66, 56];
    const hourlyLabels = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00', '19:00', '20:00', '21:00'];

    const topMenu = [
        { rank: 1, item: 'Signature Cold Drip', category: 'Single Origin', revenue: 'Rp 9.000.000', units: '202 botol', status: 'Tersedia', tone: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
        { rank: 2, item: 'Truffle Croissant', category: 'Artisan Bakery', revenue: 'Rp 6.800.000', units: '151 pcs', status: 'Stok Menipis', tone: 'bg-amber-50 text-amber-900 border-amber-200' },
        { rank: 3, item: 'V60 Single Origin', category: 'Manual Brew', revenue: 'Rp 5.200.000', units: '105 porsi', status: 'Tersedia', tone: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
        { rank: 4, item: 'Oat Milk Latte', category: 'Espresso & Plant', revenue: 'Rp 4.700.000', units: '94 porsi', status: 'Aman', tone: 'bg-stone-100 text-stone-800 border-stone-200' },
    ];

    const heatmap = [
        ['92%', '85%', '88%', '94%', '100%', '76%', '90%'],
        ['91%', '87%', '80%', '90%', '96%', '82%', '88%'],
        ['95%', '90%', '78%', '89%', '84%', '78%', '86%'],
        ['80%', '84%', '90%', '87%', '95%', '100%', '92%'],
        ['76%', '82%', '88%', '90%', '94%', '88%', '84%'],
    ];

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-amber-900">Ringkasan Mitra Kafe</p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-stone-950">
                            Analitik Bisnis & Performa Outlet
                        </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
                            <Store className="h-3.5 w-3.5" /> Mitra Terverifikasi
                        </span>
                        <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-700">
                            <span>Cabang: Batam Center</span>
                            <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                        </div>
                        <button
                            type="button"
                            onClick={() => alert('Fitur ekspor laporan mingguan sedang disiapkan.')}
                            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 shadow-xs transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Ekspor Laporan
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, change, tone }) => (
                    <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-stone-500">{label}</p>
                            <span className="rounded-xl bg-amber-50 p-2 text-amber-900">
                                <Wallet className="h-5 w-5" />
                            </span>
                        </div>
                        <div className="mt-4 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
                            {value}
                        </div>
                        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${tone}`}>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                            {change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hourly Rush Chart + Retention */}
            <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
                {/* Rush Trend Chart */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-stone-950">Tren Kunjungan & Output Bar Per Jam</h3>
                            <p className="mt-0.5 text-xs text-stone-500">
                                Perbandingan arus pengunjung fisik vs porsi espresso yang diproses
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-600">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-700" /> Espresso
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-stone-300" /> Pengunjung
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-2 rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
                        {hourlyBars.map((height, index) => (
                            <div key={index} className="flex flex-1 flex-col items-center gap-2">
                                <div className="flex h-36 items-end gap-1">
                                    <div
                                        className="w-2.5 rounded-t-md bg-amber-700 transition hover:bg-amber-800"
                                        style={{ height: `${Math.round(height * 1.3)}px` }}
                                        title={`Espresso: ${height} porsi`}
                                    />
                                    <div
                                        className="w-2.5 rounded-t-md bg-stone-300 transition hover:bg-stone-400"
                                        style={{ height: `${Math.max(10, Math.round((height - 8) * 1.2))}px` }}
                                        title={`Pengunjung: ${Math.max(5, height - 8)}`}
                                    />
                                </div>
                                <span className="text-[10px] font-medium text-stone-500">
                                    {hourlyLabels[index]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-900 border border-amber-200">
                            Puncak Pagi: 08:30 - 09:30
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800 border border-emerald-200">
                            Sesi Coworking: 14:00 - 16:30
                        </span>
                    </div>
                </div>

                {/* Retention & Payment Methods */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-stone-950">Retensi & Pembayaran</h3>
                        <Bell className="h-4 w-4 text-stone-400" />
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-stone-100">
                            <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-amber-900 border-r-amber-900" />
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-stone-950">64%</div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                                    Pelanggan Setia
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3.5">
                        {[
                            { label: 'QRIS Instan', value: '58%', color: 'bg-amber-900' },
                            { label: 'GoPay / OVO / e-Wallet', value: '28%', color: 'bg-amber-600' },
                            { label: 'Kartu Debit / EDC', value: '14%', color: 'bg-stone-400' },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="mb-1 flex items-center justify-between text-xs text-stone-600">
                                    <span>{item.label}</span>
                                    <span className="font-semibold text-stone-950">{item.value}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.value }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Items Table + Capacity Heatmap */}
            <div className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
                {/* Menu Table */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-stone-950">Menu Terlaris & Kecepatan Order</h3>
                        <span className="text-xs font-semibold text-amber-900">Minggu ini</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-stone-200">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-stone-600">
                                <tr>
                                    <th className="px-3.5 py-3">Nama Menu</th>
                                    <th className="px-3.5 py-3">Kategori</th>
                                    <th className="px-3.5 py-3">Pendapatan</th>
                                    <th className="px-3.5 py-3">Terjual</th>
                                    <th className="px-3.5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white">
                                {topMenu.map((row) => (
                                    <tr key={row.item} className="transition hover:bg-stone-50/60">
                                        <td className="px-3.5 py-3 font-semibold text-stone-950">
                                            #{row.rank} {row.item}
                                        </td>
                                        <td className="px-3.5 py-3 text-xs text-stone-500">{row.category}</td>
                                        <td className="px-3.5 py-3 font-medium text-stone-950">{row.revenue}</td>
                                        <td className="px-3.5 py-3 text-xs text-stone-600">{row.units}</td>
                                        <td className="px-3.5 py-3">
                                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${row.tone}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Store Capacity Heatmap */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-stone-950">Heatmap Keterisian Meja</h3>
                            <p className="text-xs text-stone-500">Live: 48 / 50 kursi terisi (96%)</p>
                        </div>
                        <MapPinned className="h-4 w-4 text-stone-400" />
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                        <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-stone-600">
                            <span>Sen</span>
                            <span>Sel</span>
                            <span>Rab</span>
                            <span>Kam</span>
                            <span>Jum</span>
                            <span>Sab</span>
                            <span>Min</span>
                        </div>

                        <div className="space-y-2">
                            {heatmap.map((row, index) => (
                                <div key={index} className="grid grid-cols-7 gap-1.5">
                                    {row.map((cell, cellIndex) => {
                                        const num = Number.parseInt(cell, 10);
                                        const color =
                                            num >= 90
                                                ? 'bg-amber-800 text-white font-semibold'
                                                : num >= 80
                                                    ? 'bg-amber-200 text-amber-950 font-medium'
                                                    : 'bg-stone-200 text-stone-700';
                                        return (
                                            <div
                                                key={`${index}-${cellIndex}`}
                                                className={`flex h-8 items-center justify-center rounded-lg text-[10px] transition ${color}`}
                                                title={`Tingkat okupansi: ${cell}`}
                                            >
                                                {cell}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between text-[11px] text-stone-500">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-stone-200" /> &lt;80% Normal
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-amber-200" /> 80-89% Ramai
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-amber-800" /> &ge;90% Padat
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
