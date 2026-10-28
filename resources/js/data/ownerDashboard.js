const numberFormatter = new Intl.NumberFormat('id-ID');

export const formatRupiah = (value) => `Rp ${numberFormatter.format(value)}`;

export const formatRupiahValue = (value) => numberFormatter.format(value);

export const formatSettlementAmount = (revenue, share) => {
    const millions = (revenue * share) / 100 / 1_000_000;

    return `Rp ${(Math.floor(millions * 10) / 10).toFixed(1)}M`;
};

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
});

const localDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const today = new Date();

export const defaultCustomRange = {
    start: localDateValue(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
    ),
    end: localDateValue(today),
};

const parseDateValue = (value) => {
    if (!value) {
        return null;
    }

    const [year, month, day] = value.split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
};

export const countDays = (start, end) => {
    const startDate = parseDateValue(start);
    const endDate = parseDateValue(end);

    if (!startDate || !endDate || endDate < startDate) {
        return 1;
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return Math.round((endDate - startDate) / millisecondsPerDay) + 1;
};

export const formatDateRange = ({ start, end }) => {
    const startDate = parseDateValue(start);
    const endDate = parseDateValue(end);

    if (!startDate || !endDate) {
        return 'Custom range';
    }

    return `${shortDateFormatter.format(startDate)} – ${shortDateFormatter.format(endDate)}`;
};

export const rangeOptions = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: 'custom', label: 'Custom' },
];

export const rangeMeta = {
    today: {
        label: 'Today',
        change: '+14.2%',
        changeContext: 'vs last week',
        pace: 52,
        upsell: '+Rp 6.200',
    },
    '7d': {
        label: 'Last 7 days',
        change: '+9.8%',
        changeContext: 'vs previous 7 days',
        pace: 58,
        upsell: '+Rp 6.100',
    },
    '30d': {
        label: 'Last 30 days',
        change: '+12.4%',
        changeContext: 'vs previous 30 days',
        pace: 64,
        upsell: '+Rp 6.400',
    },
    custom: {
        label: 'Custom range',
        change: '+4.8%',
        changeContext: 'vs previous period',
        pace: 55,
        upsell: '+Rp 6.200',
    },
};

export const getRangeLabel = (rangeId, customRange) =>
    rangeId === 'custom'
        ? formatDateRange(customRange)
        : rangeMeta[rangeId]?.label ?? rangeMeta.today.label;

const rangeMultiplier = (branch, rangeId, customRange) => {
    if (rangeId === '7d') {
        return 6.4;
    }

    if (rangeId === '30d') {
        return 27.1;
    }

    if (rangeId === 'custom') {
        return Math.max(1, countDays(customRange.start, customRange.end) * 0.92);
    }

    return 1;
};

export const buildMetrics = (branch, rangeId, customRange) => {
    const multiplier = rangeMultiplier(branch, rangeId, customRange);
    const revenue = Math.round((branch.baseRevenue * multiplier) / 1000) * 1000;
    const orders = Math.max(1, Math.round(branch.baseOrders * multiplier));
    const average = Math.round(revenue / orders / 100) * 100;
    const meta = rangeMeta[rangeId] ?? rangeMeta.today;

    return {
        revenue,
        orders,
        average,
        satisfaction: branch.satisfaction,
        positive: branch.positive,
        rank: branch.rank,
        area: branch.area,
        ...meta,
    };
};

export const hourLabels = [
    '07:00',
    '08:30',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
];

const senopatiHeatmap = [
    { day: 'Mon', cells: [58, 70, 92, 74, 35] },
    { day: 'Tue', cells: [66, 73, 95, 72, 32] },
    { day: 'Wed', cells: [60, 68, 96, 75, 40] },
    { day: 'Thu', cells: [72, 78, 98, 80, 46] },
    { day: 'Fri', cells: [76, 84, 100, 88, 58] },
    { day: 'Weekend', cells: [84, 93, 96, 90, 55], weekend: true },
];

const kemangHeatmap = [
    { day: 'Mon', cells: [52, 62, 84, 66, 30] },
    { day: 'Tue', cells: [58, 68, 88, 70, 32] },
    { day: 'Wed', cells: [56, 64, 90, 72, 36] },
    { day: 'Thu', cells: [64, 72, 92, 76, 40] },
    { day: 'Fri', cells: [68, 78, 94, 82, 48] },
    { day: 'Weekend', cells: [78, 86, 92, 84, 44], weekend: true },
];

