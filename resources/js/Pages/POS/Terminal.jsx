import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Banknote,
    Bike,
    CheckCircle2,
    Clock3,
    Coffee,
    CreditCard,
    ListRestart,
    LogOut,
    MapPin,
    Minus,
    Pause,
    Plus,
    Printer,
    QrCode,
    ReceiptText,
    RotateCcw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Split,
    StickyNote,
    Tag,
    UserRound,
    Utensils,
    Wallet,
    X,
} from 'lucide-react';
import OwnerModal from '@/Components/Owner/OwnerModal';
import { formatRupiah } from '@/data/ownerDashboard';
import {
    initialHeldOrders,
    initialPosCart,
    paymentMethods,
    posCategories,
    posProducts,
    posTables,
} from '@/data/pos';

const TAX_RATE = 0.1;
const MEMBER_DISCOUNT_RATE = 0.1;
const PROMO_DISCOUNT_RATE = 0.05;

const initialsFor = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

const badgeTones = {
    amber: 'bg-[#FFF0DA] text-[#8D5A00]',
    brown: 'bg-[#FFE7D7] text-[#8D4B00]',
    green: 'bg-[#D6FBEB] text-[#0D7A5F]',
    rose: 'bg-[#FDE8EC] text-[#B4234A]',
    stone: 'bg-[#F2F1F5] text-[#55515E]',
};

const orderTypes = [
    { id: 'dine-in', label: 'Dine In', note: 'Makan di Tempat', icon: Utensils },
    { id: 'take-away', label: 'Take Away', note: 'Dibungkus', icon: Wallet },
    { id: 'delivery', label: 'Delivery', note: 'Diantar', icon: Bike },
];

const paymentIcons = {
    qris: QrCode,
    cash: Banknote,
    card: CreditCard,
};

