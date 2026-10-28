import { useState } from 'react';
import {
    Armchair,
    ArrowRight,
    CalendarDays,
    Coffee,
    Copy,
    Download,
    Gauge,
    Leaf,
    LockKeyhole,
    Minus,
    Moon,
    Plug,
    Plus,
    QrCode,
    RefreshCw,
    Sun,
    Waves,
} from 'lucide-react';
import OwnerButton from '@/Components/Owner/OwnerButton';
import OwnerModal from '@/Components/Owner/OwnerModal';
import OwnerOperationalTabs from '@/Components/Owner/OwnerTabs';
import OwnerPageHeader from '@/Components/Owner/OwnerPageHeader';
import OwnerToggle from '@/Components/Owner/OwnerToggle';
import {
    shiftSummary,
    tableFilters,
    tableOperationalSettings,
    tableZones,
} from '@/data/ownerOperations';

const zoneIcons = {
    waves: Waves,
    coffee: Coffee,
    leaf: Leaf,
    plug: Plug,
};

const statusStyles = {
    terisi: {
        pill: 'bg-[#8D4B00] text-white',
        dot: 'bg-white',
        label: 'Terisi',
    },
    komunal: {
        pill: 'bg-[#8D4B00] text-white',
        dot: 'bg-white',
        label: 'Terisi',
    },
    kosong: {
        pill: 'bg-[#D6FBEB] text-[#0D7A5F]',
        dot: 'bg-[#0D7A5F]',
        label: 'Kosong',
    },
    tersedia: {
        pill: 'bg-[#D6FBEB] text-[#0D7A5F]',
        dot: 'bg-[#0D7A5F]',
        label: 'Tersedia',
    },
    reservasi: {
        pill: 'bg-[#FFE7D7] text-[#8D4B00]',
        dot: 'bg-[#8D4B00]',
        label: 'Reservasi',
    },
};

const qrCells = Array.from({ length: 225 }, (_, index) => {
    const row = Math.floor(index / 15);
    const column = index % 15;
    const inFinder = (startRow, startColumn) => {
        const rowOffset = row - startRow;
        const columnOffset = column - startColumn;

        return (
            rowOffset >= 0 &&
            rowOffset < 5 &&
            columnOffset >= 0 &&
            columnOffset < 5 &&
            (rowOffset === 0 ||
                rowOffset === 4 ||
                columnOffset === 0 ||
                columnOffset === 4 ||
                (rowOffset >= 2 &&
                    rowOffset <= 2 &&
                    columnOffset >= 2 &&
                    columnOffset <= 2))
        );
    };

    if (inFinder(0, 0) || inFinder(0, 10) || inFinder(10, 0)) {
        return true;
    }

    return (row * 7 + column * 11 + row * column) % 5 < 2;
});

