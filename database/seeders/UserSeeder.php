<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Admin
        User::factory(1)->create([
            'name' => 'Admin',
            'email' => 'admin@e-learning.com',
            'role' => 1
        ]);

        //Teacher
        User::factory(1)->create([
            'name' => 'Teacher',
            'email' => 'teacher@e-learning.com',
            'role' => 2
        ]);

        //Students
        User::factory(1)->create([
            'name' => 'Student',
            'email' => 'student@e-learning.com',
        ]);
        User::factory(10)->create();
    }
}
