<?php

namespace App\Http\Controllers\Api;

use App\Exports\UserQuizReportExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class QuizController extends Controller
{
    public function store(StoreQuizRequest $request)
    {
        $enrolledCourse = auth()->user()->courses->where('id', $request->validated('course_id'))->first();

        if (!$enrolledCourse) {
            return response()->json([
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        $quiz = Quiz::create([
            'course_id' => $request->validated('course_id'),
            'title' => $request->validated('title'),
            'date' => $request->validated('date'),
            'duration' => $request->validated('duration'),
        ]);

        foreach ($request->validated('mcqs') as $key => $value) {
            $question = QuizQuestion::create([
                'question' => $value['question'],
                'quiz_id' => $quiz->id,
            ]);

            foreach ($value['options'] as $key2 => $option) {
                $is_correct = $value['correctOption'] === $key2 ? 1 : 0;
                $option = QuestionOption::create([
                    'quiz_question_id' => $question->id,
                    'option' => $option['text'],
                    'is_correct' => $is_correct,
                ]);
                if ($is_correct) {
                    $question->correct_option_id = $option->id;
                    $question->save();
                }
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Quiz created successfully'
        ], 200);
    }

    public function index()
    {
        $orderColumn = request('order_column', 'created_at');
        if (!in_array($orderColumn, ['id', 'title', 'created_at'])) {
            $orderColumn = 'created_at';
        }
        $orderDirection = request('order_direction', 'desc');
        if (!in_array($orderDirection, ['asc', 'desc'])) {
            $orderDirection = 'desc';
        }

        $quizzes = Quiz::when(request('search'), function (Builder $query) {
            $query->whereAny([
                    'name',
                ], 'LIKE', '%' . request('search') . '%');
        })
        ->when(request('status'), function (Builder $query) {
            $query->where('status', request('status'));
        })
        ->orderBy($orderColumn, $orderDirection)
        ->paginate(request('per_page', 10));

        return QuizResource::collection($quizzes);
    }

    public function accept(Quiz $quiz)
    {
        $quiz->status = 'Active';
        $quiz->save();

        return response()->json([
            'status' => true,
            'message' => 'Quiz accepted successfully'
        ], 200);
    }

    public function reject(Quiz $quiz)
    {
        $quiz->status = 'Rejected';
        $quiz->save();

        return response()->json([
            'status' => true,
            'message' => 'Quiz rejected successfully'
        ], 200);
    }

    public function detail(Quiz $quiz)
    {
        return QuizResource::make($quiz);
    }

    public function generateReport(User $user)
    {
        return Excel::download(new UserQuizReportExport($user->id), 'quiz_report_' . $user->name . '.xlsx');
    }
}
