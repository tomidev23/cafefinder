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

const cities = ['Batam Center', 'Jakarta Selatan', 'Bandung', 'Surabaya'];

export default function Navbar() {
    const { auth } = usePage().props || {};
    const [open, setOpen] = useState(false);
    const [city, setCity] = useState(cities[0]);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur supports-backdrop-filter:bg-stone-50/80">
            {/* Wrapper Full-Width Kanan Kiri */}
            <div className="w-full px-4 py-3 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between gap-3 lg:gap-4">

                    {/* Logo & City Selector */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-lg font-bold tracking-tight text-stone-950 shadow-sm transition hover:border-stone-300"
                        >
                            <img src="/img/logo/logoamber.svg" alt="logo CafeFinder" className="h-10 w-10" />
                            <div>
                                <span className="text-[#56311F] font-bold">Cafe</span>
                                <span className="text-[#56311F]">Finder</span>
                            </div>
                        </Link>

                        {/* City Selector (Desktop) */}
                        <div className="relative hidden lg:block">
                            <button
                                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
                            >
                                <MapPin className="h-4 w-4 text-amber-900" />
                                <span>{city}</span>
                                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {cityDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 rounded-2xl border border-stone-200 bg-white py-2 shadow-lg z-50">
                                    {cities.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setCity(item);
                                                setCityDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center px-4 py-2 text-left text-sm transition ${city === item
                                                    ? 'bg-amber-50 font-semibold text-amber-900'
                                                    : 'text-stone-700 hover:bg-stone-50'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Bar (Mid-Large Screen) */}
                    <div className="hidden max-w-md flex-1 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 shadow-sm focus-within:border-amber-900 md:flex lg:max-w-lg">
                        <Search className="h-4 w-4 shrink-0 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Cari kafe, manual brew, oat milk, atau spot WFH..."
                            className="w-full border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0"
                        />
                        <span className="hidden shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600 xl:inline-block">WiFi Cepat</span>
                        <span className="hidden shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600 xl:inline-block">Outdoor</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden items-center gap-1 text-sm lg:flex">
                        {links.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className={`rounded-full px-3.5 py-2 font-medium transition ${l.active
                                        ? 'bg-stone-900 text-white'
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                                    }`}
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    {/* Auth Buttons & Mobile Menu Toggle */}
                    <div className="flex items-center gap-2.5">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-full bg-amber-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-950 active:scale-[0.99]"
                            >
                                Masuk
                            </Link>
                        )}

                        <button
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 lg:hidden"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle Menu"
                        >
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                </div>

                {/* City Chips for Small Screens */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 md:hidden scrollbar-none">
                    {cities.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCity(item)}
                            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${city === item
                                    ? 'border-amber-900 bg-amber-900 text-white'
                                    : 'border-stone-200 bg-white text-stone-700'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {open && (
                <div className="border-t border-stone-200 bg-white px-4 py-4 shadow-lg lg:hidden">
                    <div className="mb-3 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
                        <Search className="h-4 w-4 shrink-0 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Cari kafe atau spot WFH..."
                            className="w-full border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0"
                        />
                    </div>

                    <div className="space-y-1">
                        {links.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${l.active
                                        ? 'bg-amber-50 text-amber-950 font-semibold'
                                        : 'text-stone-700 hover:bg-stone-100'
                                    }`}
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}