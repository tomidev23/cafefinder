import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Konfirmasi Keamanan">
            <Head title="Konfirmasi Kata Sandi" />

            <div className="mb-5">
                <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                    Konfirmasi Kata Sandi
                </h1>
                <p className="mt-1.5 text-xs leading-5 text-stone-600 dark:text-stone-400">
                    Ini adalah area aplikasi yang aman. Harap konfirmasi kata sandi akun Anda sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full text-xs"
                        isFocused={true}
                        placeholder="Masukkan kata sandi akun Anda"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="mt-6 flex items-center justify-end border-t border-stone-200/80 pt-4 dark:border-stone-800">
                    <PrimaryButton className="w-full sm:w-auto" disabled={processing}>
                        Konfirmasi Kata Sandi
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
