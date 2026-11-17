<?php

namespace App\Services;

use App\Models\Cafe;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CafePageData
{
    /**
     * @return array<string, mixed>
     */
    public function home(): array
    {
        $cafes = Cafe::query()
            ->orderByDesc('rating')
            ->get()
            ->map(fn (Cafe $cafe): array => $this->cafeCard($cafe))
            ->values()
            ->all();

        return [
            'cafes' => $cafes,
            'ranking' => $cafes,
            'featured' => array_slice($cafes, 0, 3),
            'stats' => [
                'cafeCount' => count($cafes),
                'reviewCount' => (int) DB::table('reviews')->count(),
                'orderCount' => (int) DB::table('orders')->count(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function visitor(?User $user): array
    {
        $cafes = Cafe::query()
            ->orderByDesc('rating')
            ->get()
            ->map(fn (Cafe $cafe): array => $this->cafeCard($cafe))
            ->values()
            ->all();

        $orders = $user
            ? DB::table('orders')->where('user_id', $user->id)->latest('ordered_at')->get()
            : collect();

        $latestReview = $user
            ? DB::table('reviews')->where('user_id', $user->id)->latest()->first()
            : null;

        return [
            'cafes' => $cafes,
            'visitorCafes' => $cafes,
            'visitorStamps' => $user
                ? DB::table('loyalty_stamps')
                    ->where('user_id', $user->id)
                    ->get()
                    ->map(fn (object $stamp): array => [
                        ...((array) $stamp),
                        'stamped' => true,
                    ])
                    ->values()
                    ->all()
                : [],
            'orders' => $orders->map(fn (object $order): array => (array) $order)->values()->all(),
            'defaultLiveOrder' => $orders->first()
                ? (array) $orders->first()
                : null,
            'latestVerifiedReview' => $latestReview ? (array) $latestReview : null,
            'promotedDeals' => [],
            'ranking' => $cafes,
            'podium' => array_slice($cafes, 0, 3),
            'areas' => collect($cafes)->pluck('area')->filter()->unique()->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function owner(?User $user): array
    {
        $cafe = $this->cafeForUser($user);
        $cafeId = $cafe?->id;
        $menuItems = $cafeId
            ? DB::table('menu_items')
                ->leftJoin('menu_categories', 'menu_categories.id', '=', 'menu_items.category_id')
                ->where('menu_items.cafe_id', $cafeId)
                ->orderBy('menu_items.name')
                ->select('menu_items.*', 'menu_categories.name as category_name')
                ->get()
            : collect();
        $categories = $cafeId
            ? DB::table('menu_categories')->where('cafe_id', $cafeId)->orderBy('name')->get()
            : collect();
        $tables = $cafeId
            ? DB::table('cafe_tables')
                ->join('table_zones', 'table_zones.id', '=', 'cafe_tables.zone_id')
                ->where('table_zones.cafe_id', $cafeId)
                ->select('cafe_tables.*', 'table_zones.name as zone_name')
                ->get()
            : collect();
        $reviews = $cafeId
            ? DB::table('reviews')
                ->leftJoin('users', 'users.id', '=', 'reviews.user_id')
                ->where('reviews.cafe_id', $cafeId)
                ->latest('reviews.created_at')
                ->select('reviews.*', 'users.name as reviewer_name')
                ->get()
            : collect();
        $orders = $cafeId
            ? DB::table('orders')->where('cafe_id', $cafeId)->latest('ordered_at')->get()
            : collect();
        $footTraffic = array_fill(0, 12, 0);

        foreach ($orders as $order) {
            $hour = (int) date('G', strtotime($order->ordered_at));
            $footTraffic[min(11, max(0, $hour - 7))]++;
        }

        $branch = $cafe ? [
            'id' => $cafe->slug,
            'name' => $cafe->name,
            'label' => $cafe->name,
            'storeName' => $cafe->name,
            'area' => $cafe->area,
            'seatsOccupied' => $tables->where('status', 'occupied')->count(),
            'seatsTotal' => max($tables->count(), 1),
            'revenue' => (float) $orders->where('status', 'completed')->sum('total_amount'),
            'orders' => $orders->count(),
            'repeatRate' => 0,
            'settlements' => [],
            'heatmap' => [],
            'chart' => [
                'foot' => $footTraffic,
                'espresso' => $footTraffic,
            ],
        ] : [
            'id' => 'default',
            'name' => 'Belum ada kafe',
            'seatsOccupied' => 0,
            'seatsTotal' => 1,
            'revenue' => 0,
            'orders' => 0,
            'chart' => ['foot' => [], 'espresso' => []],
            'settlements' => [],
            'heatmap' => [],
        ];

        return [
            'branches' => [$branch['id'] => $branch],
            'defaultCustomRange' => ['start' => now()->startOfMonth()->toDateString(), 'end' => now()->toDateString()],
            'hourLabels' => [],
            'liveOrderColumns' => [],
            'liveOrders' => $orders->map(fn (object $order): array => (array) $order)->values()->all(),
            'menuItems' => $menuItems->values()->map(function (object $item, int $index): array {
                return [
                    ...((array) $item),
                    'rank' => $index + 1,
                    'rankTone' => $index === 0 ? 'peach' : 'blue',
                    'category' => $item->category_name ?? 'Menu',
                    'revenue' => (float) $item->price,
                    'units' => 0,
                    'stock' => [
                        'tone' => $item->in_stock ? 'healthy' : 'low',
                        'label' => $item->in_stock ? 'In stock' : 'Out of stock',
                        'detail' => null,
                    ],
                ];
            })->all(),
            'rosterSuggestions' => [],
            'dashboardTargets' => [],
            'branchOptions' => [$branch],
            'rangeOptions' => [],
            'sparklineBars' => [],
            'cashierKpis' => [],
            'cashierLogEntries' => [],
            'cashierPrivileges' => [],
            'cashierShiftOptions' => [],
            'cashierStatusMap' => [],
            'defaultCashierPrivileges' => [],
            'baristaOfMonth' => null,
            'performanceStaff' => [],
            'rosterStaff' => [],
            'scheduleDays' => [],
            'scheduleKpis' => [],
            'connectedDevices' => $this->records($cafeId, 'devices'),
            'hardwareDevices' => $this->records($cafeId, 'devices'),
            'defaultPrinterConfig' => [],
            'shiftSummary' => [
                'morning' => [
                    'label' => 'Shift Pagi',
                    'status' => 'Belum ada data',
                    'staff' => [],
                    'checkIn' => 'Belum ada catatan check-in.',
                ],
                'evening' => [
                    'label' => 'Shift Sore',
                    'status' => 'Belum ada data',
                    'staff' => [],
                    'checkIn' => 'Belum ada catatan check-in.',
                ],
                'performance' => [
                    'status' => 'Belum ada data',
                    'espresso' => '-',
                    'manual' => '-',
                    'totalOrders' => 0,
                ],
            ],
            'tableFilters' => [
                ['id' => 'all', 'label' => 'Semua Area', 'count' => $tables->count()],
                ...$tables->groupBy('zone_name')->map(
                    fn (Collection $zone, string $name): array => [
                        'id' => str($name)->slug()->toString(),
                        'label' => $name,
                        'count' => $zone->count(),
                    ],
                )->values()->all(),
            ],
            'tableOperationalSettings' => [
                'qrOrdering' => true,
                'qrisDeposit' => false,
                'maxParty' => 8,
            ],
            'tableZones' => $tables->groupBy('zone_name')->map(fn (Collection $zone, string $name): array => [
                'id' => str($name)->slug()->toString(),
                'name' => $name,
                'tables' => $zone->map(fn (object $table): array => (array) $table)->values()->all(),
            ])->values()->all(),
            'categoryOptions' => [],
            'ratingDistribution' => [],
            'reviewActionSuggestion' => null,
            'reviewKeywords' => [],
            'reviewMetrics' => ['total' => $reviews->count()],
            'reviews' => $reviews->map(function (object $review): array {
                return [
                    ...((array) $review),
                    'name' => $review->reviewer_name ?? 'Pelanggan CafeFinder',
                    'text' => $review->content,
                    'helpful' => $review->helpful_count,
                    'daysAgo' => now()->diffInDays($review->created_at),
                    'tags' => [],
                ];
            })->values()->all(),
            'sortOptions' => [],
            'statusOptions' => [],
            'menuCategories' => $categories->map(fn (object $category): array => (array) $category)->values()->all(),
            'initialMenuDraft' => [
                'name' => '',
                'category' => '',
                'description' => '',
                'notes' => [],
                'baristaRecommendation' => false,
                'inStock' => true,
                'servingTemperature' => 'hot',
                'bean' => '',
                'sweetness' => '',
                'milk' => '',
                'customOptions' => [],
                'price' => '',
                'promoPrice' => '',
                'hpp' => '',
                'dose' => '',
                'ratio' => '',
                'waterTemp' => '',
                'targetTime' => '',
                'grindSize' => '',
                'brewer' => '',
            ],
            'beanOptions' => [],
            'menuDefaultImage' => '/images/cafe-placeholder.svg',
            'milkOptions' => [],
            'pourStages' => [],
            'sweetnessOptions' => [],
            'tastingNotePresets' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function pos(?User $user): array
    {
        $cafe = $this->cafeForUser($user);
        $items = $cafe
            ? DB::table('menu_items')->where('cafe_id', $cafe->id)->where('in_stock', true)->orderBy('name')->get()
            : collect();
        $tables = $cafe
            ? DB::table('cafe_tables')
                ->join('table_zones', 'table_zones.id', '=', 'cafe_tables.zone_id')
                ->where('table_zones.cafe_id', $cafe->id)
                ->select('cafe_tables.*', 'table_zones.name as zone_name')
                ->get()
            : collect();

        return [
            'posProducts' => $items->map(fn (object $item): array => [
                'id' => $item->id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'category' => $item->category_id,
                'image' => $item->image,
                'badge' => $item->barista_recommendation ? 'Best Seller' : null,
            ])->values()->all(),
            'posCategories' => [
                ['id' => 'all', 'label' => 'Semua Menu'],
                ...DB::table('menu_categories')
                    ->when($cafe, fn ($query) => $query->where('cafe_id', $cafe->id))
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (object $category): array => [
                        'id' => $category->id,
                        'label' => $category->name,
                    ])
                    ->values()
                    ->all(),
            ],
            'posTables' => $tables->map(fn (object $table): array => (array) $table)->values()->all(),
            'initialPosCart' => [],
            'initialHeldOrders' => $cafe
                ? DB::table('orders')->where('cafe_id', $cafe->id)->where('status', 'held')->get()->map(fn (object $order): array => (array) $order)->values()->all()
                : [],
            'paymentMethods' => [
                ['id' => 'qris', 'label' => 'QRIS', 'icon' => 'qris'],
                ['id' => 'cash', 'label' => 'Tunai', 'icon' => 'cash'],
                ['id' => 'card', 'label' => 'Kartu', 'icon' => 'card'],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function cafeCard(Cafe $cafe): array
    {
        return [
            'id' => $cafe->id,
            'slug' => $cafe->slug,
            'store_code' => $cafe->store_code,
            'name' => $cafe->name,
            'area' => $cafe->area,
            'address' => $cafe->address,
            'rating' => $cafe->rating,
            'reviewsCount' => $cafe->reviews_count,
            'wifi' => $cafe->wifi,
            'wifi_speed' => $cafe->wifi_speed,
            'price_min' => $cafe->price_min,
            'price_max' => $cafe->price_max,
            'image_url' => $cafe->image,
            'lat' => $cafe->lat,
            'lng' => $cafe->lng,
            'maps_url' => $cafe->maps_url,
            'is_open' => $cafe->is_open,
            'coworking' => $cafe->coworking,
            'long_table' => $cafe->long_table,
            'smoking' => $cafe->smoking,
            'mushola' => $cafe->mushola,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function records(?int $cafeId, string $table): array
    {
        if (! $cafeId) {
            return [];
        }

        return DB::table($table)->where('cafe_id', $cafeId)->get()->map(fn (object $record): array => (array) $record)->values()->all();
    }

    private function cafeForUser(?User $user): ?Cafe
    {
        $storeCode = $user?->store_code ?? config('pos.store.code');

        return Cafe::query()
            ->where('store_code', $storeCode)
            ->first();
    }
}
