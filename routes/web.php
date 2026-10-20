
<?php

use App\Enums\UserRole;
use App\Http\Controllers\ProfileController;
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

        // Mendukung role berbentuk Enum maupun string.
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

        // Pastikan role yang diminta valid.
        if (! in_array($role, $allowedRoles, true)) {
            abort(404);
        }

        $user = Auth::user();

        abort_unless($user, 401);

        $userRole = $user->role ?? UserRole::VISITOR;

        // Mendukung role berbentuk Enum maupun string.
        if ($userRole instanceof UserRole) {
            $userRole = $userRole->value;
        }

        // Pengguna hanya dapat mengakses dashboard miliknya.
        if ($userRole !== $role) {
            abort(403, 'Dashboard ini tidak tersedia untuk role Anda.');
        }

        return Inertia::render('Dashboard', [
            'role' => $role,
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