export const branches = {
    senopati: {
        id: 'senopati',
        storeName: 'Artisan Roastery',
        label: 'Senopati Flagship',
        city: 'Senopati, JKT',
        area: 'Senopati',
        baseRevenue: 28450000,
        baseOrders: 642,
        satisfaction: '4.9',
        positive: '98.4%',
        rank: 'Top 2%',
        seatingArea: 'Main Hall & Patio',
        seatsOccupied: 48,
        seatsTotal: 50,
        repeatRate: 64,
        repeatDelta: '+5.4%',
        payoutCycle: 'Daily 23:59',
        payoutStatus: 'Settled',
        chart: {
            foot: [34, 118, 62, 96, 122, 110, 60, 36],
            espresso: [40, 160, 75, 105, 100, 100, 55, 30],
        },
        settlements: [
            { label: 'QRIS Instant', share: 58 },
            { label: 'GoPay / OVO E-Wallets', share: 28 },
            { label: 'EDC Credit / Debit Cards', share: 14 },
        ],
        heatmap: senopatiHeatmap,
    },
    kemang: {
        id: 'kemang',
        storeName: 'Artisan Roastery',
        label: 'Kemang Corner',
        city: 'Kemang, JKT',
        area: 'Kemang',
        baseRevenue: 17640000,
        baseOrders: 398,
        satisfaction: '4.7',
        positive: '97.1%',
        rank: 'Top 6%',
        seatingArea: 'Garden & Mezzanine',
        seatsOccupied: 31,
        seatsTotal: 40,
        repeatRate: 57,
        repeatDelta: '+2.8%',
        payoutCycle: 'Daily 23:59',
        payoutStatus: 'Settled',
        chart: {
            foot: [24, 88, 46, 72, 102, 84, 44, 26],
            espresso: [28, 120, 58, 80, 86, 78, 40, 22],
        },
        settlements: [
            { label: 'QRIS Instant', share: 51 },
            { label: 'GoPay / OVO E-Wallets', share: 33 },
            { label: 'EDC Credit / Debit Cards', share: 16 },
        ],
        heatmap: kemangHeatmap,
    },
};

export const branchOptions = Object.values(branches);

export const sparklineBars = [12, 18, 14, 22, 28];

export const menuItems = [
    {
        rank: 1,
        name: 'Signature Cold Drip',
        category: 'Single Origin Bar',
        revenue: 9100000,
        units: '202 bottles',
        stock: { tone: 'in', label: 'In Stock', detail: '(84L)' },
        rankTone: 'peach',
    },
    {
        rank: 2,
        name: 'Truffle Croissant',
        category: 'Artisanal Bakery',
        revenue: 6800000,
        units: '151 pcs',
        stock: { tone: 'low', label: 'Low Stock', detail: '(12 left)' },
        rankTone: 'peach',
    },
    {
        rank: 3,
        name: 'V60 Single Origin',
        note: '(Gayo Anaerobic)',
        category: 'Manual Brew Bar',
        revenue: 5250000,
        units: '105 carafes',
        stock: { tone: 'in', label: 'In Stock', detail: '(4.2kg)' },
        rankTone: 'blue',
    },
    {
        rank: 4,
        name: 'Oat Milk Latte',
        note: '(Barista Ed.)',
        category: 'Espresso & Plant',
        revenue: 4700000,
        units: '94 mugs',
        stock: { tone: 'healthy', label: 'Healthy Supply', detail: null },
        rankTone: 'blue',
    },
    {
        rank: 5,
        name: 'Butter Croissant',
        category: 'Artisanal Bakery',
        revenue: 3850000,
        units: '96 pcs',
        stock: { tone: 'in', label: 'In Stock', detail: '(24 left)' },
        rankTone: 'peach',
    },
    {
        rank: 6,
        name: 'Kyoto Cold Brew',
        category: 'Manual Brew Bar',
        revenue: 3100000,
        units: '74 bottles',
        stock: { tone: 'in', label: 'In Stock', detail: '(16L)' },
        rankTone: 'blue',
    },
    {
        rank: 7,
        name: 'Espresso Tonic',
        category: 'Espresso & Plant',
        revenue: 2750000,
        units: '68 glasses',
        stock: { tone: 'low', label: 'Low Stock', detail: '(9 left)' },
        rankTone: 'peach',
    },
    {
        rank: 8,
        name: 'Matcha Cloud Latte',
        category: 'Espresso & Plant',
        revenue: 2300000,
        units: '52 mugs',
        stock: { tone: 'healthy', label: 'Healthy Supply', detail: null },
        rankTone: 'blue',
    },
];

