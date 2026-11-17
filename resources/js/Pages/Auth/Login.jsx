import { useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    Coffee,
    Delete,
    Eye,
    EyeOff,
    Home,
    LockKeyhole,
    Monitor,
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
        subtitle: 'Pelanggan',
        icon: Coffee,
    },
    {
        id: 'owner',
        label: 'Pemilik Kafe',
        subtitle: 'Merchant Portal',
        icon: Store,
    },
    {
        id: 'cashier',
        label: 'Staf Kasir',
        subtitle: 'POS Terminal',
        icon: Monitor,
    },
];

const visitorBenefits = [
    'Eksplorasi 168+ kafe artisanal terkurasi',
    'Reservasi meja & stamp loyalitas digital',
    'Diskon QRIS hingga 10% di gerai terpilih',
    'Akses komunitas seduh & ulasan terverifikasi',
];

const ownerBenefits = [
    'Kelola menu, resep seduh, dan HPP otomatis',
    'Pantau performa gerai lewat Business Intelligence',
    'Atur denah meja QRIS & perangkat kasir',
    'Kelola staf kasir, shift, dan akses POS',
];

const cashierFallback = [];

const initialsFor = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

export default function Login({
    status,
    canResetPassword,
    store,
    cashiers = cashierFallback,
}) {
    const initialRole = (() => {
        if (typeof window === 'undefined') {
            return 'visitor';
        }

        const queryRole = new URLSearchParams(window.location.search).get(
            'role',
        );

        return ['visitor', 'owner', 'cashier'].includes(queryRole)
            ? queryRole
            : 'visitor';
    })();

    const [activeRole, setActiveRole] = useState(initialRole);
    const [showPassword, setShowPassword] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [connectionModalOpen, setConnectionModalOpen] = useState(false);
    const staffInput = useRef(null);
    const cashierFormRef = useRef(null);

    const activeStore = store ?? {
        code: '',
        name: 'Terminal CafeFinder',
        branch: '',
        address: '',
        terminal: 'POS Terminal',
        shift: '',
        image: '/images/cafe-placeholder.svg',
    };

    const savedStoreCode =
        typeof window === 'undefined'
            ? ''
            : window.localStorage.getItem('cafefinder.pos.store_code') ?? '';
    const [rememberStore, setRememberStore] = useState(Boolean(savedStoreCode));

    const emailForm = useForm({
        email: '',
        password: '',
        remember: false,
        role: activeRole === 'owner' ? 'owner' : 'visitor',
    });

    const cashierForm = useForm({
        store_code: savedStoreCode,
        staff: '',
        pin: '',
    });

    const selectRole = (role) => {
        setActiveRole(role);

        if (role !== 'cashier') {
            emailForm.setData(
                'role',
                role === 'owner' ? 'owner' : 'visitor',
            );
            emailForm.clearErrors();
        } else {
            cashierForm.clearErrors();
        }

        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('role', role);
            window.history.replaceState({}, '', url);
        }
    };

    const submitEmail = (event) => {
        event.preventDefault();
        emailForm.post(route('login'), {
            onFinish: () => emailForm.reset('password'),
        });
    };

    const submitCashier = (event) => {
        event.preventDefault();

        if (rememberStore) {
            window.localStorage.setItem(
                'cafefinder.pos.store_code',
                cashierForm.data.store_code.trim().toUpperCase(),
            );
        } else {
            window.localStorage.removeItem('cafefinder.pos.store_code');
        }

        cashierForm.post(route('login.cashier'));
    };

    const resetStore = () => {
        cashierForm.setData('store_code', '');
        window.localStorage.removeItem('cafefinder.pos.store_code');
        setRememberStore(false);
    };

    const selectStaff = (cashier) => {
        cashierForm.setData('staff', cashier.staff_code);
        cashierForm.clearErrors();
        staffInput.current?.focus();
    };

    const appendDigit = (digit) => {
        if (cashierForm.data.pin.length >= 6) {
            return;
        }

        cashierForm.setData('pin', `${cashierForm.data.pin}${digit}`);
        cashierForm.clearErrors('pin');
    };

    const removeDigit = () => {
        cashierForm.setData('pin', cashierForm.data.pin.slice(0, -1));
        cashierForm.clearErrors('pin');
    };

    const clearPin = () => {
        cashierForm.setData('pin', '');
        cashierForm.clearErrors('pin');
    };

    useEffect(() => {
        if (activeRole !== 'cashier') {
            return undefined;
        }

        const handleCashierKeyDown = (event) => {
            if (event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }

            const target = event.target;
            const isTextInput =
                target instanceof HTMLInputElement &&
                ['text', 'email', 'password'].includes(target.type);

            if (/^[0-9]$/.test(event.key) && !isTextInput) {
                event.preventDefault();
                appendDigit(event.key);
                return;
            }

            if (event.key === 'Backspace' && !isTextInput) {
                event.preventDefault();
                removeDigit();
                return;
            }

            if (event.key === 'Enter' && cashierReady && !cashierForm.processing) {
                event.preventDefault();
                cashierFormRef.current?.requestSubmit();
            }
        };

        window.addEventListener('keydown', handleCashierKeyDown);

        return () => window.removeEventListener('keydown', handleCashierKeyDown);
    });

    const pinLength = cashierForm.data.pin.length;
    const cashierReady =
        pinLength === 6 &&
        cashierForm.data.staff.trim().length > 0 &&
        cashierForm.data.store_code.trim().length > 0;

    return (
        <div
            className="auth-page flex min-h-screen flex-col bg-[#F8F9FC] text-[#231F2B] antialiased transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100"
            style={{
                fontFamily:
                    "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <Head title="Masuk ke CafeFinder" />

            <header className="w-full border-b border-stone-200/80 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-10 xl:px-12 dark:border-stone-800 dark:bg-stone-900/95">
                <div className="flex w-full items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]">
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
                                Portal Masuk
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

            <main className="w-full flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-10 xl:px-12">
                <div
                    role="tablist"
                    aria-label="Pilih peran masuk"
                    className="grid w-full gap-2 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-xs dark:border-stone-800 dark:bg-stone-900 sm:grid-cols-3"
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
                                        ? 'border border-amber-300/80 bg-amber-50/80 text-amber-950 shadow-xs dark:border-amber-700/80 dark:bg-amber-950/50 dark:text-amber-200 ring-1 ring-amber-400/40'
                                        : 'border border-transparent text-stone-600 hover:border-stone-200 hover:bg-stone-50 dark:text-stone-400 dark:hover:border-stone-800 dark:hover:bg-stone-800/60 dark:hover:text-stone-200'
                                }`}
                            >
                                <span
                                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                                        isActive
                                            ? 'bg-amber-700 text-white shadow-xs dark:bg-amber-600'
                                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
                                    }`}
                                >
                                    <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[13px] font-bold">
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`block text-[10.5px] font-medium ${
                                            isActive
                                                ? 'text-amber-800 dark:text-amber-400'
                                                : 'text-stone-400 dark:text-stone-500'
                                        }`}
                                    >
                                        {tab.subtitle}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)]">
                    <div className="order-2 lg:order-1">
                        {activeRole === 'cashier' ? (
                            <CashierContext
                                store={activeStore}
                                rememberStore={rememberStore}
                                onRememberStoreChange={setRememberStore}
                                onResetStore={resetStore}
                                onOpenConnection={() => setConnectionModalOpen(true)}
                            />
                        ) : (
                            <AccountContext
                                role={activeRole}
                                store={activeStore}
                            />
                        )}
                    </div>

                    <section
                        role="tabpanel"
                        className="order-1 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:order-2"
                    >
                        {status && (
                            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                {status}
                            </div>
                        )}

                        {activeRole === 'cashier' ? (
                            <CashierForm
                                store={activeStore}
                                cashiers={cashiers}
                                form={cashierForm}
                                showPin={showPin}
                                setShowPin={setShowPin}
                                onSelectStaff={selectStaff}
                                onAppendDigit={appendDigit}
                                onRemoveDigit={removeDigit}
                                onClearPin={clearPin}
                                onSubmit={submitCashier}
                                cashierReady={cashierReady}
                                staffInput={staffInput}
                                formRef={cashierFormRef}
                                onOpenConnection={() => setConnectionModalOpen(true)}
                            />
                        ) : (
                            <EmailForm
                                role={activeRole}
                                form={emailForm}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                onSubmit={submitEmail}
                                canResetPassword={canResetPassword}
                                onChangeRole={selectRole}
                            />
                        )}
                    </section>
                </div>
            </main>

            {connectionModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="connection-modal-title"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setConnectionModalOpen(false);
                        }
                    }}
                >
                    <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-[#FDFBF7] p-5 shadow-xl dark:border-stone-700 dark:bg-stone-900">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A5B25] dark:text-amber-400">
                                    Diagnostik Ringkas
                                </p>
                                <h2
                                    id="connection-modal-title"
                                    className="mt-1 text-[15px] font-bold text-stone-900 dark:text-stone-100"
                                >
                                    Koneksi Perangkat POS
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setConnectionModalOpen(false)}
                                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                            >
                                Tutup
                            </button>
                        </div>
                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-[10.5px] text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <span className="font-bold">Sistem POS Online</span>
                            <span className="mt-1 block text-emerald-700/80 dark:text-emerald-400/80">
                                Jaringan tersedia. Perangkat tambahan dapat
                                dikonfigurasi setelah login dari dashboard gerai.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <footer className="w-full border-t border-stone-200/80 bg-white/70 px-4 py-4 text-[11px] text-stone-500 backdrop-blur-sm sm:px-6 lg:px-10 xl:px-12 dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-400">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                        Sesi login terlindungi dengan enkripsi TLS 1.3 &amp; proteksi sesi 256-bit
                    </span>
                    <span className="text-stone-400 dark:text-stone-500">
                        © {new Date().getFullYear()} CafeFinder Inc. Platform Kafe Artisanal Indonesia
                    </span>
                </div>
            </footer>
        </div>
    );
}

