import { usePage } from '@inertiajs/react';

export function useFrontendData() {
    return usePage().props ?? {};
}

export function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

export const formatRupiahValue = formatRupiah;

export function formatSettlementAmount(value) {
    return formatRupiah(value);
}

export function formatDateRange(range) {
    if (!range?.start || !range?.end) {
        return '';
    }

    return `${range.start} - ${range.end}`;
}

export function getRangeLabel(rangeId, customRange) {
    return rangeId === 'custom' ? formatDateRange(customRange) : rangeId;
}

export function countDays(range) {
    if (!range?.start || !range?.end) {
        return 0;
    }

    return Math.max(
        1,
        Math.ceil(
            (new Date(range.end) - new Date(range.start)) / 86400000,
        ) + 1,
    );
}

export function buildMetrics(branch = {}, rangeId, customRange) {
    return {
        revenue: branch.revenue ?? 0,
        orders: branch.orders ?? 0,
        seatsOccupied: branch.seatsOccupied ?? 0,
        seatsTotal: branch.seatsTotal ?? 0,
        rangeId,
        customRange,
    };
}
