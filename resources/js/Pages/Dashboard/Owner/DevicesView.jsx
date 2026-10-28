import { useState } from 'react';
import {
    Activity,
    Bluetooth,
    CheckCircle2,
    Download,
    Eye,
    Info,
    Pencil,
    Plus,
    Printer,
    Speaker,
    Tablet,
    Trash2,
    Wifi,
} from 'lucide-react';
import OwnerButton from '@/Components/Owner/OwnerButton';
import OwnerModal from '@/Components/Owner/OwnerModal';
import OwnerOperationalTabs from '@/Components/Owner/OwnerTabs';
import OwnerPageHeader from '@/Components/Owner/OwnerPageHeader';
import OwnerToggle from '@/Components/Owner/OwnerToggle';
import {
    connectedDevices,
    defaultPrinterConfig,
    hardwareDevices,
} from '@/data/ownerOperations';

const hardwareIcons = {
    printer: Printer,
    tablet: Tablet,
    speaker: Speaker,
};

const roleTones = {
    peach: 'bg-[#FFE7D7] text-[#8D4B00]',
    blue: 'bg-[#EFF4FF] text-[#4C5B8A]',
};

const emptyDevice = {
    name: '',
    role: 'Struk Pembayaran',
    connectivity: '',
    route: '',
};

