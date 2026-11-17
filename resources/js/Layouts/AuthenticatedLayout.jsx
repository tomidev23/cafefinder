import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeSwitcher from '@/Components/ThemeSwitcher';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900 transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100">
            <nav className="border-b border-stone-200 bg-white shadow-xs transition-colors duration-200 dark:border-stone-800 dark:bg-stone-900">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <ApplicationLogo className="block h-1 w-1 " />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-6 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-3">
                            <ThemeSwitcher />

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-medium leading-4 text-stone-700 transition duration-150 ease-in-out hover:bg-stone-100 hover:text-stone-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 dark:hover:text-white dark:focus-visible:ring-amber-500"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4 text-stone-500 dark:text-stone-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center gap-2 sm:hidden">
                            <ThemeSwitcher compact={true} />

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-stone-500 transition duration-150 ease-in-out hover:bg-stone-100 hover:text-stone-700 focus:bg-stone-100 focus:text-stone-700 focus:outline-none dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-stone-200 pb-3 pt-4 dark:border-stone-800">
                        <div className="px-4">
                            <div className="text-base font-medium text-stone-800 dark:text-stone-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>

                        <div className="mt-4 border-t border-stone-200 px-4 pt-3 dark:border-stone-800">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                Tema Tampilan
                            </p>
                            <ThemeSwitcher variant="mobile" />
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-stone-200 bg-white transition-colors duration-200 dark:border-stone-800 dark:bg-stone-900">
                    <div className="w-full px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
