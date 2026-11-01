import { useRef, useState } from 'react';
import {
    Camera,
    Check,
    Coffee,
    Croissant,
    CupSoda,
    Image,
    Info,
    Plus,
    RefreshCw,
    Save,
    Sparkles,
    Star,
    Upload,
    Wallet,
    X,
} from 'lucide-react';
import OwnerButton from '@/Components/Owner/OwnerButton';
import OwnerPageHeader from '@/Components/Owner/OwnerPageHeader';
import OwnerToggle from '@/Components/Owner/OwnerToggle';
import { formatRupiah } from '@/data/ownerDashboard';
import {
    beanOptions,
    initialMenuDraft,
    menuCategories,
    menuDefaultImage,
    milkOptions,
    pourStages,
    sweetnessOptions,
    tastingNotePresets,
} from '@/data/ownerMenu';

const categoryIcons = {
    manual: Coffee,
    espresso: CupSoda,
    signature: Star,
    'non-coffee': CupSoda,
    pastry: Croissant,
};

const noteTones = {
    peach: 'bg-[#FFE7D7] text-[#8D4B00]',
    rose: 'bg-[#FDE8EC] text-[#B4234A]',
    amber: 'bg-[#FFF2D6] text-[#8D5A00]',
    brown: 'bg-[#F1E7DF] text-[#6F4A2F]',
    green: 'bg-[#E9FBF3] text-[#0D7A5F]',
    blue: 'bg-[#EFF4FF] text-[#4C5B8A]',
};

const inputClass =
    'h-10 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11.5px] text-[#292632] placeholder:text-[#8B8694] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15';

function FormCard({ icon: Icon, title, accessory, children }) {
    return (
        <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF3E7] text-[#8D4B00]">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#211D29]">
                        {title}
                    </h2>
                </div>
                {accessory}
            </div>
            <div className="mt-4 border-t border-[#F4F3F7] pt-4">
                {children}
            </div>
        </section>
    );
}

