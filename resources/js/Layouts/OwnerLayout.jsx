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
    ExternalLink,
    FileText,
    LogOut,
    Menu as MenuIcon,
    Monitor,
    Search,
    ShieldCheck,
    Store,
    UserRound,
    X,
} from 'lucide-react';
import { dashboardTargets } from '@/data/ownerDashboard';

const ownerQuickViews = [
    { label: 'Analisis BI', view: 'bi' },
    { label: 'Pesanan Masuk', view: 'bi', id: 'orders' },
    { label: 'Profil & Menu', view: 'menu' },
    { label: 'Ulasan Pelanggan', view: 'reviews' },
    { label: 'Kelola Kafe & Meja', view: 'tables' },
    { label: 'Perangkat & KDS', view: 'devices' },
    { label: 'Staf & PIN Kasir', view: 'cashierStaff' },
    { label: 'Jadwal & Shift', view: 'schedule' },
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
    return (
        <footer className="border-t border-[#E2E7F5] bg-[#EFF3FF]">
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <img
                                src="/img/logo/logoamber.svg"
                                alt=""
                                className="h-6 w-6"
                            />
                            <span className="text-[17px] font-bold tracking-[-0.03em] text-[#6B3A1C]">
                                CafeFinder
                            </span>
                            <span className="rounded-full bg-[#8D4B00]/10 px-2 py-0.5 text-[10px] font-semibold text-[#8D4B00] ring-1 ring-inset ring-[#8D4B00]/20">
                                Merchant Portal
                            </span>
                        </div>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-[#55515E]">
                            Portal operasional kafe, manajemen kasir POS, dan analisis business intelligence.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-[#55515E]">
                        <Link
                            href={route('pos')}
                            className="inline-flex items-center gap-1.5 font-medium text-[#8D4B00] transition hover:text-[#56311F] hover:underline"
                        >
                            <Monitor className="h-3.5 w-3.5" />
                            Terminal Kasir POS
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className="transition hover:text-[#231F2B] hover:underline"
                        >
                            Pengaturan Akun
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 transition hover:text-[#231F2B] hover:underline"
                        >
                            Tampilan Web Publik
                            <ExternalLink className="h-3 w-3 text-[#77727E]" />
                        </a>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[11px] font-medium text-[#2E7D32]">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                            Sistem Terenkripsi TLS 1.3
                        </span>
                    </div>
                </div>

                <div className="mt-6 border-t border-[#E4E8F4] pt-4 text-[11.5px] text-[#716C7D]">
                    © {new Date().getFullYear()} CafeFinder for Merchants. Hak cipta dilindungi.
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
                <div className="flex h-[72px] w-full items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8 xl:px-10">
                    <Link
                        href="/dashboard/owner"
                        className="flex shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2"
                    >
                        <img
                            src="/img/logo/logoamber.svg"
                            alt=""
                            className="h-8 w-8"
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-[19px] font-bold tracking-[-0.035em] text-[#56311F]">
                                CafeFinder
                            </span>
                            <span className="hidden items-center rounded-full bg-[#8D4B00]/10 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#8D4B00] ring-1 ring-inset ring-[#8D4B00]/20 sm:inline-flex">
                                Portal Pemilik
                            </span>
                        </div>
                    </Link>

                    {/* Store / Branch context badge */}
                    <div className="hidden items-center gap-2 rounded-lg border border-[#E7E8F0] bg-[#F9FAFC] px-2.5 py-1.5 md:flex">
                        <Store className="h-3.5 w-3.5 text-[#8D4B00]" />
                        <span className="text-[12px] font-medium text-[#373240]">
                            Artisan Roastery <span className="text-[#A29DAE]">·</span> <span className="text-[#6F6A78]">Senopati Flagship</span>
                        </span>
                    </div>

                    <DashboardSearch
                        className="hidden w-[220px] shrink-0 md:block lg:w-[250px] xl:w-[280px]"
                        onNavigate={openDashboardTarget}
                    />

                    <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
                        <Link
                            href={route('pos')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#56311F] px-3 py-2 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-[#432516] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            title="Buka Terminal Kasir POS"
                        >
                            <Monitor className="h-4 w-4" />
                            <span className="hidden sm:inline">Terminal POS</span>
                        </Link>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden items-center gap-1.5 rounded-lg border border-[#E8E9F1] bg-white px-2.5 py-2 text-[12.5px] font-medium text-[#4B4653] transition hover:bg-[#F7F8FD] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] lg:inline-flex"
                            title="Lihat Tampilan Web Kafe Publik"
                        >
                            <ExternalLink className="h-3.5 w-3.5 text-[#6F6A78]" />
                            <span>Web Publik</span>
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
                                            <a
                                                href="/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#44404C] transition data-[focus]:bg-[#F5F6FB]"
                                            >
                                                <ExternalLink
                                                    aria-hidden="true"
                                                    className="h-4 w-4 text-[#6F6A78]"
                                                />
                                                View storefront
                                            </a>
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
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E9F1] bg-white text-[#4B4653] transition hover:bg-[#F7F8FD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] md:hidden"
                        >
                            {mobileNavigationOpen ? (
                                <X aria-hidden="true" className="h-4 w-4" />
                            ) : (
                                <MenuIcon aria-hidden="true" className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {mobileNavigationOpen && (
                    <div
                        id="owner-mobile-navigation"
                        className="border-t border-[#ECECF3] bg-white px-4 py-4 md:hidden"
                    >
                        <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#E7E8F0] bg-[#F9FAFC] px-3 py-2">
                            <Store className="h-4 w-4 text-[#8D4B00]" />
                            <span className="text-[12.5px] font-semibold text-[#373240]">
                                Artisan Roastery · Senopati Flagship
                            </span>
                        </div>

                        <DashboardSearch
                            className="w-full"
                            inputId="owner-mobile-dashboard-search"
                            onNavigate={(target) => {
                                setMobileNavigationOpen(false);
                                openDashboardTarget(target);
                            }}
                        />

                        <p className="mt-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7584]">
                            Navigasi Dashboard
                        </p>
                        <nav
                            aria-label="Navigasi Owner"
                            className="mt-2 grid grid-cols-2 gap-1.5"
                        >
                            {ownerQuickViews.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => {
                                        setMobileNavigationOpen(false);
                                        openDashboardTarget(item);
                                    }}
                                    className="flex items-center rounded-lg border border-[#ECECF3] bg-[#FAFAFD] px-3 py-2 text-left text-[12.5px] font-medium text-[#45414D] transition hover:bg-[#F0F2FA] hover:text-[#231F2B]"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F0F0F5] pt-3">
                            <Link
                                href={route('pos')}
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#56311F] px-3 py-2 text-[12px] font-semibold text-white"
                            >
                                <Monitor className="h-3.5 w-3.5" />
                                Terminal POS
                            </Link>
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E8E9F1] bg-[#F9FAFC] px-3 py-2 text-[12px] font-semibold text-[#4B4653]"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Web Publik
                            </a>
                        </div>
                    </div>
                )}
            </header>

            <main className="w-full flex-1 px-4 pb-12 pt-5 sm:px-6 lg:px-8 xl:px-10">
                {children}
            </main>

            <OwnerFooter />
        </div>
    );
}
