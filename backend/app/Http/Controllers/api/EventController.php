<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class EventController extends Controller
{
    /**
     * GET /api/events?year=2026&month=4
     * Returns all events for the given month, grouped by date.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'year'  => ['required', 'integer', 'min:2000', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        $events = $request->user()
            ->events()
            ->with('groceryList.items')
            ->forMonth($request->year, $request->month)
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        // Group by date string for easy calendar rendering
        $grouped = $events->groupBy(fn($e) => $e->date->toDateString());

        return response()->json($grouped);
    }

    /**
     * GET /api/events/upcoming?days=7
     * Returns upcoming events within N days (for dashboard widget).
     */
    public function upcoming(Request $request): JsonResponse
    {
        $days = $request->integer('days', 7);

        $events = $request->user()
            ->events()
            ->where('date', '>=', now()->toDateString())
            ->where('date', '<=', now()->addDays($days)->toDateString())
            ->where('is_completed', false)
            ->orderBy('date')
            ->orderBy('time')
            ->limit(20)
            ->get();

        return response()->json($events);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'              => ['required', 'string', 'max:255'],
            'type'               => ['required', 'in:grocery,bill,income,task'],
            'date'               => ['required', 'date'],
            'time'               => ['nullable', 'date_format:H:i'],
            'all_day'            => ['boolean'],
            'repeat'             => ['in:none,daily,weekly,monthly,yearly'],
            'repeat_until'       => ['nullable', 'date', 'after:date'],
            'notes'              => ['nullable', 'string', 'max:2000'],
            'remind_days_before' => ['integer', 'min:0', 'max:30'],
            'color'              => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'bill_id'            => ['nullable', 'exists:bills,id'],
        ]);

        $event = $request->user()->events()->create($data);

        return response()->json($event->load('groceryList.items'), 201);
    }

    public function show(Request $request, Event $event): JsonResponse
    {
        $this->authorize('view', $event);

        return response()->json($event->load('groceryList.items', 'bill'));
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $this->authorize('update', $event);

        $data = $request->validate([
            'title'              => ['sometimes', 'string', 'max:255'],
            'type'               => ['sometimes', 'in:grocery,bill,income,task'],
            'date'               => ['sometimes', 'date'],
            'time'               => ['nullable', 'date_format:H:i'],
            'all_day'            => ['boolean'],
            'repeat'             => ['sometimes', 'in:none,daily,weekly,monthly,yearly'],
            'repeat_until'       => ['nullable', 'date'],
            'notes'              => ['nullable', 'string', 'max:2000'],
            'remind_days_before' => ['integer', 'min:0', 'max:30'],
            'color'              => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'is_completed'       => ['boolean'],
        ]);

        $event->update($data);

        return response()->json($event->fresh()->load('groceryList.items'));
    }

    public function destroy(Request $request, Event $event): JsonResponse
    {
        $this->authorize('delete', $event);
        $event->delete();

        return response()->json(null, 204);
    }

    public function complete(Request $request, Event $event): JsonResponse
    {
        $this->authorize('update', $event);
        $event->update(['is_completed' => true]);

        return response()->json($event->fresh());
    }
}
