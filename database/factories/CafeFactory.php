<?php

namespace Database\Factories;

use App\Models\Cafe;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Cafe>
 */
class CafeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company().' Coffee';

        return [
            'name' => $name,
            'slug' => Str::slug($name.'-'.fake()->unique()->randomNumber(4)),
            'area' => 'Batam Center',
            'address' => fake()->address(),
            'latitude' => 1.1305 + (fake()->numberBetween(-50, 50) * 0.001),
            'longitude' => 104.0485 + (fake()->numberBetween(-50, 50) * 0.001),
            'maps_url' => 'https://maps.google.com',
            'rating' => 4.8,
            'reviews_count' => fake()->numberBetween(10, 500),
            'wifi_speed' => 100,
            'wifi_rating' => 4,
            'price_min' => 20000,
            'price_max' => 45000,
            'coworking' => true,
            'long_table' => true,
            'smoking' => false,
            'mushola' => true,
            'is_open' => true,
        ];
    }
}
