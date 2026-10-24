import { Link } from '@inertiajs/react';

export default function SelectLoginRegister() {
    const isLogin = route().current('login');
    const isRegister = route().current('register');

    return (
        <div className="mb-6 w-full border-b border-stone-200">
            <div className="flex w-full">
                {/* Tab Masuk */}
                <Link
                    href={route('login')}
                    className={`relative flex-1 pb-3 text-center text-sm font-semibold transition-colors ${
                        isLogin
                            ? 'text-amber-900 font-bold'
                            : 'text-stone-500 hover:text-stone-900'
                    }`}
                >
                    Masuk
                    {isLogin && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-amber-900" />
                    )}
                </Link>

                {/* Tab Daftar */}
                <Link
                    href={route('register')}
                    className={`relative flex-1 pb-3 text-center text-sm font-semibold transition-colors ${
                        isRegister
                            ? 'text-amber-900 font-bold'
                            : 'text-stone-500 hover:text-stone-900'
                    }`}
                >
                    Daftar
                    {isRegister && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-amber-900" />
                    )}
                </Link>
            </div>
        </div>
    );
}
