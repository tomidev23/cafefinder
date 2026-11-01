import { ArrowRight, BellRing } from 'lucide-react';
import { formatRupiah } from '@/data/ownerDashboard';

const rankTones = {
    peach: 'bg-[#FFE8DB] text-[#8D4B00]',
    blue: 'bg-[#E7EDFF] text-[#5D6B96]',
};

const stockTones = {
    in: 'bg-[#D2F9E6] text-[#0B6B4A]',
    low: 'bg-[#FFE3DA] text-[#8D4B00]',
    healthy: 'bg-[#D2F9E6] text-[#0B6B4A]',
};

export default function TopItemsCard({
    items,
    expanded,
    onToggle,
    onConfigureAlerts,
}) {
    const visibleItems = expanded ? items : items.slice(0, 4);

    return (
        <section
            id="top-selling-items"
            aria-labelledby="top-items-title"
            className="flex h-full min-w-0 scroll-mt-24 flex-col rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/[0.03]"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2
                        id="top-items-title"
                        className="text-[17px] font-semibold tracking-[-0.02em] text-[#211D29]"
                    >
                        Top Selling Menu Items &amp; Velocity
                    </h2>
                    <p className="mt-1 text-[12px] leading-4 text-[#77727F]">
                        Ranked by gross sales volume and kitchen dispatch
                        velocity
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onConfigureAlerts}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E8F3] bg-[#F6F8FE] px-3 py-2 text-[11px] font-semibold text-[#7A3D12] transition hover:border-[#D5DAE9] hover:bg-[#F0F3FC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                >
                    <BellRing aria-hidden="true" className="h-3.5 w-3.5" />
                    Configure Stock Alerts
                </button>
            </div>

            <div className="mt-4 hidden flex-1 overflow-x-auto sm:block">
                <table className="w-full min-w-[560px] border-collapse text-left">
                    <caption className="sr-only">
                        Top selling menu items with gross revenue, units
                        dispatched, and inventory status. Showing{' '}
                        {visibleItems.length} of {items.length} items.
                    </caption>
                    <thead>
                        <tr className="border-b border-[#F0EFF4]">
                            <th
                                scope="col"
                                className="pb-2.5 pl-0 pr-2 text-[10px] font-medium text-[#6F6A78]"
                            >
                                Item Name
                            </th>
                            <th
                                scope="col"
                                className="px-2 pb-2.5 text-[10px] font-medium text-[#6F6A78]"
                            >
                                Category
                            </th>
                            <th
                                scope="col"
                                className="px-2 pb-2.5 text-[10px] font-medium text-[#6F6A78]"
                            >
                                Gross
                                <br />
                                Revenue
                            </th>
                            <th
                                scope="col"
                                className="px-2 pb-2.5 text-[10px] font-medium text-[#6F6A78]"
                            >
                                Units
                                <br />
                                Dispatched
                            </th>
                            <th
                                scope="col"
                                className="pb-2.5 pl-2 pr-0 text-[10px] font-medium text-[#6F6A78]"
                            >
                                Inventory
                                <br />
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleItems.map((item) => (
                            <tr
                                key={item.rank}
                                className="border-b border-[#F4F3F7] transition last:border-0 hover:bg-[#FAFAFD]"
                            >
                                <td className="py-3 pl-0 pr-2 align-middle">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold ${rankTones[item.rankTone]}`}
                                        >
                                            #{item.rank}
                                        </span>
                                        <span className="max-w-[150px] text-[12.5px] font-semibold leading-4 text-[#231F2B]">
                                            {item.name}
                                            {item.note && (
                                                <span className="block font-medium text-[#6F6A78]">
                                                    {item.note}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-2 py-3 align-middle">
                                    <span className="block max-w-[90px] text-[10.5px] leading-4 text-[#6F6A78]">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-2 py-3 align-middle">
                                    <span className="block text-[9px] leading-3 text-[#6F6A78]">
                                        Rp
                                    </span>
                                    <span className="block text-[11px] font-semibold leading-4 text-[#231F2B]">
                                        {formatRupiah(item.revenue).replace(
                                            'Rp ',
                                            '',
                                        )}
                                    </span>
                                </td>
                                <td className="px-2 py-3 align-middle text-[10.5px] text-[#55515E]">
                                    {item.units}
                                </td>
                                <td className="py-3 pl-2 pr-0 align-middle">
                                    <span
                                        className={`inline-flex min-w-[86px] items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold leading-3 ${stockTones[item.stock.tone]}`}
                                    >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                                        <span>
                                            {item.stock.label}
                                            {item.stock.detail && (
                                                <span className="block text-[9px] font-medium leading-3 opacity-80">
                                                    {item.stock.detail}
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ul className="mt-4 divide-y divide-[#F4F3F7] sm:hidden">
                {visibleItems.map((item) => (
                    <li key={item.rank} className="py-3">
                        <div className="flex items-start gap-2.5">
                            <span
                                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold ${rankTones[item.rankTone]}`}
                            >
                                #{item.rank}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-[12px] font-semibold leading-4 text-[#231F2B]">
                                            {item.name}
                                            {item.note && (
                                                <span className="block font-medium text-[#6F6A78]">
                                                    {item.note}
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-[#6F6A78]">
                                            {item.category}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[9px] font-semibold leading-3 ${stockTones[item.stock.tone]}`}
                                    >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                                        <span>
                                            {item.stock.label}
                                            {item.stock.detail && (
                                                <span className="block text-[8.5px] font-medium leading-3 opacity-80">
                                                    {item.stock.detail}
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between gap-3 text-[10.5px]">
                                    <span className="font-semibold text-[#3F3B47]">
                                        {formatRupiah(item.revenue)}
                                    </span>
                                    <span className="text-[#77727F]">
                                        {item.units}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-4 text-[10.5px]">
                <p className="text-[#77727F]">
                    Showing top {visibleItems.length} of 38 menu items in current
                    cycle
                </p>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={expanded}
                    className="inline-flex items-center gap-1 rounded font-semibold text-[#8D4B00] transition hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                >
                    {expanded
                        ? 'Collapse catalog view'
                        : 'Open Full Catalog Analytics'}
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
            </div>
        </section>
    );
}
