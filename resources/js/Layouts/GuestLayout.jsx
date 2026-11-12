import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, router } from '@inertiajs/react';

export default function GuestLayout({ children, role = 'visitor', onRoleChange, showRoleToggle = true }) {
    const urlParams = new URLSearchParams(window.location.search);
    const initialRole = urlParams.get('role') || role;

    const [selectedRole, setSelectedRole] = useState(initialRole);

    const handleRoleSelect = (newRole) => {
        setSelectedRole(newRole);

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
        <div className="guest-layout flex min-h-screen flex-col items-center bg-[#EAEFF5] pt-6 transition-colors duration-200 dark:bg-stone-950 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-stone-400" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md sm:pt-6">
                <h1 className="text-center text-3xl font-bold text-[#121C2A] dark:text-stone-100">
                    Selamat Datang di CafeFinder
                </h1>
                <p className="mt-1 text-center text-base font-normal text-[#554336] dark:text-stone-300">
                    Temukan dan Kelola Cafe Anda
                </p>
            </div>

            {/* Toggle Button Role (Hanya tampil jika showRoleToggle === true) */}
            {showRoleToggle && (
                <div className="mt-6 w-full px-4 sm:max-w-md sm:px-0">
                    <div className="flex rounded-4xl bg-[#EFF4FF] p-2.5 shadow-inner dark:bg-stone-900">
                        <button
                            type="button"
                            onClick={() => handleRoleSelect('visitor')}
                            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                                selectedRole === 'visitor'
                                    ? 'bg-[#FFFFFF] text-[#8D4B00] shadow-sm dark:bg-stone-800 dark:text-amber-400'
                                    : 'text-[#554336]/70 hover:text-[#8D4B00] dark:text-stone-400 dark:hover:text-amber-400'
                            }`}
                        >
                            <span>Pengunjung<br className="sm:hidden" /> (Pelanggan)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRoleSelect('owner')}
                            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                                selectedRole === 'owner'
                                    ? 'bg-[#FFFFFF] text-[#8D4B00] shadow-sm dark:bg-stone-800 dark:text-amber-400'
                                    : 'text-[#554336]/70 hover:text-[#8D4B00] dark:text-stone-400 dark:hover:text-amber-400'
                            }`}
                        >
                            <span>Pemilik Kafe</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full overflow-hidden bg-white px-6 py-4 shadow-md transition-colors duration-200 dark:bg-stone-900 sm:mt-4 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}