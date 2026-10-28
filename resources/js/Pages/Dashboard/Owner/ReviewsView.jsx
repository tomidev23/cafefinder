import { useEffect, useState } from 'react';
import {
    Armchair,
    Bookmark,
    BookmarkCheck,
    CheckCircle2,
    Clock3,
    Coffee,
    Croissant,
    Download,
    FileText,
    Info,
    MessageSquareReply,
    MoreVertical,
    Pencil,
    Pin,
    PlugZap,
    Send,
    Smile,
    Sparkles,
    Star,
    ThumbsUp,
    TrendingUp,
    Users,
    Wifi,
} from 'lucide-react';
import OwnerButton from '@/Components/Owner/OwnerButton';
import OwnerPageHeader from '@/Components/Owner/OwnerPageHeader';
import {
    categoryOptions,
    ratingDistribution,
    reviewActionSuggestion,
    reviewKeywords,
    reviewMetrics,
    reviews,
    sortOptions,
    statusOptions,
} from '@/data/ownerReviews';

const keywordIcons = {
    acidity: Coffee,
    wifi: Wifi,
    barista: Smile,
    wfc: Armchair,
    sockets: PlugZap,
    croissant: Croissant,
};

const keywordTones = {
    green: 'bg-[#E9FBF3] text-[#0D7A5F]',
    blue: 'bg-[#EFF4FF] text-[#4C5B8A]',
    rose: 'bg-[#FDEBEF] text-[#B4234A]',
};

const avatarTones = [
    'bg-[#FFE7D7] text-[#8D4B00]',
    'bg-[#E8EDFF] text-[#5D6B96]',
    'bg-[#FDE8EC] text-[#9E3A54]',
];

function Stars({ rating, className = 'h-3.5 w-3.5' }) {
    return (
        <span
            className="flex items-center gap-0.5"
            role="img"
            aria-label={`${rating} dari 5 bintang`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    aria-hidden="true"
                    className={`${className} ${
                        star <= rating
                            ? 'fill-[#B67932] text-[#B67932]'
                            : 'text-[#D8D4DE]'
                    }`}
                />
            ))}
        </span>
    );
}

const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

