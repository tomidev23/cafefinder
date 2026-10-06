import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Hero from '@/Components/Hero';
import Ranking from '@/Components/Ranking';
import MapSection from '@/Components/MapSection';
import Featured from '@/Components/Featured';
import OwnerCta from '@/Components/OwnerCta';
import Footer from '@/Components/Footer';

export default function Welcome() {
    return (
        <>
            <Head title="Beranda" />
            <div className="min-h-screen bg-white font-sans text-stone-800 antialiased">
                <Navbar />
                <main>
                    <Hero />
                    <Ranking />
                    <MapSection />
                    <Featured />
                    <OwnerCta />
                </main>
                <Footer />
            </div>
        </>
    );
}
