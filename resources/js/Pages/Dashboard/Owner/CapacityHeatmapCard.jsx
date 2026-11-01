import { Fragment } from 'react';
import { Grid3X3, Lightbulb } from 'lucide-react';

const hourColumns = ['08:00', '11:00', '14:00', '17:00', '20:00'];

const swatches = ['#E8EDFC', '#FBE8DB', '#F6D3C0', '#F1BEA5'];

const cellTone = (value) => {
    if (value >= 90) {
        return 'bg-[#8D4B00] text-white';
    }

    if (value >= 80) {
        return 'bg-[#F4CEB8] text-[#6F3A0E]';
    }

    if (value >= 65) {
        return 'bg-[#FBE3D4] text-[#6F3A0E]';
    }

    if (value >= 45) {
        return 'bg-[#FDF2E9] text-[#8A7C70]';
    }

    return 'bg-[#E9EEFC] text-[#7E8497]';
};

export default function CapacityHeatmapCard({ branch }) {
    return (
        <section
            id="store-capacity-heatmap"
            aria-labelledby="capacity-heatmap-title"
            className="flex h-full min-w-0 scroll-mt-24 flex-col rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/[0.03]"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2
                        id="capacity-heatmap-title"
                        className="whitespace-nowrap text-[16.5px] font-semibold tracking-[-0.02em] text-[#211D29]"
                    >
                        Store Capacity Heatmap
                    </h2>
                    <p className="mt-1 max-w-[230px] text-[12px] leading-4 text-[#77727F]">
                        Hourly seat occupancy &amp; remote work density
                    </p>
                </div>
                <Grid3X3
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#6F6A78]"
                />
            </div>

            <div className="mt-5 grid grid-cols-[42px_repeat(5,minmax(0,1fr))] items-center gap-1.5">
                <span aria-hidden="true" />
                {hourColumns.map((hour) => (
                    <span
                        key={hour}
                        className="text-center text-[9.5px] font-medium text-[#6F6A78]"
                    >
                        {hour}
                    </span>
                ))}

                {branch.heatmap.map((row) => (
                    <Fragment key={row.day}>
                        <span
                            className={`text-[10px] ${
                                row.weekend
                                    ? 'font-semibold text-[#231F2B]'
                                    : 'font-medium text-[#55515E]'
                            }`}
                        >
                            {row.day}
                        </span>
                        {row.cells.map((value, index) => (
                            <div
                                key={`${row.day}-${hourColumns[index]}`}
                                role="img"
                                title={`${row.day} ${hourColumns[index]} · ${value}% occupied${
                                    value >= 90 ? ' · waitlist likely' : ''
                                }`}
                                aria-label={`${row.day} at ${hourColumns[index]}: ${value}% seat occupancy`}
                                className={`flex h-7 items-center justify-center rounded-[5px] text-[9px] font-semibold ${cellTone(
                                    value,
                                )}`}
                            >
                                {!row.weekend && value >= 90 ? `${value}%` : ''}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[9.5px] text-[#55515E]">
                <span className="font-medium">Low (Quiet)</span>
                <span className="flex gap-1">
                    {swatches.map((color) => (
                        <span
                            key={color}
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-[3px]"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </span>
                <span className="ml-1 font-medium">Peak (Waitlist)</span>
                <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-[3px] bg-[#8D4B00]"
                />
            </div>

            <div className="mt-auto pt-4">
                <div className="flex items-start gap-2.5 rounded-xl border border-[#F3E3D6] bg-[#FDF7F0] p-3.5 text-[10.5px] leading-4 text-[#5A4638]">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F7E8D8] text-[#8D4B00]">
                        <Lightbulb aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                    <p>
                        Peak co-working slots: 14:00 - 16:30. Minimum spend rule
                        activated for laptop sockets.
                    </p>
                </div>
            </div>
        </section>
    );
}
