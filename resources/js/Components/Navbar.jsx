import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { MapPin, Menu, Search, User, X, ChevronDown } from 'lucide-react';
import ThemeSwitcher from '@/Components/ThemeSwitcher';

const links = [
    { label: 'Eksplorasi', href: '#eksplorasi' },
    { label: 'Peringkat', href: '#peringkat' },
    { label: 'Peta', href: '#peta' },
    { label: 'Sorotan', href: '#promosi' },
    { label: 'Promosikan kafe', href: '/pricing' },
];

const cities = ['Batam Center'];

export default function Navbar() {
    const { props, url } = usePage();
    const { auth } = props || {};
    const [open, setOpen] = useState(false);
    const [city, setCity] = useState(cities[0]);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const currentPath = url?.split('?')[0] || window.location.pathname;
    const activeHash = window.location.hash || '#eksplorasi';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur supports-backdrop-filter:bg-stone-50/80 dark:border-stone-800 dark:bg-stone-900/95 dark:supports-backdrop-filter:bg-stone-900/80">
            {/* Wrapper Full-Width Kanan Kiri */}
            <div className="w-full px-4 py-3 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between gap-3 lg:gap-4">

                    {/* Logo & City Selector */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-lg font-bold tracking-tight text-stone-950 shadow-sm transition hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-700"
                        >
                            <img src="/img/logo/logoamber.svg" alt="logo CafeFinder" className="h-10 w-10" />
                            <div>
                                <span className="text-[#56311F] dark:text-[#E8D7C8] font-bold">Cafe</span>
                                <span className="text-[#56311F] dark:text-[#E8D7C8]">Finder</span>
                            </div>
                        </Link>

                        {/* City Selector (Desktop) */}
                        <div className="relative hidden lg:block">
                            <button
                                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                            >
                                <MapPin className="h-4 w-4 text-amber-900 dark:text-amber-500" />
                                <span>{city}</span>
                                <ChevronDown className={`h-4 w-4 text-stone-400 dark:text-stone-500 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {cityDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 rounded-2xl border border-stone-200 bg-white py-2 shadow-lg z-50 dark:border-stone-800 dark:bg-stone-900">
                                    {cities.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setCity(item);
                                                setCityDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center px-4 py-2 text-left text-sm transition ${city === item
                                                    ? 'bg-amber-50 font-semibold text-amber-900 dark:bg-amber-950/60 dark:text-amber-400'
                                                    : 'text-stone-700 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800'
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
                    <div className="hidden max-w-md flex-1 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 shadow-sm focus-within:border-amber-900 dark:border-stone-800 dark:bg-stone-900 md:flex lg:max-w-lg">
                        <Search className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" />
                        <input
                            type="text"
                            placeholder="Cari kafe, manual brew, oat milk, atau spot WFH..."
                            className="w-full border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-500"
                        />
                        <span className="hidden shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300 xl:inline-block">WiFi Cepat</span>
                        <span className="hidden shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300 xl:inline-block">Outdoor</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden items-center gap-1 text-sm lg:flex">
                        {links.map((l) => {
                            const isActive = l.href.startsWith('/')
                                ? currentPath === l.href
                                : currentPath === '/' && activeHash === l.href;
                            const className = `rounded-full px-3.5 py-2 font-medium transition ${isActive
                                ? 'bg-stone-900 text-white dark:bg-amber-700 dark:text-white'
                                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                            }`;

                            const destination = l.href.startsWith('/')
                                ? l.href
                                : currentPath === '/'
                                    ? l.href
                                    : `/${l.href}`;

                            return destination.startsWith('/') && currentPath !== '/' ? (
                                <Link key={l.label} href={destination} className={className}>
                                    {l.label}
                                </Link>
                            ) : (
                                <a key={l.label} href={destination} className={className}>
                                    {l.label}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Theme Switcher, Auth Buttons & Mobile Menu Toggle */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        {/* Theme Switcher (Desktop) */}
                        <ThemeSwitcher className="hidden sm:inline-flex" />

                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-700 dark:hover:bg-stone-800"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-full bg-amber-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-950 active:scale-[0.99] dark:bg-amber-700 dark:hover:bg-amber-600"
                            >
                                Masuk
                            </Link>
                        )}

                        <button
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 lg:hidden"
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
                                    ? 'border-amber-900 bg-amber-900 text-white dark:border-amber-600 dark:bg-amber-700'
                                    : 'border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {open && (
                <div className="border-t border-stone-200 bg-white px-4 py-4 shadow-lg lg:hidden dark:border-stone-800 dark:bg-stone-900">
                    <div className="mb-3 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 dark:border-stone-800 dark:bg-stone-800">
                        <Search className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" />
                        <input
                            type="text"
                            placeholder="Cari kafe atau spot WFH..."
                            className="w-full border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-500"
                        />
                    </div>

                    <div className="space-y-1">
                        {links.map((l) => {
                            const isActive = l.href.startsWith('/')
                                ? currentPath === l.href
                                : currentPath === '/' && activeHash === l.href;
                            const className = `block rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive
                                ? 'bg-amber-50 text-amber-950 font-semibold dark:bg-amber-950/60 dark:text-amber-300'
                                : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                            }`;

                            const destination = l.href.startsWith('/')
                                ? l.href
                                : currentPath === '/'
                                    ? l.href
                                    : `/${l.href}`;

                            return destination.startsWith('/') && currentPath !== '/' ? (
                                <Link key={l.label} href={destination} onClick={() => setOpen(false)} className={className}>
                                    {l.label}
                                </Link>
                            ) : (
                                <a key={l.label} href={destination} onClick={() => setOpen(false)} className={className}>
                                    {l.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* Mobile Theme Switcher */}
                    <div className="mt-4 border-t border-stone-200 pt-3 dark:border-stone-800">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                            Pilihan Tema
                        </p>
                        <ThemeSwitcher variant="mobile" />
                    </div>
                </div>
            )}
        </header>
    );
}