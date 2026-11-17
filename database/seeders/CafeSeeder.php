<?php

namespace Database\Seeders;

use App\Models\Cafe;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CafeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = resource_path('js/data/cafes.json');

        if (! file_exists($jsonPath)) {
            return;
        }

        $cafesData = json_decode(file_get_contents($jsonPath), true);

        if (! is_array($cafesData)) {
            return;
        }

        // Area coordinate references in Batam
        $areaCoords = [
            'tembesi' => [1.0545, 103.9920],
            'pasir putih' => [1.1415, 104.0530],
            'penuin' => [1.1390, 104.0135],
            'artotel' => [1.1388, 104.0130],
            'batu aji' => [1.0520, 103.9870],
            'tiban' => [1.1120, 103.9780],
            'sungai panas' => [1.1350, 104.0320],
            'raden patah' => [1.1450, 104.0150],
            'nagoya' => [1.1440, 104.0160],
            'baloi' => [1.1345, 104.0090],
            'batam center' => [1.1305, 104.0485],
            'tanjung uma' => [1.1450, 103.9935],
            'ocarina' => [1.1500, 104.0410],
            'bengkong' => [1.1480, 104.0360],
            'galael' => [1.1245, 104.0315],
            'mega legenda' => [1.1160, 104.0580],
            'belian' => [1.1180, 104.0620],
            'kbc' => [1.1175, 104.0615],
            'sukajadi' => [1.1190, 104.0310],
            'harbour bay' => [1.1550, 103.9920],
            'botania' => [1.1120, 104.0750],
        ];

        // Specific top-rated cafes to prepend / ensure presence
        $featuredCafes = [
            [
                'name' => 'Common Grounds Batam',
                'slug' => 'common-grounds-batam',
                'area' => 'Batam Center, Penuin',
                'address' => 'Komplek Ruko Penuin Business Center Blok A No. 3-4, Batam Center',
                'latitude' => 1.1395200,
                'longitude' => 104.0145100,
                'maps_url' => 'https://maps.google.com/?q=1.13952,104.01451',
                'rating' => 4.9,
                'reviews_count' => 1240,
                'wifi_speed' => 180,
                'wifi_rating' => 5,
                'price_min' => 28000,
                'price_max' => 65000,
                'coworking' => true,
                'long_table' => true,
                'smoking' => true,
                'mushola' => true,
                'is_open' => true,
                'note' => 'Filter pioneers, specialty espresso & brunch nyaman untuk WFC.',
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Tanamera Coffee Roastery',
                'slug' => 'tanamera-coffee-roastery',
                'area' => 'Batam Center, dekat One Batam Mall',
                'address' => 'Jl. Engku Putri, One Batam Mall Ground Floor, Batam Center',
                'latitude' => 1.1315400,
                'longitude' => 104.0490200,
                'maps_url' => 'https://maps.google.com/?q=1.13154,104.04902',
                'rating' => 4.9,
                'reviews_count' => 840,
                'wifi_speed' => 145,
                'wifi_rating' => 5,
                'price_min' => 25000,
                'price_max' => 55000,
                'coworking' => true,
                'long_table' => true,
                'smoking' => true,
                'mushola' => true,
                'is_open' => true,
                'note' => 'Espresso tegas, seating nyaman, dan batch brew single origin Nusantara.',
                'image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Manner Coffee Batam',
                'slug' => 'manner-coffee-batam',
                'area' => 'Nagoya Thamrin City',
                'address' => 'Kawasan Nagoya Thamrin City Blok C No. 8, Lubuk Baja',
                'latitude' => 1.1425100,
                'longitude' => 104.0182200,
                'maps_url' => 'https://maps.google.com/?q=1.14251,104.01822',
                'rating' => 4.8,
                'reviews_count' => 610,
                'wifi_speed' => 160,
                'wifi_rating' => 5,
                'price_min' => 24000,
                'price_max' => 50000,
                'coworking' => true,
                'long_table' => true,
                'smoking' => false,
                'mushola' => true,
                'is_open' => true,
                'note' => 'Spesialis espresso bar modern, konsep minimalist Scandinavian.',
                'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Anchor Cafe & Roastery',
                'slug' => 'anchor-cafe-roastery',
                'area' => 'Dermaga Sukajadi',
                'address' => 'Komplek Dermaga Culinary Paradise Blok RF No. 11, Sukajadi',
                'latitude' => 1.1192000,
                'longitude' => 104.0315000,
                'maps_url' => 'https://maps.google.com/?q=1.11920,104.03150',
                'rating' => 4.9,
                'reviews_count' => 950,
                'wifi_speed' => 120,
                'wifi_rating' => 4,
                'price_min' => 30000,
                'price_max' => 75000,
                'coworking' => true,
                'long_table' => true,
                'smoking' => true,
                'mushola' => true,
                'is_open' => true,
                'note' => 'Artisanal roastery bergaya American bakery dengan kopi specialty segar.',
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($featuredCafes as $cafe) {
            Cafe::updateOrCreate(
                ['slug' => $cafe['slug']],
                $cafe
            );
        }

        $counter = 0;
        foreach ($cafesData as $item) {
            $name = $item['name'] ?? null;
            if (! $name) {
                continue;
            }

            $counter++;
            $slug = Str::slug($name);

            // Coordinates
            $lat = $item['lat'] ?? null;
            $lng = $item['lng'] ?? null;

            if ($lat === null || $lng === null) {
                $areaText = strtolower($item['area'] ?? '');
                $matched = false;

                foreach ($areaCoords as $key => $coords) {
                    if (str_contains($areaText, $key)) {
                        $jitterLat = (($counter % 7) - 3) * 0.0018;
                        $jitterLng = (($counter % 5) - 2) * 0.0022;
                        $lat = $coords[0] + $jitterLat;
                        $lng = $coords[1] + $jitterLng;
                        $matched = true;
                        break;
                    }
                }

                if (! $matched) {
                    $jitterLat = (($counter % 9) - 4) * 0.0025;
                    $jitterLng = (($counter % 7) - 3) * 0.0030;
                    $lat = 1.1320 + $jitterLat;
                    $lng = 104.0400 + $jitterLng;
                }
            }

            $wifiVal = $item['wifi'] ?? null;
            $wifiRating = is_numeric($wifiVal) ? (int) $wifiVal : 4;
            $wifiSpeed = $wifiRating >= 5 ? 150 : ($wifiRating >= 4 ? 100 : 50);

            Cafe::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'area' => $item['area'] ?? 'Batam',
                    'address' => ($item['area'] ?? 'Batam').', Kota Batam, Kepulauan Riau',
                    'latitude' => (float) $lat,
                    'longitude' => (float) $lng,
                    'maps_url' => $item['maps_url'] ?? "https://maps.google.com/?q={$lat},{$lng}",
                    'rating' => 4.5 + (($counter % 5) * 0.1),
                    'reviews_count' => 50 + (($counter * 37) % 500),
                    'wifi_speed' => $wifiSpeed,
                    'wifi_rating' => $wifiRating,
                    'price_min' => $item['price_min'] ?? 20000,
                    'price_max' => $item['price_max'] ?? 45000,
                    'coworking' => (bool) ($item['coworking'] ?? false),
                    'long_table' => (bool) ($item['long_table'] ?? false),
                    'smoking' => (bool) ($item['smoking'] ?? false),
                    'mushola' => (bool) ($item['mushola'] ?? false),
                    'is_open' => true,
                    'note' => $item['note'] ?? $item['review'] ?? null,
                    'image' => null,
                ]
            );
        }
    }
}
