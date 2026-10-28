import { useRef, useState } from 'react';
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
    MapPin,
    Monitor,
    Printer,
    RefreshCw,
    ScanLine,
    ShieldCheck,
    Sparkles,
    Store,
    Sun,
    UserRound,
} from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';

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
    const [checkingHardware, setCheckingHardware] = useState(false);
    const [hardwareChecked, setHardwareChecked] = useState(false);
    const staffInput = useRef(null);

    const activeStore = store ?? {
        code: 'ART-88',
        name: 'Artisan Roastery',
        branch: 'Senopati Flagship',
        address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
        terminal: 'POS Terminal #1',
        shift: 'Shift Pagi (07.00 – 15.00 WIB)',
        image:
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=480&q=80',
    };

    const firstCashier = cashiers[0];
    const scheduledCashier = firstCashier
        ? `${firstCashier.name.split(' ')[0]} ${firstCashier.name.split(' ').slice(-1)[0]?.[0] ?? ''}.`
        : 'Belum ditentukan';

    const emailForm = useForm({
        email: '',
        password: '',
        remember: false,
        role: activeRole === 'owner' ? 'owner' : 'visitor',
    });

    const cashierForm = useForm({
        store_code: activeStore.code,
        staff: firstCashier?.staff_code ?? '',
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
        cashierForm.post(route('login.cashier'));
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

    const retestHardware = () => {
        setCheckingHardware(true);
        setHardwareChecked(false);

        window.setTimeout(() => {
            setCheckingHardware(false);
            setHardwareChecked(true);
        }, 900);
    };

    const pinLength = cashierForm.data.pin.length;
    const cashierReady =
        pinLength === 6 &&
        cashierForm.data.staff.trim().length > 0 &&
        cashierForm.data.store_code.trim().length > 0;

    return (
        <div
            className="min-h-screen bg-[#F3F5FB] text-[#231F2B] antialiased"
            style={{
                fontFamily:
                    "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <Head title="Masuk" />

            <header className="border-b border-[#ECECF3] bg-white">
                <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <img
                            src="/img/logo/logoamber.svg"
                            alt=""
                            className="h-9 w-9"
                        />
                        <span className="text-[20px] font-bold tracking-[-0.035em] text-[#56311F]">
                            CafeFinder
                        </span>
                        <span className="hidden rounded-full bg-[#F3F5FB] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6F6A78] sm:inline">
                            Portal Masuk
                        </span>
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-[#6F6A78] transition hover:bg-[#F5F6FB] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        <Home aria-hidden="true" className="h-3.5 w-3.5" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </header>

            <main className="mx-auto w-full max-w-[1240px] px-4 pb-10 pt-6 sm:px-6">
                <div
                    role="tablist"
                    aria-label="Pilih peran masuk"
                    className="grid gap-1.5 rounded-2xl border border-[#ECECF3] bg-white p-1.5 shadow-sm shadow-[#20263A]/3 sm:grid-cols-3"
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
                                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    isActive
                                        ? 'bg-[#FFEADB] text-[#6F3A0E]'
                                        : 'text-[#55515E] hover:bg-[#F7F8FD]'
                                }`}
                            >
                                <span
                                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                        isActive
                                            ? 'bg-white text-[#8D4B00]'
                                            : 'bg-[#F4F4F8] text-[#6F6A78]'
                                    }`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-[12px] font-semibold">
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`block text-[9.5px] ${
                                            isActive
                                                ? 'text-[#8D4B00]'
                                                : 'text-[#6F6A78]'
                                        }`}
                                    >
                                        {tab.subtitle}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    <div className="order-2 lg:order-1">
                        {activeRole === 'cashier' ? (
                            <CashierContext
                                store={activeStore}
                                scheduledCashier={scheduledCashier}
                                checkingHardware={checkingHardware}
                                hardwareChecked={hardwareChecked}
                                onRetest={retestHardware}
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
                        className="order-1 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3 sm:p-6 lg:order-2"
                    >
                        {status && (
                            <div className="mb-4 rounded-xl bg-[#E9FBF3] px-3 py-2 text-[11px] font-medium text-[#0D7A5F]">
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

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-[#6F6A78]">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#0D7A5F]"
                        />
                        Sesi perangkat dienkripsi 256-bit TLS
                    </span>
                    <span>
                        © {new Date().getFullYear()} CafeFinder Inc. · Platform
                        kafe artisanal Indonesia
                    </span>
                </div>
            </main>
        </div>
    );
}

function AccountContext({ role, store }) {
    const isOwner = role === 'owner';
    const benefits = isOwner ? ownerBenefits : visitorBenefits;

    return (
        <aside className="overflow-hidden rounded-2xl border border-[#ECECF3] bg-white shadow-sm shadow-[#20263A]/3">
            <div className="relative h-36 overflow-hidden bg-[#56311F]">
                <img
                    src={store.image}
                    alt="Suasana kafe Artisan Roastery"
                    className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#2A170D]/85 via-[#2A170D]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[8.5px] font-semibold text-white backdrop-blur">
                        <Sparkles
                            aria-hidden="true"
                            className="h-3 w-3"
                        />
                        {isOwner
                            ? 'Merchant Portal'
                            : 'Artisanal coffee intelligence'}
                    </span>
                    <h2 className="mt-2 text-[20px] font-bold leading-tight tracking-[-0.03em] text-white">
                        {isOwner
                            ? 'Satu dashboard untuk seluruh gerai.'
                            : 'Kopi yang tepat, tanpa riset panjang.'}
                    </h2>
                </div>
            </div>

            <div className="p-5">
                <p className="text-[11px] leading-5 text-[#6F6A78]">
                    {isOwner
                        ? 'Kelola menu, analitik, meja QRIS, dan tim kasir dari satu tempat. Keputusan gerai jadi lebih cepat dan terukur.'
                        : 'CafeFinder menghubungkan penikmat kopi dengan kafe lokal yang tepat — lengkap dengan suasana, menu, dan akses QRIS.'}
                </p>

                <ul className="mt-4 space-y-2.5">
                    {benefits.map((benefit) => (
                        <li
                            key={benefit}
                            className="flex items-start gap-2 text-[10.5px] leading-4 text-[#4A4552]"
                        >
                            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E9FBF3] text-[#0D7A5F]">
                                <Check
                                    aria-hidden="true"
                                    className="h-2.5 w-2.5"
                                />
                            </span>
                            {benefit}
                        </li>
                    ))}
                </ul>

                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#F7F8FD] px-3 py-3">
                    <div>
                        <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#6F6A78]">
                            {isOwner ? 'Siap bergabung?' : 'Baru di CafeFinder?'}
                        </p>
                        <p className="mt-1 text-[10px] text-[#55515E]">
                            {isOwner
                                ? 'Daftarkan kafe dan mulai kelola operasional digital.'
                                : 'Buat akun untuk menyimpan kafe favorit dan stamp.'}
                        </p>
                    </div>
                    <Link
                        href={route('register', {
                            role: isOwner ? 'owner' : 'visitor',
                        })}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#E2E5EF] bg-white px-2.5 py-2 text-[10px] font-semibold text-[#8D4B00] shadow-sm transition hover:bg-[#FFF8F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        {isOwner ? 'Daftarkan Kafe' : 'Daftar Akun'}
                        <ArrowUpRight
                            aria-hidden="true"
                            className="h-3 w-3"
                        />
                    </Link>
                </div>
            </div>
        </aside>
    );
}

function CashierContext({
    store,
    scheduledCashier,
    checkingHardware,
    hardwareChecked,
    onRetest,
}) {
    const devices = [
        {
            icon: Printer,
            title: 'Printer Thermal Struk',
            detail: 'Epson TM-T82III (LAN / 192.168.1.120)',
            status: checkingHardware ? 'Memeriksa...' : 'Siap & Online',
        },
        {
            icon: LockKeyhole,
            title: 'Laci Kas (Cash Drawer)',
            detail: 'Port RJ11 Terhubung ke Printer',
            status: checkingHardware ? 'Memeriksa...' : 'Terkunci Aman',
        },
        {
            icon: ScanLine,
            title: 'Scanner & EDC Pembayaran',
            detail: 'Terminal EDC QRIS & 2D Imager',
            status: checkingHardware ? 'Memeriksa...' : 'Terhubung',
        },
    ];

    return (
        <aside className="space-y-4">
            <section className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                <div className="flex items-start gap-3">
                    <img
                        src={store.image}
                        alt={`Suasana ${store.name}`}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md bg-[#F4F4F8] px-1.5 py-0.5 text-[8.5px] font-medium text-[#6F6A78]">
                                ID: {store.code}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#D6FBEB] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#0D7A5F]">
                                <span className="h-1 w-1 rounded-full bg-[#0D7A5F]" />
                                Gerai Buka
                            </span>
                        </div>
                        <h2 className="mt-1.5 text-[15px] font-bold tracking-[-0.02em] text-[#231F2B]">
                            {store.name}
                        </h2>
                        <p className="mt-0.5 flex items-start gap-1 text-[9px] leading-4 text-[#6F6A78]">
                            <MapPin
                                aria-hidden="true"
                                className="mt-0.5 h-3 w-3 shrink-0"
                            />
                            {store.address}
                        </p>
                    </div>
                </div>

                <div className="mt-3 flex flex-col gap-3 rounded-xl bg-[#F2F6FF] p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-2.5">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#B67932]">
                            <Sun aria-hidden="true" className="h-4 w-4" />
                        </span>
                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#6F6A78]">
                                Sesi Shift Terjadwal
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-[#3F3B47]">
                                {store.shift}
                            </p>
                        </div>
                    </div>
                    <span className="self-start rounded-full bg-white px-2.5 py-1 text-[8.5px] font-semibold text-[#5D6B96] sm:self-center">
                        Kasir Terjadwal {scheduledCashier} (Standby)
                    </span>
                </div>
            </section>

            <section className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="flex items-center gap-1.5 text-[12px] font-semibold text-[#231F2B]">
                        <Printer
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#8D4B00]"
                        />
                        Diagnostik Perangkat POS
                    </h2>
                    <button
                        type="button"
                        onClick={onRetest}
                        disabled={checkingHardware}
                        className="inline-flex items-center gap-1 rounded text-[9.5px] font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] disabled:opacity-50"
                    >
                        <RefreshCw
                            aria-hidden="true"
                            className={`h-3 w-3 ${
                                checkingHardware ? 'animate-spin' : ''
                            }`}
                        />
                        Uji Ulang
                    </button>
                </div>

                <div className="mt-3 space-y-2">
                    {devices.map((device) => {
                        const Icon = device.icon;

                        return (
                            <div
                                key={device.title}
                                className="flex items-center gap-2.5 rounded-xl bg-[#F4F7FF] p-2.5"
                            >
                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#5D6B96]">
                                    <Icon
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5"
                                    />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-semibold text-[#3F3B47]">
                                        {device.title}
                                    </p>
                                    <p className="mt-0.5 truncate text-[8.5px] text-[#6F6A78]">
                                        {device.detail}
                                    </p>
                                </div>
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#D6FBEB] px-1.5 py-0.5 text-[8px] font-semibold text-[#0D7A5F]">
                                    <span className="h-1 w-1 rounded-full bg-[#0D7A5F]" />
                                    {device.status}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {hardwareChecked && (
                    <p className="mt-2 text-[8.5px] text-[#0D7A5F]">
                        Semua perangkat merespons normal.
                    </p>
                )}
            </section>

            <div className="flex items-start gap-2 rounded-xl border border-[#E5E0D6] bg-[#FFF9F2] px-3 py-3 text-[9px] leading-4 text-[#6F543F]">
                <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B67932]"
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
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8D4B00]">
                        {isOwner ? 'Portal Pemilik Kafe' : 'Akun Pelanggan'}
                    </p>
                    <h1 className="mt-1.5 text-[25px] font-bold leading-tight tracking-[-0.04em] text-[#211D29]">
                        {isOwner
                            ? 'Masuk ke Merchant Portal'
                            : 'Masuk sebagai Penikmat Kopi'}
                    </h1>
                    <p className="mt-1.5 max-w-[410px] text-[11px] leading-5 text-[#6F6A78]">
                        {isOwner
                            ? 'Gunakan email bisnis kafe untuk mengelola menu, analitik, meja QRIS, dan tim kasir.'
                            : 'Masuk untuk menyimpan kafe favorit, reservasi meja, dan mengumpulkan stamp loyalitas digital.'}
                    </p>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#8D4B00]">
                    {isOwner ? (
                        <Store aria-hidden="true" className="h-4 w-4" />
                    ) : (
                        <Coffee aria-hidden="true" className="h-4 w-4" />
                    )}
                </span>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <label className="block">
                    <span className="text-[10.5px] font-semibold text-[#4A4552]">
                        {isOwner ? 'Email Bisnis Kafe' : 'Email'}
                    </span>
                    <span className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-[#E2E5EF] bg-white px-3 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                        <UserRound
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-[#8B8694]"
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
                            className="h-full w-full border-0 bg-transparent p-0 text-[12px] text-[#292632] placeholder:text-[#8B8694] focus:ring-0"
                            placeholder={
                                isOwner
                                    ? 'nama@kafeanda.id'
                                    : 'nama@email.com'
                            }
                        />
                    </span>
                    {form.errors.email && (
                        <span className="mt-1 block text-[10px] font-medium text-[#B42318]">
                            {form.errors.email}
                        </span>
                    )}
                </label>

                <label className="block">
                    <span className="flex items-center justify-between text-[10.5px] font-semibold text-[#4A4552]">
                        <span>Kata Sandi</span>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="font-medium text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </span>
                    <span className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-[#E2E5EF] bg-white px-3 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                        <LockKeyhole
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-[#8B8694]"
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
                            className="h-full w-full border-0 bg-transparent p-0 text-[12px] text-[#292632] placeholder:text-[#8B8694] focus:ring-0"
                            placeholder="Masukkan kata sandi"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword
                                    ? 'Sembunyikan kata sandi'
                                    : 'Tampilkan kata sandi'
                            }
                            onClick={() => setShowPassword((value) => !value)}
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#8B8694] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            {showPassword ? (
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
                        </button>
                    </span>
                    {form.errors.password && (
                        <span className="mt-1 block text-[10px] font-medium text-[#B42318]">
                            {form.errors.password}
                        </span>
                    )}
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-[10.5px] text-[#55515E]">
                    <input
                        type="checkbox"
                        checked={form.data.remember}
                        onChange={(event) =>
                            form.setData('remember', event.target.checked)
                        }
                        className="h-3.5 w-3.5 rounded border-[#CFCBD6] text-[#8D4B00] focus:ring-[#8D4B00]"
                    />
                    Ingat saya di perangkat ini
                </label>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isOwner
                        ? 'Masuk ke Merchant Portal'
                        : 'Masuk sebagai Pengunjung'}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-4 text-[10px]">
                <span className="text-[#6F6A78]">
                    {isOwner
                        ? 'Belum terdaftar sebagai mitra?'
                        : 'Belum punya akun CafeFinder?'}
                </span>
                <Link
                    href={route('register', {
                        role: isOwner ? 'owner' : 'visitor',
                    })}
                    className="font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                >
                    {isOwner ? 'Daftarkan Kafe Anda' : 'Daftar Akun Baru'}
                </Link>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={() => onChangeRole('cashier')}
                    className="inline-flex items-center gap-1.5 rounded text-[9.5px] font-medium text-[#6F6A78] hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                >
                    <Monitor aria-hidden="true" className="h-3.5 w-3.5" />
                    Staf kasir? Masuk ke Terminal POS
                </button>
                <span className="text-[9px] text-[#8B8694]">
                    Aman &amp; terenkripsi
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
}) {
    const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'back'];
    const pin = form.data.pin;

    return (
        <>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8D4B00]">
                        Otorisasi Shift Kasir
                    </p>
                    <h1 className="mt-1.5 text-[25px] font-bold leading-tight tracking-[-0.04em] text-[#211D29]">
                        Masuk Terminal Kasir
                    </h1>
                    <p className="mt-1.5 max-w-[410px] text-[11px] leading-5 text-[#6F6A78]">
                        Pilih profil kasir atau masukkan ID kasir &amp; PIN
                        6-digit untuk memulai transaksi shift.
                    </p>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF3FF] text-[#5D6B96]">
                    <Monitor aria-hidden="true" className="h-4 w-4" />
                </span>
            </div>

            <form onSubmit={onSubmit} className="mt-5">
                <div>
                    <span className="text-[10.5px] font-semibold text-[#4A4552]">
                        Pilih Staf Bertugas Saat Ini:
                    </span>
                    {cashiers.length > 0 ? (
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {cashiers.slice(0, 6).map((cashier) => {
                                const selected =
                                    form.data.staff === cashier.staff_code;

                                return (
                                    <button
                                        key={cashier.id}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => onSelectStaff(cashier)}
                                        className={`relative flex flex-col items-center rounded-xl border px-2 py-2.5 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                            selected
                                                ? 'border-[#B97A45] bg-[#FFF8F0] shadow-[0_0_0_1px_#D8B796]'
                                                : 'border-[#E6E4ED] bg-white hover:bg-[#FAFAFD]'
                                        }`}
                                    >
                                        {selected && (
                                            <span className="absolute right-2 top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#8D4B00] text-white">
                                                <Check
                                                    aria-hidden="true"
                                                    className="h-2.5 w-2.5"
                                                />
                                            </span>
                                        )}
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F6FF] text-[9px] font-bold text-[#5D6B96]">
                                            {initialsFor(cashier.name)}
                                        </span>
                                        <span className="mt-1.5 max-w-full truncate text-[9.5px] font-semibold text-[#3F3B47]">
                                            {cashier.name}
                                        </span>
                                        <span className="mt-0.5 text-[8px] text-[#6F6A78]">
                                            {cashier.staff_code} ·{' '}
                                            {cashier.shift
                                                ? cashier.shift
                                                      .replace('Pagi ', 'Pagi')
                                                      .split(' ')[0]
                                                : 'Kasir'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="mt-2 rounded-lg bg-[#FFF9F2] px-3 py-2 text-[9.5px] leading-4 text-[#6F543F]">
                            Belum ada staf kasir terdaftar untuk gerai ini. Minta
                            Pemilik Kafe menambahkannya di menu Kelola Staf
                            Kasir &amp; POS.
                        </p>
                    )}
                </div>

                <div className="mt-3 flex justify-end">
                    <button
                        type="button"
                        onClick={() => staffInput.current?.focus()}
                        className="inline-flex items-center gap-1 rounded text-[9px] font-semibold text-[#6F6A78] transition hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        <UserRound
                            aria-hidden="true"
                            className="h-3 w-3"
                        />
                        Gunakan ID Staff Lain
                    </button>
                </div>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    <label className="block">
                        <span className="text-[9.5px] font-semibold text-[#55515E]">
                            Kode Gerai Kafe
                        </span>
                        <span className="mt-1 flex h-10 items-center gap-2 rounded-lg border border-[#E2E5EF] bg-white px-3 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                            <Store
                                aria-hidden="true"
                                className="h-3.5 w-3.5 shrink-0 text-[#8B8694]"
                            />
                            <input
                                value={form.data.store_code}
                                onChange={(event) =>
                                    form.setData(
                                        'store_code',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="Contoh: ART-88"
                                className="h-full w-full border-0 bg-transparent p-0 text-[11px] font-semibold text-[#3F3B47] placeholder:text-[#8B8694] focus:ring-0"
                            />
                        </span>
                        <p className="mt-1 text-[8px] text-[#8B8694]">
                            Setiap kafe punya kode unik. Tanyakan ke Owner.
                        </p>
                        {form.errors.store_code && (
                            <span className="mt-1 block text-[9.5px] font-medium text-[#B42318]">
                                {form.errors.store_code}
                            </span>
                        )}
                    </label>

                    <label className="block">
                        <span className="text-[9.5px] font-semibold text-[#55515E]">
                            ID Staf / Kasir
                        </span>
                        <span className="mt-1 flex h-10 items-center gap-2 rounded-lg border border-[#E2E5EF] bg-[#F8F9FE] px-3 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                            <UserRound
                                aria-hidden="true"
                                className="h-3.5 w-3.5 shrink-0 text-[#8B8694]"
                            />
                            <input
                                ref={staffInput}
                                value={form.data.staff}
                                onChange={(event) =>
                                    form.setData('staff', event.target.value)
                                }
                                placeholder="CSR-001 atau email kasir"
                                className="h-full w-full border-0 bg-transparent p-0 text-[11px] font-semibold text-[#3F3B47] placeholder:font-normal placeholder:text-[#8B8694] focus:ring-0"
                            />
                        </span>
                        {form.errors.staff && (
                            <span className="mt-1 block text-[9.5px] font-medium text-[#B42318]">
                                {form.errors.staff}
                            </span>
                        )}
                    </label>
                </div>

                <div className="mt-3 rounded-xl bg-[#F2F6FF] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-[#3F3B47]">
                            PIN Kasir (6-Digit)
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowPin((value) => !value)}
                            className="inline-flex items-center gap-1 rounded text-[9px] font-medium text-[#6F6A78] hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            {showPin ? (
                                <EyeOff
                                    aria-hidden="true"
                                    className="h-3 w-3"
                                />
                            ) : (
                                <Eye
                                    aria-hidden="true"
                                    className="h-3 w-3"
                                />
                            )}
                            {showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                        </button>
                    </div>

                    <div
                        className="mt-3 flex justify-center gap-2"
                        role="status"
                        aria-live="polite"
                        aria-label={`${pin.length} dari 6 digit PIN terisi`}
                    >
                        {Array.from({ length: 6 }, (_, index) => (
                            <span
                                key={index}
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                    index < pin.length
                                        ? 'bg-[#B67932] text-white'
                                        : 'border border-[#D8D4DF] bg-white'
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
                    <p className="mt-2 text-center text-[8.5px] text-[#6F6A78]">
                        {pin.length === 0
                            ? 'Masukkan 6 digit PIN Anda'
                            : pin.length < 6
                              ? `Masukkan ${6 - pin.length} digit PIN lagi`
                              : 'PIN lengkap. Tekan tombol masuk di bawah.'}
                    </p>
                    {form.errors.pin && (
                        <p className="mt-1.5 text-center text-[9.5px] font-medium text-[#B42318]">
                            {form.errors.pin}
                        </p>
                    )}

                    <div className="mx-auto mt-3 grid max-w-[288px] grid-cols-3 gap-1.5">
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
                                        ? 'Hapus PIN'
                                        : key === 'back'
                                          ? 'Hapus digit terakhir'
                                          : `Angka ${key}`
                                }
                                className={`inline-flex h-10 items-center justify-center rounded-lg border text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    key === 'C'
                                        ? 'border-[#F3DAD7] bg-[#FFF4F2] text-[#B42318] hover:bg-[#FFE9E5]'
                                        : key === 'back'
                                          ? 'border-[#E2E5EF] bg-[#F8F9FE] text-[#6F6A78] hover:bg-[#F0F3FC]'
                                          : 'border-[#E2E5EF] bg-white text-[#3F3B47] hover:border-[#CFCBD8] hover:bg-[#FAFAFD]'
                                }`}
                            >
                                {key === 'back' ? (
                                    <Delete
                                        aria-hidden="true"
                                        className="h-4 w-4"
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
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Monitor aria-hidden="true" className="h-4 w-4" />
                    Buka Terminal POS &amp; Mulai Shift
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[8.5px] text-[#6F6A78]">
                    <span className="inline-flex items-center gap-1">
                        <LockKeyhole
                            aria-hidden="true"
                            className="h-3 w-3"
                        />
                        Lupa PIN Kasir? Minta Supervisor reset PIN di Owner
                        Dashboard
                    </span>
                    <a
                        href="mailto:support@cafefinder.id"
                        className="font-semibold text-[#6F6A78] hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        Bantuan Teknis Kasir
                    </a>
                </div>
            </form>
        </>
    );
}
