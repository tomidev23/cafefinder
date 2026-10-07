import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Coffee, MapPin, Menu, Search, User, X, ChevronDown } from 'lucide-react';

const links = [
    { label: 'Eksplorasi', href: '#eksplorasi', active: true },
    { label: 'Peringkat', href: '#peringkat' },
    { label: 'Peta', href: '#peta' },
    { label: 'Sorotan', href: '#promosi' },
    { label: 'Pemilik', href: '#mitra' },
];

const cities = ['Batam Center', 'Jakarta Selatan'];

export default function Navbar() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [city, setCity] = useState(cities[0]);

    return (
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur supports-backdrop-filter:bg-stone-50/80">
            <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-lg font-semibold tracking-tight text-stone-950 shadow-sm">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-900 text-white">
                            <Coffee className="h-4 w-4" />
                        </span>
                        CafeFinder
                    </Link>

                    <button className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 shadow-sm lg:flex">
                        <MapPin className="h-4 w-4 text-amber-900" />
                        <span className="font-medium">{city}</span>
                        <ChevronDown className="h-4 w-4 text-stone-500" />
                    </button>

                    <div className="hidden flex-1 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 py-2 shadow-sm md:flex">
                        <Search className="h-4 w-4 shrink-0 text-stone-500" />
                        <input
                            type="text"
                            placeholder="Cari kafe, manual brew, oat milk, atau spot WFH..."
                            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-0"
                        />
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">WiFi Cepat</span>
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">Outdoor</span>
                    </div>

                    <nav className="ml-auto hidden items-center gap-2 text-sm lg:flex">
                        {links.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className={`rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950 ${
                                    l.active ? 'bg-stone-900 text-white hover:bg-stone-900 hover:text-white' : 'text-stone-700'
                                }`}
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-3 lg:ml-0">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-300 hover:bg-stone-50">
                                <User className="h-4 w-4" /> Dashboard
                            </Link>
                        ) : (
                            <Link href={route('login')} className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-950">
                                Masuk
                            </Link>
                        )}
                        <button className="rounded-full border border-stone-200 bg-white p-2 text-stone-700 shadow-sm lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
                            {open ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
                    {cities.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCity(item)}
                            className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition ${
                                city === item ? 'border-amber-900 bg-amber-900 text-white' : 'border-stone-200 bg-white text-stone-700'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {open && (
                <div className="border-t border-stone-200 bg-stone-50 px-4 py-3 lg:hidden">
                    <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
                        {cities.map((item) => (
                            <button
                                key={item}
                                onClick={() => setCity(item)}
                                className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition ${
                                    city === item ? 'border-amber-900 bg-amber-900 text-white' : 'border-stone-200 bg-white text-stone-700'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    {links.map((l) => (
                        <a key={l.label} href={l.href} className="mb-1 block rounded-2xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 shadow-sm hover:bg-stone-50">
                            {l.label}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
}
