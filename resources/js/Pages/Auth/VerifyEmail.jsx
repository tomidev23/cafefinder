import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout title="Verifikasi Email">
            <Head title="Verifikasi Alamat Email" />

            <div className="mb-5">
                <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                    Verifikasi Alamat Email
                </h1>
                <p className="mt-2 text-xs leading-5 text-stone-600 dark:text-stone-400">
                    Terima kasih telah mendaftar di CafeFinder! Sebelum mulai mengeksplorasi, silakan verifikasi alamat email Anda melalui tautan yang baru saja kami kirimkan.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Tautan verifikasi baru telah berhasil dikirim ke alamat email yang Anda daftarkan.
                </div>
            )}

            <form onSubmit={submit} className="mt-4">
                <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-stone-200/80 pt-4 sm:flex-row sm:items-center dark:border-stone-800">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-center text-xs font-semibold text-stone-500 hover:text-stone-800 focus:outline-none focus:underline dark:text-stone-400 dark:hover:text-stone-200 sm:text-left"
                    >
                        Keluar (Log Out)
                    </Link>

                    <PrimaryButton disabled={processing} className="w-full sm:w-auto">
                        {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
