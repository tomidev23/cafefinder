import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Hero from '@/Components/Hero';
import Ranking from '@/Components/Ranking';
import MapSection from '@/Components/MapSection';
import Featured from '@/Components/Featured';
import OwnerCta from '@/Components/OwnerCta';
import Footer from '@/Components/Footer';
import SmoothScroll from '@/Components/SmoothScroll';

export default function Welcome({ homeData = {} }) {
    const [selectedIntent, setSelectedIntent] = useState(null);
    const [externalSearch, setExternalSearch] = useState('');
    const [externalOrigin, setExternalOrigin] = useState(null);
    const [externalSelectedId, setExternalSelectedId] = useState(null);
    const [externalFilters, setExternalFilters] = useState([]);

    const handleHeroSearch = (query) => {
        setExternalSearch(query);
        const mapEl = document.getElementById('maps');
        if (mapEl) {
            mapEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHeroSelectCafe = (cafe) => {
        setExternalSelectedId(cafe?.id ?? null);
        const mapEl = document.getElementById('maps');
        if (mapEl) {
            mapEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHeroLocationFound = (loc) => {
        setExternalOrigin(loc);
        const mapEl = document.getElementById('maps');
        if (mapEl) {
            mapEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHeroFilterChange = (filters) => {
        setExternalFilters(filters);
    };

    return (
        <SmoothScroll>
            <Head title="Beranda" />
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.10),transparent_34%),linear-gradient(180deg,#fafaf9_0%,#ffffff_18%,#f5f5f4_100%)] font-sans text-stone-800 antialiased dark:bg-stone-950 dark:text-stone-100 dark:bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.18),transparent_40%),linear-gradient(180deg,#141210_0%,#1c1917_40%,#0c0a09_100%)]">
                <Navbar />
                <main>
                    <Hero
                        selectedIntent={selectedIntent}
                        onIntentChange={setSelectedIntent}
                        stats={homeData.stats}
                        cafes={homeData.cafes}
                        onSearch={handleHeroSearch}
                        onSelectCafe={handleHeroSelectCafe}
                        onLocationFound={handleHeroLocationFound}
                        onFilterChange={handleHeroFilterChange}
                    />
                    <Ranking selectedIntent={selectedIntent} cafes={homeData.ranking} />
                    <MapSection
                        cafes={homeData.cafes}
                        externalSearch={externalSearch}
                        externalOrigin={externalOrigin}
                        externalSelectedId={externalSelectedId}
                        externalFilters={externalFilters}
                    />
                    <Featured featured={homeData.featured} />
                    <OwnerCta />
                </main>
                <Footer />
            </div>
        </SmoothScroll>
    );
}
