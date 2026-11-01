export const cashierPrivileges = [
    {
        id: 'transactions',
        title: 'Akses Bukti Transaksi & Terima Pembayaran',
        description:
            'Dapat membuka menu, input pesanan meja, dan terima QRIS/Tunai.',
    },
    {
        id: 'discounts',
        title: 'Berikan Diskon Manual (Maks. 15%)',
        description:
            'Tanpa memerlukan persetujuan Supervisor/Owner.',
    },
    {
        id: 'void',
        title: 'Izin Void / Pembatalan Pesanan',
        description:
            'Kasir wajib mengembalikan item jika mencetak ulang sebelum bayar.',
        supervisorOnly: true,
    },
    {
        id: 'cash_drawer',
        title: 'Akses Buka Laci Kas (Cash Drawer)',
        description:
            'Pembuka baku kunci laci kas fisik secara manual melalui layar POS.',
    },
    {
        id: 'reports',
        title: 'Lihat Laporan Tutup Kasir & Total Omzet Hari Ini',
        description:
            'Menampilkan rekonsiliasi kas ril dan dashboard pendapatan harian.',
    },
    {
        id: 'receipt',
        title: 'Cetak Ulang Struk (Reprint Receipt)',
        description:
            'Diperbolehkan mencetak salinan tagihan pelanggan.',
    },
];

export const defaultCashierPrivileges = [
    'transactions',
    'discounts',
    'cash_drawer',
    'receipt',
];

export const cashierShiftOptions = [
    'Pagi (07.00 – 15.00)',
    'Sore (15.00 – 23.00)',
    'Malam (23.00 – 07.00)',
    'Fleksibel / On-call',
];

export const cashierStatusMap = {
    'CSR-001': {
        status: 'Terminal 01',
        detail: '12 mnt lalu (WTR-904)',
        tone: 'green',
        level: 'Head Barista & Kasir',
        onDuty: true,
        terminal: '01',
    },
    'CSR-002': {
        status: 'Standby',
        detail: 'Shift Sore',
        tone: 'blue',
        level: 'Kasir Senior',
        onDuty: true,
        terminal: null,
    },
    'CSR-003': {
        status: 'Offline',
        detail: 'Kemarin 22:15',
        tone: 'stone',
        level: 'Kasir Junior',
        onDuty: false,
        terminal: null,
    },
    'CSR-004': {
        status: 'Cuti Terjadwal',
        detail: 'Kembali 14 Okt',
        tone: 'rose',
        level: 'Kasir Senior',
        onDuty: false,
        terminal: null,
    },
    'CSR-005': {
        status: 'Dinonaktifkan',
        detail: 'Oleh Baskoro (Owner)',
        tone: 'rose',
        level: 'Kasir Junior',
        onDuty: false,
        terminal: null,
    },
    'CSR-006': {
        status: 'Terminal 02',
        detail: '8 mnt lalu (WTR-902)',
        tone: 'green',
        level: 'Kasir Junior',
        onDuty: true,
        terminal: '02',
    },
};

export const cashierLogEntries = [
    {
        time: '17:23',
        staff: 'Sarah Nurhaliza',
        terminal: 'Terminal 01',
        action: 'Login shift · PIN terverifikasi',
        status: 'Berhasil',
    },
    {
        time: '15:04',
        staff: 'Bimo Prakoso',
        terminal: 'Terminal 02',
        action: 'Tutup shift · kas sesuai (Rp 2.450.000)',
        status: 'Selesai',
    },
    {
        time: '12:18',
        staff: 'Rian Prasetyo',
        terminal: 'Terminal 02',
        action: 'Percobaan PIN salah 1x',
        status: 'Ditolak',
    },
    {
        time: '09:02',
        staff: 'Sarah Nurhaliza',
        terminal: 'Terminal 01',
        action: 'Buka kasir · opening float Rp 500.000',
        status: 'Berhasil',
    },
];

export const cashierKpis = {
    quota: 10,
    activeQuota: 5,
    securityNote:
        'Otomatis lock screen POS setelah 5 menit idle tanpa transaksi.',
};
