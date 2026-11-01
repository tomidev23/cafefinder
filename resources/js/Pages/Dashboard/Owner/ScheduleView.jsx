import { useState } from 'react';
import {
    ArrowLeftRight,
    Award,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Download,
    Gauge,
    Plus,
    RefreshCw,
    Sparkles,
    Star,
    ThumbsUp,
    Timer,
    Users,
} from 'lucide-react';
import OwnerButton from '@/Components/Owner/OwnerButton';
import OwnerModal from '@/Components/Owner/OwnerModal';
import OwnerOperationalTabs from '@/Components/Owner/OwnerTabs';
import OwnerPageHeader from '@/Components/Owner/OwnerPageHeader';
import {
    baristaOfMonth,
    performanceStaff,
    rosterStaff,
    scheduleDays,
    scheduleKpis,
} from '@/data/ownerOperations';

const shiftToneClasses = {
    pagi: 'bg-[#EAF1FF] text-[#36527E]',
    sore: 'bg-[#EEF0FA] text-[#4E5570]',
    'pagi-overtime': 'bg-[#EAF1FF] text-[#36527E]',
    'sore-overtime': 'bg-[#EEF0FA] text-[#4E5570]',
    izin: 'bg-[#FDE8EC] text-[#B4234A]',
    off: 'bg-transparent text-[#8B8694] italic',
};

const shiftPresets = {
    pagi: { label: 'Pagi (07–15)', tone: 'pagi' },
    sore: { label: 'Sore (15–23)', tone: 'sore' },
    libur: { label: 'Libur (OFF)', tone: 'off' },
    izin: { label: 'Izin / Cuti', tone: 'izin' },
};

const roleOptions = [
    'Semua Peran & Stasiun',
    'Barista',
    'Senior Brewer',
    'Cashier & Floor',
    'Head Barista',
];

const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
});

