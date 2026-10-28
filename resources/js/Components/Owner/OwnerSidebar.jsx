import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Armchair,
    BarChart3,
    CalendarClock,
    ClipboardList,
    Cloud,
    KeyRound,
    Monitor,
    Printer,
    Router,
    Settings,
    Smartphone,
    Star,
    Store,
    UtensilsCrossed,
    Wifi,
} from 'lucide-react';

const navGroups = [
    {
        label: 'Menu Utama',
        items: [
            {
                view: 'bi',
                label: 'Analisis BI',
                icon: BarChart3,
            },
            {
                action: 'orders',
                label: 'Manajemen Pesanan',
                icon: ClipboardList,
                badge: '8',
            },
            {
                view: 'menu',
                label: 'Profil & Menu Kafe',
                icon: UtensilsCrossed,
            },
            {
                view: 'reviews',
                label: 'Ulasan & Reputasi',
                icon: Star,
                badge: '1',
                badgeTone: 'rose',
            },
        ],
    },
    {
        label: 'Operasional',
        items: [
            {
                view: 'tables',
                label: 'Kelola Kafe & Meja',
                icon: Armchair,
            },
            {
                view: 'devices',
                label: 'Perangkat & Kasir',
                icon: Printer,
            },
            {
                view: 'cashierStaff',
                label: 'Staf Kasir & POS',
                icon: KeyRound,
                badge: 'Baru',
            },
            {
                routeName: 'pos',
                label: 'Terminal Kasir POS',
                icon: Monitor,
            },
            {
                view: 'schedule',
                label: 'Jadwal & Shift',
                icon: CalendarClock,
            },
        ],
    },
    {
        label: 'Preferensi',
        items: [
            {
                routeName: 'profile.edit',
                label: 'Pengaturan',
                icon: Settings,
            },
        ],
    },
];

const navItemBase =
    'relative flex w-full min-w-0 shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] lg:px-3.5 lg:text-[13px]';