function QrPreview({ tableId }) {
    return (
        <div className="relative mx-auto flex aspect-square w-full max-w-[220px] flex-col items-center justify-center rounded-xl border border-[#E5E0D6] bg-white p-4">
            <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.18em] text-[#6F6A78]">
                Pratinjau Stand QR Meja
            </p>
            <div className="relative grid h-[142px] w-[142px] grid-cols-[repeat(15,minmax(0,1fr))] gap-[1px]">
                {qrCells.map((filled, index) => (
                    <span
                        key={index}
                        className={filled ? 'bg-[#231F2B]' : 'bg-white'}
                    />
                ))}
                <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-[#E7E1D8] bg-white">
                    <Coffee
                        aria-hidden="true"
                        className="h-4 w-4 text-[#8D4B00]"
                    />
                </span>
            </div>
            <p className="mt-3 text-[13px] font-bold tracking-[-0.02em] text-[#6F3A0E]">
                MEJA #{tableId}
            </p>
            <p className="mt-0.5 text-[8px] text-[#6F6A78]">
                Scan untuk Pesan &amp; Bayar Instan
            </p>
        </div>
    );
}

function StatusPill({ status }) {
    const style = statusStyles[status] ?? statusStyles.kosong;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-semibold ${style.pill}`}
        >
            <span className={`h-1 w-1 rounded-full ${style.dot}`} />
            {style.label}
        </span>
    );
}

function TableCard({ table, selected, onSelect, onAction }) {
    const isCommunal = table.status === 'komunal';

    return (
        <article
            className={`rounded-xl border bg-white p-3.5 transition ${
                selected
                    ? 'border-[#B97A45] shadow-[0_0_0_1px_#D8B796]'
                    : 'border-[#ECECF3] hover:border-[#DCD5CB]'
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold ${
                            selected
                                ? 'bg-[#8D4B00] text-white'
                                : 'bg-[#F4F3F8] text-[#6F6A78]'
                        }`}
                    >
                        {table.id}
                    </span>
                    <div>
                        <h4 className="text-[11.5px] font-semibold leading-4 text-[#231F2B]">
                            Meja #{table.id}
                            {isCommunal && ' (Komunal)'}
                        </h4>
                        <p className="text-[9px] text-[#6F6A78]">
                            Kapasitas: {table.capacity} Kursi
                        </p>
                    </div>
                </div>
                <StatusPill status={table.status} />
            </div>

            <div className="mt-2.5 rounded-lg bg-[#F2F6FF] p-2.5">
                {table.status === 'terisi' && (
                    <dl className="space-y-1 text-[9px]">
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Order ID:</dt>
                            <dd className="font-semibold text-[#3F3B47]">
                                {table.orderId}{' '}
                                <span className="font-normal text-[#6F6A78]">
                                    ({table.orderType})
                                </span>
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Total</dt>
                            <dd className="font-semibold text-[#3F3B47]">
                                {table.total}{' '}
                                <span className="font-normal text-[#6F6A78]">
                                    ({table.payment})
                                </span>
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Tagihan:</dt>
                            <dd className="font-semibold text-[#0D7A5F]">
                                {table.paymentStatus}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Durasi Duduk:</dt>
                            <dd className="text-[#3F3B47]">
                                {table.duration}
                            </dd>
                        </div>
                    </dl>
                )}

                {table.status === 'komunal' && (
                    <dl className="space-y-1 text-[9px]">
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Order ID:</dt>
                            <dd className="font-semibold text-[#3F3B47]">
                                {table.orderId}{' '}
                                <span className="font-normal text-[#6F6A78]">
                                    ({table.orderType})
                                </span>
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Item Aktif:</dt>
                            <dd className="text-[#3F3B47]">{table.items}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Tipe:</dt>
                            <dd className="text-[#3F3B47]">
                                {table.meetingType}
                            </dd>
                        </div>
                    </dl>
                )}

                {table.status === 'reservasi' && (
                    <dl className="space-y-1 text-[9px]">
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Waktu:</dt>
                            <dd className="font-semibold text-[#3F3B47]">
                                {table.time}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Tamu:</dt>
                            <dd className="text-[#3F3B47]">{table.guest}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-[#6F6A78]">Status DP:</dt>
                            <dd className="font-semibold text-[#0D7A5F]">
                                {table.dpStatus}
                            </dd>
                        </div>
                    </dl>
                )}

                {(table.status === 'kosong' ||
                    table.status === 'tersedia') && (
                    <div className="flex items-center gap-2.5 py-1">
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#8B8694]">
                            <Armchair
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                            />
                        </span>
                        <p className="text-[9px] leading-4 text-[#6F6A78]">
                            {table.status === 'tersedia'
                                ? table.note
                                : 'Meja bersih & siap ditempati pelanggan.'}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[8.5px] font-medium text-[#0D7A5F]">
                    {table.qrActive ? (
                        <>
                            <QrCode
                                aria-hidden="true"
                                className="h-3 w-3"
                            />
                            QR Meja Aktif
                        </>
                    ) : (
                        'QR Meja Nonaktif'
                    )}
                </span>
                {table.status === 'reservasi' ? (
                    <button
                        type="button"
                        onClick={() => onAction(table)}
                        className="inline-flex items-center gap-1 rounded text-[8.5px] font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        Tandai Hadir
                    </button>
                ) : table.status === 'terisi' ||
                  table.status === 'komunal' ? (
                    <button
                        type="button"
                        onClick={() => onSelect(table.id)}
                        className="inline-flex items-center gap-1 rounded text-[8.5px] font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        Detail Pengaturan
                        <ArrowRight
                            aria-hidden="true"
                            className="h-3 w-3"
                        />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onSelect(table.id)}
                        className="inline-flex items-center gap-1 rounded text-[8.5px] font-semibold text-[#6F6A78] hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                    >
                        <LockKeyhole
                            aria-hidden="true"
                            className="h-3 w-3"
                        />
                        Kunci Meja
                    </button>
                )}
            </div>
        </article>
    );
}

function StoolCard({ stool, onSelect }) {
    const style = statusStyles[stool.status] ?? statusStyles.kosong;

    return (
        <article className="rounded-xl border border-[#ECECF3] bg-white p-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h4 className="text-[10px] font-semibold text-[#231F2B]">
                        {stool.name}
                    </h4>
                    <p className="mt-0.5 text-[8.5px] text-[#6F6A78]">
                        {stool.bean}
                    </p>
                </div>
                <span
                    className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${style.pill}`}
                >
                    {style.label}
                </span>
            </div>
            <button
                type="button"
                onClick={() => onSelect(stool.id)}
                className="mt-2 inline-flex items-center gap-1 rounded text-[8px] font-medium text-[#6F6A78] hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
            >
                Lihat detail
                <ArrowRight aria-hidden="true" className="h-3 w-3" />
            </button>
        </article>
    );
}

