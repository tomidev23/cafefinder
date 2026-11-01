import {
    Armchair,
    CalendarClock,
    Printer,
} from 'lucide-react';

const operationalTabs = [
    {
        id: 'tables',
        label: 'Denah & Meja QRIS',
        badge: '14 Unit',
        icon: Armchair,
    },
    {
        id: 'schedule',
        label: 'Jadwal & Shift Barista',
        badge: '3 Aktif',
        icon: CalendarClock,
    },
    {
        id: 'devices',
        label: 'Perangkat Kasir & Printer',
        badge: '4 Terhubung',
        icon: Printer,
    },
];

export function OwnerTabs({ items, active, onSelect, className = '' }) {
    return (
        <div
            role="tablist"
            aria-label="Operasional gerai"
            className={`flex flex-wrap gap-x-3 gap-y-0.5 pt-2 ${className}`}
        >
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === active;

                return (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onSelect(item.id)}
                        className={`relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-[11.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                            isActive
                                ? 'border-[#8D4B00] font-semibold text-[#6F3A0E]'
                                : 'border-transparent text-[#6F6A78] hover:text-[#231F2B]'
                        }`}
                    >
                        {Icon && (
                            <Icon
                                aria-hidden="true"
                                className={`h-3.5 w-3.5 ${
                                    isActive
                                        ? 'text-[#8D4B00]'
                                        : 'text-[#8B8694]'
                                }`}
                            />
                        )}
                        {item.label}
                        {item.badge && (
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                                    isActive
                                        ? 'bg-[#FFE7D7] text-[#8D4B00]'
                                        : 'bg-[#F1F1F6] text-[#6F6A78]'
                                }`}
                            >
                                {item.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default function OwnerOperationalTabs({ active, onNavigate }) {
    return (
        <OwnerTabs
            items={operationalTabs}
            active={active}
            onSelect={onNavigate}
        />
    );
}
