export const menuDefaultImage =
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80';

export const menuCategories = [
    { id: 'manual', label: 'Manual Brew' },
    { id: 'espresso', label: 'Espresso-based' },
    { id: 'signature', label: 'Signature' },
    { id: 'non-coffee', label: 'Non-Coffee' },
    { id: 'pastry', label: 'Pastry' },
];

export const tastingNotePresets = [
    { label: 'Peach', tone: 'peach' },
    { label: 'Jasmine', tone: 'rose' },
    { label: 'Honeycomb', tone: 'amber' },
    { label: 'Black Tea', tone: 'brown' },
    { label: 'Citrus', tone: 'green' },
    { label: 'Bergamot', tone: 'blue' },
];

export const beanOptions = [
    { id: 'kerinci', label: 'Kerinci Anaerobic', extra: 0, default: true },
    { id: 'gayo', label: 'Gayo Wine Fermentation', extra: 5000 },
    { id: 'ethiopia', label: 'Ethiopia Yirgacheffe Washed', extra: 8000 },
    { id: 'flores', label: 'Flores Bajawa Honey', extra: 3000 },
];

export const sweetnessOptions = [
    { value: 'Tanpa Gula (Unsweetened) 0%', label: 'Tanpa Gula / Unsweetened (0%)' },
    { value: 'Gula Rendah (25%)', label: 'Gula Rendah (25%)' },
    { value: 'Gula Sedang (50%)', label: 'Gula Sedang (50%)' },
    { value: 'Gula Penuh (100%)', label: 'Gula Penuh (100%)' },
];

export const milkOptions = [
    { value: 'Fresh Milk (+Rp 0)', label: 'Fresh Milk (+Rp 0)' },
    { value: 'Oat Milk (+Rp 6.000)', label: 'Oat Milk (+Rp 6.000)' },
    { value: 'Almond Milk (+Rp 8.000)', label: 'Almond Milk (+Rp 8.000)' },
    { value: 'Tanpa Susu (0%)', label: 'Tanpa Susu (0%)' },
];

export const pourStages = [
    {
        number: 1,
        title: 'Blooming',
        water: '45ml',
        time: 'Durasi 00:00 – 00:40',
    },
    {
        number: 2,
        title: 'Tuangan Kedua (Agitasi Spiral)',
        water: '100ml',
        time: 'Durasi 00:40 – 01:30',
    },
    {
        number: 3,
        title: 'Tuangan Akhir (Pusat)',
        water: '80ml',
        time: 'Selesai 02:45',
    },
];

export const initialMenuDraft = {
    name: 'Kerinci Natural Anaerobic V60',
    category: 'manual',
    notes: ['Peach', 'Jasmine', 'Honeycomb', 'Black Tea'],
    description:
        'Kopi filter single origin dari perkebunan Gunung Kerinci dengan fermentasi anaerobik 72 jam. Menghasilkan aroma floral melati yang semerbak, acidity buah persik segar, serta manis lembut madu alami di akhir seduhan.',
    baristaRecommendation: true,
    inStock: true,
    price: 38000,
    promoPrice: '',
    hpp: 14500,
    dose: '15',
    ratio: '1:15 (225ml)',
    waterTemp: '92',
    targetTime: '02:45',
    grindSize: 'Medium-Coarse (V60 Standard)',
    brewer: 'Hario V60 Ceramic 02',
    servingTemperature: 'hot',
    bean: 'kerinci',
    sweetness: 'Tanpa Gula (Unsweetened) 0%',
    milk: 'Fresh Milk (+Rp 0)',
    customOptions: [],
    photo: menuDefaultImage,
};
