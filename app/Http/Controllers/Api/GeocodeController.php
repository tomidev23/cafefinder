<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    /**
     * Curated landmarks and hubs in Batam for instant, reliable matching.
     *
     * @var list<array{name: string, display_name: string, lat: float, lng: float, type: string}>
     */
    protected array $batamLandmarks = [
        [
            'name' => 'Grand Batam Mall',
            'display_name' => 'Grand Batam Mall, Jl. Pembangunan, Batu Selicin, Lubuk Baja',
            'lat' => 1.1345,
            'lng' => 104.0090,
            'type' => 'mall',
        ],
        [
            'name' => 'One Batam Mall',
            'display_name' => 'One Batam Mall, Jl. Engku Putri No.1, Batam Center, Teluk Tering',
            'lat' => 1.1310,
            'lng' => 104.0495,
            'type' => 'mall',
        ],
        [
            'name' => 'Mega Mall Batam Centre',
            'display_name' => 'Mega Mall Batam Centre, Jl. Engku Putri, Teluk Tering, Batam Center',
            'lat' => 1.1290,
            'lng' => 104.0545,
            'type' => 'mall',
        ],
        [
            'name' => 'Nagoya Hill Shopping Mall',
            'display_name' => 'Nagoya Hill Shopping Mall, Jl. Teuku Umar No.1, Lubuk Baja',
            'lat' => 1.1448,
            'lng' => 104.0152,
            'type' => 'mall',
        ],
        [
            'name' => 'BCS Mall (Batam City Square)',
            'display_name' => 'Batam City Square (BCS), Jl. Bunga Raya, Penuin, Lubuk Baja',
            'lat' => 1.1385,
            'lng' => 104.0125,
            'type' => 'mall',
        ],
        [
            'name' => 'Batam Centre International Ferry Terminal',
            'display_name' => 'Pelabuhan Ferry Internasional Batam Center, Teluk Tering',
            'lat' => 1.1298,
            'lng' => 104.0570,
            'type' => 'transport',
        ],
        [
            'name' => 'Harbour Bay Ferry Terminal & Downtown',
            'display_name' => 'Pelabuhan Harbour Bay, Jl. Duyung, Sungai Jodoh, Batu Ampar',
            'lat' => 1.1555,
            'lng' => 103.9925,
            'type' => 'transport',
        ],
        [
            'name' => 'Bandara Internasional Hang Nadim',
            'display_name' => 'Bandar Udara Internasional Hang Nadim, Batu Besar, Nongsa',
            'lat' => 1.1215,
            'lng' => 104.1165,
            'type' => 'transport',
        ],
        [
            'name' => 'Alun-Alun Engku Putri Batam Center',
            'display_name' => 'Alun-Alun Engku Putri, Komplek Kantor Walikota Batam Center',
            'lat' => 1.1280,
            'lng' => 104.0515,
            'type' => 'landmark',
        ],
        [
            'name' => 'Kepri Mall & Simpang Kabil',
            'display_name' => 'Kepri Mall, Simpang Kabil, Sukajadi, Batam Kota',
            'lat' => 1.1160,
            'lng' => 104.0380,
            'type' => 'mall',
        ],
        [
            'name' => 'Dermaga Culinary Sukajadi',
            'display_name' => 'Komplek Dermaga Culinary Paradise, Sukajadi, Batam Kota',
            'lat' => 1.1190,
            'lng' => 104.0315,
            'type' => 'landmark',
        ],
        [
            'name' => 'Batam Center (Pusat Kota)',
            'display_name' => 'Kawasan Pemerintahan & Bisnis Batam Center, Teluk Tering',
            'lat' => 1.1305,
            'lng' => 104.0485,
            'type' => 'area',
        ],
        [
            'name' => 'Nagoya / Lubuk Baja',
            'display_name' => 'Kawasan Bisnis & Kuliner Nagoya, Lubuk Baja',
            'lat' => 1.1440,
            'lng' => 104.0160,
            'type' => 'area',
        ],
        [
            'name' => 'Penuin',
            'display_name' => 'Kawasan Kuliner & Pasar Penuin, Lubuk Baja',
            'lat' => 1.1390,
            'lng' => 104.0135,
            'type' => 'area',
        ],
        [
            'name' => 'Batu Aji (Mitra Mall)',
            'display_name' => 'Kawasan Batu Aji & Mitra Mall, Tembesi',
            'lat' => 1.0520,
            'lng' => 103.9870,
            'type' => 'area',
        ],
        [
            'name' => 'Tiban Center',
            'display_name' => 'Tiban Center & Wisata Kuliner Tiban, Sekupang',
            'lat' => 1.1120,
            'lng' => 103.9780,
            'type' => 'area',
        ],
        [
            'name' => 'Bengkong Golden Prawn',
            'display_name' => 'Kawasan Wisata Bahari Bengkong & Golden Prawn',
            'lat' => 1.1580,
            'lng' => 104.0320,
            'type' => 'area',
        ],
        [
            'name' => 'Pasir Putih Ocarina',
            'display_name' => 'Mega Wisata Ocarina & Kawasan Pasir Putih, Batam Kota',
            'lat' => 1.1500,
            'lng' => 104.0410,
            'type' => 'landmark',
        ],
    ];

    /**
     * Search addresses, landmarks, or areas.
     */
    public function search(Request $request): JsonResponse
    {
        $rawQuery = trim((string) $request->query('q', ''));

        if (mb_strlen($rawQuery) < 2) {
            return response()->json([
                'status' => 'success',
                'query' => $rawQuery,
                'data' => array_slice($this->batamLandmarks, 0, 8),
            ]);
        }

        $queryLower = mb_strtolower($rawQuery);
        $results = [];

        // 1. Search in local curated landmarks
        foreach ($this->batamLandmarks as $landmark) {
            $nameMatch = str_contains(mb_strtolower($landmark['name']), $queryLower);
            $displayMatch = str_contains(mb_strtolower($landmark['display_name']), $queryLower);

            if ($nameMatch || $displayMatch) {
                $results[] = $landmark;
            }
        }

        // 2. Query Nominatim OpenStreetMap API with cache
        $cacheKey = 'geocode_osm_'.md5($queryLower);
        $osmResults = Cache::remember($cacheKey, now()->addHours(12), function () use ($rawQuery) {
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'CafeFinder/1.0 (contact@cafefinder.id)',
                    'Accept-Language' => 'id,en',
                ])
                    ->timeout(3)
                    ->get('https://nominatim.openstreetmap.org/search', [
                        'q' => $rawQuery.', Batam',
                        'format' => 'json',
                        'addressdetails' => 1,
                        'limit' => 5,
                        'countrycodes' => 'id',
                        'viewbox' => '103.85,1.25,104.25,1.00',
                        'bounded' => 0,
                    ]);

                if (! $response->successful()) {
                    return [];
                }

                $data = $response->json();
                if (! is_array($data)) {
                    return [];
                }

                return array_map(function ($item) {
                    return [
                        'name' => $item['name'] ?: explode(',', $item['display_name'] ?? '')[0],
                        'display_name' => $item['display_name'] ?? '',
                        'lat' => (float) ($item['lat'] ?? 0),
                        'lng' => (float) ($item['lon'] ?? 0),
                        'type' => $item['type'] ?? 'address',
                    ];
                }, $data);
            } catch (\Throwable $e) {
                return [];
            }
        });

        // Combine local results first, then OSM results
        foreach ($osmResults as $item) {
            // Avoid duplicate coordinates
            $isDuplicate = false;
            foreach ($results as $existing) {
                if (abs($existing['lat'] - $item['lat']) < 0.001 && abs($existing['lng'] - $item['lng']) < 0.001) {
                    $isDuplicate = true;
                    break;
                }
            }

            if (! $isDuplicate && $item['lat'] != 0) {
                $results[] = $item;
            }
        }

        return response()->json([
            'status' => 'success',
            'query' => $rawQuery,
            'data' => array_slice($results, 0, 10),
        ]);
    }
}
