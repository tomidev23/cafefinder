import { Coffee, Share2, Globe, Mail, Smartphone, Apple, CreditCard, QrCode } from 'lucide-react';

const spotLinks = [
    { label: 'Common Grounds Batam', href: '#peringkat' },
    { label: 'Tanamera Coffee Roastery', href: '#peringkat' },
    { label: 'Socius Coffee', href: '#peringkat' },
    { label: 'Kopi Nako Dago', href: '#peringkat' },
];

const partnerLinks = [
    { label: 'Daftarkan Kafe', href: '#mitra' },
    { label: 'Portal Pemilik', href: '#mitra' },
    { label: 'Klaim Listing', href: '#mitra' },
    { label: 'Komunitas Barista', href: '#mitra' },
];

export default function Footer() {
    return (
        <footer id="komunitas" className="mt-10 border-t border-stone-200 bg-white">
            <div className="w-full px-4 py-12 sm:px-6 lg:px-10">
                <div className="grid gap-8 md:grid-cols-4">
                    <div>
                        <p className="flex items-center gap-2 text-xl font-semibold tracking-tight text-stone-950">
                            <Coffee className="h-5 w-5 text-amber-900" /> CafeFinder
                        </p>
                        <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500">
                            Direktori kafe lokal yang fokus ke rasa, suasana, WiFi, dan keputusan datang yang lebih cepat.
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-stone-500">
                            <a href="#" aria-label="Bagikan" className="transition hover:text-amber-900">
                                <Share2 className="h-4 w-4" />
                            </a>
                            <a href="#" aria-label="Website" className="transition hover:text-amber-900">
                                <Globe className="h-4 w-4" />
                            </a>
                            <a href="mailto:halo@cafefinder.id" aria-label="Email" className="transition hover:text-amber-900">
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
                                <QrCode className="h-3.5 w-3.5" /> QRIS
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
                                <CreditCard className="h-3.5 w-3.5" /> e-Wallet
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-950">Spot populer</h4>
                        <ul className="mt-3 space-y-2 text-sm text-stone-500">
                            {spotLinks.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="transition hover:text-amber-900">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-950">Untuk Mitra</h4>
                        <ul className="mt-3 space-y-2 text-sm text-stone-500">
                            {partnerLinks.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="transition hover:text-amber-900">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-950">Aplikasi Mobile</h4>
                        <ul className="mt-3 space-y-2 text-sm text-stone-500">
                            <li>
                                <a href="#peta" className="flex items-center gap-2 transition hover:text-amber-900">
                                    <Apple className="h-3.5 w-3.5" /> Unduh aplikasi iOS
                                </a>
                            </li>
                            <li>
                                <a href="#peta" className="flex items-center gap-2 transition hover:text-amber-900">
                                    <Smartphone className="h-3.5 w-3.5" /> Unduh aplikasi Android
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition hover:text-amber-900">
                                    Kebijakan privasi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition hover:text-amber-900">
                                    Syarat dan ketentuan
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <p className="border-t border-stone-200 py-5 text-center text-xs text-stone-500">
                © {new Date().getFullYear()} CafeFinder. Platform discovery kafe lokal, kopi spesialti, dan pengalaman nongkrong yang lebih jelas.
            </p>
        </footer>
    );
}
