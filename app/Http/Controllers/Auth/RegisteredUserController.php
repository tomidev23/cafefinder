<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cafe;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|in:visitor,owner',
            'cafe_name' => 'required_if:role,owner|string|max:255',
            'cafe_area' => 'required_if:role,owner|string|max:120',
            'cafe_address' => 'required_if:role,owner|string|max:500',
        ]);

        $role = $validated['role'] ?? 'visitor';

        $user = DB::transaction(function () use ($validated, $role): User {
            $cafe = null;

            if ($role === 'owner') {
                $cafe = Cafe::create([
                    'store_code' => $this->nextStoreCode(),
                    'name' => $validated['cafe_name'],
                    'slug' => Str::slug($validated['cafe_name']).'-'.Str::lower(Str::random(5)),
                    'area' => $validated['cafe_area'],
                    'address' => $validated['cafe_address'],
                    'latitude' => 1.132,
                    'longitude' => 104.04,
                    'image' => '/images/cafe-placeholder.svg',
                ]);
            }

            return User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $role,
                'store_code' => $cafe?->store_code,
                'email_verified_at' => now(),
            ]);
        });

        event(new Registered($user));

        Auth::login($user);

        $status = $user->store_code
            ? "Cafe berhasil didaftarkan. Kode gerai Anda: {$user->store_code}."
            : null;

        return redirect(route('dashboard.role', ['role' => $user->role], absolute: false))
            ->with('status', $status);
    }

    private function nextStoreCode(): string
    {
        do {
            $storeCode = 'CF-'.Str::upper(Str::random(6));
        } while (Cafe::query()->where('store_code', $storeCode)->exists());

        return $storeCode;
    }
}
