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
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.10),transparent_34%),linear-gradient(180deg,#fafaf9_0%,#ffffff_18%,#f5f5f4_100%)] font-sans text-stone-800 antialiased">
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
