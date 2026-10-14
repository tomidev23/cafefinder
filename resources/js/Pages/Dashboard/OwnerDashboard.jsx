import {
    ArrowUpRight,
    Bell,
    ChevronDown,
    Download,
    LayoutGrid,
    MapPinned,
    Search,
    ShoppingBag,
    Store,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';

export default function OwnerDashboard() {
    const sidebarItems = [
        { label: 'Overview', icon: LayoutGrid, active: false },
        { label: 'Live Order Kanban', icon: ShoppingBag, active: false },
        { label: 'Menu Manager', icon: Store, active: false },
        { label: 'AI Analytics', icon: TrendingUp, active: true },
        { label: 'Customer', icon: Users, active: false },
        { label: 'Settings', icon: Bell, active: false },
    ];

    const stats = [
        { label: 'Total Revenue', value: 'Rp 28.450.000', change: '+14.2% vs last week', tone: 'text-[#3d7d59]' },
        { label: 'Total Orders', value: '642 orders', change: '8.7% faster / hr', tone: 'text-[#8d4b00]' },
        { label: 'Average Ticket Size', value: 'Rp 44.300', change: 'Pastry bundles', tone: 'text-[#5a7b77]' },
        { label: 'Customer Satisfaction', value: '4.9 / 5.0', change: 'Top 2% overall', tone: 'text-[#3d7d59]' },
    ];

    const hourlyBars = [34, 52, 60, 48, 65, 58, 78, 62, 44, 71, 66, 56];

    const topMenu = [
        { rank: 1, item: 'Signature Cold Drip', category: 'Single Origin', revenue: 'Rp 9.000.000', units: '202 bottles', status: 'In stock', tone: 'bg-[#e7f3ee] text-[#1d6d57]' },
        { rank: 2, item: 'Truffle Croissant', category: 'Artisan Bakery', revenue: 'Rp 6.800.000', units: '151 pcs', status: 'Low Stock', tone: 'bg-[#f5e7d7] text-[#8d4b00]' },
        { rank: 3, item: 'V60 Single Origin', category: 'Manual Brew', revenue: 'Rp 5.200.000', units: '105 cafes', status: 'In stock', tone: 'bg-[#e7f3ee] text-[#1d6d57]' },
        { rank: 4, item: 'Oat Milk Latte', category: 'Espresso & Plant', revenue: 'Rp 4.700.000', units: '94 mugs', status: 'Healthy', tone: 'bg-[#eef3ef] text-[#2c5b4f]' },
    ];

    const heatmap = [
        ['92%', '85%', '88%', '94%', '100%', '76%', '90%'],
        ['91%', '87%', '80%', '90%', '96%', '82%', '88%'],
        ['95%', '90%', '78%', '89%', '84%', '78%', '86%'],
        ['80%', '84%', '90%', '87%', '95%', '100%', '92%'],
        ['76%', '82%', '88%', '90%', '94%', '88%', '84%'],
    ];

    const footerColumns = [
        { title: 'Discovery', items: ['Explore Cafes', 'Neighborhood Directory', 'Top Rated Pour Overs', 'Quiet Workspaces'] },
        { title: 'Merchant Hub', items: ['For Cafe Owners', 'Claim Your Listing', 'Merchant Portal', 'Barista Community'] },
        { title: 'Applications & Policy', items: ['Download iOS App', 'Download Android App', 'Privacy Policy', 'Terms of Service'] },
    ];

    return (
        <div className="min-h-screen bg-[#f2f0ee] px-4 py-6 text-[#2b2a2a]">
            <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[28px] border border-[#e8e1dc] bg-[#f5f3f1] shadow-[0_12px_30px_rgba(63,46,34,0.06)]">
                <header className="flex items-center justify-between border-b border-[#e9e3df] bg-[#fbfaf9] px-5 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3e3d0] text-[#7a4c1d]">
                            <Store className="h-4 w-4" />
                        </div>
                        <div className="text-[13px] font-bold tracking-tight text-[#2b2a2a]">CafeFinder</div>
                    </div>

                    <div className="hidden items-center gap-4 text-sm text-[#5a514b] md:flex">
                        <span>Discovery</span>
                        <span>Leaderboard</span>
                        <span>Promoted</span>
                        <span>Orders</span>
                        <span>Community</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-full border border-[#e8e0da] bg-white px-3 py-2 text-sm text-[#6b6159] md:flex">
                            <Search className="h-4 w-4" />
                            <span>Search orders, receipts, items...</span>
                        </div>
                        <button className="rounded-full bg-[#8d4b00] px-4 py-2 text-sm font-medium text-white shadow-sm">
                            Add Cafe
                        </button>
                    </div>
                </header>

                <div className="flex">
                    <aside className="w-[240px] border-r border-[#e8e1dc] bg-[#f7f4f1] p-4">
                        <div className="flex items-center gap-3 rounded-xl bg-[#efe3d6] p-2.5 shadow-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f8f3ee] text-[#8d4b00]">
                                <Store className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[#2b2a2a]">Artisan Roastery</div>
                                <div className="text-[11px] text-[#7a685d]">Senopati Flagship</div>
                            </div>
                        </div>

                        <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8c8178]">
                            Store Operations
                        </div>

                        <nav className="mt-4 space-y-1">
                            {sidebarItems.map(({ label, icon: Icon, active }) => (
                                <button
                                    key={label}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                        active
                                            ? 'bg-[#f2e1cf] text-[#8d4b00] shadow-sm'
                                            : 'text-[#584d46] hover:bg-[#f0ece9]'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="mt-6 rounded-2xl border border-[#e8dfd8] bg-[#f9f5f2] p-3">
                            <div className="flex items-center justify-between text-xs text-[#5d514b]">
                                <span>Live Seating Capacity</span>
                                <span className="font-semibold text-[#2e7d5e]">96% Occupied</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-[#5d514b]">
                                <span>Main Hall & Patio</span>
                                <span>48 / 50 seats</span>
                            </div>
                            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eee5dd]">
                                <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-[#c98b2d] to-[#8d4b00]" />
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 bg-[#f5f3f1] p-5">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#2d2a2a]">
                                    Business
                                </h1>
                                <h2 className="text-[30px] font-bold tracking-[-0.05em] text-[#2d2a2a]">
                                    Intelligence
                                </h2>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2 rounded-full border border-[#e8e0db] bg-white px-3 py-2 text-sm text-[#4e4642]">
                                    <span className="rounded-full bg-[#f5e7d7] px-2 py-1 text-[11px] font-semibold text-[#8d4b00]">
                                        Pro
                                    </span>
                                    Merchant
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-[#e8e0db] bg-white px-3 py-2 text-sm text-[#4e4642]">
                                    Branch: Senopati Flagship
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                                <button className="flex items-center gap-2 rounded-full border border-[#e8e0db] bg-white px-3 py-2 text-sm text-[#4e4642]">
                                    <Download className="h-4 w-4" />
                                    Export Report
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {stats.map(({ label, value, change, tone }) => (
                                <div key={label} className="rounded-2xl border border-[#e8ddd2] bg-[#fdfcfb] p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-[#605853]">{label}</p>
                                        <span className="rounded-full bg-[#f5f0ee] p-2 text-[#8d4b00]">
                                            <Wallet className="h-4 w-4" />
                                        </span>
                                    </div>
                                    <div className="mt-4 text-[28px] font-bold tracking-[-0.05em] text-[#2d2a2a]">{value}</div>
                                    <div className={`mt-2 flex items-center gap-2 text-xs font-medium ${tone}`}>
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                        {change}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 grid gap-5 xl:grid-cols-[1.7fr_0.9fr]">
                            <div className="rounded-3xl border border-[#e8ddd2] bg-[#fdfcfb] p-4 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2d2a2a]">Hourly Rush Trend & Dual Throughput</h3>
                                        <p className="mt-1 text-sm text-[#6f645d]">Comparing physical footfall vs espresso bar output per hour</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#6a6159]">
                                        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#c7832d]" /> Espresso</span>
                                        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#d8d5d2]" /> Coffee</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-end justify-between gap-2 rounded-2xl border border-[#f0e7e1] bg-[#f8f4f2] p-4">
                                    {hourlyBars.map((height, index) => (
                                        <div key={index} className="flex flex-1 flex-col items-center gap-2">
                                            <div className="flex h-32 items-end gap-1">
                                                <div className="w-2 rounded-t-md bg-[#c7832d]" style={{ height: `${height * 1.2}px` }} />
                                                <div className="w-2 rounded-t-md bg-[#e9ddd5]" style={{ height: `${(height - 8) * 1.15}px` }} />
                                            </div>
                                            <span className="text-[10px] text-[#7c7068]">{['07:00','08:00','09:00','10:00','12:00','14:00','16:00','18:00','20:00'][index] || 'n/a'}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex items-center justify-between text-xs text-[#6d625d]">
                                    <span className="rounded-full bg-[#f1e9df] px-2 py-1 text-[#8d4b00]">Morning Rush: 08:30 - 09:30</span>
                                    <span className="rounded-full bg-[#ebf3ee] px-2 py-1 text-[#2f7d58]">Co-working block: 14:00 - 16:30</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#e8ddd2] bg-[#fdfcfb] p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-[#2d2a2a]">Retention & Settlement</h3>
                                    <Bell className="h-4 w-4 text-[#6b635e]" />
                                </div>

                                <div className="mt-5 flex items-center justify-center">
                                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-[#f0e7df]">
                                        <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-[#8d4b00] border-r-[#8d4b00]" />
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-[#2d2a2a]">64%</div>
                                            <div className="text-[10px] uppercase tracking-[0.12em] text-[#7c7068]">Loyal</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {[
                                        { label: 'QRIS Instant', value: '58%', color: 'bg-[#8d4b00]' },
                                        { label: 'GoPay / OVO / e-Wallets', value: '28%', color: 'bg-[#d8c4a6]' },
                                        { label: 'EDC Credit / Debit Cards', value: '14%', color: 'bg-[#e8ddd4]' },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <div className="mb-1 flex items-center justify-between text-xs text-[#5f564f]">
                                                <span>{item.label}</span>
                                                <span>{item.value}</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-[#f0e7e1]">
                                                <div className={`h-full rounded-full ${item.color}`} style={{ width: item.value }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_0.95fr]">
                            <div className="rounded-3xl border border-[#e8ddd2] bg-[#fdfcfb] p-4 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-[#2d2a2a]">Top Selling Menu Items & Velocity</h3>
                                    <button className="text-xs font-medium text-[#8d4b00]">View full menu</button>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-[#efe5df]">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-[#f7f2ee] text-[#635b55]">
                                            <tr>
                                                <th className="px-3 py-2">Item Name</th>
                                                <th className="px-3 py-2">Category</th>
                                                <th className="px-3 py-2">Revenue</th>
                                                <th className="px-3 py-2">Units</th>
                                                <th className="px-3 py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topMenu.map((row) => (
                                                <tr key={row.item} className="border-t border-[#f0e7e1] bg-white">
                                                    <td className="px-3 py-3 font-semibold text-[#2d2a2a]">#{row.rank} {row.item}</td>
                                                    <td className="px-3 py-3 text-[#655d58]">{row.category}</td>
                                                    <td className="px-3 py-3 text-[#2d2a2a]">{row.revenue}</td>
                                                    <td className="px-3 py-3 text-[#655d58]">{row.units}</td>
                                                    <td className="px-3 py-3">
                                                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${row.tone}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#e8ddd2] bg-[#fdfcfb] p-4 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-[#2d2a2a]">Store Capacity Heatmap</h3>
                                    <MapPinned className="h-4 w-4 text-[#6b635e]" />
                                </div>

                                <div className="rounded-2xl bg-[#f7f4f2] p-3">
                                    <div className="mb-3 flex items-center justify-between text-xs text-[#5f564f]">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>
                                    </div>

                                    <div className="space-y-2">
                                        {heatmap.map((row, index) => (
                                            <div key={index} className="grid grid-cols-7 gap-1.5">
                                                {row.map((cell, cellIndex) => (
                                                    <div
                                                        key={`${index}-${cellIndex}`}
                                                        className={`flex h-7 items-center justify-center rounded-md text-[10px] font-medium ${
                                                            Number.parseInt(cell, 10) >= 90
                                                                ? 'bg-[#d9b197] text-[#4a2c1b]'
                                                                : Number.parseInt(cell, 10) >= 80
                                                                    ? 'bg-[#e4d7d0] text-[#463d39]'
                                                                    : 'bg-[#f2eadf] text-[#5d5047]'
                                                        }`}
                                                    >
                                                        {cell}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <footer className="mt-8 border-t border-[#e8ddd2] bg-[#f5f1ee] px-2 pt-6">
                            <div className="grid gap-6 md:grid-cols-4">
                                <div className="md:col-span-1">
                                    <div className="flex items-center gap-2 text-lg font-bold text-[#2d2a2a]">
                                        <Store className="h-5 w-5 text-[#8d4b00]" />
                                        CafeFinder
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-[#695f59]">
                                        Artisanal coffee intelligence, remote workspace scouting, and seamless barista-to-patron engagement.
                                    </p>
                                    <p className="mt-3 text-sm text-[#695f59]">© 2024 CafeFinder Inc. All rights reserved.</p>
                                </div>

                                {footerColumns.map((column) => (
                                    <div key={column.title}>
                                        <h4 className="text-lg font-bold text-[#2d2a2a]">{column.title}</h4>
                                        <ul className="mt-3 space-y-2 text-sm text-[#5d534d]">
                                            {column.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
}