export default function ScheduleView({ notify, onNavigate }) {
    const [weekOffset, setWeekOffset] = useState(0);
    const [roleFilter, setRoleFilter] = useState(roleOptions[0]);
    const [roster, setRoster] = useState(rosterStaff);
    const [swapOpen, setSwapOpen] = useState(false);
    const [shiftOpen, setShiftOpen] = useState(false);
    const [swapDraft, setSwapDraft] = useState({
        firstId: 'bimo',
        secondId: 'siti',
        dayIndex: 2,
    });
    const [shiftDraft, setShiftDraft] = useState({
        staffId: 'bimo',
        dayIndex: 2,
        type: 'pagi',
    });

    const weekStart = new Date(2024, 10, 18);
    weekStart.setDate(weekStart.getDate() + weekOffset * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const periodLabel = `${dateFormatter.format(weekStart)} – ${dateFormatter.format(weekEnd)} ${weekEnd.getFullYear()}`;

    const days = scheduleDays.map((day, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);

        return {
            ...day,
            date: String(date.getDate()),
            label: `${day.short} (${date.getDate()})${weekOffset === 0 && day.isToday ? ' • Hari Ini' : ''}`,
            isToday: weekOffset === 0 && day.isToday,
        };
    });

    const filteredRoster =
        roleFilter === 'Semua Peran & Stasiun'
            ? roster
            : roster.filter((staff) =>
                  staff.role.toLowerCase().includes(roleFilter.toLowerCase()),
              );

    const displayTone = (shift) => {
        if (weekOffset !== 0 && shift.tone === 'today') {
            return shift.label.startsWith('Pagi') ? 'pagi' : 'sore';
        }

        return shift.tone;
    };

    const swapShifts = (event) => {
        event.preventDefault();

        if (swapDraft.firstId === swapDraft.secondId) {
            notify('Pilih dua staf yang berbeda untuk tukar shift.');
            return;
        }

        setRoster((currentRoster) => {
            const nextRoster = currentRoster.map((staff) => ({
                ...staff,
                shifts: [...staff.shifts],
            }));
            const first = nextRoster.find(
                (staff) => staff.id === swapDraft.firstId,
            );
            const second = nextRoster.find(
                (staff) => staff.id === swapDraft.secondId,
            );

            if (!first || !second) {
                return currentRoster;
            }

            const firstShift = first.shifts[swapDraft.dayIndex];
            first.shifts[swapDraft.dayIndex] =
                second.shifts[swapDraft.dayIndex];
            second.shifts[swapDraft.dayIndex] = firstShift;

            return nextRoster;
        });
        setSwapOpen(false);
        notify('Jadwal shift berhasil ditukar.');
    };

    const applyShift = (event) => {
        event.preventDefault();
        const preset = shiftPresets[shiftDraft.type];

        setRoster((currentRoster) =>
            currentRoster.map((staff) => {
                if (staff.id !== shiftDraft.staffId) {
                    return staff;
                }

                const shifts = [...staff.shifts];
                shifts[shiftDraft.dayIndex] = {
                    ...preset,
                    note:
                        shiftDraft.type === 'pagi' ||
                        shiftDraft.type === 'sore'
                            ? 'Dijadwalkan'
                            : undefined,
                };

                return { ...staff, shifts };
            }),
        );
        setShiftOpen(false);
        notify(
            `Shift ${shiftPresets[shiftDraft.type].label} disimpan untuk ${periodLabel}.`,
        );
    };

    const printRoster = () => {
        const reportWindow = window.open('', '_blank', 'width=980,height=720');

        if (!reportWindow) {
            notify('Izinkan pop-up untuk mengunduh roster PDF.');
            return;
        }

        const rows = roster
            .map(
                (staff) => `
                    <tr>
                        <td>${escapeHtml(staff.name)}<br><small>${escapeHtml(staff.role)}</small></td>
                        ${staff.shifts
                            .map(
                                (shift) =>
                                    `<td>${escapeHtml(shift.label)}</td>`,
                            )
                            .join('')}
                        <td>${escapeHtml(staff.totalHours)}</td>
                    </tr>`,
            )
            .join('');

        reportWindow.document.write(`
            <!doctype html>
            <html lang="id">
                <head>
                    <meta charset="utf-8" />
                    <title>Roster Mingguan — Artisan Roastery</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #231f2b; padding: 32px; }
                        h1 { font-size: 24px; margin-bottom: 4px; }
                        p { color: #6f6a78; }
                        table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 11px; }
                        th, td { border: 1px solid #e5e3ea; padding: 8px; text-align: left; vertical-align: top; }
                        th { background: #f7f8fd; }
                        small { color: #6f6a78; }
                    </style>
                </head>
                <body>
                    <h1>Roster Mingguan Staf Barista</h1>
                    <p>Artisan Roastery · Senopati Flagship · ${escapeHtml(periodLabel)}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Staf &amp; Peran</th>
                                ${days.map((day) => `<th>${escapeHtml(day.label)}</th>`).join('')}
                                <th>Total Jam</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </body>
            </html>
        `);
        reportWindow.document.close();
        reportWindow.focus();
        reportWindow.print();
    };

    return (
        <div className="space-y-5">
            <OwnerPageHeader
                eyebrow="Operasional Gerai / Manajemen Shift & Tim"
                title="Jadwal & Manajemen Staf Barista"
                description="Pantau rotasi brewing station, pergantian shift kasir, dan produktivitas tim secara real-time."
                actions={
                    <>
                        <OwnerButton
                            variant="secondary"
                            icon={Download}
                            onClick={printRoster}
                        >
                            Unduh Roster PDF
                        </OwnerButton>
                        <OwnerButton
                            variant="secondary"
                            icon={ArrowLeftRight}
                            onClick={() => setSwapOpen(true)}
                        >
                            Tukar Jadwal (Shift Swap)
                        </OwnerButton>
                        <OwnerButton
                            variant="primary"
                            icon={Plus}
                            onClick={() => setShiftOpen(true)}
                        >
                            Atur Shift Baru
                        </OwnerButton>
                    </>
                }
            >
                <OwnerOperationalTabs
                    active="schedule"
                    onNavigate={onNavigate}
                />
            </OwnerPageHeader>

            <section
                aria-label="Ringkasan shift"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Total Barista Bertugas
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8EDFF] text-[#5D6B96]">
                            <Users aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-[27px] font-bold tracking-[-0.04em] text-[#211D29]">
                            {scheduleKpis.baristasOnDuty}
                        </span>
                        <span className="text-[11.5px] text-[#6F6A78]">
                            / {scheduleKpis.baristasTotal} Orang Tim
                        </span>
                    </div>
                    <p className="mt-auto flex items-center gap-1 border-t border-[#F0EFF4] pt-3 text-[10px] font-semibold text-[#0D7A5F]">
                        <CheckCircle2
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                        100% Sesuai Roster Pagi
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Status Shift Gerai
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0DA] text-[#9A6218]">
                            <Clock3 aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-2.5 space-y-1.5 text-[9.5px]">
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-[#F4F8FF] px-2 py-1.5">
                            <span className="text-[#55515E]">
                                Pagi (07:00 – 15:00)
                            </span>
                            <span className="rounded-full bg-[#D6FBEB] px-1.5 py-0.5 text-[8px] font-semibold text-[#0D7A5F]">
                                {scheduleKpis.shiftStatus.morning}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-[#F7F7FC] px-2 py-1.5">
                            <span className="text-[#55515E]">
                                Sore (15:00 – 23:00)
                            </span>
                            <span className="rounded-full bg-[#EFF4FF] px-1.5 py-0.5 text-[8px] font-semibold text-[#4C5B8A]">
                                {scheduleKpis.shiftStatus.evening}
                            </span>
                        </div>
                    </div>
                    <p className="mt-auto border-t border-[#F0EFF4] pt-2.5 text-[8.5px] text-[#6F6A78]">
                        Roster mingguan • {periodLabel}
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Rata-rata Speed of Service
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDE8EC] text-[#B4234A]">
                            <Timer aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-[27px] font-bold tracking-[-0.04em] text-[#211D29]">
                            {scheduleKpis.speed}
                        </span>
                        <span className="text-[11.5px] text-[#6F6A78]">
                            menit / pesanan
                        </span>
                    </div>
                    <p className="mt-auto flex items-center gap-1 border-t border-[#F0EFF4] pt-3 text-[9.5px] text-[#6F6A78]">
                        <Sparkles
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#0D7A5F]"
                        />
                        {scheduleKpis.speedDelta}
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Status Handover Sore
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDE8EC] text-[#B4234A]">
                            <Gauge aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-3 text-[16px] font-bold tracking-[-0.02em] text-[#211D29]">
                        Jadwal: {scheduleKpis.handover}
                    </p>
                    <p className="mt-1 text-[9px] leading-4 text-[#6F6A78]">
                        Checklist sisa sirup, steam wand purge, &amp; kas
                        tunai laci kasir.
                    </p>
                    <p className="mt-auto flex items-center gap-1 border-t border-[#F0EFF4] pt-3 text-[9px] font-semibold text-[#0D7A5F]">
                        <CheckCircle2
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                        Siap handover
                    </p>
                </article>
            </section>

            <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2F6FF] text-[#5D6B96]">
                            <CalendarDays
                                aria-hidden="true"
                                className="h-4 w-4"
                            />
                        </span>
                        <div>
                            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                                Roster Mingguan Staf Barista
                            </h2>
                            <p className="mt-0.5 text-[9.5px] text-[#6F6A78]">
                                Periode: {periodLabel} • Shift Station Bar &amp;
                                Floor
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-[#E2E5EF] bg-white p-0.5">
                            <button
                                type="button"
                                aria-label="Minggu sebelumnya"
                                onClick={() =>
                                    setWeekOffset((current) => current - 1)
                                }
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6F6A78] hover:bg-[#F5F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                <ChevronLeft
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                />
                            </button>
                            <span className="px-2 text-[9.5px] font-semibold text-[#3F3B47]">
                                {weekOffset === 0
                                    ? 'Minggu Ini (W47)'
                                    : weekOffset < 0
                                      ? `Minggu Lalu (W${47 + weekOffset})`
                                      : `Minggu Depan (W${47 + weekOffset})`}
                            </span>
                            <button
                                type="button"
                                aria-label="Minggu berikutnya"
                                onClick={() =>
                                    setWeekOffset((current) => current + 1)
                                }
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6F6A78] hover:bg-[#F5F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                <ChevronRight
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                />
                            </button>
                        </div>

                        <label className="sr-only" htmlFor="schedule-role-filter">
                            Filter peran
                        </label>
                        <select
                            id="schedule-role-filter"
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(event.target.value)
                            }
                            className="h-8 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9.5px] font-medium text-[#4A4552] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                        >
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <p className="mt-3 text-[9px] text-[#6F6A78] sm:hidden">
                    Geser tabel untuk melihat seluruh hari dan total jam.
                </p>
                <div
                    tabIndex={0}
                    role="region"
                    aria-label="Tabel roster mingguan staf barista"
                    className="mt-2 overflow-x-auto sm:mt-4"
                >
                    <table className="w-full min-w-[820px] table-fixed border-collapse text-left">
                        <colgroup>
                            <col className="w-[145px]" />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col className="w-[62px]" />
                        </colgroup>
                        <caption className="sr-only">
                            Roster mingguan staf barista dengan shift harian
                            dan total jam
                        </caption>
                        <thead>
                            <tr className="border-b border-[#F0EFF4] text-[9px] text-[#6F6A78]">
                                <th className="pb-2.5 pl-0 pr-3 font-medium">
                                    Staf &amp; Peran
                                </th>
                                {days.map((day) => (
                                    <th
                                        key={day.short}
                                        className={`px-2 pb-2.5 text-center font-medium ${
                                            day.isToday
                                                ? 'rounded-t-md bg-[#FFF1E5] font-semibold text-[#8D4B00]'
                                                : ''
                                        }`}
                                    >
                                        {day.label}
                                    </th>
                                ))}
                                <th className="pb-2.5 pl-2 pr-0 text-right font-medium">
                                    Total Jam
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoster.map((staff) => (
                                <tr
                                    key={staff.id}
                                    className="border-b border-[#F4F3F7] last:border-0"
                                >
                                    <td className="py-2.5 pl-0 pr-3 align-middle">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                                                    staff.avatarTone === 'peach'
                                                        ? 'bg-[#FFE7D7] text-[#8D4B00]'
                                                        : 'bg-[#E8EDFF] text-[#5D6B96]'
                                                }`}
                                            >
                                                {staff.initials}
                                            </span>
                                            <span>
                                                <span className="block text-[10px] font-semibold text-[#292632]">
                                                    {staff.name}
                                                </span>
                                                <span className="block text-[8px] text-[#6F6A78]">
                                                    {staff.role}
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    {staff.shifts.map((shift, index) => {
                                        const tone = displayTone(shift);
                                        const isToday =
                                            weekOffset === 0 &&
                                            shift.tone === 'today';

                                        return (
                                            <td
                                                key={`${staff.id}-${index}`}
                                                className="px-1.5 py-2 align-middle"
                                            >
                                                <span
                                                    className={`block rounded-md px-1.5 py-1 text-center text-[8px] font-medium ${
                                                        isToday
                                                            ? 'bg-[#8D4B00] text-white'
                                                            : shiftToneClasses[
                                                                  tone
                                                              ] ??
                                                              shiftToneClasses.pagi
                                                    }`}
                                                >
                                                    {shift.label}
                                                    {shift.note && isToday && (
                                                        <span
                                                            className={`mt-0.5 block text-[7px] font-normal ${
                                                                shift.note.includes(
                                                                    'Hadir',
                                                                )
                                                                    ? 'text-[#CFF8E3]'
                                                                    : 'text-white/70'
                                                            }`}
                                                        >
                                                            {shift.note}
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                        );
                                    })}
                                    <td className="py-2.5 pl-2 pr-0 text-right align-middle">
                                        <span className="block text-[9.5px] font-semibold text-[#3F3B47]">
                                            {staff.totalHours}
                                        </span>
                                        {staff.overtime && (
                                            <span className="block text-[7.5px] text-[#6F6A78]">
                                                {staff.overtime}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRoster.length === 0 && (
                    <p className="mt-4 rounded-lg bg-[#F7F8FD] px-3 py-6 text-center text-[10px] text-[#6F6A78]">
                        Tidak ada staf dengan peran tersebut pada minggu ini.
                    </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#F0EFF4] pt-3 text-[8px] text-[#6F6A78]">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#8D4B00]" />
                        Shift Pagi Aktif
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#4E5570]" />
                        Shift Sore Standby
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#F2B884]" />
                        Jam Lembur (+OT)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#F4B8C7]" />
                        Izin / Cuti Medis
                    </span>
                    <span className="ml-auto flex items-center gap-1.5">
                        <RefreshCw
                            aria-hidden="true"
                            className="h-3 w-3 text-[#0D7A5F]"
                        />
                        Sinkronisasi otomatis dengan mesin absensi Biometrik
                        &amp; CafeFinder Merchant POS.
                    </span>
                </div>
            </section>

            <section>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                            Evaluasi Performa &amp; Insentif Seduh Hari Ini
                        </h2>
                        <p className="mt-0.5 text-[9.5px] text-[#6F6A78]">
                            Output mesin espresso, bar manual brew V60/Aeropress,
                            dan feedback pelanggan.
                        </p>
                    </div>
                    <span className="rounded-md bg-[#F4F3F8] px-2 py-1 text-[8.5px] text-[#6F6A78]">
                        Update: 14:15 WIB
                    </span>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {performanceStaff.map((staff) => (
                            <article
                                key={staff.id}
                                className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3"
                            >
                                <div className="flex items-start gap-2.5">
                                    <span
                                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                            staff.avatarTone === 'peach'
                                                ? 'bg-[#FFE7D7] text-[#8D4B00]'
                                                : 'bg-[#E8EDFF] text-[#5D6B96]'
                                        }`}
                                    >
                                        {staff.initials}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-1">
                                            <h3 className="text-[12px] font-semibold text-[#231F2B]">
                                                {staff.name}
                                            </h3>
                                            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#3F3B47]">
                                                <Star
                                                    aria-hidden="true"
                                                    className="h-3 w-3 fill-[#B67932] text-[#B67932]"
                                                />
                                                {staff.rating}{' '}
                                                <span className="font-normal text-[#6F6A78]">
                                                    ({staff.reviewCount})
                                                </span>
                                            </span>
                                        </div>
                                        <p className="text-[8.5px] text-[#6F6A78]">
                                            {staff.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="rounded-lg bg-[#F5F8FF] p-2 text-center">
                                        <p className="text-[7.5px] font-medium text-[#6F6A78]">
                                            Espresso Base
                                        </p>
                                        <p className="mt-0.5 text-[20px] font-bold text-[#3F3B47]">
                                            {staff.espresso}
                                        </p>
                                        <p className="text-[7.5px] text-[#6F6A78]">
                                            {staff.espressoLabel}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-[#F5F8FF] p-2 text-center">
                                        <p className="text-[7.5px] font-medium text-[#6F6A78]">
                                            Manual Brew (Filter)
                                        </p>
                                        <p className="mt-0.5 text-[20px] font-bold text-[#3F3B47]">
                                            {staff.manual}
                                        </p>
                                        <p className="text-[7.5px] text-[#6F6A78]">
                                            {staff.manualLabel}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-2.5 text-[8.5px]">
                                    <span className="flex items-center gap-1 italic text-[#6F6A78]">
                                        <ThumbsUp
                                            aria-hidden="true"
                                            className="h-3 w-3 text-[#0D7A5F]"
                                        />
                                        {staff.quote}
                                    </span>
                                    <span className="font-semibold text-[#6F3A0E]">
                                        Insentif: {staff.incentive}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>

                    <article className="relative overflow-hidden rounded-2xl border border-[#E7E2D9] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                        <span
                            aria-hidden="true"
                            className="absolute inset-x-0 top-0 h-1 bg-[#8D4B00]"
                        />
                        <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3E7] px-2 py-1 text-[8px] font-semibold text-[#8D4B00]">
                                <Award
                                    aria-hidden="true"
                                    className="h-3 w-3"
                                />
                                Barista of the Month
                            </span>
                            <span className="text-[8px] text-[#6F6A78]">
                                November 2024
                            </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2.5">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FFE7D7] text-[12px] font-bold text-[#8D4B00]">
                                {baristaOfMonth.initials}
                            </span>
                            <div>
                                <h3 className="text-[13px] font-semibold text-[#231F2B]">
                                    {baristaOfMonth.name}
                                </h3>
                                <p className="text-[8.5px] text-[#6F6A78]">
                                    {baristaOfMonth.role}
                                </p>
                                <p className="mt-0.5 inline-flex items-center gap-1 text-[8px] font-medium text-[#0D7A5F]">
                                    <CheckCircle2
                                        aria-hidden="true"
                                        className="h-3 w-3"
                                    />
                                    {baristaOfMonth.consistency}
                                </p>
                            </div>
                        </div>
                        <p className="mt-3 rounded-lg bg-[#F4F7FF] p-2.5 text-[8.5px] italic leading-4 text-[#55515E]">
                            {baristaOfMonth.quote}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-[#FFF8F0] px-2.5 py-2">
                            <span className="text-[8px] font-medium text-[#6F6A78]">
                                Bonus Target Tercapai:
                            </span>
                            <span className="text-[9px] font-bold text-[#8D4B00]">
                                {baristaOfMonth.bonus}
                            </span>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-2 border-t border-[#F0EFF4] pt-2.5">
                            <span className="text-[8px] leading-3 text-[#6F6A78]">
                                Total Digital QRIS Tip Pool (Hari Ini):
                            </span>
                            <span className="text-[12px] font-bold text-[#6F3A0E]">
                                {baristaOfMonth.tipPool}
                            </span>
                        </div>
                    </article>
                </div>
            </section>

            <OwnerModal
                show={swapOpen}
                onClose={() => setSwapOpen(false)}
                title="Tukar Jadwal (Shift Swap)"
                description="Pilih dua staf dan hari shift yang ingin ditukar."
                maxWidth="md"
            >
                <form onSubmit={swapShifts}>
                    <div className="space-y-3 px-5 py-5">
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Staf pertama
                            </span>
                            <select
                                value={swapDraft.firstId}
                                onChange={(event) =>
                                    setSwapDraft((current) => ({
                                        ...current,
                                        firstId: event.target.value,
                                    }))
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                {roster.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name} · {staff.role}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Staf kedua
                            </span>
                            <select
                                value={swapDraft.secondId}
                                onChange={(event) =>
                                    setSwapDraft((current) => ({
                                        ...current,
                                        secondId: event.target.value,
                                    }))
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                {roster.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name} · {staff.role}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Hari shift
                            </span>
                            <select
                                value={swapDraft.dayIndex}
                                onChange={(event) =>
                                    setSwapDraft((current) => ({
                                        ...current,
                                        dayIndex: Number(event.target.value),
                                    }))
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                {days.map((day, index) => (
                                    <option key={day.short} value={index}>
                                        {day.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                        <OwnerButton
                            variant="ghost"
                            onClick={() => setSwapOpen(false)}
                        >
                            Batal
                        </OwnerButton>
                        <OwnerButton
                            type="submit"
                            variant="primary"
                            icon={ArrowLeftRight}
                        >
                            Simpan Pertukaran
                        </OwnerButton>
                    </div>
                </form>
            </OwnerModal>

            <OwnerModal
                show={shiftOpen}
                onClose={() => setShiftOpen(false)}
                title="Atur Shift Baru"
                description="Tambahkan atau ubah shift staf pada hari tertentu."
                maxWidth="md"
            >
                <form onSubmit={applyShift}>
                    <div className="space-y-3 px-5 py-5">
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Staf
                            </span>
                            <select
                                value={shiftDraft.staffId}
                                onChange={(event) =>
                                    setShiftDraft((current) => ({
                                        ...current,
                                        staffId: event.target.value,
                                    }))
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                {roster.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name} · {staff.role}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Hari
                            </span>
                            <select
                                value={shiftDraft.dayIndex}
                                onChange={(event) =>
                                    setShiftDraft((current) => ({
                                        ...current,
                                        dayIndex: Number(event.target.value),
                                    }))
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                {days.map((day, index) => (
                                    <option key={day.short} value={index}>
                                        {day.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Tipe shift
                            </span>
                            <select
                                value={shiftDraft.type}
                                onChange={(event) =>
                                    setShiftDraft((current) => ({
                                        ...current,
                                        type: event.target.value,
                                    }))
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                <option value="pagi">Pagi (07–15)</option>
                                <option value="sore">Sore (15–23)</option>
                                <option value="libur">Libur (OFF)</option>
                                <option value="izin">Izin / Cuti</option>
                            </select>
                        </label>
                        <p className="rounded-lg bg-[#F7F8FD] px-3 py-2 text-[9px] leading-4 text-[#6F6A78]">
                            Perubahan akan tampil di roster mingguan dan
                            disinkronkan dengan absensi Biometrik.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                        <OwnerButton
                            variant="ghost"
                            onClick={() => setShiftOpen(false)}
                        >
                            Batal
                        </OwnerButton>
                        <OwnerButton
                            type="submit"
                            variant="primary"
                            icon={CheckCircle2}
                        >
                            Simpan Shift
                        </OwnerButton>
                    </div>
                </form>
            </OwnerModal>
        </div>
    );
}
