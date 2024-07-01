<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return [
            'count' => [
                'admins' => User::where('role', 1)->count(),
                'teachers' => User::where('role', 2)->count(),
                'students' => User::where('role', 0)->count(),
                'courses' => Course::count(),
            ],
        ];
    }
}
