<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CashierStaffController extends Controller
{
    /**
     * Register a new cashier for the owner's POS terminal.
     */
    public function store(Request $request): RedirectResponse
    {
        $owner = $request->user();

        abort_unless($owner && $owner->role === 'owner', 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'pin' => ['required', 'digits:6'],
            'shift' => ['required', 'string', 'max:80'],
            'privileges' => ['nullable', 'array'],
            'privileges.*' => ['string', 'max:80'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::password(32)),
            'role' => 'cashier',
            'staff_code' => $this->nextStaffCode(),
            'store_code' => config('pos.store.code'),
            'cashier_pin' => Hash::make($validated['pin']),
            'phone' => $validated['phone'] ?? null,
            'shift' => $validated['shift'],
            'pos_permissions' => $validated['privileges'] ?? [],
            'email_verified_at' => now(),
        ]);

        return back()->with(
            'status',
            "Akses kasir untuk {$user->name} ({$user->staff_code}) berhasil dibuat.",
        );
    }

    /**
     * Generate the next available staff code for the POS team.
     */
    private function nextStaffCode(): string
    {
        $usedCodes = User::query()
            ->whereNotNull('staff_code')
            ->pluck('staff_code');

        $nextNumber = max(1, $usedCodes->count() + 1);

        do {
            $candidate = 'CSR-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
            $nextNumber++;
        } while ($usedCodes->contains($candidate));

        return $candidate;
    }

    /**
     * Delete a cashier staff by staff_code.
     */
    public function destroy(Request $request, string $staff_code): RedirectResponse
    {
        $owner = $request->user();

        abort_unless($owner && $owner->role === 'owner', 403);

        $cashier = User::query()
            ->where('role', 'cashier')
            ->where('store_code', config('pos.store.code'))
            ->where('staff_code', $staff_code)
            ->first();

        abort_unless($cashier, 404);

        // Prevent owner from deleting themselves (safety)
        abort_if($cashier->id === $owner->id, 403, 'Tidak dapat menghapus akun Anda sendiri.');

        $cashierName = $cashier->name;
        $cashier->delete();

        return back()->with(
            'status',
            "Akses kasir untuk {$cashierName} ({$staff_code}) berhasil dihapus.",
        );
    }
}
