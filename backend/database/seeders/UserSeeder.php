<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@planner.app'],
            [
                'name'                 => 'Admin User',
                'password'             => Hash::make('password'),
                'email_verified_at'    => now(),
            ]
        );
    }
}