function AccountContext({ role, store }) {
    const isOwner = role === 'owner';
    const benefits = isOwner ? ownerBenefits : visitorBenefits;

    return (
        <aside className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <div className="relative h-44 overflow-hidden bg-[#56311F]">
                <img
                    src={store.image}
                    alt="Suasana kafe Artisan Roastery"
                    className="h-full w-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#2A170D]/90 via-[#2A170D]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur">
                        {isOwner
                            ? 'Merchant Portal & POS'
                            : 'Artisanal Coffee Intelligence'}
                    </span>
                    <h2 className="mt-2 text-[22px] font-bold leading-tight tracking-[-0.03em] text-white">
                        {isOwner
                            ? 'Satu dashboard untuk seluruh gerai.'
                            : 'Kopi yang tepat, tanpa riset panjang.'}
                    </h2>
                </div>
            </div>

            <div className="p-6 sm:p-7">
                <p className="text-[12px] leading-relaxed text-stone-600 dark:text-stone-300">
                    {isOwner
                        ? 'Kelola katalog menu, analitik pendapatan, meja QRIS, hingga otorisasi tim kasir dalam satu portal terpadu.'
                        : 'CafeFinder menghubungkan penikmat kopi dengan kafe lokal yang tepat — lengkap dengan profil rasa, kecepatan WiFi, dan akses QRIS.'}
                </p>

                <ul className="mt-5 space-y-3">
                    {benefits.map((benefit) => (
                        <li
                            key={benefit}
                            className="flex items-start gap-2.5 text-[11.5px] leading-snug text-stone-700 dark:text-stone-300"
                        >
                            <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <Check
                                    aria-hidden="true"
                                    className="h-3 w-3"
                                />
                            </span>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-800/50">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                            {isOwner ? 'Siap bergabung?' : 'Baru di CafeFinder?'}
                        </p>
                        <p className="mt-0.5 text-[11px] text-stone-600 dark:text-stone-300">
                            {isOwner
                                ? 'Daftarkan kafe dan mulai kelola operasional digital.'
                                : 'Buat akun untuk menyimpan kafe favorit dan stamp reward.'}
                        </p>
                    </div>
                    <Link
                        href={route('register', {
                            role: isOwner ? 'owner' : 'visitor',
                        })}
                        className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] font-semibold text-[#8D4B00] shadow-xs transition hover:bg-amber-50 hover:border-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:border-stone-700 dark:bg-stone-800 dark:text-amber-400 dark:hover:bg-stone-700"
                    >
                        {isOwner ? 'Daftarkan Kafe' : 'Daftar Akun'}
                        <ArrowUpRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                    </Link>
                </div>
            </div>
        </aside>
    );
}

function CashierContext({
    rememberStore,
    onRememberStoreChange,
    onResetStore,
    onOpenConnection,
}) {
    return (
        <aside className="space-y-4">
            <section className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-start gap-3.5">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#56311F] text-white">
                        <Store aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Login Multi-Gerai
                        </span>
                        <h2 className="mt-1 text-[16px] font-bold tracking-tight text-stone-900 dark:text-stone-100">
                            Terminal Kasir Multi-Gerai
                        </h2>
                        <p className="mt-1 text-[10px] leading-relaxed text-stone-500 dark:text-stone-400">
                            Kelola pesanan masuk, sinkronkan shift, dan buka transaksi
                            langsung dari terminal kafe.
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-950/60">
                    <label className="flex cursor-pointer items-start gap-2.5">
                        <input
                            type="checkbox"
                            checked={rememberStore}
                            onChange={(event) => onRememberStoreChange(event.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#9A5B25] focus:ring-[#9A5B25]"
                        />
                        <span className="text-[10.5px] leading-4 text-stone-700 dark:text-stone-300">
                            Ingat Perangkat Gerai Ini
                            <span className="block text-[9.5px] text-stone-500 dark:text-stone-500">
                                Kode gerai otomatis terisi pada shift berikutnya.
                            </span>
                        </span>
                    </label>
                    <button
                        type="button"
                        onClick={onResetStore}
                        className="mt-2 rounded text-[9.5px] font-semibold text-[#9A5B25] hover:text-[#56311F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A5B25]"
                    >
                        Ganti Gerai
                    </button>
                </div>
            </section>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/60 p-3.5 text-[10px] leading-relaxed text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400"
                />
                <p>
                    Kredensial kasir dibuat dan dikelola langsung oleh Pemilik
                    Kafe melalui menu Kelola Staf Kasir &amp; POS. Dilarang
                    membagikan PIN kasir pribadi kepada pihak yang tidak
                    berkepentingan.
                </p>
            </div>
        </aside>
    );
}

function EmailForm({
    role,
    form,
    showPassword,
    setShowPassword,
    onSubmit,
    canResetPassword,
    onChangeRole,
}) {
    const isOwner = role === 'owner';

    return (
        <>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8D4B00] dark:text-amber-400">
                        {isOwner ? 'Portal Pemilik Kafe' : 'Akun Penikmat Kopi'}
                    </p>
                    <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-tight text-stone-900 dark:text-stone-100">
                        {isOwner
                            ? 'Masuk ke Merchant Portal'
                            : 'Masuk sebagai Penikmat Kopi'}
                    </h1>
                    <p className="mt-1.5 max-w-xl text-[12px] leading-relaxed text-stone-500 dark:text-stone-400">
                        {isOwner
                            ? 'Gunakan email bisnis kafe untuk mengelola menu, analitik, meja QRIS, dan otorisasi kasir.'
                            : 'Masuk untuk menyimpan kafe favorit, reservasi meja, dan mengumpulkan stamp reward digital.'}
                    </p>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 shadow-xs dark:bg-stone-800 dark:text-amber-400">
                    {isOwner ? (
                        <Store aria-hidden="true" className="h-5 w-5" />
                    ) : (
                        <Coffee aria-hidden="true" className="h-5 w-5" />
                    )}
                </span>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <label className="block">
                    <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        {isOwner ? 'Email Bisnis Kafe' : 'Alamat Email'}
                    </span>
                    <span className="mt-1.5 flex h-12 items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 transition focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-700/15 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20">
                        <UserRound
                            aria-hidden="true"
                            className="h-4.5 w-4.5 shrink-0 text-stone-400 dark:text-stone-500"
                        />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            autoComplete="username"
                            autoFocus
                            className="h-full w-full border-0 bg-transparent p-0 text-[13px] text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-500"
                            placeholder={
                                isOwner
                                    ? 'owner@artisanroastery.id'
                                    : 'nama@email.com'
                            }
                        />
                    </span>
                    {form.errors.email && (
                        <span className="mt-1.5 block text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            {form.errors.email}
                        </span>
                    )}
                </label>

                <label className="block">
                    <span className="flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        <span>Kata Sandi</span>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="font-semibold text-[#8D4B00] transition hover:text-[#56311F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-amber-400 dark:hover:text-amber-300"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </span>
                    <span className="mt-1.5 flex h-12 items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 transition focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-700/15 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20">
                        <LockKeyhole
                            aria-hidden="true"
                            className="h-4.5 w-4.5 shrink-0 text-stone-400 dark:text-stone-500"
                        />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={form.data.password}
                            onChange={(event) =>
                                form.setData('password', event.target.value)
                            }
                            autoComplete="current-password"
                            className="h-full w-full border-0 bg-transparent p-0 text-[13px] text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-500"
                            placeholder="Masukkan kata sandi akun"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword
                                    ? 'Sembunyikan kata sandi'
                                    : 'Tampilkan kata sandi'
                            }
                            onClick={() => setShowPassword((value) => !value)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-stone-500 dark:hover:text-stone-200"
                        >
                            {showPassword ? (
                                <EyeOff
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                            ) : (
                                <Eye
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                            )}
                        </button>
                    </span>
                    {form.errors.password && (
                        <span className="mt-1.5 block text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            {form.errors.password}
                        </span>
                    )}
                </label>

                <label className="flex cursor-pointer items-center gap-2.5 text-[11.5px] text-stone-600 dark:text-stone-400">
                    <input
                        type="checkbox"
                        checked={form.data.remember}
                        onChange={(event) =>
                            form.setData('remember', event.target.checked)
                        }
                        className="h-4 w-4 rounded border-stone-300 text-[#8D4B00] focus:ring-[#8D4B00] dark:border-stone-700 dark:bg-stone-900"
                    />
                    <span>Ingat saya di perangkat ini</span>
                </label>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#56311F] px-4 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#432516] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-700 dark:hover:bg-amber-600"
                >
                    {isOwner
                        ? 'Masuk ke Merchant Portal'
                        : 'Masuk sebagai Pengunjung'}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-4 text-[11px] dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400">
                    {isOwner
                        ? 'Belum terdaftar sebagai mitra CafeFinder?'
                        : 'Belum punya akun CafeFinder?'}
                </span>
                <Link
                    href={route('register', {
                        role: isOwner ? 'owner' : 'visitor',
                    })}
                    className="font-bold text-[#8D4B00] transition hover:text-[#56311F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-amber-400 dark:hover:text-amber-300"
                >
                    {isOwner ? 'Daftarkan Kafe Anda' : 'Daftar Akun Baru'}
                </Link>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={() => onChangeRole('cashier')}
                    className="inline-flex items-center gap-1.5 rounded text-[10.5px] font-semibold text-stone-600 transition hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-stone-400 dark:hover:text-amber-400"
                >
                    <Monitor aria-hidden="true" className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                    Staf kasir? Masuk ke Terminal Kasir POS
                </button>
                <span className="text-[10px] text-stone-400 dark:text-stone-500">
                    Sesi Terenkripsi
                </span>
            </div>
        </>
    );
}

function CashierForm({
    store,
    cashiers,
    form,
    showPin,
    setShowPin,
    onSelectStaff,
    onAppendDigit,
    onRemoveDigit,
    onClearPin,
    onSubmit,
    cashierReady,
    staffInput,
    formRef,
    onOpenConnection,
}) {
    const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'back'];
    const pin = form.data.pin;

    return (
        <>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8D4B00] dark:text-amber-400">
                        Otorisasi Shift Kasir
                    </p>
                    <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-tight text-stone-900 dark:text-stone-100">
                        Masuk Terminal Kasir
                    </h1>
                    <p className="mt-1.5 max-w-xl text-[12px] leading-relaxed text-stone-500 dark:text-stone-400">
                        Masukkan kode gerai, ID kasir atau email kasir, dan PIN
                        6-digit untuk membuka terminal POS milik gerai Anda.
                    </p>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 shadow-xs dark:bg-stone-800 dark:text-amber-400">
                    <Monitor aria-hidden="true" className="h-5 w-5" />
                </span>
            </div>

            <form ref={formRef} onSubmit={onSubmit} className="mt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                        <span className="text-[10.5px] font-semibold text-stone-700 dark:text-stone-300">
                            Kode Gerai Kafe
                        </span>
                        <span className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-700/15 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500">
                            <Store
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500"
                            />
                            <input
                                value={form.data.store_code}
                                onChange={(event) =>
                                    form.setData(
                                        'store_code',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="Contoh: CF-X7K2LM"
                                className="h-full w-full border-0 bg-transparent p-0 text-[12px] font-bold text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-500"
                            />
                        </span>
                        {form.errors.store_code && (
                            <span className="mt-1 block text-[10.5px] font-medium text-rose-600 dark:text-rose-400">
                                {form.errors.store_code}
                            </span>
                        )}
                    </label>

                    <label className="block">
                        <span className="text-[10.5px] font-semibold text-stone-700 dark:text-stone-300">
                            ID Staf / Kode Kasir
                        </span>
                        <span className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/50 px-3 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-700/15 dark:border-stone-700 dark:bg-stone-950 dark:focus-within:border-amber-500">
                            <UserRound
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500"
                            />
                            <input
                                ref={staffInput}
                                value={form.data.staff}
                                onChange={(event) =>
                                    form.setData('staff', event.target.value)
                                }
                                placeholder="CSR-001 atau email kasir"
                                className="h-full w-full border-0 bg-transparent p-0 text-[12px] font-bold text-stone-900 placeholder:font-normal placeholder:text-stone-400 focus:ring-0 dark:text-stone-100 dark:placeholder:text-stone-500"
                            />
                        </span>
                        {form.errors.staff && (
                            <span className="mt-1 block text-[10.5px] font-medium text-rose-600 dark:text-rose-400">
                                {form.errors.staff}
                            </span>
                        )}
                    </label>
                </div>

                <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4 sm:p-5 dark:border-stone-800 dark:bg-stone-950">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100">
                            PIN Keamanan Kasir (6-Digit)
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowPin((value) => !value)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold text-stone-600 hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-stone-400 dark:hover:text-amber-400"
                        >
                            {showPin ? (
                                <EyeOff
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                />
                            ) : (
                                <Eye
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                />
                            )}
                            {showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                        </button>
                    </div>

                    <div
                        className="mt-3.5 flex justify-center gap-2.5"
                        role="status"
                        aria-live="polite"
                        aria-label={`${pin.length} dari 6 digit PIN terisi`}
                    >
                        {Array.from({ length: 6 }, (_, index) => (
                            <span
                                key={index}
                                className={`flex h-8 w-8 items-center justify-center rounded-xl text-[12px] font-bold transition-all ${
                                    index < pin.length
                                        ? 'bg-[#56311F] text-white shadow-xs dark:bg-amber-600'
                                        : 'border border-stone-200 bg-white text-stone-400 dark:border-stone-800 dark:bg-stone-900'
                                }`}
                            >
                                {index < pin.length
                                    ? showPin
                                        ? pin[index]
                                        : '•'
                                    : ''}
                            </span>
                        ))}
                    </div>
                    <p className="mt-2 text-center text-[9.5px] text-stone-500 dark:text-stone-400">
                        {pin.length === 0
                            ? 'Masukkan 6 digit PIN kasir Anda'
                            : pin.length < 6
                              ? `Tersisa ${6 - pin.length} digit PIN lagi`
                              : 'PIN lengkap. Silakan buka terminal kasir.'}
                    </p>
                    {form.errors.pin && (
                        <p className="mt-1.5 text-center text-[10.5px] font-medium text-rose-600 dark:text-rose-400">
                            {form.errors.pin}
                        </p>
                    )}

                    <div className="mx-auto mt-4 grid max-w-[320px] grid-cols-3 gap-2">
                        {keypad.map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => {
                                    if (key === 'C') {
                                        onClearPin();
                                    } else if (key === 'back') {
                                        onRemoveDigit();
                                    } else {
                                        onAppendDigit(key);
                                    }
                                }}
                                aria-label={
                                    key === 'C'
                                        ? 'Hapus seluruh PIN'
                                        : key === 'back'
                                          ? 'Hapus digit terakhir'
                                          : `Angka ${key}`
                                }
                                className={`inline-flex h-11 items-center justify-center rounded-xl border text-[15px] font-bold shadow-xs transition duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    key === 'C'
                                        ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300'
                                        : key === 'back'
                                          ? 'border-stone-200 bg-stone-100 text-stone-600 hover:bg-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
                                          : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800'
                                }`}
                            >
                                {key === 'back' ? (
                                    <Delete
                                        aria-hidden="true"
                                        className="h-4.5 w-4.5"
                                    />
                                ) : (
                                    key
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!cashierReady || form.processing}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-4 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#733D00] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-700 dark:hover:bg-amber-600"
                >
                    <Monitor aria-hidden="true" className="h-4.5 w-4.5" />
                    Buka Terminal POS &amp; Mulai Shift
                    <ArrowRight aria-hidden="true" className="h-4.5 w-4.5" />
                </button>

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200/80 px-3 py-2 text-[9.5px] text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Sistem POS Online
                    </span>
                    <button
                        type="button"
                        onClick={onOpenConnection}
                        className="rounded font-semibold text-stone-600 hover:text-[#9A5B25] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A5B25] dark:text-stone-400 dark:hover:text-amber-400"
                    >
                        Cek Koneksi Perangkat
                    </button>
                </div>
            </form>
        </>
    );
}
