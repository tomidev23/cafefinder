import { Coffee, Share2, Globe, Mail, Smartphone, Apple, CreditCard, QrCode } from 'lucide-react';

const columns = [
    { title: 'Direktori Kota', items: ['Batam Center', 'Jakarta Selatan', 'Bandung Dago', 'Surabaya Barat'] },
    { title: 'Spot populer', items: ['Common Grounds Batam', 'Tanamera Coffee Roastery', 'Socius Coffee', 'Kopi Nako Dago'] },
    { title: 'Untuk Mitra', items: ['Daftarkan Kafe', 'Portal Pemilik', 'Klaim Listing', 'Komunitas Barista'] },
];

export default function Footer() {
    return (
        <footer id="komunitas" className="mt-10 border-t border-stone-200 bg-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 lg:px-6">
                <div>
                    <p className="flex items-center gap-2 text-xl font-semibold tracking-tight text-stone-950"><Coffee className="h-5 w-5 text-amber-900" /> CafeFinder</p>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500">
                        Direktori kafe lokal yang fokus ke rasa, suasana, WiFi, dan keputusan datang yang lebih cepat.
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-stone-500">
                        <Share2 className="h-4 w-4" /><Globe className="h-4 w-4" /><Mail className="h-4 w-4" />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700"><QrCode className="h-3.5 w-3.5" /> QRIS</span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700"><CreditCard className="h-3.5 w-3.5" /> e-Wallet</span>
                    </div>
                </div>

                {columns.map((c) => (
                    <div key={c.title}>
                        <h4 className="font-semibold text-stone-950">{c.title}</h4>
                        <ul className="mt-3 space-y-2 text-sm text-stone-500">
                            {c.items.map((i) => (
                                <li key={i}><a href="#" className="hover:text-amber-800">{i}</a></li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h4 className="font-semibold text-stone-950">Aplikasi Mobile</h4>
                    <ul className="mt-3 space-y-2 text-sm text-stone-500">
                        <li className="flex items-center gap-2"><Apple className="h-3.5 w-3.5" /> Unduh aplikasi iOS</li>
                        <li className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5" /> Unduh aplikasi Android</li>
                        <li><a href="#" className="hover:text-amber-800">Kebijakan privasi</a></li>
                        <li><a href="#" className="hover:text-amber-800">Syarat dan ketentuan</a></li>
                    </ul>
                    <div className="mt-5 flex items-center gap-3 text-stone-500">
                        <Share2 className="h-4 w-4" />
                        <Globe className="h-4 w-4" />
                        <Mail className="h-4 w-4" />
                    </div>
                </div>
            </div>
            <p className="border-t border-stone-200 py-5 text-center text-xs text-stone-500">© 2026 CafeFinder. Platform discovery kafe lokal, kopi spesialti, dan pengalaman nongkrong yang lebih jelas.</p>
        </footer>
    );
}
