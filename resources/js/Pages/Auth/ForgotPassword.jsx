import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Coffee,
    Home,
    KeyRound,
    Mail,
    ShieldAlert,
    ShieldCheck,
    Store,
    UserRound,
} from 'lucide-react';
import InputError from '@/Components/InputError';
import ThemeSwitcher from '@/Components/ThemeSwitcher';

const roles = [
    {
        id: 'visitor',
        label: 'Penikmat Kopi',
        description: 'Pemulihan Akun Pelanggan',
        icon: Coffee,
    },
    {
        id: 'owner',
        label: 'Pemilik Kafe',
        description: 'Merchant & Mitra Bisnis',
        icon: Store,
    },
];

const securityTips = [
    'Tautan reset kata sandi bersifat rahasia dan berlaku selama 60 menit.',
    'Periksa folder Spam atau Promosi jika email belum masuk dalam 2 menit.',
    'Kata sandi baru minimal terdiri dari 8 karakter kombinasi huruf dan angka.',
    'Hubungi tim bantuan jika Anda tidak lagi memiliki akses ke alamat email terdaftar.',
];

export default function ForgotPassword({ status }) {
    const initialRole =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('role') === 'owner'
            ? 'owner'
            : 'visitor';
    const [activeRole, setActiveRole] = useState(initialRole);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const selectRole = (role) => {
        setActiveRole(role);
        const url = new URL(window.location.href);
        url.searchParams.set('role', role);
        router.get(url.pathname + url.search, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('password.email'));
    };

    const isOwner = activeRole === 'owner';

    return (
        <div
            className="auth-page flex min-h-screen flex-col bg-[#F8F9FC] text-[#231F2B] antialiased transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100"
            style={{
                fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <Head title="Lupa Kata Sandi — CafeFinder" />

            {/* ── Top Header matching Login & Register (Edge-to-Edge Full Width) ── */}
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
                                Portal Keamanan
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <ThemeSwitcher />
                        <div className="hidden h-5 w-px bg-stone-200 dark:bg-stone-800 sm:block" />

                        <Link
                            href={route('login', { role: activeRole })}
                            className="hidden items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11.5px] font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100 sm:inline-flex"
                        >
                            Ingat sandi? <strong className="text-[#8D4B00] dark:text-amber-400">Masuk</strong>
                        </Link>

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

            {/* ── Main Content Container (Edge-to-Edge Full Width) ── */}
            <main className="w-full flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-10 xl:px-12">
                
                {/* Role Switcher Tabs */}
                <div
                    role="tablist"
                    aria-label="Pilih peran pemulihan akun"
                    className="grid w-full gap-2 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-xs dark:border-stone-800 dark:bg-stone-900 sm:grid-cols-2"
                >
                    {roles.map((role) => {
                        const Icon = role.icon;
                        const isActive = activeRole === role.id;

                        return (
                            <button
                                key={role.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => selectRole(role.id)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    isActive
                                        ? 'border border-amber-400/80 bg-amber-50/80 text-amber-950 shadow-xs ring-1 ring-amber-300/60 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-500/30'
                                        : 'border border-stone-200/60 bg-stone-50/60 text-stone-700 hover:border-stone-300 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-300 dark:hover:bg-stone-800'
                                }`}
                            >
                                <span
                                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-amber-600 text-white shadow-xs dark:bg-amber-500'
                                            : 'bg-stone-200/70 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
                                    }`}
                                >
                                    <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-[13px] font-bold">
                                        {role.label}
                                    </span>
                                    <span
                                        className={`block text-[11px] ${
                                            isActive
                                                ? 'text-amber-800 dark:text-amber-300'
                                                : 'text-stone-500 dark:text-stone-400'
                                        }`}
                                    >
                                        {role.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 2-Column Split: Context & Form (Responsive Full Width) */}
                <div className="mt-6 grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                    
                    {/* Left Column: Security Context Aside */}
                    <aside className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
                        <div className="relative h-44 overflow-hidden bg-[#56311F]">
                            <img
                                src="/images/cafe-placeholder.svg"
                                alt="Keamanan akun CafeFinder"
                                className="h-full w-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2A170D]/95 via-[#2A170D]/40 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                                    <ShieldAlert aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
                                    Verifikasi & Keamanan Identitas
                                </span>
                                <h2 className="mt-2 text-[20px] font-bold leading-tight tracking-[-0.03em] text-white">
                                    Pemulihan akses akun Anda
                                </h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-[12px] leading-6 text-stone-600 dark:text-stone-300">
                                {isOwner
                                    ? 'Sebagai pengelola gerai kafe, kami menjaga data merchant dan transaksi Anda tetap terlindungi dengan protokol autentikasi berlapis.'
                                    : 'Sebagai penikmat kopi, saldo poin dan riwayat reservasi Anda akan tetap aman setelah kata sandi berhasil diperbarui.'}
                            </p>

                            <div className="mt-5 space-y-3">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                    Petunjuk Pemulihan
                                </p>
                                <ul className="space-y-2.5">
                                    {securityTips.map((tip, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-2.5 text-[11.5px] leading-5 text-stone-700 dark:text-stone-300"
                                        >
                                            <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
                                                <Check aria-hidden="true" className="h-3 w-3 stroke-[2.5]" />
                                            </span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Reset Password Form */}
                    <section
                        role="tabpanel"
                        className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-stone-800 dark:bg-stone-900"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8D4B00] dark:text-amber-400">
                                    Pemulihan Akun
                                </p>
                                <h1 className="mt-1.5 text-[26px] font-bold tracking-[-0.04em] text-stone-900 dark:text-stone-100">
                                    Lupa kata sandi?
                                </h1>
                                <p className="mt-2 text-[12px] leading-6 text-stone-600 dark:text-stone-400">
                                    Masukkan email akunmu. Kami akan mengirimkan tautan aman untuk membuat kata sandi baru.
                                </p>
                            </div>
                            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-[#8D4B00] ring-1 ring-amber-200/70 dark:bg-stone-800 dark:text-amber-400 dark:ring-stone-700">
                                <KeyRound aria-hidden="true" className="h-5 w-5" />
                            </span>
                        </div>

                        {status && (
                            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <label className="block">
                                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                    {isOwner ? 'Email Bisnis Kafe Terdaftar' : 'Alamat Email Terdaftar'}
                                </span>
                                <span className="mt-1.5 flex h-11 items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3.5 transition focus-within:border-[#8D4B00] focus-within:ring-2 focus-within:ring-[#8D4B00]/20 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20">
                                    <Mail
                                        aria-hidden="true"
                                        className="h-4.5 w-4.5 shrink-0 text-stone-400 dark:text-stone-500"
                                    />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="email"
                                        placeholder={isOwner ? 'owner@kafeanda.id' : 'nama@email.com'}
                                        autoFocus
                                        onChange={(event) => setData('email', event.target.value)}
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12.5px] text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-600"
                                    />
                                </span>
                                <InputError message={errors.email} className="mt-1.5" />
                            </label>

                            <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-stone-200/80 pt-5 sm:flex-row sm:items-center dark:border-stone-800">
                                <Link
                                    href={route('login', { role: activeRole })}
                                    className="text-center text-[12px] font-bold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-amber-400 dark:hover:text-amber-300 sm:text-left"
                                >
                                    Kembali ke halaman masuk
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-6 text-[12px] font-semibold text-white shadow-xs transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim tautan reset'}
                                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                {/* Footer security badge matching Login & Register */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80 pt-4 text-[10.5px] text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Sesi pemulihan akun diamankan dengan enkripsi 256-bit TLS
                    </span>
                    <span>
                        © {new Date().getFullYear()} CafeFinder Inc. · Platform kafe artisanal Indonesia
                    </span>
                </div>
            </main>
        </div>
    );
}
