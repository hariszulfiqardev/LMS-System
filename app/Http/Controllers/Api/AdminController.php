<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\AdminResource;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;

class AdminController extends Controller
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

        $admins = User::where('role', '1')->orderBy($orderColumn, $orderDirection)
            ->paginate(10);

        return AdminResource::collection($admins);
    }

    public function store(StoreAdminRequest $request)
    {
        $admin = User::create($request->validated());

        return new AdminResource($admin);
    }

    public function show($id)
    {
        $user = User::find($id);
        return new AdminResource($user);
    }

    public function update($id, UpdateAdminRequest $request)
    {
        $user = User::find($id);

        $validatedData = $request->validated();

        if (array_key_exists('password', $validatedData) && is_null($validatedData['password'])) {
            unset($validatedData['password']);
        }

        $user->update($validatedData);

        return new AdminResource($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        $user->delete();

        return response()->noContent();
    }
}
