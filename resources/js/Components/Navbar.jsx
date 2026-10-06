import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Coffee, MapPin, Menu, Search, User, X, Plus } from 'lucide-react';

const links = [
    { label: 'Eksplorasi', href: '#eksplorasi', active: true },
    { label: 'Papan Peringkat', href: '#peringkat' },
    { label: 'Promosi', href: '#promosi' },
    { label: 'Pesanan', href: '#pesanan' },
    { label: 'Komunitas', href: '#komunitas' },
];

export default function Navbar() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-amber-900">
                    <Coffee className="h-5 w-5" /> CafeFinder
                </Link>

                <div className="hidden w-64 items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-500 md:flex">
                    <Search className="h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Cari nama kafe, biji kopi, atau suasana"
                        className="w-full border-0 bg-transparent p-0 text-sm placeholder:text-stone-400 focus:ring-0"
                    />
                </div>

                <button className="ml-auto hidden items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 lg:flex">
                    <MapPin className="h-4 w-4" /> Senopati, Jakarta Selatan
                </button>

                <nav className="hidden items-center gap-5 text-sm lg:flex">
                    {links.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            className={`border-b-2 pb-1 transition hover:text-amber-800 ${
                                l.active ? 'border-amber-800 font-semibold text-amber-900' : 'border-transparent text-stone-700'
                            }`}
                        >
                            {l.label}
                        </a>
                    ))}
                    <a href="#mitra" className="flex items-center gap-1 text-stone-700 hover:text-amber-800">
                        <Plus className="h-4 w-4" /> Tambah Kafe
                    </a>
                </nav>

                <div className="ml-auto flex items-center gap-3 lg:ml-0">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="rounded-lg bg-amber-800 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-900">
                            Dashboard
                        </Link>
                    ) : (
                        <Link href={route('login')} className="rounded-lg bg-amber-800 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-900">
                            Masuk
                        </Link>
                    )}
                    <User className="hidden h-6 w-6 text-stone-500 sm:block" />
                    <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
                        {open ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="space-y-1 border-t border-stone-200 bg-white px-4 py-3 lg:hidden">
                    {links.map((l) => (
                        <a key={l.label} href={l.href} className="block rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100">
                            {l.label}
                        </a>
                    ))}
                    <a href="#mitra" className="block rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100">
                        Tambah Kafe
                    </a>
                </div>
            )}
        </header>
    );
}
