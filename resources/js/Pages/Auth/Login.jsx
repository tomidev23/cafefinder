import { useState, useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GoogleSignInButton from '@/Components/GoogleSignInButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import SelectLoginRegister from '@/Components/SelectLoginRegister';

export default function Login({ status, canResetPassword, error }) {
    const [role, setRole] = useState('visitor');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentRole = urlParams.get('role') || 'visitor';
        setRole(currentRole);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role: 'visitor',
    });

    useEffect(() => {
        setData('role', role);
    }, [role]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout onRoleChange={(selectedRole) => setRole(selectedRole)}>
            <Head title="Login" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            {role === 'visitor' ? (
                <SelectLoginRegister />
            ) : (
                <div className="mb-6 border-b border-[#EAE4DC] pb-3 text-center">
                    <h2 className="font-jakarta text-lg font-bold text-[#8D4B00]">
                        Login Pemilik Kafe
                    </h2>
                </div>
            )}

            <form onSubmit={submit} className="mt-4">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-[#554336]" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block h-10 w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Kata Sandi" className="text-[#554336]" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block h-10 w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-[#8D4B00] focus:ring-[#8D4B00]"
                        />
                        <span className="text-sm font-medium text-[#554336]">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {canResetPassword ? (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-[#8D4B00] underline hover:text-[#703B00] focus:outline-none focus:ring-2 focus:ring-[#8D4B00] focus:ring-offset-2"
                        >
                            Lupa Kata Sandi?
                        </Link>
                    ) : (
                        <span />
                    )}

                    <PrimaryButton disabled={processing}>
                        Login
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#EAE4DC]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 font-medium text-[#554336]/70">
                            atau masuk dengan
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <GoogleSignInButton role={role} />
                </div>
            </div>
        </GuestLayout>
    );
}