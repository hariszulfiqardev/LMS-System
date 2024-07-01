<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'teacher_id',
        'is_paid',
        'price',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class)->where('role', 2);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
