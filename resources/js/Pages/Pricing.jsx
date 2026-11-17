import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import PricingPlans from '@/Components/PricingPlans';
import Footer from '@/Components/Footer';

export default function Pricing() {
    return (
        <>
            <Head title="Paket Promosi Kafe" />
            <div className="min-h-screen bg-stone-50 font-sans text-stone-800 dark:bg-stone-950 dark:text-stone-100">
                <Navbar />
                <main>
                    <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 pt-6 text-xs text-stone-500 sm:px-6 lg:px-10">
                        <Link href="/" className="hover:text-amber-800 dark:hover:text-amber-400">Beranda</Link>
                        <span aria-hidden="true">/</span>
                        <span className="text-stone-800 dark:text-stone-200">Paket promosi</span>
                    </div>
                    <PricingPlans />
                </main>
                <Footer />
            </div>
        </>
    );
}