export const liveOrders = [
    {
        id: '#1042',
        table: 'Table 08',
        age: '2m',
        item: 'Signature Cold Drip ×2',
        total: 'Rp 96.000',
        column: 'new',
    },
    {
        id: '#1043',
        table: 'Table 12',
        age: '3m',
        item: 'Truffle Croissant ×3',
        total: 'Rp 132.000',
        column: 'new',
    },
    {
        id: '#1044',
        table: 'Bar seat 02',
        age: '4m',
        item: 'V60 Gayo Anaerobic',
        total: 'Rp 58.000',
        column: 'new',
    },
    {
        id: '#1039',
        table: 'Table 04',
        age: '7m',
        item: 'Oat Milk Latte ×2',
        total: 'Rp 84.000',
        column: 'brewing',
    },
    {
        id: '#1040',
        table: 'Table 15',
        age: '8m',
        item: 'Kyoto Cold Brew',
        total: 'Rp 48.000',
        column: 'brewing',
    },
    {
        id: '#1041',
        table: 'Garden 01',
        age: '9m',
        item: 'Espresso Tonic ×2',
        total: 'Rp 76.000',
        column: 'brewing',
    },
    {
        id: '#1037',
        table: 'Table 06',
        age: '11m',
        item: 'Butter Croissant ×2',
        total: 'Rp 56.000',
        column: 'ready',
    },
    {
        id: '#1038',
        table: 'Table 10',
        age: '12m',
        item: 'Matcha Cloud Latte',
        total: 'Rp 46.000',
        column: 'ready',
    },
];

export const liveOrderColumns = [
    { id: 'new', label: 'New', tone: 'bg-[#F3F6FD] text-[#6C6875]' },
    { id: 'brewing', label: 'Brewing', tone: 'bg-[#FFF1E4] text-[#8D4B00]' },
    { id: 'ready', label: 'Ready', tone: 'bg-[#E8FBF2] text-[#0D7A5F]' },
];

export const rosterSuggestions = [
    {
        shift: '08:00 – 10:00',
        role: 'Barista · espresso bar',
        action: '+1 barista',
        reason: 'Rush peak at 08:30 reaches 160 cups; current pace leaves a 9 minute ticket queue.',
        tone: 'high',
    },
    {
        shift: '14:00 – 16:30',
        role: 'Floor · co-working block',
        action: 'Add floor support',
        reason: '96% seat occupancy with laptop sockets in active use; reset time is the bottleneck.',
        tone: 'medium',
    },
    {
        shift: '18:00 – 20:00',
        role: 'Bar · handover',
        action: 'Keep current roster',
        reason: 'Evening throughput drops below 55 cups per hour. No change needed.',
        tone: 'calm',
    },
];

export const dashboardTargets = [
    {
        id: 'business-intelligence',
        view: 'bi',
        label: 'Business Intelligence',
        hint: 'Overview & export',
        keywords: ['overview', 'bi', 'business intelligence', 'revenue', 'report'],
    },
    {
        id: 'hourly-rush',
        view: 'bi',
        label: 'Hourly Rush Trend',
        hint: 'Espresso pace & foot traffic',
        keywords: ['rush', 'hourly', 'espresso', 'traffic', 'throughput'],
    },
    {
        id: 'retention-settlements',
        view: 'bi',
        label: 'Retention & Settlements',
        hint: 'Repeat rate & payment mix',
        keywords: ['retention', 'settlement', 'qris', 'payment', 'loyalty'],
    },
    {
        id: 'top-selling-items',
        view: 'bi',
        label: 'Top Selling Menu Items',
        hint: 'Velocity & inventory',
        keywords: ['menu', 'items', 'stock', 'inventory', 'cold drip', 'croissant'],
    },
    {
        id: 'store-capacity-heatmap',
        view: 'bi',
        label: 'Store Capacity Heatmap',
        hint: 'Seat occupancy by hour',
        keywords: ['capacity', 'heatmap', 'seats', 'occupancy', 'coworking'],
    },
    {
        id: 'reviews-view',
        view: 'reviews',
        label: 'Ulasan & Reputasi',
        hint: 'Rating, sentimen & balasan',
        keywords: ['ulasan', 'review', 'rating', 'sentimen', 'reputasi', 'balasan'],
    },
    {
        id: 'menu-view',
        view: 'menu',
        label: 'Profil & Menu Kafe',
        hint: 'Tambah menu & resep seduh',
        keywords: ['menu', 'resep', 'hpp', 'margin', 'brew', 'katalog'],
    },
    {
        id: 'devices-view',
        view: 'devices',
        label: 'Perangkat Kasir & Printer',
        hint: 'Hardware dan rute cetak',
        keywords: ['perangkat', 'printer', 'kasir', 'kds', 'qris', 'hardware'],
    },
    {
        id: 'tables-view',
        view: 'tables',
        label: 'Kelola Kafe & Meja',
        hint: 'Denah QRIS & detail meja',
        keywords: ['meja', 'denah', 'qr', 'outdoor', 'indoor', 'kapasitas'],
    },
    {
        id: 'schedule-view',
        view: 'schedule',
        label: 'Jadwal & Shift Barista',
        hint: 'Roster, shift & performa',
        keywords: ['jadwal', 'shift', 'roster', 'barista', 'staf', 'performa'],
    },
    {
        id: 'cashier-staff-view',
        view: 'cashierStaff',
        label: 'Kelola Staf Kasir & POS',
        hint: 'Akses kasir & PIN terminal',
        keywords: ['kasir', 'cashier', 'pin', 'akses', 'terminal', 'staf'],
    },
];
