<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'is_paid' => $this->is_paid,
            'price' => $this->price,
            'created_at' => $this->created_at->toDateString(),
            'teacher_id' => $this->teacher_id,
            'teacher' => [
                'name' => $this->teacher?->name ?? '-',
            ],
            'is_enrolled' => auth()->check() && auth()->user()->enrolledCourses->contains('id', $this->id)
        ];
    }
}
