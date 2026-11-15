import { useEffect, useState } from 'react';
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    Coffee,
    Eye,
    EyeOff,
    Home,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    Store,
    UserRound,
} from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import ThemeSwitcher from '@/Components/ThemeSwitcher';

const roleTabs = [
    {
        id: 'visitor',
        label: 'Penikmat Kopi',
        subtitle: 'Pelanggan Baru',
        icon: Coffee,
    },
    {
        id: 'owner',
        label: 'Pemilik Kafe',
        subtitle: 'Kemitraan Merchant',
        icon: Store,
    },
];

const visitorBenefits = [
    'Eksplorasi 55+ kafe artisanal terkurasi di Batam',
    'Reservasi meja instan & kumpulkan stamp loyalitas digital',
    'Dapatkan diskon promo eksklusif di kafe mitra',
    'Bagikan catatan rasa seduhan & bergabung di komunitas penikmat kopi',
];

const ownerBenefits = [
    'Daftarkan profil gerai & tayangkan menu spesial Anda',
    'Akses dashboard Business Intelligence & analitik penjualan',
    'Sistem Point of Sales (POS) terintegrasi kasir & barista',
    'Tingkatkan kunjungan pelanggan lewat promosi gerai terverifikasi',
];

export default function Register() {
    const initialRole = (() => {
        if (typeof window === 'undefined') {
            return 'visitor';
        }
        const queryRole = new URLSearchParams(window.location.search).get('role');
        return queryRole === 'owner' ? 'owner' : 'visitor';
    })();

    const [activeRole, setActiveRole] = useState(initialRole);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: initialRole,
    });

    useEffect(() => {
        const queryRole = new URLSearchParams(window.location.search).get('role');
        if (queryRole === 'owner' || queryRole === 'visitor') {
            setActiveRole(queryRole);
            setData('role', queryRole);
        }
    }, []);

    const selectRole = (role) => {
        setActiveRole(role);
        setData('role', role);
        clearErrors();

        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('role', role);
            window.history.replaceState({}, '', url);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const isOwner = activeRole === 'owner';

    return (
        <div
            className="auth-page flex min-h-screen flex-col bg-[#F8F9FC] text-[#231F2B] antialiased transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100"
            style={{
                fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <Head title="Daftar Akun Baru — CafeFinder" />

            {/* ── Top Header matching Login (Edge-to-Edge Full Width) ── */}
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
                                Portal Pendaftaran
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
                            Sudah punya akun? <strong className="text-[#8D4B00] dark:text-amber-400">Masuk</strong>
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
                    aria-label="Pilih peran pendaftaran"
                    className="grid w-full gap-2 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-xs dark:border-stone-800 dark:bg-stone-900 sm:grid-cols-2"
                >
                    {roleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeRole === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => selectRole(tab.id)}
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
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`block text-[11px] ${
                                            isActive
                                                ? 'text-amber-800 dark:text-amber-300'
                                                : 'text-stone-500 dark:text-stone-400'
                                        }`}
                                    >
                                        {tab.subtitle}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 2-Column Split: Context & Registration Form (Responsive Full Width) */}
                <div className="mt-6 grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                    
                    {/* Left Column: Register Context & Hero Showcase */}
                    <div className="order-2 lg:order-1">
                        <aside className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
                            <div className="relative h-48 overflow-hidden bg-[#56311F]">
                                <img
                                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
                                    alt="Suasana kedai kopi artisanal"
                                    className="h-full w-full object-cover opacity-80 transition duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2A170D]/95 via-[#2A170D]/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                                       
                                        {isOwner ? 'Kemitraan Pemilik Kafe' : 'Ekosistem Penikmat Kopi'}
                                    </span>
                                    <h2 className="mt-2 text-[22px] font-bold leading-tight tracking-[-0.03em] text-white">
                                        {isOwner
                                            ? 'Jadikan kafe Anda destinasi favorit pelanggan.'
                                            : 'Daftar sekali, nikmati serunya petualangan kopi.'}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-[12px] leading-6 text-stone-600 dark:text-stone-300">
                                    {isOwner
                                        ? 'Daftarkan bisnis kafe Anda di CafeFinder untuk menjangkau ribuan penikmat kopi, mengelola operasional digital, POS terminal, hingga Business Intelligence dalam satu akun terpusat.'
                                        : 'Buat akun penikmat kopi untuk menyimpan spot nongkrong & WFC terbaik di Batam, memesan meja instan, serta mengumpulkan stamp dan voucher reward eksklusif.'}
                                </p>

                                <ul className="mt-5 space-y-3">
                                    {(isOwner ? ownerBenefits : visitorBenefits).map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="flex items-start gap-2.5 text-[11.5px] leading-5 text-stone-700 dark:text-stone-300"
                                        >
                                            <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400">
                                                <Check aria-hidden="true" className="h-3 w-3 stroke-[2.5]" />
                                            </span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-stone-200/80 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-800/50">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            Sudah Memiliki Akun?
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-stone-700 dark:text-stone-300">
                                            Masuk langsung ke portal akun yang sudah terdaftar.
                                        </p>
                                    </div>
                                    <Link
                                        href={route('login', { role: activeRole })}
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-[11px] font-bold text-[#8D4B00] shadow-xs transition hover:bg-amber-50 hover:border-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:border-stone-700 dark:bg-stone-800 dark:text-amber-400 dark:hover:bg-stone-700"
                                    >
                                        Masuk Portal
                                        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Right Column: Registration Form */}
                    <section
                        role="tabpanel"
                        className="order-1 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8 lg:order-2 dark:border-stone-800 dark:bg-stone-900"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8D4B00] dark:text-amber-400">
                                    {isOwner ? 'Kemitraan Merchant' : 'Registrasi Pengguna'}
                                </p>
                                <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.04em] text-stone-900 dark:text-stone-100">
                                    {isOwner ? 'Daftarkan Kafe Anda' : 'Buat Akun Penikmat Kopi'}
                                </h1>
                                <p className="mt-2 text-[12px] leading-6 text-stone-600 dark:text-stone-400">
                                    {isOwner
                                        ? 'Lengkapi data pemilik untuk membuka akses Merchant Portal dan terminal operasional gerai.'
                                        : 'Lengkapi data diri Anda untuk memulai eksplorasi dan menikmati kemudahan ngopi.'}
                                </p>
                            </div>
                            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-[#8D4B00] ring-1 ring-amber-200/70 dark:bg-stone-800 dark:text-amber-400 dark:ring-stone-700">
                                {isOwner ? (
                                    <Store aria-hidden="true" className="h-5 w-5" />
                                ) : (
                                    <Coffee aria-hidden="true" className="h-5 w-5" />
                                )}
                            </span>
                        </div>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            {/* Input: Nama */}
                            <label className="block">
                                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                    {isOwner ? 'Nama Pemilik / Penanggung Jawab Kafe' : 'Nama Lengkap'}
                                </span>
                                <span className="mt-1.5 flex h-11 items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3.5 transition focus-within:border-[#8D4B00] focus-within:ring-2 focus-within:ring-[#8D4B00]/20 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20">
                                    <UserRound
                                        aria-hidden="true"
                                        className="h-4.5 w-4.5 shrink-0 text-stone-400 dark:text-stone-500"
                                    />
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoComplete="name"
                                        autoFocus
                                        required
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12.5px] text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-600"
                                        placeholder={isOwner ? 'Contoh: Dimas Pratama (Owner)' : 'Nama lengkap Anda'}
                                    />
                                </span>
                                {errors.name && (
                                    <span className="mt-1.5 block text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                        {errors.name}
                                    </span>
                                )}
                            </label>

                            {/* Input: Email */}
                            <label className="block">
                                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                    {isOwner ? 'Email Bisnis Kafe' : 'Alamat Email'}
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
                                        onChange={(e) => setData('email', e.target.value)}
                                        autoComplete="username"
                                        required
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12.5px] text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-600"
                                        placeholder={isOwner ? 'nama@kafeanda.id' : 'nama@email.com'}
                                    />
                                </span>
                                {errors.email && (
                                    <span className="mt-1.5 block text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                        {errors.email}
                                    </span>
                                )}
                            </label>

                            {/* Input: Password */}
                            <label className="block">
                                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                    Kata Sandi
                                </span>
                                <span className="mt-1.5 flex h-11 items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3.5 transition focus-within:border-[#8D4B00] focus-within:ring-2 focus-within:ring-[#8D4B00]/20 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20">
                                    <LockKeyhole
                                        aria-hidden="true"
                                        className="h-4.5 w-4.5 shrink-0 text-stone-400 dark:text-stone-500"
                                    />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12.5px] text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-600"
                                        placeholder="Minimal 8 karakter"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-stone-500 dark:hover:text-stone-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff aria-hidden="true" className="h-4 w-4" />
                                        ) : (
                                            <Eye aria-hidden="true" className="h-4 w-4" />
                                        )}
                                    </button>
                                </span>
                                {errors.password && (
                                    <span className="mt-1.5 block text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                        {errors.password}
                                    </span>
                                )}
                            </label>

                            {/* Input: Password Confirmation */}
                            <label className="block">
                                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                    Konfirmasi Kata Sandi
                                </span>
                                <span className="mt-1.5 flex h-11 items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3.5 transition focus-within:border-[#8D4B00] focus-within:ring-2 focus-within:ring-[#8D4B00]/20 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20">
                                    <LockKeyhole
                                        aria-hidden="true"
                                        className="h-4.5 w-4.5 shrink-0 text-stone-400 dark:text-stone-500"
                                    />
                                    <input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12.5px] text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-600"
                                        placeholder="Ulangi kata sandi Anda"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPasswordConfirmation ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                                        onClick={() => setShowPasswordConfirmation((v) => !v)}
                                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-stone-500 dark:hover:text-stone-200"
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeOff aria-hidden="true" className="h-4 w-4" />
                                        ) : (
                                            <Eye aria-hidden="true" className="h-4 w-4" />
                                        )}
                                    </button>
                                </span>
                                {errors.password_confirmation && (
                                    <span className="mt-1.5 block text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                        {errors.password_confirmation}
                                    </span>
                                )}
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-4 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
                            >
                                {isOwner ? 'Daftar sebagai Pemilik Kafe' : 'Daftar Akun Penikmat Kopi'}
                                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Footer Switch to Login */}
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-4 text-[11px] dark:border-stone-800">
                            <span className="text-stone-500 dark:text-stone-400">
                                Sudah memiliki akun CafeFinder sebelumnya?
                            </span>
                            <Link
                                href={route('login', { role: activeRole })}
                                className="font-bold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-amber-400 dark:hover:text-amber-300"
                            >
                                Masuk ke Portal
                            </Link>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-stone-400 dark:text-stone-500">
                            <span>Data pendaftaran tersimpan aman</span>
                            <span>Privasi terjamin</span>
                        </div>
                    </section>
                </div>

                {/* Footer security badge matching Login */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80 pt-4 text-[10.5px] text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Sesi pendaftaran diamankan dengan enkripsi 256-bit TLS
                    </span>
                    <span>
                        © {new Date().getFullYear()} CafeFinder Inc. · Platform kafe artisanal Indonesia
                    </span>
                </div>
            </main>
        </div>
    );
}
