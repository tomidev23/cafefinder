import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, router } from '@inertiajs/react';

export default function GuestLayout({ children, role, onRoleChange }) {
    // Ambil role dari URL query params jika ada (misal ?role=owner)
    const urlParams = new URLSearchParams(window.location.search);
    const initialRole = urlParams.get('role') || role || 'visitor';

    const [selectedRole, setSelectedRole] = useState(initialRole);

    const handleRoleSelect = (newRole) => {
        setSelectedRole(newRole);

        // Update query string di URL tanpa reload halaman penuh
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('role', newRole);
        router.get(currentUrl.pathname + currentUrl.search, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });

        if (onRoleChange) {
            onRoleChange(newRole);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-[#EAEFF5] pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md sm:pt-6">
                <h1 className="text-center text-3xl font-bold text-[#121C2A]">
                    Selamat Datang di CafeFinder
                </h1>
                <p className="mt-1 text-center text-base font-normal text-[#554336]">
                    Temukan dan Kelola Cafe Anda
                </p>
            </div>

            {/* Toggle Button Role */}
            <div className="mt-6 w-full px-4 sm:max-w-md sm:px-0">
                <div className="flex rounded-4xl bg-[#EFF4FF] p-2.5 shadow-inner">
                    <button
                        type="button"
                        onClick={() => handleRoleSelect('visitor')}
                        className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                            selectedRole === 'visitor'
                                ? 'bg-[#FFFFFF] text-[#8D4B00] shadow-sm'
                                : 'text-[#554336]/70 hover:text-[#8D4B00]'
                        }`}
                    >
                        <svg className="h-4 w-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z" />
                        </svg>
                        <span>Pengunjung<br className="sm:hidden" /> (Pelanggan)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRoleSelect('owner')}
                        className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                            selectedRole === 'owner'
                                ? 'bg-[#FFFFFF] text-[#8D4B00] shadow-sm'
                                : 'text-[#554336]/70 hover:text-[#8D4B00]'
                        }`}
                    >
                        <svg className="h-4 w-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H21m-4.5 0H12m-9 0h4.5m0 0v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H9m-6 0h18M3 9l1.106-4.423A2.25 2.25 0 016.31 3h11.38a2.25 2.25 0 012.203 1.577L21 9M3 9v1.5a2.25 2.25 0 002.25 2.25 2.25 2.25 0 002.25-2.25V9M3 9h18M13.5 9v1.5a2.25 2.25 0 002.25 2.25A2.25 2.25 0 0018 10.5V9" />
                        </svg>
                        <span>Pemilik Kafe</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}