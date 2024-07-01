<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = collect(require storage_path('data/courses.php'));

        foreach ($data as $key => $value) {
            Course::factory()->create([
                'name' => $value['name'],
                'category' => $value['category'],
                'teacher_id' => $value['teacher_id'],
                'is_paid' => $value['is_paid'],
                'price' => $value['price'],
            ]);
        }
    }
}
