<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CourseController extends Controller
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

        $courses = Course::when(request('search'), function (Builder $query) {
            $query->whereAny([
                    'name',
                    'category',
                ], 'LIKE', '%' . request('search') . '%');
        })->orderBy($orderColumn, $orderDirection)
        ->paginate(request('per_page', 10));

        return CourseResource::collection($courses);
    }

    public function store(StoreCourseRequest $request)
    {
        $course = Course::create($request->validated());

        return new CourseResource($course);
    }

    public function show($id)
    {
        $course = Course::find($id);
        return new CourseResource($course);
    }

    public function update($id, UpdateCourseRequest $request)
    {
        $course = Course::find($id);

        $course->update($request->validated());

        return new CourseResource($course);
    }

    public function destroy($id)
    {
        $course = Course::find($id);

        $course->delete();

        return response()->noContent();
    }
}
