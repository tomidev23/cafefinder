<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CashierLoginController extends Controller
{
    /**
     * Authenticate a cashier using their store code, staff identity, and PIN.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'store_code' => ['required', 'string', 'max:30'],
            'staff' => ['required', 'string', 'max:255'],
            'pin' => ['required', 'digits:6'],
        ]);

        $staff = trim($validated['staff']);
        $storeCode = Str::upper(trim($validated['store_code']));
        $throttleKey = $this->throttleKey($staff, $request);

        $this->ensureIsNotRateLimited($request, $throttleKey);

        $cashier = User::query()
            ->where('role', 'cashier')
            ->where('store_code', $storeCode)
            ->where(function ($query) use ($staff) {
                $query->where('staff_code', $staff)
                    ->orWhere('email', Str::lower($staff));
            })
            ->first();

        if (! $cashier || ! $cashier->cashier_pin || ! Hash::check($validated['pin'], $cashier->cashier_pin)) {
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages([
                'pin' => 'PIN kasir tidak valid. Periksa kembali ID staff dan PIN Anda.',
            ]);
        }

        RateLimiter::clear($throttleKey);

        Auth::login($cashier);
        $request->session()->regenerate();

        return redirect()->intended(route('pos'));
    }

    /**
     * Ensure the cashier login request is not rate limited.
     */
    private function ensureIsNotRateLimited(Request $request, string $throttleKey): void
    {
        if (! RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return;
        }

        event(new Lockout($request));

        $seconds = RateLimiter::availableIn($throttleKey);

        throw ValidationException::withMessages([
            'pin' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Build a throttle key scoped to the staff identity and IP address.
     */
    private function throttleKey(string $staff, Request $request): string
    {
        return Str::transliterate(Str::lower($staff).'|'.$request->ip());
    }
}
