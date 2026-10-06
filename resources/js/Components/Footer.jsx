import { Coffee, Share2, Globe, Mail, Smartphone, Apple } from 'lucide-react';

const columns = [
    { title: 'Eksplorasi', items: ['Jelajahi Kafe', 'Direktori Wilayah', 'Pour Over Tertinggi', 'Ruang Kerja Tenang'] },
    { title: 'Untuk Mitra', items: ['Untuk Pemilik Kafe', 'Klaim Kafe Anda', 'Portal Pemilik', 'Komunitas Barista'] },
];

export default function Footer() {
    return (
        <footer id="komunitas" className="mt-8 border-t border-stone-200 bg-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 lg:px-6">
                <div>
                    <p className="flex items-center gap-2 text-xl font-bold text-amber-900"><Coffee className="h-5 w-5" /> CafeFinder</p>
                    <p className="mt-3 max-w-xs text-xs text-stone-500">
                        Temukan kafe nyaman, roastery artisanal berpengalaman tinggi, dan nikmati pemesanan digital tanpa antre di Jakarta.
                    </p>
                    <div className="mt-4 flex gap-3 text-stone-500">
                        <Share2 className="h-4 w-4" /><Globe className="h-4 w-4" /><Mail className="h-4 w-4" />
                    </div>
                </div>

                {columns.map((c) => (
                    <div key={c.title}>
                        <h4 className="font-bold text-stone-900">{c.title}</h4>
                        <ul className="mt-3 space-y-2 text-xs text-stone-500">
                            {c.items.map((i) => (
                                <li key={i}><a href="#" className="hover:text-amber-800">{i}</a></li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h4 className="font-bold text-stone-900">Aplikasi Mobile</h4>
                    <ul className="mt-3 space-y-2 text-xs text-stone-500">
                        <li className="flex items-center gap-2"><Apple className="h-3.5 w-3.5" /> Unduh Aplikasi iOS</li>
                        <li className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5" /> Unduh Aplikasi Android</li>
                        <li><a href="#" className="hover:text-amber-800">Kebijakan Privasi</a></li>
                        <li><a href="#" className="hover:text-amber-800">Syarat dan Ketentuan</a></li>
                    </ul>
                </div>
            </div>
            <p className="border-t py-5 text-center text-[11px] text-stone-500">© 2026 CafeFinder Inc. Platform kurasi kafe dan ruang artisanal. Hak cipta dilindungi.</p>
        </footer>
    );
}
