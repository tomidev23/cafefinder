<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoPosSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the demo owner and POS cashier accounts.
     */
    public function run(): void
    {
        $permissions = [
            'transactions',
            'discounts',
            'void',
            'cash_drawer',
            'reports',
            'receipt',
        ];

        $cashiers = [
            [
                'name' => 'Sarah Nurhaliza',
                'email' => 'sarah@artisanroastery.id',
                'phone' => '081288992211',
                'staff_code' => 'CSR-001',
                'pin' => '738291',
                'shift' => 'Pagi (07.00 – 15.00)',
            ],
            [
                'name' => 'Bimo Prakoso',
                'email' => 'bimo@artisanroastery.id',
                'phone' => '081377881122',
                'staff_code' => 'CSR-002',
                'pin' => '462810',
                'shift' => 'Sore (15.00 – 23.00)',
            ],
            [
                'name' => 'Anisa Maharani',
                'email' => 'anisa@artisanroastery.id',
                'phone' => '081955667788',
                'staff_code' => 'CSR-003',
                'pin' => '815204',
                'shift' => 'Sore (15.00 – 23.00)',
            ],
            [
                'name' => 'Dimas Kurniawan',
                'email' => 'dimas@artisanroastery.id',
                'phone' => '081233445566',
                'staff_code' => 'CSR-004',
                'pin' => '304917',
                'shift' => 'Pagi (07.00 – 15.00)',
            ],
            [
                'name' => 'Fajar Ramadhan',
                'email' => 'fajar@artisanroastery.id',
                'phone' => '081800112233',
                'staff_code' => 'CSR-005',
                'pin' => '692431',
                'shift' => 'Sore (15.00 – 23.00)',
            ],
            [
                'name' => 'Rian Prasetyo',
                'email' => 'rian@artisanroastery.id',
                'phone' => '081388776655',
                'staff_code' => 'CSR-006',
                'pin' => '529104',
                'shift' => 'Pagi (07.00 – 15.00)',
            ],
        ];

        User::query()->updateOrCreate(
            ['email' => 'owner@cafefinder.test'],
            [
                'name' => 'Rina Wijaya',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'email_verified_at' => now(),
            ],
        );

        foreach ($cashiers as $cashier) {
            User::query()->updateOrCreate(
                ['email' => $cashier['email']],
                [
                    'name' => $cashier['name'],
                    'password' => Hash::make(Str::password(32)),
                    'role' => 'cashier',
                    'staff_code' => $cashier['staff_code'],
                    'store_code' => config('pos.store.code'),
                    'cashier_pin' => Hash::make($cashier['pin']),
                    'phone' => $cashier['phone'],
                    'shift' => $cashier['shift'],
                    'pos_permissions' => $permissions,
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
