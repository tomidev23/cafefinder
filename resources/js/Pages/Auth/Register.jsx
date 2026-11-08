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
            className="min-h-screen bg-[#F3F5FB] text-[#231F2B] antialiased"
            style={{
                fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <Head title="Daftar Akun Baru" />

            {/* ── Top Header matching Login ── */}
            <header className="border-b border-[#ECECF3] bg-white">
                <div className="mx-auto flex h-16 w-full max-w-310 items-center justify-between gap-4 px-4 sm:px-6">
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
                            Portal Pendaftaran
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('login', { role: activeRole })}
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-[#6F6A78] transition hover:bg-[#F5F6FB] hover:text-[#231F2B]"
                        >
                            Sudah punya akun? <strong className="text-[#8D4B00]">Masuk</strong>
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-[#6F6A78] transition hover:bg-[#F5F6FB] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            <Home aria-hidden="true" className="h-3.5 w-3.5" />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Main Content Container ── */}
            <main className="mx-auto w-full max-w-310 px-4 pb-10 pt-6 sm:px-6">
                
                {/* Role Switcher Tabs */}
                <div
                    role="tablist"
                    aria-label="Pilih peran pendaftaran"
                    className="grid gap-1.5 rounded-2xl border border-[#ECECF3] bg-white p-1.5 shadow-sm shadow-[#20263A]/3 sm:grid-cols-2"
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
                                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
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
                                    <Icon aria-hidden="true" className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-[12px] font-semibold">
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`block text-[9.5px] ${
                                            isActive ? 'text-[#8D4B00]' : 'text-[#6F6A78]'
                                        }`}
                                    >
                                        {tab.subtitle}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 2-Column Split: Context & Registration Form */}
                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    
                    {/* Left Column: Register Context & Hero Showcase */}
                    <div className="order-2 lg:order-1">
                        <aside className="overflow-hidden rounded-2xl border border-[#ECECF3] bg-white shadow-sm shadow-[#20263A]/3">
                            <div className="relative h-40 overflow-hidden bg-[#56311F]">
                                <img
                                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=640&q=80"
                                    alt="Suasana kedai kopi artisanal"
                                    className="h-full w-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#2A170D]/90 via-[#2A170D]/30 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[8.5px] font-semibold text-white backdrop-blur">
                                        <Sparkles aria-hidden="true" className="h-3 w-3" />
                                        {isOwner ? 'Kemitraan Pemilik Kafe' : 'Ekosistem Penikmat Kopi'}
                                    </span>
                                    <h2 className="mt-2 text-[20px] font-bold leading-tight tracking-[-0.03em] text-white">
                                        {isOwner
                                            ? 'Jadikan kafe Anda destinasi favorit pelanggan.'
                                            : 'Daftar sekali, nikmati serunya petualangan kopi.'}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-[11px] leading-5 text-[#6F6A78]">
                                    {isOwner
                                        ? 'Daftarkan bisnis kafe Anda di CafeFinder untuk menjangkau ribuan penikmat kopi, mengelola operasional digital, POS terminal, hingga Business Intelligence dalam satu akun.'
                                        : 'Buat akun penikmat kopi untuk menyimpan spot nongkrong/WFC terbaik di Batam, memesan meja lebih cepat, serta mengumpulkan stamp dan voucher reward eksklusif.'}
                                </p>

                                <ul className="mt-4 space-y-2.5">
                                    {(isOwner ? ownerBenefits : visitorBenefits).map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="flex items-start gap-2 text-[10.5px] leading-4 text-[#4A4552]"
                                        >
                                            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E9FBF3] text-[#0D7A5F]">
                                                <Check aria-hidden="true" className="h-2.5 w-2.5" />
                                            </span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#F7F8FD] p-3.5 border border-[#ECECF3]">
                                    <div>
                                        <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#6F6A78]">
                                            Sudah Memiliki Akun?
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-[#55515E]">
                                            Masuk langsung ke portal akun yang sudah terdaftar.
                                        </p>
                                    </div>
                                    <Link
                                        href={route('login', { role: activeRole })}
                                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#E2E5EF] bg-white px-3 py-2 text-[10px] font-semibold text-[#8D4B00] shadow-sm transition hover:bg-[#FFF8F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                    >
                                        Masuk Portal
                                        <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Right Column: Registration Form */}
                    <section
                        role="tabpanel"
                        className="order-1 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3 sm:p-6 lg:order-2"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8D4B00]">
                                    {isOwner ? 'Kemitraan Merchant' : 'Registrasi Pengguna'}
                                </p>
                                <h1 className="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.04em] text-[#211D29]">
                                    {isOwner ? 'Daftarkan Kafe Anda' : 'Buat Akun Penikmat Kopi'}
                                </h1>
                                <p className="mt-1.5 max-w-102.5 text-[11px] leading-5 text-[#6F6A78]">
                                    {isOwner
                                        ? 'Lengkapi data pemilik untuk membuka akses Merchant Portal dan terminal operasional gerai.'
                                        : 'Lengkapi data diri Anda untuk memulai eksplorasi dan menikmati kemudahan ngopi.'}
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

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            {/* Input: Nama */}
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    {isOwner ? 'Nama Pemilik / Penanggung Jawab Kafe' : 'Nama Lengkap'}
                                </span>
                                <span className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-[#E2E5EF] bg-white px-3 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                                    <UserRound
                                        aria-hidden="true"
                                        className="h-4 w-4 shrink-0 text-[#8B8694]"
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
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12px] text-[#292632] placeholder:text-[#8B8694] focus:ring-0"
                                        placeholder={isOwner ? 'Contoh: Dimas Pratama (Owner)' : 'Nama lengkap Anda'}
                                    />
                                </span>
                                {errors.name && (
                                    <span className="mt-1 block text-[10px] font-medium text-[#B42318]">
                                        {errors.name}
                                    </span>
                                )}
                            </label>

                            {/* Input: Email */}
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    {isOwner ? 'Email Bisnis Kafe' : 'Alamat Email'}
                                </span>
                                <span className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-[#E2E5EF] bg-white px-3 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                                    <Mail
                                        aria-hidden="true"
                                        className="h-4 w-4 shrink-0 text-[#8B8694]"
                                    />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        autoComplete="username"
                                        required
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12px] text-[#292632] placeholder:text-[#8B8694] focus:ring-0"
                                        placeholder={isOwner ? 'nama@kafeanda.id' : 'nama@email.com'}
                                    />
                                </span>
                                {errors.email && (
                                    <span className="mt-1 block text-[10px] font-medium text-[#B42318]">
                                        {errors.email}
                                    </span>
                                )}
                            </label>

                            {/* Input: Password */}
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    Kata Sandi
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
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12px] text-[#292632] placeholder:text-[#8B8694] focus:ring-0"
                                        placeholder="Minimal 8 karakter"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#8B8694] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                    >
                                        {showPassword ? (
                                            <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
                                        ) : (
                                            <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </span>
                                {errors.password && (
                                    <span className="mt-1 block text-[10px] font-medium text-[#B42318]">
                                        {errors.password}
                                    </span>
                                )}
                            </label>

                            {/* Input: Password Confirmation */}
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    Konfirmasi Kata Sandi
                                </span>
                                <span className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-[#E2E5EF] bg-white px-3 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                                    <LockKeyhole
                                        aria-hidden="true"
                                        className="h-4 w-4 shrink-0 text-[#8B8694]"
                                    />
                                    <input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        className="h-full w-full border-0 bg-transparent p-0 text-[12px] text-[#292632] placeholder:text-[#8B8694] focus:ring-0"
                                        placeholder="Ulangi kata sandi Anda"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPasswordConfirmation ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                                        onClick={() => setShowPasswordConfirmation((v) => !v)}
                                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#8B8694] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
                                        ) : (
                                            <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </span>
                                {errors.password_confirmation && (
                                    <span className="mt-1 block text-[10px] font-medium text-[#B42318]">
                                        {errors.password_confirmation}
                                    </span>
                                )}
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isOwner ? 'Daftar sebagai Pemilik Kafe' : 'Daftar Akun Penikmat Kopi'}
                                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Footer Switch to Login */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-4 text-[10px]">
                            <span className="text-[#6F6A78]">
                                Sudah memiliki akun CafeFinder sebelumnya?
                            </span>
                            <Link
                                href={route('login', { role: activeRole })}
                                className="font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                Masuk ke Portal
                            </Link>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 text-[9px] text-[#8B8694]">
                            <span>Data pendaftaran tersimpan aman</span>
                            <span>Privasi terjamin</span>
                        </div>
                    </section>
                </div>

                {/* Footer security badge matching Login */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-[#6F6A78]">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-[#0D7A5F]" />
                        Sesi perangkat dienkripsi 256-bit TLS
                    </span>
                    <span>
                        © {new Date().getFullYear()} CafeFinder Inc. · Platform kafe artisanal Indonesia
                    </span>
                </div>
            </main>
        </div>
    );
}
