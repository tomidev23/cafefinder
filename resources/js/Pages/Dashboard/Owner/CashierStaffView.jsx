import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    History,
    KeyRound,
    LockKeyhole,
    Plus,
    RefreshCw,
    Search,
    Store,
    Trash2,
    UserRound,
    Users,
} from 'lucide-react';
import OwnerButton from '@/Components/Owner/OwnerButton';
import OwnerModal from '@/Components/Owner/OwnerModal';
import OwnerPageHeader from '@/Components/Owner/OwnerPageHeader';
import {
    cashierKpis,
    cashierLogEntries,
    cashierPrivileges,
    cashierShiftOptions,
    cashierStatusMap,
    defaultCashierPrivileges,
} from '@/data/ownerCashierStaff';

const avatarTones = [
    'bg-[#FFE7D7] text-[#8D4B00]',
    'bg-[#E8EDFF] text-[#5D6B96]',
    'bg-[#FDE8EC] text-[#9E3A54]',
    'bg-[#E9FBF3] text-[#0D7A5F]',
];

const statusTones = {
    green: 'bg-[#D6FBEB] text-[#0D7A5F]',
    blue: 'bg-[#EFF4FF] text-[#4C5B8A]',
    rose: 'bg-[#FDE8EC] text-[#B4234A]',
    stone: 'bg-[#F2F1F5] text-[#6F6A78]',
};

const initialsFor = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

const generatePin = () => {
    const values = new Uint32Array(6);

    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
        window.crypto.getRandomValues(values);
    } else {
        values.forEach((_, index) => {
            values[index] = Math.floor(Math.random() * 10);
        });
    }

    return Array.from(values, (value) => value % 10).join('');
};

const statusFor = (staffCode) =>
    cashierStatusMap[staffCode] ?? {
        status: 'Offline',
        detail: 'Belum ada sesi POS',
        tone: 'stone',
        level: 'Kasir Junior',
        onDuty: false,
        terminal: null,
    };