export default function MenuEditorView({ notify }) {
    const [form, setForm] = useState(initialMenuDraft);
    const [photoPreview, setPhotoPreview] = useState(menuDefaultImage);
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [showCustomOption, setShowCustomOption] = useState(false);
    const [customLabel, setCustomLabel] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const photoInput = useRef(null);

    const price = Number(form.price) || 0;
    const hpp = Number(form.hpp) || 0;
    const profit = price - hpp;
    const margin = price > 0 ? (profit / price) * 100 : 0;
    const marginWidth = Math.max(0, Math.min(100, margin));
    const marginTone =
        margin >= 55
            ? 'text-[#0D7A5F]'
            : margin >= 40
              ? 'text-[#8D5A00]'
              : 'text-[#B4234A]';
    const marginLabel =
        margin >= 55
            ? 'Sangat Sehat'
            : margin >= 40
              ? 'Cukup Sehat'
              : 'Perlu Disesuaikan';

    const update = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const toggleNote = (note) => {
        const isSelected = form.notes.includes(note);

        update(
            'notes',
            isSelected
                ? form.notes.filter((currentNote) => currentNote !== note)
                : [...form.notes, note],
        );
    };

    const addNote = () => {
        const trimmed = newNote.trim();

        if (!trimmed || form.notes.includes(trimmed)) {
            return;
        }

        update('notes', [...form.notes, trimmed]);
        setNewNote('');
        setShowNoteInput(false);
        notify(`Tasting note “${trimmed}” ditambahkan.`);
    };

    const addCustomOption = () => {
        const trimmed = customLabel.trim();

        if (!trimmed) {
            return;
        }

        update('customOptions', [
            ...form.customOptions,
            {
                id: `custom-${Date.now()}`,
                label: trimmed,
                price: Number(customPrice) || 0,
            },
        ]);
        setCustomLabel('');
        setCustomPrice('');
        setShowCustomOption(false);
        notify('Opsi kustom pelanggan ditambahkan.');
    };

    const handlePhoto = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notify('Ukuran foto maksimal 5MB.');
            event.target.value = '';
            return;
        }

        setPhotoPreview(URL.createObjectURL(file));
        event.target.value = '';
        notify('Foto menu diperbarui.');
    };

    const saveDraft = () => {
        notify(`Draf “${form.name}” disimpan.`);
    };

    const publish = () => {
        notify(`“${form.name}” dipublikasikan ke menu digital.`);
    };

    const sync = () => {
        notify('Menu & resep tersinkron ke POS dan QR menu meja.');
    };

    return (
        <div className="space-y-5">
            <OwnerPageHeader
                eyebrow="Profil & Menu Kafe / Tambah Menu Baru"
                title="Tambah Item Menu & Resep Artisanal"
                badge={
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D6FBEB] px-2.5 py-1 text-[10px] font-semibold text-[#0D7A5F]">
                        <RefreshCw
                            aria-hidden="true"
                            className="h-3 w-3"
                        />
                        Auto-Sync POS
                    </span>
                }
                description="Konfigurasi informasi katalog, takaran seduh barista profesional, dan perhitungan margin harga otomatis."
                actions={
                    <>
                        <OwnerButton
                            variant="secondary"
                            icon={Save}
                            onClick={saveDraft}
                        >
                            Simpan Draf
                        </OwnerButton>
                        <OwnerButton
                            variant="primary"
                            icon={Upload}
                            onClick={publish}
                        >
                            Publikasikan ke Menu Digital
                        </OwnerButton>
                    </>
                }
            />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                <div className="space-y-5">
                    <FormCard
                        icon={Coffee}
                        title="Informasi Dasar Menu"
                        accessory={
                            <span className="rounded-full bg-[#F4F3F8] px-2.5 py-1 text-[9px] font-semibold text-[#6F6A78]">
                                Wajib Diisi
                            </span>
                        }
                    >
                        <div>
                            <label
                                htmlFor="menu-name"
                                className="text-[11px] font-semibold text-[#4A4552]"
                            >
                                Nama Menu Kopi / Item
                            </label>
                            <input
                                id="menu-name"
                                value={form.name}
                                onChange={(event) =>
                                    update('name', event.target.value)
                                }
                                className={`${inputClass} mt-1.5`}
                                placeholder="Contoh: Kerinci Natural Anaerobic V60"
                            />
                            <p className="mt-1 text-[9.5px] text-[#6F6A78]">
                                Gunakan penamaan yang deskriptif dan
                                mencerminkan profil seduhan.
                            </p>
                        </div>

                        <div className="mt-4">
                            <span className="text-[11px] font-semibold text-[#4A4552]">
                                Kategori Menu
                            </span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {menuCategories.map((category) => {
                                    const Icon =
                                        categoryIcons[category.id] ?? Coffee;
                                    const isSelected =
                                        form.category === category.id;

                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() =>
                                                update('category', category.id)
                                            }
                                            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[10.5px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                                isSelected
                                                    ? 'border-[#8D4B00] bg-[#56311F] text-white'
                                                    : 'border-[#E2E5EF] bg-white text-[#55515E] hover:bg-[#F8F9FE]'
                                            }`}
                                        >
                                            <Icon
                                                aria-hidden="true"
                                                className="h-3.5 w-3.5"
                                            />
                                            {category.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4">
                            <span className="text-[11px] font-semibold text-[#4A4552]">
                                Deskripsi Rasa &amp; Tasting Notes
                            </span>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                {tastingNotePresets.map((note) => {
                                    const isSelected = form.notes.includes(
                                        note.label,
                                    );

                                    return (
                                        <button
                                            key={note.label}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() =>
                                                toggleNote(note.label)
                                            }
                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                                isSelected
                                                    ? `${noteTones[note.tone]} border-transparent`
                                                    : 'border-[#E4E7F1] bg-white text-[#77727F] hover:border-[#CFCBDA]'
                                            }`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                            {note.label}
                                        </button>
                                    );
                                })}
                                {form.notes
                                    .filter(
                                        (note) =>
                                            !tastingNotePresets.some(
                                                (preset) =>
                                                    preset.label === note,
                                            ),
                                    )
                                    .map((note) => (
                                        <span
                                            key={note}
                                            className="inline-flex items-center gap-1 rounded-full bg-[#E9FBF3] px-2.5 py-1 text-[9.5px] font-medium text-[#0D7A5F]"
                                        >
                                            {note}
                                        </span>
                                    ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNoteInput((current) => !current)
                                    }
                                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#CFCBD8] px-2.5 py-1 text-[9.5px] font-medium text-[#6F6A78] transition hover:border-[#8D4B00] hover:text-[#8D4B00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                >
                                    <Plus
                                        aria-hidden="true"
                                        className="h-3 w-3"
                                    />
                                    Tambah Note
                                </button>
                            </div>
                            {showNoteInput && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <input
                                        value={newNote}
                                        onChange={(event) =>
                                            setNewNote(event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                addNote();
                                            }
                                        }}
                                        placeholder="Contoh: Citrus"
                                        aria-label="Tasting note baru"
                                        className={`${inputClass} h-9 max-w-55 text-[10.5px]`}
                                    />
                                    <OwnerButton
                                        size="sm"
                                        variant="primary"
                                        onClick={addNote}
                                    >
                                        Tambah
                                    </OwnerButton>
                                    <OwnerButton
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowNoteInput(false)}
                                    >
                                        Batal
                                    </OwnerButton>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label
                                htmlFor="menu-description"
                                className="text-[11px] font-semibold text-[#4A4552]"
                            >
                                Deskripsi Rasa
                            </label>
                            <textarea
                                id="menu-description"
                                rows={4}
                                value={form.description}
                                onChange={(event) =>
                                    update('description', event.target.value)
                                }
                                className="mt-1.5 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 py-2.5 text-[11px] leading-5 text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                        </div>

                        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl border border-[#E7ECF9] bg-[#F6F8FE] p-3">
                                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#5D6B96] shadow-sm">
                                    <Sparkles
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10.5px] font-semibold text-[#3F3B47]">
                                        Rekomendasi Barista
                                    </p>
                                    <p className="mt-0.5 text-[9px] text-[#6F6A78]">
                                        Tampil di banner teratas
                                    </p>
                                </div>
                                <OwnerToggle
                                    checked={form.baristaRecommendation}
                                    onChange={(checked) =>
                                        update(
                                            'baristaRecommendation',
                                            checked,
                                        )
                                    }
                                    label="Rekomendasi barista"
                                />
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-[#E7ECF9] bg-[#F6F8FE] p-3">
                                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0D7A5F] shadow-sm">
                                    <Check
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10.5px] font-semibold text-[#3F3B47]">
                                        Status Stok Menu
                                    </p>
                                    <p className="mt-0.5 text-[9px] text-[#6F6A78]">
                                        Tersedia (Ready to Brew)
                                    </p>
                                </div>
                                <OwnerToggle
                                    checked={form.inStock}
                                    onChange={(checked) =>
                                        update('inStock', checked)
                                    }
                                    label="Status stok menu"
                                />
                            </div>
                        </div>
                    </FormCard>

                    <FormCard
                        icon={Image}
                        title="Foto Estetis Menu"
                        accessory={
                            <span className="text-[9px] text-[#6F6A78]">
                                Rasio 1:1 atau 4:3 direkomendasikan
                            </span>
                        }
                    >
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative h-32 w-44 shrink-0 overflow-hidden rounded-xl bg-[#F4F3F8]">
                                <img
                                    src={photoPreview}
                                    alt="Pratinjau foto menu"
                                    className="h-full w-full object-cover"
                                />
                                <span className="absolute bottom-2 left-2 rounded-md bg-[#231F2B]/80 px-1.5 py-0.5 text-[8px] font-semibold text-white">
                                    Foto Utama
                                </span>
                            </div>

                            <div className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D4DF] bg-[#FBFBFE] p-4 text-center">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE9D7] text-[#8D4B00]">
                                    <Camera
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <p className="mt-2 text-[10.5px] font-semibold text-[#3F3B47]">
                                    Tarik &amp; lepas foto atau pilih dari file
                                </p>
                                <p className="mt-0.5 text-[9px] text-[#6F6A78]">
                                    Maksimal 5MB (PNG, JPG, WebP). Tampilkan
                                    lighting natural kafe.
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <OwnerButton
                                        size="sm"
                                        variant="secondary"
                                        icon={Upload}
                                        onClick={() =>
                                            photoInput.current?.click()
                                        }
                                    >
                                        Pilih Foto
                                    </OwnerButton>
                                    {photoPreview !== menuDefaultImage && (
                                        <OwnerButton
                                            size="sm"
                                            variant="ghost"
                                            icon={X}
                                            onClick={() =>
                                                setPhotoPreview(menuDefaultImage)
                                            }
                                        >
                                            Hapus
                                        </OwnerButton>
                                    )}
                                </div>
                                <input
                                    ref={photoInput}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handlePhoto}
                                    className="sr-only"
                                />
                            </div>
                        </div>
                    </FormCard>

                    <FormCard
                        icon={Star}
                        title="Kustomisasi Pelanggan (QR Menu & Kasir)"
                        accessory={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCustomOption((current) => !current)
                                }
                                className="rounded text-[10px] font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                + Tambah Opsi
                            </button>
                        }
                    >
                        <p className="-mt-1 mb-3 text-[9.5px] leading-4 text-[#6F6A78]">
                            Tentukan variabel kustom yang dapat dipilih
                            pengunjung saat memesan.
                        </p>

                        <div>
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Suhu Penyajian (Serving Temperature)
                            </span>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                                {[
                                    { id: 'hot', label: 'Hot / Panas (Default)' },
                                    {
                                        id: 'iced',
                                        label: 'Iced / Dingin (+Rp 2.000)',
                                    },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        aria-pressed={
                                            form.servingTemperature === option.id
                                        }
                                        onClick={() =>
                                            update(
                                                'servingTemperature',
                                                option.id,
                                            )
                                        }
                                        className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[10px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                            form.servingTemperature ===
                                            option.id
                                                ? 'border-[#B97A45] bg-[#FFF5EB] text-[#8D4B00]'
                                                : 'border-[#E2E5EF] bg-white text-[#55515E]'
                                        }`}
                                    >
                                        <Check
                                            aria-hidden="true"
                                            className="h-3 w-3"
                                        />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Beans Single Origin Pilihan
                            </span>
                            <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                                {beanOptions.map((bean) => {
                                    const isSelected =
                                        form.bean === bean.id;

                                    return (
                                        <button
                                            key={bean.id}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => update('bean', bean.id)}
                                            className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                                isSelected
                                                    ? 'border-[#B97A45] bg-[#FFF5EB]'
                                                    : 'border-[#E7E6ED] bg-white hover:bg-[#FAFAFD]'
                                            }`}
                                        >
                                            <span>
                                                <span className="block text-[10px] font-semibold text-[#3F3B47]">
                                                    {bean.label}
                                                    {bean.default && ' (Default)'}
                                                </span>
                                                <span className="mt-0.5 block text-[8.5px] text-[#6F6A78]">
                                                    {bean.extra > 0
                                                        ? `+${formatRupiah(bean.extra)}`
                                                        : 'Termasuk'}
                                                </span>
                                            </span>
                                            <span
                                                className={`h-2 w-2 rounded-full border ${
                                                    isSelected
                                                        ? 'border-[#8D4B00] bg-[#8D4B00]'
                                                        : 'border-[#CFCBD8] bg-white'
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    Pilihan Manis (Sweetness)
                                </span>
                                <select
                                    value={form.sweetness}
                                    onChange={(event) =>
                                        update('sweetness', event.target.value)
                                    }
                                    className={`${inputClass} mt-1.5`}
                                >
                                    {sweetnessOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    Opsi Susu Alternatif
                                </span>
                                <select
                                    value={form.milk}
                                    onChange={(event) =>
                                        update('milk', event.target.value)
                                    }
                                    className={`${inputClass} mt-1.5`}
                                >
                                    {milkOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {showCustomOption && (
                            <div className="mt-3 rounded-xl border border-[#E7ECF9] bg-[#F8FAFF] p-3">
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        value={customLabel}
                                        onChange={(event) =>
                                            setCustomLabel(event.target.value)
                                        }
                                        placeholder="Nama opsi kustom"
                                        aria-label="Nama opsi kustom"
                                        className={`${inputClass} h-9 flex-1 text-[10.5px]`}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={customPrice}
                                        onChange={(event) =>
                                            setCustomPrice(event.target.value)
                                        }
                                        placeholder="+Rp"
                                        aria-label="Harga tambahan opsi kustom"
                                        className={`${inputClass} h-9 sm:w-28`}
                                    />
                                    <OwnerButton
                                        size="sm"
                                        variant="primary"
                                        onClick={addCustomOption}
                                    >
                                        Tambah
                                    </OwnerButton>
                                </div>
                            </div>
                        )}

                        {form.customOptions.length > 0 && (
                            <ul className="mt-3 space-y-1.5">
                                {form.customOptions.map((option) => (
                                    <li
                                        key={option.id}
                                        className="flex items-center justify-between gap-2 rounded-lg bg-[#F7F8FD] px-3 py-2 text-[10px]"
                                    >
                                        <span className="font-medium text-[#3F3B47]">
                                            {option.label}
                                        </span>
                                        <span className="font-semibold text-[#8D4B00]">
                                            +{formatRupiah(option.price)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </FormCard>
                </div>

                <div className="space-y-5">
                    <FormCard
                        icon={Wallet}
                        title="Harga &amp; Margin Laba"
                        accessory={
                            <span className="rounded-md bg-[#CFF8E3] px-2.5 py-1 text-[9px] font-semibold text-[#0B6B4A]">
                                Kalkulator Otomatis
                            </span>
                        }
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    Harga Jual Normal
                                </span>
                                <span className="relative mt-1.5 block">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10.5px] text-[#6F6A78]">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(event) =>
                                            update('price', event.target.value)
                                        }
                                        className={`${inputClass} pl-9`}
                                    />
                                </span>
                            </label>
                            <label className="block">
                                <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                    Harga Promo / Event
                                </span>
                                <span className="relative mt-1.5 block">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10.5px] text-[#6F6A78]">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.promoPrice}
                                        onChange={(event) =>
                                            update(
                                                'promoPrice',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Opsional"
                                        className={`${inputClass} pl-9`}
                                    />
                                </span>
                            </label>
                        </div>

                        <label className="mt-3 block">
                            <span className="text-[10.5px] font-semibold text-[#4A4552]">
                                Estimasi HPP (Bahan Baku + Cup)
                            </span>
                            <span className="relative mt-1.5 block">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10.5px] text-[#6F6A78]">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.hpp}
                                    onChange={(event) =>
                                        update('hpp', event.target.value)
                                    }
                                    className={`${inputClass} pl-9`}
                                />
                            </span>
                        </label>
                        <p className="mt-1.5 text-[8.5px] leading-4 text-[#6F6A78]">
                            Beans 15g (Rp 10.500) + Filter Paper (Rp 1.500) +
                            Cup/Air (Rp 2.500)
                        </p>

                        <div className="mt-3 rounded-xl bg-[#F3F6FF] p-3.5">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <span className="text-[10px] font-semibold text-[#55515E]">
                                    Laba Kotor per Porsi:
                                </span>
                                <span className="text-[15px] font-bold text-[#6F3A0E]">
                                    {formatRupiah(Math.max(0, profit))}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2">
                                <span className="text-[10px] font-semibold text-[#55515E]">
                                    Margin Laba Bersih
                                </span>
                                <span
                                    className={`text-[11px] font-bold ${marginTone}`}
                                >
                                    {margin.toFixed(1)}% ({marginLabel})
                                </span>
                            </div>
                            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#E1E7F5]">
                                <div
                                    className="h-full rounded-full bg-[#0D7A5F] transition-[width]"
                                    style={{ width: `${marginWidth}%` }}
                                />
                            </div>
                            <p className="mt-2.5 flex items-start gap-1.5 text-[8.5px] leading-4 text-[#6F6A78]">
                                <Info
                                    aria-hidden="true"
                                    className="mt-0.5 h-3 w-3 shrink-0"
                                />
                                Standar margin kafe spesialisasi artisanal
                                berkisar 55% - 70%.
                            </p>
                        </div>
                    </FormCard>

                    <FormCard
                        icon={Coffee}
                        title="Parameter Seduh Barista"
                        accessory={
                            <span className="rounded-md bg-[#F4F3F8] px-2 py-1 text-[9px] font-medium text-[#6F6A78]">
                                Tampil di panduan brew-station kasir/bar
                            </span>
                        }
                    >
                        <div className="grid grid-cols-2 gap-2.5">
                            {[
                                {
                                    label: 'Dosis Kopi (Dose)',
                                    value: form.dose,
                                    unit: 'gram',
                                    key: 'dose',
                                    type: 'number',
                                },
                                {
                                    label: 'Rasio Seduh (Ratio)',
                                    value: form.ratio,
                                    unit: '(225ml)',
                                    key: 'ratio',
                                    type: 'text',
                                },
                                {
                                    label: 'Suhu Air (Temp)',
                                    value: form.waterTemp,
                                    unit: '°C',
                                    key: 'waterTemp',
                                    type: 'number',
                                },
                                {
                                    label: 'Target Waktu',
                                    value: form.targetTime,
                                    unit: 'menit',
                                    key: 'targetTime',
                                    type: 'text',
                                },
                            ].map((field) => (
                                <label
                                    key={field.key}
                                    className="rounded-lg border border-[#ECEBF1] bg-white p-2.5"
                                >
                                    <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6F6A78]">
                                        {field.label}
                                    </span>
                                    <span className="mt-1 flex items-end gap-1">
                                        <input
                                            type={field.type}
                                            value={field.value}
                                            onChange={(event) =>
                                                update(
                                                    field.key,
                                                    event.target.value,
                                                )
                                            }
                                            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] font-bold text-[#231F2B] focus:outline-none focus:ring-0"
                                        />
                                        <span className="shrink-0 pb-0.5 text-[8px] text-[#6F6A78]">
                                            {field.unit}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#6F6A78]">
                                    Tingkat Gilingan
                                </span>
                                <select
                                    value={form.grindSize}
                                    onChange={(event) =>
                                        update(
                                            'grindSize',
                                            event.target.value,
                                        )
                                    }
                                    className={`${inputClass} mt-1.5 h-9 text-[10px]`}
                                >
                                    <option>Medium-Coarse (V60 Standard)</option>
                                    <option>Medium (Aeropress)</option>
                                    <option>Fine (Espresso)</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#6F6A78]">
                                    Alat Seduh Rekomendasi
                                </span>
                                <select
                                    value={form.brewer}
                                    onChange={(event) =>
                                        update('brewer', event.target.value)
                                    }
                                    className={`${inputClass} mt-1.5 h-9 text-[10px]`}
                                >
                                    <option>Hario V60 Ceramic 02</option>
                                    <option>Kalita Wave 185</option>
                                    <option>Aeropress Clear</option>
                                </select>
                            </label>
                        </div>

                        <p className="mt-4 text-[9.5px] font-semibold text-[#4A4552]">
                            Panduan Tahapan Tuang (Pour Stages)
                        </p>
                        <ul className="mt-2 space-y-1.5">
                            {pourStages.map((stage) => (
                                <li
                                    key={stage.number}
                                    className="flex items-center gap-2 rounded-lg bg-[#F7F8FD] px-2.5 py-2 text-[9.5px]"
                                >
                                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8D4B00] text-[8px] font-bold text-white">
                                        {stage.number}
                                    </span>
                                    <span className="min-w-0 flex-1 font-medium text-[#3F3B47]">
                                        {stage.title}
                                    </span>
                                    <span className="shrink-0 text-[8.5px] text-[#6F6A78]">
                                        {stage.water} · {stage.time}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-3.5">
                            <span className="inline-flex items-center gap-1.5 text-[9px] text-[#6F6A78]">
                                <Check
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 text-[#0D7A5F]"
                                />
                                Data siap dikirim ke POS
                            </span>
                            <OwnerButton
                                variant="primary"
                                size="sm"
                                icon={RefreshCw}
                                onClick={sync}
                            >
                                Simpan &amp; Sinkronkan
                            </OwnerButton>
                        </div>
                    </FormCard>
                </div>
            </div>
        </div>
    );
}
