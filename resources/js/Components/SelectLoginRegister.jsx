import React from 'react';
import { Link } from '@inertiajs/react';

export default function SelectLoginRegister() {
    const isLogin = route().current('login');
    const isRegister = route().current('register');

    return (
        <div className="mb-6 w-full border-b border-[#EAE4DC]">
            <div className="flex w-full">
                {/* Tab Masuk */}
                <Link
                    href={route('login')}
                    className={`relative flex-1 pb-3 text-center text-sm font-semibold transition-colors ${
                        isLogin
                            ? 'text-[#70481B]'
                            : 'text-[#70481B]/60 hover:text-[#70481B]'
                    }`}
                >
                    Masuk
                    {isLogin && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#70481B]" />
                    )}
                </Link>

                {/* Tab Daftar */}
                <Link
                    href={route('register')}
                    className={`relative flex-1 pb-3 text-center text-sm font-semibold transition-colors ${
                        isRegister
                            ? 'text-[#70481B]'
                            : 'text-[#70481B]/60 hover:text-[#70481B]'
                    }`}
                >
                    Daftar
                    {isRegister && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#70481B]" />
                    )}
                </Link>
            </div>
        </div>
    );
}