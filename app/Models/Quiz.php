<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'course_id',
        'date',
        'duration',
        'status'
    ];

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
