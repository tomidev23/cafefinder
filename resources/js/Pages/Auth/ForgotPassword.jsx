import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowRight, Home, KeyRound, UserRound } from 'lucide-react';
import InputError from '@/Components/InputError';

const roles = [
    { id: 'visitor', label: 'Pengunjung', description: 'Pelanggan' },
    { id: 'owner', label: 'Pemilik Kafe', description: 'Merchant Portal' },
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

    return (
        <div
            className="auth-page min-h-screen bg-[#F3F5FB] text-[#231F2B] antialiased transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100"
            style={{
                fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <Head title="Lupa Kata Sandi" />

            <header className="border-b border-[#ECECF3] bg-white dark:border-stone-800 dark:bg-stone-900">
                <div className="mx-auto flex h-16 w-full max-w-310 items-center justify-between gap-4 px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <img src="/img/logo/logoamber.svg" alt="" className="h-9 w-9" />
                        <span className="text-[20px] font-bold tracking-[-0.035em] text-[#56311F] dark:text-amber-300">
                            CafeFinder
                        </span>
                        <span className="hidden rounded-full bg-[#F3F5FB] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6F6A78] dark:bg-stone-800 dark:text-stone-300 sm:inline">
                            Portal Keamanan
                        </span>
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-[#6F6A78] transition hover:bg-[#F5F6FB] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                    >
                        <Home aria-hidden="true" className="h-3.5 w-3.5" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </header>

            <main className="mx-auto w-full max-w-2xl px-4 pb-10 pt-6 sm:px-6">
                <div
                    role="tablist"
                    aria-label="Pilih peran pemulihan akun"
                    className="grid gap-1.5 rounded-2xl border border-[#ECECF3] bg-white p-1.5 shadow-sm shadow-[#20263A]/3 dark:border-stone-800 dark:bg-stone-900 sm:grid-cols-2"
                >
                    {roles.map((role) => {
                        const isActive = activeRole === role.id;

                        return (
                            <button
                                key={role.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => selectRole(role.id)}
                                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    isActive
                                        ? 'bg-[#FFEADB] text-[#6F3A0E] dark:bg-amber-950/60 dark:text-amber-300'
                                        : 'text-[#55515E] hover:bg-[#F7F8FD] dark:text-stone-300 dark:hover:bg-stone-800'
                                }`}
                            >
                                <span
                                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                        isActive
                                            ? 'bg-white text-[#8D4B00] dark:bg-stone-800 dark:text-amber-400'
                                            : 'bg-[#F4F4F8] text-[#6F6A78] dark:bg-stone-800 dark:text-stone-400'
                                    }`}
                                >
                                    <UserRound aria-hidden="true" className="h-4 w-4" />
                                </span>
                                <span>
                                    <span className="block text-[12px] font-semibold">{role.label}</span>
                                    <span className="block text-[9.5px] text-[#6F6A78] dark:text-stone-400">
                                        {role.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <section className="mt-5 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3 dark:border-stone-800 dark:bg-stone-900 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8D4B00] dark:text-amber-400">
                                Pemulihan akun
                            </p>
                            <h1 className="mt-1.5 text-2xl font-bold tracking-[-0.04em] text-[#211D29] dark:text-stone-100">
                                Lupa kata sandi?
                            </h1>
                            <p className="mt-2 max-w-xl text-[12px] leading-5 text-[#6F6A78] dark:text-stone-300">
                                Masukkan email akunmu. Kami akan mengirimkan tautan
                                aman untuk membuat kata sandi baru.
                            </p>
                        </div>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF3FF] text-[#5D6B96] dark:bg-stone-800 dark:text-amber-300">
                            <KeyRound aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>

                    {status && (
                        <div className="mt-5 rounded-xl bg-[#E9FBF3] px-3 py-2.5 text-[11px] font-medium text-[#0D7A5F] dark:bg-emerald-950/50 dark:text-emerald-300">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-6">
                        <label
                            htmlFor="email"
                            className="block text-[11px] font-semibold text-[#45414D] dark:text-stone-200"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="email"
                            placeholder="nama@email.com"
                            autoFocus
                            onChange={(event) => setData('email', event.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-[#E2E5EF] bg-white px-3.5 text-[12px] text-[#292632] outline-none transition placeholder:text-[#9A96A3] focus:border-[#A88B70] focus:ring-2 focus:ring-[#8D4B00]/15 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500"
                        />
                        <InputError message={errors.email} className="mt-2" />

                        <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#F0EFF4] pt-5 sm:flex-row sm:items-center dark:border-stone-800">
                            <Link
                                href={route('login', { role: activeRole })}
                                className="text-center text-[11px] font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:text-amber-400 dark:hover:text-amber-300 sm:text-left"
                            >
                                Kembali ke halaman masuk
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-900"
                            >
                                {processing ? 'Mengirim...' : 'Kirim tautan reset'}
                                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
