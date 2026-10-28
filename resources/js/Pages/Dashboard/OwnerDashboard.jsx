import { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Copy,
} from 'lucide-react';
import OwnerSidebar from '@/Components/Owner/OwnerSidebar';
import OwnerModal from '@/Components/Owner/OwnerModal';
import {
    branches,
    buildMetrics,
    countDays,
    defaultCustomRange,
    formatDateRange,
    formatRupiah,
    formatSettlementAmount,
    getRangeLabel,
    hourLabels,
    liveOrderColumns,
    liveOrders,
    menuItems,
    rosterSuggestions,
} from '@/data/ownerDashboard';
import BiHeader from './Owner/BiHeader';
import CapacityHeatmapCard from './Owner/CapacityHeatmapCard';
import CashierStaffView from './Owner/CashierStaffView';
import DevicesView from './Owner/DevicesView';
import HourlyRushCard from './Owner/HourlyRushCard';
import MenuEditorView from './Owner/MenuEditorView';
import RetentionCard from './Owner/RetentionCard';
import ScheduleView from './Owner/ScheduleView';
import StatCards from './Owner/StatCards';
import TablesView from './Owner/TablesView';
import TopItemsCard from './Owner/TopItemsCard';
import ReviewsView from './Owner/ReviewsView';

const toLocalDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const todayValue = toLocalDateValue(new Date());

const ownerViewTitles = {
    bi: 'Business Intelligence',
    reviews: 'Ulasan & Reputasi Pelanggan',
    menu: 'Tambah Item Menu & Resep',
    devices: 'Perangkat Kasir & Printer',
    tables: 'Kelola Kafe & Denah Meja',
    schedule: 'Jadwal & Manajemen Staf',
    cashierStaff: 'Kelola Staf Kasir & POS',
};

const ownerViewIds = Object.keys(ownerViewTitles);

function getOwnerViewFromUrl() {
    if (typeof window === 'undefined') {
        return 'bi';
    }

    const requestedView = new URLSearchParams(window.location.search).get(
        'view',
    );

    return ownerViewIds.includes(requestedView) ? requestedView : 'bi';
}

