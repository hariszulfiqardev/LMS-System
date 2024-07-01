<?php

namespace App\Http\Resources;

use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
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
            'title' => $this->title,
            'date' => $this->date,
            'duration' => $this->duration,
            'status' => $this->status,
            'created_at' => $this->created_at->toDateString(),
            'course_id' => $this->course_id,
            'course' => [
                'name' => $this->course?->name ?? '-',
            ],
            'questions' => QuizQuestionResource::collection($this->questions),
            'student_attempt' => auth()->user()->role == 0 ? QuizAttemptResource::make(QuizAttempt::where('user_id', auth()->id())->where('quiz_id', $this->id)->get()->first()) : null,
            'attempts' => auth()->user()->role != 0 ? QuizAttemptResource::collection(QuizAttempt::where('quiz_id', $this->id)->get()) : null
        ];
    }
}
