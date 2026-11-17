<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cafe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CafeController extends Controller
{
    /**
     * Display a listing of cafes with coordinates and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Cafe::query()->whereNotNull('latitude')->whereNotNull('longitude');

        // Text search
        if ($search = $request->query('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('area', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Feature filters
        if ($request->boolean('wifi')) {
            $query->where(function ($q) {
                $q->where('wifi_rating', '>=', 4)
                    ->orWhere('wifi_speed', '>=', 100);
            });
        }

        if ($request->boolean('coworking')) {
            $query->where('coworking', true);
        }

        if ($request->boolean('long_table')) {
            $query->where('long_table', true);
        }

        if ($request->boolean('smoking')) {
            $query->where('smoking', true);
        }

        if ($request->boolean('mushola')) {
            $query->where('mushola', true);
        }

        $cafes = $query->get();

        $fromLat = $request->filled('from_lat') ? (float) $request->query('from_lat') : null;
        $fromLng = $request->filled('from_lng') ? (float) $request->query('from_lng') : null;

        if ($fromLat !== null && $fromLng !== null) {
            $cafes = $cafes->map(function (Cafe $cafe) use ($fromLat, $fromLng) {
                $distance = $cafe->distanceTo($fromLat, $fromLng);
                $cafe->distance = round($distance);
                $cafe->distance_formatted = $distance < 1000
                    ? round($distance).' m'
                    : number_format($distance / 1000, 1).' km';

                return $cafe;
            })->sortBy('distance')->values();

            // Optional radius filter in meters
            if ($radius = $request->query('radius')) {
                $radiusMeters = (float) $radius;
                $cafes = $cafes->filter(fn (Cafe $c) => ($c->distance ?? 0) <= $radiusMeters)->values();
            }
        }

        return response()->json([
            'status' => 'success',
            'count' => $cafes->count(),
            'data' => $cafes,
        ]);
    }

    /**
     * Display a specific cafe.
     */
    public function show(int $id): JsonResponse
    {
        $cafe = Cafe::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $cafe,
        ]);
    }
}