export default function ReviewsView({ branch, notify, onNavigate }) {
    const [timeRange, setTimeRange] = useState('30');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('Semua Kategori Ulasan');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [sortOrder, setSortOrder] = useState('relevance');
    const [page, setPage] = useState(1);
    const [replies, setReplies] = useState(() =>
        Object.fromEntries(
            reviews
                .filter((review) => review.ownerReply)
                .map((review) => [review.id, review.ownerReply]),
        ),
    );
    const [replyDrafts, setReplyDrafts] = useState(() =>
        Object.fromEntries(
            reviews.map((review) => [
                review.id,
                review.aiDraft || review.ownerReply?.text || '',
            ]),
        ),
    );
    const [openReplyId, setOpenReplyId] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [bookmarks, setBookmarks] = useState({});
    const [pins, setPins] = useState({});
    const [followUps, setFollowUps] = useState({});
    const [planned, setPlanned] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        setPage(1);
    }, [timeRange, ratingFilter, categoryFilter, statusFilter, sortOrder, replies]);

    const filteredReviews = reviews
        .filter((review) => {
            if (timeRange !== 'all' && review.daysAgo > Number(timeRange)) {
                return false;
            }

            if (ratingFilter === '5' && review.rating !== 5) {
                return false;
            }

            if (ratingFilter === '4' && review.rating !== 4) {
                return false;
            }

            if (ratingFilter === 'low' && review.rating > 3) {
                return false;
            }

            if (
                categoryFilter !== 'Semua Kategori Ulasan' &&
                review.category !== categoryFilter
            ) {
                return false;
            }

            if (statusFilter === 'Belum Dibalas' && replies[review.id]) {
                return false;
            }

            if (statusFilter === 'Sudah Dibalas' && !replies[review.id]) {
                return false;
            }

            return true;
        })
        .sort((first, second) => {
            if (sortOrder === 'highest') {
                return second.rating - first.rating;
            }

            if (sortOrder === 'lowest') {
                return first.rating - second.rating;
            }

            return (
                first.daysAgo - second.daysAgo || first.name.localeCompare(second.name)
            );
        });

    const pageSize = 3;
    const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleReviews = filteredReviews.slice(
        startIndex,
        startIndex + pageSize,
    );

    const updateReplyDraft = (id, value) => {
        setReplyDrafts((drafts) => ({ ...drafts, [id]: value }));
    };

    const submitReply = (review) => {
        const draft = replyDrafts[review.id]?.trim();

        if (!draft) {
            notify('Tulis balasan terlebih dahulu sebelum mengirim.');
            return;
        }

        setReplies((currentReplies) => ({
            ...currentReplies,
            [review.id]: {
                author: `Tanggapan Resmi ${branch.storeName}`,
                time: 'Baru saja',
                text: draft,
            },
        }));
        setOpenReplyId(null);
        setEditingReplyId(null);
        notify(`Balasan resmi untuk ${review.name} terkirim.`);
    };

    const handleBookmark = (review) => {
        const next = !bookmarks[review.id];
        setBookmarks((current) => ({ ...current, [review.id]: next }));
        notify(
            next
                ? `Ulasan ${review.name} disimpan ke sorotan.`
                : `Ulasan ${review.name} dihapus dari sorotan.`,
        );
    };

    const handlePin = (review) => {
        const next = !pins[review.id];
        setPins((current) => ({ ...current, [review.id]: next }));
        notify(
            next
                ? 'Ulasan dipin ke Sorotan Evaluasi.'
                : 'Pin Sorotan Evaluasi dilepas.',
        );
    };

    const copyReviewLink = async (review) => {
        const url = `${window.location.origin}/dashboard/owner?view=reviews#review-${review.id}`;

        try {
            await navigator.clipboard.writeText(url);
            notify('Tautan ulasan disalin.');
        } catch {
            notify('Tautan tidak dapat disalin di browser ini.');
        }

        setOpenMenuId(null);
    };

    const markFollowUp = (review) => {
        setFollowUps((current) => ({
            ...current,
            [review.id]: !current[review.id],
        }));
        setOpenMenuId(null);
        notify(`Ulasan ${review.name} ditandai untuk tindak lanjut.`);
    };

    const exportReviewsCsv = () => {
        const rows = [
            [
                'Nama',
                'Rating',
                'Kategori',
                'Waktu',
                'Status balasan',
                'Ulasan',
                'Balasan',
            ],
            ...filteredReviews.map((review) => [
                review.name,
                review.rating,
                review.category,
                review.date,
                replies[review.id] ? 'Sudah Dibalas' : 'Belum Dibalas',
                review.text,
                replies[review.id]?.text ?? '',
            ]),
        ];
        const csv = rows
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
                    .join(','),
            )
            .join('\r\n');
        const blob = new Blob([`\uFEFF${csv}`], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = `ulasan-${branch.id}-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        notify('Ekspor CSV ulasan berhasil dibuat.');
    };

    const printReport = () => {
        const reportWindow = window.open('', '_blank', 'width=980,height=720');

        if (!reportWindow) {
            notify('Izinkan pop-up untuk membuka laporan PDF.');
            return;
        }

        const rows = filteredReviews
            .map(
                (review) => `
                    <article style="border:1px solid #e5e3ea;border-radius:12px;padding:16px;margin-bottom:12px">
                        <div style="display:flex;justify-content:space-between;gap:16px">
                            <strong>${escapeHtml(review.name)} · ${review.rating}/5</strong>
                            <span style="color:#77727f">${escapeHtml(review.date)}</span>
                        </div>
                        <p style="color:#55515e;line-height:1.6">${escapeHtml(review.text)}</p>
                        <p style="font-size:12px;color:#0d7a5f">${
                            replies[review.id]
                                ? `Dibalas: ${escapeHtml(replies[review.id].text)}`
                                : 'Belum dibalas'
                        }</p>
                    </article>`,
            )
            .join('');

        reportWindow.document.write(`
            <!doctype html>
            <html lang="id">
                <head>
                    <meta charset="utf-8" />
                    <title>Laporan Ulasan — ${escapeHtml(branch.storeName)}</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #231f2b; padding: 32px; }
                        h1 { font-size: 24px; margin-bottom: 4px; }
                        p { color: #6f6a78; }
                        .stats { display: flex; gap: 24px; margin: 20px 0; }
                        .stats strong { display: block; font-size: 22px; color: #6f3a0e; }
                        article { break-inside: avoid; }
                    </style>
                </head>
                <body>
                    <h1>Laporan Ulasan &amp; Reputasi</h1>
                    <p>${escapeHtml(branch.storeName)} · ${escapeHtml(branch.label)} · ${new Date().toLocaleString('id-ID')}</p>
                    <div class="stats">
                        <div><span>Rating</span><strong>${reviewMetrics.rating} / 5.0</strong></div>
                        <div><span>Sentimen Positif</span><strong>${reviewMetrics.sentiment}</strong></div>
                        <div><span>Respons Owner</span><strong>${reviewMetrics.responseRate}</strong></div>
                    </div>
                    ${rows || '<p>Tidak ada ulasan pada filter ini.</p>'}
                </body>
            </html>
        `);
        reportWindow.document.close();
        reportWindow.focus();
        reportWindow.print();
    };

    const visibleStart = filteredReviews.length === 0 ? 0 : startIndex + 1;
    const visibleEnd = Math.min(startIndex + pageSize, filteredReviews.length);

    return (
        <div className="space-y-5">
            <OwnerPageHeader
                eyebrow="Operasional Gerai / Ulasan & Reputasi"
                title="Ulasan & Reputasi Pelanggan"
                badge={
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D6FBEB] px-2.5 py-1 text-[10px] font-semibold text-[#0D7A5F]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0D7A5F]" />
                        Live Sync
                    </span>
                }
                description="Pantau kepuasan penikmat kopi, analisis sentimen rasa beans, dan tanggapi ulasan terverifikasi QRIS secara resmi."
                actions={
                    <>
                        <OwnerButton
                            variant="secondary"
                            icon={Download}
                            onClick={exportReviewsCsv}
                        >
                            Ekspor CSV
                        </OwnerButton>
                        <OwnerButton
                            variant="primary"
                            icon={FileText}
                            onClick={printReport}
                        >
                            Laporan PDF
                        </OwnerButton>
                    </>
                }
            />

            <section
                aria-label="Ringkasan reputasi"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Skor Reputasi Rata-rata
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE7D7] text-[#B67932]">
                            <Star
                                aria-hidden="true"
                                className="h-4 w-4 fill-current"
                            />
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-[27px] font-bold tracking-[-0.04em] text-[#211D29]">
                            {reviewMetrics.rating}
                        </span>
                        <span className="text-[12px] font-medium text-[#77727F]">
                            / 5.0
                        </span>
                    </div>
                    <p className="mt-auto flex items-center gap-1 border-t border-[#F0EFF4] pt-3 text-[10.5px] font-semibold text-[#0D7A5F]">
                        <TrendingUp
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                        {reviewMetrics.ratingDelta} bln ini ({reviewMetrics.totalReviews} ulasan QR)
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Indeks Sentimen Positif
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#D3F8EA] text-[#118866]">
                            <Smile aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-3 text-[27px] font-bold tracking-[-0.04em] text-[#0D7A5F]">
                        {reviewMetrics.sentiment}
                    </div>
                    <p className="mt-auto border-t border-[#F0EFF4] pt-3 text-[10.5px] text-[#6F6A78]">
                        Rasa bersih V60 &amp; keramahan tim barista
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Tingkat Respons Pemilik
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE4E1] text-[#B65B4A]">
                            <MessageSquareReply
                                aria-hidden="true"
                                className="h-4 w-4"
                            />
                        </span>
                    </div>
                    <div className="mt-3 text-[27px] font-bold tracking-[-0.04em] text-[#211D29]">
                        {reviewMetrics.responseRate}
                    </div>
                    <p className="mt-auto border-t border-[#F0EFF4] pt-3 text-[10.5px] text-[#6F6A78]">
                        Rata-rata waktu balas{' '}
                        <span className="font-semibold text-[#3F3B47]">
                            {reviewMetrics.responseTime}
                        </span>
                    </p>
                </article>

                <article className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[12.5px] font-medium text-[#5F5B68]">
                            Status Roastery
                        </h2>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0DA] text-[#9A6218]">
                            <Users aria-hidden="true" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#FFF3E6] px-2.5 py-2 text-[11px] font-semibold leading-4 text-[#7A4317]">
                        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                        {reviewMetrics.rank}
                    </div>
                    <p className="mt-auto border-t border-[#F0EFF4] pt-3 text-[10.5px] text-[#6F6A78]">
                        Lencana tampil aktif di CafeFinder Leaderboard
                    </p>
                </article>
            </section>

            <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
                <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#211D29]">
                            Sebaran Rating Bintang
                        </h2>
                        <span className="text-[10.5px] text-[#6F6A78]">
                            {reviewMetrics.totalReviews} Total Ulasan
                        </span>
                    </div>

                    <div className="mt-4 space-y-2.5">
                        {ratingDistribution.map((row) => (
                            <div
                                key={row.stars}
                                className="grid grid-cols-[42px_minmax(0,1fr)_42px] items-center gap-2"
                            >
                                <span className="flex items-center gap-0.5 text-[10.5px] font-medium text-[#55515E]">
                                    {row.stars}
                                    <Star
                                        aria-hidden="true"
                                        className="h-3 w-3 fill-[#B67932] text-[#B67932]"
                                    />
                                </span>
                                <div className="h-2 overflow-hidden rounded-full bg-[#EEF1F9]">
                                    <div
                                        className="h-full rounded-full bg-[#8D4B00]"
                                        style={{
                                            width: `${Math.max(0.4, row.percent)}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-right text-[10.5px] font-semibold text-[#3F3B47]">
                                    {row.percent}%
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-3 text-[10.5px]">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#0D7A5F]">
                            <CheckCircle2
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                            />
                            99.4% Ulasan Terverifikasi QRIS
                        </span>
                        <button
                            type="button"
                            onClick={() => onNavigate('bi')}
                            className="rounded font-semibold text-[#8D4B00] transition hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            Detail Metrik
                        </button>
                    </div>
                </section>

                <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#211D29]">
                                Analisis Sentimen &amp; Top Keyword
                            </h2>
                            <p className="mt-1 text-[10.5px] leading-4 text-[#6F6A78]">
                                Ekstraksi otomatis dari ulasan penikmat kopi
                                30 hari terakhir
                            </p>
                        </div>
                        <Coffee
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-[#B67932]"
                        />
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {reviewKeywords.map((keyword) => {
                            const Icon = keywordIcons[keyword.id] ?? Coffee;

                            return (
                                <span
                                    key={keyword.id}
                                    className={`inline-flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-medium ${keywordTones[keyword.tone]}`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5 shrink-0"
                                    />
                                    <span className="truncate">
                                        {keyword.label}
                                    </span>
                                    <span className="shrink-0 opacity-70">
                                        ({keyword.count})
                                    </span>
                                </span>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex flex-col gap-2 rounded-xl border border-[#F4E6D8] bg-[#FDF7F0] p-3 text-[10.5px] leading-4 text-[#6F543F] sm:flex-row sm:items-center sm:justify-between">
                        <span className="flex items-start gap-2">
                            <Info
                                aria-hidden="true"
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B67932]"
                            />
                            <span>
                                <span className="font-semibold">Saran AI:</span>{' '}
                                {reviewActionSuggestion}
                            </span>
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setPlanned((current) => !current);
                                notify(
                                    planned
                                        ? 'Rencana perbaikan dilepas.'
                                        : 'Rencana perbaikan ditandai.',
                                );
                            }}
                            className="shrink-0 rounded font-semibold text-[#8D4B00] hover:text-[#603200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            {planned ? 'Rencana Ditandai' : 'Tandai Rencana'}
                        </button>
                    </div>
                </section>
            </div>

            <section className="rounded-2xl border border-[#ECECF3] bg-white p-4 shadow-sm shadow-[#20263A]/3">
                <div className="flex flex-wrap items-center gap-2">
                    <label className="sr-only" htmlFor="review-time-filter">
                        Rentang waktu ulasan
                    </label>
                    <select
                        id="review-time-filter"
                        value={timeRange}
                        onChange={(event) => setTimeRange(event.target.value)}
                        className="h-9 rounded-lg border border-[#E2E5EF] bg-[#F8F9FE] px-3 text-[11px] font-medium text-[#4A4552] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                    >
                        <option value="30">30 Hari Terakhir</option>
                        <option value="7">7 Hari Terakhir</option>
                        <option value="all">Semua Waktu</option>
                    </select>

                    <div
                        role="group"
                        aria-label="Filter rating"
                        className="flex items-center gap-1 rounded-lg border border-[#E2E5EF] bg-[#F8F9FE] p-1"
                    >
                        {[
                            { id: 'all', label: 'Semua' },
                            { id: '5', label: '★ 5' },
                            { id: '4', label: '★ 4' },
                            { id: 'low', label: '★ 1–3' },
                        ].map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                aria-pressed={ratingFilter === option.id}
                                onClick={() => setRatingFilter(option.id)}
                                className={`h-7 rounded-md px-2.5 text-[10.5px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    ratingFilter === option.id
                                        ? 'bg-white text-[#211D29] shadow-sm'
                                        : 'text-[#6F6A78] hover:text-[#211D29]'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <label className="sr-only" htmlFor="review-category">
                        Kategori ulasan
                    </label>
                    <select
                        id="review-category"
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(event.target.value)
                        }
                        className="h-9 rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] font-medium text-[#4A4552] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                    >
                        {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <div
                        role="group"
                        aria-label="Status balasan"
                        className="flex flex-wrap items-center gap-1"
                    >
                        {statusOptions.map((status) => (
                            <button
                                key={status}
                                type="button"
                                aria-pressed={statusFilter === status}
                                onClick={() => setStatusFilter(status)}
                                className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[10.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                    statusFilter === status
                                        ? 'bg-[#211D29] text-white'
                                        : 'bg-[#F4F4F8] text-[#55515E] hover:bg-[#EDEDF4]'
                                }`}
                            >
                                {status === 'Belum Dibalas' && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#E05A47]" />
                                )}
                                {status === 'Sudah Dibalas' && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#4C7BEA]" />
                                )}
                                {status}
                            </button>
                        ))}
                    </div>

                    <label
                        className="ml-auto flex items-center gap-1.5 text-[10.5px] text-[#6F6A78]"
                        htmlFor="review-sort"
                    >
                        Urutkan:
                        <select
                            id="review-sort"
                            value={sortOrder}
                            onChange={(event) =>
                                setSortOrder(event.target.value)
                            }
                            className="h-8 rounded-lg border border-[#E2E5EF] bg-white px-2 text-[10.5px] font-medium text-[#4A4552] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </section>

            <div className="space-y-4">
                {visibleReviews.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#DCD9E4] bg-white px-5 py-12 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F3F0] text-[#8D4B00]">
                            <Star aria-hidden="true" className="h-4 w-4" />
                        </div>
                        <h3 className="mt-3 text-[13px] font-semibold text-[#292632]">
                            Tidak ada ulasan pada filter ini
                        </h3>
                        <p className="mt-1 text-[11px] text-[#6F6A78]">
                            Coba longgarkan filter bintang atau status balasan.
                        </p>
                        <OwnerButton
                            variant="secondary"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                                setTimeRange('30');
                                setRatingFilter('all');
                                setCategoryFilter('Semua Kategori Ulasan');
                                setStatusFilter('Semua Status');
                                setSortOrder('relevance');
                            }}
                        >
                            Atur Ulang Filter
                        </OwnerButton>
                    </div>
                )}

                {visibleReviews.map((review, index) => {
                    const reply = replies[review.id];
                    const isOpen =
                        openReplyId === review.id ||
                        editingReplyId === review.id;
                    const avatarTone = avatarTones[index % avatarTones.length];

                    return (
                        <article
                            id={`review-${review.id}`}
                            key={review.id}
                            className="scroll-mt-24 rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3"
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarTone}`}
                                >
                                    {review.initials}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <h3 className="text-[13px] font-semibold text-[#231F2B]">
                                            {review.name}
                                        </h3>
                                        <span className="rounded-full bg-[#FFF3E7] px-2 py-0.5 text-[9px] font-semibold text-[#8D4B00]">
                                            {review.level}
                                        </span>
                                        <span className="text-[9.5px] text-[#6F6A78]">
                                            • {review.reviewCount} Ulasan
                                        </span>
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <Stars rating={review.rating} />
                                        <span className="text-[10px] font-semibold text-[#3F3B47]">
                                            {review.rating.toFixed(1)}
                                        </span>
                                        <span className="text-[9.5px] text-[#6F6A78]">
                                            • {review.date}
                                        </span>
                                        {review.needsReply && !reply && (
                                            <span className="rounded-full bg-[#FDE8EC] px-2 py-0.5 text-[8.5px] font-semibold text-[#B4234A] sm:hidden">
                                                {review.urgency}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-start gap-1.5">
                                    {review.verified && (
                                        <span className="hidden items-center gap-1 rounded-full bg-[#D6FBEB] px-2 py-1 text-[9px] font-semibold text-[#0D7A5F] sm:inline-flex">
                                            <CheckCircle2
                                                aria-hidden="true"
                                                className="h-3 w-3"
                                            />
                                            {review.verifiedLabel}
                                        </span>
                                    )}

                                    {review.needsReply && !reply && (
                                        <span className="hidden rounded-full bg-[#FDE8EC] px-2 py-1 text-[9px] font-semibold text-[#B4234A] sm:inline-flex">
                                            {review.urgency}
                                        </span>
                                    )}

                                    <div className="relative">
                                        <button
                                            type="button"
                                            aria-label={`Opsi ulasan ${review.name}`}
                                            aria-expanded={openMenuId === review.id}
                                            onClick={() =>
                                                setOpenMenuId(
                                                    openMenuId === review.id
                                                        ? null
                                                        : review.id,
                                                )
                                            }
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6F6A78] transition hover:bg-[#F5F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                        >
                                            <MoreVertical
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        </button>
                                        {openMenuId === review.id && (
                                            <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-[#E7E8F0] bg-white p-1 shadow-lg">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        copyReviewLink(review)
                                                    }
                                                    className="block w-full rounded-lg px-2.5 py-2 text-left text-[10.5px] font-medium text-[#4A4552] transition hover:bg-[#F7F8FD]"
                                                >
                                                    Salin tautan ulasan
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        markFollowUp(review)
                                                    }
                                                    className="block w-full rounded-lg px-2.5 py-2 text-left text-[10.5px] font-medium text-[#4A4552] transition hover:bg-[#F7F8FD]"
                                                >
                                                    Tandai tindak lanjut
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        aria-label={
                                            bookmarks[review.id]
                                                ? 'Hapus dari sorotan'
                                                : 'Simpan ke sorotan'
                                        }
                                        aria-pressed={Boolean(bookmarks[review.id])}
                                        onClick={() => handleBookmark(review)}
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6F6A78] transition hover:bg-[#F5F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                    >
                                        {bookmarks[review.id] ? (
                                            <BookmarkCheck
                                                aria-hidden="true"
                                                className="h-4 w-4 text-[#8D4B00]"
                                            />
                                        ) : (
                                            <Bookmark
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {review.verified && (
                                <p className="mt-2 text-[9px] font-medium text-[#0D7A5F] sm:hidden">
                                    {review.verifiedLabel}
                                </p>
                            )}

                            <p className="mt-3 max-w-[680px] text-[11.5px] leading-5 text-[#4E4A57]">
                                {review.text}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {review.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-[#F4F3F8] px-2 py-1 text-[9px] font-medium text-[#55515E]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {followUps[review.id] && (
                                    <span className="rounded-full bg-[#FFF3E6] px-2 py-1 text-[9px] font-semibold text-[#8D4B00]">
                                        Tindak lanjut
                                    </span>
                                )}
                            </div>

                            {review.hasPhoto && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <img
                                        src={review.photo}
                                        alt="Foto seduhan yang dibagikan pelanggan"
                                        className="h-24 w-32 rounded-xl object-cover"
                                    />
                                    <div className="flex h-24 w-32 flex-col items-center justify-center rounded-xl border border-[#E7EAF3] bg-[#F8F9FE] text-center">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6F6A78] shadow-sm">
                                            <FileText
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        </span>
                                        <span className="mt-1.5 text-[9px] font-semibold text-[#55515E]">
                                            Struk QRIS
                                        </span>
                                        <span className="text-[8px] text-[#6F6A78]">
                                            Terverifikasi
                                        </span>
                                    </div>
                                </div>
                            )}

                            {reply && editingReplyId !== review.id && (
                                <div className="mt-3 rounded-xl border border-[#E4EAF8] bg-[#F4F7FF] p-3.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#5A3A25]">
                                            <CheckCircle2
                                                aria-hidden="true"
                                                className="h-3.5 w-3.5 text-[#0D7A5F]"
                                            />
                                            {reply.author}{' '}
                                            <span className="font-medium text-[#6F6A78]">
                                                • {reply.time}
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingReplyId(review.id);
                                                setReplyDrafts((drafts) => ({
                                                    ...drafts,
                                                    [review.id]: reply.text,
                                                }));
                                            }}
                                            className="inline-flex items-center gap-1 rounded text-[10px] font-semibold text-[#6F6A78] transition hover:text-[#231F2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                        >
                                            <Pencil
                                                aria-hidden="true"
                                                className="h-3 w-3"
                                            />
                                            Edit Tanggapan
                                        </button>
                                    </div>
                                    <p className="mt-2 text-[10.5px] italic leading-4 text-[#55515E]">
                                        “{reply.text}”
                                    </p>
                                </div>
                            )}

                            {editingReplyId === review.id && (
                                <div className="mt-3 rounded-xl border border-[#E4EAF8] bg-[#F8FAFF] p-3.5">
                                    <label
                                        className="text-[10px] font-semibold text-[#4A4552]"
                                        htmlFor={`edit-reply-${review.id}`}
                                    >
                                        Edit tanggapan resmi
                                    </label>
                                    <textarea
                                        id={`edit-reply-${review.id}`}
                                        rows={3}
                                        value={replyDrafts[review.id]}
                                        onChange={(event) =>
                                            updateReplyDraft(
                                                review.id,
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 py-2 text-[10.5px] leading-4 text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                    />
                                    <div className="mt-2 flex justify-end gap-2">
                                        <OwnerButton
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                setEditingReplyId(null)
                                            }
                                        >
                                            Batal
                                        </OwnerButton>
                                        <OwnerButton
                                            size="sm"
                                            variant="primary"
                                            icon={Send}
                                            onClick={() => submitReply(review)}
                                        >
                                            Simpan Balasan
                                        </OwnerButton>
                                    </div>
                                </div>
                            )}

                            {!reply && review.needsReply && (
                                <div className="mt-3 rounded-xl border border-[#E4EAF8] bg-[#F4F7FF] p-3.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#4A4C86]">
                                            <Sparkles
                                                aria-hidden="true"
                                                className="h-3.5 w-3.5"
                                            />
                                            Template Rekomendasi AI (Ramah &amp; Solutif)
                                        </span>
                                        <span className="text-[9px] text-[#6F6A78]">
                                            Pilih respon cepat sekali klik
                                        </span>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={replyDrafts[review.id] ?? ''}
                                        onChange={(event) =>
                                            updateReplyDraft(
                                                review.id,
                                                event.target.value,
                                            )
                                        }
                                        aria-label={`Balasan untuk ${review.name}`}
                                        className="mt-2 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 py-2 text-[10.5px] leading-4 text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                    />
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <OwnerButton
                                            size="sm"
                                            variant="primary"
                                            icon={MessageSquareReply}
                                            onClick={() => submitReply(review)}
                                        >
                                            Balas Ulasan Resmi
                                        </OwnerButton>
                                        <OwnerButton
                                            size="sm"
                                            variant="ghost"
                                            icon={Pin}
                                            onClick={() => handlePin(review)}
                                        >
                                            {pins[review.id]
                                                ? 'Lepas Pin Sorotan'
                                                : 'Pin ke Sorotan Evaluasi'}
                                        </OwnerButton>
                                        <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-[#6F6A78]">
                                            <Clock3
                                                aria-hidden="true"
                                                className="h-3 w-3"
                                            />
                                            Target respons{' '}
                                            <span className="font-semibold text-[#3F3B47]">
                                                &lt; 30 menit
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {!reply && !review.needsReply && (
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFF4] pt-3">
                                    <div className="flex flex-wrap items-center gap-3 text-[9.5px] text-[#6F6A78]">
                                        <span className="inline-flex items-center gap-1">
                                            <ThumbsUp
                                                aria-hidden="true"
                                                className="h-3 w-3"
                                            />
                                            {review.helpful ?? 0} Pelanggan Terbantu
                                        </span>
                                        <span>
                                            Dibagikan ke Komunitas Seduh
                                        </span>
                                    </div>
                                    <OwnerButton
                                        size="sm"
                                        variant="secondary"
                                        icon={Pencil}
                                        onClick={() => {
                                            setOpenReplyId(review.id);
                                            setEditingReplyId(null);
                                        }}
                                    >
                                        Tulis Balasan
                                    </OwnerButton>
                                </div>
                            )}

                            {openReplyId === review.id &&
                                !reply &&
                                !review.needsReply && (
                                    <div className="mt-3 rounded-xl border border-[#E4EAF8] bg-[#F8FAFF] p-3.5">
                                        <label
                                            className="text-[10px] font-semibold text-[#4A4552]"
                                            htmlFor={`reply-${review.id}`}
                                        >
                                            Tanggapan resmi
                                        </label>
                                        <textarea
                                            id={`reply-${review.id}`}
                                            rows={3}
                                            value={replyDrafts[review.id] ?? ''}
                                            onChange={(event) =>
                                                updateReplyDraft(
                                                    review.id,
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 py-2 text-[10.5px] leading-4 text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                        />
                                        <div className="mt-2 flex justify-end gap-2">
                                            <OwnerButton
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    setOpenReplyId(null)
                                                }
                                            >
                                                Batal
                                            </OwnerButton>
                                            <OwnerButton
                                                size="sm"
                                                variant="primary"
                                                icon={Send}
                                                onClick={() =>
                                                    submitReply(review)
                                                }
                                            >
                                                Kirim Balasan
                                            </OwnerButton>
                                        </div>
                                    </div>
                                )}
                        </article>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ECECF3] bg-white px-4 py-3 shadow-sm shadow-[#20263A]/3">
                <p className="text-[10px] text-[#6F6A78]">
                    Menampilkan {visibleStart}–{visibleEnd} dari{' '}
                    {filteredReviews.length} ulasan pada filter ini
                </p>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Halaman sebelumnya"
                        disabled={currentPage === 1}
                        onClick={() =>
                            setPage((current) => Math.max(1, current - 1))
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#6F6A78] transition hover:bg-[#F5F4F8] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeftIcon />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                        (pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                aria-current={
                                    pageNumber === currentPage
                                        ? 'page'
                                        : undefined
                                }
                                onClick={() => setPage(pageNumber)}
                                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-[10.5px] font-semibold transition ${
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
                            setPage((current) =>
                                Math.min(totalPages, current + 1),
                            )
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#6F6A78] transition hover:bg-[#F5F4F8] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChevronLeftIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
        >
            <path d="m15 18-6-6 6-6" strokeLinecap="round" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
        >
            <path d="m9 18 6-6-6-6" strokeLinecap="round" />
        </svg>
    );
}
