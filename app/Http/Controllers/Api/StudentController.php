<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\CourseDetailResource;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\UserCourse;

class StudentController extends Controller
{
    public function index()
    {
        $orderColumn = request('order_column', 'created_at');
        if (!in_array($orderColumn, ['id', 'name', 'created_at'])) {
            $orderColumn = 'created_at';
        }
        $orderDirection = request('order_direction', 'desc');
        if (!in_array($orderDirection, ['asc', 'desc'])) {
            $orderDirection = 'desc';
        }

        $students = User::where('role', '0')->orderBy($orderColumn, $orderDirection)
            ->paginate(10);

        return StudentResource::collection($students);
    }

    public function store(StoreStudentRequest $request)
    {
        $student = User::create($request->validated());

        return new StudentResource($student);
    }

    public function show($id)
    {
        $user = User::find($id);
        return new StudentResource($user);
    }

    public function update($id, UpdateStudentRequest $request)
    {
        $user = User::find($id);

        $validatedData = $request->validated();

        if (array_key_exists('password', $validatedData) && is_null($validatedData['password'])) {
            unset($validatedData['password']);
        }

        $user->update($validatedData);

        return new StudentResource($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        $user->delete();

        return response()->noContent();
    }

    public function enroll(Course $course)
    {
        UserCourse::firstOrCreate([
            'user_id' => auth()->id(),
            'course_id' => $course->id
        ]);

        return response()->noContent();
    }

    public function enrolledCourses()
    {
        return CourseResource::collection(auth()->user()->enrolledCourses);
    }

    public function enrolledCourseDetail(Course $course)
    {
        $enrolledCourse = auth()->user()->enrolledCourses->where('id', $course->id)->first();

        if (!$enrolledCourse) {
            return response()->json([
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        return CourseDetailResource::make($enrolledCourse);
    }

    public function startQuiz(Quiz $quiz)
    {
        QuizAttempt::firstOrCreate([
            'user_id' => auth()->id(),
            'quiz_id' => $quiz->id,
            'course_title' => $quiz->course?->name,
            'quiz_title' => $quiz->title,
            'duration' => $quiz->duration,
            'total_questions' => $quiz->questions?->count(),
        ]);

        return response()->json([
            'status' => true
        ]);
    }

    public function submitQuiz(Quiz $quiz, Request $request)
    {
        $correct_questions = 0;
        foreach ($request->answers as $key => $value) {
            $quiz_question = QuizQuestion::find($key);
            if ($quiz_question) {
                if ($quiz_question->correct_option_id == $value) {
                    $correct_questions++;
                }
            }
        }

        $quiz_attempt = QuizAttempt::where('user_id', auth()->id())->where('quiz_id', $quiz->id)->first();

        if ($quiz_attempt) {
            $quiz_attempt->update([
                'status' => 'Completed',
                'correct_questions' => $correct_questions,
                'score' => ($correct_questions * 100) / $quiz->questions?->count()
            ]);
        }

        return response()->json([
            'status' => true
        ]);
    }
}
