import { ArrowRight, Clock3, Laptop2 } from 'lucide-react';
import { hourLabels } from '@/data/ownerDashboard';

const morningBand = {
    center: 18.75,
    width: 13.5,
};

const coWorkingBand = {
    center: 56.25,
    width: 12.5,
};

export default function HourlyRushCard({
    branch,
    onOpenRoster,
    occupancy = 96,
}) {
    const values = [...branch.chart.foot, ...branch.chart.espresso];
    const maxValue = Math.max(...values);

    return (
        <section
            id="hourly-rush"
            aria-labelledby="hourly-rush-title"
            className="scroll-mt-24 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/[0.03]"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2
                        id="hourly-rush-title"
                        className="text-[17px] font-semibold tracking-[-0.02em] text-[#211D29]"
                    >
                        Hourly Rush Trend &amp; Dual Throughput
                    </h2>
                    <p className="mt-1 max-w-[430px] text-[12px] leading-4 text-[#77727F]">
                        Comparing physical foot traffic vs espresso bar output
                        per hour
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-4 pt-0.5">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#8D4B00]" />
                        <span className="text-[10px] font-medium leading-3 text-[#55515E]">
                            Espresso
                            <br />
                            Cups
                        </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#F3C9B8]" />
                        <span className="text-[10px] font-medium leading-3 text-[#55515E]">
                            Foot
                            <br />
                            Traffic
                        </span>
                    </span>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FDF1E7] px-2.5 py-1.5 text-[10px] font-medium leading-4 text-[#7A4A22]">
                    <Clock3 aria-hidden="true" className="h-3 w-3" />
                    Morning Rush: 08:30 – 09:30 (Takeaway Peak)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EAF8F1] px-2.5 py-1.5 text-[10px] font-medium leading-4 text-[#0B6B4A]">
                    <Laptop2 aria-hidden="true" className="h-3 w-3" />
                    Co-working Block: 14:00 – 16:30 ({occupancy}% Seated
                    Occupancy)
                </span>
            </div>

            <div className="relative mt-5 pt-6">
                <div className="relative h-[210px] sm:h-[232px]">
                    <span
                        aria-hidden="true"
                        className="absolute bottom-0 top-0 rounded-lg bg-[#FDF5ED]"
                        style={{
                            left: `${morningBand.center}%`,
                            width: `${morningBand.width}%`,
                            transform: 'translateX(-50%)',
                        }}
                    />
                    <span
                        aria-hidden="true"
                        className="absolute bottom-0 top-0 rounded-lg bg-[#EAF9F0]"
                        style={{
                            left: `${coWorkingBand.center}%`,
                            width: `${coWorkingBand.width}%`,
                            transform: 'translateX(-50%)',
                        }}
                    />

                    <span
                        className="absolute -top-7 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#8D4B00] px-2 py-1 text-[9px] font-semibold leading-none text-white"
                        style={{ left: `${morningBand.center}%` }}
                    >
                        Rush Peak
                    </span>
                    <span
                        className="absolute -top-7 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0D7A5F] px-2 py-1 text-[9px] font-semibold leading-none text-white"
                        style={{ left: `${coWorkingBand.center}%` }}
                    >
                        {occupancy}% Occupied
                    </span>

                    <div
                        role="img"
                        aria-label="Dual bar chart of espresso cups and foot traffic across eight time slots, peaking at 08:30."
                        className="absolute inset-0 flex items-end justify-between gap-1 border-b border-[#F1F0F5]"
                    >
                        {hourLabels.map((label, index) => {
                            const foot = branch.chart.foot[index];
                            const espresso = branch.chart.espresso[index];

                            return (
                                <div
                                    key={label}
                                    className="flex h-full flex-1 items-end justify-center gap-[5px]"
                                >
                                    <span
                                        title={`${label} · Foot traffic ${foot}`}
                                        className="w-[10px] rounded-t-[3px] bg-[#F3C9B8] transition-colors hover:bg-[#F0BCA6] sm:w-[11px]"
                                        style={{
                                            height: `${Math.max(
                                                6,
                                                (foot / maxValue) * 100,
                                            )}%`,
                                        }}
                                    />
                                    <span
                                        title={`${label} · Espresso ${espresso} cups`}
                                        className="w-[10px] rounded-t-[3px] bg-[#8D4B00] transition-colors hover:bg-[#743D00] sm:w-[11px]"
                                        style={{
                                            height: `${Math.max(
                                                6,
                                                (espresso / maxValue) * 100,
                                            )}%`,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-8">
                    {hourLabels.map((label, index) => (
                        <span
                            key={label}
                            className={`text-center text-[10px] font-medium ${
                                index === 1
                                    ? 'font-semibold text-[#8D4B00]'
                                    : index === 4
                                      ? 'font-semibold text-[#0D7A5F]'
                                      : 'text-[#77727F]'
                            }`}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                <div className="sr-only overflow-hidden">
                    <table>
                        <caption>
                            Hourly espresso cups and foot traffic for{' '}
                            {branch.label}
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Time</th>
                                <th scope="col">Foot traffic</th>
                                <th scope="col">Espresso cups</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hourLabels.map((label, index) => (
                                <tr key={label}>
                                    <th scope="row">{label}</th>
                                    <td>{branch.chart.foot[index]}</td>
                                    <td>{branch.chart.espresso[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-[#F0EFF4] pt-3.5 text-[11px] sm:flex-row sm:items-center sm:justify-between">
                <p className="leading-4 text-[#77727F]">
                    Staffing recommendation:{' '}
                    <span className="font-semibold text-[#3F3B47]">
                        +1 barista
                    </span>{' '}
                    required during 08:00–10:00 shift
                </p>
                <button
                    type="button"
                    onClick={onOpenRoster}
                    className="inline-flex shrink-0 items-center gap-1 self-start rounded text-[11px] font-semibold text-[#8D4B00] transition hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] sm:self-auto"
                >
                    View Roster Sync
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
            </div>
        </section>
    );
}
