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
                        <p className="flex items-center gap-1 text-xl font-semibold tracking-tight text-stone-950">
                            <img src="/img/logo/nobg1.svg" alt="CafeFinder Logo" className="h-40 w-50" />
                        </p>
                        <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500">
                            Direktori kafe lokal yang fokus ke rasa, suasana, WiFi, dan keputusan datang yang lebih cepat.
                        </p>
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
                        <h4 className="font-semibold text-stone-950">Kebijakan</h4>
                        <ul className="mt-3 space-y-2 text-sm text-stone-500">
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
