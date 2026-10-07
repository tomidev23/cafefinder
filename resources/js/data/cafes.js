export const areas = ['Batam Center', 'Jakarta Selatan', 'Bandung Dago'];

export const filters = [
    { id: 'wifi', label: 'WiFi Cepat 100+ Mbps' },
    { id: 'power', label: 'Ada Stopkontak' },
    { id: 'terrace', label: 'Outdoor Area' },
    { id: 'brew', label: 'Manual Brew V60' },
    { id: 'work', label: 'WFH Friendly' },
    { id: '24h', label: '24 Jam' },
];

export const stats = [
    { value: '168+', label: 'Kafe terkurasi' },
    { value: '4.8/5', label: 'Rata-rata rating kopi' },
    { value: '12 mnt', label: 'Rata-rata siap pesan' },
];

export const podium = [
    {
        rank: 2,
        badge: 'Silver pick • WFH friendly',
        name: 'Tanamera Coffee Roastery',
        area: 'Batam Center • dekat One Batam Mall',
        tagline: 'Espresso tegas, seating nyaman, dan batch brew yang stabil',
        distance: '500 m dari lokasi mu',
        rating: 4.9,
        orders: '1.280 check-in minggu ini',
        price: 'Rp 28rb–55rb',
        signature: 'Manual Brew Ethiopia',
        image: '/images/cafes/tanamera.jpg',
    },
    {
        rank: 1,
        badge: 'Top rated • favourite buat kerja',
        name: 'Common Grounds Batam',
        area: 'Batam Center • Komplek Ruko Penuin Business Center',
        distance: '350 m dari lokasi mu • 4 mnt jalan kaki',
        rating: 4.9,
        orders: '2.430 check-in minggu ini',
        seats: '18 kursi tersedia',
        price: 'Rp 30rb–65rb',
        wifi: '180 Mbps',
        image: '/images/cafes/onefifteen.jpg',
    },
    {
        rank: 3,
        badge: 'Bronze pick • scenic corner',
        name: 'Socius Coffee',
        area: 'Jakarta Selatan • Kemang Raya',
        distance: '1.6 km dari lokasi mu',
        rating: 4.8,
        orders: '1.140 check-in minggu ini',
        price: 'Rp 26rb–48rb',
        signature: 'Kopi Susu Gula Aren',
        image: '/images/cafes/ombe.jpg',
    },
];

export const ranking = [
    { rank: 4, name: 'Manner Coffee', meta: 'Batam Center • 4.8 rating kopi • 220 Mbps WiFi • Rp 32rb–58rb' },
    { rank: 5, name: 'Tiga Tjeret Batam', meta: 'Nagoya Hill • Ambiance 91/100 • Outdoor area • Rp 25rb–45rb' },
    { rank: 6, name: 'Kopi Nako Dago', meta: 'Bandung Dago • 4.7 rating kopi • 150 Mbps WiFi • Rp 24rb–42rb' },
    { rank: 7, name: 'Kedai Kopi Kita', meta: 'Jaksel • Manual brew favorit • Ambiance 88/100 • Rp 27rb–49rb' },
    { rank: 8, name: 'Fore Batam', meta: 'Harbour Bay • 4.6 rating kopi • 100 Mbps WiFi • Rp 22rb–38rb' },
    { rank: 9, name: 'Otten Coffee Lab', meta: 'Buah Batu • 4.7 rating kopi • Oat milk tersedia • Rp 30rb–52rb' },
    { rank: 10, name: 'Brew & Co', meta: 'Batam Kota • Pet friendly • 24 jam • Rp 29rb–55rb', full: true },
];

export const featured = [
    {
        name: 'Common Grounds Batam',
        area: 'Batam Center',
        rating: '4.9 (1.2k ulasan)',
        desc: 'Interior hangat, meja lebar, dan espresso balance yang cocok untuk sesi kerja panjang.',
        tags: ['Recommended for WFH', 'Aesthetic Interior', 'Sedia Oat Milk'],
        price: 'Rp 28rb – 60rb',
        image: '/images/cafes/onefifteen.jpg',
    },
    {
        name: 'Tanamera Coffee Roastery',
        area: 'Jakarta Selatan',
        rating: '4.8 (980 ulasan)',
        desc: 'Single origin rapi, area indoor adem, dan menu manual brew yang kuat untuk pecinta kopi serius.',
        tags: ['Manual Brew V60', 'Kopi Susu Gula Aren', 'Ruangan Tenang'],
        price: 'Rp 25rb – 52rb',
        image: '/images/cafes/tanamera.jpg',
    },
    {
        name: 'Kedai Kopi Kita',
        area: 'Batam Kota',
        rating: '4.7 (760 ulasan)',
        desc: 'Spot santai dengan outdoor area teduh, cocok buat quick catch-up dan minum kopi sore.',
        tags: ['Outdoor Area', 'Pet Friendly', 'Espresso + Pastry'],
        price: 'Rp 22rb – 45rb',
        image: '/images/cafes/ombe.jpg',
    },
];

export const features = [
    { title: 'Pesan & Bayar Kasir via App', desc: 'Kirim order espresso, manual brew, atau kopi susu tanpa antre. Status bisa dilacak dari ponsel saat menuju lokasi.', color: 'bg-amber-100 text-amber-700', icon: 'touch' },
    { title: 'QRIS, e-Wallet, dan Struk Digital', desc: 'Dukungan pembayaran lokal yang familiar untuk pelanggan harian dan transaksi kasir yang lebih cepat.', color: 'bg-stone-200 text-stone-700', icon: 'qr' },
    { title: 'Dashboard untuk Pemilik Kafe', desc: 'Pantau jam sibuk, menu paling laku, dan area kursi kosong agar operasional lebih rapi.', color: 'bg-emerald-100 text-emerald-700', icon: 'chart' },
];
