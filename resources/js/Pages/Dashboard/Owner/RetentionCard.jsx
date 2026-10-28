import { CheckCircle2, Info, TrendingUp } from 'lucide-react';
import { formatSettlementAmount } from '@/data/ownerDashboard';

function LoyaltyRing({ value }) {
    const radius = 29;
    const circumference = 2 * Math.PI * radius;
    const dash = (value / 100) * circumference;

    return (
        <div className="relative h-[86px] w-[86px] shrink-0">
            <svg
                viewBox="0 0 80 80"
                role="img"
                aria-label={`${value}% repeat customer rate`}
                className="h-full w-full"
            >
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="#E3E9F8"
                    strokeWidth="5.5"
                />
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="#8D4B00"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    transform="rotate(-90 40 40)"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[#6F3A0E]">
                Loyal
            </span>
        </div>
    );
}

export default function RetentionCard({ branch, revenue }) {
    return (
        <section
            id="retention-settlements"
            aria-labelledby="retention-title"
            className="flex h-full min-w-0 scroll-mt-24 flex-col rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/[0.03]"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2
                        id="retention-title"
                        className="text-[17px] font-semibold tracking-[-0.02em] text-[#211D29]"
                    >
                        Retention &amp; Settlements
                    </h2>
                    <p className="sr-only">
                        Repeat customer share, loyalty movement, and settlement
                        mix for {branch.label}.
                    </p>
                </div>
                <span
                    title="Repeat rate counts guests with two or more visits in the selected period."
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#6F6A78]"
                >
                    <Info aria-hidden="true" className="h-4 w-4" />
                </span>
            </div>

            <div className="mt-4 rounded-xl bg-[#F2F6FF] p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[11.5px] font-medium text-[#4E4A57]">
                            Repeat Customer Rate
                        </p>
                        <p className="mt-1 text-[30px] font-bold leading-none tracking-[-0.04em] text-[#6F3A0E]">
                            {branch.repeatRate}%
                        </p>
                        <p className="mt-2 flex items-start gap-1 text-[10.5px] font-semibold text-[#0D7A5F]">
                            <TrendingUp
                                aria-hidden="true"
                                className="mt-0.5 h-3 w-3 shrink-0"
                            />
                            <span>
                                {branch.repeatDelta}
                                <span className="block font-medium leading-4 text-[#5F5B68]">
                                    loyalty
                                    <br />
                                    retention
                                </span>
                            </span>
                        </p>
                    </div>

                    <LoyaltyRing value={branch.repeatRate} />
                </div>
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6F6A78]">
                Settlement Methods
            </p>

            <div className="mt-3 space-y-3">
                {branch.settlements.map((method) => (
                    <div key={method.label}>
                        <div className="flex items-center justify-between gap-2">
                            <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-[#55515E]">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-[#8D4B00]" />
                                <span className="truncate">{method.label}</span>
                            </span>
                            <span className="shrink-0 text-[11px] font-bold text-[#3F3B47]">
                                {method.share}%{' '}
                                <span className="font-medium text-[#77727F]">
                                    ({formatSettlementAmount(revenue, method.share)})
                                </span>
                            </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EEF1F9]">
                            <div
                                className="h-full rounded-full bg-[#8D4B00]"
                                style={{ width: `${method.share}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-3.5 text-[10.5px]">
                <span className="text-[#77727F]">
                    Payout Cycle: {branch.payoutCycle}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#0D7A5F]">
                    <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                    {branch.payoutStatus}
                </span>
            </div>
        </section>
    );
}
