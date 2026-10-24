import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdminDashboard from '@/Pages/Dashboard/AdminDashboard';
import CashierDashboard from '@/Pages/Dashboard/CashierDashboard';
import OwnerDashboard from '@/Pages/Dashboard/OwnerDashboard';
import VisitorDashboard from '@/Pages/Dashboard/VisitorDashboard';

const roleMeta = {
    visitor: { label: 'Pengunjung', accent: 'from-amber-500 to-orange-500', title: 'Dashboard Pengunjung' },
    owner: { label: 'Owner Cafe', accent: 'from-emerald-500 to-teal-500', title: 'Dashboard Owner Cafe' },
    admin: { label: 'Admin', accent: 'from-violet-500 to-indigo-500', title: 'Dashboard Admin' },
    cashier: { label: 'Admin Kasir', accent: 'from-rose-500 to-pink-500', title: 'Dashboard Admin Kasir' },
};

const dashboardMap = {
    visitor: VisitorDashboard,
    owner: OwnerDashboard,
    admin: AdminDashboard,
    cashier: CashierDashboard,
};

export default function Dashboard({ role = 'visitor' }) {
    const safeRole = roleMeta[role] ? role : 'visitor';
    const selectedRole = roleMeta[safeRole];
    const SelectedDashboard = dashboardMap[safeRole];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
                            Portal CafeFinder
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-950">
                            {selectedRole.title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`rounded-full bg-gradient-to-r ${selectedRole.accent} px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-xs`}>
                            {selectedRole.label}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={selectedRole.title} />

            <div className="bg-stone-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SelectedDashboard />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
