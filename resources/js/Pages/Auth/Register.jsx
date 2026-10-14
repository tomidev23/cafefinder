import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SelectLoginRegister from '@/Components/SelectLoginRegister';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'visitor',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentRole = urlParams.get('role') || 'visitor';

        setData('role', currentRole);

        if (currentRole === 'owner') {
            router.get(route('login'), { role: 'owner' });
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        /* Matikan toggle role di halaman Register */
        <GuestLayout showRoleToggle={false}>
            <Head title="Daftar" />

            <SelectLoginRegister />

            <form onSubmit={submit} className="mt-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-[#554336]" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block h-10 w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" className="text-[#554336]" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block h-10 w-full"
                        autoComplete="username"
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi"
                        className="text-[#554336]"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block h-10 w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-[#8D4B00] underline hover:text-[#703B00] focus:outline-none focus:ring-2 focus:ring-[#8D4B00] focus:ring-offset-2"
                    >
                        Sudah punya akun?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Daftar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}