function SidebarBadge({ badge, tone = 'peach' }) {
    if (!badge) {
        return null;
    }

    return (
        <span
            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                tone === 'rose'
                    ? 'bg-[#FDE8EC] text-[#B4234A]'
                    : 'bg-[#FFEADB] text-[#8D4B00]'
            }`}
        >
            {badge}
        </span>
    );
}

function LiveSeatingCard({ branch }) {
    const occupancy = Math.round(
        (branch.seatsOccupied / branch.seatsTotal) * 100,
    );

    return (
        <div className="rounded-2xl border border-[#E4EAF8] bg-[#EFF3FF] p-4">
            <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-[#55515E]">
                    Kapasitas Duduk Live
                </p>
                <p className="text-[11px] font-bold text-[#0D7A5F]">
                    {occupancy}% Terisi
                </p>
            </div>
            <div
                role="progressbar"
                aria-label="Kapasitas duduk live"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={occupancy}
                className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#DCE4F7]"
            >
                <div
                    className="h-full rounded-full bg-[#8D4B00] transition-[width] duration-500"
                    style={{ width: `${occupancy}%` }}
                />
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2 text-[10.5px]">
                <span className="text-[#6F6A78]">{branch.seatingArea}</span>
                <span className="font-bold text-[#231F2B]">
                    {branch.seatsOccupied} / {branch.seatsTotal} kursi
                </span>
            </div>
        </div>
    );
}

function PosConnectionCard() {
    return (
        <div className="rounded-2xl border border-[#E4EAF8] bg-[#EFF3FF] p-4">
            <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-[#55515E]">
                    Koneksi POS
                </p>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[#0D7A5F]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0D7A5F]" />
                    Aktif
                </span>
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-[#231F2B]">
                Moka / Pawon
            </p>
            <p className="mt-1 text-[9.5px] leading-4 text-[#6F6A78]">
                Resep baru akan otomatis tersinkron ke tablet kasir &amp; QR
                menu meja.
            </p>
        </div>
    );
}

function LocalNetworkCard() {
    return (
        <div className="rounded-2xl border border-[#E4EAF8] bg-[#EFF3FF] p-4">
            <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#55515E]">
                    <Wifi aria-hidden="true" className="h-3.5 w-3.5" />
                    Jaringan Lokal
                </p>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0D7A5F]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0D7A5F]" />
                    LAN Stabil
                </span>
            </div>
            <div className="mt-2 space-y-1 text-[9.5px] text-[#55515E]">
                <p className="flex items-center gap-1.5">
                    <Router
                        aria-hidden="true"
                        className="h-3 w-3 text-[#6F6A78]"
                    />
                    IP Gateway: 192.168.1.1
                </p>
                <p className="pl-[18px] text-[#6F6A78]">
                    Latency: 12ms • Subnet Kasir: POS_CAFE_5G
                </p>
            </div>
        </div>
    );
}

function QrisReviewCard({ onNavigate }) {
    return (
        <div className="rounded-2xl border border-[#F1E4D8] bg-[#FDF7F0] p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6F3A0E]">
                <Smartphone aria-hidden="true" className="h-3.5 w-3.5" />
                QRIS On-Table Review
            </p>
            <p className="mt-1.5 text-[9.5px] leading-4 text-[#6F6A78]">
                Verifikasi otomatis ulasan via struk meja untuk meningkatkan
                reputasi kafe Anda.
            </p>
            <button
                type="button"
                onClick={() => onNavigate('tables')}
                className="mt-2.5 inline-flex items-center gap-1 rounded text-[9.5px] font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
            >
                Cetak QR Meja Baru
                <ArrowRight aria-hidden="true" className="h-3 w-3" />
            </button>
        </div>
    );
}

function ProPlanCard() {
    return (
        <div className="rounded-2xl border border-[#F1E4D8] bg-[#FDF7F0] p-4">
            <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6F3A0E]">
                    <Cloud aria-hidden="true" className="h-3.5 w-3.5" />
                    Paket Pro Aktif
                </p>
                <span className="rounded-full bg-[#FFE7D7] px-2 py-0.5 text-[8.5px] font-semibold text-[#8D4B00]">
                    Hingga Nov 2025
                </span>
            </div>
            <p className="mt-1.5 text-[9.5px] leading-4 text-[#6F6A78]">
                Multi-barista roster, POS sync, &amp; automated payroll
                terintegrasi penuh.
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EADCCF]">
                <div className="h-full w-[68%] rounded-full bg-[#8D4B00]" />
            </div>
        </div>
    );
}

export default function OwnerSidebar({
    branch,
    activeView = 'bi',
    onNavigate,
    onOpenOrders,
}) {
    const renderBottomCard = () => {
        if (activeView === 'menu') {
            return <PosConnectionCard />;
        }

        if (activeView === 'devices') {
            return <LocalNetworkCard />;
        }

        if (activeView === 'reviews') {
            return <QrisReviewCard onNavigate={onNavigate} />;
        }

        if (activeView === 'schedule') {
            return <ProPlanCard />;
        }

        return <LiveSeatingCard branch={branch} />;
    };

    return (
        <aside className="space-y-4 lg:sticky lg:top-23 lg:max-h-[calc(100vh-6.5rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <div className="flex items-center gap-3 rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FCE9D7] text-[#8D4B00]">
                    <Store aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-semibold text-[#231F2B]">
                        {branch.storeName}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-[#6F6A78]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#13A474]" />
                        <span className="truncate">{branch.label}</span>
                    </p>
                </div>
            </div>

            <nav
                aria-label="Navigasi owner"
                className="rounded-2xl border border-[#ECECF3] bg-white p-3 shadow-sm shadow-[#20263A]/3"
            >
                {navGroups.map((group, groupIndex) => (
                    <div
                        key={group.label}
                        className={groupIndex > 0 ? 'mt-2' : ''}
                    >
                        <p className="px-2 pb-2 pt-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#6F6A78]">
                            {group.label}
                        </p>
                        <ul className="grid grid-cols-2 gap-1 pb-1 lg:flex lg:flex-col lg:gap-0.5 lg:pb-0">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    item.view && item.view === activeView;
                                const sharedClass = `${navItemBase} ${
                                    isActive
                                        ? 'bg-[#FFEADB] font-semibold text-[#6F3A0E] hover:bg-[#FFE3CF]'
                                        : 'text-[#514C59] hover:bg-[#F7F7FB] hover:text-[#231F2B]'
                                }`;

                                return (
                                    <li key={item.label}>
                                        {item.routeName ? (
                                            <Link
                                                href={route(item.routeName)}
                                                className={sharedClass}
                                            >
                                                <Icon
                                                    aria-hidden="true"
                                                    className={`h-4 w-4 shrink-0 ${
                                                        isActive
                                                            ? 'text-[#8D4B00]'
                                                            : 'text-[#77727F]'
                                                    }`}
                                                />
                                                <span className="leading-4">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                aria-current={
                                                    isActive
                                                        ? 'page'
                                                        : undefined
                                                }
                                                onClick={() => {
                                                    if (item.action === 'orders') {
                                                        onOpenOrders();
                                                        return;
                                                    }

                                                    onNavigate(item.view);
                                                }}
                                                className={sharedClass}
                                            >
                                                {isActive && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute bottom-2 left-0 top-2 hidden w-[3px] rounded-full bg-[#8D4B00] lg:block"
                                                    />
                                                )}
                                                <Icon
                                                    aria-hidden="true"
                                                    className={`h-4 w-4 shrink-0 ${
                                                        isActive
                                                            ? 'text-[#8D4B00]'
                                                            : 'text-[#77727F]'
                                                    }`}
                                                />
                                                <span className="leading-4">
                                                    {item.label}
                                                </span>
                                                <SidebarBadge
                                                    badge={item.badge}
                                                    tone={item.badgeTone}
                                                />
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {renderBottomCard()}
        </aside>
    );
}
