<?php

use App\Models\QuizAttempt;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::call(function () {
    $attempts = QuizAttempt::where('status', 'Started')->get();

    foreach ($attempts as $attempt) {
        $currentDateTime = Carbon::now();
        $attemptDuration = $attempt->duration; // in minutes
        $allowedTime = $attemptDuration + 2; // duration + 2 minutes grace period

        // Calculate the difference in minutes between created_at and current time
        $elapsedTime = abs($currentDateTime->diffInMinutes($attempt->created_at));

        if ($elapsedTime > $allowedTime) {
            // Mark the attempt as Completed
            $attempt->status = 'Completed';
            $attempt->save();
        }
    }
})->everyFiveSeconds();
