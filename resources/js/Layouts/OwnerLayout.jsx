import { useEffect, useState } from 'react';
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverButton,
    PopoverPanel,
} from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    FileText,
    LogOut,
    MapPin,
    Menu as MenuIcon,
    Plus,
    Search,
    UserRound,
    X,
} from 'lucide-react';
import { dashboardTargets } from '@/data/ownerDashboard';

const navLinks = [
    { label: 'Discovery', href: '/#eksplorasi' },
    { label: 'Leaderboard', href: '/#peringkat' },
    { label: 'Promoted', href: '/#promosi' },
    { label: 'Orders', href: '/#pesanan' },
    { label: 'Community', href: '/#komunitas' },
];

const initialsFor = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'CF';

function scrollToSection(id) {
    const section = document.getElementById(id);

    if (!section) {
        return;
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
}

function openDashboardTarget(target) {
    const currentView =
        new URLSearchParams(window.location.search).get('view') ?? 'bi';
    const targetView = target.view ?? 'bi';

    if (currentView === targetView) {
        if (target.id && document.getElementById(target.id)) {
            scrollToSection(target.id);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return;
    }

    const url = new URL('/dashboard/owner', window.location.origin);

    if (targetView !== 'bi') {
        url.searchParams.set('view', targetView);
    }

    if (targetView === 'bi' && target.id) {
        url.hash = target.id;
    }

    window.location.assign(url.toString());
}

function DashboardSearch({
    className = '',
    onNavigate,
    inputId = 'owner-dashboard-search',
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const normalizedQuery = query.trim().toLowerCase();
    const results = normalizedQuery
        ? dashboardTargets.filter((target) =>
              [target.label, target.hint, ...target.keywords]
                  .join(' ')
                  .toLowerCase()
                  .includes(normalizedQuery),
          )
        : [];

    const chooseTarget = (target) => {
        setIsOpen(false);
        setQuery('');
        onNavigate?.(target);
    };

    return (
        <div
            className={`relative ${className}`}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsOpen(false);
                }
            }}
        >
            <form
                role="search"
                onSubmit={(event) => {
                    event.preventDefault();

                    if (results[0]) {
                        chooseTarget(results[0]);
                    }
                }}
                className="relative"
            >
                <label htmlFor={inputId} className="sr-only">
                    Search this dashboard
                </label>
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6A78]"
                />
                <input
                    id={inputId}
                    type="search"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            setIsOpen(false);
                        }
                    }}
                    placeholder="Search dashboard, items, reports..."
                    autoComplete="off"
                    aria-expanded={isOpen && Boolean(normalizedQuery)}
                    aria-controls={`${inputId}-results`}
                    className="h-9 w-full rounded-xl border border-[#E4E7F1] bg-[#F6F8FE] pl-10 pr-3.5 text-[12.5px] text-[#292632] placeholder:text-[#6F6A78] focus:border-[#B9A18B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                />
            </form>

            {isOpen && normalizedQuery && (
                <div
                    id={`${inputId}-results`}
                    className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#E7E8F0] bg-white shadow-xl shadow-[#20263A]/10"
                >
                    <p className="px-3.5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F6A78]">
                        Jump to
                    </p>

                    {results.length > 0 ? (
                        <ul className="pb-1.5">
                            {results.map((target) => (
                                <li key={target.id}>
                                    <button
                                        type="button"
                                        onMouseDown={(event) =>
                                            event.preventDefault()
                                        }
                                        onClick={() => chooseTarget(target)}
                                        className="flex w-full items-start justify-between gap-3 px-3.5 py-2.5 text-left transition hover:bg-[#F7F8FD] focus:bg-[#F7F8FD] focus:outline-none"
                                    >
                                        <span>
                                            <span className="block text-[13px] font-semibold text-[#292632]">
                                                {target.label}
                                            </span>
                                            <span className="mt-0.5 block text-[11px] text-[#6F6A78]">
                                                {target.hint}
                                            </span>
                                        </span>
                                        <Search
                                            aria-hidden="true"
                                            className="mt-1 h-3.5 w-3.5 shrink-0 text-[#B1ACB8]"
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-3.5 pb-3.5 pt-1 text-[12px] leading-5 text-[#77727E]">
                            No dashboard section matches “{query.trim()}”. Try
                            “ulasan”, “perangkat”, or “shift”.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

const notifications = [
    {
        id: 'stock',
        icon: AlertTriangle,
        tone: 'bg-[#FFF0E7] text-[#8D4B00]',
        title: 'Truffle Croissant is low',
        body: '12 portions left · below the 15 unit alert threshold.',
        target: 'top-selling-items',
        time: '8 min ago',
    },
    {
        id: 'payout',
        icon: CheckCircle2,
        tone: 'bg-[#E8FBF2] text-[#0D7A5F]',
        title: 'Payout settled',
        body: 'Rp 18.7M from today’s QRIS and e-wallet settlements.',
        target: 'retention-settlements',
        time: '24 min ago',
    },
    {
        id: 'report',
        icon: FileText,
        tone: 'bg-[#EEF2FF] text-[#4A4C86]',
        title: 'BI report ready',
        body: 'The weekly cohort and throughput report is ready to review.',
        target: 'business-intelligence',
        time: '1 hr ago',
    },
];

function OwnerFooter() {
    const footerColumns = [
        {
            title: 'Discovery',
            links: [
                { label: 'Explore Cafes', href: '/#eksplorasi' },
                { label: 'Neighborhood Directory', href: '/#peta' },
                { label: 'Top Rated Pour Overs', href: '/#peringkat' },
                { label: 'Quiet Workspaces', href: '/#eksplorasi' },
            ],
        },
        {
            title: 'Merchant Hub',
            links: [
                { label: 'For Cafe Owners', href: '/#mitra' },
                { label: 'Claim Your Listing', href: '/#mitra' },
                { label: 'Merchant Portal', href: '/dashboard/owner', active: true },
                { label: 'Barista Community', href: '/#komunitas' },
            ],
        },
        {
            title: 'Applications & Policy',
            links: [
                { label: 'Download iOS App', href: '/' },
                { label: 'Download Android App', href: '/' },
                { label: 'Privacy Policy', href: '/' },
                { label: 'Terms of Service', href: '/' },
            ],
        },
    ];

    return (
        <footer className="border-t border-[#E2E7F5] bg-[#EFF3FF]">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1.1fr] lg:gap-7">
                    <div className="max-w-[290px]">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <img
                                src="/img/logo/logoamber.svg"
                                alt=""
                                className="h-7 w-7"
                            />
                            <span className="text-[21px] font-bold tracking-[-0.03em] text-[#6B3A1C]">
                                CafeFinder
                            </span>
                        </Link>
                        <p className="mt-3 text-[13px] leading-6 text-[#55515E]">
                            Artisanal coffee intelligence, remote workspace
                            scouting, and seamless barista-to-patron merchant
                            ecosystem.
                        </p>
                        <p className="mt-4 text-[12px] leading-5 text-[#55515E]">
                            © {new Date().getFullYear()} CafeFinder Inc. Cozy
                            cafe discovery and artisanal spaces. All rights
                            reserved.
                        </p>
                    </div>

                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#211D29]">
                                {column.title}
                            </h2>
                            <ul className="mt-3 space-y-1.5">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className={`text-[13px] leading-6 transition hover:text-[#8D4B00] ${
                                                link.active
                                                    ? 'font-semibold text-[#8D4B00]'
                                                    : 'text-[#55515E]'
                                            }`}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default function OwnerLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(notifications.length);

    useEffect(() => {
        if (!mobileNavigationOpen) {
            return undefined;
        }

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setMobileNavigationOpen(false);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [mobileNavigationOpen]);

    return (
        <div
            className="flex min-h-screen flex-col bg-[#F7F8FD] text-[#231F2B] antialiased selection:bg-[#8D4B00] selection:text-white"
            style={{
                fontFamily:
                    "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <header className="sticky top-0 z-40 border-b border-[#ECECF3] bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2"
                    >
                        <img
                            src="/img/logo/logoamber.svg"
                            alt=""
                            className="h-9 w-9"
                        />
                        <span className="text-[20px] font-bold tracking-[-0.035em] text-[#56311F]">
                            CafeFinder
                        </span>
                    </Link>

                    <DashboardSearch
                        className="hidden w-[230px] shrink-0 md:block lg:w-[250px] xl:w-[280px]"
                        onNavigate={openDashboardTarget}
                    />

                    <nav
                        aria-label="CafeFinder"
                        className="hidden items-center gap-0.5 xl:flex"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-[#45414D] transition hover:bg-[#F5F6FB] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className="ml-auto hidden items-center gap-1.5 xl:flex">
                        <MapPin
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#57525F]"
                        />
                        <span className="text-[11px] font-semibold leading-4 text-[#3F3B47]">
                            Senopati,
                            <br />
                            JKT
                        </span>
                    </div>

                    <a
                        href="/#mitra"
                        className="ml-auto hidden shrink-0 rounded-lg bg-[#EFF3FF] px-3 py-2 text-center text-[13px] font-semibold leading-4 text-[#5A3A25] transition hover:bg-[#E6ECFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] sm:block xl:ml-0"
                    >
                        Add
                        <br />
                        Cafe
                    </a>

                    <Popover className="relative shrink-0">
                        <PopoverButton
                            aria-label="Notifications"
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E9F1] bg-white text-[#4B4653] transition hover:bg-[#F7F8FD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            <Bell aria-hidden="true" className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#B45309] ring-2 ring-white" />
                            )}
                        </PopoverButton>
                        <PopoverPanel className="absolute right-0 z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-[#E7E8F0] bg-white shadow-xl shadow-[#20263A]/10">
                            {({ close }) => (
                                <>
                                    <div className="flex items-center justify-between border-b border-[#F0F0F5] px-4 py-3">
                                        <div>
                                            <p className="text-sm font-semibold text-[#231F2B]">
                                                Notifications
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-[#6F6A78]">
                                                {unreadCount > 0
                                                    ? `${unreadCount} unread updates`
                                                    : 'You are all caught up'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setUnreadCount(0)}
                                            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-[#8D4B00] transition hover:bg-[#FFF4EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <ul className="divide-y divide-[#F2F1F5]">
                                        {notifications.map((notification) => {
                                            const Icon = notification.icon;

                                            return (
                                                <li key={notification.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUnreadCount(0);
                                                            close();
                                                            scrollToSection(
                                                                notification.target,
                                                            );
                                                        }}
                                                        className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-[#F8F8FC] focus:bg-[#F8F8FC] focus:outline-none"
                                                    >
                                                        <span
                                                            className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${notification.tone}`}
                                                        >
                                                            <Icon
                                                                aria-hidden="true"
                                                                className="h-3.5 w-3.5"
                                                            />
                                                        </span>
                                                        <span className="min-w-0">
                                                            <span className="flex items-baseline justify-between gap-2">
                                                                <span className="text-[12px] font-semibold text-[#292632]">
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </span>
                                                                <span className="shrink-0 text-[10px] text-[#77727F]">
                                                                    {
                                                                        notification.time
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="mt-1 block text-[11px] leading-4 text-[#77727E]">
                                                                {notification.body}
                                                            </span>
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </>
                            )}
                        </PopoverPanel>
                    </Popover>

                    {user ? (
                        <Menu as="div" className="relative shrink-0">
                            <MenuButton
                                aria-label="Open account menu"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#56311F] text-[11px] font-bold text-white shadow-sm transition hover:bg-[#452716] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2"
                            >
                                {initialsFor(user.name)}
                            </MenuButton>
                            <MenuItems className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-[#E7E8F0] bg-white shadow-xl shadow-[#20263A]/10 focus:outline-none">
                                <div className="border-b border-[#F0F0F5] px-4 py-3">
                                    <p className="truncate text-sm font-semibold text-[#231F2B]">
                                        {user.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-[11px] text-[#6F6A78]">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="p-1.5">
                                    <MenuItem>
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#44404C] transition data-[focus]:bg-[#F5F6FB]"
                                        >
                                            <UserRound
                                                aria-hidden="true"
                                                className="h-4 w-4 text-[#6F6A78]"
                                            />
                                            Profile settings
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#44404C] transition data-[focus]:bg-[#F5F6FB]"
                                        >
                                            <MapPin
                                                aria-hidden="true"
                                                className="h-4 w-4 text-[#6F6A78]"
                                            />
                                            View storefront
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-[#B42318] transition data-[focus]:bg-[#FFF3F1]"
                                        >
                                            <LogOut
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                            Log out
                                        </Link>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Menu>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#8D4B00] px-4 text-[13px] font-semibold text-white transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2"
                        >
                            Sign In
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileNavigationOpen((isOpen) => !isOpen)
                        }
                        aria-label={
                            mobileNavigationOpen
                                ? 'Close navigation'
                                : 'Open navigation'
                        }
                        aria-expanded={mobileNavigationOpen}
                        aria-controls="owner-mobile-navigation"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E9F1] bg-white text-[#4B4653] transition hover:bg-[#F7F8FD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] xl:hidden"
                    >
                        {mobileNavigationOpen ? (
                            <X aria-hidden="true" className="h-4 w-4" />
                        ) : (
                            <MenuIcon aria-hidden="true" className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {mobileNavigationOpen && (
                    <div
                        id="owner-mobile-navigation"
                        className="border-t border-[#ECECF3] bg-white px-4 py-4 xl:hidden"
                    >
                        <DashboardSearch
                            className="md:hidden"
                            inputId="owner-mobile-dashboard-search"
                            onNavigate={(target) => {
                                setMobileNavigationOpen(false);
                                openDashboardTarget(target);
                            }}
                        />
                        <nav
                            aria-label="CafeFinder mobile"
                            className="mt-3 grid grid-cols-2 gap-1.5"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#45414D] transition hover:bg-[#F5F6FB]"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#F0F0F5] pt-3">
                            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#514C58]">
                                <MapPin
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                />
                                Senopati, JKT
                            </span>
                            <a
                                href="/#mitra"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#EFF3FF] px-3 py-2 text-[12px] font-semibold text-[#5A3A25]"
                            >
                                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                                Add Cafe
                            </a>
                        </div>
                    </div>
                )}
            </header>

            <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-12 pt-5 sm:px-6 lg:px-8">
                {children}
            </main>

            <OwnerFooter />
        </div>
    );
}
