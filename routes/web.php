
<?php

use App\Enums\UserRole;
use App\Http\Controllers\Owner\CashierStaffController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $user = Auth::user();

        abort_unless($user, 401);

        $role = $user->role ?? UserRole::VISITOR;

        if ($role instanceof UserRole) {
            $role = $role->value;
        }

        return redirect()->route('dashboard.role', [
            'role' => $role,
        ]);
    })->name('dashboard');

    Route::get('/dashboard/{role}', function (string $role) {
        $allowedRoles = array_map(
            fn (UserRole $userRole) => $userRole->value,
            UserRole::cases()
        );

        if (! in_array($role, $allowedRoles, true)) {
            abort(404);
        }

        $user = Auth::user();

        abort_unless($user, 401);

        $userRole = $user->role ?? UserRole::VISITOR;

        if ($userRole instanceof UserRole) {
            $userRole = $userRole->value;
        }

        if ($userRole !== $role) {
            abort(403, 'Dashboard ini tidak tersedia untuk role Anda.');
        }

        if ($role === UserRole::CASHIER->value) {
            return redirect()->route('pos');
        }

        $cashiers = $role === UserRole::OWNER_CAFFE->value
            ? User::query()
                ->where('role', 'cashier')
                ->where('store_code', config('pos.store.code'))
                ->orderBy('staff_code')
                ->get(['id', 'name', 'email', 'staff_code', 'phone', 'shift'])
                ->map(fn (User $cashier) => [
                    'id' => $cashier->id,
                    'name' => $cashier->name,
                    'email' => $cashier->email,
                    'staff_code' => $cashier->staff_code,
                    'phone' => $cashier->phone,
                    'shift' => $cashier->shift,
                ])
                ->values()
            : [];

        return Inertia::render('Dashboard', [
            'role' => $role,
            'tab' => request()->query('tab', 'orders'),
            'cashiers' => $cashiers,
            'storeCode' => config('pos.store.code'),
            'flashStatus' => session('status'),
        ]);
    })
        ->whereIn(
            'role',
            array_map(
                fn (UserRole $userRole) => $userRole->value,
                UserRole::cases()
            )
        )
        ->name('dashboard.role');

    Route::get('/pos', function () {
        $user = Auth::user();

        abort_unless($user, 401);

        $role = $user->role instanceof UserRole
            ? $user->role->value
            : $user->role;

        abort_unless(in_array($role, ['owner', 'cashier'], true), 403);

        return Inertia::render('POS/Terminal', [
            'store' => config('pos.store'),
            'cashier' => [
                'name' => $user->name,
                'staff_code' => $user->staff_code,
                'shift' => $user->shift ?? config('pos.store.shift'),
            ],
            'preview' => $role === 'owner',
        ]);
    })->name('pos');

    Route::post('/owner/cashiers', [CashierStaffController::class, 'store'])
        ->name('owner.cashiers.store');
    Route::delete('/owner/cashiers/{staff_code}', [CashierStaffController::class, 'destroy'])
        ->name('owner.cashiers.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [
        ProfileController::class,
        'edit',
    ])->name('profile.edit');

    Route::patch('/profile', [
        ProfileController::class,
        'update',
    ])->name('profile.update');

    Route::delete('/profile', [
        ProfileController::class,
        'destroy',
    ])->name('profile.destroy');
});

require __DIR__.'/auth.php';