export default function DevicesView({ notify, onNavigate }) {
    const [config, setConfig] = useState(defaultPrinterConfig);
    const [devices, setDevices] = useState(connectedDevices);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [deviceModalOpen, setDeviceModalOpen] = useState(false);
    const [editingDeviceId, setEditingDeviceId] = useState(null);
    const [deviceDraft, setDeviceDraft] = useState(emptyDevice);
    const [pinging, setPinging] = useState(false);

    const updateConfig = (key, value) => {
        setConfig((current) => ({ ...current, [key]: value }));
    };

    const runTestPrint = () => {
        notify('Test print struk dikirim ke Epson TM-T82III.');
    };

    const pingDevices = () => {
        setPinging(true);
        notify('Ping dikirim ke perangkat KDS dan printer.');
        window.setTimeout(() => setPinging(false), 1200);
    };

    const openAddDevice = () => {
        setEditingDeviceId(null);
        setDeviceDraft(emptyDevice);
        setDeviceModalOpen(true);
    };

    const openEditDevice = (device) => {
        setEditingDeviceId(device.id);
        setDeviceDraft({
            name: device.name,
            role: device.role,
            connectivity: device.connectivity,
            route: device.route,
        });
        setDeviceModalOpen(true);
    };

    const saveDevice = (event) => {
        event.preventDefault();

        if (!deviceDraft.name.trim()) {
            notify('Nama perangkat wajib diisi.');
            return;
        }

        if (editingDeviceId) {
            setDevices((current) =>
                current.map((device) =>
                    device.id === editingDeviceId
                        ? { ...device, ...deviceDraft }
                        : device,
                ),
            );
            notify('Data perangkat diperbarui.');
        } else {
            setDevices((current) => [
                ...current,
                {
                    id: `device-${Date.now()}`,
                    name: deviceDraft.name,
                    serial: 'Baru ditambahkan',
                    role: deviceDraft.role,
                    roleTone: deviceDraft.role.toLowerCase().includes('display')
                        ? 'blue'
                        : 'peach',
                    connectivity:
                        deviceDraft.connectivity || 'Belum terhubung',
                    route: deviceDraft.route || 'Semua Meja',
                    status: 'Siap Cetak',
                    statusTone: 'green',
                },
            ]);
            notify('Perangkat baru ditambahkan ke rute cetak.');
        }

        setDeviceModalOpen(false);
    };

    const removeDevice = (device) => {
        if (!window.confirm(`Hapus ${device.name} dari daftar perangkat?`)) {
            return;
        }

        setDevices((current) =>
            current.filter((item) => item.id !== device.id),
        );
        notify(`${device.name} dihapus dari daftar perangkat.`);
    };

    return (
        <div className="space-y-5">
            <OwnerPageHeader
                eyebrow="Operasional Gerai / Perangkat Kasir & Printer"
                title="Pengaturan Perangkat Kasir & Printer"
                description="Kelola stasiun printer thermal dapur, printer kasir, tablet Barista KDS, dan perangkat soundbox QRIS."
                actions={
                    <>
                        <OwnerButton
                            variant="secondary"
                            icon={Printer}
                            onClick={runTestPrint}
                        >
                            Test Print Struk Kasir
                        </OwnerButton>
                        <OwnerButton
                            variant="secondary"
                            icon={Activity}
                            onClick={pingDevices}
                        >
                            {pinging ? 'Mengirim Ping...' : 'Ping Perangkat KDS'}
                        </OwnerButton>
                        <OwnerButton
                            variant="primary"
                            icon={Plus}
                            onClick={openAddDevice}
                        >
                            Tambah Perangkat Baru
                        </OwnerButton>
                    </>
                }
            >
                <OwnerOperationalTabs
                    active="devices"
                    onNavigate={onNavigate}
                />
            </OwnerPageHeader>

            <section>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-[#292632]">
                        <Wifi
                            aria-hidden="true"
                            className="h-4 w-4 text-[#8D4B00]"
                        />
                        Status Koneksi Hardware Gerai
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold text-[#0D7A5F]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0D7A5F]" />
                        Sinkronisasi Realtime
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {hardwareDevices.map((hardware) => {
                        const Icon = hardwareIcons[hardware.icon] ?? Printer;

                        return (
                            <article
                                key={hardware.id}
                                className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F3F8] text-[#6F6A78]">
                                        <Icon
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D6FBEB] px-2 py-0.5 text-[8.5px] font-semibold text-[#0D7A5F]">
                                        <span className="h-1 w-1 rounded-full bg-[#0D7A5F]" />
                                        {hardware.status}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-[12px] font-semibold text-[#231F2B]">
                                    {hardware.name}
                                </h3>
                                <p className="mt-0.5 text-[9.5px] text-[#6F6A78]">
                                    {hardware.role}
                                </p>
                                <p className="mt-3 border-t border-[#F3F2F6] pt-2 text-[8.5px] text-[#6F6A78]">
                                    {hardware.meta}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
                <div className="flex items-start gap-2.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF3E7] text-[#8D4B00]">
                        <Printer aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div>
                        <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                            Konfigurasi Cetak Struk &amp; Tiket Otomatis
                        </h2>
                        <p className="mt-0.5 text-[10px] text-[#6F6A78]">
                            Sesuaikan perilaku cetak otomatis dan format struk
                            kasir.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid gap-4 border-t border-[#F4F3F7] pt-4 lg:grid-cols-[1.1fr_1fr]">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-xl bg-[#F2F6FF] p-3.5">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-[11px] font-semibold text-[#231F2B]">
                                    Cetak Struk Otomatis (QRIS Berhasil)
                                </h3>
                                <p className="mt-1 text-[9px] leading-4 text-[#6F6A78]">
                                    Secara langsung mencetak 1 lembar struk
                                    pelanggan begitu transaksi QRIS dinyatakan
                                    lunas di meja/kasir.
                                </p>
                            </div>
                            <OwnerToggle
                                checked={config.autoReceipt}
                                onChange={(checked) =>
                                    updateConfig('autoReceipt', checked)
                                }
                                label="Cetak struk otomatis"
                            />
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-[#F2F6FF] p-3.5">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-[11px] font-semibold text-[#231F2B]">
                                    Tiket Pesanan Manual Brew &amp; Kitchen
                                </h3>
                                <p className="mt-1 text-[9px] leading-4 text-[#6F6A78]">
                                    Cetak tiket antrean terpisah untuk stasiun
                                    pour-over/espresso barista saat order baru
                                    masuk dari QRIS Meja.
                                </p>
                            </div>
                            <OwnerToggle
                                checked={config.manualTicket}
                                onChange={(checked) =>
                                    updateConfig('manualTicket', checked)
                                }
                                label="Cetak tiket manual brew"
                            />
                        </div>

                        <div>
                            <span className="text-[10.5px] font-semibold text-[#3F3B47]">
                                Ukuran Kertas Thermal Struk
                            </span>
                            <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                                {[
                                    {
                                        id: '80',
                                        title: '80 mm (Standar POS)',
                                        desc: 'Lebar penuh, font jelas, mendukung logo & grafik tinggi.',
                                    },
                                    {
                                        id: '58',
                                        title: '58 mm (Kompak Mobile)',
                                        desc: 'Cocok untuk printer saku Bluetooth portabel & EDC terintegrasi.',
                                    },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        aria-pressed={
                                            config.paperSize === option.id
                                        }
                                        onClick={() =>
                                            updateConfig(
                                                'paperSize',
                                                option.id,
                                            )
                                        }
                                        className={`rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                            config.paperSize === option.id
                                                ? 'border-[#B97A45] bg-[#FFF8F0]'
                                                : 'border-[#E4E7F1] bg-white hover:bg-[#FAFAFD]'
                                        }`}
                                    >
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-semibold text-[#3F3B47]">
                                                {option.title}
                                            </span>
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full border ${
                                                    config.paperSize === option.id
                                                        ? 'border-[#8D4B00] bg-[#8D4B00]'
                                                        : 'border-[#CFCBD8] bg-white'
                                                }`}
                                            />
                                        </span>
                                        <span className="mt-1.5 block text-[8.5px] leading-4 text-[#6F6A78]">
                                            {option.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#F4F7FF] p-3.5">
                        <h3 className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#3F3B47]">
                            <Info
                                aria-hidden="true"
                                className="h-3.5 w-3.5 text-[#6F6A78]"
                            />
                            Template Struk &amp; Personalisasi Footer
                        </h3>

                        <div className="mt-2.5 space-y-2">
                            {[
                                {
                                    key: 'includeLogo',
                                    label:
                                        'Sertakan Logo Monokrom CafeFinder & Merchant',
                                },
                                {
                                    key: 'includeQrCode',
                                    label:
                                        "Cetak QR Code: 'Beri Ulasan di CafeFinder App'",
                                },
                            ].map((option) => (
                                <label
                                    key={option.key}
                                    className="flex cursor-pointer items-start gap-2 text-[9.5px] text-[#55515E]"
                                >
                                    <input
                                        type="checkbox"
                                        checked={config[option.key]}
                                        onChange={(event) =>
                                            updateConfig(
                                                option.key,
                                                event.target.checked,
                                            )
                                        }
                                        className="mt-0.5 h-3.5 w-3.5 rounded border-[#CFCBD6] text-[#8D4B00] focus:ring-[#8D4B00]"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>

                        <label className="mt-3 block">
                            <span className="text-[9px] font-medium text-[#55515E]">
                                Pesan Sandi Wi-Fi Meja Pelanggan
                            </span>
                            <div className="mt-1 grid gap-1.5 sm:grid-cols-2">
                                <input
                                    value={config.wifiName}
                                    onChange={(event) =>
                                        updateConfig(
                                            'wifiName',
                                            event.target.value,
                                        )
                                    }
                                    aria-label="Nama WiFi"
                                    className="h-8 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9.5px] text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                />
                                <input
                                    value={config.wifiPassword}
                                    onChange={(event) =>
                                        updateConfig(
                                            'wifiPassword',
                                            event.target.value,
                                        )
                                    }
                                    aria-label="Sandi WiFi"
                                    className="h-8 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9.5px] text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                />
                            </div>
                        </label>

                        <label className="mt-2.5 block">
                            <span className="text-[9px] font-medium text-[#55515E]">
                                Catatan Kaki Struk (Footer Text)
                            </span>
                            <textarea
                                rows={3}
                                value={config.footer}
                                onChange={(event) =>
                                    updateConfig('footer', event.target.value)
                                }
                                className="mt-1 w-full rounded-lg border border-[#E2E5EF] bg-white px-2.5 py-2 text-[9.5px] leading-4 text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                        </label>

                        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#E3E9F8] pt-2.5">
                            <span className="text-[8px] text-[#6F6A78]">
                                Ukuran rendering:{' '}
                                {config.paperSize === '80'
                                    ? '576 dots (80mm)'
                                    : '384 dots (58mm)'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(true)}
                                className="inline-flex items-center gap-1 rounded text-[8.5px] font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                <Eye aria-hidden="true" className="h-3 w-3" />
                                Lihat Preview Cetak Fisik
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                            Daftar Perangkat Terhubung &amp; Rute Pemetaan Meja
                        </h2>
                        <p className="mt-0.5 max-w-[520px] text-[10px] leading-4 text-[#6F6A78]">
                            Tentukan printer/display mana yang akan menerima
                            pesanan dari zona meja tertentu.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-medium text-[#6F6A78]">
                            Zona:
                        </span>
                        {[
                            'Indoor Bar (Meja 01 – 10)',
                            'Outdoor Garden (Meja 11 – 25)',
                        ].map((zone) => (
                            <span
                                key={zone}
                                className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[8.5px] font-medium text-[#4C5B8A]"
                            >
                                {zone}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="mt-3 text-[9px] text-[#6F6A78] sm:hidden">
                    Geser tabel ke samping untuk melihat konektivitas, rute, dan status.
                </p>
                <div
                    tabIndex={0}
                    role="region"
                    aria-label="Tabel perangkat terhubung"
                    className="mt-2 overflow-x-auto sm:mt-4"
                >
                    <table className="w-full min-w-[820px] border-collapse text-left">
                        <caption className="sr-only">
                            Daftar perangkat terhubung dan rute pemetaan pesanan
                        </caption>
                        <thead>
                            <tr className="border-b border-[#F0EFF4] text-[9px] font-medium text-[#6F6A78]">
                                <th className="pb-2.5 pl-0 pr-3">Nama Perangkat</th>
                                <th className="px-3 pb-2.5">Tipe &amp; Peran</th>
                                <th className="px-3 pb-2.5">Konektivitas</th>
                                <th className="px-3 pb-2.5">Rute Pemetaan Pesanan</th>
                                <th className="px-3 pb-2.5">Status</th>
                                <th className="pb-2.5 pl-3 pr-0 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device) => (
                                <tr
                                    key={device.id}
                                    className="border-b border-[#F4F3F7] last:border-0"
                                >
                                    <td className="py-3 pl-0 pr-3 align-middle">
                                        <p className="text-[10.5px] font-semibold text-[#231F2B]">
                                            {device.name}
                                        </p>
                                        <p className="mt-0.5 text-[8.5px] text-[#6F6A78]">
                                            {device.serial}
                                        </p>
                                    </td>
                                    <td className="px-3 py-3 align-middle">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-[8.5px] font-semibold ${
                                                roleTones[device.roleTone] ??
                                                roleTones.peach
                                            }`}
                                        >
                                            {device.role}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 align-middle text-[9px] text-[#55515E]">
                                        {device.connectivity}
                                    </td>
                                    <td className="px-3 py-3 align-middle text-[9px] text-[#55515E]">
                                        {device.route}
                                    </td>
                                    <td className="px-3 py-3 align-middle">
                                        <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#0D7A5F]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#0D7A5F]" />
                                            {device.status}
                                        </span>
                                    </td>
                                    <td className="py-3 pl-3 pr-0 align-middle">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                aria-label={`Edit ${device.name}`}
                                                onClick={() =>
                                                    openEditDevice(device)
                                                }
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#6F6A78] transition hover:bg-[#F5F4F8] hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                            >
                                                <Pencil
                                                    aria-hidden="true"
                                                    className="h-3.5 w-3.5"
                                                />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Hapus ${device.name}`}
                                                onClick={() =>
                                                    removeDevice(device)
                                                }
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#6F6A78] transition hover:bg-[#FFF4F2] hover:text-[#B42318] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                            >
                                                <Trash2
                                                    aria-hidden="true"
                                                    className="h-3.5 w-3.5"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-4 flex items-start gap-1.5 border-t border-[#F0EFF4] pt-3 text-[8.5px] leading-4 text-[#6F6A78]">
                    <Info
                        aria-hidden="true"
                        className="mt-0.5 h-3 w-3 shrink-0"
                    />
                    Jika printer thermal tidak terdeteksi di LAN, periksa apak
                    kabel Ethernet terpasang pada router yang sama. Buka
                    Panduan Instalasi Driver &amp; IP Static.
                </p>
            </section>

            <OwnerModal
                show={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="Preview Cetak Fisik"
                description={`Epson TM-T82III · Kertas ${config.paperSize}mm`}
                maxWidth="md"
            >
                <div className="px-5 py-5">
                    <div className="mx-auto max-w-[280px] rounded-lg border border-[#E2E5EF] bg-white p-4 font-mono text-[9px] leading-4 text-[#3F3B47] shadow-sm">
                        <div className="text-center">
                            <p className="text-[12px] font-bold tracking-[0.14em]">
                                ARTISAN ROASTERY
                            </p>
                            <p className="mt-1 text-[8px] text-[#6F6A78]">
                                Senopati Flagship · JKT
                            </p>
                            <p className="mt-0.5 text-[8px] text-[#6F6A78]">
                                Order #TR-884 · Meja #01
                            </p>
                        </div>
                        <div className="my-3 border-t border-dashed border-[#D8D4DE]" />
                        <div className="space-y-1">
                            <div className="flex justify-between gap-3">
                                <span>Signature Cold Drip ×2</span>
                                <span>96.000</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span>Truffle Croissant ×1</span>
                                <span>32.000</span>
                            </div>
                        </div>
                        <div className="my-3 border-t border-dashed border-[#D8D4DE]" />
                        <div className="flex justify-between text-[10px] font-bold">
                            <span>TOTAL</span>
                            <span>Rp 128.000</span>
                        </div>
                        <p className="mt-1 text-[8px] text-[#0D7A5F]">
                            QRIS · LUNAS
                        </p>
                        <div className="my-3 border-t border-dashed border-[#D8D4DE]" />
                        {config.includeQrCode && (
                            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#231F2B] p-1">
                                <div className="grid h-full w-full grid-cols-5 gap-0.5">
                                    {Array.from({ length: 25 }).map(
                                        (_, index) => (
                                            <span
                                                key={index}
                                                className={`${
                                                    [0, 1, 2, 4, 5, 7, 9, 10, 12, 14, 15, 17, 19, 20, 22, 24].includes(
                                                        index,
                                                    )
                                                        ? 'bg-[#231F2B]'
                                                        : 'bg-white'
                                                }`}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                        <p className="mt-3 text-center text-[8px] leading-3 text-[#6F6A78]">
                            {config.footer}
                        </p>
                        <p className="mt-2 text-center text-[8px] font-semibold">
                            Terima kasih · CafeFinder
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                    <OwnerButton
                        variant="secondary"
                        icon={Download}
                        onClick={() => notify('Preview struk diunduh.')}
                    >
                        Unduh Preview
                    </OwnerButton>
                    <OwnerButton
                        variant="primary"
                        onClick={() => setPreviewOpen(false)}
                    >
                        Tutup
                    </OwnerButton>
                </div>
            </OwnerModal>

            <OwnerModal
                show={deviceModalOpen}
                onClose={() => setDeviceModalOpen(false)}
                title={
                    editingDeviceId
                        ? 'Edit Perangkat'
                        : 'Tambah Perangkat Baru'
                }
                description="Hubungkan printer, display KDS, atau soundbox QRIS ke gerai ini."
                maxWidth="md"
            >
                <form onSubmit={saveDevice}>
                    <div className="space-y-3 px-5 py-5">
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Nama perangkat
                            </span>
                            <input
                                value={deviceDraft.name}
                                onChange={(event) =>
                                    setDeviceDraft((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }))
                                }
                                placeholder="Contoh: Epson TM-T82III"
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Tipe &amp; peran
                            </span>
                            <select
                                value={deviceDraft.role}
                                onChange={(event) =>
                                    setDeviceDraft((current) => ({
                                        ...current,
                                        role: event.target.value,
                                    }))
                                }
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            >
                                <option>Struk Pembayaran</option>
                                <option>Tiket Barista Espresso</option>
                                <option>Display KDS Barista</option>
                                <option>Speaker Notifikasi Audio</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Konektivitas
                            </span>
                            <input
                                value={deviceDraft.connectivity}
                                onChange={(event) =>
                                    setDeviceDraft((current) => ({
                                        ...current,
                                        connectivity: event.target.value,
                                    }))
                                }
                                placeholder="Contoh: 192.168.1.103:9100 (LAN)"
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Rute pemetaan pesanan
                            </span>
                            <input
                                value={deviceDraft.route}
                                onChange={(event) =>
                                    setDeviceDraft((current) => ({
                                        ...current,
                                        route: event.target.value,
                                    }))
                                }
                                placeholder="Contoh: Semua Meja (Indoor & Outdoor)"
                                className="mt-1.5 h-9 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] text-[#292632] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                        <OwnerButton
                            variant="ghost"
                            onClick={() => setDeviceModalOpen(false)}
                        >
                            Batal
                        </OwnerButton>
                        <OwnerButton
                            type="submit"
                            variant="primary"
                            icon={CheckCircle2}
                        >
                            {editingDeviceId ? 'Simpan Perubahan' : 'Tambah Perangkat'}
                        </OwnerButton>
                    </div>
                </form>
            </OwnerModal>
        </div>
    );
}
