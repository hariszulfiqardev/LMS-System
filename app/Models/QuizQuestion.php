<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question',
        'correct_option_id'
    ];

    public function options()
    {
        return $this->hasMany(QuestionOption::class, 'quiz_question_id', 'id');
    }

}
