
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
        $role = $user->role ?? UserRole::VISITOR;

        return redirect()->route('dashboard.role', [
            'role' => $role->value,
        ]);
    })->name('dashboard');

    Route::get('/dashboard/{role}', function (string $role) {
        $allowedRoles = array_map(
            fn (UserRole $role) => $role->value,
            UserRole::cases()
        );

        if (! in_array($role, $allowedRoles, true)) {
            abort(404);
        }

        $user = Auth::user();
        $userRole = $user->role ?? UserRole::VISITOR;

        if ($userRole->value !== $role) {
            abort(403, 'Dashboard ini tidak tersedia untuk role Anda.');
        }

        return Inertia::render('Dashboard', [
            'role' => $role,
        ]);
    })
        ->whereIn('role', array_map(
            fn (UserRole $role) => $role->value,
            UserRole::cases()
        ))
        ->name('dashboard.role');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

require __DIR__.'/auth.php';
