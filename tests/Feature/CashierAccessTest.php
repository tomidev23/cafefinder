<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CashierAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_cashier_can_sign_in_with_store_staff_code_and_pin(): void
    {
        $cashier = $this->createCashier();

        $response = $this->post(route('login.cashier'), [
            'store_code' => 'ART-88',
            'staff' => 'CSR-001',
            'pin' => '738291',
        ]);

        $this->assertAuthenticatedAs($cashier);
        $response->assertRedirect(route('pos'));
    }

    public function test_cashier_login_rejects_an_invalid_pin(): void
    {
        $this->createCashier();

        $response = $this->post(route('login.cashier'), [
            'store_code' => 'ART-88',
            'staff' => 'CSR-001',
            'pin' => '000000',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('pin');
    }

    public function test_owner_can_register_a_cashier_who_can_then_access_pos(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $response = $this->actingAs($owner)
            ->from('/dashboard/owner?view=cashierStaff')
            ->post(route('owner.cashiers.store'), [
                'name' => 'Nadia Savira',
                'email' => 'nadia@artisanroastery.id',
                'phone' => '081234567890',
                'pin' => '529104',
                'shift' => 'Sore (15.00 – 23.00)',
                'privileges' => ['transactions', 'receipt'],
            ]);

        $response->assertRedirect('/dashboard/owner?view=cashierStaff');

        $cashier = User::query()
            ->where('email', 'nadia@artisanroastery.id')
            ->firstOrFail();

        $this->assertSame('cashier', $cashier->role);
        $this->assertSame('ART-88', $cashier->store_code);
        $this->assertNotNull($cashier->staff_code);
        $this->assertTrue(Hash::check('529104', $cashier->cashier_pin));
        $this->assertSame(['transactions', 'receipt'], $cashier->pos_permissions);

        $this->post(route('logout'));
        $this->assertGuest();

        $this->post(route('login.cashier'), [
            'store_code' => 'ART-88',
            'staff' => $cashier->staff_code,
            'pin' => '529104',
        ])->assertRedirect(route('pos'));

        $this->assertAuthenticatedAs($cashier);
    }

    public function test_non_owner_cannot_register_a_cashier(): void
    {
        $visitor = User::factory()->create(['role' => 'visitor']);

        $this->actingAs($visitor)
            ->post(route('owner.cashiers.store'), [
                'name' => 'Tidak Berhak',
                'email' => 'tidak-berhak@example.com',
                'pin' => '123456',
                'shift' => 'Pagi (07.00 – 15.00)',
            ])
            ->assertForbidden();
    }

    private function createCashier(): User
    {
        return User::factory()->create([
            'role' => 'cashier',
            'staff_code' => 'CSR-001',
            'store_code' => 'ART-88',
            'cashier_pin' => Hash::make('738291'),
            'shift' => 'Pagi (07.00 – 15.00)',
        ]);
    }
}
