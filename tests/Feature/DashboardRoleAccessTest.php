<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardRoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_user_can_only_access_owner_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'owner',
        ]);

        $this->actingAs($user)
            ->get(route('dashboard.role', ['role' => 'owner']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Dashboard')
                ->where('role', 'owner'));

        $this->actingAs($user)
            ->from(route('dashboard.role', ['role' => 'owner']))
            ->get(route('dashboard.role', ['role' => 'admin']))
            ->assertForbidden();
    }
}