export default function TablesView({ notify, onNavigate }) {
    const [zones, setZones] = useState(tableZones);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedId, setSelectedId] = useState('01');
    const [settings, setSettings] = useState(tableOperationalSettings);
    const [temporarilyOff, setTemporarilyOff] = useState(false);
    const [addTableOpen, setAddTableOpen] = useState(false);
    const [newTableZone, setNewTableZone] = useState('indoor');
    const [newTableCapacity, setNewTableCapacity] = useState('4');

    const allItems = zones.flatMap((zone) => zone.tables ?? zone.stools ?? []);
    const selected = allItems.find((item) => item.id === selectedId) ?? allItems[0];
    const selectedZone =
        zones.find((zone) =>
            (zone.tables ?? zone.stools ?? []).some(
                (item) => item.id === selected?.id,
            ),
        ) ?? zones[0];

    const counts = zones.reduce(
        (accumulator, zone) => {
            const count = (zone.tables ?? zone.stools ?? []).length;
            accumulator[zone.id] = count;
            accumulator.all += count;

            return accumulator;
        },
        { all: 0 },
    );

    const visibleZones =
        activeFilter === 'all'
            ? zones
            : zones.filter((zone) => zone.id === activeFilter);

    const selectTable = (id) => {
        setSelectedId(id);
        setTemporarilyOff(false);
    };

    const handleTableAction = (table) => {
        if (table.status === 'reservasi') {
            setZones((currentZones) =>
                currentZones.map((zone) => ({
                    ...zone,
                    tables: zone.tables?.map((item) =>
                        item.id === table.id
                            ? {
                                  ...item,
                                  status: 'terisi',
                                  orderId: `#TR-${900 + Number(item.id)}`,
                                  orderType: 'QR Mandiri',
                                  total: 'Rp 50.000',
                                  payment: 'QRIS',
                                  paymentStatus: 'Lunas',
                                  duration: 'Baru saja',
                              }
                            : item,
                    ),
                })),
            );
            notify(`Meja #${table.id} ditandai hadir dan siap dilayani.`);
            return;
        }

        notify(`Pesanan Meja #${table.id} dibuka di antrean kasir.`);
    };

    const copyLink = async () => {
        const link = `https://cafefinder.id/order/${selectedZone.id}-${selected?.id}`;

        try {
            await navigator.clipboard.writeText(link);
            notify('Direct table order link disalin.');
        } catch {
            notify('Link tidak dapat disalin di browser ini.');
        }
    };

    const downloadQr = () => {
        const cell = 16;
        const padding = 8;
        const size = 15 * cell + padding * 2;
        const rectangles = qrCells
            .map((filled, index) => {
                if (!filled) {
                    return '';
                }

                const row = Math.floor(index / 15);
                const column = index % 15;

                return `<rect x="${column * cell + padding}" y="${row * cell + padding}" width="${cell}" height="${cell}" rx="1" fill="#231F2B" />`;
            })
            .join('');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="#ffffff" />${rectangles}<text x="${size / 2}" y="${size - 18}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#6F3A0E">MEJA #${selected?.id ?? ''}</text></svg>`;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = `qr-meja-${selected?.id ?? '01'}.svg`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        notify(`QR Meja #${selected?.id} diunduh sebagai SVG.`);
    };

    const addTable = (event) => {
        event.preventDefault();
        const capacity = Math.max(1, Number(newTableCapacity) || 1);
        const numericIds = allItems
            .filter((item) => /^\d+$/.test(item.id))
            .map((item) => Number(item.id));
        const nextId = String(Math.max(...numericIds, 0) + 1).padStart(2, '0');

        setZones((currentZones) =>
            currentZones.map((zone) =>
                zone.id === newTableZone
                    ? {
                          ...zone,
                          tables: [
                              ...(zone.tables ?? []),
                              {
                                  id: nextId,
                                  zone: zone.id,
                                  capacity,
                                  status: 'kosong',
                                  qrActive: true,
                              },
                          ],
                      }
                    : zone,
            ),
        );
        const nextZoneName =
            tableZones.find((zone) => zone.id === newTableZone)?.name ??
            newTableZone;

        setSelectedId(nextId);
        setAddTableOpen(false);
        notify(`Meja #${nextId} ditambahkan ke ${nextZoneName}.`);
    };

    return (
        <div className="space-y-5">
            <OwnerPageHeader
                eyebrow="Operasional Gerai / Denah Meja & QRIS"
                title="Kelola Kafe & Operasional Gerai"
                description="Konfigurasi denah tata letak meja QRIS, manajemen shift staf barista, jam buka, dan perangkat cetak KDS."
                actions={
                    <>
                        <OwnerButton
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={() =>
                                notify(
                                    'Status meja dan pesanan QRIS tersinkron ulang.',
                                )
                            }
                        >
                            Refresh Status Meja
                        </OwnerButton>
                        <OwnerButton
                            variant="primary"
                            icon={Plus}
                            onClick={() => setAddTableOpen(true)}
                        >
                            Tambah Meja Baru
                        </OwnerButton>
                    </>
                }
            >
                <OwnerOperationalTabs
                    active="tables"
                    onNavigate={onNavigate}
                />
            </OwnerPageHeader>

            <div className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[9.5px] font-medium text-[#6F6A78]">
                        Filter Area:
                    </span>
                    {tableFilters.map((filter) => (
                        <button
                            key={filter.id}
                            type="button"
                            aria-pressed={activeFilter === filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[9.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                activeFilter === filter.id
                                    ? 'bg-[#211D29] text-white'
                                    : 'bg-[#F4F4F8] text-[#55515E] hover:bg-[#ECECF3]'
                            }`}
                        >
                            {filter.label}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[8px] ${
                                    activeFilter === filter.id
                                        ? 'bg-white/15 text-white'
                                        : 'bg-white text-[#6F6A78]'
                                }`}
                            >
                                {counts[filter.id] ?? filter.count}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="mt-3 border-t border-[#F3F2F6] pt-3">
                    <OwnerButton
                        variant="secondary"
                        size="sm"
                        icon={QrCode}
                        onClick={() =>
                            notify('Permintaan cetak massal QR stand meja dibuat.')
                        }
                    >
                        Cetak Massal QR Stand Meja
                    </OwnerButton>
                </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
                <div className="space-y-4">
                    {visibleZones.map((zone) => {
                        const Icon = zoneIcons[zone.icon] ?? Waves;
                        const items = zone.tables ?? zone.stools ?? [];

                        return (
                            <section
                                key={zone.id}
                                className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="flex items-start gap-2.5">
                                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F6FF] text-[#8D4B00]">
                                            <Icon
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        </span>
                                        <div>
                                            <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-[#211D29]">
                                                {zone.name}
                                                {zone.id === 'indoor' &&
                                                    ' (Quiet WFC Zone)'}
                                            </h2>
                                            <p className="mt-0.5 max-w-[380px] text-[9px] leading-4 text-[#6F6A78]">
                                                {zone.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-[#F2F6FF] px-2.5 py-1 text-[8.5px] font-medium text-[#5D6B96]">
                                        {zone.id === 'bar'
                                            ? 'Live Pour Over Session'
                                            : zone.tag}
                                    </span>
                                </div>

                                <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                                    {zone.tables?.map((table) => (
                                        <TableCard
                                            key={table.id}
                                            table={table}
                                            selected={selectedId === table.id}
                                            onSelect={selectTable}
                                            onAction={handleTableAction}
                                        />
                                    ))}
                                    {zone.stools?.map((stool) => (
                                        <StoolCard
                                            key={stool.id}
                                            stool={stool}
                                            onSelect={selectTable}
                                        />
                                    ))}
                                </div>

                                {zone.id === 'bar' && (
                                    <p className="mt-2 text-[8px] text-[#6F6A78]">
                                        Interaksi langsung barista untuk V60,
                                        Kalita Wave, &amp; Aeropress.
                                    </p>
                                )}
                            </section>
                        );
                    })}
                </div>

                {selected && (
                    <aside className="self-start rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3 xl:sticky xl:top-24">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3E7] text-[9px] font-bold text-[#8D4B00]">
                                    {selected.id}
                                </span>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-[#211D29]">
                                        Detail Meja #{selected.id}
                                    </h2>
                                    <p className="mt-0.5 text-[9px] text-[#6F6A78]">
                                        {selectedZone.name}
                                        {selected.status === 'terisi' &&
                                            ' • Sedang terisi'}
                                    </p>
                                </div>
                            </div>
                            <StatusPill status={selected.status} />
                        </div>

                        <div className="mt-4">
                            {temporarilyOff && (
                                <p className="mb-2 rounded-lg bg-[#FFF3E6] px-2.5 py-2 text-center text-[8.5px] font-semibold text-[#8D4B00]">
                                    Meja dinonaktifkan sementara
                                </p>
                            )}
                            <QrPreview tableId={selected.id} />
                        </div>

                        <div className="mt-3">
                            <span className="text-[9px] font-semibold text-[#3F3B47]">
                                Direct Table Order Link
                            </span>
                            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-[#E6E4ED] bg-[#F8F9FE] px-2.5 py-2">
                                <span className="min-w-0 flex-1 truncate text-[9px] text-[#55515E]">
                                    cafefinder.id/order/
                                    {selectedZone.id}-{selected.id}
                                </span>
                                <button
                                    type="button"
                                    onClick={copyLink}
                                    aria-label="Salin tautan meja"
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#6F6A78] transition hover:bg-white hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                >
                                    <Copy
                                        aria-hidden="true"
                                        className="h-3 w-3"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-[#F0EFF4] pt-3">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6F6A78]">
                                Aturan Operasional Meja
                            </p>
                            <div className="mt-2.5 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <span>
                                        <span className="block text-[10px] font-medium text-[#3F3B47]">
                                            Pemesanan QR Mandiri
                                        </span>
                                        <span className="mt-0.5 block text-[8.5px] leading-3 text-[#6F6A78]">
                                            Pelanggan bisa langsung order via web
                                        </span>
                                    </span>
                                    <OwnerToggle
                                        checked={settings.qrOrdering}
                                        onChange={(checked) =>
                                            setSettings((current) => ({
                                                ...current,
                                                qrOrdering: checked,
                                            }))
                                        }
                                        label="Pemesanan QR mandiri"
                                    />
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <span>
                                        <span className="block text-[10px] font-medium text-[#3F3B47]">
                                            Wajib Bayar QRIS di Awal
                                        </span>
                                        <span className="mt-0.5 block text-[8.5px] leading-3 text-[#6F6A78]">
                                            Cegah order fiktif / walk-out
                                        </span>
                                    </span>
                                    <OwnerToggle
                                        checked={settings.qrisDeposit}
                                        onChange={(checked) =>
                                            setSettings((current) => ({
                                                ...current,
                                                qrisDeposit: checked,
                                            }))
                                        }
                                        label="Wajib bayar QRIS di awal"
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>
                                        <span className="block text-[10px] font-medium text-[#3F3B47]">
                                            Batas Maksimal Tamu
                                        </span>
                                        <span className="mt-0.5 block text-[8.5px] text-[#6F6A78]">
                                            Kapasitas fisik meja
                                        </span>
                                    </span>
                                    <div className="flex items-center gap-1.5 rounded-lg border border-[#E4E7F1] bg-[#F8F9FE] px-1.5 py-1">
                                        <button
                                            type="button"
                                            aria-label="Kurangi batas tamu"
                                            onClick={() =>
                                                setSettings((current) => ({
                                                    ...current,
                                                    maxParty: Math.max(
                                                        1,
                                                        current.maxParty - 1,
                                                    ),
                                                }))
                                            }
                                            className="inline-flex h-5 w-5 items-center justify-center rounded text-[#6F6A78] hover:bg-white hover:text-[#231F2B]"
                                        >
                                            <Minus
                                                aria-hidden="true"
                                                className="h-3 w-3"
                                            />
                                        </button>
                                        <span className="min-w-10 text-center text-[10px] font-semibold text-[#3F3B47]">
                                            {settings.maxParty} Orang
                                        </span>
                                        <button
                                            type="button"
                                            aria-label="Tambah batas tamu"
                                            onClick={() =>
                                                setSettings((current) => ({
                                                    ...current,
                                                    maxParty: Math.min(
                                                        20,
                                                        current.maxParty + 1,
                                                    ),
                                                }))
                                            }
                                            className="inline-flex h-5 w-5 items-center justify-center rounded text-[#6F6A78] hover:bg-white hover:text-[#231F2B]"
                                        >
                                            <Plus
                                                aria-hidden="true"
                                                className="h-3 w-3"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <OwnerButton
                                variant="primary"
                                className="w-full"
                                icon={Download}
                                onClick={downloadQr}
                            >
                                Download QR Meja (SVG)
                            </OwnerButton>
                            <OwnerButton
                                variant="danger"
                                className="w-full"
                                icon={LockKeyhole}
                                onClick={() => {
                                    const nextOff = !temporarilyOff;

                                    setTemporarilyOff(nextOff);
                                    setZones((currentZones) =>
                                        currentZones.map((zone) => ({
                                            ...zone,
                                            tables: zone.tables?.map((table) =>
                                                table.id === selected.id
                                                    ? {
                                                          ...table,
                                                          qrActive: !nextOff,
                                                      }
                                                    : table,
                                            ),
                                            stools: zone.stools?.map((stool) =>
                                                stool.id === selected.id
                                                    ? {
                                                          ...stool,
                                                          qrActive: !nextOff,
                                                      }
                                                    : stool,
                                            ),
                                        })),
                                    );
                                    notify(
                                        nextOff
                                            ? `Meja #${selected.id} dinonaktifkan sementara.`
                                            : `Meja #${selected.id} diaktifkan kembali.`,
                                    );
                                }}
                            >
                                {temporarilyOff
                                    ? 'Aktifkan Meja Kembali'
                                    : 'Nonaktifkan Meja Sementara'}
                            </OwnerButton>
                        </div>
                    </aside>
                )}
            </div>

            <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                            Ringkasan Shift Barista Bertugas Hari Ini
                        </h2>
                        <p className="mt-0.5 text-[9.5px] text-[#6F6A78]">
                            Roster harian gerai Senopati • Shift Pagi/Sore &
                            KDS
                        </p>
                    </div>
                    <OwnerButton
                        variant="secondary"
                        size="sm"
                        icon={CalendarDays}
                        onClick={() => onNavigate('schedule')}
                    >
                        Kelola Jadwal &amp; Tukar Shift
                    </OwnerButton>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {[shiftSummary.morning, shiftSummary.evening].map(
                        (shift, index) => (
                            <div
                                key={shift.label}
                                className="rounded-xl border border-[#E8EDF8] bg-[#F6F8FE] p-3"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#3F3B47]">
                                        {index === 0 ? (
                                            <Sun className="h-3.5 w-3.5 text-[#B67932]" />
                                        ) : (
                                            <Moon className="h-3.5 w-3.5 text-[#6F6A78]" />
                                        )}
                                        {shift.label}
                                    </span>
                                    <span className="rounded-full bg-[#D6FBEB] px-1.5 py-0.5 text-[7.5px] font-semibold text-[#0D7A5F]">
                                        {shift.status}
                                    </span>
                                </div>
                                <div className="mt-2.5 space-y-1.5">
                                    {shift.staff.map((staff) => (
                                        <div
                                            key={staff.name}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE7D7] text-[7px] font-bold text-[#8D4B00]">
                                                {staff.initials}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-[8.5px] font-semibold text-[#3F3B47]">
                                                    {staff.name}
                                                </span>
                                                <span className="block truncate text-[7.5px] text-[#6F6A78]">
                                                    {staff.role}
                                                </span>
                                            </span>
                                            <span className="rounded-full bg-[#D6FBEB] px-1.5 py-0.5 text-[7px] font-semibold text-[#0D7A5F]">
                                                {staff.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-2 border-t border-[#E4EAF8] pt-1.5 text-[7.5px] text-[#6F6A78]">
                                    {shift.checkIn}
                                </p>
                            </div>
                        ),
                    )}

                    <div className="rounded-xl border border-[#E8EDF8] bg-[#F6F8FE] p-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#3F3B47]">
                                <Gauge
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 text-[#8D4B00]"
                                />
                                Kecepatan Penyajian KDS
                            </span>
                            <span className="rounded-full bg-[#D6FBEB] px-1.5 py-0.5 text-[7.5px] font-semibold text-[#0D7A5F]">
                                {shiftSummary.performance.status}
                            </span>
                        </div>
                        <dl className="mt-2.5 space-y-1.5 text-[8px]">
                            <div className="flex items-center justify-between gap-2">
                                <dt className="text-[#6F6A78]">
                                    Rata-rata Espresso Base:
                                </dt>
                                <dd className="font-semibold text-[#3F3B47]">
                                    {shiftSummary.performance.espresso}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <dt className="text-[#6F6A78]">
                                    Rata-rata Manual Pour Over:
                                </dt>
                                <dd className="font-semibold text-[#3F3B47]">
                                    {shiftSummary.performance.manual}
                                </dd>
                            </div>
                        </dl>
                        <p className="mt-2 border-t border-[#E4EAF8] pt-1.5 text-[7.5px] text-[#6F6A78]">
                            Total Pesanan Selesai Hari Ini:
                        </p>
                        <p className="mt-0.5 text-[15px] font-bold text-[#6F3A0E]">
                            {shiftSummary.performance.totalOrders}
                        </p>
                    </div>
                </div>
            </section>

            <OwnerModal
                show={addTableOpen}
                onClose={() => setAddTableOpen(false)}
                title="Tambah Meja Baru"
                description="Tambahkan meja ke zona operasional dan buat QR stand otomatis."
                maxWidth="md"
            >
                <form onSubmit={addTable}>
                    <div className="space-y-3 px-5 py-5">
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Zona meja
                            </span>
                            <select
                                value={newTableZone}
                                onChange={(event) =>
                                    setNewTableZone(event.target.value)
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                {tableZones
                                    .filter((zone) => zone.id !== 'bar')
                                    .map((zone) => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </option>
                                    ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Kapasitas kursi
                            </span>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={newTableCapacity}
                                onChange={(event) =>
                                    setNewTableCapacity(event.target.value)
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                        </label>
                        <p className="rounded-lg bg-[#F7F8FD] px-3 py-2 text-[9.5px] leading-4 text-[#6F6A78]">
                            QR stand meja baru akan dibuat otomatis dan dapat
                            langsung diunduh dari panel detail.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                        <OwnerButton
                            variant="ghost"
                            onClick={() => setAddTableOpen(false)}
                        >
                            Batal
                        </OwnerButton>
                        <OwnerButton
                            type="submit"
                            variant="primary"
                            icon={Plus}
                        >
                            Tambah Meja
                        </OwnerButton>
                    </div>
                </form>
            </OwnerModal>
        </div>
    );
}
