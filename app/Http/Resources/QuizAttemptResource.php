<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizAttemptResource extends JsonResource
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
            'quiz_id' => $this->quiz_id,
            'score' => $this->score,
            'status' => $this->status,
            'correct_questions' => $this->correct_questions,
            'user' => [
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'id' => $this->user?->id
            ]
        ];
    }
}
