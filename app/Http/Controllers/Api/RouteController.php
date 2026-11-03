<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class RouteController extends Controller
{
    /**
     * Calculate route and turn-by-turn instructions using OSRM with caching and fallback.
     */
    public function getRoute(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_lat' => ['required', 'numeric', 'between:-90,90'],
            'from_lng' => ['required', 'numeric', 'between:-180,180'],
            'to_lat' => ['required', 'numeric', 'between:-90,90'],
            'to_lng' => ['required', 'numeric', 'between:-180,180'],
            'profile' => ['nullable', 'string', 'in:driving-car,foot-walking,driving,walking,car,foot,bike'],
        ]);

        $fromLat = (float) $validated['from_lat'];
        $fromLng = (float) $validated['from_lng'];
        $toLat = (float) $validated['to_lat'];
        $toLng = (float) $validated['to_lng'];

        $rawProfile = $validated['profile'] ?? 'driving-car';
        $osrmProfile = match ($rawProfile) {
            'foot-walking', 'walking', 'foot' => 'foot',
            'bike', 'cycling' => 'bike',
            default => 'car',
        };

        // Cache key based on rounded coordinates and profile
        $cacheKey = sprintf(
            'osrm_route_%s_%.4f_%.4f_%.4f_%.4f',
            $osrmProfile,
            $fromLat,
            $fromLng,
            $toLat,
            $toLng
        );

        $routeData = Cache::remember($cacheKey, now()->addHours(6), function () use ($osrmProfile, $fromLat, $fromLng, $toLat, $toLng) {
            return $this->fetchFromOsrm($osrmProfile, $fromLat, $fromLng, $toLat, $toLng);
        });

        return response()->json($routeData);
    }

    /**
     * Query OSRM routing engine.
     *
     * @return array<string, mixed>
     */
    protected function fetchFromOsrm(string $profile, float $fromLat, float $fromLng, float $toLat, float $toLng): array
    {
        $url = sprintf(
            'https://router.project-osrm.org/route/v1/%s/%f,%f;%f,%f?overview=full&geometries=geojson&steps=true',
            $profile,
            $fromLng,
            $fromLat,
            $toLng,
            $toLat
        );

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'CafeFinder/1.0 (contact@cafefinder.id)',
            ])
                ->timeout(4)
                ->get($url);

            if ($response->successful()) {
                $json = $response->json();

                if (($json['code'] ?? '') === 'Ok' && ! empty($json['routes'][0])) {
                    $route = $json['routes'][0];
                    $coordinates = [];

                    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
                    if (! empty($route['geometry']['coordinates'])) {
                        foreach ($route['geometry']['coordinates'] as $point) {
                            $coordinates[] = [$point[1], $point[0]];
                        }
                    }

                    // Extract turn-by-turn instructions
                    $steps = [];
                    if (! empty($route['legs'][0]['steps'])) {
                        foreach ($route['legs'][0]['steps'] as $index => $step) {
                            $steps[] = [
                                'index' => $index + 1,
                                'instruction' => $this->formatInstruction($step),
                                'distance' => round($step['distance'] ?? 0),
                                'distance_formatted' => $this->formatDistance($step['distance'] ?? 0),
                                'duration' => round($step['duration'] ?? 0),
                                'duration_formatted' => $this->formatDuration($step['duration'] ?? 0),
                                'name' => $step['name'] ?? '',
                                'type' => $step['maneuver']['type'] ?? '',
                                'modifier' => $step['maneuver']['modifier'] ?? '',
                            ];
                        }
                    }

                    return [
                        'status' => 'success',
                        'distance' => round($route['distance'] ?? 0),
                        'distance_formatted' => $this->formatDistance($route['distance'] ?? 0),
                        'duration' => round($route['duration'] ?? 0),
                        'duration_formatted' => $this->formatDuration($route['duration'] ?? 0),
                        'coordinates' => $coordinates,
                        'steps' => $steps,
                        'source' => 'osrm',
                    ];
                }
            }
        } catch (\Throwable $e) {
            // Failover to fallback
        }

        return $this->generateFallbackRoute($profile, $fromLat, $fromLng, $toLat, $toLng);
    }

    /**
     * Human-friendly Indonesian instructions.
     *
     * @param  array<string, mixed>  $step
     */
    protected function formatInstruction(array $step): string
    {
        $maneuver = $step['maneuver'] ?? [];
        $type = $maneuver['type'] ?? 'continue';
        $modifier = $maneuver['modifier'] ?? '';
        $name = trim($step['name'] ?? '');
        $roadText = $name !== '' ? "ke {$name}" : '';

        return match ($type) {
            'depart' => $name ? "Mulai rute dari {$name}" : 'Mulai rute perjalanan Anda',
            'arrive' => 'Tiba di lokasi kafe tujuan',
            'turn' => match ($modifier) {
                'left' => "Belok kiri {$roadText}",
                'right' => "Belok kanan {$roadText}",
                'slight left' => "Ambil sedikit ke kiri {$roadText}",
                'slight right' => "Ambil sedikit ke kanan {$roadText}",
                'sharp left' => "Belok tajam ke kiri {$roadText}",
                'sharp right' => "Belok tajam ke kanan {$roadText}",
                'uturn' => "Putar balik di {$name}",
                default => "Belok {$roadText}",
            },
            'roundabout', 'rotary' => "Masuk bundaran dan ambil jalan keluar {$roadText}",
            'fork' => match ($modifier) {
                'left' => "Ambil jalur kiri di percabangan {$roadText}",
                'right' => "Ambil jalur kanan di percabangan {$roadText}",
                default => "Tetap di percabangan {$roadText}",
            },
            'merge' => "Bergabung dengan jalur {$roadText}",
            'ramp' => "Gunakan jalur penghubung {$roadText}",
            default => $name ? "Lurus terus di {$name}" : 'Lurus terus mengikuti jalan utama',
        };
    }

    /**
     * Fallback route generator if external service is unavailable.
     *
     * @return array<string, mixed>
     */
    protected function generateFallbackRoute(string $profile, float $fromLat, float $fromLng, float $toLat, float $toLng): array
    {
        $earthRadius = 6371000;
        $dLat = deg2rad($toLat - $fromLat);
        $dLng = deg2rad($toLng - $fromLng);
        $a = sin($dLat / 2) ** 2 + cos(deg2rad($fromLat)) * cos(deg2rad($toLat)) * sin($dLng / 2) ** 2;
        $straightMeters = 2 * asin(sqrt($a)) * $earthRadius;

        // Road factor ~1.3x straight distance
        $distance = round($straightMeters * 1.32);

        // Speed estimates: car ~35 km/h (9.7 m/s), foot ~4.5 km/h (1.25 m/s)
        $speed = $profile === 'foot' ? 1.25 : 9.5;
        $duration = max(60, round($distance / $speed));

        // Generate interpolated points with slight curve
        $coordinates = [];
        $stepsCount = 10;
        for ($i = 0; $i <= $stepsCount; $i++) {
            $t = $i / $stepsCount;
            // Slight arch for realistic visual polyline
            $offset = sin($t * M_PI) * 0.0015;
            $lat = $fromLat + ($toLat - $fromLat) * $t + $offset;
            $lng = $fromLng + ($toLng - $fromLng) * $t - $offset * 0.8;
            $coordinates[] = [$lat, $lng];
        }

        $steps = [
            [
                'index' => 1,
                'instruction' => 'Mulai perjalanan menuju jalan utama',
                'distance' => round($distance * 0.15),
                'distance_formatted' => $this->formatDistance($distance * 0.15),
                'duration' => round($duration * 0.15),
                'duration_formatted' => $this->formatDuration($duration * 0.15),
                'type' => 'depart',
                'modifier' => '',
            ],
            [
                'index' => 2,
                'instruction' => 'Lurus terus mengikuti arah kafe',
                'distance' => round($distance * 0.70),
                'distance_formatted' => $this->formatDistance($distance * 0.70),
                'duration' => round($duration * 0.70),
                'duration_formatted' => $this->formatDuration($duration * 0.70),
                'type' => 'continue',
                'modifier' => 'straight',
            ],
            [
                'index' => 3,
                'instruction' => 'Tiba di kafe tujuan',
                'distance' => round($distance * 0.15),
                'distance_formatted' => $this->formatDistance($distance * 0.15),
                'duration' => round($duration * 0.15),
                'duration_formatted' => $this->formatDuration($duration * 0.15),
                'type' => 'arrive',
                'modifier' => '',
            ],
        ];

        return [
            'status' => 'success',
            'distance' => $distance,
            'distance_formatted' => $this->formatDistance($distance),
            'duration' => $duration,
            'duration_formatted' => $this->formatDuration($duration),
            'coordinates' => $coordinates,
            'steps' => $steps,
            'source' => 'direct-fallback',
        ];
    }

    protected function formatDistance(float $meters): string
    {
        return $meters < 1000
            ? round($meters).' m'
            : number_format($meters / 1000, 1).' km';
    }

    protected function formatDuration(float $seconds): string
    {
        $minutes = max(1, (int) round($seconds / 60));

        if ($minutes < 60) {
            return "{$minutes} menit";
        }

        $hours = floor($minutes / 60);
        $remMin = $minutes % 60;

        return $remMin > 0 ? "{$hours} jam {$remMin} mnt" : "{$hours} jam";
    }
}
