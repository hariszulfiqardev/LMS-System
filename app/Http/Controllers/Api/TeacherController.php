<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Http\Resources\CourseDetailResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\TeacherListResource;
use App\Http\Resources\TeacherResource;
use App\Mail\TeacherPasswordUpdate;
use App\Mail\WelcomeTeacher;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TeacherController extends Controller
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

        $teachers = User::where('role', '2')->orderBy($orderColumn, $orderDirection)
            ->paginate(10);

        return TeacherResource::collection($teachers);
    }

    public function store(StoreTeacherRequest $request)
    {
        $validatedData = $request->validated();

        $teacher = User::create($request->validated());

        //send email
        Mail::to($teacher->email)->send(new WelcomeTeacher([
            'name' => $teacher->name,
            'password' => $validatedData['password']
        ]));

        return new TeacherResource($teacher);
    }

    public function show($id)
    {
        $user = User::find($id);
        return new TeacherResource($user);
    }

    public function update($id, UpdateTeacherRequest $request)
    {
        $user = User::find($id);

        $validatedData = $request->validated();

        if (array_key_exists('password', $validatedData) && is_null($validatedData['password'])) {
            unset($validatedData['password']);
        }
        else if (array_key_exists('password', $validatedData) && !is_null($validatedData['password'])) {
            //send email
            Mail::to($user->email)->send(new TeacherPasswordUpdate([
                'name' => $user->name,
                'password' => $validatedData['password']
            ]));
        }

        $user->update($validatedData);

        return new TeacherResource($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        $user->delete();

        return response()->noContent();
    }

    public function list()
    {
        return TeacherListResource::collection(User::where('role', '2')->get());
    }

    public function courses()
    {
        return CourseResource::collection(auth()->user()->courses);
    }

    public function courseDetail(Course $course)
    {
        $enrolledCourse = auth()->user()->courses->where('id', $course->id)->first();

        if (!$enrolledCourse) {
            return response()->json([
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        return CourseDetailResource::make($enrolledCourse);
    }
}
