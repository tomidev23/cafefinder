import {
    Banknote,
    Crown,
    ReceiptText,
    RefreshCcw,
    ShoppingBag,
    ThumbsUp,
    TrendingUp,
} from 'lucide-react';
import {
    formatRupiahValue,
    sparklineBars,
} from '@/data/ownerDashboard';

function Sparkline() {
    const max = Math.max(...sparklineBars);

    return (
        <div
            aria-hidden="true"
            className="ml-auto flex h-6 items-end gap-[3px]"
        >
            {sparklineBars.map((value, index) => (
                <span
                    key={`${value}-${index}`}
                    className={`w-[3px] rounded-t-[1px] ${
                        index === sparklineBars.length - 1
                            ? 'bg-[#8D4B00]'
                            : 'bg-[#EAD6C5]'
                    }`}
                    style={{ height: `${Math.round((value / max) * 24)}px` }}
                />
            ))}
        </div>
    );
}

export default function StatCards({ metrics, branch }) {
    return (
        <section
            aria-label="Key performance indicators"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
            <article className="flex min-h-[178px] flex-col rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/[0.03] sm:p-5">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="whitespace-nowrap text-[12.5px] font-medium text-[#5F5B68]">
                        Total Revenue
                    </h2>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FDE7D9] text-[#B96B2C]">
                        <Banknote aria-hidden="true" className="h-4 w-4" />
                    </span>
                </div>
                <div className="mt-3 text-[24px] font-bold leading-[1.22] tracking-[-0.035em] text-[#211D29]">
                    <span className="block">Rp</span>
                    <span className="block">
                        {formatRupiahValue(metrics.revenue)}
                    </span>
                </div>
                <div className="mt-auto flex items-center gap-1.5 border-t border-[#F0EFF4] pt-3 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-semibold text-[#0D7A5F]">
                        <TrendingUp
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                        {metrics.change}
                    </span>
                    <span className="text-[#6F6A78]">
                        {metrics.changeContext}
                    </span>
                    <Sparkline />
                </div>
            </article>

            <article className="flex min-h-[178px] flex-col rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/[0.03] sm:p-5">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="whitespace-nowrap text-[12.5px] font-medium text-[#5F5B68]">
                        Total Orders
                    </h2>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFE4E1] text-[#B65B4A]">
                        <ReceiptText aria-hidden="true" className="h-4 w-4" />
                    </span>
                </div>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                    <span className="text-[24px] font-bold leading-[1.25] tracking-[-0.035em] text-[#211D29]">
                        {metrics.orders}
                    </span>
                    <span className="text-[14px] font-semibold text-[#211D29]">
                        orders
                    </span>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-[#F0EFF4] pt-3 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0D7A5F]">
                        <RefreshCcw
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                        {metrics.pace} orders/hr
                    </span>
                    <span className="text-[#6F6A78]">pace</span>
                    <span className="ml-auto rounded-full bg-[#CFF8E3] px-2 py-1 text-[10px] font-bold leading-none text-[#0B6B4A]">
                        +8.7%
                    </span>
                </div>
            </article>

            <article className="flex min-h-[178px] flex-col rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/[0.03] sm:p-5">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="whitespace-nowrap text-[12.5px] font-medium text-[#5F5B68]">
                        Average Ticket Size
                    </h2>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECE9FF] text-[#6D5BC7]">
                        <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                    </span>
                </div>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-[24px] font-bold leading-[1.25] tracking-[-0.035em] text-[#211D29]">
                        Rp
                    </span>
                    <span className="text-[24px] font-bold leading-[1.25] tracking-[-0.035em] text-[#211D29]">
                        {formatRupiahValue(metrics.average)}
                    </span>
                </div>
                <div className="mt-auto flex items-center gap-2 border-t border-[#F0EFF4] pt-3">
                    <span className="shrink-0 rounded-md bg-[#FFE7D9] px-2 py-1 text-center text-[9.5px] font-semibold leading-3 text-[#8D4B00]">
                        Pastry
                        <br />
                        Bundles
                    </span>
                    <span className="min-w-0 text-[10.5px] leading-3.5">
                        <span className="block whitespace-nowrap font-semibold text-[#8D4B00]">
                            {metrics.upsell}
                        </span>
                        <span className="block text-[#6F6A78]">
                            upsell uplift
                        </span>
                    </span>
                </div>
            </article>

            <article className="flex min-h-[178px] flex-col rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/[0.03] sm:p-5">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="whitespace-nowrap text-[12.5px] font-medium text-[#5F5B68]">
                        Customer Satisfaction
                    </h2>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D3F8EA] text-[#118866]">
                        <ThumbsUp aria-hidden="true" className="h-4 w-4" />
                    </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[24px] font-bold leading-[1.25] tracking-[-0.035em] text-[#211D29]">
                        {metrics.satisfaction}
                    </span>
                    <span className="text-[12px] font-medium text-[#77727F]">
                        / 5.0
                    </span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#F0EFF4] pt-3 text-[11px]">
                    <span>
                        <span className="font-semibold text-[#0D7A5F]">
                            {metrics.positive}
                        </span>{' '}
                        <span className="text-[#6F6A78]">positive</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold leading-4 text-[#4A4552]">
                        <Crown
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#B67932]"
                        />
                        <span>
                            {metrics.rank}
                            <span className="block text-[9.5px] font-medium text-[#6F6A78]">
                                {branch.area}
                            </span>
                        </span>
                    </span>
                </div>
            </article>
        </section>
    );
}