export default function CashierStaffView({
    cashiers = [],
    storeCode = 'ART-88',
    flashStatus,
    notify,
    onOpenPos,
}) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [shiftFilter, setShiftFilter] = useState('Semua Shift');
    const [page, setPage] = useState(1);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [generatedPin, setGeneratedPin] = useState(generatePin());
    const formRef = useRef(null);
    const notifiedFlash = useRef(null);

    const form = useForm({
        name: '',
        email: '',
        phone: '',
        pin: generatedPin,
        shift: cashierShiftOptions[0],
        privileges: defaultCashierPrivileges,
    });

    useEffect(() => {
        if (flashStatus && notifiedFlash.current !== flashStatus) {
            notifiedFlash.current = flashStatus;
            notify(flashStatus);
        }
    }, [flashStatus, notify]);

    const mergedStaff = useMemo(
        () =>
            cashiers.map((cashier) => ({
                ...cashier,
                ...statusFor(cashier.staff_code),
            })),
        [cashiers],
    );

    const onDutyStaff = mergedStaff.filter((staff) => staff.onDuty);

    const filteredStaff = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        return mergedStaff.filter((staff) => {
            if (
                normalized &&
                ![staff.name, staff.email, staff.staff_code]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(normalized)
            ) {
                return false;
            }

            if (
                statusFilter !== 'Semua Status' &&
                !staff.status.toLowerCase().includes(statusFilter.toLowerCase())
            ) {
                return false;
            }

            if (
                shiftFilter !== 'Semua Shift' &&
                staff.shift !== shiftFilter
            ) {
                return false;
            }

            return true;
        });
    }, [mergedStaff, query, shiftFilter, statusFilter]);

    const pageSize = 5;
    const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleStaff = filteredStaff.slice(
        startIndex,
        startIndex + pageSize,
    );

    useEffect(() => {
        setPage(1);
    }, [query, statusFilter, shiftFilter]);

    const regeneratePin = () => {
        const pin = generatePin();
        setGeneratedPin(pin);
        form.setData('pin', pin);
        form.clearErrors('pin');
    };

    const togglePrivilege = (id) => {
        form.setData(
            'privileges',
            form.data.privileges.includes(id)
                ? form.data.privileges.filter((privilege) => privilege !== id)
                : [...form.data.privileges, id],
        );
    };

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    const submit = (event) => {
        event.preventDefault();

        form.post(route('owner.cashiers.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                form.reset('name', 'email', 'phone', 'pin', 'privileges');
                const nextPin = generatePin();
                setGeneratedPin(nextPin);
                form.setData('pin', nextPin);
                setPage(1);
                notify('Akses kasir baru berhasil dibuat.');
            },
        });
    };

    const confirmDelete = (staff) => {
        setDeleteDialog(staff);
    };

    const executeDelete = () => {
        if (!deleteDialog) return;

        fetch(route('owner.cashiers.destroy', deleteDialog.staff_code), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                'Accept': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Gagal menghapus kasir');
                }
                return response.json();
            })
            .then(() => {
                setDeleteDialog(null);
                notify(`Akses kasir untuk ${deleteDialog.name} berhasil dihapus.`);
            })
            .catch(() => {
                setDeleteDialog(null);
                notify('Gagal menghapus kasir. Coba lagi.', 'error');
            });
    };

    const shareGuideLink = `https://wa.me/?text=${encodeURIComponent(
        `Panduan masuk terminal POS CafeFinder:\n1. Buka Terminal Kasir\n2. Pilih nama kasir\n3. Ketik PIN 6-digit\n\nStore code: ${storeCode}`,
    )}`;

    return (
        <div className="space-y-5">
            <OwnerPageHeader
                eyebrow="Operasional Gerai / Manajemen Staf & Akses / Kelola Kasir"
                title="Kelola Staf Kasir & Akses Terminal POS"
                description="Daftarkan kasir baru, buat kode PIN cepat terminal kasir, atur hak otorisasi diskon, void, dan kelola laci kas."
                actions={
                    <>
                        <OwnerButton
                            variant="secondary"
                            icon={History}
                            onClick={() => setHistoryOpen(true)}
                        >
                            Riwayat Log Kasir
                        </OwnerButton>
                        <OwnerButton
                            variant="primary"
                            icon={Plus}
                            onClick={scrollToForm}
                        >
                            Tambah Kasir Baru
                        </OwnerButton>
                    </>
                }
            />

            {flashStatus && (
                <div className="flex items-center gap-2 rounded-xl border border-[#D6FBEB] bg-[#E9FBF3] px-3 py-2 text-[10.5px] font-medium text-[#0D7A5F]">
                    <CheckCircle2
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                    />
                    {flashStatus}
                </div>
            )}

            <section
                aria-label="Ringkasan akses kasir"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Total Staf Kasir Terdaftar
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE7D7] text-[#8D4B00]">
                            <Users aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-[27px] font-bold tracking-[-0.04em] text-[#211D29]">
                            {mergedStaff.length}
                        </span>
                        <span className="text-[11.5px] text-[#6F6A78]">
                            Orang
                        </span>
                    </div>
                    <p className="mt-auto flex items-center gap-1 border-t border-[#F0EFF4] pt-3 text-[9.5px]">
                        <span className="font-semibold text-[#0D7A5F]">
                            {onDutyStaff.length} Aktif di POS
                        </span>
                        <span className="text-[#6F6A78]">
                            · {mergedStaff.length - onDutyStaff.length} Non-aktif/Off
                        </span>
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Kasir Sedang Bertugas
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#D6FBEB] text-[#0D7A5F]">
                            <BadgeCheck
                                aria-hidden="true"
                                className="h-4 w-4"
                            />
                        </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-flex h-2 w-2 rounded-full bg-[#0D7A5F]" />
                        <span className="text-[12px] font-bold text-[#0D7A5F]">
                            Live
                        </span>
                    </div>
                    <ul className="mt-1.5 space-y-1">
                        {onDutyStaff.slice(0, 2).map((staff) => (
                            <li
                                key={staff.staff_code}
                                className="flex items-center justify-between gap-2 text-[9px]"
                            >
                                <span className="truncate text-[#3F3B47]">
                                    {staff.name}
                                </span>
                                <span className="shrink-0 text-[8px] text-[#6F6A78]">
                                    {staff.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-auto border-t border-[#F0EFF4] pt-2.5 text-[8.5px] text-[#6F6A78]">
                        {onDutyStaff.length > 2
                            ? `+${onDutyStaff.length - 2} kasir lain sedang standby`
                            : 'Sesi terminal terpantau real-time'}
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Batas Kuota Kasir POS
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4C5B8A]">
                            <Store aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-[27px] font-bold tracking-[-0.04em] text-[#211D29]">
                            {mergedStaff.length}
                        </span>
                        <span className="text-[11.5px] text-[#6F6A78]">
                            / {cashierKpis.quota} Kasir
                        </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF1F9]">
                        <div
                            className="h-full rounded-full bg-[#8D4B00]"
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.round(
                                        (mergedStaff.length /
                                            cashierKpis.quota) *
                                            100,
                                    ),
                                )}%`,
                            }}
                        />
                    </div>
                    <p className="mt-2 text-[8.5px] text-[#6F6A78]">
                        Paket Merchant Pro Terpakai{' '}
                        {Math.min(
                            100,
                            Math.round(
                                (mergedStaff.length / cashierKpis.quota) * 100,
                            ),
                        )}
                        %
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Kebijakan Keamanan PIN
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDE8EC] text-[#B4234A]">
                            <LockKeyhole
                                aria-hidden="true"
                                className="h-4 w-4"
                            />
                        </span>
                    </div>
                    <span className="mt-3 inline-flex rounded-full bg-[#D6FBEB] px-2 py-1 text-[9px] font-semibold text-[#0D7A5F]">
                        Proteksi Aktif
                    </span>
                    <p className="mt-auto border-t border-[#F0EFF4] pt-3 text-[8.5px] leading-4 text-[#6F6A78]">
                        {cashierKpis.securityNote}
                    </p>
                </article>
            </section>

            <div className="flex flex-col gap-3 rounded-2xl border border-[#E4EAF8] bg-[#F2F6FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#8D4B00]">
                        <KeyRound aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-[10px] font-semibold text-[#3F3B47]">
                            Panduan Cepat Masuk Terminal Kasir POS:
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-[#6F6A78]">
                            <span className="flex items-center gap-1">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-bold text-[#5D6B96]">
                                    1
                                </span>
                                Buka Terminal Kasir
                            </span>
                            <ArrowRight
                                aria-hidden="true"
                                className="h-3 w-3 text-[#B5AFBC]"
                            />
                            <span className="flex items-center gap-1">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-bold text-[#5D6B96]">
                                    2
                                </span>
                                Pilih Nama Kasir
                            </span>
                            <ArrowRight
                                aria-hidden="true"
                                className="h-3 w-3 text-[#B5AFBC]"
                            />
                            <span className="flex items-center gap-1">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-bold text-[#5D6B96]">
                                    3
                                </span>
                                Ketik PIN Cepat 6-Digit
                            </span>
                        </p>
                    </div>
                </div>
                <a
                    href={shareGuideLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#E2E5EF] bg-white px-2.5 py-2 text-[9px] font-semibold text-[#55515E] shadow-sm transition hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] sm:self-center"
                >
                    <ArrowRight aria-hidden="true" className="h-3 w-3" />
                    Bagikan Panduan via WhatsApp
                </a>
            </div>

            <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                <section className="min-w-0 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                                Daftar Staf Kasir Terdaftar
                            </h2>
                            <p className="mt-0.5 text-[9.5px] text-[#6F6A78]">
                                Menampilkan seluruh operator terminal dan level
                                izin POS.
                            </p>
                        </div>
                        <span className="rounded-full bg-[#D6FBEB] px-2.5 py-1 text-[8.5px] font-semibold text-[#0D7A5F]">
                            {onDutyStaff.length} Operator Aktif
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <div className="relative min-w-[190px] flex-1">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8B8694]"
                            />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Cari nama kasir, email, ID..."
                                className="h-9 w-full rounded-lg border border-[#E2E5EF] bg-[#F8F9FE] pl-9 pr-3 text-[10px] text-[#292632] placeholder:text-[#8B8694] focus:border-[#A88B70] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="h-9 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9.5px] font-medium text-[#55515E] focus:border-[#A88B70] focus:outline-none"
                        >
                            <option>Semua Status</option>
                            <option>Terminal</option>
                            <option>Standby</option>
                            <option>Offline</option>
                            <option>Cuti</option>
                            <option>Dinonaktifkan</option>
                        </select>
                        <select
                            value={shiftFilter}
                            onChange={(event) => setShiftFilter(event.target.value)}
                            className="h-9 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9.5px] font-medium text-[#55515E] focus:border-[#A88B70] focus:outline-none"
                        >
                            <option>Semua Shift</option>
                            {cashierShiftOptions.map((shift) => (
                                <option key={shift}>{shift}</option>
                            ))}
                        </select>
                    </div>

                    <p className="mt-3 text-[9px] text-[#6F6A78] sm:hidden">
                        Geser untuk melihat detail kasir.
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visibleStaff.map((staff, index) => (
                            <article
                                key={staff.id ?? staff.staff_code}
                                className="relative group rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3 transition hover:border-[#D8B796] hover:shadow-md hover:shadow-[#8D4B00]/10"
                            >
                                <button
                                    type="button"
                                    onClick={() => confirmDelete(staff)}
                                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition rounded-full h-7 w-7 items-center justify-center text-[#6F6A78] hover:bg-[#FDE8EC] hover:text-[#B42318] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                    aria-label={`Hapus ${staff.name}`}
                                >
                                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                                </button>
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold ${avatarTones[index % avatarTones.length]}`}
                                    >
                                        {initialsFor(staff.name)}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-[11px] font-semibold text-[#292632] truncate">
                                                {staff.name}
                                            </p>
                                            <span
                                                className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[7.5px] font-semibold ${statusTones[staff.tone] ?? statusTones.stone}`}
                                            >
                                                {staff.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-[9px] text-[#6F6A78]">
                                            {staff.email}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[8px] text-[#6F6A78]">
                                            <span className="flex items-center gap-1">
                                                <UserRound aria-hidden="true" className="h-2.5 w-2.5" />
                                                {staff.staff_code}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Store aria-hidden="true" className="h-2.5 w-2.5" />
                                                {storeCode}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[8px] text-[#6F6A78]">
                                            <span className="flex items-center gap-1">
                                                <LockKeyhole aria-hidden="true" className="h-2.5 w-2.5" />
                                                PIN 6-digit
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <KeyRound aria-hidden="true" className="h-2.5 w-2.5" />
                                                {staff.level}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-[8px] text-[#8B8694]">
                                            {staff.detail}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {visibleStaff.length === 0 && (
                        <div className="mt-4 rounded-xl border border-dashed border-[#DCD9E4] py-8 text-center">
                            <Users aria-hidden="true" className="mx-auto h-5 w-5 text-[#8B8694]" />
                            <p className="mt-2 text-[10.5px] font-semibold text-[#292632]">
                                Tidak ada kasir pada filter ini
                            </p>
                            <p className="mt-1 text-[9px] text-[#6F6A78]">
                                Ubah filter atau tambahkan kasir baru.
                            </p>
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-3">
                        <p className="text-[9px] text-[#6F6A78]">
                            Menampilkan {filteredStaff.length === 0 ? 0 : startIndex + 1}–
                            {Math.min(startIndex + pageSize, filteredStaff.length)} dari{' '}
                            {filteredStaff.length} Staf Kasir
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                aria-label="Halaman sebelumnya"
                                disabled={currentPage === 1}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#6F6A78] hover:bg-[#F5F4F8] disabled:opacity-40"
                            >
                                <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                (pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        aria-current={
                                            pageNumber === currentPage ? 'page' : undefined
                                        }
                                        onClick={() => setPage(pageNumber)}
                                        className={`inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-[9.5px] font-semibold ${
                                            pageNumber === currentPage
                                                ? 'bg-[#8D4B00] text-white'
                                                : 'bg-white text-[#55515E] hover:bg-[#F5F4F8]'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ),
                            )}
                            <button
                                type="button"
                                aria-label="Halaman berikutnya"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setPage((current) => Math.min(totalPages, current + 1))
                                }
                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#6F6A78] hover:bg-[#F5F4F8] disabled:opacity-40"
                            >
                                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </section>

                <section
                    ref={formRef}
                    className="min-w-0 scroll-mt-24 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3"
                >
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                                Form Pendaftaran Kasir
                            </h2>
                            <p className="mt-0.5 max-w-[260px] text-[9px] leading-4 text-[#6F6A78]">
                                Isi kredensial login dan tentukan batasan akses
                                POS.
                            </p>
                        </div>
                        <span className="rounded-md bg-[#FFE7D7] px-2 py-1 text-[8px] font-semibold text-[#8D4B00]">
                            ID: CSR-
                            {String(cashiers.length + 1).padStart(3, '0')}
                        </span>
                    </div>

                    <form onSubmit={submit} className="mt-4 space-y-3">
                        <label className="block">
                            <span className="text-[9.5px] font-semibold text-[#4A4552]">
                                Nama Lengkap Kasir *
                            </span>
                            <span className="mt-1 flex h-9 items-center gap-2 rounded-lg border border-[#E2E5EF] bg-white px-2.5 focus-within:border-[#A88B70] focus-within:ring-2 focus-within:ring-[#8D4B00]/15">
                                <UserRound aria-hidden="true" className="h-3.5 w-3.5 text-[#8B8694]" />
                                <input
                                    id="cashier-name"
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    placeholder="Nama lengkap"
                                    className="h-full w-full border-0 bg-transparent p-0 text-[10px] text-[#292632] focus:ring-0"
                                />
                            </span>
                            {form.errors.name && (
                                <span className="mt-1 block text-[9px] text-[#B42318]">{form.errors.name}</span>
                            )}
                        </label>

                        <div className="grid gap-2 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-[9.5px] font-semibold text-[#4A4552]">
                                    Email Login POS *
                                </span>
                                <input
                                    id="cashier-email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(event) => form.setData('email', event.target.value)}
                                    placeholder="kasir@kafe.id"
                                    className="mt-1 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[10px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                />
                                {form.errors.email && (
                                    <span className="mt-1 block text-[9px] text-[#B42318]">{form.errors.email}</span>
                                )}
                            </label>
                            <label className="block">
                                <span className="text-[9.5px] font-semibold text-[#4A4552]">
                                    Nomor WhatsApp / HP
                                </span>
                                <input
                                    id="cashier-phone"
                                    value={form.data.phone}
                                    onChange={(event) => form.setData('phone', event.target.value)}
                                    placeholder="0812xxxxxxx"
                                    className="mt-1 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[10px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                />
                            </label>
                        </div>

                        <div className="rounded-xl bg-[#F4F7FF] p-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[9px] font-semibold text-[#4A4552]">
                                    PIN Akses POS Cepat (6-Digit)
                                </span>
                                <button
                                    type="button"
                                    onClick={regeneratePin}
                                    className="inline-flex items-center gap-1 rounded text-[8.5px] font-semibold text-[#8D4B00] hover:text-[#603200]"
                                >
                                    <RefreshCw aria-hidden="true" className="h-3 w-3" />
                                    Generate
                                </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-[#E2E5EF] bg-white px-3 py-2">
                                <span className="font-mono text-[15px] font-bold tracking-[0.35em] text-[#3F3B47]">
                                    {form.data.pin}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#D6FBEB] px-1.5 py-0.5 text-[7.5px] font-semibold text-[#0D7A5F]">
                                    <CheckCircle2 aria-hidden="true" className="h-2.5 w-2.5" />
                                    PIN Valid
                                </span>
                            </div>
                            <p className="mt-1.5 text-[8px] leading-3 text-[#6F6A78]">
                                Kasir menggunakan PIN ini untuk membuka terminal
                                tablet meja kasir.
                            </p>
                            {form.errors.pin && (
                                <span className="mt-1 block text-[9px] text-[#B42318]">{form.errors.pin}</span>
                            )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-[9.5px] font-semibold text-[#4A4552]">
                                    Penugasan Gerai
                                </span>
                                <span className="mt-1 flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E5EF] bg-[#F8F9FE] px-2.5 text-[9.5px] text-[#55515E]">
                                    <Store aria-hidden="true" className="h-3 w-3" />
                                    Artisan Roastery ({storeCode})
                                </span>
                            </label>
                            <label className="block">
                                <span className="text-[9.5px] font-semibold text-[#4A4552]">
                                    Shift Utama
                                </span>
                                <select
                                    id="cashier-shift"
                                    value={form.data.shift}
                                    onChange={(event) => form.setData('shift', event.target.value)}
                                    className="mt-1 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9.5px] text-[#55515E] focus:border-[#A88B70] focus:outline-none"
                                >
                                    {cashierShiftOptions.map((shift) => (
                                        <option key={shift}>{shift}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <fieldset>
                            <legend className="text-[9.5px] font-semibold text-[#4A4552]">
                                Hak Akses &amp; Otorisasi Operasional
                            </legend>
                            <div className="mt-2 space-y-1.5">
                                {cashierPrivileges.map((privilege) => (
                                    <label
                                        key={privilege.id}
                                        className="flex cursor-pointer items-start gap-2 rounded-lg border border-[#F0EFF4] p-2 text-[8.5px] leading-3.5 text-[#55515E] hover:bg-[#FAFAFD]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.data.privileges.includes(privilege.id)}
                                            onChange={() => togglePrivilege(privilege.id)}
                                            className="mt-0.5 h-3.5 w-3.5 rounded border-[#CFCBD6] text-[#8D4B00] focus:ring-[#8D4B00]"
                                        />
                                        <span className="min-w-0">
                                            <span className="flex flex-wrap items-center gap-1 font-semibold text-[#3F3B47]">
                                                {privilege.title}
                                                {privilege.supervisorOnly && (
                                                    <span className="rounded-full bg-[#FDE8EC] px-1 py-0.5 text-[7px] font-semibold text-[#B4234A]">
                                                        Perlu Supervisor
                                                    </span>
                                                )}
                                            </span>
                                            <span className="mt-0.5 block text-[7.5px] leading-3 text-[#6F6A78]">
                                                {privilege.description}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="flex items-center justify-end gap-2 border-t border-[#F0EFF4] pt-3">
                            <button
                                type="button"
                                onClick={() => form.reset()}
                                className="rounded-lg px-2.5 py-2 text-[9.5px] font-semibold text-[#6F6A78] hover:bg-[#F5F4F8]"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#8D4B00] px-3 py-2 text-[9.5px] font-semibold text-white transition hover:bg-[#733D00] disabled:opacity-50"
                            >
                                <Plus aria-hidden="true" className="h-3 w-3" />
                                Simpan &amp; Berikan Akses Kasir
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            <OwnerModal
                show={historyOpen}
                onClose={() => setHistoryOpen(false)}
                title="Riwayat Log Kasir"
                description="Aktivitas login, buka kasir, dan penutupan shift terbaru."
                maxWidth="lg"
            >
                <div className="overflow-x-auto px-5 py-5">
                    <table className="w-full min-w-[560px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#F0EFF4] text-[8.5px] uppercase tracking-[0.06em] text-[#6F6A78]">
                                <th className="pb-2 pr-3">Waktu</th>
                                <th className="px-2 pb-2">Kasir</th>
                                <th className="px-2 pb-2">Aktivitas</th>
                                <th className="pb-2 pl-2 pr-0">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashierLogEntries.map((entry) => (
                                <tr key={`${entry.time}-${entry.staff}`} className="border-b border-[#F4F3F7] last:border-0">
                                    <td className="py-2.5 pr-3 text-[9px] text-[#6F6A78]">{entry.time}</td>
                                    <td className="px-2 py-2.5 text-[9px] font-semibold text-[#3F3B47]">{entry.staff}</td>
                                    <td className="px-2 py-2.5 text-[8.5px] text-[#55515E]">{entry.action}</td>
                                    <td className="py-2.5 pl-2 pr-0">
                                        <span className={`rounded-full px-1.5 py-0.5 text-[7.5px] font-semibold ${
                                            entry.status === 'Ditolak'
                                                ? 'bg-[#FDE8EC] text-[#B4234A]'
                                                : 'bg-[#D6FBEB] text-[#0D7A5F]'
                                        }`}>
                                            {entry.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setHistoryOpen(false)}
                        className="rounded-lg bg-[#8D4B00] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#733D00]"
                    >
                        Tutup
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                title="Hapus Akses Kasir"
                description="Tindakan ini tidak dapat dibatalkan. Kasir tidak akan bisa login ke POS."
                maxWidth="md"
            >
                <div className="px-5 py-5">
                    {deleteDialog && (
                        <div className="text-center">
                            <div className="mx-auto mt-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FDE8EC] text-[#B4234A]">
                                <Trash2 aria-hidden="true" className="h-6 w-6" />
                            </div>
                            <h3 className="mt-3 text-[15px] font-semibold text-[#211D29]">
                                Hapus akses kasir untuk <span className="font-bold text-[#8D4B00]">{deleteDialog.name}</span>?
                            </h3>
                            <p className="mt-1.5 text-[10.5px] text-[#6F6A78]">
                                ID: {deleteDialog.staff_code} · {deleteDialog.email}
                            </p>
                            <p className="mt-2.5 text-[10px] text-[#B42318]">
                                Kasir tidak akan bisa masuk ke Terminal POS. Data transaksi historis tetap tersimpan.
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setDeleteDialog(null)}
                        className="rounded-lg border border-[#E2E5EF] bg-white px-4 py-2 text-[10px] font-semibold text-[#55515E] hover:bg-[#F5F4F8]"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={executeDelete}
                        className="rounded-lg bg-[#B42318] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#8F1C14]"
                    >
                        Hapus Sekarang
                    </button>
                </div>
            </OwnerModal>
        </div>
    );
}
