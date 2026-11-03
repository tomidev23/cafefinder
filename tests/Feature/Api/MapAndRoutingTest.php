<?php

namespace Tests\Feature\Api;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MapAndRoutingTest extends TestCase
{
    use RefreshDatabase;

    public function test_cafes_api_returns_list_with_coordinates(): void
    {
        Cafe::factory()->create([
            'name' => 'Kopi Batam Test',
            'slug' => 'kopi-batam-test',
            'latitude' => 1.1305,
            'longitude' => 104.0485,
        ]);

        $response = $this->getJson('/api/cafes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'count',
                'data' => [
                    '*' => ['id', 'name', 'latitude', 'longitude', 'lat', 'lng'],
                ],
            ]);
    }

    public function test_geocode_places_search_returns_matches(): void
    {
        $response = $this->getJson('/api/places/search?q=Grand');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'query',
                'data' => [
                    '*' => ['name', 'display_name', 'lat', 'lng'],
                ],
            ]);
    }

    public function test_route_api_returns_calculated_route_and_instructions(): void
    {
        $response = $this->getJson('/api/route?from_lat=1.1305&from_lng=104.0485&to_lat=1.1345&to_lng=104.0090&profile=driving-car');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'distance',
                'distance_formatted',
                'duration',
                'duration_formatted',
                'coordinates',
                'steps' => [
                    '*' => ['index', 'instruction', 'distance', 'duration'],
                ],
            ]);
    }
}
