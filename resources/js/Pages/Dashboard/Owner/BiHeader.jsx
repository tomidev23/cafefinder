import { CalendarDays, ChevronDown, Download } from 'lucide-react';
import { branchOptions, rangeOptions } from '@/data/ownerDashboard';

export default function BiHeader({
    branch,
    onBranchChange,
    rangeId,
    onRangeChange,
    onOpenCustomRange,
    onExport,
    rangeLabel,
}) {
    return (
        <section
            id="business-intelligence"
            aria-labelledby="business-intelligence-title"
            className="scroll-mt-24 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3"
        >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-107.5">
                    <h1
                        id="business-intelligence-title"
                        className="text-[28px] font-bold leading-[1.15] tracking-[-0.04em] text-[#211D29] sm:text-[30px]"
                    >
                        Business
                        <br />
                        Intelligence
                    </h1>
                    <p className="mt-2 max-w-87.5 text-[13px] leading-5 text-[#6F6A78]">
                        Real-time throughput, beverage velocity, and consumer
                        cohort analytics
                    </p>
                </div>

                <div className="flex min-w-0 flex-col gap-3 xl:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex w-19.5 shrink-0 flex-col items-center justify-center rounded-full bg-[#FFE7D7] px-2 py-1.5 text-center text-[11px] font-semibold leading-4 text-[#8D4B00]">
                            <span>Pro</span>
                            <span>Merchant</span>
                        </span>

                        <div className="relative">
                            <label
                                htmlFor="owner-branch"
                                className="sr-only"
                            >
                                Branch
                            </label>
                            <select
                                id="owner-branch"
                                value={branch.id}
                                onChange={(event) =>
                                    onBranchChange(event.target.value)
                                }
                                className="h-9 max-w-60 appearance-none rounded-lg border border-[#DDE3F2] bg-[#F2F5FD] py-0 pl-3 pr-8 text-[12px] font-medium text-[#46424E] transition hover:border-[#C9D1E6] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                {branchOptions.map((option) => (
                                    <option
                                        key={option.id}
                                        value={option.id}
                                    >
                                        Branch: {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                aria-hidden="true"
                                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6F6A78]"
                            />
                        </div>

                        <div
                            role="group"
                            aria-label="Reporting period"
                            className="flex items-center rounded-lg border border-[#E1E5F0] bg-[#F3F5FC] p-0.5"
                        >
                            {rangeOptions.map((option) => {
                                const isActive = rangeId === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => {
                                            if (option.id === 'custom') {
                                                onOpenCustomRange();
                                                return;
                                            }

                                            onRangeChange(option.id);
                                        }}
                                        className={`inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-[11.5px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                            isActive
                                                ? 'bg-white text-[#211D29] shadow-sm'
                                                : 'text-[#77727F] hover:text-[#211D29]'
                                        }`}
                                    >
                                        {option.id === 'custom' && (
                                            <CalendarDays
                                                aria-hidden="true"
                                                className="h-3.5 w-3.5"
                                            />
                                        )}
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onExport}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#8D4B00] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 xl:self-end"
                    >
                        <Download aria-hidden="true" className="h-3.5 w-3.5" />
                        Export BI Report
                    </button>

                    {rangeId === 'custom' && (
                        <p className="text-[10.5px] font-medium text-[#77727F] xl:self-end">
                            Showing {rangeLabel}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
