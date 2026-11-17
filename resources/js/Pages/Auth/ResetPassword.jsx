import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout title="Atur Ulang Kata Sandi">
            <Head title="Atur Ulang Kata Sandi" />

            <div className="mb-5">
                <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                    Atur Ulang Kata Sandi
                </h1>
                <p className="mt-1.5 text-xs leading-5 text-stone-600 dark:text-stone-400">
                    Masukkan kata sandi baru untuk mengamankan akun CafeFinder Anda.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full text-xs"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full text-xs"
                        autoComplete="new-password"
                        isFocused={true}
                        placeholder="Minimal 8 karakter"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi Baru"
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1.5 block w-full text-xs"
                        autoComplete="new-password"
                        placeholder="Ulangi kata sandi baru Anda"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end border-t border-stone-200/80 pt-4 dark:border-stone-800">
                    <PrimaryButton className="w-full sm:w-auto" disabled={processing}>
                        Simpan Kata Sandi Baru
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
