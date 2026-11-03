<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cafe extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'area',
        'address',
        'latitude',
        'longitude',
        'maps_url',
        'rating',
        'reviews_count',
        'wifi_speed',
        'wifi_rating',
        'price_min',
        'price_max',
        'coworking',
        'long_table',
        'smoking',
        'mushola',
        'is_open',
        'note',
        'image',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'lat',
        'lng',
        'wifi',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'rating' => 'float',
            'reviews_count' => 'integer',
            'wifi_speed' => 'integer',
            'wifi_rating' => 'integer',
            'price_min' => 'integer',
            'price_max' => 'integer',
            'coworking' => 'boolean',
            'long_table' => 'boolean',
            'smoking' => 'boolean',
            'mushola' => 'boolean',
            'is_open' => 'boolean',
        ];
    }

    /**
     * Alias latitude as lat for frontend convenience.
     */
    protected function lat(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->latitude,
            set: fn ($value) => ['latitude' => $value],
        );
    }

    /**
     * Alias longitude as lng for frontend convenience.
     */
    protected function lng(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->longitude,
            set: fn ($value) => ['longitude' => $value],
        );
    }

    /**
     * Alias wifi_rating as wifi for frontend compatibility.
     */
    protected function wifi(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->wifi_rating ?? ($this->wifi_speed ? min(5, max(1, (int) round($this->wifi_speed / 30))) : 4),
        );
    }

    /**
     * Calculate haversine distance in meters to a given lat/lng.
     */
    public function distanceTo(float $targetLat, float $targetLng): float
    {
        $earthRadius = 6371000; // in meters

        $latFrom = deg2rad($this->latitude);
        $lonFrom = deg2rad($this->longitude);
        $latTo = deg2rad($targetLat);
        $lonTo = deg2rad($targetLng);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(
            pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)
        ));

        return $angle * $earthRadius;
    }
}
