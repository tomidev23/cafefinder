import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Coffee, Home, ShieldCheck, Store } from 'lucide-react';
import ThemeSwitcher from '@/Components/ThemeSwitcher';

export default function GuestLayout({
    children,
    role = 'visitor',
    onRoleChange,
    showRoleToggle = false,
    title = 'Portal Akun',
    subtitle = 'Layanan Autentikasi CafeFinder',
}) {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialRole = urlParams?.get('role') || role;

    const [selectedRole, setSelectedRole] = useState(initialRole);

    const handleRoleSelect = (newRole) => {
        setSelectedRole(newRole);

        if (typeof window !== 'undefined') {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('role', newRole);
            router.get(currentUrl.pathname + currentUrl.search, {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }

        if (onRoleChange) {
            onRoleChange(newRole);
        }
    };

    return (
        <div
            className="guest-layout flex min-h-screen flex-col bg-[#F8F9FC] text-[#231F2B] antialiased transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100"
            style={{
                fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            {/* ── Top Header matching Login, Register & ForgotPassword (Edge-to-Edge) ── */}
            <header className="w-full border-b border-stone-200/80 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-10 xl:px-12 dark:border-stone-800 dark:bg-stone-900/95">
                <div className="flex w-full items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        <img
                            src="/img/logo/logoamber.svg"
                            alt="CafeFinder"
                            className="h-9 w-9"
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-[20px] font-bold tracking-[-0.035em] text-[#56311F] dark:text-amber-300">
                                CafeFinder
                            </span>
                            <span className="hidden rounded-full border border-amber-200/70 bg-amber-50/80 px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-[#8D4B00] dark:border-stone-700 dark:bg-stone-800 dark:text-amber-400 sm:inline">
                                {title}
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <ThemeSwitcher />
                        <div className="hidden h-5 w-px bg-stone-200 dark:bg-stone-800 sm:block" />

                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-white px-3 py-1.5 text-[11.5px] font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-stone-100"
                        >
                            <Home aria-hidden="true" className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Kembali ke Beranda</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Main Content Area (Full Width Centered Card) ── */}
            <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-xl">
                    {/* Role Switcher (optional) */}
                    {showRoleToggle && (
                        <div
                            role="tablist"
                            aria-label="Pilih peran"
                            className="mb-5 grid w-full grid-cols-2 gap-2 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-xs dark:border-stone-800 dark:bg-stone-900"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={selectedRole === 'visitor'}
                                onClick={() => handleRoleSelect('visitor')}
                                className={`flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    selectedRole === 'visitor'
                                        ? 'border border-amber-400/80 bg-amber-50/80 text-amber-950 shadow-xs ring-1 ring-amber-300/60 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-200'
                                        : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
                                }`}
                            >
                                <Coffee className="h-4 w-4" />
                                <span>Penikmat Kopi</span>
                            </button>

                            <button
                                type="button"
                                role="tab"
                                aria-selected={selectedRole === 'owner'}
                                onClick={() => handleRoleSelect('owner')}
                                className={`flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    selectedRole === 'owner'
                                        ? 'border border-amber-400/80 bg-amber-50/80 text-amber-950 shadow-xs ring-1 ring-amber-300/60 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-200'
                                        : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
                                }`}
                            >
                                <Store className="h-4 w-4" />
                                <span>Pemilik Kafe</span>
                            </button>
                        </div>
                    )}

                    {/* Card Container */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-stone-800 dark:bg-stone-900">
                        {children}
                    </div>
                </div>

                {/* Footer Security Badge */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center text-[10.5px] text-stone-500 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Sesi terlindungi dengan standar enkripsi 256-bit TLS
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span>
                        © {new Date().getFullYear()} CafeFinder Inc.
                    </span>
                </div>
            </main>
        </div>
    );
}