export default function OwnerDashboard({
    cashiers = [],
    storeCode = 'ART-88',
    flashStatus = null,
}) {
    const [activeView, setActiveView] = useState(getOwnerViewFromUrl);
    const [branchId, setBranchId] = useState('senopati');
    const [rangeId, setRangeId] = useState('today');
    const [customRange, setCustomRange] = useState(defaultCustomRange);
    const [draftRange, setDraftRange] = useState(defaultCustomRange);
    const [dateError, setDateError] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [catalogExpanded, setCatalogExpanded] = useState(false);
    const [alertThreshold, setAlertThreshold] = useState(15);
    const [alertChannels, setAlertChannels] = useState({
        inApp: true,
        email: true,
        sms: false,
    });
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    const branch = branches[branchId] ?? branches.senopati;
    const metrics = buildMetrics(branch, rangeId, customRange);
    const rangeLabel = getRangeLabel(rangeId, customRange);
    const occupancy = Math.round(
        (branch.seatsOccupied / branch.seatsTotal) * 100,
    );

    useEffect(
        () => () => {
            if (toastTimer.current) {
                window.clearTimeout(toastTimer.current);
            }
        },
        [],
    );

    useEffect(() => {
        const syncViewFromHistory = () => {
            setActiveView(getOwnerViewFromUrl());
        };

        window.addEventListener('popstate', syncViewFromHistory);

        return () =>
            window.removeEventListener('popstate', syncViewFromHistory);
    }, []);

    const navigateView = (view) => {
        if (!ownerViewIds.includes(view)) {
            return;
        }

        setActiveModal(null);

        if (view !== activeView) {
            setActiveView(view);

            const url = new URL(window.location.href);

            if (view === 'bi') {
                url.searchParams.delete('view');
            } else {
                url.searchParams.set('view', view);
            }

            url.hash = '';
            window.history.pushState({}, '', url);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showToast = (message) => {
        setToast(message);

        if (toastTimer.current) {
            window.clearTimeout(toastTimer.current);
        }

        toastTimer.current = window.setTimeout(() => setToast(null), 3600);
    };

    const openCustomRange = () => {
        setDraftRange(customRange);
        setDateError('');
        setActiveModal('date');
    };

    const applyCustomRange = (event) => {
        event.preventDefault();

        if (!draftRange.start || !draftRange.end) {
            setDateError('Choose both a start and an end date.');
            return;
        }

        if (draftRange.end < draftRange.start) {
            setDateError('The end date must be on or after the start date.');
            return;
        }

        setCustomRange(draftRange);
        setRangeId('custom');
        setDateError('');
        setActiveModal(null);
        showToast(`Reporting range set to ${formatDateRange(draftRange)}`);
    };

    const handleExport = () => {
        const rows = [
            ['CafeFinder Business Intelligence'],
            ['Store', branch.storeName],
            ['Branch', branch.label],
            ['Reporting period', rangeLabel],
            ['Generated', new Date().toLocaleString('en-GB')],
            [],
            ['Metric', 'Value'],
            ['Total revenue', formatRupiah(metrics.revenue)],
            ['Total orders', `${metrics.orders} orders`],
            ['Average ticket size', formatRupiah(metrics.average)],
            ['Customer satisfaction', `${metrics.satisfaction} / 5.0`],
            ['Repeat customer rate', `${branch.repeatRate}%`],
            [],
            ['Settlement method', 'Share', 'Amount'],
            ...branch.settlements.map((method) => [
                method.label,
                `${method.share}%`,
                formatSettlementAmount(metrics.revenue, method.share),
            ]),
            [],
            ['Hour', 'Foot traffic', 'Espresso cups'],
            ...branch.chart.foot.map((foot, index) => [
                hourLabels[index],
                foot,
                branch.chart.espresso[index],
            ]),
            [],
            [
                'Rank',
                'Item',
                'Category',
                'Gross revenue',
                'Units dispatched',
                'Inventory status',
            ],
            ...menuItems.map((item) => [
                item.rank,
                `${item.name}${item.note ? ` ${item.note}` : ''}`,
                item.category,
                formatRupiah(item.revenue),
                item.units,
                `${item.stock.label}${item.stock.detail ? ` ${item.stock.detail}` : ''}`,
            ]),
        ];

        const csv = rows
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
                    .join(','),
            )
            .join('\r\n');

        const blob = new Blob([`\uFEFF${csv}`], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = `cafefinder-bi-${branch.id}-${rangeId}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);

        showToast(`BI report exported for ${branch.label}`);
    };

    const handleCopyRoster = async () => {
        const summary = rosterSuggestions
            .map(
                (suggestion) =>
                    `${suggestion.shift} · ${suggestion.role} · ${suggestion.action}`,
            )
            .join('\n');

        try {
            await navigator.clipboard.writeText(
                `Staffing recommendations — ${branch.label}\n${summary}`,
            );
            setActiveModal(null);
            showToast('Staffing recommendations copied');
        } catch {
            showToast('Copy is unavailable — you can select the shifts above.');
        }
    };

    const saveStockAlerts = (event) => {
        event.preventDefault();
        setActiveModal(null);
        showToast(
            `Stock alerts updated for ${branch.label} at ${alertThreshold} units`,
        );
    };

    return (
        <>
            <Head title={ownerViewTitles[activeView]} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-7">
                <OwnerSidebar
                    branch={branch}
                    activeView={activeView}
                    onNavigate={navigateView}
                    onOpenOrders={() => setActiveModal('orders')}
                />

                <div className="min-w-0" data-owner-view={activeView}>
                    {activeView === 'bi' && (
                        <div className="space-y-6">
                    <BiHeader
                        branch={branch}
                        onBranchChange={setBranchId}
                        rangeId={rangeId}
                        onRangeChange={setRangeId}
                        onOpenCustomRange={openCustomRange}
                        onExport={handleExport}
                        rangeLabel={rangeLabel}
                    />

                    <StatCards metrics={metrics} branch={branch} />

                    <div className="grid gap-5 xl:grid-cols-[1.72fr_1fr]">
                        <HourlyRushCard
                            branch={branch}
                            onOpenRoster={() => setActiveModal('roster')}
                            occupancy={occupancy}
                        />
                        <RetentionCard branch={branch} revenue={metrics.revenue} />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[2.4fr_1fr]">
                        <TopItemsCard
                            items={menuItems}
                            expanded={catalogExpanded}
                            onToggle={() =>
                                setCatalogExpanded((isExpanded) => !isExpanded)
                            }
                            onConfigureAlerts={() =>
                                setActiveModal('stock')
                            }
                        />
                        <CapacityHeatmapCard branch={branch} />
                    </div>
                        </div>
                    )}

                    {activeView === 'reviews' && (
                        <ReviewsView
                            branch={branch}
                            notify={showToast}
                            onNavigate={navigateView}
                        />
                    )}

                    {activeView === 'menu' && (
                        <MenuEditorView notify={showToast} />
                    )}

                    {activeView === 'devices' && (
                        <DevicesView
                            notify={showToast}
                            onNavigate={navigateView}
                        />
                    )}

                    {activeView === 'tables' && (
                        <TablesView
                            notify={showToast}
                            onNavigate={navigateView}
                        />
                    )}

                    {activeView === 'schedule' && (
                        <ScheduleView
                            notify={showToast}
                            onNavigate={navigateView}
                        />
                    )}

                    {activeView === 'cashierStaff' && (
                        <CashierStaffView
                            cashiers={cashiers}
                            storeCode={storeCode}
                            flashStatus={flashStatus}
                            notify={showToast}
                        />
                    )}
                </div>
            </div>

            <OwnerModal
                show={activeModal === 'date'}
                onClose={() => setActiveModal(null)}
                title="Custom date range"
                description="Choose the trading window you want to compare."
                maxWidth="md"
            >
                <form onSubmit={applyCustomRange}>
                    <div className="space-y-4 px-5 py-5">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-[11px] font-semibold text-[#4A4552]">
                                    Start date
                                </span>
                                <span className="relative mt-1.5 block">
                                    <CalendarDays
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6A78]"
                                    />
                                    <input
                                        type="date"
                                        value={draftRange.start}
                                        max={draftRange.end || todayValue}
                                        onChange={(event) => {
                                            setDraftRange((range) => ({
                                                ...range,
                                                start: event.target.value,
                                            }));
                                            setDateError('');
                                        }}
                                        className="h-10 w-full rounded-lg border border-[#E2E4EC] bg-white pl-9 pr-3 text-[12px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="text-[11px] font-semibold text-[#4A4552]">
                                    End date
                                </span>
                                <span className="relative mt-1.5 block">
                                    <CalendarDays
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6A78]"
                                    />
                                    <input
                                        type="date"
                                        value={draftRange.end}
                                        min={draftRange.start}
                                        max={todayValue}
                                        onChange={(event) => {
                                            setDraftRange((range) => ({
                                                ...range,
                                                end: event.target.value,
                                            }));
                                            setDateError('');
                                        }}
                                        className="h-10 w-full rounded-lg border border-[#E2E4EC] bg-white pl-9 pr-3 text-[12px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                    />
                                </span>
                            </label>
                        </div>

                        {dateError ? (
                            <p
                                role="alert"
                                className="rounded-lg bg-[#FFF2F0] px-3 py-2 text-[11px] font-medium text-[#B42318]"
                            >
                                {dateError}
                            </p>
                        ) : (
                            <p className="text-[10.5px] leading-4 text-[#77727F]">
                                {countDays(
                                    draftRange.start,
                                    draftRange.end,
                                )}{' '}
                                days selected. Metrics are calculated against
                                the previous period of the same length.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="rounded-lg px-3 py-2 text-[11.5px] font-semibold text-[#6F6A78] transition hover:bg-[#F5F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-[#8D4B00] px-4 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2"
                        >
                            Apply range
                        </button>
                    </div>
                </form>
            </OwnerModal>

            <OwnerModal
                show={activeModal === 'stock'}
                onClose={() => setActiveModal(null)}
                title="Stock alerts"
                description={`Keep ${branch.label} ahead of low inventory.`}
                maxWidth="md"
            >
                <form onSubmit={saveStockAlerts}>
                    <div className="space-y-5 px-5 py-5">
                        <label className="block">
                            <span className="text-[11px] font-semibold text-[#4A4552]">
                                Alert when an item drops below
                            </span>
                            <span className="mt-1.5 flex h-10 items-center overflow-hidden rounded-lg border border-[#E2E4EC] bg-white focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={alertThreshold}
                                    onChange={(event) =>
                                        setAlertThreshold(
                                            Number(event.target.value),
                                        )
                                    }
                                    className="h-full w-full border-0 bg-transparent px-3 text-[12px] text-[#292632] focus:ring-0"
                                />
                                <span className="border-l border-[#F0EFF4] px-3 text-[11px] font-medium text-[#77727F]">
                                    units
                                </span>
                            </span>
                        </label>

                        <fieldset>
                            <legend className="text-[11px] font-semibold text-[#4A4552]">
                                Notification channels
                            </legend>
                            <div className="mt-2 space-y-2">
                                {[
                                    {
                                        id: 'inApp',
                                        label: 'In-app notification',
                                        description:
                                            'Shown in the bell menu and dashboard banner.',
                                    },
                                    {
                                        id: 'email',
                                        label: 'Email digest',
                                        description:
                                            'Sent to the owner and shift lead inbox.',
                                    },
                                    {
                                        id: 'sms',
                                        label: 'SMS to shift lead',
                                        description:
                                            'Only for critical stock below five units.',
                                    },
                                ].map((channel) => (
                                    <label
                                        key={channel.id}
                                        className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#EFEEF3] p-3 transition hover:bg-[#FAFAFD]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                alertChannels[channel.id]
                                            }
                                            onChange={(event) =>
                                                setAlertChannels(
                                                    (channels) => ({
                                                        ...channels,
                                                        [channel.id]:
                                                            event.target
                                                                .checked,
                                                    }),
                                                )
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-[#CFCBD6] text-[#8D4B00] focus:ring-[#8D4B00]"
                                        />
                                        <span>
                                            <span className="block text-[11.5px] font-semibold text-[#3F3B47]">
                                                {channel.label}
                                            </span>
                                            <span className="mt-0.5 block text-[10.5px] leading-4 text-[#77727F]">
                                                {channel.description}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="rounded-lg px-3 py-2 text-[11.5px] font-semibold text-[#6F6A78] transition hover:bg-[#F5F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-[#8D4B00] px-4 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2"
                        >
                            Save preferences
                        </button>
                    </div>
                </form>
            </OwnerModal>

            <OwnerModal
                show={activeModal === 'roster'}
                onClose={() => setActiveModal(null)}
                title="Roster sync"
                description={`Suggested staffing for ${branch.label}, based on hourly throughput.`}
                maxWidth="xl"
            >
                <div className="px-5 py-5">
                    <ul className="space-y-2.5">
                        {rosterSuggestions.map((suggestion) => (
                            <li
                                key={suggestion.shift}
                                className="flex gap-3 rounded-xl border border-[#EFEEF3] p-3.5"
                            >
                                <span
                                    className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                        suggestion.tone === 'high'
                                            ? 'bg-[#FFE7D7] text-[#8D4B00]'
                                            : suggestion.tone === 'medium'
                                              ? 'bg-[#FFF3D9] text-[#92600E]'
                                              : 'bg-[#EAF8F1] text-[#0D7A5F]'
                                    }`}
                                >
                                    <ClipboardList
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5"
                                    />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-[12px] font-semibold text-[#292632]">
                                            {suggestion.shift} ·{' '}
                                            {suggestion.role}
                                        </p>
                                        <span className="rounded-full bg-[#F4F3F8] px-2 py-0.5 text-[9.5px] font-semibold text-[#55515E]">
                                            {suggestion.action}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[10.5px] leading-4 text-[#77727F]">
                                        {suggestion.reason}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-4 rounded-lg bg-[#F7F8FD] px-3 py-2.5 text-[10.5px] leading-4 text-[#6F6A78]">
                        Recommendations are based on the selected reporting
                        period. Confirm shift changes with the shift lead before
                        publishing.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="rounded-lg px-3 py-2 text-[11.5px] font-semibold text-[#6F6A78] transition hover:bg-[#F5F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleCopyRoster}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#8D4B00] px-4 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2"
                    >
                        <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                        Copy recommendations
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={activeModal === 'orders'}
                onClose={() => setActiveModal(null)}
                title="Live order kanban"
                description={`8 active tickets · ${branch.label}`}
                maxWidth="2xl"
            >
                <div className="px-5 py-5">
                    <div className="grid gap-3 md:grid-cols-3">
                        {liveOrderColumns.map((column) => {
                            const orders = liveOrders.filter(
                                (order) => order.column === column.id,
                            );

                            return (
                                <section key={column.id}>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <h3 className="text-[11px] font-semibold text-[#3F3B47]">
                                            {column.label}
                                        </h3>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${column.tone}`}
                                        >
                                            {orders.length}
                                        </span>
                                    </div>
                                    <ul className="space-y-2">
                                        {orders.map((order) => (
                                            <li
                                                key={order.id}
                                                className="rounded-xl border border-[#EFEEF3] bg-[#FCFCFE] p-3"
                                            >
                                                <div className="flex items-center justify-between gap-2 text-[9.5px] text-[#6F6A78]">
                                                    <span className="font-semibold text-[#6F3A0E]">
                                                        {order.id}
                                                    </span>
                                                    <span>{order.age} ago</span>
                                                </div>
                                                <p className="mt-1.5 text-[10px] font-semibold text-[#4A4552]">
                                                    {order.table}
                                                </p>
                                                <p className="mt-1 text-[11px] leading-4 text-[#292632]">
                                                    {order.item}
                                                </p>
                                                <p className="mt-2 text-[10.5px] font-semibold text-[#3F3B47]">
                                                    {order.total}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            );
                        })}
                    </div>

                    <p className="mt-4 rounded-lg bg-[#F7F8FD] px-3 py-2.5 text-[10.5px] leading-4 text-[#6F6A78]">
                        Tickets reflect the current shift for {branch.label}.
                        Payment status is confirmed in the cashier console.
                    </p>
                </div>
            </OwnerModal>

            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-5 right-5 z-[70] flex max-w-[360px] items-start gap-2 rounded-xl bg-[#231F2B] px-4 py-3 text-[11.5px] font-medium leading-4 text-white shadow-xl shadow-[#231F2B]/25"
                >
                    <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8FE5C6]"
                    />
                    {toast}
                </div>
            )}
        </>
    );
}