export default function PosTerminal({ store, cashier, preview = false }) {
    const activeStore = store ?? {
        code: 'ART-88',
        name: 'Artisan Roastery',
        branch: 'Senopati Flagship',
    };
    const activeCashier = cashier ?? {
        name: 'Sarah Nurhaliza',
        staff_code: 'CSR-001',
        shift: 'Pagi (07.00 – 15.00)',
    };

    const [cart, setCart] = useState(initialPosCart);
    const [heldOrders, setHeldOrders] = useState(initialHeldOrders);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [orderType, setOrderType] = useState('dine-in');
    const [table, setTable] = useState('Meja #04 (Indoor AC)');
    const [customer, setCustomer] = useState('Dimas K.');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('default');
    const [onlyBestSeller, setOnlyBestSeller] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [memberDiscount, setMemberDiscount] = useState(true);
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoDraft, setPromoDraft] = useState('');
    const [promoError, setPromoError] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [noteDraft, setNoteDraft] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('qris');
    const [cashPaid, setCashPaid] = useState('');
    const [splitCount, setSplitCount] = useState(2);
    const [lastReceipt, setLastReceipt] = useState(null);
    const [toast, setToast] = useState(null);
    const [now, setNow] = useState(new Date());
    const [modals, setModals] = useState({
        promo: false,
        note: false,
        split: false,
        held: false,
        checkout: false,
        receipt: false,
        close: false,
    });
    const searchInput = useRef(null);
    const toastTimer = useRef(null);

    useEffect(() => {
        const clock = window.setInterval(() => setNow(new Date()), 30000);

        return () => window.clearInterval(clock);
    }, []);

    useEffect(
        () => () => {
            if (toastTimer.current) {
                window.clearTimeout(toastTimer.current);
            }
        },
        [],
    );

    const anyModalOpen = Object.values(modals).some(Boolean);

    useEffect(() => {
        const onShortcut = (event) => {
            if (anyModalOpen) {
                return;
            }

            if (event.key === 'F1') {
                event.preventDefault();
                searchInput.current?.focus();
            }

            if (event.key === 'F4') {
                event.preventDefault();
                holdOrder();
            }

            if (event.key === 'F10') {
                event.preventDefault();
                openCheckout();
            }
        };

        window.addEventListener('keydown', onShortcut);

        return () => window.removeEventListener('keydown', onShortcut);
    });

    const notify = (message) => {
        setToast(message);

        if (toastTimer.current) {
            window.clearTimeout(toastTimer.current);
        }

        toastTimer.current = window.setTimeout(() => setToast(null), 3200);
    };

    const setModal = (name, open) =>
        setModals((current) => ({ ...current, [name]: open }));

    const filteredProducts = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        return posProducts
            .filter((product) => {
                if (category !== 'all' && product.category !== category) {
                    return false;
                }

                if (onlyBestSeller && product.badge !== 'Best Seller') {
                    return false;
                }

                return (
                    !normalized ||
                    [product.name, product.description, product.badge]
                        .join(' ')
                        .toLowerCase()
                        .includes(normalized)
                );
            })
            .sort((first, second) => {
                if (sortOrder === 'price-low') return first.price - second.price;
                if (sortOrder === 'price-high') return second.price - first.price;
                if (sortOrder === 'name') return first.name.localeCompare(second.name);
                return 0;
            });
    }, [category, onlyBestSeller, query, sortOrder]);

    const totals = useMemo(() => {
        const subtotal = cart.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0,
        );
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const memberDiscountAmount = memberDiscount
            ? Math.round(subtotal * MEMBER_DISCOUNT_RATE)
            : 0;
        const promoDiscountAmount = promoApplied
            ? Math.round(subtotal * PROMO_DISCOUNT_RATE)
            : 0;
        const taxable = Math.max(
            0,
            subtotal - memberDiscountAmount - promoDiscountAmount,
        );
        const tax = Math.round(taxable * TAX_RATE);

        return {
            subtotal,
            itemCount,
            memberDiscountAmount,
            promoDiscountAmount,
            tax,
            total: taxable + tax,
        };
    }, [cart, memberDiscount, promoApplied]);

    const cashPaidNumber = Number(cashPaid) || 0;
    const cashChange = Math.max(0, cashPaidNumber - totals.total);
    const cashSuggestions = useMemo(
        () =>
            [...new Set([totals.total, Math.ceil(totals.total / 50000) * 50000, 150000, 200000])]
                .filter((value) => value >= totals.total)
                .sort((first, second) => first - second)
                .slice(0, 3),
        [totals.total],
    );

    const addProduct = (product) => {
        setCart((current) => {
            const existing = current.find((item) => item.id === product.id);

            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [
                ...current,
                {
                    id: product.id,
                    name: product.name,
                    options: 'Default',
                    unitPrice: product.price,
                    quantity: 1,
                },
            ];
        });
    };

    const changeQuantity = (id, delta) => {
        setCart((current) =>
            current.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item,
            ),
        );
    };

    const removeLine = (id) => {
        setCart((current) => current.filter((item) => item.id !== id));
    };

    const resetOrder = () => {
        setCart([]);
        setOrderNote('');
        setMemberDiscount(true);
        setPromoApplied(false);
        setPromoDraft('');
        setCashPaid('');
        notify('Pesanan baru dimulai.');
    };

    const holdOrder = () => {
        if (cart.length === 0) {
            notify('Belum ada item untuk ditahan.');
            return;
        }

        const held = {
            id: `TR-${905 + heldOrders.length}`,
            table,
            customer: customer || 'Walk-in',
            items: `${cart.length} item · ${cart
                .map((item) => item.name)
                .slice(0, 2)
                .join(', ')}`,
            total: totals.total,
            heldAt: 'Baru saja',
            cart,
        };

        setHeldOrders((current) => [held, ...current]);
        setCart([]);
        notify(`Pesanan ${held.id} ditahan.`);
    };

    const restoreHeld = (held) => {
        setCart(held.cart);
        setTable(held.table);
        setCustomer(held.customer);
        setHeldOrders((current) => current.filter((item) => item.id !== held.id));
        setModal('held', false);
        notify(`Pesanan ${held.id} dipulihkan.`);
    };

    const applyPromo = () => {
        if (promoDraft.trim().toUpperCase() !== 'HEMAT5') {
            setPromoError('Kode promo tidak valid untuk pesanan ini.');
            return;
        }

        setPromoApplied(true);
        setPromoError('');
        setModal('promo', false);
        notify('Promo HEMAT5 berhasil diterapkan.');
    };

    const openCheckout = () => {
        if (cart.length === 0) {
            notify('Tambahkan item sebelum melakukan pembayaran.');
            return;
        }

        if (paymentMethod === 'cash' && cashPaidNumber < totals.total) {
            notify('Uang tunai belum mencukupi total tagihan.');
            return;
        }

        setModal('checkout', true);
    };

    const confirmCheckout = () => {
        const receipt = {
            orderId: `#TR-${905 + completedOrders.length}`,
            store: activeStore,
            cashier: activeCashier,
            customer: customer || 'Walk-in',
            table:
                orderType === 'dine-in'
                    ? table
                    : orderType === 'take-away'
                      ? 'Take Away Counter'
                      : 'Delivery',
            items: cart,
            totals,
            paymentMethod,
            cashPaid: cashPaidNumber,
            cashChange,
            note: orderNote,
            timestamp: new Date(),
        };

        setLastReceipt(receipt);
        setCompletedOrders((current) => [...current, receipt]);
        setCart([]);
        setCashPaid('');
        setOrderNote('');
        setMemberDiscount(true);
        setPromoApplied(false);
        setModal('checkout', false);
        setModal('receipt', true);
        notify(
            paymentMethod === 'cash'
                ? `Pembayaran tunai ${formatRupiah(totals.total)} diterima.`
                : `Pembayaran ${paymentMethod === 'qris' ? 'QRIS' : 'kartu'} berhasil.`,
        );
    };

    const closeCashier = () => {
        if (preview) {
            router.visit('/dashboard/owner?view=cashierStaff');
            return;
        }

        router.post(route('logout'));
    };

    const formattedTime = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    return (
        <div
            className="min-h-screen bg-[#F3F5FB] text-[#231F2B] antialiased"
            style={{
                fontFamily:
                    "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            }}
        >
            <Head title="Terminal Kasir POS" />

            <header className="border-b border-[#E7E8F0] bg-white">
                <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-3 px-3 py-3 sm:px-4">
                    <Link href="/" className="flex shrink-0 items-center gap-2">
                        <img src="/img/logo/logoamber.svg" alt="" className="h-8 w-8" />
                        <span className="text-[18px] font-bold tracking-[-0.035em] text-[#56311F]">
                            CafeFinder
                        </span>
                        <span className="rounded-md bg-[#F4F3F8] px-1.5 py-0.5 text-[8px] font-semibold text-[#6F6A78]">
                            POS v3.4
                        </span>
                    </Link>

                    <div className="hidden h-8 w-px bg-[#ECECF3] sm:block" />

                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-[#292632]">
                            {activeStore.name} · {activeStore.branch}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[8.5px] text-[#6F6A78]">
                            <span className="h-1 w-1 rounded-full bg-[#0D7A5F]" />
                            Online &amp; Sinkron
                            <span className="text-[#D8D4DE]">•</span>
                            <Clock3 aria-hidden="true" className="h-3 w-3" />
                            {formattedTime} WIB
                        </p>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <span className="hidden text-right sm:block">
                            <span className="block text-[9.5px] font-semibold text-[#3F3B47]">
                                {activeCashier.name}
                            </span>
                            <span className="block text-[8px] text-[#6F6A78]">
                                {preview
                                    ? 'Owner Preview'
                                    : `${activeCashier.staff_code ?? 'CSR-001'} · ${
                                          activeCashier.shift ?? 'Shift Pagi'
                                      }`}
                            </span>
                        </span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F6FF] text-[9px] font-bold text-[#5D6B96]">
                            {initialsFor(activeCashier.name)}
                        </span>
                    </div>

                    <div className="flex w-full items-center gap-1.5 overflow-x-auto pt-1 sm:w-auto sm:pt-0">
                        {orderTypes.map((type) => {
                            const Icon = type.icon;
                            const isActive = orderType === type.id;

                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => {
                                        setOrderType(type.id);
                                        if (type.id === 'take-away') {
                                            setTable('Take Away Counter');
                                        }
                                        if (type.id === 'delivery') {
                                            setTable('Delivery');
                                        }
                                    }}
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                        isActive
                                            ? 'border-[#B97A45] bg-[#FFF8F0] text-[#6F3A0E]'
                                            : 'border-[#E2E5EF] bg-white text-[#55515E] hover:bg-[#F8F9FE]'
                                    }`}
                                >
                                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                                    <span>
                                        <span className="block text-[9.5px] font-semibold">
                                            {type.label}
                                        </span>
                                        <span className="block text-[7.5px] text-[#6F6A78]">
                                            {type.note}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => notify('Laci kas dibuka. Pastikan uang fisik sesuai.')}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9px] font-semibold text-[#55515E] transition hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            <Wallet aria-hidden="true" className="h-3.5 w-3.5" />
                            Laci Kas
                        </button>
                        <button
                            type="button"
                            onClick={holdOrder}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9px] font-semibold text-[#55515E] transition hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            <Pause aria-hidden="true" className="h-3.5 w-3.5" />
                            Tahan
                        </button>
                        <button
                            type="button"
                            onClick={() => setModal('held', true)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E2E5EF] bg-white px-2.5 text-[9px] font-semibold text-[#55515E] transition hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            <ListRestart aria-hidden="true" className="h-3.5 w-3.5" />
                            Pesanan Tertahan
                            {heldOrders.length > 0 && (
                                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FFE7D7] px-1 text-[8px] font-bold text-[#8D4B00]">
                                    {heldOrders.length}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setModal('close', true)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#F4D6D2] bg-[#FFF4F2] px-2.5 text-[9px] font-semibold text-[#B42318] transition hover:bg-[#FFE9E5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                        >
                            <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                            Tutup Kasir
                        </button>
                    </div>
                </div>

                {preview && (
                    <div className="border-t border-[#F0EFF4] bg-[#FFF8F0] px-4 py-2">
                        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2 text-[9.5px]">
                            <span className="inline-flex items-center gap-1.5 text-[#6F543F]">
                                <ShieldCheck
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 text-[#B67932]"
                                />
                                Mode pratinjau Owner — transaksi ini tidak masuk ke
                                laporan shift kasir.
                            </span>
                            <Link
                                href="/dashboard/owner?view=cashierStaff"
                                className="font-semibold text-[#8D4B00] hover:text-[#603200]"
                            >
                                Kembali ke Kelola Staf Kasir
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-3 py-3 sm:px-4 xl:flex-row xl:items-start">
                <section className="min-w-0 flex-1">
                    <div className="rounded-2xl border border-[#ECECF3] bg-white p-3 shadow-sm shadow-[#20263A]/3">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative min-w-[220px] flex-1">
                                <Search
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B8694]"
                                />
                                <input
                                    ref={searchInput}
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Cari menu, SKU, atau scan kode barcode..."
                                    aria-label="Cari menu"
                                    className="h-9 w-full rounded-xl border border-[#E2E5EF] bg-[#F8F9FE] pl-9 pr-12 text-[10.5px] text-[#292632] placeholder:text-[#8B8694] focus:border-[#A88B70] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#F1F1F6] px-1.5 py-0.5 text-[8px] font-medium text-[#6F6A78]">
                                    F1
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFilters((current) => !current)}
                                aria-expanded={showFilters}
                                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E2E5EF] bg-white px-3 text-[9.5px] font-semibold text-[#55515E] transition hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
                                Filter
                            </button>
                        </div>

                        {showFilters && (
                            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-[#F8F9FE] px-3 py-2.5 text-[9px] text-[#55515E]">
                                <label className="flex items-center gap-1.5">
                                    Urutkan:
                                    <select
                                        value={sortOrder}
                                        onChange={(event) => setSortOrder(event.target.value)}
                                        className="h-7 rounded-md border border-[#E2E5EF] bg-white px-2 text-[9px] focus:outline-none"
                                    >
                                        <option value="default">Default</option>
                                        <option value="name">Nama A-Z</option>
                                        <option value="price-low">Harga terendah</option>
                                        <option value="price-high">Harga tertinggi</option>
                                    </select>
                                </label>
                                <label className="flex items-center gap-1.5">
                                    <input
                                        type="checkbox"
                                        checked={onlyBestSeller}
                                        onChange={(event) => setOnlyBestSeller(event.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-[#CFCBD6] text-[#8D4B00] focus:ring-[#8D4B00]"
                                    />
                                    Hanya Best Seller
                                </label>
                            </div>
                        )}

                        <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
                            {posCategories.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={category === item.id}
                                    onClick={() => setCategory(item.id)}
                                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[9px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                        category === item.id
                                            ? 'bg-[#231F2B] text-white'
                                            : 'bg-[#F4F4F8] text-[#55515E] hover:bg-[#ECECF3]'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <article
                                key={product.id}
                                className="group overflow-hidden rounded-2xl border border-[#ECECF3] bg-white shadow-sm shadow-[#20263A]/3 transition hover:border-[#DCD5CB] hover:shadow-md"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-[#F2F1F5]">
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                    />
                                    {product.badge && (
                                        <span
                                            className={`absolute left-2 top-2 rounded-md px-1.5 py-1 text-[7.5px] font-semibold ${badgeTones[product.badgeTone]}`}
                                        >
                                            {product.badge}
                                        </span>
                                    )}
                                    {product.stock && (
                                        <span className="absolute bottom-2 left-2 rounded-md bg-[#231F2B]/80 px-1.5 py-1 text-[7.5px] font-medium text-white backdrop-blur">
                                            {product.stock}
                                        </span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="line-clamp-1 text-[11px] font-semibold text-[#231F2B]">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 min-h-7 text-[8.5px] leading-3.5 text-[#6F6A78]">
                                        {product.description}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        <span className="text-[11.5px] font-bold text-[#6F3A0E]">
                                            {formatRupiah(product.price)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => addProduct(product)}
                                            aria-label={`Tambah ${product.name}`}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E5EF] bg-white text-[#8D4B00] transition hover:border-[#B97A45] hover:bg-[#FFF8F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                        >
                                            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="mt-3 rounded-2xl border border-dashed border-[#DCD9E4] bg-white py-12 text-center">
                            <Search aria-hidden="true" className="mx-auto h-5 w-5 text-[#8B8694]" />
                            <p className="mt-2 text-[11px] font-semibold text-[#292632]">
                                Menu tidak ditemukan
                            </p>
                            <p className="mt-1 text-[9.5px] text-[#6F6A78]">
                                Coba kata kunci lain atau ubah kategori.
                            </p>
                        </div>
                    )}
                </section>

                <aside className="w-full shrink-0 xl:sticky xl:top-3 xl:w-[400px] xl:max-h-[calc(100vh-1.5rem)] xl:overflow-y-auto">
                    <div className="flex min-h-full flex-col rounded-2xl border border-[#ECECF3] bg-white shadow-sm shadow-[#20263A]/3">
                        <div className="flex items-center justify-between gap-2 border-b border-[#F0EFF4] px-4 py-3">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-bold text-[#231F2B]">
                                        #TR-904
                                    </span>
                                    <span className="rounded-full bg-[#FFE7D7] px-1.5 py-0.5 text-[8px] font-semibold text-[#8D4B00]">
                                        Pesanan Baru
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[8px] text-[#6F6A78]">
                                    {totals.itemCount} item ·{' '}
                                    {orderTypes.find((type) => type.id === orderType)?.label}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={resetOrder}
                                className="inline-flex items-center gap-1 rounded text-[8.5px] font-medium text-[#B42318] hover:text-[#8A1C14] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                <RotateCcw aria-hidden="true" className="h-3 w-3" />
                                Reset
                            </button>
                        </div>

                        <div className="space-y-3 p-3.5">
                            <div className="grid grid-cols-2 gap-2">
                                <label className="block">
                                    <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6F6A78]">
                                        Lokasi Meja
                                    </span>
                                    <span className="mt-1 flex items-center gap-1.5 rounded-lg bg-[#F5F8FF] px-2 py-1.5">
                                        <MapPin aria-hidden="true" className="h-3 w-3 shrink-0 text-[#5D6B96]" />
                                        <select
                                            value={table}
                                            onChange={(event) => setTable(event.target.value)}
                                            disabled={orderType !== 'dine-in'}
                                            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[9px] font-semibold text-[#3F3B47] focus:ring-0 disabled:opacity-70"
                                        >
                                            {orderType === 'dine-in' ? (
                                                posTables.map((tableName) => (
                                                    <option key={tableName} value={tableName}>
                                                        {tableName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={table}>{table}</option>
                                            )}
                                        </select>
                                    </span>
                                </label>

                                <div>
                                    <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6F6A78]">
                                        Pelanggan / Member
                                    </span>
                                    <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-[#FFF8F0] px-2 py-1.5">
                                        <UserRound aria-hidden="true" className="h-3 w-3 shrink-0 text-[#B67932]" />
                                        <div className="min-w-0">
                                            <p className="truncate text-[9px] font-semibold text-[#3F3B47]">
                                                {customer}
                                            </p>
                                            <p className="text-[7.5px] text-[#8D4B00]">
                                                Gold • 1,250 Poin
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-h-[34vh] space-y-2 overflow-y-auto pr-0.5">
                                {cart.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-[#DCD9E4] py-8 text-center">
                                        <Coffee aria-hidden="true" className="mx-auto h-5 w-5 text-[#B5AFBC]" />
                                        <p className="mt-2 text-[9.5px] text-[#6F6A78]">
                                            Belum ada item. Tambahkan menu dari katalog.
                                        </p>
                                    </div>
                                )}

                                {cart.map((item) => (
                                    <div key={item.id} className="rounded-xl border border-[#F0EFF4] bg-white p-2.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-semibold text-[#292632]">
                                                    {item.name}
                                                </p>
                                                <p className="mt-0.5 text-[8px] leading-3.5 text-[#6F6A78]">
                                                    {item.options}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-[10px] font-bold text-[#6F3A0E]">
                                                {formatRupiah(item.unitPrice * item.quantity)}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-1">
                                            <button
                                                type="button"
                                                aria-label={`Kurangi ${item.name}`}
                                                disabled={item.quantity <= 1}
                                                onClick={() => changeQuantity(item.id, -1)}
                                                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#E2E5EF] text-[#55515E] hover:bg-[#F8F9FE] disabled:opacity-40"
                                            >
                                                <Minus aria-hidden="true" className="h-3 w-3" />
                                            </button>
                                            <span className="w-5 text-center text-[9.5px] font-semibold text-[#3F3B47]">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label={`Tambah ${item.name}`}
                                                onClick={() => changeQuantity(item.id, 1)}
                                                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#E2E5EF] text-[#55515E] hover:bg-[#F8F9FE]"
                                            >
                                                <Plus aria-hidden="true" className="h-3 w-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeLine(item.id)}
                                                aria-label={`Hapus ${item.name}`}
                                                className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-md text-[#B42318] hover:bg-[#FFF4F2]"
                                            >
                                                <X aria-hidden="true" className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setModal('promo', true)}
                                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E2E5EF] bg-white px-1.5 py-1.5 text-[8.5px] font-medium text-[#55515E] hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                >
                                    <Tag aria-hidden="true" className="h-3 w-3" />
                                    Promo/Diskon
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNoteDraft(orderNote);
                                        setModal('note', true);
                                    }}
                                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E2E5EF] bg-white px-1.5 py-1.5 text-[8.5px] font-medium text-[#55515E] hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                >
                                    <StickyNote aria-hidden="true" className="h-3 w-3" />
                                    Catatan Khusus
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModal('split', true)}
                                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E2E5EF] bg-white px-1.5 py-1.5 text-[8.5px] font-medium text-[#55515E] hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                >
                                    <Split aria-hidden="true" className="h-3 w-3" />
                                    Split Bill
                                </button>
                            </div>

                            {orderNote && (
                                <p className="rounded-lg bg-[#FFF8F0] px-2.5 py-1.5 text-[8px] leading-3.5 text-[#6F543F]">
                                    Catatan: {orderNote}
                                </p>
                            )}

                            <div className="space-y-1.5 border-t border-[#F0EFF4] pt-2.5">
                                <div className="flex items-center justify-between text-[9px]">
                                    <span className="text-[#6F6A78]">Subtotal ({totals.itemCount} item)</span>
                                    <span className="font-semibold text-[#3F3B47]">
                                        {formatRupiah(totals.subtotal)}
                                    </span>
                                </div>
                                {totals.memberDiscountAmount > 0 && (
                                    <div className="flex items-center justify-between text-[9px]">
                                        <span className="text-[#0D7A5F]">Diskon Member Gold (10%)</span>
                                        <span className="font-semibold text-[#0D7A5F]">
                                            -{formatRupiah(totals.memberDiscountAmount)}
                                        </span>
                                    </div>
                                )}
                                {totals.promoDiscountAmount > 0 && (
                                    <div className="flex items-center justify-between text-[9px]">
                                        <span className="text-[#0D7A5F]">Promo HEMAT5 (5%)</span>
                                        <span className="font-semibold text-[#0D7A5F]">
                                            -{formatRupiah(totals.promoDiscountAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-[9px]">
                                    <span className="text-[#6F6A78]">PB1 / Pajak Resto (10%)</span>
                                    <span className="font-semibold text-[#3F3B47]">
                                        {formatRupiah(totals.tax)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[9px]">
                                    <span className="text-[#6F6A78]">Biaya Layanan</span>
                                    <span className="font-semibold text-[#0D7A5F]">Rp 0 (Gratis)</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between gap-3 border-t border-[#E9E5DF] pt-2.5">
                                <span className="text-[10px] font-semibold text-[#55515E]">Total Tagihan</span>
                                <span className="text-[21px] font-bold tracking-[-0.04em] text-[#6F3A0E]">
                                    {formatRupiah(totals.total)}
                                </span>
                            </div>

                            <div>
                                <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#6F6A78]">
                                    Metode Pembayaran
                                </p>
                                <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                                    {paymentMethods.map((method) => {
                                        const Icon = paymentIcons[method.icon];
                                        const isActive = paymentMethod === method.id;

                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                aria-pressed={isActive}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`flex flex-col items-center gap-1 rounded-lg border px-1.5 py-2 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                                                    isActive
                                                        ? 'border-[#8D4B00] bg-[#6F3A0E] text-white'
                                                        : 'border-[#E2E5EF] bg-white text-[#55515E] hover:bg-[#F8F9FE]'
                                                }`}
                                            >
                                                <Icon aria-hidden="true" className="h-4 w-4" />
                                                <span className="text-[8px] font-semibold">{method.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {paymentMethod === 'cash' && (
                                <div className="rounded-xl bg-[#F8F9FE] p-2.5">
                                    <label className="flex items-center justify-between gap-2">
                                        <span className="text-[8.5px] font-medium text-[#55515E]">Uang Diterima</span>
                                        <span className="flex items-center gap-1 rounded-md border border-[#E2E5EF] bg-white px-2 py-1">
                                            <span className="text-[9px] text-[#6F6A78]">Rp</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={cashPaid}
                                                onChange={(event) => setCashPaid(event.target.value)}
                                                className="w-20 border-0 bg-transparent p-0 text-right text-[10px] font-semibold text-[#3F3B47] focus:ring-0"
                                            />
                                        </span>
                                    </label>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {cashSuggestions.map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => setCashPaid(String(amount))}
                                                className="rounded-md border border-[#E2E5EF] bg-white px-2 py-1 text-[8px] font-medium text-[#55515E] hover:bg-[#F0F3FC]"
                                            >
                                                {amount === totals.total ? 'Uang Pas' : formatRupiah(amount)}
                                            </button>
                                        ))}
                                    </div>
                                    <p className={`mt-2 text-[8.5px] ${cashPaidNumber >= totals.total ? 'text-[#0D7A5F]' : 'text-[#B42318]'}`}>
                                        {cashPaidNumber >= totals.total
                                            ? `Kembalian ${formatRupiah(cashChange)}`
                                            : `Kurang ${formatRupiah(totals.total - cashPaidNumber)}`}
                                    </p>
                                </div>
                            )}

                            {paymentMethod === 'qris' && (
                                <p className="rounded-lg bg-[#F4F7FF] px-2.5 py-2 text-[8px] text-[#5D6B96]">
                                    QRIS dinamis siap — minta pelanggan scan dan konfirmasi pembayaran di EDC.
                                </p>
                            )}

                            {paymentMethod === 'card' && (
                                <p className="rounded-lg bg-[#F4F7FF] px-2.5 py-2 text-[8px] text-[#5D6B96]">
                                    EDC terhubung. Gesek/tap kartu pelanggan lalu konfirmasi.
                                </p>
                            )}
                        </div>

                        <div className="mt-auto flex items-center gap-2 border-t border-[#F0EFF4] p-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!lastReceipt) {
                                        notify('Belum ada transaksi untuk dicetak.');
                                        return;
                                    }
                                    setModal('receipt', true);
                                }}
                                aria-label="Lihat struk terakhir"
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E5EF] bg-white text-[#6F6A78] hover:bg-[#F8F9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                            >
                                <ReceiptText aria-hidden="true" className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={openCheckout}
                                disabled={cart.length === 0 || (paymentMethod === 'cash' && cashPaidNumber < totals.total)}
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#8D4B00] px-3 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#733D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Printer aria-hidden="true" className="h-4 w-4" />
                                Bayar &amp; Cetak (F10)
                            </button>
                        </div>
                    </div>
                </aside>
            </main>

            <footer className="border-t border-[#E7E8F0] bg-white px-3 py-2 text-[8px] text-[#6F6A78] sm:px-4">
                <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                        <Printer aria-hidden="true" className="h-3 w-3 text-[#0D7A5F]" />
                        Epson TM-T82III (LAN 192.168.1.120) · Siap
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck aria-hidden="true" className="h-3 w-3 text-[#0D7A5F]" />
                        Auto-Cutter: Aktif
                    </span>
                    <span className="hidden items-center gap-3 md:flex">
                        <span>Shortcuts: [F1] Cari</span>
                        <span>[F4] Hold</span>
                        <span>[F10] Bayar</span>
                    </span>
                </div>
            </footer>

            <OwnerModal
                show={modals.promo}
                onClose={() => setModal('promo', false)}
                title="Promo & Diskon"
                description="Atur diskon member dan kode promo pesanan ini."
                maxWidth="md"
            >
                <div className="space-y-4 px-5 py-5">
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-[#ECECF3] p-3">
                        <span>
                            <span className="block text-[10.5px] font-semibold text-[#3F3B47]">Diskon Member Gold (10%)</span>
                            <span className="mt-0.5 block text-[8.5px] text-[#6F6A78]">
                                Pelanggan {customer} terdaftar sebagai member Gold.
                            </span>
                        </span>
                        <input
                            type="checkbox"
                            checked={memberDiscount}
                            onChange={(event) => setMemberDiscount(event.target.checked)}
                            className="h-4 w-4 rounded border-[#CFCBD6] text-[#8D4B00] focus:ring-[#8D4B00]"
                        />
                    </label>

                    <label className="block">
                        <span className="text-[10.5px] font-semibold text-[#4A4552]">Kode Promo</span>
                        <div className="mt-1.5 flex gap-2">
                            <input
                                value={promoDraft}
                                onChange={(event) => {
                                    setPromoDraft(event.target.value);
                                    setPromoError('');
                                }}
                                placeholder="Contoh: HEMAT5"
                                className="h-9 min-w-0 flex-1 rounded-lg border border-[#E2E5EF] bg-white px-3 text-[11px] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                            />
                            <button
                                type="button"
                                onClick={applyPromo}
                                className="h-9 rounded-lg bg-[#8D4B00] px-4 text-[10.5px] font-semibold text-white hover:bg-[#733D00]"
                            >
                                Terapkan
                            </button>
                        </div>
                        {promoError && <p className="mt-1.5 text-[9px] font-medium text-[#B42318]">{promoError}</p>}
                        {promoApplied && <p className="mt-1.5 text-[9px] font-medium text-[#0D7A5F]">Promo HEMAT5 aktif · diskon 5%.</p>}
                    </label>
                </div>
                <div className="flex justify-end border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setModal('promo', false)}
                        className="rounded-lg bg-[#8D4B00] px-4 py-2 text-[10.5px] font-semibold text-white hover:bg-[#733D00]"
                    >
                        Selesai
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={modals.note}
                onClose={() => setModal('note', false)}
                title="Catatan Pesanan"
                description="Catatan ini akan dicetak pada tiket dapur dan struk."
                maxWidth="md"
            >
                <div className="px-5 py-5">
                    <textarea
                        rows={4}
                        value={noteDraft}
                        onChange={(event) => setNoteDraft(event.target.value)}
                        placeholder="Contoh: tanpa es, seduh lebih pekat, alergi kacang..."
                        className="w-full rounded-xl border border-[#E2E5EF] bg-white px-3 py-2.5 text-[11px] leading-5 text-[#3F3B47] focus:border-[#A88B70] focus:outline-none focus:ring-2 focus:ring-[#8D4B00]/15"
                    />
                </div>
                <div className="flex justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setModal('note', false)}
                        className="rounded-lg px-3 py-2 text-[10.5px] font-semibold text-[#6F6A78] hover:bg-[#F5F4F8]"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOrderNote(noteDraft.trim());
                            setModal('note', false);
                            notify(noteDraft.trim() ? 'Catatan pesanan disimpan.' : 'Catatan dihapus.');
                        }}
                        className="rounded-lg bg-[#8D4B00] px-4 py-2 text-[10.5px] font-semibold text-white hover:bg-[#733D00]"
                    >
                        Simpan Catatan
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={modals.split}
                onClose={() => setModal('split', false)}
                title="Split Bill"
                description="Bagi total tagihan ke beberapa pelanggan."
                maxWidth="md"
            >
                <div className="px-5 py-5">
                    <div className="flex gap-1.5">
                        {[2, 3, 4].map((count) => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => setSplitCount(count)}
                                className={`flex-1 rounded-lg border px-2 py-2 text-[10px] font-semibold ${
                                    splitCount === count
                                        ? 'border-[#8D4B00] bg-[#FFF8F0] text-[#6F3A0E]'
                                        : 'border-[#E2E5EF] bg-white text-[#55515E]'
                                }`}
                            >
                                Bagi {count}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-[#F4F7FF] p-3.5 text-center">
                        <p className="text-[9.5px] text-[#6F6A78]">Total tagihan {formatRupiah(totals.total)}</p>
                        <p className="mt-1 text-[22px] font-bold text-[#6F3A0E]">
                            {formatRupiah(Math.ceil(totals.total / splitCount))}
                        </p>
                        <p className="mt-1 text-[9px] text-[#6F6A78]">per pelanggan · {splitCount} orang</p>
                    </div>
                </div>
                <div className="flex justify-end border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setModal('split', false)}
                        className="rounded-lg bg-[#8D4B00] px-4 py-2 text-[10.5px] font-semibold text-white hover:bg-[#733D00]"
                    >
                        Tutup
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={modals.held}
                onClose={() => setModal('held', false)}
                title="Pesanan Tertahan"
                description={`${heldOrders.length} pesanan menunggu dilanjutkan.`}
                maxWidth="lg"
            >
                <div className="space-y-2 px-5 py-5">
                    {heldOrders.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[#DCD9E4] py-10 text-center">
                            <ListRestart aria-hidden="true" className="mx-auto h-5 w-5 text-[#8B8694]" />
                            <p className="mt-2 text-[10.5px] font-semibold text-[#292632]">Tidak ada pesanan tertahan</p>
                            <p className="mt-1 text-[9px] text-[#6F6A78]">Gunakan tombol Tahan untuk menyimpan pesanan sementara.</p>
                        </div>
                    )}
                    {heldOrders.map((order) => (
                        <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#ECECF3] p-3">
                            <div>
                                <p className="text-[10.5px] font-semibold text-[#292632]">{order.id} · {order.table}</p>
                                <p className="mt-0.5 text-[8.5px] text-[#6F6A78]">
                                    {order.customer} · {order.items} · {order.heldAt}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-[#6F3A0E]">{formatRupiah(order.total)}</span>
                                <button
                                    type="button"
                                    onClick={() => restoreHeld(order)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-[#8D4B00] px-2.5 py-1.5 text-[9px] font-semibold text-white hover:bg-[#733D00]"
                                >
                                    Pulihkan
                                    <ArrowRight aria-hidden="true" className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setModal('held', false)}
                        className="rounded-lg px-3 py-2 text-[10.5px] font-semibold text-[#6F6A78] hover:bg-[#F5F4F8]"
                    >
                        Tutup
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={modals.checkout}
                onClose={() => setModal('checkout', false)}
                title="Konfirmasi Pembayaran"
                description="Periksa ringkasan pembayaran sebelum menyelesaikan transaksi."
                maxWidth="md"
            >
                <div className="space-y-3 px-5 py-5">
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F4F7FF] p-3">
                        <div>
                            <p className="text-[9px] text-[#6F6A78]">Metode pembayaran</p>
                            <p className="mt-0.5 text-[12px] font-semibold text-[#3F3B47]">
                                {paymentMethods.find((method) => method.id === paymentMethod)?.label ?? paymentMethod}
                            </p>
                        </div>
                        {paymentMethod === 'cash' ? (
                            <Banknote aria-hidden="true" className="h-5 w-5 text-[#8D4B00]" />
                        ) : paymentMethod === 'qris' ? (
                            <QrCode aria-hidden="true" className="h-5 w-5 text-[#8D4B00]" />
                        ) : (
                            <CreditCard aria-hidden="true" className="h-5 w-5 text-[#8D4B00]" />
                        )}
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-[#6F6A78]">Subtotal &amp; pajak</span>
                            <span className="font-semibold text-[#3F3B47]">{formatRupiah(totals.total)}</span>
                        </div>
                        {paymentMethod === 'cash' && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-[#6F6A78]">Uang diterima</span>
                                    <span className="font-semibold text-[#3F3B47]">{formatRupiah(cashPaidNumber)}</span>
                                </div>
                                <div className="flex justify-between text-[#0D7A5F]">
                                    <span>Kembalian</span>
                                    <span className="font-semibold">{formatRupiah(cashChange)}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <p className="text-[8.5px] leading-4 text-[#6F6A78]">
                        Dengan melanjutkan, pembayaran akan dicatat pada sesi kasir {activeCashier.name} dan struk dapat dicetak.
                    </p>
                </div>
                <div className="flex justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setModal('checkout', false)}
                        className="rounded-lg px-3 py-2 text-[10.5px] font-semibold text-[#6F6A78] hover:bg-[#F5F4F8]"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={confirmCheckout}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#8D4B00] px-4 py-2 text-[10.5px] font-semibold text-white hover:bg-[#733D00]"
                    >
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Konfirmasi &amp; Cetak Struk
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={modals.receipt}
                onClose={() => setModal('receipt', false)}
                title="Struk Pembayaran"
                description="Transaksi berhasil diproses."
                maxWidth="md"
            >
                {lastReceipt && (
                    <div className="px-5 py-5">
                        <div className="mx-auto max-w-[300px] rounded-xl border border-[#E2E5EF] bg-white p-4 font-mono text-[9px] leading-4 text-[#3F3B47] shadow-sm">
                            <div className="text-center">
                                <p className="text-[12px] font-bold tracking-[0.14em]">{lastReceipt.store.name.toUpperCase()}</p>
                                <p className="mt-1 text-[8px] text-[#6F6A78]">{lastReceipt.store.branch}</p>
                                <p className="mt-0.5 text-[8px] text-[#6F6A78]">{lastReceipt.orderId} · {lastReceipt.table}</p>
                            </div>
                            <div className="my-3 border-t border-dashed border-[#D8D4DE]" />
                            {lastReceipt.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-3">
                                    <span>{item.quantity}× {item.name}</span>
                                    <span>{formatRupiah(item.unitPrice * item.quantity).replace('Rp ', '')}</span>
                                </div>
                            ))}
                            <div className="my-3 border-t border-dashed border-[#D8D4DE]" />
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(lastReceipt.totals.subtotal)}</span></div>
                            {lastReceipt.totals.memberDiscountAmount > 0 && (
                                <div className="flex justify-between"><span>Diskon member</span><span>-{formatRupiah(lastReceipt.totals.memberDiscountAmount)}</span></div>
                            )}
                            <div className="flex justify-between"><span>PB1 10%</span><span>{formatRupiah(lastReceipt.totals.tax)}</span></div>
                            <div className="mt-2 flex justify-between text-[11px] font-bold">
                                <span>TOTAL</span><span>{formatRupiah(lastReceipt.totals.total)}</span>
                            </div>
                            <p className="mt-1 text-[8px] text-[#0D7A5F]">
                                {lastReceipt.paymentMethod === 'cash' ? 'TUNAI · LUNAS' : lastReceipt.paymentMethod === 'qris' ? 'QRIS · LUNAS' : 'KARTU EDC · LUNAS'}
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap justify-end gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setModal('receipt', false)}
                        className="rounded-lg px-3 py-2 text-[10.5px] font-semibold text-[#6F6A78] hover:bg-[#F5F4F8]"
                    >
                        Tutup
                    </button>
                    <button
                        type="button"
                        onClick={() => notify('Struk dikirim ke Epson TM-T82III.')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E5EF] bg-white px-3 py-2 text-[10.5px] font-semibold text-[#55515E] hover:bg-[#F8F9FE]"
                    >
                        <Printer aria-hidden="true" className="h-3.5 w-3.5" />
                        Cetak Struk
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setModal('receipt', false);
                            setModal('close', true);
                        }}
                        className="rounded-lg bg-[#8D4B00] px-4 py-2 text-[10.5px] font-semibold text-white hover:bg-[#733D00]"
                    >
                        Ringkasan Shift
                    </button>
                </div>
            </OwnerModal>

            <OwnerModal
                show={modals.close}
                onClose={() => setModal('close', false)}
                title="Tutup Kasir & Shift"
                description="Pastikan laci kas dan laporan shift sudah sesuai sebelum keluar."
                maxWidth="md"
            >
                <div className="space-y-3 px-5 py-5">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-[#F4F7FF] p-3">
                            <p className="text-[8px] text-[#6F6A78]">Transaksi selesai</p>
                            <p className="mt-1 text-[19px] font-bold text-[#3F3B47]">{completedOrders.length}</p>
                        </div>
                        <div className="rounded-xl bg-[#F4F7FF] p-3">
                            <p className="text-[8px] text-[#6F6A78]">Total penjualan</p>
                            <p className="mt-1 text-[13px] font-bold text-[#6F3A0E]">
                                {formatRupiah(completedOrders.reduce((sum, order) => sum + order.totals.total, 0))}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#ECECF3] p-3 text-[9px] text-[#55515E]">
                        <p className="flex justify-between gap-3"><span>Kas awal (opening float)</span><span className="font-semibold">Rp 500.000</span></p>
                        <p className="mt-1.5 flex justify-between gap-3"><span>Kasir</span><span className="font-semibold">{activeCashier.name}</span></p>
                        <p className="mt-1.5 flex justify-between gap-3"><span>Shift</span><span className="font-semibold">{preview ? 'Owner Preview' : activeCashier.shift}</span></p>
                    </div>
                    <p className="text-[8.5px] leading-4 text-[#6F6A78]">
                        Setelah shift ditutup, terminal akan keluar dari sesi kasir. Simpan uang fisik dan struk sesuai SOP gerai.
                    </p>
                </div>
                <div className="flex flex-wrap justify-between gap-2 border-t border-[#F0EFF4] px-5 py-3.5">
                    <button
                        type="button"
                        onClick={() => setModal('close', false)}
                        className="rounded-lg px-3 py-2 text-[10.5px] font-semibold text-[#6F6A78] hover:bg-[#F5F4F8]"
                    >
                        Kembali ke POS
                    </button>
                    <button
                        type="button"
                        onClick={closeCashier}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#B42318] px-4 py-2 text-[10.5px] font-semibold text-white hover:bg-[#8A1C14]"
                    >
                        <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                        {preview ? 'Kembali ke Owner' : 'Tutup Shift & Keluar'}
                    </button>
                </div>
            </OwnerModal>

            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-14 right-4 z-[70] flex max-w-[360px] items-start gap-2 rounded-xl bg-[#231F2B] px-4 py-3 text-[10.5px] font-medium leading-4 text-white shadow-xl shadow-[#231F2B]/25"
                >
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#8FE5C6]" />
                    {toast}
                </div>
            )}
        </div>
    );
}
