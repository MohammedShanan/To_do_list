<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */public function index()
{
    $tasks = Task::latest()->get();
    return response()->json($tasks, 200);
}

    /**
     * Store a newly created resource in storage.
     */public function store(Request $request)
{
    $request->validate([
        'title' => ['required', 'max:255'],
    ]);

    $task = Task::create([
        'title' => $request->title
    ]);

    return response()->json($task, 201);
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate(['title' => ['required', 'max:255']]);
        $status = $request->has('status') ? $request->status : false;

        // Update the task with the title and status
        $task->update([
            'title' => $request->title,
            'status' => $status,
        ]);
        return response()->json($task, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task has been successfully deleted'], 200);
    }
}
