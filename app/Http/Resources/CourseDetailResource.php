<?php

namespace App\Http\Resources;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseDetailResource extends JsonResource
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
            'quizzes' => auth()->user()->role == 2 ? [
                'Pending' => QuizResource::collection(Quiz::where('course_id', $this->id)->where('status', 'Pending')->get()),
                'Rejected' => QuizResource::collection(Quiz::where('course_id', $this->id)->where('status', 'Rejected')->get()),
                'Upcoming' => QuizResource::collection(Quiz::where('course_id', $this->id)->where('status', 'Active')
                    ->where('date', '>=', date('Y-m-d'))->get()),
                'Past' => QuizResource::collection(Quiz::where('course_id', $this->id)->where('status', 'Active')
                    ->where('date', '<', date('Y-m-d'))->get()),
            ] : [],
            'student_quizzes' => auth()->user()->role == 0 ? [
                'Upcoming' => QuizResource::collection(Quiz::where('course_id', $this->id)->where('status', 'Active')
                    ->where('date', '>=', date('Y-m-d'))->get()),
                'Past' => QuizResource::collection(Quiz::where('course_id', $this->id)->where('status', 'Active')
                    ->where('date', '<', date('Y-m-d'))->get()),
            ] : []
        ];
    }
}
