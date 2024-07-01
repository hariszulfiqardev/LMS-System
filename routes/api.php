<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\QuizController;

Route::get('/get-courses', [CourseController::class, 'index']);
Route::apiResource('students', StudentController::class);

Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get('/stats', [DashboardController::class, 'stats']);

    Route::get('/user', function (Request $request) {
        return [
            'user' => $request->user(),
            'token' => $request->bearerToken(),
        ];
    });

    Route::apiResource('admins', AdminController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('courses', CourseController::class);

    Route::get('/teachers-list', [TeacherController::class, 'list']);
    Route::post('/enroll-course/{course}', [StudentController::class, 'enroll']);
    Route::post('/make-payment', [PaymentController::class, 'makePayment']);

    Route::get('/student-enrolled-courses', [StudentController::class, 'enrolledCourses']);
    Route::get('/student-enrolled-course-detail/{course}', [StudentController::class, 'enrolledCourseDetail']);
    Route::post('/student/start-quiz/{quiz}', [StudentController::class, 'startQuiz']);
    Route::post('/student/submit-quiz/{quiz}', [StudentController::class, 'submitQuiz']);

    Route::get('/teacher-courses', [TeacherController::class, 'courses']);
    Route::get('/teacher-course-detail/{course}', [TeacherController::class, 'courseDetail']);
    Route::post('/quizzes', [QuizController::class, 'store']);
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::post('/accept-quiz/{quiz}', [QuizController::class, 'accept']);
    Route::post('/reject-quiz/{quiz}', [QuizController::class, 'reject']);
    Route::get('/quiz-detail/{quiz}', [QuizController::class, 'detail']);
    Route::get('/user-generate-report/{user}', [QuizController::class, 'generateReport']);

});
